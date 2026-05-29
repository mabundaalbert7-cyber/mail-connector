'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  collection, addDoc, query, where, orderBy,
  onSnapshot, serverTimestamp, doc, getDoc, setDoc
} from 'firebase/firestore'

export default function Messages() {
  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [threads, setThreads] = useState<any[]>([])
  const [activeThread, setActiveThread] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push('/'); return }
      setCurrentUser(u)
      const snap = await getDoc(doc(db, 'users', u.uid))
      if (!snap.exists()) { router.push('/setup'); return }
      setProfile(snap.data())
      loadThreads(u.uid)
    })
    return () => unsub()
  }, [])

  const loadThreads = (uid: string) => {
    const q = query(collection(db, 'threads'), where('members', 'array-contains', uid))
    onSnapshot(q, async (snap) => {
      const list = await Promise.all(snap.docs.map(async (d) => {
        const data = d.data()
        const otherId = data.members.find((m: string) => m !== uid)
        const otherSnap = await getDoc(doc(db, 'users', otherId))
        return { id: d.id, ...data, other: otherSnap.data() }
      }))
      setThreads(list)
    })
  }

  const openThread = (thread: any) => {
    setActiveThread(thread)
    const q = query(
      collection(db, 'threads', thread.id, 'messages'),
      orderBy('createdAt', 'asc')
    )
    onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    })
  }

  const sendMessage = async () => {
    if (!text.trim() || !activeThread || sending) return
    setSending(true)
    try {
      await addDoc(collection(db, 'threads', activeThread.id, 'messages'), {
        text: text.trim(),
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
      })
      setText('')
    } finally {
      setSending(false)
    }
  }

  const getInitials = (fname: string, lname: string) =>
    `${fname?.[0] ?? ''}${lname?.[0] ?? ''}`.toUpperCase()

  const formatTime = (ts: any) => {
    if (!ts) return ''
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-white flex flex-col">

      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center text-sm">✉</div>
          <span className="font-medium">MailConnector</span>
        </div>
        <button onClick={() => router.push('/dashboard')}
          className="text-slate-400 text-sm border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5">
          ← Dashboard
        </button>
      </div>

      <div className="flex flex-1 max-w-4xl mx-auto w-full">

        {/* Thread list */}
        <div className="w-64 border-r border-white/5 flex flex-col">
          <div className="p-4 border-b border-white/5">
            <p className="text-sm font-medium mb-3">Messages</p>
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
              <span className="text-slate-500 text-sm">🔍</span>
              <input type="text" placeholder="Search..."
                className="bg-transparent outline-none text-xs text-white placeholder-slate-500 flex-1" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {threads.length === 0 ? (
              <p className="text-xs text-slate-500 text-center mt-8 px-4">
                No messages yet. Send a letter from the dashboard!
              </p>
            ) : threads.map(thread => (
              <div key={thread.id} onClick={() => openThread(thread)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-white/4 hover:bg-white/4 transition-all ${
                  activeThread?.id === thread.id ? 'bg-orange-500/8 border-l-2 border-l-orange-500' : ''
                }`}>
                <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {thread.other ? getInitials(thread.other.fname, thread.other.lname) : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{thread.other?.fname} {thread.other?.lname}</p>
                  <p className="text-xs text-slate-500 truncate">📍 {thread.other?.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {activeThread ? (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-sm font-medium">
                {getInitials(activeThread.other?.fname, activeThread.other?.lname)}
              </div>
              <div>
                <p className="text-sm font-medium">{activeThread.other?.fname} {activeThread.other?.lname}</p>
                <p className="text-xs text-green-400">● Online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 min-h-0" style={{ maxHeight: 'calc(100vh - 220px)' }}>
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 py-16">
                  <p className="text-3xl">✉</p>
                  <p className="text-slate-400 text-sm">Start the conversation!</p>
                  <p className="text-slate-600 text-xs">Write your first letter below</p>
                </div>
              ) : messages.map(msg => (
                <div key={msg.id}
                  className={`flex flex-col max-w-xs ${
                    msg.senderId === currentUser?.uid ? 'self-end items-end' : 'self-start items-start'
                  }`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.senderId === currentUser?.uid
                      ? 'bg-orange-600 text-white rounded-br-sm'
                      : 'bg-slate-800 text-slate-200 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-xs text-slate-600 mt-1">{formatTime(msg.createdAt)}</span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="px-5 py-4 border-t border-white/5">
              <div className="flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Write your letter..."
                  rows={1}
                  className="bg-transparent outline-none text-sm text-white placeholder-slate-500 flex-1 resize-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim() || sending}
                  className="w-8 h-8 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 rounded-lg flex items-center justify-center text-white text-sm transition-all flex-shrink-0"
                >
                  →
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-2 text-center">
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col gap-3">
            <p className="text-4xl">✉</p>
            <p className="text-slate-400 font-medium">Select a conversation</p>
            <p className="text-slate-600 text-sm">Or go to dashboard to send your first letter</p>
          </div>
        )}
      </div>
    </div>
  )
}
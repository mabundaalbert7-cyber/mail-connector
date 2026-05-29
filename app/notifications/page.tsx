'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  collection, query, where, orderBy,
  onSnapshot, doc, updateDoc, getDoc, setDoc
} from 'firebase/firestore'

export default function Notifications() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push('/'); return }
      setCurrentUser(u)

      const q = query(
        collection(db, 'notifications'),
        where('toUid', '==', u.uid),
        orderBy('createdAt', 'desc')
      )

      onSnapshot(q, async (snap) => {
        const list = await Promise.all(snap.docs.map(async (d) => {
          const data = d.data()
          const fromSnap = await getDoc(doc(db, 'users', data.fromUid))
          return { id: d.id, ...data, from: fromSnap.data() }
        }))
        setNotifications(list)
        setLoading(false)
      })
    })
    return () => unsub()
  }, [])

  const markRead = async (notifId: string) => {
    await updateDoc(doc(db, 'notifications', notifId), { read: true })
  }

  const handleNotifClick = async (notif: any) => {
    await markRead(notif.id)
    if (notif.type === 'like') {
      router.push(`/profile/${notif.fromUid}`)
    } else if (notif.type === 'message') {
      const threadId = [currentUser.uid, notif.fromUid].sort().join('_')
      await setDoc(doc(db, 'threads', threadId), {
        members: [currentUser.uid, notif.fromUid],
        createdAt: new Date().toISOString(),
      }, { merge: true })
      router.push('/messages')
    }
  }

  const getInitials = (fname: string, lname: string) =>
    `${fname?.[0] ?? ''}${lname?.[0] ?? ''}`.toUpperCase()

  const formatTime = (ts: string) => {
    if (!ts) return ''
    const d = new Date(ts)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-[#080c14] text-white">

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

      <div className="max-w-lg mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-medium">Notifications</h1>
            <p className="text-slate-500 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-xs font-medium">
              {unreadCount}
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-slate-500 text-sm text-center py-16">Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-slate-400 font-medium">No notifications yet</p>
            <p className="text-slate-600 text-sm mt-1">When someone likes or messages you, it shows here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:border-orange-500/30 ${
                  notif.read
                    ? 'bg-[#111827] border-white/5'
                    : 'bg-[#111827] border-orange-500/20'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center font-medium text-sm overflow-hidden">
                    {notif.from?.photoURL
                      ? <img src={notif.from.photoURL} className="w-full h-full object-cover" alt="" />
                      : getInitials(notif.from?.fname, notif.from?.lname)
                    }
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    notif.type === 'like' ? 'bg-red-500' : 'bg-orange-600'
                  }`}>
                    {notif.type === 'like' ? '♥' : '✉'}
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {notif.from?.fname} {notif.from?.lname}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {notif.type === 'like'
                      ? '❤️ liked your profile'
                      : '✉ sent you a letter'
                    }
                  </p>
                </div>

                {/* Time + unread dot */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-600">{formatTime(notif.createdAt)}</span>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
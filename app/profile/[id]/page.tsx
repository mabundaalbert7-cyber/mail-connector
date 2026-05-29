'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { auth, db } from '../../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  doc, getDoc, setDoc, deleteDoc, collection,
  query, where, getDocs
} from 'firebase/firestore'

export default function ProfileView() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [member, setMember] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push('/'); return }
      setCurrentUser(u)

      const memberSnap = await getDoc(doc(db, 'users', id))
      if (!memberSnap.exists()) { router.push('/dashboard'); return }
      setMember(memberSnap.data())

      const likeSnap = await getDoc(doc(db, 'likes', `${u.uid}_${id}`))
      setLiked(likeSnap.exists())
      setLoading(false)
    })
    return () => unsub()
  }, [id])

  const toggleLike = async () => {
    if (!currentUser) return
    const likeId = `${currentUser.uid}_${id}`
    if (liked) {
      await deleteDoc(doc(db, 'likes', likeId))
      setLiked(false)
    } else {
      await setDoc(doc(db, 'likes', likeId), {
        fromUid: currentUser.uid,
        toUid: id,
        createdAt: new Date().toISOString(),
      })
      await setDoc(doc(db, 'notifications', `${id}_like_${currentUser.uid}`), {
        toUid: id,
        fromUid: currentUser.uid,
        type: 'like',
        read: false,
        createdAt: new Date().toISOString(),
      })
      setLiked(true)
    }
  }

  const startConversation = async () => {
    if (!currentUser) return
    const threadId = [currentUser.uid, id].sort().join('_')
    await setDoc(doc(db, 'threads', threadId), {
      members: [currentUser.uid, id],
      createdAt: new Date().toISOString(),
    }, { merge: true })
    await setDoc(doc(db, 'notifications', `${id}_msg_${currentUser.uid}`), {
      toUid: id,
      fromUid: currentUser.uid,
      type: 'message',
      read: false,
      createdAt: new Date().toISOString(),
    })
    router.push('/messages')
  }

  const getInitials = (fname: string, lname: string) =>
    `${fname?.[0] ?? ''}${lname?.[0] ?? ''}`.toUpperCase()

  if (loading) return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
      <p className="text-slate-500">Loading profile...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#080c14] text-white">

      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center text-sm">✉</div>
          <span className="font-medium">MailConnector</span>
        </div>
        <button onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-slate-400 text-sm border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5">
          ← Back to browse
        </button>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Profile header */}
        <div className="flex gap-5 mb-6">
          <div className="w-24 h-24 rounded-2xl bg-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {member?.photoURL
              ? <img src={member.photoURL} className="w-full h-full object-cover" alt={member.fname} />
              : <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-orange-600">
                  {getInitials(member?.fname, member?.lname)}
                </div>
            }
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-green-400">Online now</span>
            </div>
            <p className="text-xl font-medium mb-1">{member?.fname} {member?.lname}, {member?.age}</p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
              <span>📍 {member?.city}</span>
              <span>💼 {member?.looking}</span>
              <span>👤 {member?.gender}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleLike}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg transition-all ${
                  liked
                    ? 'bg-orange-600 border-orange-600'
                    : 'bg-orange-500/10 border-orange-500/25 hover:bg-orange-500/20'
                }`}
              >
                {liked ? '❤️' : '♡'}
              </button>
              <button onClick={startConversation}
                className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition-all flex items-center gap-2">
                ✉ Send letter
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-[#111827] border border-white/7 rounded-2xl p-5 mb-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">About</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            {member?.bio || 'No bio yet.'}
          </p>
        </div>

        {/* Interests */}
        <div className="bg-[#111827] border border-white/7 rounded-2xl p-5 mb-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Interests</p>
          <div className="flex flex-wrap gap-2">
            {member?.interests?.map((tag: string) => (
              <span key={tag} className="bg-white/5 text-slate-400 text-xs px-3 py-1.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="bg-[#111827] border border-white/7 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Details</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['City', member?.city],
              ['Age', `${member?.age} years old`],
              ['Looking for', member?.looking],
              ['Gender', member?.gender],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className="text-sm text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
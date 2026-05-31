'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, getDocs, doc, getDoc, setDoc, query, where, onSnapshot } from 'firebase/firestore'

export default function Dashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Everyone')
  const [unread, setUnread] = useState(0)

  const filters = ['Everyone', 'Near me', 'Women', 'Men', 'Relationship', 'Friendship', 'Pen pal']

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push('/'); return }
      setCurrentUser(u)

      const profileSnap = await getDoc(doc(db, 'users', u.uid))
      if (!profileSnap.exists()) { router.push('/setup'); return }
      setProfile(profileSnap.data())

      const snap = await getDocs(collection(db, 'users'))
      const all = snap.docs.map(d => d.data()).filter(d => d.uid !== u.uid)
      setMembers(all)
      setFiltered(all)

      const nq = query(
        collection(db, 'notifications'),
        where('toUid', '==', u.uid),
        where('read', '==', false)
      )
      onSnapshot(nq, snap => setUnread(snap.docs.length))
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    let result = [...members]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(m =>
        m.fname?.toLowerCase().includes(q) ||
        m.city?.toLowerCase().includes(q) ||
        m.interests?.some((i: string) => i.toLowerCase().includes(q))
      )
    }
    if (activeFilter === 'Women') result = result.filter(m => m.gender === 'Woman')
    else if (activeFilter === 'Men') result = result.filter(m => m.gender === 'Man')
    else if (activeFilter === 'Near me') result = result.filter(m => m.city === profile?.city)
    else if (activeFilter === 'Relationship') result = result.filter(m => m.looking === 'A relationship')
    else if (activeFilter === 'Friendship') result = result.filter(m => m.looking === 'Friendship')
    else if (activeFilter === 'Pen pal') result = result.filter(m => m.looking === 'Pen pal')
    setFiltered(result)
  }, [search, activeFilter, members])

  const getInitials = (fname: string, lname: string) =>
    `${fname?.[0] ?? ''}${lname?.[0] ?? ''}`.toUpperCase()

  const featured = filtered[0]
  const rest = filtered.slice(1)

  const getHour = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const startConversation = async (member: any) => {
    if (!currentUser) return
    const threadId = [currentUser.uid, member.uid].sort().join('_')
    await setDoc(doc(db, 'threads', threadId), {
      members: [currentUser.uid, member.uid],
      createdAt: new Date().toISOString(),
    }, { merge: true })
    router.push('/messages')
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-white">

      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center text-sm">✉</div>
          <span className="font-medium">MailConnector</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/notifications')}
            className="relative text-slate-400 text-sm border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5">
            🔔
            {unread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-600 rounded-full text-xs flex items-center justify-center text-white">
                {unread}
              </span>
            )}
          </button>
          <button
            onClick={() => router.push('/messages')}
            className="text-slate-400 text-sm border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5">
            ✉ Messages
          </button>
          <button
            onClick={() => router.push('/setup')}
            className="text-slate-400 text-sm border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5">
            Edit profile
          </button>
          <button
            onClick={async () => { await signOut(auth); router.push('/') }}
            className="text-slate-400 text-sm border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5">
            Logout
          </button>
          <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center font-medium text-sm">
            {profile ? getInitials(profile.fname, profile.lname) : '?'}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        <p className="text-xl font-medium mb-1">
          {getHour()}, <span className="text-orange-400">{profile?.fname}</span> 👋
        </p>
        <p className="text-slate-500 text-sm mb-5">
          {filtered.length} {filtered.length === 1 ? 'person' : 'people'} match your interests today
        </p>

        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-5">
          <span className="text-slate-500">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, city or interest..."
            className="bg-transparent outline-none text-sm text-white placeholder-slate-500 flex-1"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap border transition-all ${
                activeFilter === f
                  ? 'bg-orange-600 border-orange-600 text-white'
                  : 'bg-white/4 border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {featured && (
          <>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Featured match</p>
            <div className="bg-[#111827] border border-white/7 rounded-2xl overflow-hidden flex mb-8">
              <div
                onClick={() => router.push(`/profile/${featured.uid}`)}
                className="w-36 min-h-[180px] bg-slate-800 flex items-center justify-center flex-shrink-0 cursor-pointer"
              >
                {featured.photoURL
                  ? <img src={featured.photoURL} className="w-full h-full object-cover" alt={featured.fname} />
                  : <div className="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center text-2xl font-bold">
                      {getInitials(featured.fname, featured.lname)}
                    </div>
                }
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div onClick={() => router.push(`/profile/${featured.uid}`)} className="cursor-pointer">
                  <span className="inline-block bg-orange-500/10 text-orange-400 text-xs px-3 py-1 rounded-full border border-orange-500/20 mb-2">
                    ⭐ Top match for you
                  </span>
                  <p className="text-lg font-medium">{featured.fname} {featured.lname}, {featured.age}</p>
                  <p className="text-xs text-slate-500 mb-2">📍 {featured.city} · {featured.looking}</p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">{featured.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {featured.interests?.slice(0, 4).map((tag: string) => (
                      <span key={tag} className="bg-white/5 text-slate-400 text-xs px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/profile/${featured.uid}`)}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition-all">
                    ✉ Send letter
                  </button>
                  <button
                    onClick={() => router.push(`/profile/${featured.uid}`)}
                    className="bg-white/5 border border-white/10 text-slate-400 text-xs px-3 py-2 rounded-xl hover:bg-white/10">
                    ♡
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {rest.length > 0 && (
          <>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Browse members</p>
            <div className="grid grid-cols-3 gap-3">
              {rest.map(member => (
                <div
                  key={member.uid}
                  onClick={() => router.push(`/profile/${member.uid}`)}
                  className="bg-[#111827] border border-white/7 rounded-2xl overflow-hidden hover:border-orange-500/40 transition-all cursor-pointer"
                >
                  <div className="h-24 flex items-center justify-center bg-slate-800 relative">
                    {member.photoURL
                      ? <img src={member.photoURL} className="w-full h-full object-cover" alt={member.fname} />
                      : <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center font-bold text-sm">
                          {getInitials(member.fname, member.lname)}
                        </div>
                    }
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 border-[#111827]" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium mb-0.5">{member.fname}, {member.age}</p>
                    <p className="text-xs text-slate-500 mb-2">📍 {member.city}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {member.interests?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="bg-white/5 text-slate-500 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); startConversation(member) }}
                      className="w-full bg-orange-500/10 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/20 hover:border-orange-600 text-xs font-medium py-1.5 rounded-lg transition-all"
                    >
                      ✉ Write
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">✉</p>
            <p className="text-slate-400 font-medium">No members found</p>
            <p className="text-slate-600 text-sm mt-1">Try a different search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
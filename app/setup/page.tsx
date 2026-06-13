'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db, storage } from '../../lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { onAuthStateChanged } from 'firebase/auth'

const INTERESTS = [
  'Travel', 'Cooking', 'Reading', 'Music', 'Hiking', 'Movies',
  'Sports', 'Art', 'Photography', 'Fitness', 'Gaming', 'Fashion',
  'Technology', 'Dancing', 'Coffee', 'Nature', 'Writing', 'Yoga',
  'Food', 'Languages'
]

export default function Setup() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [user, setUser] = useState<any>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [city, setCity] = useState('')
  const [looking, setLooking] = useState('')
  const [bio, setBio] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push('/'); return }
      setUser(u)

      // Load existing profile data if it exists
      const profileSnap = await getDoc(doc(db, 'users', u.uid))
      if (profileSnap.exists()) {
        const data = profileSnap.data()
        setFname(data.fname || '')
        setLname(data.lname || '')
        setAge(data.age?.toString() || '')
        setGender(data.gender || '')
        setCity(data.city || '')
        setLooking(data.looking || '')
        setBio(data.bio || '')
        setSelected(data.interests || [])
        setPhotoPreview(data.photoURL || '')
      }
    })
    return () => unsub()
  }, [])

  const progress = [
    fname.trim(),
    lname.trim(),
    age,
    gender,
    city.trim(),
    looking,
    bio.trim().length > 20 ? 'ok' : '',
    selected.length >= 3 ? 'ok' : '',
  ].filter(Boolean).length * 12.5

  const toggleInterest = (tag: string) => {
    setSelected(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!user || progress < 80) return
    setSaving(true)
    try {
      let photoURL = photoPreview // keep existing photo by default
      if (photoFile) {
        const storageRef = ref(storage, `avatars/${user.uid}`)
        await uploadBytes(storageRef, photoFile)
        photoURL = await getDownloadURL(storageRef)
      }
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        fname,
        lname,
        age: Number(age),
        gender,
        city,
        looking,
        bio,
        interests: selected,
        photoURL,
        createdAt: new Date().toISOString(),
      })
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <div className="max-w-lg mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-orange-400">✉ MailConnector</h1>
          <p className="text-slate-400 text-sm mt-1">Set up your profile so others can find you</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Profile completion</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-24 h-24 rounded-full border-2 border-dashed border-orange-500 flex items-center justify-center cursor-pointer overflow-hidden bg-slate-900"
          >
            {photoPreview
              ? <img src={photoPreview} className="w-full h-full object-cover" alt="preview" />
              : <span className="text-3xl">📷</span>
            }
          </div>
          <p className="text-slate-400 text-xs mt-2">Tap to add photo</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 mb-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">Basic info</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">First name</label>
              <input value={fname} onChange={e => setFname(e.target.value)}
                className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Thabo" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Last name</label>
              <input value={lname} onChange={e => setLname(e.target.value)}
                className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Mokoena" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Age</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} min={18} max={99}
                className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="25" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)}
                className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-orange-500">
                <option value="">Select...</option>
                <option>Man</option>
                <option>Woman</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">City</label>
              <input value={city} onChange={e => setCity(e.target.value)}
                className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Pretoria" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Looking for</label>
              <select value={looking} onChange={e => setLooking(e.target.value)}
                className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-orange-500">
                <option value="">Select...</option>
                <option>A relationship</option>
                <option>Friendship</option>
                <option>Pen pal</option>
                <option>Not sure yet</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 mb-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">About you</p>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="I love weekend hikes, cooking new recipes, and long conversations over coffee..."
            className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-orange-500 resize-none"
          />
          <p className="text-xs text-slate-500 text-right mt-1">{bio.length}/300</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Interests</p>
          <p className="text-xs text-slate-500 mb-4">Pick at least 3</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleInterest(tag)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                  selected.includes(tag)
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={progress < 80 || saving}
          className="w-full py-3 rounded-2xl font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {saving ? 'Saving...' : 'Complete profile →'}
        </button>

      </div>
    </div>
  )
}
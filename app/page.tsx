'use client'

import { useState } from 'react'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const login = async () => {
    const provider = new GoogleAuthProvider()

    try {
      setLoading(true)
      await signInWithPopup(auth, provider)
      router.push('/setup')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#070B14] text-white">

      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
            ✉️
          </div>
          <h1 className="font-bold text-xl">MailConnector</h1>
        </div>

        <div className="hidden md:flex gap-8 text-slate-400">
          <a href="#">How it works</a>
          <a href="#">Browse</a>
          <a href="#">Stories</a>
        </div>

        <button
          onClick={login}
          className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl font-semibold"
        >
          Join Free
        </button>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">

        <div className="inline-block bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-full mb-8">
          48,000+ members across South Africa
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl mx-auto">
          Meet someone through a
          <span className="block text-orange-500">
            meaningful letter
          </span>
        </h1>

        <p className="text-slate-400 text-lg mt-8 max-w-2xl mx-auto">
          No swiping. No algorithms.
          Just real people connecting through thoughtful letters.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
          <button
            onClick={login}
            className="bg-orange-500 px-8 py-4 rounded-2xl font-semibold hover:bg-orange-600"
          >
            {loading ? 'Loading...' : 'Start Writing'}
          </button>

          <button className="border border-slate-700 px-8 py-4 rounded-2xl">
            Browse Members
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto mt-16">
          <div>
            <h3 className="text-3xl font-bold">48K+</h3>
            <p className="text-slate-500">Members</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">12K</h3>
            <p className="text-slate-500">Letters Daily</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">3200</h3>
            <p className="text-slate-500">Couples</p>
          </div>
        </div>
      </section>

      {/* MEMBERS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        <h2 className="text-center text-3xl font-bold mb-12">
          Members Online
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {[
            {
              name: 'Amara',
              age: 26,
              city: 'Cape Town',
              emoji: '🌸'
            },
            {
              name: 'Thabo',
              age: 29,
              city: 'Johannesburg',
              emoji: '👨'
            },
            {
              name: 'Kagiso',
              age: 24,
              city: 'Pretoria',
              emoji: '👩'
            }
          ].map((user, i) => (
            <div
              key={i}
              className="bg-[#111827] rounded-3xl overflow-hidden border border-slate-800"
            >
              <div className="h-56 flex items-center justify-center text-7xl bg-gradient-to-br from-orange-500/20 to-purple-500/20">
                {user.emoji}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold">
                  {user.name}, {user.age}
                </h3>

                <p className="text-slate-400 mt-2">
                  📍 {user.city}
                </p>

                <button
                  onClick={login}
                  className="mt-5 w-full bg-orange-500 py-3 rounded-xl"
                >
                  Send Letter
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0D1117] py-24 text-center">

        <h2 className="text-5xl font-bold">
          Ready to write your story?
        </h2>

        <p className="text-slate-400 mt-5 mb-10">
          Join thousands finding real connections
        </p>

        <button
          onClick={login}
          className="bg-orange-500 px-10 py-4 rounded-2xl font-bold"
        >
          Create Free Profile
        </button>

      </section>

    </main>
  )
}
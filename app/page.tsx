'use client'

import { useState } from 'react'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const login = async () => {
    if (loading) return
    setLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      router.push('/setup')
    } catch (error: any) {
      if (error.code !== 'auth/cancelled-popup-request') {
        alert('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center text-sm">✉</div>
          <span className="font-medium">MailConnector</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a className="text-sm text-slate-500 hover:text-white cursor-pointer">How it works</a>
          <a className="text-sm text-slate-500 hover:text-white cursor-pointer">Browse</a>
          <a className="text-sm text-slate-500 hover:text-white cursor-pointer">Success stories</a>
        </div>
        <button onClick={login} disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-xl disabled:opacity-50 transition-all">
          {loading ? 'Opening...' : 'Join free'}
        </button>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs px-4 py-2 rounded-full mb-6">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
          48,000+ members across South Africa
        </div>
        <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-4 max-w-2xl mx-auto">
          Meet someone through a <span className="text-orange-400">meaningful letter</span>
        </h1>
        <p className="text-slate-400 text-base max-w-md mx-auto mb-10 leading-relaxed">
          No swiping. No algorithms. Just real people connecting through thoughtful, heartfelt letters.
        </p>
        <div className="flex items-center justify-center gap-3 mb-12">
          <button onClick={login} disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-7 py-3 rounded-2xl disabled:opacity-50 transition-all">
            {loading ? 'Opening Google...' : 'Start writing today'}
          </button>
          <button className="bg-white/5 border border-white/10 text-slate-300 px-7 py-3 rounded-2xl hover:bg-white/10 transition-all">
            Browse members
          </button>
        </div>
        <div className="flex items-center justify-center gap-8">
          {[['48K+', 'Members worldwide'], ['12K', 'Letters sent today'], ['3,200', 'Couples connected']].map(([num, label], i) => (
            <div key={i} className="text-center">
              <p className="text-xl font-medium">{num}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Member previews */}
      <section className="px-6 pb-16 max-w-2xl mx-auto">
        <p className="text-xs text-slate-500 uppercase tracking-widest text-center mb-5">Members online now</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Amara, 26', city: 'Cape Town', looking: 'Relationship', tags: ['Travel', 'Music', 'Art'], bg: '#1a1035', emoji: '🌸' },
            { name: 'Thabo, 29', city: 'Johannesburg', looking: 'Pen pal', tags: ['Sports', 'Hiking', 'Food'], bg: '#0f2027', emoji: '🧑' },
            { name: 'Kagiso, 24', city: 'Pretoria', looking: 'Friendship', tags: ['Yoga', 'Reading', 'Coffee'], bg: '#1a0f27', emoji: '👩' },
          ].map((m, i) => (
            <div key={i} className="bg-[#111827] border border-white/7 rounded-2xl overflow-hidden">
              <div className="h-24 flex items-center justify-center text-4xl" style={{ background: m.bg }}>{m.emoji}</div>
              <div className="p-3">
                <p className="text-sm font-medium mb-0.5">{m.name}</p>
                <p className="text-xs text-slate-500 mb-2">📍 {m.city} · {m.looking}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {m.tags.map(t => <span key={t} className="bg-white/5 text-slate-500 text-xs px-2 py-0.5 rounded-full">{t}</span>)}
                </div>
                <button onClick={login}
                  className="w-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-medium py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all">
                  ✉ Send letter
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 bg-[#0d1117] border-t border-white/5">
        <p className="text-2xl font-medium text-center mb-2">How it works</p>
        <p className="text-slate-500 text-sm text-center mb-10">Three simple steps to find your person</p>
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { icon: '👤', step: 'Step 1', title: 'Create your profile', desc: 'Sign up with Google, add your photo, bio and interests. Takes less than 2 minutes.' },
            { icon: '🔍', step: 'Step 2', title: 'Browse members', desc: 'Explore profiles from across South Africa. Filter by city, interests and what they\'re looking for.' },
            { icon: '✉', step: 'Step 3', title: 'Write your first letter', desc: 'Send a thoughtful message. Real connections start with real words — no shallow swipes here.' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-2xl mx-auto mb-4">{s.icon}</div>
              <p className="text-xs text-orange-400 font-medium mb-2">{s.step}</p>
              <p className="text-sm font-medium mb-2">{s.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 max-w-2xl mx-auto">
        <p className="text-2xl font-medium text-center mb-2">Success stories</p>
        <p className="text-slate-500 text-sm text-center mb-8">Real people, real connections</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { text: '"I never thought I\'d find someone through letters but here we are — 8 months together and still writing every week."', name: 'Naledi M.', city: 'Cape Town', color: '#e8622a' },
            { text: '"MailConnector brought back the romance of actually getting to know someone. No games, just genuine conversations."', name: 'Sipho K.', city: 'Johannesburg', color: '#5b21b6' },
          ].map((t, i) => (
            <div key={i} className="bg-[#111827] border border-white/7 rounded-2xl p-5">
              <p className="text-sm text-slate-400 leading-relaxed italic mb-4">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: t.color }}>
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#0d1117] border-t border-white/5 text-center">
        <p className="text-3xl font-medium mb-3">Ready to write your story?</p>
        <p className="text-slate-400 text-sm mb-8">Join thousands of South Africans finding real connections through meaningful letters</p>
        <button onClick={login} disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-8 py-3 rounded-2xl disabled:opacity-50 transition-all">
          {loading ? 'Opening Google...' : 'Create free profile →'}
        </button>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between px-8 py-6 border-t border-white/5">
        <span className="text-xs text-slate-600">© 2026 MailConnector. All rights reserved.</span>
        <div className="flex gap-4">
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <span key={l} className="text-xs text-slate-600 cursor-pointer hover:text-slate-400">{l}</span>
          ))}
        </div>
      </footer>

    </div>
  )
}
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Image from 'next/image'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn(username, password)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.replace('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#21264e' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden">
        {/* Background geometry */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ background: '#006ae0', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full" style={{ background: '#08dc7d', transform: 'translate(-30%, 30%)' }} />
        </div>

        <div className="relative z-10">
          <img
            src="https://cms-assets.ldsvcplatform.com/IT/s3fs-public/inline-images/logo_new1.png"
            alt="HS Logo"
            className="h-12 object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>

        <div className="relative z-10">
          <h1 className="font-display text-5xl font-bold text-white leading-tight mb-6">
            Retailer<br />Performance<br />
            <span style={{ color: '#08dc7d' }}>Analytics</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Data-driven insights for your retail network across Italy. Track KPIs, incentives, and performance in real time.
          </p>
        </div>

        <div className="relative z-10 flex gap-6">
          {[
            { label: 'Branches', value: '8' },
            { label: 'Retailers', value: '100+' },
            { label: 'Metrics', value: '20+' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <img
              src="https://cms-assets.ldsvcplatform.com/IT/s3fs-public/inline-images/logo_new1.png"
              alt="HS Logo"
              className="h-10 object-contain mx-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>

          <div className="rounded-3xl p-8" style={{ background: '#2a3060' }}>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-white/50 text-sm mb-8">Sign in to access your dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 border border-white/10 focus:outline-none focus:border-[#006ae0] transition-all"
                  style={{ background: '#1e2348' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 border border-white/10 focus:outline-none focus:border-[#006ae0] transition-all"
                  style={{ background: '#1e2348' }}
                />
              </div>

              {error && (
                <div className="bg-[#f04438]/10 border border-[#f04438]/30 rounded-xl px-4 py-3 text-[#f04438] text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #006ae0, #245bc1)' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-white/30 text-xs mt-8">
              HS Simply · Retailer Dashboard v2.0
            </p>
          </div>

          <p className="text-center mt-6 text-white/20 text-xs">
            © 2024 HS Simply Italy. Confidential system.
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState, useRef, useEffect } from 'react'
import { Menu, LogOut, Key, User, ChevronDown } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { changePassword } from '@/lib/data'
import clsx from 'clsx'

interface Props {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: Props) {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden text-[#21264e]/60 hover:text-[#21264e]">
            <Menu size={22} />
          </button>
          <div>
            <h2 className="text-base font-bold text-[#21264e]">HS Simply — Retailer Dashboard</h2>
            <p className="text-xs text-[#21264e]/40">Italy · Performance Analytics 2024–2026</p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#006ae0,#46286e)' }}>
              {user?.name?.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-[#21264e] leading-none">{user?.name}</p>
              <p className="text-xs text-[#21264e]/40">{user?.role}</p>
            </div>
            <ChevronDown size={14} className="text-[#21264e]/40" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50">
              <div className="px-4 py-2 border-b border-gray-100 mb-1">
                <p className="text-xs font-semibold text-[#21264e]/50 uppercase tracking-wide">Signed in as</p>
                <p className="text-sm font-bold text-[#21264e]">{user?.username}</p>
              </div>

              {user?.role === 'HS-ADMIN' && (
                <a
                  href="/dashboard/users"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#21264e] hover:bg-gray-50 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={15} className="text-[#21264e]/50" />
                  User Management
                </a>
              )}

              <button
                onClick={() => { setShowChangePassword(true); setMenuOpen(false) }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#21264e] hover:bg-gray-50 transition-all"
              >
                <Key size={15} className="text-[#21264e]/50" />
                Change Password
              </button>

              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#f04438] hover:bg-[#f04438]/5 transition-all"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {showChangePassword && (
        <ChangePasswordModal user={user} onClose={() => setShowChangePassword(false)} />
      )}
    </>
  )
}

function ChangePasswordModal({ user, onClose }: { user: any; onClose: () => void }) {
  const [current, setCurrent] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (newPwd !== confirm) { setError('Passwords do not match'); return }
    if (newPwd.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await changePassword(user.id, newPwd)
      setSuccess(true)
      setTimeout(onClose, 1500)
    } catch {
      setError('Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-[#21264e] mb-4">Change Password</h3>
        {success ? (
          <div className="text-center py-4">
            <div className="text-[#08dc7d] text-4xl mb-2">✓</div>
            <p className="text-[#21264e] font-semibold">Password updated successfully</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">New Password</label>
              <input type="password" className="input-field" value={newPwd} onChange={e => setNewPwd(e.target.value)} required />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input type="password" className="input-field" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            {error && <p className="text-[#f04438] text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Saving...' : 'Update'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

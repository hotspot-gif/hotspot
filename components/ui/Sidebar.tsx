'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  LayoutDashboard, BarChart3, Users, Upload, X, ChevronRight
} from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Retailer Reports', href: '/dashboard/reports', icon: BarChart3 },
]

const adminItems = [
  { label: 'User Management', href: '/dashboard/users', icon: Users },
  { label: 'Data Import', href: '/dashboard/import', icon: Upload },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: Props) {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ background: '#21264e' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <img
            src="https://cms-assets.ldsvcplatform.com/IT/s3fs-public/inline-images/logo_new1.png"
            alt="HS Simply"
            className="h-8 object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-6 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#006ae0,#46286e)' }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-white text-sm font-medium leading-none">{user?.name}</p>
              <span className={clsx(
                'text-xs font-semibold px-1.5 py-0.5 rounded mt-0.5 inline-block',
                user?.role === 'HS-ADMIN' ? 'bg-white/20 text-white' :
                user?.role === 'RSM' ? 'bg-[#006ae0]/30 text-[#00d7ff]' : 'bg-[#08dc7d]/20 text-[#08dc7d]'
              )}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-2 mb-2">Main</p>
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <a
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:bg-white/8 hover:text-white'
                )}
              >
                <Icon size={18} />
                <span>{label}</span>
                {active && <ChevronRight size={14} className="ml-auto text-white/40" />}
              </a>
            )
          })}

          {user?.role === 'HS-ADMIN' && (
            <>
              <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-2 mt-5 mb-2">Admin</p>
              {adminItems.map(({ label, href, icon: Icon }) => {
                const active = pathname === href
                return (
                  <a
                    key={href}
                    href={href}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                      active
                        ? 'bg-white/15 text-white'
                        : 'text-white/60 hover:bg-white/8 hover:text-white'
                    )}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                    {active && <ChevronRight size={14} className="ml-auto text-white/40" />}
                  </a>
                )
              })}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-white/20 text-xs">HS Dashboard v2.0</p>
          <p className="text-white/15 text-xs">© 2024 HS Simply Italy</p>
        </div>
      </aside>
    </>
  )
}

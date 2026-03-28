'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { getAllUsers, createUser, updateUser, deleteUser } from '@/lib/data'
import { BRANCHES, Branch, AppUser, UserRole } from '@/types'
import { Plus, Edit2, Trash2, Shield, Users, X, Check } from 'lucide-react'
import clsx from 'clsx'

const ROLES: UserRole[] = ['HS-ADMIN', 'RSM', 'ASM']
const ROLE_BADGE: Record<UserRole, string> = {
  'HS-ADMIN': 'badge badge-admin',
  'RSM': 'badge badge-rsm',
  'ASM': 'badge badge-asm',
}

export default function UsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState<any>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== 'HS-ADMIN') { router.replace('/dashboard'); return }
    loadUsers()
  }, [user])

  const loadUsers = async () => {
    setLoading(true)
    try { setUsers(await getAllUsers()) } catch {}
    finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (id === user?.id) return
    try { await deleteUser(id); setDeleteConfirm(null); loadUsers() } catch {}
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#21264e] flex items-center gap-2">
            <Users size={22} style={{ color: '#006ae0' }} /> User Management
          </h1>
          <p className="text-[#21264e]/50 text-sm mt-0.5">Manage dashboard access and roles</p>
        </div>
        <button onClick={() => { setEditUser(null); setShowModal(true) }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {ROLES.map(role => (
          <div key={role} className="kpi-card flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: role === 'HS-ADMIN' ? '#21264e18' : role === 'RSM' ? '#006ae018' : '#08dc7d18',
                color: role === 'HS-ADMIN' ? '#21264e' : role === 'RSM' ? '#006ae0' : '#059652' }}>
              <Shield size={16} />
            </div>
            <div>
              <p className="text-xl font-bold text-[#21264e]">{users.filter(u => u.role === role).length}</p>
              <p className="text-xs text-[#21264e]/50">{role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[#21264e]">All Users ({users.length})</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-40"><div className="spinner" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Branches</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="font-semibold">{u.name}</td>
                    <td className="font-mono text-sm">{u.username}</td>
                    <td className="text-[#21264e]/60 text-sm">{u.email || '—'}</td>
                    <td><span className={ROLE_BADGE[u.role as UserRole]}>{u.role}</span></td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {u.role === 'HS-ADMIN' ? (
                          <span className="text-xs text-[#21264e]/40">All branches</span>
                        ) : (
                          (u.branches || []).map((b: string) => (
                            <span key={b} className="text-xs bg-gray-100 text-[#21264e] px-1.5 py-0.5 rounded-md">
                              {b.replace('LMIT-HS-', '')}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="text-sm text-[#21264e]/40">
                      {new Date(u.created_at).toLocaleDateString('it-IT')}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditUser(u); setShowModal(true) }}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-all">
                          <Edit2 size={14} />
                        </button>
                        {u.id !== user?.id && (
                          deleteConfirm === u.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(u.id)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                                <Check size={14} />
                              </button>
                              <button onClick={() => setDeleteConfirm(null)}
                                className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 transition-all">
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(u.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-all">
                              <Trash2 size={14} />
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <UserModal
          user={editUser}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); loadUsers() }}
        />
      )}
    </div>
  )
}

function UserModal({ user, onClose, onSaved }: { user: any; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!user
  const [form, setForm] = useState({
    username: user?.username || '',
    name: user?.name || '',
    email: user?.email || '',
    role: (user?.role || 'ASM') as UserRole,
    password: '',
    branches: (user?.branches || []) as Branch[],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const toggleBranch = (b: Branch) => {
    if (form.role === 'HS-ADMIN') return
    if (form.role === 'ASM') {
      set('branches', [b])
    } else {
      set('branches', form.branches.includes(b) ? form.branches.filter(x => x !== b) : [...form.branches, b])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.name) { setError('Username and name are required'); return }
    if (!isEdit && !form.password) { setError('Password is required for new users'); return }
    if (form.role !== 'HS-ADMIN' && form.branches.length === 0) { setError('Assign at least one branch'); return }

    setLoading(true)
    try {
      const payload: any = {
        username: form.username,
        name: form.name,
        email: form.email,
        role: form.role,
        branches: form.role === 'HS-ADMIN' ? BRANCHES : form.branches,
      }
      if (form.password) payload.password = form.password
      if (isEdit) await updateUser(user.id, payload)
      else await createUser(payload)
      onSaved()
    } catch (err: any) {
      setError(err.message || 'Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#21264e]">{isEdit ? 'Edit User' : 'Add New User'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name *</label>
              <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="label">Username *</label>
              <input className="input-field font-mono" value={form.username} onChange={e => set('username', e.target.value)} required disabled={isEdit} />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input-field" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label className="label">{isEdit ? 'New Password (leave blank to keep)' : 'Password *'}</label>
            <input className="input-field" type="password" value={form.password} onChange={e => set('password', e.target.value)} />
          </div>
          <div>
            <label className="label">Role *</label>
            <div className="relative">
              <select className="select-field pr-8" value={form.role} onChange={e => { set('role', e.target.value); set('branches', []) }}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▾</span>
            </div>
          </div>

          {form.role !== 'HS-ADMIN' && (
            <div>
              <label className="label">
                Branch Access *
                <span className="text-[#21264e]/40 font-normal ml-1">
                  {form.role === 'ASM' ? '(single branch)' : '(multi-select for RSM)'}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {BRANCHES.map(b => (
                  <button
                    key={b} type="button" onClick={() => toggleBranch(b)}
                    className={clsx(
                      'px-3 py-2 rounded-xl text-sm border text-left transition-all',
                      form.branches.includes(b)
                        ? 'bg-[#21264e] text-white border-[#21264e]'
                        : 'bg-white text-[#21264e]/60 border-gray-200 hover:border-[#21264e]/40'
                    )}
                  >
                    {b.replace('LMIT-HS-', '')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {form.role === 'HS-ADMIN' && (
            <p className="text-xs text-[#21264e]/40 bg-gray-50 px-3 py-2 rounded-xl">
              HS-ADMIN automatically has access to all 8 branches.
            </p>
          )}

          {error && <p className="text-[#f04438] text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

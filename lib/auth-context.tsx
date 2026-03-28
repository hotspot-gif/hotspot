'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AppUser } from '@/types'

interface AuthContextType {
  user: AppUser | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<{ error?: string }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({}),
  signOut: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('hs_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  const signIn = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single()

      if (error || !data) return { error: 'Invalid username or password' }

      const appUser: AppUser = {
        id: data.id,
        username: data.username,
        name: data.name,
        email: data.email,
        role: data.role,
        branches: data.branches || [],
        created_at: data.created_at,
      }
      setUser(appUser)
      localStorage.setItem('hs_user', JSON.stringify(appUser))
      return {}
    } catch {
      return { error: 'Connection error. Please try again.' }
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('hs_user')
    localStorage.removeItem('hs_selected_branch')
    window.location.href = '/auth/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

import { supabase } from './supabase'
import { Branch, RetailerPerformance } from '@/types'

export async function getRetailersByBranch(branches: Branch[]) {
  const { data, error } = await supabase
    .from('retailers')
    .select('*')
    .in('branch', branches)
    .order('name')
  if (error) throw error
  return data || []
}

export async function getRetailersByBranchAndZone(branches: Branch[], zone?: string) {
  let query = supabase.from('retailers').select('*').in('branch', branches)
  if (zone) query = query.eq('zone', zone)
  const { data, error } = await query.order('name')
  if (error) throw error
  return data || []
}

export async function getZonesByBranch(branches: Branch[]) {
  const { data, error } = await supabase
    .from('retailers')
    .select('zone')
    .in('branch', branches)
  if (error) throw error
  const zones = Array.from(new Set((data || []).map((r: any) => r.zone).filter(Boolean)))
  return zones.sort()
}

export async function getRetailerPerformance(retailerId: string): Promise<RetailerPerformance[]> {
  const { data, error } = await supabase
    .from('retailer_performance')
    .select('*')
    .eq('retailer_id', retailerId)
    .order('year')
    .order('month')
  if (error) throw error
  return data || []
}

export async function getRetailerInfo(retailerId: string) {
  const { data, error } = await supabase
    .from('retailers')
    .select('*')
    .eq('id', retailerId)
    .single()
  if (error) throw error
  return data
}

export async function getTopRetailers(branches: Branch[], limit = 5) {
  const { data, error } = await supabase
    .from('retailer_performance')
    .select('retailer_id, ga_activations, incentive_amount, retailers!inner(name, branch, zone)')
    .in('retailers.branch', branches)
    .eq('year', 2024)
  if (error) throw error

  // Aggregate by retailer
  const map: Record<string, { name: string; branch: string; zone: string; ga: number; incentive: number }> = {}
  for (const row of (data || [])) {
    const r = row as any
    if (!map[r.retailer_id]) {
      map[r.retailer_id] = {
        name: r.retailers?.name || '',
        branch: r.retailers?.branch || '',
        zone: r.retailers?.zone || '',
        ga: 0,
        incentive: 0,
      }
    }
    map[r.retailer_id].ga += r.ga_activations || 0
    map[r.retailer_id].incentive += r.incentive_amount || 0
  }

  return Object.entries(map)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.ga - a.ga)
    .slice(0, limit)
}

export async function getAllUsers() {
  const { data, error } = await supabase.from('users').select('*').order('name')
  if (error) throw error
  return data || []
}

export async function createUser(user: any) {
  const { data, error } = await supabase.from('users').insert(user).select().single()
  if (error) throw error
  return data
}

export async function updateUser(id: string, updates: any) {
  const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteUser(id: string) {
  const { error } = await supabase.from('users').delete().eq('id', id)
  if (error) throw error
}

export async function changePassword(id: string, newPassword: string) {
  const { error } = await supabase.from('users').update({ password: newPassword }).eq('id', id)
  if (error) throw error
}

export type UserRole = 'HS-ADMIN' | 'RSM' | 'ASM'

export type Branch =
  | 'LMIT-HS-MILAN'
  | 'LMIT-HS-BOLOGNA'
  | 'LMIT-HS-NAPLES'
  | 'LMIT-HS-PALERMO'
  | 'LMIT-HS-ROME'
  | 'LMIT-HS-BARI'
  | 'LMIT-HS-TORINO'
  | 'LMIT-HS-PADOVA'

export interface AppUser {
  id: string
  username: string
  name: string
  email: string
  role: UserRole
  branches: Branch[]
  created_at: string
}

export interface Retailer {
  id: string
  retailer_id: string
  name: string
  branch: Branch
  zone: string
}

export interface RetailerPerformance {
  retailer_id: string
  year: number
  month: number
  ga_activations: number
  new_activations: number
  port_in: number
  port_out: number
  plan_pin_699_below: number
  plan_pin_699_above: number
  plan_new_699_below: number
  plan_new_699_above: number
  incentive_amount: number
  port_in_incentive: number
  gara_bonus: number
  deductions_clawback: number
  deductions_po: number
  deductions_renewal: number
  renewal_rate: number
}

export const BRANCHES: Branch[] = [
  'LMIT-HS-MILAN',
  'LMIT-HS-BOLOGNA',
  'LMIT-HS-NAPLES',
  'LMIT-HS-PALERMO',
  'LMIT-HS-ROME',
  'LMIT-HS-BARI',
  'LMIT-HS-TORINO',
  'LMIT-HS-PADOVA',
]

export const NORTH_BRANCHES: Branch[] = [
  'LMIT-HS-MILAN',
  'LMIT-HS-BOLOGNA',
  'LMIT-HS-TORINO',
  'LMIT-HS-PADOVA',
]

export const SOUTH_BRANCHES: Branch[] = [
  'LMIT-HS-ROME',
  'LMIT-HS-NAPLES',
  'LMIT-HS-PALERMO',
  'LMIT-HS-BARI',
]

export const CHART_COLORS = {
  blue: '#006AE0',
  green: '#08DC7D',
  peach: '#FFC8B2',
  yellow: '#FFD54F',
  cyan: '#00D7FF',
  red: '#F04438',
  primary: '#21264E',
  purple: '#46286E',
  year2024: '#006AE0',
  year2025: '#08DC7D',
  year2026: '#FFD54F',
}

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

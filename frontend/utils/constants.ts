// Application constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  CUSTOMER_EVENTS: '/customer-events'
} as const;

export const STYLES = {
  // Common button styles
  BUTTON_PRIMARY: 'w-full group relative overflow-hidden bg-[#1063fe] text-white py-3 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
  BUTTON_SECONDARY: 'w-full bg-white/30 backdrop-blur-sm text-[#1063fe] py-3 px-6 rounded-2xl font-semibold text-lg border border-[#1063fe] hover:bg-white/40 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95',
  
  // Common input styles
  INPUT_PRIMARY: 'w-full px-4 py-2.5 bg-white/40 backdrop-blur-sm border-2 border-[#1063fe] rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1063fe]/50 focus:border-transparent transition-all duration-300',
  
  // Common card styles
  CARD_GLASS: 'bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30',
  
  // Background styles
  BG_MAIN: 'min-h-screen flex items-center justify-center relative overflow-hidden'
} as const;
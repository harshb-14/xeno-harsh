'use client'

import { 
  BarChart3, 
  Truck, 
  LogOut, 
  Calendar, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  LineChart,
  AreaChart,
  Home,
  User,
  Search,
  Bell,
  Settings,
  FileText,
  Package,
  ShoppingCart,
  DollarSign,
  Activity,
  Menu,
  X,
  RefreshCw,
  Loader2,
  CalendarDays,
  UserCheck
} from 'lucide-react'

export type IconName = 
  | 'dashboard'
  | 'truck'
  | 'logout'
  | 'calendar'
  | 'users'
  | 'trending-up'
  | 'line-chart'
  | 'area-chart'
  | 'bar-chart'
  | 'alert-triangle'
  | 'home'
  | 'user'
  | 'search'
  | 'bell'
  | 'settings'
  | 'file-text'
  | 'package'
  | 'shopping-cart'
  | 'dollar-sign'
  | 'activity'
  | 'menu'
  | 'close'
  | 'refresh'
  | 'loader'
  | 'calendar-days'
  | 'user-check'

const iconMap = {
  'dashboard': BarChart3,
  'truck': Truck,
  'logout': LogOut,
  'calendar': Calendar,
  'users': Users,
  'trending-up': TrendingUp,
  'line-chart': LineChart,
  'area-chart': AreaChart,
  'bar-chart': BarChart3,
  'alert-triangle': AlertTriangle,
  'home': Home,
  'user': User,
  'search': Search,
  'bell': Bell,
  'settings': Settings,
  'file-text': FileText,
  'package': Package,
  'shopping-cart': ShoppingCart,
  'dollar-sign': DollarSign,
  'activity': Activity,
  'menu': Menu,
  'close': X,
  'refresh': RefreshCw,
  'loader': Loader2,
  'calendar-days': CalendarDays,
  'user-check': UserCheck
}

interface IconProps {
  name: IconName
  size?: number
  className?: string
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = '' }) => {
  const IconComponent = iconMap[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }
  
  return <IconComponent size={size} className={className} />
}
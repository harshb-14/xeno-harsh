import React from 'react'
import { STYLES } from '../../utils/constants'

interface AuthLayoutProps {
  children: React.ReactNode
  maxWidth?: 'md' | 'lg'
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  maxWidth = 'md' 
}) => {
  const containerClass = maxWidth === 'lg' ? 'max-w-lg' : 'max-w-md'

  return (
    <div 
      className={STYLES.BG_MAIN}
      style={{
        backgroundImage: 'url(/images/bg-xeno.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className={`relative z-10 w-full ${containerClass} mx-auto px-6`}>
        {children}
      </div>
    </div>
  )
}
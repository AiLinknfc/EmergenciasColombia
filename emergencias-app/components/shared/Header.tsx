'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">Emergencias Colombia</h1>
              <p className="text-xs text-gray-600">Directorio Inteligente</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <Link href={user.role === 'business' ? '/admin' : '/dashboard'} className="text-sm text-purple-600 hover:text-purple-700">
                {user.role === 'business' ? 'Admin' : 'Mi Perfil'}
              </Link>
            )}
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700">Líneas activas 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

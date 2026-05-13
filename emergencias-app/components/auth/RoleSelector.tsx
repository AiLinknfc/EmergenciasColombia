'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<'user' | 'business' | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card 
        className={`p-8 cursor-pointer transition-all ${selectedRole === 'user' ? 'ring-2 ring-purple-500' : ''}`}
        onClick={() => setSelectedRole('user')}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Soy Usuario</h3>
          <p className="text-gray-600">Visualiza teléfonos de emergencia y contacta de inmediato</p>
        </div>
      </Card>

      <Card 
        className={`p-8 cursor-pointer transition-all ${selectedRole === 'business' ? 'ring-2 ring-purple-500' : ''}`}
        onClick={() => setSelectedRole('business')}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Administrador</h3>
          <p className="text-gray-600">Acceso exclusivo con código de autorización previo</p>
        </div>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { UserWithEmergencyData } from '@/lib/types/user'

interface UserSelectorProps {
  onUserSelect: (user: UserWithEmergencyData) => void
  onRegisterNew?: () => void
  users?: UserWithEmergencyData[]
  selectedUserId?: string
}

export function UserSelector({ onUserSelect, onRegisterNew, users = [], selectedUserId }: UserSelectorProps) {
  const selectedUser = users.find(u => u.id === selectedUserId)

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Select 
        value={selectedUserId || ''} 
        onChange={(e) => {
          const user = users.find(u => u.id === e.target.value)
          if (user) onUserSelect(user)
        }}
      >
        <option value="">Seleccionar usuario</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.full_name} ({user.email})
          </option>
        ))}
      </Select>
      
      {onRegisterNew && (
        <Button variant="outline" onClick={onRegisterNew}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Registrar nuevo
        </Button>
      )}
      
      {selectedUser && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          {selectedUser.avatar_url && (
            <img src={selectedUser.avatar_url} alt="" className="w-8 h-8 rounded-full" />
          )}
          <div>
            <p className="font-medium">{selectedUser.full_name}</p>
            <p className="text-xs">
              {selectedUser.emergency_data?.blood_type || 'Tipo de sangre no registrado'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

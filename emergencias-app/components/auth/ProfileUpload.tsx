'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { storageService } from '@/services/storage.service'
import { User, Camera, Trash2, Image as ImageIcon } from 'lucide-react'

interface ProfileUploadProps {
  currentAvatar?: string
  onAvatarChange: (url: string) => void
  userId: string
}

export function ProfileUpload({ currentAvatar, onAvatarChange, userId }: ProfileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen')
      return
    }

    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
        onAvatarChange(result)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      alert('Error al procesar la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onAvatarChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center border-4 border-primary shadow-xl transition-transform group-hover:scale-105">
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-16 h-16 text-primary opacity-30" />
          )}
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:brightness-110 transition-all border-2 border-surface"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <input
          type="file"
          id="avatar-upload"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="flex gap-2">
          {!preview ? (
             <Button 
                type="button" 
                variant="outline"
                disabled={uploading} 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                {uploading ? 'PROCESANDO...' : 'SUBIR FOTO'}
              </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleRemove} className="text-error border-error/30 hover:bg-error/5 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              ELIMINAR
            </Button>
          )}
        </div>
        
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-center opacity-60">
          JPG / PNG / GIF • MAX 5MB
        </p>
      </div>
    </div>
  )
}

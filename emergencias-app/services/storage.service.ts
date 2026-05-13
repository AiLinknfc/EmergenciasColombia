import { supabase } from '@/lib/supabase/client'

export class StorageService {
  static async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return publicUrl
  }

  static async deleteAvatar(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath])

    if (error) throw error
  }

  static async updateAvatar(userId: string, file: File, oldAvatarUrl?: string): Promise<string> {
    // Eliminar avatar anterior si existe
    if (oldAvatarUrl) {
      try {
        const oldPath = oldAvatarUrl.split('/').pop()
        if (oldPath) {
          await this.deleteAvatar(`avatars/${oldPath}`)
        }
      } catch (error) {
        console.error('Error al eliminar avatar anterior:', error)
      }
    }

    return this.uploadAvatar(userId, file)
  }
}

export const storageService = StorageService

'use client'

export function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-black mb-2">Emergencias Colombia</h3>
            <p className="text-sm text-gray-600">
              Directorio inteligente de emergencias para Colombia.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-2">Tecnología</h3>
            <p className="text-sm text-gray-600">
              Desarrollado con Next.js, Supabase y Google Maps.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-2">Contacto</h3>
            <p className="text-sm text-gray-600">
              2025 AiLink
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

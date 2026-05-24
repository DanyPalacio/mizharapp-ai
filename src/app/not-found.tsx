import Link from 'next/link'
import { generateSEOMetadata } from '@/lib/seo'

export const metadata = generateSEOMetadata({
  title: 'Página No Encontrada — MIZHAR',
  description: 'La página que buscas no existe.',
  noindex: true,
})

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center px-4">
        <h1 className="text-9xl font-black text-slate-200">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 mt-4">Página no encontrada</h2>
        <p className="text-slate-600 mt-2 max-w-md mx-auto">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link 
            href="/" 
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Volver al Inicio
          </Link>
          <Link 
            href="/pricing" 
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
          >
            Ver Planes
          </Link>
        </div>
      </div>
    </div>
  )
}

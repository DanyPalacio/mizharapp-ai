'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center px-4 max-w-2xl">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Algo salió mal
        </h2>
        <p className="text-slate-600 mb-2">
          Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 p-4 bg-slate-100 rounded-lg text-left text-sm">
            <summary className="cursor-pointer font-semibold text-slate-700 mb-2">
              Detalles del error (solo en desarrollo)
            </summary>
            <pre className="text-xs text-red-600 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

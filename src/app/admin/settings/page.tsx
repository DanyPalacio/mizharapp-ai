'use client'
export default function AdminSettings() {
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginBottom: 24 }}>Configuración del Sistema</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[
          { title: '🔑 Variables de Entorno (Vercel)', desc: 'Configura en Vercel → Project → Settings → Environment Variables', items: ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'FRED_API_KEY', 'NEWS_API_KEY', 'NEXT_PUBLIC_APP_URL'] },
          { title: '💳 PayPal Integration', desc: 'Para habilitar pagos PayPal, configura PAYPAL_CLIENT_ID y PAYPAL_SECRET. El botón aparece en /pricing cuando la variable está presente.', items: ['PAYPAL_CLIENT_ID', 'PAYPAL_SECRET', 'PAYPAL_MODE (sandbox/live)'] },
          { title: '📊 Supabase — Tablas Requeridas', desc: 'Ejecuta estos SQL en Supabase → SQL Editor para habilitar todas las funciones del admin.', items: ['users (id, email, name, plan, usage_limit, plan_expires_at)', 'blog_posts (id, title, slug, content, status, word_count)', 'seo_config (page, title, description, keywords)', 'coupons (code, discount_pct, max_uses, expires_at)', 'knowledge_base (title, file_type, content, chunk_count)', 'branding_config (primaryColor, darkBg, fontDisplay, fontBody)'] },
        ].map(s => (
          <div key={s.title} style={{ background: 'white', border: '1px solid var(--mz-border-2)', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{s.title}</h2>
            <p style={{ fontSize: 13, color: 'var(--mz-ink-2)', marginBottom: 16 }}>{s.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {s.items.map(item => (
                <code key={item} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, padding: '5px 10px', background: 'var(--mz-cloud)', borderRadius: 5, color: 'var(--mz-ink-2)', display: 'block' }}>{item}</code>
              ))}
            </div>
          </div>
        ))}
        <div style={{ background: 'var(--mz-info-50)', border: '1px solid var(--mz-info)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--mz-info)', marginBottom: 6 }}>🔐 Credenciales Superadmin</div>
          <div style={{ fontSize: 13, color: 'var(--mz-info)', fontFamily: 'var(--font-mono)' }}>Email: danipalacio@gmail.com</div>
          <div style={{ fontSize: 13, color: 'var(--mz-info)', fontFamily: 'var(--font-mono)' }}>URL Admin: /admin</div>
        </div>
      </div>
    </div>
  )
}

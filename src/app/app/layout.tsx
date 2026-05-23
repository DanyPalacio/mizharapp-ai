import Sidebar from "@/components/layout/sidebar"
import Topbar from "@/components/layout/topbar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--mz-cloud)" }}>
      <Sidebar
        workspace="startup"
        plan="free"
        userInitials="D"
        userName="Daniel"
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar crumbs={[]} />
        <main style={{ flex: 1, overflow: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  )
}

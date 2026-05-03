import { Bell, ClipboardList, LayoutDashboard, Link as LinkIcon, LogOut, MessageSquareWarning, ScrollText, Settings2, Menu, X } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const navItems = [
  { to: "/dashboard", label: "Ana Sayfa", icon: LayoutDashboard },
  { to: "/anketler", label: "Anketler", icon: ClipboardList },
  { to: "/raporlar", label: "Raporlar", icon: ScrollText },
  { to: "/birim-raporu", label: "Birim Bazlı", icon: LinkIcon },
  { to: "/sikayetler", label: "Öneri & Şikayet", icon: MessageSquareWarning },
  { to: "/yonetim", label: "Yönetim", icon: Settings2 }
];

export function AppShell() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-hero-glow px-4 py-4 font-body text-slateglass md:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[290px_minmax(0,1fr)] relative">
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <aside className={`fixed inset-y-0 left-0 z-50 w-[290px] transform glass-panel overflow-y-auto p-5 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-8 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br from-brand-500 to-mint text-3xl font-black text-white shadow-soft">
                PB
              </div>
              <div>
                <div className="font-display text-2xl font-black uppercase tracking-wide text-night">PROBEL</div>
                <div className="text-sm leading-tight text-slateglass/70">Hasta Memnuniyet Platformu</div>
              </div>
            </div>
            <button className="lg:hidden p-2 text-slateglass hover:bg-white/50 rounded-xl transition-colors" onClick={() => setMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                    isActive ? "bg-gradient-to-r from-brand-500 to-brand-300 text-white shadow-md scale-[1.02]" : "bg-white/55 hover:bg-white/85 hover:scale-[1.02]"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span className="font-semibold">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-[28px] bg-gradient-to-br from-brand-50 to-white p-4">
            <div className="text-sm text-slateglass/65">Aktif Kullanıcı</div>
            <div className="mt-3 font-display text-xl font-bold text-night">{user?.adSoyad ?? "Admin"}</div>
            <div className="text-sm font-semibold text-brand-700">{user?.rol ?? "Yönetici"}</div>
          </div>

          <button
            type="button"
            onClick={() => {
              signOut();
              navigate("/login");
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-100 bg-white/80 px-4 py-3 font-semibold text-slateglass transition hover:bg-white"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </aside>

        <main className="space-y-4">
          <header className="glass-panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <button 
                className="mt-1 lg:hidden p-2 bg-white/70 text-brand-600 hover:bg-white rounded-xl shadow-sm transition-all" 
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              <div>
                <div className="font-display text-3xl md:text-4xl font-black uppercase tracking-wide text-night">Memnuniyet Paneli</div>
                <div className="mt-2 max-w-3xl text-sm md:text-base text-slateglass/72">
                  Hasta deneyimini tek ekrandan izleyin, anketleri yönetin, şikayetleri takip edin ve birim bazlı raporlara ulaşın.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/90 p-3 shadow-sm">
                <Bell size={18} className="text-brand-600" />
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-brand-500 to-mint px-5 py-3 text-sm font-semibold text-white shadow-soft">
                Canlı API Bağlantısı
              </div>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

import {
  Bell,
  ClipboardList,
  Download,
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Menu,
  MessageSquareWarning,
  Moon,
  Plus,
  ScrollText,
  Settings2,
  Sun,
  X
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("hasta-anketi-theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("hasta-anketi-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-hero-glow px-4 py-4 font-body text-slateglass md:px-6 dark:bg-slate-950 dark:text-slate-200">
      <div className="relative mx-auto grid max-w-7xl gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <aside className={`glass-panel fixed inset-y-0 left-0 z-50 w-[290px] transform overflow-y-auto p-5 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-8 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-mint text-2xl font-black text-white shadow-soft">
                PB
              </div>
              <div>
                <div className="font-display text-2xl font-black text-night dark:text-white">PROBEL</div>
                <div className="text-sm leading-tight text-slateglass/70 dark:text-slate-300">Hasta Memnuniyet Platformu</div>
              </div>
            </div>
            <button className="rounded-xl p-2 text-slateglass transition-colors hover:bg-white/50 lg:hidden dark:text-slate-200 dark:hover:bg-slate-800" onClick={() => setMobileMenuOpen(false)} aria-label="Menüyü kapat">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-brand-500 to-brand-300 text-white shadow-md"
                      : "bg-white/55 hover:bg-white/85 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span className="font-semibold">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-xl bg-gradient-to-br from-brand-50 to-white p-4 dark:from-slate-900 dark:to-slate-800">
            <div className="text-sm text-slateglass/65 dark:text-slate-300">Aktif Kullanıcı</div>
            <div className="mt-3 font-display text-xl font-bold text-night dark:text-white">{user?.adSoyad ?? "Admin"}</div>
            <div className="text-sm font-semibold text-brand-700 dark:text-mint">{user?.rol ?? "Yönetici"}</div>
          </div>

          <button
            type="button"
            onClick={() => {
              signOut();
              navigate("/login");
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-100 bg-white/80 px-4 py-3 font-semibold text-slateglass transition hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </aside>

        <main className="space-y-4">
          <header className="glass-panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <button
                className="mt-1 rounded-xl bg-white/70 p-2 text-brand-600 shadow-sm transition-all hover:bg-white lg:hidden dark:bg-slate-900 dark:text-mint dark:hover:bg-slate-800"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Menüyü aç"
              >
                <Menu size={24} />
              </button>
              <div>
                <div className="font-display text-3xl font-black text-night md:text-4xl dark:text-white">Memnuniyet Paneli</div>
                <div className="mt-2 max-w-3xl text-sm leading-6 text-slateglass/72 md:text-base dark:text-slate-300">
                  Hasta deneyimini tek ekrandan izleyin, anketleri yönetin, şikayetleri takip edin ve birim bazlı raporlara ulaşın.
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="action-button-secondary !rounded-xl !px-4 !py-3" onClick={() => navigate("/anketler/yeni")}>
                <Plus size={17} className="mr-2" />
                Yeni Anket
              </button>
              <button type="button" className="action-button-secondary !rounded-xl !px-4 !py-3" onClick={() => window.print()}>
                <Download size={17} className="mr-2" />
                Rapor İndir
              </button>
              <button
                type="button"
                className="rounded-xl bg-white/90 p-3 shadow-sm transition hover:bg-white dark:bg-slate-900 dark:hover:bg-slate-800"
                onClick={() => setDarkMode((value) => !value)}
                aria-label={darkMode ? "Gündüz moduna geç" : "Gece moduna geç"}
              >
                {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-brand-600" />}
              </button>
              <div className="rounded-xl bg-white/90 p-3 shadow-sm dark:bg-slate-900">
                <Bell size={18} className="text-brand-600 dark:text-mint" />
              </div>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

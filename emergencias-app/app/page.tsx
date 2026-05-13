'use client'

import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Flame, 
  Contact, 
  ClipboardList, 
  ShieldCheck, 
  Bell, 
  UserCircle, 
  Menu,
  LogOut,
  UserPlus,
  LogIn,
  Languages,
  X,
  Bot,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSOSAlerts } from '@/hooks/useSOSAlerts';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { DirectoryView } from '@/components/dashboard/DirectoryView';
import { ReportView } from '@/components/dashboard/ReportView';
import { SOSView } from '@/components/dashboard/SOSView';
import { translations, Language } from '@/lib/translations';
import Link from 'next/link';

type View = 'dashboard' | 'directory' | 'report' | 'sos';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [lang, setLang] = useState<Language>('es');
  const { user, signOut } = useAuth();
  const { alerts, addAlert, markAllRead, closeAlert, unreadCount } = useSOSAlerts();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);
  
  const t = translations[lang];

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setIsAlertsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex text-on-surface bg-surface overflow-hidden relative font-sans">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 768 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Floating SOS Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleViewChange('sos')}
        className="fixed bottom-6 right-6 z-[90] w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-surface pulsate-sos group"
      >
        <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
        <Bot className="w-8 h-8 relative z-10 group-hover:animate-bounce" />
      </motion.button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[120] w-72 bg-surface-container-low border-r border-outline-variant
        transition-transform duration-500 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="w-10 h-10 shadow-lg rounded-xl shrink-0" />
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1">
                <span className="font-black text-lg tracking-tighter text-on-surface uppercase">EMERGENC</span>
                <motion.span 
                  animate={{ 
                    color: ['#af101a', '#ff0000', '#af101a'],
                    textShadow: ['0 0 5px #af101a', '0 0 20px #ff0000', '0 0 5px #af101a'],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="font-black text-2xl tracking-tighter uppercase"
                >
                  IA
                </motion.span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 hover:bg-error/10 text-error rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 mb-10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-primary bg-surface-container-high shrink-0 shadow-lg">
            {user?.email ? (
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                alt="Informador" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary/40">
                <UserCircle className="w-full h-full p-2" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-black text-[10px] truncate uppercase tracking-tight leading-none mb-1">{user?.full_name || t.guest}</p>
            <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-[0.2em] truncate opacity-50">{user ? t.dispatcher : t.limited_access}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4">
          <NavItem 
            active={currentView === 'dashboard'} 
            onClick={() => handleViewChange('dashboard')}
            icon={<LayoutDashboard className="w-4 h-4" />}
            label={t.dashboard}
          />
          <NavItem 
            active={currentView === 'report'} 
            onClick={() => handleViewChange('report')}
            icon={<Flame className="w-4 h-4" />}
            label={t.incidents}
          />
          <NavItem 
            active={currentView === 'directory'} 
            onClick={() => handleViewChange('directory')}
            icon={<Contact className="w-4 h-4" />}
            label={t.directory}
          />
          <NavItem 
            active={currentView === 'sos'} 
            onClick={() => handleViewChange('sos')}
            icon={<ShieldCheck className="w-4 h-4" />}
            label={t.protocol}
          />
        </nav>

        <div className="p-8 mt-auto space-y-4">
          <div className="p-4 bg-primary/5 text-primary rounded-2xl border border-primary/20">
            <p className="font-black text-[9px] uppercase tracking-[0.3em]">{t.system_live}</p>
            <p className="text-[9px] mt-1 text-on-surface-variant font-bold uppercase opacity-60">{t.connectivity}</p>
          </div>
          <div className="text-center">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40">{t.created_by}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-surface h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 flex justify-between items-center px-4 md:px-8 border-b border-outline-variant shrink-0 bg-surface/90 backdrop-blur-xl z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 hover:bg-surface-container-high rounded-full transition-all"
            >
              <Menu className="w-6 h-6 text-primary" />
            </button>
            <div className="flex flex-col">
              <h2 className="font-black text-xs md:text-sm text-primary uppercase tracking-[0.3em] hidden sm:block">
                {currentView === 'dashboard' && t.dashboard}
                {currentView === 'directory' && t.directory}
                {currentView === 'report' && t.incidents}
                {currentView === 'sos' && t.protocol}
              </h2>
              <span className="text-[8px] font-black text-on-surface-variant/40 tracking-[0.2em] hidden sm:block uppercase">SISTEMA CORE V1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-container-high rounded-xl transition-all border-2 border-outline-variant"
            >
              <Languages className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">{lang}</span>
            </button>

            <div className="relative" ref={alertsRef}>
              <button
                onClick={() => { setIsAlertsOpen(v => !v); markAllRead(); }}
                className="p-2 hover:bg-surface-container-high rounded-full relative"
              >
                <Bell className="w-5 h-5 text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-[8px] font-black text-white rounded-full border-2 border-surface flex items-center justify-center shadow-lg animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isAlertsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-surface-container-lowest border-2 border-outline-variant rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                      <div>
                        <p className="font-black text-xs uppercase tracking-[0.2em]">Alertas SOS</p>
                        <p className="text-[9px] text-on-surface-variant mt-0.5">{alerts.length} alertas enviadas</p>
                      </div>
                    </div>

                    <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                      {alerts.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-8 h-8 text-on-surface-variant/20 mx-auto mb-2" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">Sin alertas</p>
                        </div>
                      ) : (
                        alerts.map(alert => (
                          <div key={alert.id} className="p-4 border-b border-outline-variant hover:bg-surface-container-low transition-all">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${alert.status === 'active' ? 'bg-error/10 text-error' : 'bg-outline-variant/30 text-on-surface-variant'}`}>
                                {alert.status === 'active' ? 'Activa' : 'Cerrada'}
                              </span>
                              <span className="text-[8px] font-mono text-on-surface-variant/60">
                                {new Date(alert.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="font-black text-[10px] font-mono tracking-tight text-primary">{alert.id}</p>
                            {alert.transcript && (
                              <p className="text-[10px] text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">{alert.transcript}</p>
                            )}
                            <p className="text-[9px] font-mono text-primary/50 mt-1">{alert.locationLabel}</p>
                            {alert.status === 'active' && (
                              <button
                                onClick={() => closeAlert(alert.id)}
                                className="mt-2 text-[8px] font-black uppercase tracking-widest text-on-surface-variant/50 hover:text-error transition-colors"
                              >
                                Cerrar incidente
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-3 p-1 pr-4 rounded-xl transition-all border-2 border-outline-variant ${isUserMenuOpen ? 'bg-primary border-primary text-white shadow-lg' : 'hover:bg-surface-container-high'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-[11px] font-black shadow-inner">
                   {user?.full_name?.charAt(0) || <UserCircle className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">{user?.full_name?.split(' ')[0] || t.guest}</span>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.9 }}
                    className="absolute right-0 mt-3 w-64 bg-surface-container-lowest border-2 border-outline-variant rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-6 border-b border-outline-variant bg-surface-container-low">
                      <p className="font-black text-sm uppercase tracking-tight">{user?.full_name || t.guest}</p>
                      <p className="text-[9px] text-on-surface-variant uppercase font-bold tracking-widest truncate opacity-60 mt-1">{user?.email || t.limited_access}</p>
                    </div>
                    
                    <div className="p-2">
                      {!user ? (
                        <>
                          <Link href="/auth/login" className="flex items-center gap-3 w-full p-4 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary rounded-xl transition-all">
                            <LogIn className="w-4 h-4" />
                            {t.login}
                          </Link>
                          <Link href="/auth/register" className="flex items-center gap-3 w-full p-4 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary rounded-xl transition-all">
                            <UserPlus className="w-4 h-4" />
                            {t.register}
                          </Link>
                        </>
                      ) : (
                        <>
                          <button className="flex items-center gap-3 w-full p-4 text-[10px] font-black uppercase tracking-widest hover:bg-surface-container-high rounded-xl transition-all">
                            <UserCircle className="w-4 h-4 text-primary" />
                            {t.profile}
                          </button>
                          <button 
                            onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                            className="flex items-center gap-3 w-full p-4 text-[10px] font-black uppercase tracking-widest text-error hover:bg-error/5 rounded-xl transition-all"
                          >
                            <LogOut className="w-4 h-4" />
                            {t.logout}
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-surface custom-scrollbar">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && <DashboardView key="dashboard" onReport={() => setCurrentView('report')} lang={lang} sosAlerts={alerts} onCloseAlert={closeAlert} />}
            {currentView === 'directory' && <DirectoryView key="directory" lang={lang} />}
            {currentView === 'report' && <ReportView key="report" onBack={() => setCurrentView('dashboard')} lang={lang} />}
            {currentView === 'sos' && <SOSView key="sos" onCancel={() => setCurrentView('dashboard')} onAlertSent={addAlert} lang={lang} />}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="h-10 border-t border-outline-variant bg-surface-container-lowest px-8 flex items-center justify-between shrink-0">
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-on-surface-variant/40">{t.created_by}</p>
          <div className="flex gap-4">
             <span className="text-[8px] font-black uppercase tracking-widest text-primary/40">Conexión Encriptada</span>
             <span className="text-[8px] font-black uppercase tracking-widest text-primary/40">SISTEMA CORE V1.0</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-4 py-4 pl-6 w-full text-left transition-all relative rounded-2xl mb-1 group
        ${active 
          ? 'bg-primary text-white shadow-xl' 
          : 'text-on-surface-variant hover:bg-surface-container-high font-black text-[9px] uppercase tracking-[0.2em]'}
      `}
    >
      <div className={active ? 'text-white' : 'text-primary opacity-60 group-hover:opacity-100 transition-opacity'}>{icon}</div>
      <span className={active ? 'font-black tracking-[0.2em] uppercase text-[9px]' : ''}>{label}</span>
    </button>
  );
}

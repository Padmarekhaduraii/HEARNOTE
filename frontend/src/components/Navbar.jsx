import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Radio, LayoutDashboard, History, Menu, X, Plus, Headphones } from 'lucide-react';
import { isMockMode } from '../services/api';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mockActive = isMockMode();

  const navLinks = [
    { to: '/', label: 'Overview', icon: Headphones, end: true },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/live', label: 'Live Lecture', icon: Radio, badge: 'LIVE' },
    { to: '/lectures', label: 'Previous Lectures', icon: History }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-cyan-400 rounded-full animate-wave-1"></span>
                  <span className="w-1 h-5 bg-indigo-400 rounded-full animate-wave-2"></span>
                  <span className="w-1 h-4 bg-purple-400 rounded-full animate-wave-3"></span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  Hear<span className="text-cyan-400">Note</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  DHH Access
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide -mt-0.5">
                Every word. Never missed.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="relative flex h-2 w-2 ml-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action & Status Badge */}
          <div className="hidden sm:flex items-center gap-3">
            {mockActive && (
              <span
                className="text-[11px] font-mono px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-400"
                title="Frontend mock mode active. No backend server required for demo."
              >
                Offline Ready
              </span>
            )}

            <Link
              to="/live"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-cyan-950/50 focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Plus className="w-4 h-4" />
              <span>Start Lecture</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/live"
              className="p-2 rounded-lg bg-cyan-600 text-white"
              aria-label="Start Lecture"
            >
              <Plus className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}

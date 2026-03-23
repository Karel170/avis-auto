import { Menu, Star } from 'lucide-react';

export default function MobileHeader({ onMenuClick }) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md flex items-center justify-between px-4">
      {/* Hamburger button - gauche */}
      <button
        onClick={onMenuClick}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo - droite */}
      <div className="flex items-center gap-2.5">
        <span className="text-base font-bold text-white tracking-tight">AvisAuto</span>
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <Star className="w-3.5 h-3.5 text-white" fill="white" />
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-baseline gap-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">UTOPIE 3D</h1>
              <span className="text-xs md:text-sm text-emerald-400 font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                NIRD Edition
              </span>
            </div>
            <p className="text-sm text-gray-400">Plateforme Digital Twin • Fabrication Additive Responsable</p>
          </div>

          <div className="hidden md:block text-right space-y-2">
            <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Monde virtuel • Monde réel • Autonomie numérique</span>
            </div>
            <p className="text-xs text-gray-600">Inclusion • Responsabilité • Durabilité</p>
          </div>
        </div>
      </div>
    </header>
  )
}

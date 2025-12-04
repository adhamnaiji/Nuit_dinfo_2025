"use client"

import { Badge } from "@/components/ui/badge"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface UserProgress {
  points: number
  level: number
  completedChallenges: string[]
  badges: string[]
}

interface DashboardTabProps {
  userProgress: UserProgress
}

export default function DashboardTab({ userProgress }: DashboardTabProps) {
  // Organization digital twin metrics aligned with UTOPIE 3D + NIRD
  const metrics = {
    linuxAdoption: 65,
    materialReuse: 42,
    openSourceAdoption: 78,
    gafamIndependence: 55,
    sustainabilityScore: 68,
    manufacturingEfficiency: 82,
  }

  const calculateOverallScore = () => {
    const values = Object.values(metrics)
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 backdrop-blur border border-white/10 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Tableau de Bord Digital Twin</h2>
        <p className="text-gray-400">Métriques d'autonomie et de durabilité pour UTOPIE 3D</p>
      </div>

      {/* Overall Score */}
      <Card className="bg-black/40 backdrop-blur border border-white/10 p-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">Score Global d'Autonomie</p>
          <div className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
            {calculateOverallScore()}%
          </div>
          <Progress value={calculateOverallScore()} className="h-3" />
          <p className="text-sm text-gray-500 mt-4">Indépendance de votre infrastructure numérique</p>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Adoption Linux"
          value={metrics.linuxAdoption}
          description="Systèmes utilisant des OS libres"
          icon="🐧"
        />
        <MetricCard
          title="Réutilisation Matériaux"
          value={metrics.materialReuse}
          description="Optimisation du cycle de vie équipement"
          icon="♻️"
        />
        <MetricCard
          title="Open Source"
          value={metrics.openSourceAdoption}
          description="Logiciels utilisant des solutions libres"
          icon="🔓"
        />
        <MetricCard
          title="Indépendance GAFAM"
          value={metrics.gafamIndependence}
          description="Libération de la dépendance Big Tech"
          icon="🗽"
        />
        <MetricCard
          title="Durabilité"
          value={metrics.sustainabilityScore}
          description="Consommation numérique responsable"
          icon="🌱"
        />
        <MetricCard
          title="Efficacité Fabrication"
          value={metrics.manufacturingEfficiency}
          description="Optimisation du processus 3D"
          icon="🏭"
        />
      </div>

      {/* UTOPIE 3D + NIRD Integration */}
      <Card className="bg-black/40 backdrop-blur border border-white/10 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Principes UTOPIE 3D + NIRD</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Fabrication Autonome",
              description: "Chaîne de production 100% contrôlée localement et numériquement",
            },
            {
              title: "Logiciels Libres",
              description: "CAO, slicing, et pilotage d'imprimantes en open source",
            },
            {
              title: "Économie Circulaire",
              description: "Matériaux recyclables et réutilisables pour la fabrication additive",
            },
            {
              title: "Zéro GAFAM",
              description: "Aucune dépendance aux services cloud propriétaires",
            },
            {
              title: "Responsabilité",
              description: "Transparence totale du processus et traçabilité des matériaux",
            },
            {
              title: "Durabilité",
              description: "Réduction de l'empreinte carbone et valorisation locale",
            },
          ].map((principle, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-white/10 rounded-lg p-4"
            >
              <h4 className="font-semibold text-white mb-2">{principle.title}</h4>
              <p className="text-sm text-gray-400">{principle.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Manufacturing Pipeline */}
      <Card className="bg-black/40 backdrop-blur border border-white/10 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Pipeline de Fabrication</h3>
        <div className="space-y-3">
          {[
            { step: "1", name: "Design 3D", tool: "FreeCAD", status: "✓ Libre" },
            { step: "2", name: "Préparation", tool: "PrusaSlicer", status: "✓ Open" },
            { step: "3", name: "Impression", tool: "Marlin/Klipper", status: "✓ Autonome" },
            { step: "4", name: "Post-Traitement", tool: "Manuel/Local", status: "✓ Durable" },
          ].map((stage, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-black/50 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center font-bold text-white">
                {stage.step}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">{stage.name}</p>
                <p className="text-xs text-gray-500">{stage.tool}</p>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">{stage.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number
  description: string
  icon: string
}

function MetricCard({ title, value, description, icon }: MetricCardProps) {
  return (
    <Card className="bg-black/40 backdrop-blur border border-white/10 p-6 hover:border-violet-500/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-white">{title}</h4>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-violet-400 mb-2">{value}%</div>
      <Progress value={value} className="h-2 mb-2" />
      <p className="text-xs text-gray-400">{description}</p>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, CheckCircle2, AlertCircle } from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  fullContent: string
  points: number
  difficulty: "easy" | "medium" | "hard"
  category: string
  resources: string[]
}

interface UserProgress {
  points: number
  level: number
  completedChallenges: string[]
  badges: string[]
}

const CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Explorateur Linux",
    description: "Découvrez les avantages de Linux pour la fabrication 3D autonome",
    fullContent: `Linux est un système d'exploitation open-source qui offre de nombreux avantages pour les makers et les professionnels de la fabrication 3D.

🎯 OBJECTIFS:
• Comprendre les bases de Linux
• Installer une distribution Linux (Ubuntu, Fedora)
• Explorer le système de fichiers
• Apprendre les commandes essentielles

📚 CONTENU DÉTAILLÉ:

1. Pourquoi Linux pour la fabrication 3D?
   - Stabilité et fiabilité supérieures
   - Communauté active de makers
   - Compatibilité avec les outils CAO open-source
   - Coûts réduits (gratuit et open-source)
   - Performance optimale sur matériel ancien

2. Distributions recommandées:
   - Ubuntu: Facile pour les débutants
   - Fedora: Très stable, mises à jour fréquentes
   - Linux Mint: Interface intuitive
   - Arch Linux: Pour utilisateurs avancés

3. Premiers pas:
   - Créer une clé USB bootable
   - Installation dual-boot ou virtualisation
   - Configuration de base du système
   - Installation d'outils de CAO (FreeCAD, OpenSCAD)

4. Commandes essentielles:
   - Terminal et navigation
   - Gestion des fichiers
   - Permissions et utilisateurs
   - Installation de paquets

✅ RÉSULTAT ATTENDU:
Vous aurez Linux opérationnel avec au minimum une application de CAO installée et fonctionnelle.`,
    points: 10,
    difficulty: "easy",
    category: "system",
    resources: [
      "https://ubuntu.com",
      "https://www.freecadweb.org/",
      "https://wiki.debian.org/fr/FrontPage"
    ]
  },
  {
    id: "2",
    title: "Alternative Open Source",
    description: "Remplacez un logiciel GAFAM par une alternative libre pour la CAO",
    fullContent: `Découvrez comment remplacer les outils propriétaires par des alternatives open-source et libres pour vos projets de CAO.

🎯 OBJECTIFS:
• Identifier les alternatives aux logiciels GAFAM
• Maîtriser un outil CAO open-source
• Créer un modèle 3D complet
• Exporter en formats standards (STL, STEP)

📚 CONTENU DÉTAILLÉ:

1. Les alternatives open-source:
   FreeCAD → Alternative à Autodesk Fusion 360
   LibreCAD → Alternative à AutoCAD 2D
   OpenSCAD → Programmation 3D paramétrique
   Blender → Modélisation avancée et rendu

2. Avantages des logiciels libres:
   - Pas de licence coûteuse
   - Accès au code source
   - Contrôle total sur vos données
   - Pas de limitation de fonctionnalités
   - Communauté bienveillante
   - Mises à jour régulières et gratuites

3. Tutoriel FreeCAD (niveau moyen):
   - Interface et outils principaux
   - Création de sketches 2D
   - Extrusion et opérations booléennes
   - Assemblage de pièces
   - Export STL pour impression 3D

4. Tutoriel OpenSCAD (paramétrique):
   - Syntaxe de base
   - Primitives géométriques
   - Opérations de transformation
   - Boucles et variables
   - Génération procédurale de formes

✅ RÉSULTAT ATTENDU:
Vous aurez créé un modèle 3D complet (minimum 2 pièces assemblées) exporté en STL et prêt pour l'impression 3D.`,
    points: 25,
    difficulty: "medium",
    category: "software",
    resources: [
      "https://www.freecadweb.org/",
      "https://openscad.org/",
      "https://www.blender.org/",
      "https://librecad.org/"
    ]
  },
  {
    id: "3",
    title: "Matériaux Durables",
    description: "Étudiez les plastiques écologiques et recyclables pour l'impression 3D",
    fullContent: `Explorez les matériaux écologiques et durables disponibles pour l'impression 3D et leurs impacts environnementaux.

🎯 OBJECTIFS:
• Connaître les matériaux écologiques
• Comprendre les propriétés techniques
• Évaluer l'impact environnemental
• Tester l'impression avec ces matériaux

📚 CONTENU DÉTAILLÉ:

1. Matériaux écologiques disponibles:
   
   PLA (Acide Polylactique):
   - Source: Amidon de maïs ou canne à sucre
   - Biodégradable (conditions industrielles)
   - Température basse: 190-210°C
   - Moins résistant, idéal pour prototypes
   
   PHA (Polyhydroxyalcanoates):
   - Biodégradable naturellement
   - Propriétés similaires au PET
   - Plus cher que PLA
   - Decomposition: 6 mois en compost
   
   PETG Recyclé:
   - Fabriqué à partir de bouteilles plastiques
   - Résistance mécanique excellente
   - Température: 220-250°C
   - Réduction d'énergie par rapport au neuf
   
   ASA Biosourcé:
   - Partiellement d'origine biologique
   - Résistance aux UV
   - Durable et respectueux de l'environnement

2. Certification et labels:
   - Cradle-to-Cradle
   - EU Ecolabel
   - Carbon Trust Standard
   - Declarations environnementales EPD

3. Comparaison de l'empreinte carbone:
   - ABS: ~6 kg CO2/kg produit
   - PLA classique: ~1.5 kg CO2/kg produit
   - PLA recyclé: ~0.5 kg CO2/kg produit
   - PETG recyclé: ~2 kg CO2/kg produit

4. Impressions de test:
   - Benchy (test standard)
   - Pièces fonctionnelles
   - Évaluation de la qualité
   - Comportement thermique

✅ RÉSULTAT ATTENDU:
Vous aurez testé au minimum 3 matériaux écologiques, évalué leur performance et créé un rapport comparatif.`,
    points: 50,
    difficulty: "hard",
    category: "materials",
    resources: [
      "https://www.3dnatives.com/",
      "https://www.protolabs.co.uk/",
      "https://ultimaker.com/"
    ]
  },
  {
    id: "4",
    title: "Économie Circulaire",
    description: "Documentez un projet de réutilisation de matériaux imprimés",
    fullContent: `Mettez en pratique les principes de l'économie circulaire en documentant un projet complet de réutilisation.

🎯 OBJECTIFS:
• Identifier des matériaux à recycler
• Concevoir un produit de seconde vie
• Implémenter le cycle complet
• Documenter les résultats

📚 CONTENU DÉTAILLÉ:

1. Principes de l'économie circulaire:
   - Elimination du concept de déchet
   - Produits durables et réparables
   - Utilisation de matériaux recyclables
   - Restoration et upcycling
   - Boucles de retour des produits

2. Projet de réutilisation:
   Exemple 1: Recycler des impressions échouées
   Exemple 2: Créer du filament à partir de scraps
   Exemple 3: Réutiliser pour des pièces de rechange
   Exemple 4: Transformation créative

3. Étapes du projet:
   - Collecte des matériaux (minimum 500g)
   - Tri et nettoyage
   - Conception de la nouvelle pièce
   - Impression et test
   - Documentation photo/vidéo

4. Impact mesuré:
   - Poids de matériau recycled/réutilisé
   - Déchets évités
   - Économies d'énergie
   - Économies financières

✅ RÉSULTAT ATTENDU:
Un projet documenté avec photos, vidéos et rapport montrant la transformation complète d'un déchet en produit fonctionnel.`,
    points: 15,
    difficulty: "easy",
    category: "sustainability",
    resources: [
      "https://www.ellenmacarthurfoundation.org/",
      "https://www.weforum.org/"
    ]
  },
  {
    id: "5",
    title: "Autonomie Numérique",
    description: "Configurez une chaîne de fabrication 100% autonome et locale",
    fullContent: `Créez une chaîne de production complètement autonome, locale et utilisant uniquement des outils open-source.

🎯 OBJECTIFS:
• Mettre en place un workflow complet
• Utiliser des outils open-source
• Assurer la reproducibilité
• Documenter la chaîne

📚 CONTENU DÉTAILLÉ:

1. Chaîne de fabrication complète:
   
   Conception:
   - FreeCAD pour la modélisation
   - OpenSCAD pour la paramétrique
   - Inkscape pour la gravure laser
   
   Préparation:
   - Cura (open-source) pour les slices
   - PrusaSlicer (partiellement OSS)
   - Configuration des paramètres
   
   Production:
   - Imprimante open-source (RepRap, Prusa)
   - Système de contrôle (Marlin firmware)
   - Supervision locale uniquement
   
   Post-traitement:
   - Outils locaux (sablage, finition)
   - Nettoyage et inspection
   - Assemblage local

2. Infrastructure autonome:
   - Serveur local pour hébergement de données
   - Gestion de version GIT locale
   - Sauvegarde décentralisée
   - Pas de dépendance cloud obligatoire

3. Reproducibilité:
   - Versionnage des fichiers
   - Documentation complète
   - Scripts d'automatisation
   - Partage via git/IPFS

4. Métriques d'autonomie:
   - Traçabilité 100% locale
   - Aucune donnée vers cloud GAFAM
   - Indépendance des fournisseurs
   - Coût de production faible

✅ RÉSULTAT ATTENDU:
Une chaîne de production documentée capable de fabriquer des produits sans dépendance externe, avec tous les fichiers et scripts partagés publiquement.`,
    points: 30,
    difficulty: "medium",
    category: "autonomy",
    resources: [
      "https://reprap.org/",
      "https://www.prusa3d.com/",
      "https://marlinfw.org/"
    ]
  },
  {
    id: "6",
    title: "Champion NIRD",
    description: "Complétez toutes les missions et obtenez la certification d'excellence",
    fullContent: `Atteindre le titre de Champion NIRD en complétant l'ensemble des missions et en démontrant votre expertise.

🎯 OBJECTIFS:
• Compléter les 5 missions précédentes
• Maîtriser tous les aspects
• Créer un projet personnel intégrant tout
• Obtenir la certification officielle

📚 CONTENU DÉTAILLÉ:

1. Vérification des prérequis:
   ✓ Linux configuré et opérationnel
   ✓ Logiciels CAO open-source maîtrisés
   ✓ Matériaux écologiques testés
   ✓ Projet d'économie circulaire documenté
   ✓ Chaîne d'autonomie numériques établie

2. Projet capstone (intégration):
   Créer un produit complet qui:
   - Est conçu avec FreeCAD/OpenSCAD
   - Utilise matériaux écologiques
   - Est imprimé avec votre chaîne autonome
   - Intègre principes d'économie circulaire
   - Est documenté pour reproduction

3. Critères d'excellence:
   - Qualité technique supérieure
   - Innovation et créativité
   - Documentation exhaustive
   - Code source/fichiers publiés
   - Impact communautaire
   - Partage d'apprentissage

4. Exigences de certification:
   - Portfolio complet des 5 missions
   - Vidéo de présentation (5-10 min)
   - Code/fichiers open-source publié
   - Article blog/documentation
   - Engagement communautaire

✅ RÉSULTAT ATTENDU:
Vous serez reconnu comme Champion NIRD avec un portfolio public, une certification officielle, et une inscription au hall of fame communautaire.`,
    points: 100,
    difficulty: "hard",
    category: "master",
    resources: [
      "https://www.nird.org/",
      "https://www.fabacademy.org/"
    ]
  },
]

const BADGES = [
  { id: "novice", name: "Apprenti 3D", threshold: 30 },
  { id: "maker", name: "Maker Responsable", threshold: 75 },
  { id: "expert", name: "Expert NIRD", threshold: 150 },
  { id: "pioneer", name: "Pionnier Durable", threshold: 200 },
  { id: "champion", name: "Champion NIRD", threshold: 300 },
]

interface ChallengesTabProps {
  userProgress: UserProgress
  setUserProgress: (progress: UserProgress) => void
}

export default function ChallengesTab({ userProgress, setUserProgress }: ChallengesTabProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [hasReadContent, setHasReadContent] = useState(false)
  const [manualReadConfirm, setManualReadConfirm] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const filteredChallenges =
    selectedDifficulty === "all" ? CHALLENGES : CHALLENGES.filter((c) => c.difficulty === selectedDifficulty)

  const handleOpenChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setHasReadContent(false)
    setManualReadConfirm(false)
    setScrollProgress(0)
  }

  const handleContentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100 || 0
    setScrollProgress(scrollPercentage)

    // Marquer comme lu si scroll atteint 80%
    if (scrollPercentage > 80 && !hasReadContent) {
      setHasReadContent(true)
    }
  }

  const handleCompleteChallenge = (challengeId: string) => {
    if (!userProgress.completedChallenges.includes(challengeId)) {
      const challenge = CHALLENGES.find((c) => c.id === challengeId)
      if (challenge) {
        const newPoints = userProgress.points + challenge.points
        const newLevel = Math.floor(newPoints / 100) + 1
        const newBadges = BADGES.filter((badge) => newPoints >= badge.threshold).map((b) => b.id)

        setUserProgress({
          ...userProgress,
          points: newPoints,
          level: newLevel,
          completedChallenges: [...userProgress.completedChallenges, challengeId],
          badges: newBadges,
        })

        setSelectedChallenge(null)
        setHasReadContent(false)
        setManualReadConfirm(false)
      }
    }
  }

  const nextBadge = BADGES.find((b) => userProgress.points < b.threshold)
  const progressToNextBadge = nextBadge
    ? ((userProgress.points % 100) / (nextBadge.threshold - (userProgress.points - (userProgress.points % 100)))) * 100
    : 100

  return (
    <div className="space-y-6">
      {/* Progress Section */}
      <Card className="bg-black/40 backdrop-blur border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400">Points Totaux</p>
            <p className="text-3xl font-bold text-white mt-2">{userProgress.points}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400">Niveau</p>
            <p className="text-3xl font-bold text-white mt-2">{userProgress.level}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400">Missions</p>
            <p className="text-3xl font-bold text-white mt-2">{userProgress.completedChallenges.length}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400">Badges</p>
            <p className="text-3xl font-bold text-white mt-2">{userProgress.badges.length}</p>
          </div>
        </div>

        {nextBadge && (
          <div className="mt-6">
            <p className="text-sm text-gray-400 mb-2">Progression vers {nextBadge.name}</p>
            <Progress value={Math.min(progressToNextBadge, 100)} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">
              {userProgress.points} / {nextBadge.threshold} points
            </p>
          </div>
        )}
      </Card>

      {/* Badges Section */}
      {userProgress.badges.length > 0 && (
        <Card className="bg-black/40 backdrop-blur border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Badges Obtenus</h3>
          <div className="flex flex-wrap gap-2">
            {BADGES.filter((b) => userProgress.badges.includes(b.id)).map((badge) => (
              <Badge key={badge.id} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-2">
                {badge.name}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Difficulty Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "easy", "medium", "hard"].map((difficulty) => (
          <Button
            key={difficulty}
            onClick={() => setSelectedDifficulty(difficulty)}
            variant={selectedDifficulty === difficulty ? "default" : "outline"}
            className={
              selectedDifficulty === difficulty
                ? "bg-gradient-to-r from-amber-600 to-orange-600 border-0"
                : "bg-black/40 border-white/10 text-white hover:bg-white/10"
            }
          >
            {difficulty === "all"
              ? "Toutes"
              : difficulty === "easy"
                ? "Facile"
                : difficulty === "medium"
                  ? "Moyen"
                  : "Difficile"}
          </Button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChallenges.map((challenge) => (
          <Card
            key={challenge.id}
            className={`bg-black/40 backdrop-blur border rounded-lg p-6 transition-all cursor-pointer ${
              userProgress.completedChallenges.includes(challenge.id)
                ? "border-green-500/50 bg-green-500/10"
                : "border-white/10 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20"
            }`}
            onClick={() => handleOpenChallenge(challenge)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-white">{challenge.title}</h3>
              <Badge
                variant="outline"
                className={`${
                  challenge.difficulty === "easy"
                    ? "border-green-500 text-green-300"
                    : challenge.difficulty === "medium"
                      ? "border-yellow-500 text-yellow-300"
                      : "border-red-500 text-red-300"
                }`}
              >
                {challenge.difficulty === "easy" ? "Facile" : challenge.difficulty === "medium" ? "Moyen" : "Difficile"}
              </Badge>
            </div>

            <p className="text-sm text-gray-400 mb-4">{challenge.description}</p>

            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-amber-400">{challenge.points} pts</span>
              {userProgress.completedChallenges.includes(challenge.id) ? (
                <div className="flex items-center gap-1 text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">Complétée</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400">Cliquez pour commencer</span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-900 border border-amber-500/30 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedChallenge.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={`${
                      selectedChallenge.difficulty === "easy"
                        ? "bg-green-600"
                        : selectedChallenge.difficulty === "medium"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                    }`}
                  >
                    {selectedChallenge.difficulty === "easy" ? "Facile" : selectedChallenge.difficulty === "medium" ? "Moyen" : "Difficile"}
                  </Badge>
                  <Badge className="bg-amber-600">{selectedChallenge.points} points</Badge>
                </div>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div
              className="flex-1 overflow-y-auto p-6 space-y-4"
              onScroll={handleContentScroll}
            >
              {selectedChallenge.fullContent.split("\n\n").map((section, idx) => (
                <div key={idx}>
                  {section.split("\n").map((line, lineIdx) => {
                    if (line.startsWith("###")) {
                      return <h4 key={lineIdx} className="text-lg font-semibold text-amber-300 mt-4">{line.replace("###", "").trim()}</h4>
                    } else if (line.startsWith("##")) {
                      return <h3 key={lineIdx} className="text-xl font-bold text-white mt-4">{line.replace("##", "").trim()}</h3>
                    } else if (line.startsWith("   -")) {
                      return <li key={lineIdx} className="text-gray-300 ml-6">{line.replace("   -", "").trim()}</li>
                    } else if (line.startsWith("•")) {
                      return <li key={lineIdx} className="text-gray-300 ml-6">{line.replace("•", "").trim()}</li>
                    } else if (line.startsWith("✓")) {
                      return <li key={lineIdx} className="text-green-300 ml-6 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {line.replace("✓", "").trim()}</li>
                    } else if (line.trim() === "") {
                      return null
                    } else {
                      return <p key={lineIdx} className="text-gray-300 leading-relaxed">{line}</p>
                    }
                  })}
                </div>
              ))}

              {/* Resources */}
              {selectedChallenge.resources.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="font-semibold text-white mb-3">Ressources utiles</h4>
                  <ul className="space-y-2">
                    {selectedChallenge.resources.map((resource, idx) => (
                      <li key={idx}>
                        <a
                          href={resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm break-all"
                        >
                          {resource}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-3 bg-black/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Lecture du contenu</span>
                <span className="text-xs text-amber-400">{Math.round(scrollProgress)}%</span>
              </div>
              <Progress value={scrollProgress} className="h-1.5" />
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 p-6 border-t border-white/10 bg-black/20">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <input
                  id="confirm-read"
                  type="checkbox"
                  checked={manualReadConfirm}
                  onChange={(e) => setManualReadConfirm(e.target.checked)}
                  disabled={!hasReadContent}
                  className="h-4 w-4 rounded border-gray-500 bg-black/40 cursor-pointer accent-green-500"
                />
                <label htmlFor="confirm-read" className="cursor-pointer flex-1">
                  Je confirme avoir lu et compris le contenu de ce challenge
                </label>
              </div>

              {!hasReadContent && (
                <p className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Faites défiler le contenu (au moins 80%) pour activer la confirmation de lecture.
                </p>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setSelectedChallenge(null)}
                  variant="outline"
                  className="flex-1 bg-black/40 border-white/10 hover:bg-white/10 text-white"
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => handleCompleteChallenge(selectedChallenge.id)}
                  disabled={
                    !hasReadContent ||
                    !manualReadConfirm ||
                    userProgress.completedChallenges.includes(selectedChallenge.id)
                  }
                  className={`flex-1 transition ${
                    hasReadContent && manualReadConfirm
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      : "bg-gray-600 cursor-not-allowed text-gray-300"
                  }`}
                >
                  {userProgress.completedChallenges.includes(selectedChallenge.id) ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Complétée
                    </span>
                  ) : hasReadContent && manualReadConfirm ? (
                    "✓ Valider et compléter"
                  ) : (
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {hasReadContent ? 'Cochez "Je confirme"' : 'Lisez (80%)'}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Challenge {
  id: string
  title: string
  description: string
  points: number
  difficulty: "easy" | "medium" | "hard"
  category: string
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
    points: 10,
    difficulty: "easy",
    category: "system",
  },
  {
    id: "2",
    title: "Alternative Open Source",
    description: "Remplacez un logiciel GAFAM par une alternative libre pour la CAO",
    points: 25,
    difficulty: "medium",
    category: "software",
  },
  {
    id: "3",
    title: "Matériaux Durables",
    description: "Étudiez les plastiques écologiques et recyclables pour l'impression 3D",
    points: 50,
    difficulty: "hard",
    category: "materials",
  },
  {
    id: "4",
    title: "Économie Circulaire",
    description: "Documentez un projet de réutilisation de matériaux imprimés",
    points: 15,
    difficulty: "easy",
    category: "sustainability",
  },
  {
    id: "5",
    title: "Autonomie Numérique",
    description: "Configurez une chaîne de fabrication 100% autonome et locale",
    points: 30,
    difficulty: "medium",
    category: "autonomy",
  },
  {
    id: "6",
    title: "Champion NIRD",
    description: "Complétez toutes les missions et obtenez la certification d'excellence",
    points: 100,
    difficulty: "hard",
    category: "master",
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

  const filteredChallenges =
    selectedDifficulty === "all" ? CHALLENGES : CHALLENGES.filter((c) => c.difficulty === selectedDifficulty)

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
            className={`bg-black/40 backdrop-blur border rounded-lg p-6 transition-all ${
              userProgress.completedChallenges.includes(challenge.id)
                ? "border-green-500/50 bg-green-500/10"
                : "border-white/10 hover:border-amber-500/50"
            }`}
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
              <Button
                onClick={() => handleCompleteChallenge(challenge.id)}
                disabled={userProgress.completedChallenges.includes(challenge.id)}
                className={
                  userProgress.completedChallenges.includes(challenge.id)
                    ? "bg-green-600 hover:bg-green-600"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                }
              >
                {userProgress.completedChallenges.includes(challenge.id) ? "Complétée" : "Compléter"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

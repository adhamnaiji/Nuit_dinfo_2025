"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import DigitalTwinTab from "@/components/tabs/digital-twin-tab"
import STLVisionTab from "@/components/tabs/stl-vision-tab"
import ChallengesTab from "@/components/tabs/challenges-tab"
import DashboardTab from "@/components/tabs/dashboard-tab"

interface UserProgress {
  points: number
  level: number
  completedChallenges: string[]
  badges: string[]
}

export default function Home() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    points: 0,
    level: 1,
    completedChallenges: [],
    badges: [],
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="digital-twin" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur border border-white/10 p-1">
            <TabsTrigger
              value="digital-twin"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600"
            >
              Digital Twin
            </TabsTrigger>
            <TabsTrigger
              value="stl-vision"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600"
            >
              3D Viewer
            </TabsTrigger>
            <TabsTrigger
              value="challenges"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600"
            >
              Missions NIRD
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="digital-twin" className="mt-6">
            <DigitalTwinTab />
          </TabsContent>

          <TabsContent value="stl-vision" className="mt-6">
            <STLVisionTab />
          </TabsContent>

          <TabsContent value="challenges" className="mt-6">
            <ChallengesTab userProgress={userProgress} setUserProgress={setUserProgress} />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6">
            <DashboardTab userProgress={userProgress} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

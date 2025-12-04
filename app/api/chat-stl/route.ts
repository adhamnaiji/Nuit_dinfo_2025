import { NextResponse } from 'next/server'

interface STLInfo {
  name: string
  size: number
  isValid?: boolean
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  triangles?: number
}

export async function POST(request: Request) {
  try {
    const { messages, stlFileInfo } = await request.json()
    
    const apiKey = process.env.PERPLEXITY_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clé API non configurée' },
        { status: 500 }
      )
    }

    console.log('\n📥 === DONNÉES REÇUES ===')
    console.log('Messages:', messages.length)
    console.log('STL Info:', stlFileInfo)

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages invalides' },
        { status: 400 }
      )
    }

    if (messages[messages.length - 1].role !== 'user') {
      return NextResponse.json(
        { error: 'Le dernier message doit être de l\'utilisateur' },
        { status: 400 }
      )
    }

    // ✅ ENHANCE USER MESSAGE WITH FILE INFO
    let enhancedMessages = [...messages]
    const lastMessageIndex = enhancedMessages.length - 1
    const lastUserMessage = enhancedMessages[lastMessageIndex].content

    if (stlFileInfo && stlFileInfo.name) {
      const sizeKB = (stlFileInfo.size / 1024).toFixed(2)
      const sizeBytes = stlFileInfo.size
      const fileName = stlFileInfo.name
      
      const dimensionsText = stlFileInfo.dimensions 
        ? `Largeur: ${stlFileInfo.dimensions.width.toFixed(2)} mm, Hauteur: ${stlFileInfo.dimensions.height.toFixed(2)} mm, Profondeur: ${stlFileInfo.dimensions.depth.toFixed(2)} mm`
        : 'Non disponibles'
      
      const trianglesText = stlFileInfo.triangles ? `${stlFileInfo.triangles}` : 'Non calculé'

      // ✅ ADD FILE INFO DIRECTLY TO USER MESSAGE
      const fileContext = `\n\n[CONTEXTE DU FICHIER UPLOADÉ]
Fichier: ${fileName}
Taille: ${sizeKB} KB (${sizeBytes} octets)
Dimensions: ${dimensionsText}
Triangles: ${trianglesText}`

      enhancedMessages[lastMessageIndex] = {
        role: 'user',
        content: lastUserMessage + fileContext
      }

      console.log('📝 Message amélioré avec contexte fichier:')
      console.log(enhancedMessages[lastMessageIndex].content)
    }

    // ✅ BUILD SYSTEM PROMPT
    const systemPrompt = `Tu es un expert en modélisation 3D et fichiers STL. 
Tu as accès aux informations du fichier uploadé dans les messages de l'utilisateur.
Réponds en français, de manière concise et précise.
Utilise les données du fichier fournies pour répondre aux questions.`

    // ✅ Build final messages
    const finalMessages = [
      { role: 'system', content: systemPrompt },
      ...enhancedMessages
    ]

    console.log('📤 Envoi à Perplexity:')
    console.log('   - Modèle: sonar-pro')
    console.log('   - Messages totaux:', finalMessages.length)
    console.log('   - Dernier message utilisateur:', enhancedMessages[lastMessageIndex].content.substring(0, 200))

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: finalMessages,
        max_tokens: 1024,
        temperature: 0.7
      })
    })

    const data = await response.json()

    console.log('📥 Réponse Perplexity:', response.status)

    if (!response.ok) {
      console.error('❌ Erreur API:', data.error)
      return NextResponse.json(
        { error: data.error?.message || 'Erreur API Perplexity' },
        { status: response.status }
      )
    }

    const reply = data.choices[0].message.content
    console.log('✅ Réponse:', reply.substring(0, 150) + '...\n')

    return NextResponse.json({
      success: true,
      reply: reply
    })

  } catch (error) {
    console.error('❌ Erreur serveur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne: ' + (error instanceof Error ? error.message : 'Inconnu') },
      { status: 500 }
    )
  }
}
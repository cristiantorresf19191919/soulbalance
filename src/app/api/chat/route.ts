import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// Cache for available models (refresh every 5 minutes)
let modelsCache: { models: string[]; timestamp: number } | null = null
const MODELS_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * List available models and return those that support generateContent
 * Uses caching to avoid calling the API on every request
 */
async function getAvailableModels(apiKey: string): Promise<string[]> {
  // Check cache first
  if (modelsCache && Date.now() - modelsCache.timestamp < MODELS_CACHE_TTL) {
    console.log('[Chat] Using cached models:', modelsCache.models)
    return modelsCache.models
  }

  try {
    console.log('[Chat] Fetching available models from API...')
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('[Chat] Failed to list models:', response.status, response.statusText)
      const fallback = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-2.0-flash']
      modelsCache = { models: fallback, timestamp: Date.now() }
      return fallback
    }

    const data = await response.json()
    const availableModels: string[] = []

    if (data.models && Array.isArray(data.models)) {
      for (const model of data.models) {
        if (
          model.supportedGenerationMethods?.includes('generateContent') &&
          model.name &&
          !model.name.includes('vision') &&
          !model.name.includes('embedding') &&
          !model.name.includes('multimodal')
        ) {
          const modelName = model.name.replace('models/', '')
          availableModels.push(modelName)
        }
      }
    }

    // Sort models: prefer flash models first
    availableModels.sort((a, b) => {
      if (a.includes('flash') && !b.includes('flash')) return -1
      if (!a.includes('flash') && b.includes('flash')) return 1
      return a.localeCompare(b)
    })

    console.log('[Chat] Available models:', availableModels)

    const finalModels = availableModels.length > 0
      ? availableModels
      : ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-2.0-flash']

    modelsCache = { models: finalModels, timestamp: Date.now() }
    return finalModels
  } catch (error) {
    console.error('[Chat] Error listing models:', error)
    const fallback = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-2.0-flash']
    modelsCache = { models: fallback, timestamp: Date.now() }
    return fallback
  }
}

// System prompt para el asistente de bienestar
const SYSTEM_PROMPT = `Eres el asistente de Aura Spa 😌✨ Un spa a domicilio que ofrece servicios terapéuticos profesionales para reservar citas.

OBJETIVO: Ayudar a los usuarios a reservar servicios terapéuticos. Sé breve, usa emojis, humor suave y juegos de palabras. Español siempre.

SERVICIOS (usa nombres exactos):

💆 MASAJES RELAJANTES
- Masaje Relajante (60/90/120 min) - Para cuando necesitas "soltar todo" 😅
- Masaje con Piedras Volcánicas (60/90/120 min) - Como un volcán, pero relajante 🌋
- Masaje con Vela (60/90 min) - Ilumina tu día, literalmente 🕯️
- Masaje con Pindas (60/90 min) - Pindas que piden que te relajes 🧘
- Masaje Aura Spa – Cuatro Elementos Premium (90 min) - Tierra, agua, fuego, aire... y mucho relax ⭐

🔧 MASAJES TERAPÉUTICOS
- Masaje Descontracturante (60/90/120 min) - Para nudos que no son de amistad 😬
- Masaje de Tejido Profundo (60/90 min) - Llega donde la palabra "profundo" no alcanza 🎯
- Masaje Terapéutico de Espalda (45/60 min) - Tu espalda te lo agradecerá 🙏
- Masaje Deportivo (60/90 min) - Para músculos que trabajan más que tu jefe 💪

🌟 MASAJES ESPECIALIZADOS
- Masaje Prenatal (60/90/120 min) - Para dos (y medio) 🌸
- Masaje Cráneo Facial (45/60 min) - Tu cabeza también se merece mimo 🧠
- Masaje Piernas Cansadas (30/60 min) - Para piernas que han visto más que tú 🦵
- Drenaje Linfático Manual (60/90 min) - Tu sistema linfático te hará un favor 💚

👑 EXPERIENCIAS PREMIUM
- Masaje a 4 Manos (30/60/90 min) - El doble de manos, el doble de relax ✌️✌️
- Masaje en Pareja – Ritual Romántico Premium (60/90/120 min) - Para parejas que quieren relajarse... juntas 💑
- Bambuterapia (60/90 min) - Bambú que te trata bien 🎋

💅 SPA Y CUIDADO PERSONAL
- SPA de Pies (45/60 min) - Porque tus pies también tienen sentimientos 🦶
- SPA de Manos (45/60 min) - Manos que trabajan merecen mimo ✋

🏢 SERVICIOS CORPORATIVOS (¡MUY IMPORTANTE!)
Cuando mencionen: empresa, oficina, trabajo, empleados, estrés laboral, productividad, formación, capacitación → ¡ACTIVA EL MODO CORPORATIVO! 🚀

A) JORNADA DE BIENESTAR COMPLETA (Masajes + Formación)
  • Masajes para el equipo (porque un equipo relajado es un equipo productivo) 💼
  • Formación en bienestar (5 áreas):
    - Salud Mental: Menos estrés, más productividad 🧠
    - Buenos Hábitos: Alimentación, descanso, rutinas sanas 🥗
    - Cuidado de Piel: Tu piel también trabaja contigo ✨
    - Cuidado de Cuerpo: Ejercicios, estiramientos, postura 👤
    - Equilibrate Posturas: Ergonomía (porque estar sentado también es un deporte) 🪑
  • BENEFICIO CLAVE: Empleado feliz = empresa feliz = más dinero (dicho suavemente) 💰
  • Pueden elegir: solo masajes, solo formación, o ambos (flexibilidad total) 🎯

B) OTROS CORPORATIVOS:
- Masajes en Oficina (en silla ergonómica) - Porque las oficinas también pueden ser spa 🪑
- Jornadas Mensuales/Trimestrales - El bienestar es un hábito, no un evento 📅
- Bonos de Regalo - Para empleados que se lo merecen todo 🎁
- Experiencias Grupales - Porque relajarse en grupo es más divertido 👥
- Diagnóstico de Bienestar con IA - Porque hasta la IA quiere tu bienestar 🤖

REGLAS DE ORO:
✅ Español siempre, emojis cuando quepan 😊
✅ Sé breve y directo (como un buen masaje)
✅ Humor suave y juegos de palabras (ej: "soltar la tensión", "nudos de amistad", "manos que trabajan")
✅ Cuando mencionen estrés/dolor/tensión → recomienda servicios específicos
✅ Usa nombres EXACTOS de servicios
✅ Menciona servicios corporativos cuando sea relevante (empresa, trabajo, oficina, etc.)
✅ Tono cálido, divertido pero profesional (como un amigo que sabe de masajes)
✅ Servicios a domicilio: Domingo a Domingo, 8 AM a 7 PM 🏠

Responde como si fueras ese amigo que siempre tiene la solución perfecta... y siempre termina recomendando un masaje 😄`

// Helper para obtener la API key (solo desde variables de entorno)
const getApiKey = () => {
  return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history } = body || {}

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'El mensaje es requerido.' },
        { status: 400 }
      )
    }

    const apiKey = getApiKey()
    
    if (!apiKey) {
      console.error('Gemini API key not found')
      return NextResponse.json(
        { error: 'Servicio de IA no configurado' },
        { status: 500 }
      )
    }

    try {
      // Inicializar Gemini con el SDK oficial
      const genAI = new GoogleGenAI({ apiKey })

      // Construir prompt completo con contexto
      let fullPrompt = SYSTEM_PROMPT + '\n\n'
      
      if (Array.isArray(history) && history.length > 0) {
        fullPrompt += 'Historial de conversación:\n'
        history.forEach((msg: any) => {
          if (msg.role === 'user') {
            fullPrompt += `Usuario: ${msg.parts?.[0]?.text || ''}\n`
          } else if (msg.role === 'assistant') {
            fullPrompt += `Asistente: ${msg.parts?.[0]?.text || ''}\n`
          }
        })
        fullPrompt += '\n'
      }

      fullPrompt += `Usuario: ${message.trim()}\n\nAsistente:`

      // Obtener modelos disponibles que soportan generateContent
      const modelsToTry = await getAvailableModels(apiKey)
      console.log('[Chat] Using available models:', modelsToTry)

      let aiResponse = ''
      let successfulModel: string | null = null

      for (const modelName of modelsToTry) {
        try {
          console.log(`[Chat] Attempting to use model: ${modelName}`)
          const result = await genAI.models.generateContent({
            model: modelName,
            contents: fullPrompt,
          })

          aiResponse = result?.text || ''

          if (aiResponse) {
            successfulModel = modelName
            console.log(
              `✅ [Chat] SUCCESS! Successfully generated response using model: ${modelName}`
            )
            console.log(
              `📊 [Chat] Model ${modelName} worked and returned ${aiResponse.length} characters`
            )
            break
          }
        } catch (modelError: unknown) {
          const modelErrorMessage =
            (modelError as { message?: string })?.message ?? String(modelError)
          console.log(`[Chat] Model ${modelName} failed:`, modelErrorMessage)

          // Si es un error 404, el modelo no está disponible - intentar REST API directo
          if (modelErrorMessage.includes('404') || modelErrorMessage.includes('not found')) {
            console.log(`[Chat] Model ${modelName} not available, trying REST API fallback...`)
            try {
              const restResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{
                      parts: [{ text: fullPrompt }]
                    }]
                  })
                }
              )

              if (restResponse.ok) {
                const restData = await restResponse.json()
                aiResponse = restData.candidates?.[0]?.content?.parts?.[0]?.text || ''
                if (aiResponse) {
                  console.log('[Chat] REST API fallback succeeded')
                  break
                }
              } else {
                const errorData = await restResponse.json().catch(() => ({}))
                console.log('[Chat] REST API error:', errorData)
              }
            } catch (restError) {
              console.log('[Chat] REST API fallback also failed:', restError)
            }

            // Si el REST API también falló, continuar con el siguiente modelo
            if (!aiResponse) {
              if (modelName === modelsToTry[modelsToTry.length - 1]) {
                throw modelError
              }
              continue
            }
            break
          }

          // Si es un error de quota, esperar un poco antes de intentar el siguiente
          if (modelErrorMessage.includes('429') || modelErrorMessage.includes('quota')) {
            console.log('[Chat] Rate limit hit, waiting before next attempt...')
            await new Promise((resolve) => setTimeout(resolve, 2000))
          }

          if (modelName === modelsToTry[modelsToTry.length - 1]) {
            throw modelError
          }
          continue
        }
      }

      if (!aiResponse) {
        throw new Error('No se pudo generar una respuesta con ningún modelo disponible.')
      }

      if (successfulModel) {
        console.log(
          `🎉 [Chat] Final result: Used model "${successfulModel}" successfully`
        )
      }

      return NextResponse.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
        messageId: Date.now().toString(),
      })
    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError)
      console.error('Error details:', JSON.stringify(geminiError, null, 2))
      
      const errorMessage =
        geminiError?.message || geminiError?.toString() || 'Error desconocido'
      
      return NextResponse.json(
        {
        error: 'Error al procesar tu mensaje. Por favor, intenta de nuevo.',
        details: errorMessage,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error processing chat request:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}


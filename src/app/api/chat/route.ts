import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// System prompt para el asistente de bienestar
const SYSTEM_PROMPT = `Eres el asistente de bienestar más relajado de Soul Balance Spa 😌✨ Un spa a domicilio que ayuda a personas y empresas a soltar... la tensión 😉

OBJETIVO: Info sobre masajes, bienestar y servicios corporativos. Sé breve, usa emojis, humor suave y juegos de palabras. Español siempre.

SERVICIOS (usa nombres exactos):

💆 MASAJES RELAJANTES
- Masaje Relajante (60/90/120 min) - Para cuando necesitas "soltar todo" 😅
- Masaje con Piedras Volcánicas (60/90/120 min) - Como un volcán, pero relajante 🌋
- Masaje con Vela (60/90 min) - Ilumina tu día, literalmente 🕯️
- Masaje con Pindas (60/90 min) - Pindas que piden que te relajes 🧘
- Masaje Soul Balance – Cuatro Elementos Premium (90 min) - Tierra, agua, fuego, aire... y mucho relax ⭐

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history } = body

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'El mensaje es requerido' },
        { status: 400 }
      )
    }

    // Validate API key
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    
    if (!apiKey) {
      console.error('Gemini API key not found')
      return NextResponse.json(
        { error: 'Servicio de IA no configurado' },
        { status: 500 }
      )
    }

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenAI({ apiKey })

      // Build the full prompt with system prompt and conversation context
      let fullPrompt = SYSTEM_PROMPT + '\n\n'
      
      // Add conversation history if available
      if (history && Array.isArray(history) && history.length > 0) {
        fullPrompt += 'Historial de conversación:\n'
        history.forEach((msg: any) => {
          if (msg.role === 'user') {
            fullPrompt += `Usuario: ${msg.parts[0]?.text || ''}\n`
          } else if (msg.role === 'assistant') {
            fullPrompt += `Asistente: ${msg.parts[0]?.text || ''}\n`
          }
        })
        fullPrompt += '\n'
      }

      // Add current user message
      fullPrompt += `Usuario: ${message.trim()}\n\nAsistente:`

      // Try different models with fallback
      let result
      let aiResponse = ''
      
      const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp']
      
      for (const modelName of modelsToTry) {
        try {
          console.log(`Attempting to use model: ${modelName}`)
          result = await genAI.models.generateContent({
            model: modelName,
            contents: fullPrompt,
          })
          
          aiResponse = result.text || ''
          
          if (aiResponse) {
            console.log(`Successfully generated response using ${modelName}`)
            break
          }
        } catch (modelError: any) {
          console.log(`Model ${modelName} failed:`, modelError.message)
          if (modelName === modelsToTry[modelsToTry.length - 1]) {
            // Last model failed, throw the error
            throw modelError
          }
          // Try next model
          continue
        }
      }

      if (!aiResponse) {
        throw new Error('No se pudo generar una respuesta con ningún modelo disponible.')
      }

      return NextResponse.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
        messageId: Date.now().toString(),
      })

    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError)
      console.error('Error details:', JSON.stringify(geminiError, null, 2))
      
      // Return more specific error message
      const errorMessage = geminiError?.message || geminiError?.toString() || 'Error desconocido'
      
      return NextResponse.json({
        error: 'Error al procesar tu mensaje. Por favor, intenta de nuevo.',
        details: errorMessage,
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('Error processing chat request:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}


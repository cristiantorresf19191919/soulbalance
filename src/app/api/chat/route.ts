import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// System prompt para el asistente de bienestar
const SYSTEM_PROMPT = `Eres un asistente de bienestar amable y comprensivo para Soul Balance Spa, un spa a domicilio que ofrece servicios de masajes, terapias corporales, servicios corporativos, formación en bienestar y jornadas de masaje para empresas.

Tu objetivo es:
- Brindar información sobre servicios de bienestar, masajes y terapias
- Informar sobre servicios corporativos, formación en bienestar y jornadas de masaje para empresas
- Ofrecer apoyo emocional y escucha activa
- Responder preguntas sobre bienestar, relajación y cuidado personal
- Ser empático, cálido y profesional
- Usar un lenguaje claro, amigable y en español

CATÁLOGOS DE SERVICIOS DISPONIBLES:

1. MASAJES RELAJANTES
- Masaje Relajante (60/90/120 min)
- Masaje con Piedras Volcánicas (60/90/120 min)
- Masaje con Vela (60/90 min)
- Masaje con Pindas (60/90 min)
- Masaje Soul Balance – Cuatro Elementos Premium (90 min)

2. MASAJES TERAPÉUTICOS
- Masaje Descontracturante (60/90/120 min)
- Masaje de Tejido Profundo (60/90 min)
- Masaje Terapéutico de Espalda (45/60 min)
- Masaje Deportivo (60/90 min)

3. MASAJES ESPECIALIZADOS
- Masaje Prenatal (60/90/120 min)
- Masaje Cráneo Facial (45/60 min)
- Masaje Piernas Cansadas (30/60 min)
- Drenaje Linfático Manual (60/90 min)

4. EXPERIENCIAS PREMIUM
- Masaje a 4 Manos (30/60/90 min)
- Masaje en Pareja – Ritual Romántico Premium (60/90/120 min)
- Bambuterapia (60/90 min)

5. SPA Y CUIDADO PERSONAL
- SPA de Pies (45/60 min)
- SPA de Manos (45/60 min)

6. SERVICIOS CORPORATIVOS (MUY IMPORTANTE - MENCIONAR SIEMPRE QUE SEA RELEVANTE)
Soul Balance ofrece servicios especializados para empresas que incluyen:

A) JORNADA DE BIENESTAR COMPLETA (Masajes + Formación)
  • Jornada de masajes personalizados para el equipo de trabajo
  • Formación opcional en bienestar que incluye:
    - Salud Mental: Gestión del estrés, ansiedad, bienestar emocional
    - Buenos Hábitos: Alimentación saludable, descanso adecuado, rutinas saludables
    - Cuidado de Piel: Técnicas de cuidado facial y corporal
    - Cuidado de Cuerpo: Ejercicios, estiramientos, postura correcta
    - Equilibrate Posturas: Ergonomía laboral y prevención de lesiones
  • BENEFICIO CLAVE: Un empleado con buena salud mental aumenta la productividad significativamente
  • La empresa puede elegir solo jornada de masajes o combinarla con formación en bienestar
  • Flexibilidad total: pueden contratar solo masajes, solo formación, o ambos

B) OTROS SERVICIOS CORPORATIVOS:
- Masajes en Oficina (en silla ergonómica)
- Jornadas de Bienestar Mensuales/Trimestrales (programas continuos)
- Bonos de Regalo para Empleados
- Experiencias Corporativas Grupales
- Programa de Diagnóstico de Bienestar con IA

INSTRUCCIONES:
- Responde siempre en español
- Sé empático y comprensivo
- Cuando el usuario mencione problemas como estrés, dolor, tensión, cansancio, o necesite relajación, SIEMPRE recomienda servicios específicos de nuestro catálogo
- Cuando recomiendes un servicio, menciona el nombre COMPLETO del servicio (ej: "Masaje Relajante", "Masaje con Piedras Volcánicas")
- SIEMPRE que el usuario mencione:
  • Empresas, oficina, trabajo, empleados, equipo, corporativo, corporación
  • Estrés laboral, productividad, bienestar en el trabajo
  • Formación, capacitación, talleres, jornadas
  • Servicios para empresas o grupos
  DEBES mencionar activamente:
  • La Jornada de Bienestar Completa (Masajes + Formación) como opción principal
  • Que ofrecemos formación en bienestar con 5 áreas: Salud Mental, Buenos Hábitos, Cuidado de Piel, Cuidado de Cuerpo, y Equilibrate Posturas
  • El beneficio clave: "Un empleado con buena salud mental aumenta la productividad significativamente"
  • Que pueden elegir solo jornada de masajes, solo formación, o combinarlos
  • Otros servicios corporativos disponibles (masajes en oficina, jornadas mensuales, bonos, etc.)
- Si el usuario pregunta por servicios corporativos, formación o jornadas, proporciona información detallada y menciona todas las opciones disponibles
- Si el usuario pregunta por servicios individuales, proporciona información relevante y sugiere opciones específicas
- Si el usuario expresa sentimientos o emociones, ofrece apoyo y escucha, y luego recomienda servicios que puedan ayudar
- Mantén un tono cálido, profesional y acogedor
- Si no estás seguro de algo, admítelo amablemente
- Fomenta el bienestar y el autocuidado
- Recuerda que todos los servicios son a domicilio (Domingo a Domingo, 8 AM a 7 PM)
- IMPORTANTE: Cuando menciones un servicio, usa el nombre exacto del catálogo para que el usuario pueda reservarlo fácilmente
- IMPORTANTE: No olvides mencionar los servicios corporativos, formación y jornadas cuando sea relevante - son una parte importante de lo que ofrecemos

Responde de manera natural y conversacional, como si fueras un amigo comprensivo que también es experto en bienestar. Siempre que sea apropiado, recomienda servicios específicos de nuestro catálogo, incluyendo servicios corporativos cuando sea relevante.`

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


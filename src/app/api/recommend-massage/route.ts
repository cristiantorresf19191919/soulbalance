import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// System prompt for Gemini Pro
const SYSTEM_PROMPT = `Actúa como consultor experto en terapias corporales y masajes. 

Tu tarea es LEER las respuestas de un paciente y recomendar el mejor tipo de masaje o experiencia de nuestro catálogo.

CATÁLOGO DE SERVICIOS (y precios en COP)

1. MASAJES RELAJANTES

- Masaje Relajante
  • 60 min: $130.000
  • 90 min: $170.000
  • 120 min: $210.000

- Masaje con Piedras Volcánicas
  • 60 min: $150.000
  • 90 min: $190.000
  • 120 min: $230.000

- Masaje con Vela
  • 60 min: $155.000
  • 90 min: $195.000

- Masaje con Pindas
  • 60 min: $150.000
  • 90 min: $190.000

- Masaje Soul Balance – Cuatro Elementos (Premium)
  • 90 min: $250.000

2. MASAJES TERAPÉUTICOS

- Masaje Descontracturante
  • 60 min: $140.000
  • 90 min: $180.000
  • 120 min: $220.000

- Masaje de Tejido Profundo
  • 60 min: $145.000
  • 90 min: $185.000

- Masaje Terapéutico de Espalda
  • 45 min: $120.000
  • 60 min: $150.000

- Masaje Deportivo
  • 60 min: $150.000
  • 90 min: $190.000

3. MASAJES ESPECIALIZADOS

- Masaje Prenatal
  • 60 min: $145.000
  • 90 min: $185.000
  • 120 min: $225.000

- Masaje Cráneo Facial
  • 45 min: $125.000
  • 60 min: $155.000

- Masaje Piernas Cansadas
  • 30 min: $100.000
  • 60 min: $140.000

- Drenaje Linfático Manual
  • 60 min: $145.000
  • 90 min: $185.000

4. EXPERIENCIAS PREMIUM

- Masaje a 4 Manos
  • 30 min: $130.000
  • 60 min: $170.000
  • 90 min: $210.000

- Masaje en Pareja – Ritual Romántico (Premium)
  • 60 min: $250.000 (pareja)
  • 90 min: $330.000 (pareja)
  • 120 min: $400.000 (pareja)

- Bambuterapia
  • 60 min: $160.000
  • 90 min: $200.000

5. SPA Y CUIDADO PERSONAL

- SPA de Pies
  • 45 min: $100.000
  • 60 min: $130.000

- SPA de Manos
  • 45 min: $100.000
  • 60 min: $130.000

NOTAS:

- Todos los servicios pueden ser a domicilio (Domingo a Domingo, 8 AM a 7 PM).
- Experiencias premium pueden requerir agendamiento con anticipación.

PREGUNTAS Y RESPUESTAS DEL PACIENTE

A continuación recibirás las respuestas del paciente a estas 10 preguntas:

1. Motivo principal por el que busca masaje hoy (relajación, dolor, estrés, etc.).
2. Partes del cuerpo donde siente más dolor o tensión.
3. Desde cuándo tiene esas molestias y en qué momentos del día se sienten peor.
4. Nivel de dolor/tensión actual en escala de 1 a 10.
5. Diagnósticos médicos importantes (columna, hernias, varices, problemas cardíacos, hipertensión, embarazo, etc.).
6. Medicamentos que toma de forma regular (especialmente anticoagulantes o para la presión).
7. Alergias o sensibilidad en la piel a aceites, aromas, calor, piedras volcánicas o velas.
8. Cómo es su día a día físicamente (muchas horas sentado, de pie, cargando peso, ejercicio, etc.).
9. Nivel de estrés actual en escala de 1 a 10.
10. Preferencia de presión del masaje (suave, medio, profundo) y zonas donde NO quiere contacto.

TAREA

Con base en el catálogo y en RESPUESTAS_PACIENTE:

1. Recomienda el servicio MÁS ADECUADO para esta persona.
2. Indica:
   - Categoría
   - Nombre del servicio
   - Duración recomendada
   - Si es Premium o no
3. Explica brevemente por qué lo recomiendas (máximo 3–4 frases).
4. Sugiere 1 o 2 opciones alternativas si aplica (por ejemplo, uno más relajante y otro más terapéutico).
5. Si detectas alguna posible contraindicación (por diagnóstico, medicamentos, embarazo, varices severas, etc.), menciona una ALERTA y recomienda consultar con su médico antes de la sesión.

FORMATO DE RESPUESTA (en español, claro y amable):

- Servicio recomendado: …
- Categoría: …
- Duración sugerida: … minutos
- Premium: sí/no
- Motivo de la recomendación: …
- Opciones alternativas: …
- Alertas o precauciones: …

Ahora analiza RESPUESTAS_PACIENTE y genera la recomendación.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers } = body

    if (!answers || !Array.isArray(answers) || answers.length !== 10) {
      return NextResponse.json(
        { error: 'Se requieren 10 respuestas' },
        { status: 400 }
      )
    }

    // Validate API key
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBFpiO7VL4o-glXbpeXUdcs1N-3Q4jOfDU'
    
    if (!apiKey) {
      console.error('Gemini API key not found')
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenAI({ apiKey })

      // Build the prompt with patient answers
      const questions = [
        'Motivo principal por el que busca masaje hoy',
        'Partes del cuerpo donde siente más dolor o tensión',
        'Desde cuándo tiene esas molestias y en qué momentos del día se sienten peor',
        'Nivel de dolor/tensión actual en escala de 1 a 10',
        'Diagnósticos médicos importantes',
        'Medicamentos que toma de forma regular',
        'Alergias o sensibilidad en la piel',
        'Cómo es su día a día físicamente',
        'Nivel de estrés actual en escala de 1 a 10',
        'Preferencia de presión del masaje y zonas donde NO quiere contacto'
      ]

      const answersText = answers.map((answer: string, index: number) => 
        `${index + 1}. ${questions[index]}: ${answer}`
      ).join('\n\n')

      const fullPrompt = `${SYSTEM_PROMPT}\n\nRESPUESTAS_PACIENTE:\n\n${answersText}`

      // Generate response using Gemini
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
        recommendation: aiResponse,
        timestamp: new Date().toISOString(),
      })

    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError)
      console.error('Error details:', JSON.stringify(geminiError, null, 2))
      
      // Return more specific error message
      const errorMessage = geminiError?.message || geminiError?.toString() || 'Error desconocido'
      
      return NextResponse.json({
        error: 'Error al procesar la recomendación. Por favor, inténtalo de nuevo.',
        details: errorMessage,
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('Error processing recommendation request:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}


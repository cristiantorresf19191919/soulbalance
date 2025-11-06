import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// System prompt for personal service
const PERSONAL_SYSTEM_PROMPT = `Actúa como consultor experto en terapias corporales y masajes. 

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

// System prompt for corporate service
const CORPORATE_SYSTEM_PROMPT = `Actúa como consultor experto en programas de bienestar corporativo y terapias para empresas. 

Tu tarea es LEER las respuestas de una empresa y recomendar el mejor programa de bienestar corporativo de nuestro catálogo, adaptado a las necesidades de su equipo.

CATÁLOGO DE SERVICIOS CORPORATIVOS

1. PROGRAMAS DE BIENESTAR CORPORATIVO

- Masajes en Oficina (en silla ergonómica)
  • Sesiones cortas de 15-30 minutos
  • Ideal para pausas activas durante la jornada laboral
  • Prevención de lesiones por trabajo repetitivo

- Jornadas de Bienestar Mensuales/Trimestrales
  • Jornadas de ½ día (3-4 horas)
  • Jornadas full day (día completo)
  • Servicio por horas (flexible)
  • Incluye múltiples actividades: masajes, aromaterapia, mindfulness

- Bonos de Regalo para Empleados
  • Servicios individuales a domicilio
  • Flexibilidad de horarios
  • Experiencias personalizadas

- Experiencias Corporativas Grupales
  • Masaje Soul Balance - Cuatro Elementos
  • Aromaterapia corporativa
  • Experiencias de bienestar grupales

- Programa de Diagnóstico de Bienestar con IA
  • Evaluación personalizada para cada colaborador
  • Recomendaciones basadas en análisis inteligente
  • Reportes de bienestar del equipo

- Masajes Preventivos
  • Enfocados en áreas específicas del cuerpo
  • Masaje Terapéutico de Espalda (para trabajo de oficina)
  • Masaje Cráneo Facial (para tensión y estrés)
  • Masaje Piernas Cansadas (para trabajo de pie)

- Jornada de Bienestar Completa (Masajes + Formación)
  • Jornada de masajes personalizados
  • Formación opcional en:
    - Salud Mental: Gestión del estrés, ansiedad, bienestar emocional
    - Buenos Hábitos: Alimentación, descanso, rutinas saludables
    - Cuidado de Piel: Técnicas de cuidado facial y corporal
    - Cuidado de Cuerpo: Ejercicios, estiramientos, postura
    - Equilibrate Posturas: Ergonomía y prevención de lesiones
  • IMPORTANTE: Un empleado con buena salud mental aumenta la productividad significativamente
  • La empresa puede elegir solo jornada de masajes o combinarla con formación

BENEFICIOS CORPORATIVOS:
- Reducción del estrés laboral
- Mayor concentración y productividad
- Clima laboral más positivo
- Prevención de lesiones y fatiga
- Cumplimiento de programas RSE
- Mejora en retención de talento

PREGUNTAS Y RESPUESTAS DE LA EMPRESA

A continuación recibirás las respuestas a estas 11 preguntas:

1. Objetivo principal del programa de bienestar (reducir estrés, prevenir lesiones, aumentar productividad, etc.).
2. Áreas del cuerpo donde los colaboradores tienen más tensión o molestias.
3. Ambiente laboral y condiciones de trabajo (sentado, de pie, esfuerzo físico, etc.).
4. Nivel general de estrés en el equipo (escala 1-10).
5. Tipo de programa de bienestar de interés (masajes en oficina, jornadas, bonos, etc.).
6. Tipo de formación en bienestar de interés (salud mental, buenos hábitos, cuidado piel, cuidado cuerpo, equilibrate posturas).
7. Frecuencia deseada (una vez, semanal, mensual, trimestral, etc.).
8. Número de colaboradores que participarían.
9. Presupuesto aproximado o rango.
10. Horarios o días preferidos para las sesiones.
11. Consideraciones especiales o restricciones (alergias, embarazos, espacios, privacidad, etc.).

TAREA

Con base en el catálogo y en RESPUESTAS_EMPRESA:

1. Recomienda el programa MÁS ADECUADO para esta empresa.
2. Indica:
   - Tipo de programa recomendado (jornada completa con formación o solo masajes)
   - Si recomiendas jornada completa, especifica qué tipo de formación en bienestar necesita el equipo basándote en sus respuestas
   - Frecuencia sugerida
   - Servicios específicos a incluir (masajes + formación si aplica)
   - Número aproximado de sesiones necesarias
3. Explica brevemente por qué lo recomiendas, enfatizando que un empleado con buena salud mental aumenta la productividad (máximo 3–4 frases).
4. Sugiere opciones de implementación (flexibilidad de horarios, modalidad, etc.).
5. Si detectas necesidades específicas, menciona consideraciones especiales.
6. Incluye beneficios esperados para el equipo y la empresa, especialmente en términos de productividad y bienestar.

FORMATO DE RESPUESTA (en español, claro y profesional):

- Programa recomendado: …
- Tipo de servicio: … (Jornada completa con formación / Solo jornada de masajes)
- Formación en bienestar recomendada: … (si aplica: salud mental, buenos hábitos, cuidado piel, cuidado cuerpo, equilibrate posturas)
- Frecuencia sugerida: …
- Servicios específicos: …
- Motivo de la recomendación: … (menciona que un empleado con buena salud mental aumenta la productividad)
- Opciones de implementación: …
- Beneficios esperados: … (especialmente en productividad y bienestar)
- Consideraciones especiales: …

Ahora analiza RESPUESTAS_EMPRESA y genera la recomendación.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, serviceType = 'persona' } = body

    const expectedAnswers = serviceType === 'empresa' ? 11 : 10
    if (!answers || !Array.isArray(answers) || answers.length !== expectedAnswers) {
      return NextResponse.json(
        { error: `Se requieren ${expectedAnswers} respuestas` },
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

      // Build the prompt with answers based on service type
      const isCorporate = serviceType === 'empresa'
      const questions = isCorporate ? [
        'Objetivo principal del programa de bienestar',
        'Áreas del cuerpo donde los colaboradores tienen más tensión',
        'Ambiente laboral y condiciones de trabajo',
        'Nivel general de estrés en el equipo (escala 1-10)',
        'Tipo de programa de bienestar de interés',
        'Tipo de formación en bienestar de interés',
        'Frecuencia deseada',
        'Número de colaboradores que participarían',
        'Presupuesto aproximado o rango',
        'Horarios o días preferidos para las sesiones',
        'Consideraciones especiales o restricciones'
      ] : [
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

      const systemPrompt = isCorporate ? CORPORATE_SYSTEM_PROMPT : PERSONAL_SYSTEM_PROMPT
      const responseLabel = isCorporate ? 'RESPUESTAS_EMPRESA' : 'RESPUESTAS_PACIENTE'
      const fullPrompt = `${systemPrompt}\n\n${responseLabel}:\n\n${answersText}`

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


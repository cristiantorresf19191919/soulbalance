'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './BlogArticle.module.css'

export function BlogArticle() {
  return (
    <section className={styles.blogSection} style={{ paddingTop: '100px' }}>
      <div className={styles.container}>
        <div className={styles.blogHeader}>
          <h2 className={styles.sectionTitle}>Blog de Bienestar</h2>
          <p className={styles.blogIntro}>
            Reflexiones, historias y guías para potenciar tu experiencia de
            bienestar
          </p>
        </div>

        <article className={styles.blogArticle}>
          <div className={styles.articleHeader}>
            <div className={styles.articleMeta}>
              <span className={styles.articleCategory}>Ciencia del tacto</span>
              <span className={styles.articleDate}>2024</span>
            </div>
            <h1 className={styles.articleTitle}>
              Por qué el masaje funciona mejor cuando te entregas
            </h1>
            <p className={styles.articleExcerpt}>
              Te has preguntado por qué algunas sesiones te dejan transformado y
              otras solo &quot;alivian un poco&quot;. La diferencia no está solo en las
              manos del terapeuta, sino también en cómo te entregas al proceso.
            </p>
          </div>

          <div className={styles.articleHero}>
            <div className={styles.heroImageWrapper}>
              <Image
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Experiencia de masaje relajante y transformadora"
                width={2070}
                height={1380}
                className={styles.heroImage}
                priority
              />
              <div className={styles.heroOverlay}></div>
            </div>
          </div>

          <div className={styles.articleContent}>
            <p className={styles.articleOpening}>
              Llevo años trabajando con el cuerpo y algo me queda claro: el
              masaje es una danza entre técnica y presencia. No es solo lo que
              hacen mis manos, sino lo que ocurre en el espacio entre nosotros.
              Y tal vez te has preguntado, como muchos de mis clientes: ¿por qué
              a veces siento tanto cambio y otras veces me voy igual que llegué?
            </p>

            <p>
              La respuesta tiene que ver con algo que suena simple pero es
              profundamente complejo: la entrega. No me refiero a rendirse
              pasivamente, sino a algo más activo: confiar, respirar
              conscientemente y permitir que el cuerpo hable sin que la mente lo
              censure constantemente. Sin confianza y apertura, la técnica
              trabaja. Con ellas, transforma.
            </p>

            <div className={styles.contentQuote}>
              <p>
                &quot;Sin confianza y apertura, la técnica trabaja. Con ellas,
                transforma.&quot;
              </p>
            </div>

            <p>
              Imagina esto: tu sistema nervioso es como un guardia de seguridad
              que nunca duerme. Constantemente está evaluando: ¿estoy a salvo?
              ¿Puedo bajar la guardia? Cuando llegas a una sesión tenso,
              pensando en el trabajo, con la mandíbula apretada (aunque no te
              des cuenta), ese guardia sigue alerta. Y cuando está alerta, los
              músculos no se sueltan de verdad. Pueden relajarse un poco, pero
              hay una resistencia sutil, como si el cuerpo mismo dijera &quot;no
              confío todavía&quot;.
            </p>

            <p>
              Ahora, cuando respiras lento, cuando sueltas esa mandíbula que no
              sabías que tenías tensa, cuando permites que alguien toque sin que
              tu mente analice cada movimiento... algo mágico pasa. El sistema
              nervioso cambia de canal. Deja de estar en modo &quot;pelea o huida&quot; y
              entra en modo &quot;descanso y digestión&quot;. Y ahí es cuando la magia
              ocurre de verdad.
            </p>

            <div className={styles.contentImageBreak}>
              <Image
                src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Técnicas de respiración y relajación"
                width={2070}
                height={1380}
                className={styles.contentImage}
              />
            </div>

            <h2>La mente como interruptor del alivio</h2>

            <p>
              Te cuento algo que quizás no sepas: tu mente literalmente controla
              qué tan efectivo puede ser un masaje. Cuando pasas de estar en
              estado de alerta a un estado de calma, el cuerpo libera tensiones
              que ni siquiera sabías que estaban ahí. Es como si hubiera un
              interruptor que dice &quot;ahora sí puedes soltar&quot;. Y ese interruptor
              no lo activa el terapeuta con sus manos; lo activas tú con tu
              respiración, con tu atención, con tu permiso interno de sentir.
            </p>

            <p>
              Las exhalaciones largas son especialmente poderosas. Cuando
              exhalas más lento de lo que inhalas, le estás comunicando a tu
              sistema nervioso: &quot;estoy a salvo, puedo soltar&quot;. No es místico, es
              pura neurobiología. Y cuando el cuerpo entiende que está a salvo,
              los tejidos cambian. La fascia se mueve diferente, los músculos se
              abren, la circulación mejora. Todo porque decidiste confiar.
            </p>

            <p>
              Y aquí viene la parte interesante: a veces cuesta soltar. Tal vez
              porque estás acostumbrado a controlar todo, tal vez porque es
              difícil confiar, tal vez porque tu mente está tan entrenada en
              estar alerta que relajarse se siente casi... incómodo. Como si
              fuera extraño no tener que hacer nada. ¿Te ha pasado?
            </p>

            <div className={styles.contentImageBreak}>
              <Image
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Sesión de masaje terapéutico profesional"
                width={2070}
                height={1380}
                className={styles.contentImage}
              />
            </div>

            <h2>Lo que he aprendido de cientos de sesiones</h2>

            <p>
              Después de trabajar con tantas personas, noto patrones. Las
              sesiones que realmente transforman tienen algo en común: la
              persona llega con intención. No llega pensando &quot;ojalá esto me
              ayude&quot; mientras revisa el teléfono hasta el último segundo. Llega
              unos minutos antes, respira, y tal vez hasta se permite un segundo
              de introspección: &quot;hoy quiero soltar los hombros que cargo desde
              hace meses&quot;.
            </p>

            <p>
              Durante la sesión, hay una diferencia enorme entre quien está
              presente y quien está mentalmente en otra parte. Cuando estás
              presente, cuando sientes cada contacto sin juzgarlo, cuando
              comunicas sin pena si necesitas más o menos presión, el trabajo es
              profundo. Cuando tu mente está en otra parte, el cuerpo se pone
              rígido otra vez. Como si supiera que no estás ahí para recibir.
            </p>

            <p>
              Y después... esto es importante. Después de una buena sesión,
              cuando te tomas esos minutos para caminar suave, beber agua,
              evitar las pantallas un rato... el cuerpo integra. No es solo &quot;me
              siento relajado&quot;, es &quot;mi cuerpo recordó cómo se siente estar
              suelto&quot;. Y esa memoria queda. Por eso algunos clientes notan
              cambios que duran días, incluso semanas.
            </p>

            <div className={`${styles.contentImageBreak} ${styles.fullWidth}`}>
              <Image
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Ambiente relajante y bienestar"
                width={2070}
                height={1380}
                className={styles.contentImage}
              />
            </div>

            <div className={styles.contentInsight}>
              <h3>Un pequeño ritual que puede cambiar todo</h3>
              <p>
                Antes de cada sesión, tómate sesenta segundos. Tres
                respiraciones profundas, nasales, con exhalación más larga que
                la inhalación. Haz un escaneo rápido: frente, ojos, mandíbula,
                lengua, hombros, abdomen, manos, pies. Y dile a tu cuerpo, en
                silencio: &quot;blandito por dentro&quot;. Suena simple, pero es increíble
                cómo cambia el espacio de la sesión cuando empiezas desde ahí.
              </p>
            </div>

            <h2>Límites y confianza: dos caras de la misma moneda</h2>

            <p>
              Aquí hay algo que tal vez te sorprenda: confiar también es saber
              decir &quot;no&quot;. El mejor masaje respeta tu autonomía. Puedes pedir
              menos presión, otra zona, una pausa. Y cuando sientes que tienes
              el control, paradójicamente, puedes soltar el control. Es como si
              tu sistema nervioso dijera &quot;okay, si puedo comunicar, entonces
              estoy seguro&quot;. Y cuando te sientes seguro, puedes entregarte de
              verdad.
            </p>

            <p>
              A veces la gente me pregunta: &quot;¿debo hablar o quedarme en
              silencio?&quot; Y mi respuesta siempre es: lo que necesites en ese
              momento. Si hablar te relaja, háblame. Si el silencio te ayuda a
              entrar en presencia, quédate en silencio. Si te emocionas (y pasa
              más de lo que imaginas), respira y permite. Es liberación de carga
              emocional, no un problema. El cuerpo habla a través de
              sensaciones, pero también a través de emociones que salen. Y eso
              está bien.
            </p>

            <p>
              Hay clientes que llegan la primera vez tensos, casi expectantes de
              que duela. Y luego, sesión tras sesión, van soltando. Primero el
              cuerpo, luego la respiración, luego esa capa de protección
              emocional que todos llevamos. Y cuando eso pasa, las sesiones se
              vuelven diferentes. No es solo trabajo físico, es trabajo de
              restablecer la conexión con tu propio cuerpo.
            </p>

            <h2>Señales de que vas por buen camino</h2>

            <p>
              Te pregunto: ¿alguna vez has notado que durante un buen masaje
              empiezas a bostezar? ¿O que tu estómago hace ruido? ¿O que sientes
              como si tu cuerpo pesara más, pero de una manera agradable? Esas
              son señales de que tu sistema nervioso parasimpático está activo.
              Es decir, tu cuerpo está en modo reparación, no en modo defensa. Y
              cuando eso pasa, todo funciona mejor.
            </p>

            <p>
              Otras señales: el dolor que sentías al inicio se vuelve más denso
              y manejable, y luego se disipa. Como si se transformara. O duermes
              mejor esa noche. O al día siguiente te mueves diferente, más
              ligero. No es solo la técnica; es la combinación de técnica y tu
              capacidad de recibirla.
            </p>

            <div className={styles.contentFaq}>
              <h2>Preguntas que tal vez te hayas hecho</h2>

              <div className={styles.faqItem}>
                <h3>¿Y si me duele demasiado?</h3>
                <p>
                  La presión debe ayudar, no endurecerte. Si sientes que te
                  estás tensando en lugar de soltarte, pide ajuste. El &quot;dolor
                  bueno&quot; nunca te hace contener la respiración. Y recuerda: tú
                  tienes el control. Un buen terapeuta lo sabe y lo respeta.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>¿Cada cuánto conviene venir?</h3>
                <p>
                  Depende de dónde estés. Para mantenimiento y bienestar
                  general, cada dos a cuatro semanas suele funcionar bien. Si
                  estás en un proceso agudo de dolor o tensión, tal vez
                  necesites venir semanalmente por un tiempo limitado. Lo mejor
                  es escuchar tu cuerpo y ver qué funciona para ti.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>¿Qué pasa si no puedo relajarme?</h3>
                <p>
                  Primero, es normal. Muchos de nosotros estamos tan entrenados
                  en estar alerta que relajarse se siente extraño al principio.
                  Prueba el ritual de sesenta segundos que mencioné antes. Y
                  recuerda: no hay presión de estar &quot;perfectamente relajado&quot;.
                  Estar presente es suficiente. El resto viene con la práctica y
                  la confianza que se construye sesión a sesión.
                </p>
              </div>
            </div>

            <p>
              Al final del día, un masaje es un encuentro. Entre tú y tu cuerpo,
              entre tú y quien te trabaja, entre lo que quieres soltar y lo que
              estás listo para sentir. Y tal vez lo más importante que he
              aprendido es esto: cuando te entregas al proceso, cuando confías
              lo suficiente para soltar el control y estar presente, el cuerpo
              responde de maneras que a veces nos sorprende.
            </p>

            <p>
              Así que la próxima vez que vengas, te invito a intentarlo. Llega
              unos minutos antes, respira, pon una intención breve. Durante la
              sesión, siente sin juzgar. Comunica lo que necesites. Y después,
              tómate esos minutos para integrar. Nosotros ponemos la técnica; tú
              traes la confianza. Juntos hacemos el resto.
            </p>

            <div className={styles.contentCta}>
              <h2>¿Listo para experimentarlo?</h2>
              <p>
                Reserva tu sesión y trae una intención breve. El resto lo
                construimos juntos, con técnica, con presencia, y sobre todo,
                con entrega.
              </p>
              <Link href="/#contacto" className={styles.ctaButton}>
                Reserva tu experiencia
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}


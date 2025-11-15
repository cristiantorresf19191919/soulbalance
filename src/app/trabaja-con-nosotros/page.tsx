'use client'

import React from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'
import { useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material'
import {
  Star as StarIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material'
import Link from 'next/link'

const translations = {
  es: {
    title: "Convierte tu Pasión en tu Negocio Soñado. ¡Únete a la Plataforma de Bienestar #1 de Colombia! ✨",
    subtitle: "¿Eres masajista o terapeuta del bienestar? ¿Te imaginas llenar tu agenda, multiplicar tus ingresos y enfocarte solo en lo que amas? Deja de buscar clientes. Deja que ellos te encuentren.",
    whyJoin: "¿Por qué Afiliarte a Nuestra Comunidad? 🤔",
    whyJoinDesc: "Sabemos que tu trabajo va más allá de un servicio: es una vocación. Pero encontrar clientes, gestionar horarios, promocionarte y lidiar con la logística puede ser agotador. ¡Te entendemos! Por eso creamos una plataforma pensada para ti, para que tu talento brille sin límites.",
    benefits: {
      moreClients: {
        title: "Más Clientes, Sin Esfuerzo",
        desc: "Olvídate de la publicidad costosa y la incertidumbre. Nuestra plataforma te conecta con miles de clientes potenciales en toda Colombia, listos para reservar tus servicios de masaje, fisioterapia, terapias alternativas y mucho más."
      },
      freedom: {
        title: "Libertad y Flexibilidad Total",
        desc: "Tú tienes el control. Define tus propios horarios, establece tus precios y elige qué servicios ofrecer. Ya sea que trabajes en un consultorio o a domicilio, nuestra plataforma se adapta a ti."
      },
      tools: {
        title: "Herramientas para Crecer Gratis",
        desc: "¡Sí, todo es gratis! Crear tu perfil profesional es sencillo y rápido. Podrás mostrar tus servicios, tu experiencia y las tarifas que elijas. Te damos una vitrina digital para que te posiciones como un experto en tu área."
      }
    },
    future: "¡Tu Futuro Profesional Te Espera! 🌟",
    steps: {
      step1: {
        title: "Paso 1: Crea tu Perfil Gratuito.",
        desc: "En solo unos minutos, sube tus servicios, define tu precio y tu área de cobertura en Colombia. La plataforma es intuitiva y te guía en cada paso. ¡Sin costos ocultos ni letras pequeñas!"
      },
      step2: {
        title: "Paso 2: Recibe Reservas Directamente.",
        desc: "Los clientes te encontrarán en nuestra plataforma. Podrán ver tu perfil, agendar una cita y pagar por el servicio de manera segura. Recibirás notificaciones instantáneas."
      },
      step3: {
        title: "Paso 3: ¡Gana Dinero y Crece!",
        desc: "Con cada servicio que realices, tu reputación crecerá y tu ingreso también. Nuestra misión es simple: ayudarte a ganar más, conseguir más clientes y tener la libertad financiera que mereces."
      }
    },
    whatYouGain: "Lo Que Ganas con Nosotros: 💰",
    gains: [
      "Visibilidad Ilimitada: Te conectamos con una audiencia que ya busca tus servicios.",
      "Gestión Simplificada: Olvídate de las agendas de papel y los mensajes infinitos. Todo en un solo lugar.",
      "Ingresos Adicionales: Aumenta tu base de clientes sin invertir en publicidad.",
      "Seguridad y Confianza: Tus datos y tus pagos están protegidos.",
      "Comunidad de Expertos: Únete a la red de profesionales del bienestar más grande de Colombia."
    ],
    cta: "¡Es hora de hacer realidad el negocio que sueñas! 💆‍♀️",
    registerButton: "Regístrate Ahora Gratis",
    joinButton: "Únete a nuestra plataforma",
    doubts: "¿Aún tienes dudas?",
    contact: "¡Contáctanos! Estamos aquí para ayudarte a crecer.",
    backHome: "Volver al Inicio"
  },
  en: {
    title: "Turn Your Passion Into Your Dream Business. Join Colombia's #1 Wellness Platform! ✨",
    subtitle: "Are you a massage therapist or wellness practitioner? Can you imagine filling your schedule, multiplying your income and focusing only on what you love? Stop looking for clients. Let them find you.",
    whyJoin: "Why Join Our Community? 🤔",
    whyJoinDesc: "We know your work goes beyond a service: it's a calling. But finding clients, managing schedules, promoting yourself and dealing with logistics can be exhausting. We understand! That's why we created a platform designed for you, so your talent can shine without limits.",
    benefits: {
      moreClients: {
        title: "More Clients, No Effort",
        desc: "Forget about expensive advertising and uncertainty. Our platform connects you with thousands of potential clients throughout Colombia, ready to book your massage, physiotherapy, alternative therapy services and much more."
      },
      freedom: {
        title: "Total Freedom and Flexibility",
        desc: "You're in control. Set your own schedules, establish your prices and choose what services to offer. Whether you work in an office or at home, our platform adapts to you."
      },
      tools: {
        title: "Free Growth Tools",
        desc: "Yes, everything is free! Creating your professional profile is simple and fast. You'll be able to showcase your services, your experience and the rates you choose. We give you a digital showcase so you can position yourself as an expert in your field."
      }
    },
    future: "Your Professional Future Awaits! 🌟",
    steps: {
      step1: {
        title: "Step 1: Create Your Free Profile.",
        desc: "In just a few minutes, upload your services, define your price and your coverage area in Colombia. The platform is intuitive and guides you through each step. No hidden costs or fine print!"
      },
      step2: {
        title: "Step 2: Receive Bookings Directly.",
        desc: "Clients will find you on our platform. They'll be able to see your profile, schedule an appointment and pay for the service securely. You'll receive instant notifications."
      },
      step3: {
        title: "Step 3: Make Money and Grow!",
        desc: "With each service you provide, your reputation will grow and so will your income. Our mission is simple: help you earn more, get more clients and have the financial freedom you deserve."
      }
    },
    whatYouGain: "What You Gain With Us: 💰",
    gains: [
      "Unlimited Visibility: We connect you with an audience that's already looking for your services.",
      "Simplified Management: Forget about paper agendas and endless messages. Everything in one place.",
      "Additional Income: Increase your client base without investing in advertising.",
      "Security and Trust: Your data and payments are protected.",
      "Community of Experts: Join Colombia's largest network of wellness professionals."
    ],
    cta: "It's time to make your dream business a reality! 💆‍♀️",
    registerButton: "Register Now Free",
    joinButton: "Join our platform",
    doubts: "Still have questions?",
    contact: "Contact us! We're here to help you grow.",
    backHome: "Back to Home"
  }
}

const fadeInUpVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
      staggerChildren: 0.15
    }
  }
}

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: -15
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
}

const iconVariants = {
  hidden: {
    scale: 0,
    rotate: -180
  },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: "backOut" as const
    }
  }
}

const textVariants = {
  hidden: {
    opacity: 0,
    x: -30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const
    }
  }
}

const buttonVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "backOut" as const
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95
  }
}

const ScrollAnimatedSection = ({ children, variants, ...props }: any) => {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3,
    margin: "-100px 0px -100px 0px"
  })

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default function PartnerPage() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0F23 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      pt: 10,
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg">
        <ScrollAnimatedSection variants={fadeInUpVariants}>
          <Box sx={{ textAlign: 'center', mb: 12, mt: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 900,
                  mb: 6,
                  color: 'white',
                  lineHeight: 1.1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.1)',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                }}
              >
                {t.title}
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  color: 'rgba(255, 255, 255, 0.95)',
                  mb: 8,
                  maxWidth: '900px',
                  mx: 'auto',
                  lineHeight: 1.7,
                  textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                  fontWeight: 400
                }}
              >
                {t.subtitle}
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "backOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                component={Link}
                href="/onboarding"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 8,
                  py: 3,
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  borderRadius: '50px',
                  textTransform: 'none',
                  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'translateY(-5px)',
                    boxShadow: '0 25px 50px rgba(139, 92, 246, 0.6)'
                  },
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                {t.joinButton}
              </Button>
            </motion.div>
          </Box>
        </ScrollAnimatedSection>

        <ScrollAnimatedSection variants={staggerContainerVariants}>
          <Box sx={{ mb: 12 }}>
            <motion.div
              variants={fadeInUpVariants}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  fontWeight: 800,
                  mb: 6,
                  color: '#8B5CF6',
                  textShadow: '0 2px 4px rgba(139, 92, 246, 0.3)'
                }}
              >
                {t.whyJoin}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.8,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  fontSize: '1.2rem'
                }}
              >
                {t.whyJoinDesc}
              </Typography>
            </motion.div>

            <Grid container spacing={6} sx={{ mb: 8 }}>
              {[
                { icon: PeopleIcon, ...t.benefits.moreClients },
                { icon: BusinessIcon, ...t.benefits.freedom },
                { icon: TrendingUpIcon, ...t.benefits.tools }
              ].map((benefit, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <ScrollAnimatedSection variants={cardVariants}>
                    <motion.div
                      whileHover={{
                        y: -15,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Card sx={{
                        height: '100%',
                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '24px',
                        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        overflow: 'hidden',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)',
                          transform: 'scaleX(0)',
                          transition: 'transform 0.4s ease'
                        },
                        '&:hover::before': {
                          transform: 'scaleX(1)'
                        }
                      }}>
                        <CardContent sx={{ p: 5, textAlign: 'center' }}>
                          <motion.div
                            variants={iconVariants}
                            style={{
                              width: 100,
                              height: 100,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 2rem auto',
                              border: '2px solid rgba(139, 92, 246, 0.3)'
                            }}
                          >
                            <benefit.icon sx={{ fontSize: 48, color: '#8B5CF6' }} />
                          </motion.div>
                          <motion.div variants={textVariants}>
                            <Typography variant="h5" sx={{
                              mb: 3,
                              fontWeight: 700,
                              color: 'white',
                              fontSize: '1.4rem'
                            }}>
                              {benefit.title}
                            </Typography>
                            <Typography variant="body1" sx={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              lineHeight: 1.7,
                              fontSize: '1.1rem'
                            }}>
                              {benefit.desc}
                            </Typography>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </ScrollAnimatedSection>
                </Grid>
              ))}
            </Grid>
          </Box>
        </ScrollAnimatedSection>

        <ScrollAnimatedSection variants={staggerContainerVariants}>
          <Box sx={{ mb: 12 }}>
            <motion.div
              variants={fadeInUpVariants}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  fontWeight: 800,
                  mb: 6,
                  color: '#EC4899',
                  textShadow: '0 2px 4px rgba(236, 72, 153, 0.3)'
                }}
              >
                {t.future}
              </Typography>
            </motion.div>
            <Grid container spacing={6}>
              {[
                { icon: '1️⃣', ...t.steps.step1 },
                { icon: '2️⃣', ...t.steps.step2 },
                { icon: '3️⃣', ...t.steps.step3 }
              ].map((step, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <ScrollAnimatedSection variants={cardVariants}>
                    <motion.div
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Paper sx={{
                        p: 5,
                        height: '100%',
                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '24px',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)`,
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        },
                        '&:hover::after': {
                          opacity: 1
                        }
                      }}>
                        <motion.div
                          variants={iconVariants}
                          style={{ marginBottom: '1.5rem' }}
                        >
                          <Typography variant="h1" sx={{
                            fontSize: '4rem',
                            margin: 0,
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                          }}>
                            {step.icon}
                          </Typography>
                        </motion.div>
                        <motion.div variants={textVariants}>
                          <Typography variant="h5" sx={{
                            mb: 3,
                            fontWeight: 700,
                            color: '#EC4899',
                            fontSize: '1.3rem'
                          }}>
                            {step.title}
                          </Typography>
                          <Typography variant="body1" sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            lineHeight: 1.7,
                            fontSize: '1.1rem'
                          }}>
                            {step.desc}
                          </Typography>
                        </motion.div>
                      </Paper>
                    </motion.div>
                  </ScrollAnimatedSection>
                </Grid>
              ))}
            </Grid>
          </Box>
        </ScrollAnimatedSection>

        <ScrollAnimatedSection variants={staggerContainerVariants}>
          <Box sx={{ mb: 12 }}>
            <motion.div
              variants={fadeInUpVariants}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  fontWeight: 800,
                  mb: 6,
                  color: '#10B981',
                  textShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                }}
              >
                {t.whatYouGain}
              </Typography>
            </motion.div>
            <ScrollAnimatedSection variants={cardVariants}>
              <Card sx={{
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                  transform: 'scaleX(0)',
                  transition: 'transform 0.6s ease'
                },
                '&:hover::before': {
                  transform: 'scaleX(1)'
                }
              }}>
                <CardContent sx={{ p: 5 }}>
                  <List>
                    {t.gains.map((gain, index) => (
                      <motion.div
                        key={index}
                        variants={textVariants}
                        style={{ marginBottom: '1rem' }}
                      >
                        <ListItem sx={{ px: 0, py: 1 }}>
                          <ListItemIcon>
                            <motion.div
                              variants={iconVariants}
                              style={{ display: 'flex' }}
                            >
                              <CheckCircleIcon sx={{
                                color: '#10B981',
                                fontSize: 32,
                                filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))'
                              }} />
                            </motion.div>
                          </ListItemIcon>
                          <ListItemText
                            primary={gain}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontSize: '1.2rem',
                                color: 'rgba(255, 255, 255, 0.95)',
                                lineHeight: 1.7,
                                fontWeight: 500
                              }
                            }}
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </ScrollAnimatedSection>
          </Box>
        </ScrollAnimatedSection>

        <ScrollAnimatedSection variants={fadeInUpVariants}>
          <Box sx={{
            textAlign: 'center',
            mb: 12,
            p: 8,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
            borderRadius: '32px',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
              opacity: 0,
              transition: 'opacity 0.6s ease'
            },
            '&:hover::before': {
              opacity: 1
            }
          }}>
            <motion.div variants={textVariants}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 800,
                  mb: 6,
                  color: '#8B5CF6',
                  textShadow: '0 2px 4px rgba(139, 92, 246, 0.3)'
                }}
              >
                {t.cta}
              </Typography>
            </motion.div>
            <motion.div variants={buttonVariants}>
              <Button
                component={Link}
                href="/onboarding"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 8,
                  py: 3,
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  borderRadius: '50px',
                  textTransform: 'none',
                  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'translateY(-5px)',
                    boxShadow: '0 25px 50px rgba(139, 92, 246, 0.6)'
                  },
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  mb: 4
                }}
              >
                {t.registerButton}
              </Button>
            </motion.div>
            <motion.div variants={textVariants}>
              <Typography variant="h6" sx={{
                mb: 3,
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1.3rem'
              }}>
                {t.doubts}
              </Typography>
              <Typography variant="body1" sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}>
                {t.contact}
              </Typography>
            </motion.div>
          </Box>
        </ScrollAnimatedSection>

        <ScrollAnimatedSection variants={buttonVariants}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                component={Link}
                href="/"
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  borderWidth: '2px',
                  px: 6,
                  py: 2,
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 30px rgba(255, 255, 255, 0.2)'
                  },
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                {t.backHome}
              </Button>
            </motion.div>
          </Box>
        </ScrollAnimatedSection>
      </Container>
    </Box>
  )
}


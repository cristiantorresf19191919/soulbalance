# 🚀 Next.js Setup - Soul Balance Spa

## ✅ Configuración Inicial Completada

He creado la estructura base de Next.js con TypeScript y Material-UI. Aquí está lo que se ha configurado:

## 📁 Estructura del Proyecto

```
soul-balance-spa/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Layout principal con Material-UI
│   │   ├── page.tsx        # Página de inicio
│   │   └── globals.css     # Estilos globales con colores corporativos
│   ├── components/
│   │   ├── ThemeProvider.tsx    # Provider de Material-UI
│   │   ├── Navbar.tsx           # Navegación (completado)
│   │   ├── Navbar.module.css
│   │   ├── Hero.tsx             # Hero section (completado)
│   │   ├── Hero.module.css
│   │   ├── Services.tsx         # Placeholder
│   │   ├── Corporate.tsx         # Placeholder
│   │   ├── Contact.tsx           # Placeholder
│   │   ├── Footer.tsx            # Footer (completado)
│   │   └── Footer.module.css
│   └── lib/
│       └── firebase.ts      # Configuración Firebase
├── public/
│   ├── superLogo.png        # (copiar manualmente)
│   └── services/            # (copiar manualmente)
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.local              # (crear con tus credenciales)
```

## 🎨 Material-UI Configurado

- ✅ Tema personalizado con colores corporativos
- ✅ Tipografía (Inter + Playfair Display)
- ✅ Roboto Font instalado
- ✅ Material Icons configurado
- ✅ CssBaseline para reset de estilos

## 🔥 Firebase Configurado

- ✅ Configuración base en `src/lib/firebase.ts`
- ✅ SSR-safe (verifica `typeof window`)
- ✅ Listo para Firestore y Auth

## 📦 Dependencias Instaladas

```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "@mui/material": "^5.15.0",
  "@mui/icons-material": "^5.15.0",
  "@emotion/react": "^11.13.0",
  "@emotion/styled": "^11.13.0",
  "@fontsource/roboto": "^5.0.8",
  "firebase": "^10.12.0"
}
```

## 🚀 Pasos para Iniciar

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea `.env.local` en la raíz:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
```

### 3. Copiar Assets

```bash
# Copiar logo
cp superLogo.png public/superLogo.png

# Copiar imágenes de servicios
cp -r services public/services
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📝 Próximos Pasos de Migración

### Componentes a Migrar Completamente:

1. **Services Component**
   - Migrar desde `index.html` sección servicios
   - Usar Material-UI Cards
   - Mantener estilos con CSS Modules

2. **Corporate Component**
   - Migrar desde `empresarial.html`
   - Paquetes corporativos con Material-UI
   - Mantener diseño visual

3. **Contact Component**
   - Migrar formulario desde `index.html`
   - Integrar Firebase Firestore
   - Validaciones y toasts con Material-UI
   - Crear hook `useContactForm`

4. **Páginas Adicionales**
   - `/servicios` - Página completa de servicios
   - `/empresarial` - Página empresarial
   - `/blog` - Blog post
   - `/login` - Autenticación
   - `/admin` - Panel protegido

### Funcionalidades Firebase:

1. **Formulario de Contacto**
   - Hook personalizado `useContactForm`
   - Integración con Firestore
   - Loading states y toasts

2. **Autenticación**
   - Página `/login`
   - Protección de ruta `/admin`
   - Context o hook para auth state

3. **Panel Admin**
   - Tabla de leads (Material-UI DataGrid)
   - Filtros y búsqueda
   - Eliminación de leads
   - Estadísticas

## 💡 Características Implementadas

- ✅ CSS Modules para estilos protegidos (sin Tailwind)
- ✅ Material-UI como librería de componentes
- ✅ TypeScript para type safety
- ✅ Colores corporativos en tema MUI y CSS variables
- ✅ Responsive design con Material-UI breakpoints

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Material-UI Docs](https://mui.com/)
- [Firebase para Next.js](https://firebase.google.com/docs/web/setup)

¡La base está lista! Continúa migrando componentes uno por uno. 🎉


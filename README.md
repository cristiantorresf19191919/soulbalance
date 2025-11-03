# Soul Balance Spa - Next.js Application

Aplicación web para Soul Balance Spa construida con Next.js 14, TypeScript, Material-UI y Firebase.

## 🚀 Características

- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Material-UI (MUI)** para componentes
- **Firebase** para backend (Firestore + Auth)
- **CSS Modules** para estilos protegidos
- **Responsive Design** con Material-UI breakpoints

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
```

### Estructura del Proyecto

```
src/
├── app/              # App Router de Next.js
│   ├── layout.tsx   # Layout principal
│   ├── page.tsx     # Página de inicio
│   └── globals.css  # Estilos globales
├── components/       # Componentes React
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   └── ...
├── lib/             # Utilidades y configuraciones
│   └── firebase.ts  # Configuración Firebase
└── styles/          # Estilos adicionales
```

## 📝 Migración desde HTML/CSS/JS

Este proyecto migra la aplicación original de HTML/CSS/JS vanilla a Next.js manteniendo:
- Todos los colores corporativos
- Funcionalidad completa de Firebase
- Diseño responsive
- Todas las páginas y componentes

## 🎨 Colores Corporativos

- **Verde Principal**: #075257
- **Gris Carbón**: #4D4D4D
- **Beige Cálido**: #F2E9C9
- **Beige Champagne**: #F5F1E8
- **Blanco**: #FFFFFF


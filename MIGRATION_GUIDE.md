# Guía de Migración a Next.js

## ✅ Pasos Completados

1. ✅ Estructura base de Next.js con TypeScript
2. ✅ Material-UI configurado con tema personalizado
3. ✅ CSS Modules para estilos protegidos
4. ✅ Componentes base: Navbar, Hero, Footer
5. ✅ Configuración de Firebase para Next.js

## 📋 Próximos Pasos

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Copia `.env.example` a `.env.local` y completa con tus credenciales de Firebase:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

### 3. Copiar Assets

Asegúrate de que los siguientes archivos estén en `public/`:
- `superLogo.png`
- `logo.jpeg`
- `services/` (toda la carpeta)

```bash
cp superLogo.png public/
cp logo.jpeg public/
cp -r services public/
```

### 4. Componentes Pendientes de Migrar

- [ ] `Services` - Sección de servicios
- [ ] `Corporate` - Sección empresarial
- [ ] `Contact` - Formulario de contacto con Firebase
- [ ] Página `/servicios`
- [ ] Página `/empresarial`
- [ ] Página `/blog`
- [ ] Página `/login` - Autenticación
- [ ] Página `/admin` - Panel de administración

### 5. Funcionalidades a Migrar

#### Formulario de Contacto
- Convertir `script.js` a hook `useContactForm`
- Integrar con Firebase Firestore
- Mantener validaciones y UI

#### Autenticación
- Crear página `/login` con Material-UI
- Integrar Firebase Auth
- Proteger ruta `/admin`

#### Panel Admin
- Crear página `/admin` protegida
- Migrar lógica de `admin.js`
- Tabla de leads con Material-UI DataGrid
- Funcionalidad de eliminación

### 6. Estilos

Los estilos se están migrando a CSS Modules:
- Cada componente tiene su `.module.css`
- Variables CSS globales en `globals.css`
- Colores corporativos mantenidos

### 7. Netlify Functions

Para mantener la seguridad de Firebase config, necesitarás:
- Migrar `netlify/functions/get-firebase-config.js` a Next.js API Route
- O usar variables de entorno directamente (más simple)

Crear `src/app/api/firebase-config/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  })
}
```

## 🚀 Ejecutar el Proyecto

```bash
# Desarrollo
npm run dev

# Abre http://localhost:3000
```

## 📝 Notas Importantes

1. **CSS Modules**: Cada componente tiene su archivo `.module.css` para estilos protegidos
2. **Material-UI**: Usa el sistema de temas de MUI para colores corporativos
3. **Firebase**: Configurado para SSR-safe (verifica `typeof window`)
4. **Tipos**: Todo está tipado con TypeScript

## 🔄 Migración Gradual

Puedes migrar componente por componente manteniendo el código original en paralelo hasta completar la migración.


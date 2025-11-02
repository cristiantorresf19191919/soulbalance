# 🔧 Solución: API Key Rechazada por Firebase Authentication

## 🎯 Problema Identificado:
- ✅ **Firestore funciona** (puedes enviar formularios)
- ❌ **Authentication falla** (error: `auth/api-key-not-valid`)

Esto indica que la API key está siendo leída correctamente, pero Firebase Authentication la está rechazando.

## 🔍 Causas Más Probables:

### 1. **Restricciones de API en Google Cloud Console** ⚠️ (MÁS PROBABLE)

**Problema**: La API key tiene restricciones que permiten Firestore pero bloquean Authentication.

**Solución**:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona el proyecto: `soulbalance-1e02e`
3. Ve a **APIs & Services** → **Credentials**
4. Encuentra tu API Key (debería empezar con `AIzaSy...`)
5. Click en editar la API Key
6. Verifica la sección **"API restrictions"**:
   - Si está en **"Restrict key"**: Asegúrate de que **"Identity Toolkit API"** esté incluida
   - O cambia a **"Don't restrict key"** (solo para desarrollo/testing)
7. En **"Application restrictions"**:
   - Si hay restricciones de HTTP referrers, asegúrate de incluir tu dominio Netlify
   - O usa **"None"** para testing
8. Guarda los cambios

### 2. **Dominios Autorizados en Firebase Console**

**Solución**:
1. Ve a [Firebase Console](https://console.firebase.google.com/project/soulbalance-1e02e/authentication/settings)
2. Ve a **Authentication** → **Settings** → **Authorized domains**
3. Asegúrate de que estén incluidos:
   - `soulbalance.netlify.app`
   - `localhost` (para desarrollo local)
4. Si falta tu dominio Netlify, agrégalo manualmente

### 3. **Identity Toolkit API No Habilitada**

**Solución**:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/apis/library)
2. Busca **"Identity Toolkit API"**
3. Asegúrate de que esté **HABILITADA** para tu proyecto
4. Si no lo está, haz clic en **"Enable"**

### 4. **API Key Diferente entre Firestore y Auth**

Aunque improbable, verifica:
1. En Firebase Console → Project Settings → General
2. Confirma que estés usando la misma **Web API Key** para todo
3. No uses diferentes API keys para diferentes servicios

## ✅ Pasos de Verificación:

### Paso 1: Verificar Restricciones de API
1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Tu proyecto
2. Edita tu API Key
3. Verifica que **Identity Toolkit API** esté permitida O que no haya restricciones

### Paso 2: Verificar Dominios Autorizados
1. [Firebase Console](https://console.firebase.google.com/project/soulbalance-1e02e/authentication/settings) → Authentication → Settings
2. Verifica **Authorized domains**
3. Agrega `soulbalance.netlify.app` si falta

### Paso 3: Verificar APIs Habilitadas
1. [Google Cloud Console](https://console.cloud.google.com/apis/dashboard) → APIs & Services → Enabled APIs
2. Busca y verifica:
   - ✅ **Cloud Firestore API** (ya funciona)
   - ✅ **Identity Toolkit API** (necesaria para Auth)
   - ✅ **Firebase Authentication API**

### Paso 4: Probar de Nuevo
1. Después de hacer cambios, espera 1-2 minutos (puede tomar tiempo propagarse)
2. Limpia caché del navegador (Ctrl+Shift+R)
3. Intenta login de nuevo

## 🆘 Si Aún No Funciona:

### Verifica en Google Cloud Console:
1. Ve a **APIs & Services** → **Dashboard**
2. Revisa si hay errores o cuotas excedidas
3. Verifica que el proyecto correcto esté seleccionado

### Verifica en Firebase Console:
1. **Authentication** → **Settings**
2. Verifica que **Email/Password** esté habilitado
3. Revisa si hay errores o advertencias

### Última Opción - Regenerar API Key:
Si nada funciona, puedes crear una nueva API Key:
1. Google Cloud Console → APIs & Services → Credentials
2. Crea una nueva API Key
3. **NO** agregues restricciones inicialmente (para testing)
4. Actualiza `FIREBASE_API_KEY` en Netlify
5. Redesplega

## 📝 Nota Importante:

El hecho de que Firestore funcione pero Authentication no, sugiere fuertemente un problema de **restricciones de API** en Google Cloud Console. Asegúrate de que tu API Key tenga permisos para **Identity Toolkit API**.


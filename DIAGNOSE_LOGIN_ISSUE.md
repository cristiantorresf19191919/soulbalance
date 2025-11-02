# 🔍 Diagnóstico: Problema de Login con API Key

## ✅ Lo que funciona:
- ✅ Firestore (puedes enviar formularios desde index.html)
- ✅ Función de Netlify (retorna configuración)

## ❌ Lo que no funciona:
- ❌ Firebase Authentication (no puedes hacer login)

## 🎯 Causas Probables:

### 1. **API Key Truncada o Mal Copiada** ⚠️ (MÁS PROBABLE)

**Problema**: La API Key en Netlify está incompleta o mal copiada.

**Solución**:
1. Ve a [Firebase Console](https://console.firebase.google.com/project/soulbalance-1e02e/settings/general)
2. Copia la **Web API Key** COMPLETA
3. Debe empezar con: `AIza` (I mayúscula, no "l" minúscula)
4. Debe tener aproximadamente 39 caracteres
5. Debe terminar con algo como: `...6k2g_Oy_qc`
6. Ve a Netlify → Environment Variables
7. Edita `FIREBASE_API_KEY` y pega la key COMPLETA
8. **IMPORTANTE**: No debe haber espacios al inicio o final
9. Guarda y **REDESPLEGA**

### 2. **Falta FIREBASE_PROJECT_ID**

**Solución**:
- Agrega en Netlify: `FIREBASE_PROJECT_ID` = `soulbalance-1e02e`
- Redesplega

### 3. **API Key Incorrecta para Authentication**

**Problema**: La API Key puede estar correcta para Firestore pero no para Authentication.

**Solución**:
- Verifica en Firebase Console que Authentication esté habilitado
- Asegúrate de usar la API Key de la app web (no otra)

## 🔧 Pasos de Diagnóstico:

### Paso 1: Verificar la Función
Visita:
```
https://soulbalance.netlify.app/.netlify/functions/get-firebase-config
```

**Debe mostrar**:
```json
{
  "apiKey": "AIzaSyBX44sf-qYZKbZG48_yMWYJ6k2g_Oy_qc",
  "projectId": "soulbalance-1e02e",
  "authDomain": "soulbalance-1e02e.firebaseapp.com"
}
```

**Si falta algo o está truncado**: El problema es la variable en Netlify.

### Paso 2: Verificar Logs de Netlify
1. Ve a Netlify Dashboard → **Functions** → `get-firebase-config`
2. Click en **View logs**
3. Busca:
   - `FIREBASE_API_KEY exists: true`
   - `FIREBASE_API_KEY length: 39` (o similar)
   - `FIREBASE_API_KEY starts with: AIzaSyBX4`

**Si length es menor a 35**: La key está truncada.

**Si starts with no es "AIza"**: La key está mal copiada.

### Paso 3: Verificar Console del Navegador
1. Abre login.html
2. F12 → Console
3. Busca mensajes que empiecen con `[FIREBASE CONFIG]`

**Mensajes esperados**:
```
✅ [FIREBASE CONFIG] Config loaded: { hasApiKey: true, apiKeyLength: 39, ... }
🚀 [FIREBASE] Initializing with config: { projectId: "soulbalance-1e02e", ... }
✅ [FIREBASE] Firebase initialized successfully
```

**Si ves errores sobre API key**: El problema está en Netlify.

### Paso 4: Intentar Login
1. Abre login.html
2. Intenta hacer login con: `admin@mail.com`
3. F12 → Console
4. Busca el error exacto

**Errores comunes**:
- `auth/api-key-not-valid` → API Key incorrecta o truncada
- `auth/invalid-api-key` → API Key mal formateada
- `Missing environment variables` → Falta FIREBASE_PROJECT_ID

## ✅ Checklist Final:

- [ ] `FIREBASE_API_KEY` empieza con `AIza` (I mayúscula)
- [ ] `FIREBASE_API_KEY` tiene ~39 caracteres
- [ ] `FIREBASE_API_KEY` no tiene espacios
- [ ] `FIREBASE_PROJECT_ID` está configurada (`soulbalance-1e02e`)
- [ ] Redesplegaste después de cambiar variables
- [ ] La función retorna JSON completo
- [ ] Los logs muestran `authDomain` configurado

## 🆘 Si aún no funciona:

Comparte:
1. La respuesta completa de `/.netlify/functions/get-firebase-config`
2. Los logs de la función en Netlify
3. Los mensajes de consola del navegador al intentar login
4. El error exacto que ves al intentar hacer login


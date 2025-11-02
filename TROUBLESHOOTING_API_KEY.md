# 🔧 Troubleshooting: API Key Not Valid Error

## Error que estás viendo:
```
Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

## 🔍 Pasos para diagnosticar:

### 1. Verificar variables de entorno en Netlify

1. Ve a tu Netlify Dashboard: https://app.netlify.com
2. Selecciona tu sitio
3. Ve a: **Site settings** → **Environment variables**
4. Verifica que existan estas dos variables:
   - `FIREBASE_API_KEY`
   - `FIREBASE_PROJECT_ID`

### 2. Verificar el valor de FIREBASE_API_KEY

**La API Key debe:**
- ✅ Empezar con `AIza` (A mayúscula, I mayúscula, za minúsculas)
- ✅ Tener aproximadamente 39 caracteres
- ✅ NO tener espacios al inicio o final
- ✅ Ser exactamente la misma que aparece en Firebase Console

**Para obtener el valor correcto:**
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto: `soulbalance-1e02e`
3. Ve a **Project Settings** (icono de engranaje) → **General**
4. Baja hasta "Your apps" → Selecciona tu app web (o créala si no existe)
5. Copia el valor de **"Web API Key"**

### 3. Actualizar la variable en Netlify

1. En Netlify, edita `FIREBASE_API_KEY`
2. **Asegúrate de copiar TODO el valor**, especialmente:
   - ✅ El primer carácter debe ser `A` (mayúscula)
   - ✅ No debe haber espacios
   - ✅ Debe terminar con caracteres alfanuméricos

**Formato esperado:**
```
AIzaSyBX44sf-qYZKbZG48_yMWYJ6k2g_Oy_qc
```

### 4. Redesplegar después de cambiar variables

**IMPORTANTE**: Después de agregar o cambiar variables de entorno, DEBES redesplegar:

1. Ve a la pestaña **Deploys**
2. Haz clic en **Trigger deploy** → **Deploy site**
3. Espera a que el deploy termine

O simplemente haz push de un cambio a Git si tienes auto-deploy.

### 5. Verificar en los logs

**En Netlify:**
1. Ve a **Functions** → `get-firebase-config`
2. Haz clic en **View logs**
3. Busca los logs que muestran:
   - `FIREBASE_API_KEY exists: true`
   - `FIREBASE_API_KEY length: 39` (o similar)
   - `FIREBASE_API_KEY starts with: AIzaSyBX4`

**En el navegador (Console):**
1. Abre las Developer Tools (F12)
2. Ve a la pestaña **Console**
3. Busca mensajes que empiecen con `[FIREBASE CONFIG]`
4. Deberías ver:
   - `✅ [FIREBASE CONFIG] Config loaded`
   - `✅ [FIREBASE] Firebase initialized successfully`

### 6. Probar la función directamente

Visita esta URL en tu navegador (reemplaza con tu dominio):
```
https://tu-sitio.netlify.app/.netlify/functions/get-firebase-config
```

**Deberías ver un JSON como:**
```json
{
  "apiKey": "AIzaSyBX44sf-qYZKbZG48_yMWYJ6k2g_Oy_qc",
  "projectId": "soulbalance-1e02e",
  "authDomain": "soulbalance-1e02e.firebaseapp.com"
}
```

**Si ves un error**, revisa los logs de la función en Netlify.

## ❌ Errores comunes:

### "Missing environment variables"
**Solución**: Agrega las variables en Netlify Dashboard y redesplega.

### "API key starts with: Alza" (en lugar de "AIza")
**Problema**: Falta el primer carácter `A` o está mal copiado.
**Solución**: Copia la API key completa desde Firebase Console.

### "API key length: 0" o "undefined"
**Problema**: La variable no existe o está vacía.
**Solución**: Verifica que la variable esté guardada correctamente en Netlify.

### La función devuelve 500
**Solución**: Revisa los logs de la función en Netlify Dashboard para ver el error específico.

## ✅ Checklist:

- [ ] Variables agregadas en Netlify: `FIREBASE_API_KEY` y `FIREBASE_PROJECT_ID`
- [ ] API Key empieza con `AIza`
- [ ] API Key tiene ~39 caracteres
- [ ] No hay espacios al inicio/final
- [ ] Sitio redesplegado después de agregar variables
- [ ] Función retorna 200 cuando la pruebas directamente
- [ ] Console del navegador muestra `✅ [FIREBASE] Firebase initialized successfully`

## 🆘 Si aún no funciona:

1. **Limpia el caché del navegador** (Ctrl+Shift+R o Cmd+Shift+R)
2. **Prueba en modo incógnito**
3. **Verifica los logs de la función** en Netlify
4. **Verifica que el proyecto de Firebase sea correcto** (`soulbalance-1e02e`)
5. **Verifica que Email/Password esté habilitado** en Firebase Authentication

---

**Nota**: Los nuevos logs que agregué te ayudarán a identificar exactamente dónde está el problema. Revisa tanto los logs de Netlify (función) como la consola del navegador.


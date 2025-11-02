# Configuración del Panel de Administración

## Instrucciones para crear el usuario admin

Para usar el panel de administración, necesitas crear un usuario en Firebase Authentication.

### Opción 1: Desde Firebase Console (Recomendado)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `barber-s-app-18e7e`
3. Ve a **Authentication** en el menú lateral
4. Haz clic en **Get Started** si es la primera vez
5. Haz clic en la pestaña **Users**
6. Haz clic en **Add user**
7. Ingresa:
   - **Email**: tu-email@ejemplo.com
   - **Password**: una contraseña segura
8. Haz clic en **Add user**

### Opción 2: Habilitar registro desde la página de login

Si prefieres, puedes agregar un enlace de registro temporal en `login.html`:

```html
<a href="#" onclick="window.location.href='register.html'">Crear cuenta</a>
```

Luego crea `register.html` con un formulario de registro usando `createUserWithEmailAndPassword`.

### Acceso al Panel

1. Abre `login.html` en tu navegador
2. Ingresa el email y contraseña que creaste en Firebase
3. Serás redirigido automáticamente a `admin.html`

## Características del Panel Admin

- ✅ Ver todos los leads capturados del formulario
- ✅ Estadísticas: Total de leads, leads de hoy, leads de esta semana
- ✅ Buscar leads por nombre, email o teléfono
- ✅ Filtrar por servicio
- ✅ Ver detalles completos de cada lead
- ✅ Llamar directamente desde el panel
- ✅ Enviar email desde el panel
- ✅ Diseño responsive para móviles

## Seguridad

⚠️ **Importante**: Por defecto, Firebase Realtime Database permite lectura/escritura a todos. Para mayor seguridad, configura reglas en Firebase:

```json
{
  "rules": {
    "contact-submissions": {
      ".read": "auth != null",
      ".write": true
    }
  }
}
```

Esto asegura que solo usuarios autenticados puedan leer los leads, pero cualquiera puede escribir (para el formulario).

## Notas

- Los leads se guardan en: `contact-submissions` en Firebase Realtime Database
- El panel muestra los leads en tiempo real
- Los datos incluyen: nombre, email, teléfono, servicio, mensaje y timestamp


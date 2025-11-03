# Guía de Versionado

## Versión Actual: 1.8

## Cómo Incrementar la Versión

Cada vez que hagas push a `main` (producción), incrementa el número de versión:

1. Abre `src/lib/version.ts`
2. Cambia el valor de `APP_VERSION`
3. Ejemplo: Si estás en `1.8`, el siguiente sería `1.9`

```typescript
// src/lib/version.ts
export const APP_VERSION = '1.9' // Incrementar aquí
```

4. Haz commit con un mensaje descriptivo:
   ```bash
   git add src/lib/version.ts
   git commit -m "chore: increment version to 1.9"
   ```

## Dónde se Muestra la Versión

La versión aparece en:
- **Header (Navbar)**: Lado derecho superior, posición absoluta
- **Footer**: Al final del texto de copyright

## Tooltip

Al pasar el mouse sobre el número de versión, se muestra un tooltip explicativo en español que indica:
- El número de versión actual
- Que este número se incrementa con cada despliegue a producción
- Su propósito de seguimiento de cambios

## Convención de Versionado

Usa números decimales (1.8, 1.9, 2.0, etc.)
- Incrementa el decimal menor para cambios menores
- Incrementa el número mayor para cambios significativos o releases importantes


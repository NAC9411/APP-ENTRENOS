# Guía de Publicación en Netlify — ENTRE NOS (Modelo COM-B)

## 1. Requisitos previos
- Cuenta en Netlify (conectada a tu repositorio Git o mediante Netlify CLI).
- Clave de API de Google Gemini (`GEMINI_API_KEY`) configurada únicamente como variable de entorno en el servidor de Netlify.

## 2. Configuración del sitio en Netlify
El archivo `netlify.toml` ya define los parámetros necesarios:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`
- **Función Serverless**: `netlify/functions/gemini.ts` (resuelve tanto `/.netlify/functions/gemini` como `/api/gemini`).

## 3. Variables de entorno (Seguridad)
En el panel de Netlify (`Site configuration → Environment variables`):
1. Agrega `GEMINI_API_KEY` con tu clave de Google AI Studio.
2. **Nunca** agregues prefijos `VITE_` a la clave; las llamadas a `@google/genai` ocurren exclusivamente dentro de la función serverless.

## 4. Respaldo y continuidad operativa
- La clasificación COM-B funciona mediante reglas deterministas locales (`src/engine/combRules.ts`) y no depende de Gemini.
- Si `GEMINI_API_KEY` no está configurada o la red falla temporalmente, la aplicación continúa operando con mensajes y controles precargados.

## 5. Verificación de perfiles
Puedes ejecutar la batería automatizada de los cinco perfiles (Casos A–E) localmente con:
```bash
npx tsx tests/verifyProfiles.ts
```
También puedes simular cada perfil directamente desde la pestaña **Publicación** dentro de la interfaz web.

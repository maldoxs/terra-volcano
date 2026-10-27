# CLAUDE.md — Terra Volcano

## Antes de empezar

1. Leer [`claude/ESTADO-ACTUAL.md`](claude/ESTADO-ACTUAL.md): un hecho vigente
   por línea, con enlace al detalle. Es el punto de entrada.
2. Leer [`PLAN.md`](PLAN.md): las fases, las decisiones ya tomadas y lo que
   explícitamente **no** se hace ahora.
3. Leer [`claude/CAMBIOS.md`](claude/CAMBIOS.md): el archivo común
   donde cada sesión anota qué cambió, qué quedó pendiente y qué está
   bloqueado.
4. Leer [`claude/PROTOCOLO.md`](claude/PROTOCOLO.md): es obligatorio
   cumplirlo al terminar.

## Al terminar

Todo cambio se registra en `claude/CAMBIOS.md`, con la ruta completa del
archivo y el estado real: hecho, pendiente, o bloqueado y por quién. Sin eso,
la siguiente sesión no sabe qué se hizo y duplica trabajo.

## Reglas

- **Un dato, un solo lugar.** Si un hecho ya está escrito, enlázalo, no lo
  copies. Dos archivos con el mismo número y uno que cambia = el otro miente.
- **`ESTADO-ACTUAL.md` se sobrescribe en el lugar**, nunca se le agrega como
  log. El historial va en `CAMBIOS.md`.
- **Nada de datos inventados.** Precios, teléfonos y cifras de la agencia van
  marcados `[POR CONFIRMAR]` hasta que Richard los valide.
- **Las fotos del repositorio no son de Terra Volcano.** Ver
  [`LICENCIAS-PENDIENTES.md`](LICENCIAS-PENDIENTES.md). No publicar sin
  resolver eso.
- **Español e inglés, nada más.** Es el mínimo que exige el Decreto 19/2018.
- El texto legal de la declaración de riesgo vive en `sistema/documento.js`,
  versionado y con hash. **No se edita sin revisión de un abogado.**
- **Para diseño: referencia visual → pantallazo → `screenshot-to-code`.** Se
  busca el componente en [21st.dev](https://21st.dev) (o donde sea), se copia
  su *prompt* o se saca un pantallazo, y la skill lo escribe en Vue o en
  HTML/CSS puro. **No instalar el CLI de 21st**: genera React + shadcn, que no
  es el stack de este sitio. Para paleta y tipografía, `ui-ux-pro-max`.

## Estructura

```
PLAN.md                  el plan por fases — puerta de entrada al trabajo
claude/                  la memoria del proyecto (este vault)
produccion/              análisis del negocio y diseño de la landing
sistema/                 el prototipo del registro de pasajeros + schema.sql
assets/, index.html      la landing del Villarrica
```

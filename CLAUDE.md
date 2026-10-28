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

- **Un dato, un solo lugar.** Todo dato de la agencia —teléfono, dirección,
  cifras, precios, catálogo— vive en [`datos/agencia.json`](datos/agencia.json)
  y en ningún otro archivo. El código lo importa; la documentación lo **enlaza**,
  no lo copia. Dos archivos con el mismo número y uno que cambia = el otro
  miente en silencio.
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
- **El stack del sitio es Vue 3 con `<script setup>` (Composition API) y Vite.**
  Sin librerías de animación: el movimiento se hace con CSS, SVG,
  `IntersectionObserver` y un único `requestAnimationFrame` compartido
  (`src/composables/useScrollRaf.js`). Antes de agregar una dependencia de
  animación, hay que justificar qué hace que no se pueda hacer así.
- **Una sola curva de aceleración** (`--ease` en `src/estilos/base.css`) para
  todo el sitio. Es lo que hace que las piezas se sientan parte de lo mismo.

## Estructura

```
PLAN.md                  el plan por fases — puerta de entrada al trabajo
datos/agencia.json       LA FUENTE ÚNICA DE VERDAD de todo dato de la agencia
claude/                  la memoria del proyecto (este vault) — no se publica
sitio/                   el sitio público, Vue 3 + Vite — lo ÚNICO que se publica
  src/componentes/         un componente por sección
  src/composables/         lógica reutilizable (scroll, idioma)
  src/directivas/          v-revelar, v-marcador
  public/media/            videos y fotos
  public/villarrica/       la landing del Villarrica, estática, en /villarrica/
sistema/                 el prototipo del registro de pasajeros + schema.sql
produccion/              análisis del negocio y material de trabajo — no se publica
```

El sitio se levanta con `cd sitio && npm install && npm run dev`.
GitHub Pages publica **sólo `sitio/dist`**, no la raíz del repositorio.

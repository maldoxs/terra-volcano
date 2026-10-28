# Registro de cambios — Terra Volcano

**Este es el archivo común donde cada sesión anota lo que hizo**, para que la
siguiente IA sepa qué cambió, qué quedó pendiente y qué está bloqueado sin
tener que abrir el proyecto entero. Se escribe siempre, aunque el cambio sea
chico, y **la entrada nueva va arriba de la última**.

Antes de escribir acá, traer lo que haya en el remoto con
`git pull --rebase origin main`: varias sesiones agregan su entrada arriba de
todo y es donde se cruzan. Si aparece un conflicto, se conservan las dos
entradas, nunca se descarta la de otra sesión. El formato y los errores
comunes están en [`PROTOCOLO.md`](PROTOCOLO.md).

El estado vigente **no va acá**: va en [`ESTADO-ACTUAL.md`](ESTADO-ACTUAL.md),
que se sobrescribe. Este archivo es log histórico puro y sólo crece.

---

### [SITIO] [DOC] Claude Opus 5, 2026-10-28 (c)

**Archivos modificados:** `produccion/escenas.py` (L7, L177-180, L186),
`produccion/generar_clips.py` (L10, L76), `produccion/referencias/*.jpg` (borrados)

Limpieza y reparación de lo que el reordenamiento anterior dejó roto.

- 🔴 **`escenas.py` y `generar_clips.py` apuntaban a `assets/`**, que dejó de
  existir con el movimiento a `sitio/public/media/`. Correr `escenas.py` creaba
  una carpeta `assets/` fantasma y escribía ahí el `contenido.js`, en vez de en
  el que usa la landing. Ambos scripts ya apuntan a la ubicación nueva.
- 🔴 **Yo había editado `contenido.js` a mano con `sed`**, y ese archivo es
  salida generada: su propia cabecera dice «nunca editar la salida». La próxima
  regeneración habría revertido la corrección y roto las imágenes de nuevo.
  Ahora la corrección vive en el generador, y regenerar produce exactamente lo
  que está commiteado.
- Borrados los 6 `.jpg` de `produccion/referencias/` (2,9 MB). Verificado antes
  de borrar: `FUENTES` en `generar_clips.py` lee **sólo** los `.webp`, y ningún
  otro archivo los menciona. Siguen en el historial de git si hicieran falta.
- Versionado: 26 MB → 23 MB, 296 → 290 archivos.

**Lo que NO se tocó, y por qué:**

- `.claude/skills/` (4,6 MB, 188 archivos): **no está muerto.** `CLAUDE.md`
  nombra `screenshot-to-code` y `ui-ux-pro-max` como el flujo de diseño del
  proyecto. Quitarlas rompería el procedimiento documentado.
- `produccion/prompts/*.txt`: son **salida generada** por `escenas.py`, que los
  reescribe en cada corrida. Borrarlos sin cambiar el generador no sirve de
  nada: vuelven solos.
- Los 16 MB de `.mp4`: siguen versionados. Reescribir el historial para sacarlos
  es justo lo que no conviene hacer ahora que entra más gente — invalidaría el
  clon de todos. Si se decide, se hace antes de que el equipo crezca.

---

### [SITIO] [DOC] Claude Opus 5, 2026-10-28 (b)

**Archivos modificados:** `sitio/` (nuevo, Vue 3), `datos/agencia.json` (nuevo),
`datos/README.md` (nuevo), `sitio/README.md` (nuevo), `CLAUDE.md`,
`claude/ESTADO-ACTUAL.md`, `.github/workflows/pages.yml`,
`assets/` → `sitio/public/media/`, `index.html` → `sitio/public/villarrica/index.html`

Reordenamiento del repositorio para que entre más gente a trabajar.

- **Había tres `index.html`** (la landing, la maqueta y el Vue a medio hacer) y
  ninguno era «el sitio». Ahora hay uno: `sitio/`, Vue 3 con `<script setup>`,
  y es lo único que se publica. La landing del Villarrica se sirve tal cual en
  `/villarrica/` desde `sitio/public/`, sin portarla a Vue.
- **`datos/agencia.json` es la fuente única de verdad.** El WhatsApp estaba
  escrito en 6 archivos y la dirección en 4; el rango de las OTAs en 10. El
  sitio Vue ya no escribe ningún dato: los importa del JSON e interpola
  `{marcadores}` en el copy. `ESTADO-ACTUAL.md` ahora enlaza en vez de copiar.
  **Migración incompleta a propósito:** los análisis de `produccion/` siguen
  citando el teléfono y la dirección dentro de su narrativa (son hallazgos
  sobre el sitio de la agencia, no configuración), y
  `sitio/public/media/js/textos.js` —la landing estática del Villarrica— aún
  los tiene escritos. Quedan como pendiente de migrar.
- **El workflow de Pages publicaba `path: .`**, es decir el repositorio entero:
  `claude/` (la memoria), `produccion/` (los análisis de negocio) y los 4,8 MB
  de `.claude/`. Ahora compila con Node 22 y publica sólo `sitio/dist`.
- `assets/` pasó a `sitio/public/media/` con `git mv`, conservando historial.
- Maqueta en HTML de ayer: se queda en `produccion/maqueta-home/` como
  referencia de diseño. No se publica.
- Verificado con el sitio compilado y servido: 19/19 reveals, altímetro
  1.400→2.847 m monótono, carrusel avanzando, cambio ES/EN, `/villarrica/`
  sin imágenes rotas y el video cargando, 0 errores de consola.
- Tres defectos encontrados y corregidos en el camino: rutas `assets/` rotas en
  `contenido.js` tras el movimiento, `<html lang>` que decía `es` mientras el
  contenido se mostraba en inglés, y la geometría de la ruta del ascenso.

**Pendientes que deja abiertos:**

- 🔴 **Habilitar GitHub Pages en el repositorio.** El workflow ya está correcto;
  `configure-pages` seguirá fallando hasta que se active en Settings → Pages.
- 🟡 Quedan 6 `.jpg` huérfanos en `produccion/referencias/` (3 MB) que no
  referencia ningún archivo; los `.webp` equivalentes sí se usan. No los borré:
  no estaba en lo acordado.
- 🟡 `.claude/skills/` son 4,8 MB y 188 archivos de herramientas versionadas.
  Queda como decisión consciente, sin tocar.
- 🟡 Los 16 MB de `.mp4` siguen versionados en git. `.git` ya pesa 23 MB y cada
  regeneración de un clip deja la versión vieja adentro para siempre.
- 🟡 Las altitudes del catálogo están marcadas `altitudConfirmada:false` en
  `agencia.json`, como pide el `PROTOCOLO.md`.

---

### [SITIO] Claude Opus 5, 2026-10-28

**Archivos modificados:** `produccion/maqueta-home/index.html` (nuevo, 44 KB)

- Maqueta de **home público**, independiente de la landing del Villarrica que
  vive en `index.html`. No toca el WordPress: `PLAN.md` ya decidió que no se
  migra, así que esto es material para decidir diseño, no un reemplazo.
- Pieza central: **el ascenso atado al scroll**. Una banda de 360vh fija el
  escenario con `position:sticky` y el progreso dentro de esa banda maneja todo
  desde una sola función `render(p)`: trazo de la ruta con `stroke-dashoffset`,
  escalador siguiendo la ruta con `getPointAtLength`, altímetro, los tres
  colores del cielo, estrellas que se apagan y la fumarola del cráter.
- Resto de patrones: reveals con `IntersectionObserver` y cascada con tope,
  marcador de texto cuyo ancho sigue al scroll, parallax de tres capas en el
  hero, carrusel de catálogo con la tarjeta del frente agrandada, contadores de
  cifras. **Cero dependencias**, un solo `requestAnimationFrame` compartido.
- **Sin fotografías a propósito.** Todo lo visual es SVG y gradientes, porque
  `LICENCIAS-PENDIENTES.md` sigue abierto. El retrato de Richard es un espacio
  reservado con su leyenda.
- Datos tomados de `ESTADO-ACTUAL.md`: WhatsApp, dirección, 4,8★/141 opiniones,
  #1 en Tripadvisor, fundación 2015, ratio 1:3, rango US$190–208 de las OTAs.
- Verificado en navegador: progreso monótono 0→1, altímetro 1.400→2.847 m,
  59,7 fps durante el ascenso, 0 errores de consola, y con
  `prefers-reduced-motion` la banda colapsa a 216 px y entrega la cumbre.
- **Pendiente de decisión:** el precio directo está puesto como US$160 con
  etiqueta «por confirmar» — es un marcador de maqueta, no una propuesta. El
  precio canónico sigue bloqueado esperando a Richard.
- **Pendiente:** la altitud 2.847 m del Villarrica está en la maqueta sin
  marcar; `PROTOCOLO.md` pide marcar altitudes como `[POR CONFIRMAR]`.

---

### [DOC] Claude Opus 5, 2026-10-27 (c)

**Archivos modificados:** `claude/sistema/architecture/flujos.md`

- El recorrido completo pasó de texto plano a un **diagrama de flujo en
  Mermaid**, con las seis etapas, las decisiones del sistema (ratio 1:3, leyó
  el texto, firmó, llegó a la cumbre) y los dos caminos de entrada: reserva
  con enlace y walk-in con QR del mostrador.
- Cada paso va **pintado según su estado real**: verde lo construido, amarillo
  lo de fase 3, rojo lo bloqueado. Hoy sólo hay un nodo rojo, *lee el texto
  legal completo*, porque falta el texto oficial del decreto.
- Esto responde a la pregunta de qué falta sin tener que cruzar el documento
  con `PLAN.md`: se ve en el dibujo.

**Nota de entorno (no toca el repositorio):** el CLI de Claude Code en el Mac
había quedado instalado bajo Node 24.22.0 y desapareció del PATH al subir a
24.22.1 — los globales de npm en nvm son por versión. Eso, y no una falta de
instalación, era la causa de que una sesión reportara que REA no existía. REA
está conectado. Se resolvió con `nvm reinstall-packages v24.22.0` y se quitó
el MCP de 21st.dev, que fallaba y ya no se usa.

### [DOC] Claude Opus 5, 2026-10-27 (b)

**Archivos modificados:** `claude/sistema/architecture/modelo-datos.md`,
`PLAN.md`

- El diagrama del modelo de datos pasó de un dibujo ASCII de cajas a un
  **diagrama entidad-relación en Mermaid**, con las columnas de cada tabla,
  las claves (PK/FK/UK) y las cardinalidades reales. GitHub lo renderiza solo.
- Se generó leyendo `sistema/schema.sql`, no de memoria: es un reflejo del
  esquema, no una versión paralela.
- **Se eliminó la copia del diagrama que estaba en `PLAN.md`**, que quedó
  apuntando al documento de arquitectura. Eran dos copias del mismo dibujo y
  la regla del proyecto es un dato en un solo lugar.

### [DOC] Claude Opus 5, 2026-10-27

**Archivos modificados:** `CLAUDE.md`

- Se agregó a las reglas el flujo de diseño: referencia visual → pantallazo →
  skill `screenshot-to-code`, que escribe Vue o HTML/CSS puro.
- Queda anotado **no instalar el CLI de 21st.dev**: genera React + shadcn, que
  no es el stack de este sitio. 21st.dev se usa sólo como galería de
  referencia (su botón *Copy prompt* es lo aprovechable, y es gratis).
- Motivo: la sesión se fue varias horas en instalar herramientas. El stack de
  skills ya está completo (`motion`, `ui-ux-pro-max`, `screenshot-to-code`,
  `design`, Playwright, REA) y **no falta instalar nada más**.

**Pendiente, sin empezar:** autenticación del panel `/admin`. Hoy expone
alergias, medicamentos y embarazos de pasajeros a cualquiera con la URL. Es el
único riesgo abierto que no depende de Richard.

### [DOC] Claude Opus 5, 2026-10-26

**Archivos modificados:** `CLAUDE.md` (nuevo), `claude/` (estructura nueva:
`Inicio.md`, `ESTADO-ACTUAL.md`, `CAMBIOS.md`, `PROTOCOLO.md`,
y `sistema/`, `sitio/`, `negocio/` con su `project-memory`,
`current-sprint`, `architecture/` y `sessions/`)

- Se replicó la estructura de memoria del SCP de Grupos Empresariales,
  adaptada a tres áreas en vez de dos: `sistema`, `sitio` y `negocio`.
- Diferencia a favor respecto del SCP original: **todas las rutas son
  relativas al repositorio**, no a una carpeta del Mac, así que no se rompen
  si cambia el equipo.
- `PLAN.md` queda como el plan por fases y `claude/ESTADO-ACTUAL.md` como
  los hechos vigentes. Se enlazan entre sí y **no se repiten**, por la regla de
  un dato un solo lugar.

### [SISTEMA] Claude Opus 5, 2026-10-26

**Archivos modificados:** `sistema/schema.sql` (nuevo), `sistema/db.js`
(nuevo), `sistema/documento.js` (nuevo), `sistema/server.js` (nuevo),
`sistema/public/admin.html` (nuevo), `sistema/public/registro.html` (nuevo),
`sistema/README.md` (nuevo)

- Prototipo funcional del registro de pasajeros sobre el formulario del
  Decreto 19/2018. Corre con `node sistema/server.js`, **sin dependencias**:
  Node 22 trae SQLite incorporado.
- Esquema de producción en PostgreSQL con 12 tablas. Decisión de modelado
  central: los datos de la actividad viven en `salida`, no repetidos en cada
  formulario como en el papel.
- Verificado de punta a punta con navegador: la casilla de riesgo está
  bloqueada hasta leer el texto completo, la firma se dibuja en canvas, y la
  alerta médica del pasajero se propaga al encabezado del manifiesto.
- **Fallo encontrado y corregido:** el formulario imprimible salía con
  encabezados en español y declaración en inglés. Ahora se emite completo en
  el idioma firmado.
- ⚠️ **Pendiente que bloquea producción:** el texto de la declaración en
  `sistema/documento.js` lleva un tercer párrafo que **no está en el
  decreto**. Necesita el texto oficial y revisión de abogado.
- ⚠️ **Riesgo abierto:** `/admin` no tiene autenticación y muestra alergias,
  medicamentos y embarazos.

### [NEGOCIO] Claude Opus 5, 2026-10-26

**Archivos modificados:** `produccion/analisis-competitivo.md` (nuevo),
`produccion/analisis-sitio-actual.md` (nuevo),
`produccion/brechas-terra-volcano.md` (nuevo),
`produccion/requerimientos-sistema.md` (nuevo),
`produccion/checklist-digital.md` (nuevo),
`produccion/ideas-funcionalidades.md` (nuevo),
`produccion/diseno-registro-pasajeros.md` (nuevo), `PLAN.md` (nuevo)

- Hallazgo que define el proyecto: toda su presencia está en OTAs que cobran
  20-30%. Sobre un tour de US$190 son ~US$45 por persona.
- Su sitio: los 11 CTA del home van a `/tours/`, cuyo `<main>` pesa 1.376
  bytes porque el contenido lo inyecta un widget de terceros. Pendiente
  verificar a mano si carga para un visitante real.
- No hay un solo precio publicado en su sitio, y "Villarica" aparece 12 veces
  con una sola r, incluida la URL del producto estrella.
- **Corrección propia:** di por inexistente el Google Business Profile y sí
  existe, con 4,8 ★ y 141 opiniones. Corregido en el checklist.
- **Corrección propia:** el catálogo que supuse estaba mal. Ski touring es una
  línea principal (incluye Lonquimay); Sollipulli y Mocho-Choshuenco no son de
  ellos y se descartaron.

### [SITIO] Claude Opus 5, 2026-10-26

**Archivos modificados:** `index.html` (nuevo), `assets/js/*` (nuevo),
`produccion/escenas.py` (nuevo), `produccion/generar_clips.py` (nuevo),
`produccion/brand-kit.md` (nuevo), `produccion/guion.md` (nuevo),
`LICENCIAS-PENDIENTES.md` (nuevo), `.github/workflows/pages.yml` (nuevo)

- Landing con la técnica scroll-scrub de la skill `oso95/scroll-world`. El
  guion pasó de catálogo de 5 volcanes a **el ascenso al Villarrica en 4
  escenas**, por costo, por foco comercial y porque bajó la página de 17 a 11
  pantallas de scroll.
- Se descartó la generación con AI: las escenas son **fotografía real** con
  movimiento de cámara aplicado en ffmpeg. Costo de generación cero.
- **Fallo del motor documentado y resuelto:** `scroll-world` fija todas sus
  capas al viewport y nunca las suelta, así que tapaba las secciones de
  conversión. Se apagan al terminar el vuelo.
- ⚠️ **Ninguna foto es de Terra Volcano.** Ver `LICENCIAS-PENDIENTES.md`.
- GitHub Pages falla en `configure-pages`: falta habilitarlo en Settings.

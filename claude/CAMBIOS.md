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

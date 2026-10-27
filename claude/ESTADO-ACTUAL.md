# Estado actual — Terra Volcano

Este archivo se **sobrescribe en el lugar**, nunca se le agrega como log. El
historial de cómo se llegó a cada hecho está en
[`CAMBIOS.md`](CAMBIOS.md). El orden de trabajo está en
[`../PLAN.md`](../PLAN.md); acá sólo van **hechos vigentes**.

Última actualización: 2026-10-27

## La agencia

| Hecho | Estado |
|---|---|
| Razón social | Turismo Aventura Richard Díaz Suazo EIRL |
| Dirección | Av. Bernardo O'Higgins 717, Local 4, Boulevard Patagonia, Pucón |
| WhatsApp | **+56 9 8338 8317** — ✅ confirmado en su propio sitio |
| Instagram / Facebook | `@terravolcano_pucon` · `/puconterravolcano/` |
| Google Business | ✅ 4,8 ★ con 141 opiniones, verificado el 2026-10-26 |
| Tripadvisor | ✅ #1 en Pucón |
| Fundación | 2015, por Richard Díaz, escalador chileno. Family-run |
| Sitio actual | WordPress, 4 páginas, **solo inglés** |
| Terra Volcano Hostel | ❌ Ya no opera. La ficha de Google sigue publicada |

**Catálogo confirmado en su sitio:** ascensos (Villarrica, Lanín 2 días), ski
touring (Villarrica, Quetrupillán, Lanín, **Lonquimay**), trekking, rafting,
canyoning, termas, Andean Lakes.
❌ Sollipulli y Mocho-Choshuenco **no** aparecen: se descartaron del proyecto.

## Hallazgos vigentes sobre su sitio

- 🔴 Los **11 CTA del home** apuntan a `/tours/`, cuyo `<main>` pesa 1.376
  bytes: el contenido lo inyecta un widget de `tourtask-booking.pages.dev`.
  **Para Google esa página está vacía.** 🔎 Falta verificar a mano si carga
  para un visitante real.
- 🔴 **No hay un solo precio** en todo el sitio. Las OTAs publican US$190–208.
- 🔴 **"Villarica"** con una sola r aparece 12 veces contra 2 bien escritas,
  incluida la URL del producto estrella.
- 🟡 Contradicción: el home dice "15 years of expertise", el About dice
  fundada en 2015.

→ Detalle en [`../produccion/analisis-sitio-actual.md`](../produccion/analisis-sitio-actual.md)

## El sistema de registro

| Hecho | Estado |
|---|---|
| Formulario legal de referencia | Decreto N°19/2018, Min. Economía, Fomento y Turismo. 🔎 Confirmar vigencia |
| Idiomas | Español e inglés. Es el mínimo que exige el decreto |
| Esquema de producción | ✅ PostgreSQL, 12 tablas, en [`../sistema/schema.sql`](../sistema/schema.sql) |
| Prototipo | ✅ Funciona. `node sistema/server.js`. Node 22 + SQLite incorporado, sin dependencias |
| Formulario del pasajero | ✅ Bilingüe, con firma en canvas y verificación de edad mínima |
| Manifiesto por fecha | ✅ Con alertas médicas, verificación de ratio 1:3 y check-in |
| Formulario legal imprimible | ✅ Completo en el idioma firmado, con rastro de auditoría |
| Texto de la declaración | ⚠️ **Lleva un párrafo agregado que no está en el decreto.** Bloquea producción |
| Autenticación del panel | ❌ **`/admin` está abierto con datos de salud** |
| Envío de correos y código de verificación | ❌ No implementado |
| PDF binario archivado | ❌ Hoy es vista imprimible |

→ Detalle en [`sistema/architecture/modelo-datos.md`](sistema/architecture/modelo-datos.md)

## La landing del Villarrica

| Hecho | Estado |
|---|---|
| Guion | ✅ El ascenso en 4 escenas: lago → ascenso → cráter → cierre |
| Arquitectura | Recorrido continuo hacia adelante, sin conectores |
| Material | Fotografía real con movimiento de cámara en ffmpeg. **Cero AI** |
| Resolución | 1280×720. El material de origen no da para 1080p honesto |
| Idiomas | ES/EN con detección automática |
| Fotos | ⚠️ **Ninguna es de Terra Volcano.** Pendientes de licencia |
| GitHub Pages | ❌ No habilitado. El workflow existe y falla en `configure-pages` |
| Dónde vive finalmente | ⬜ Sin decidir: home, landing de campaña o nada |

→ Detalle en [`sitio/architecture/landing.md`](sitio/architecture/landing.md)

## Bloqueado, esperando a Richard

- Texto oficial de la declaración de riesgo del decreto
- ¿El Decreto 19/2018 sigue vigente?
- ¿La exención vale por salida o por temporada?
- Licencias de las fotos, o contratar una salida de drone
- Cuántos pasajeros al año
- Precio canónico a publicar
- ¿Aceptan menores? ¿Desde qué edad por actividad?

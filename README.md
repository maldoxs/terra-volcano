# Terra Volcano — sitio scroll-world

Landing inmersiva para [Terra Volcano](https://www.tripadvisor.com/Attraction_Review-g294297-d19396299-Reviews-Terra_Volcano_Pucon-Pucon_Araucania_Region.html),
agencia de turismo de aventura de Pucón, Región de La Araucanía. Al hacer
scroll, una cámara pre-renderizada vuela de volcán en volcán por un mundo en
miniatura, sin cortes: **el vuelo es el catálogo**.

Construido con la skill [`oso95/scroll-world`](https://github.com/oso95/scroll-world) (MIT).

## Estado: prototipo con fotografía real, costo cero

El vuelo recorre **el ascenso al Villarrica en 4 escenas**: el lago y Pucón, la
cordada en la nieve, el cráter con su fumarola, y el cierre al atardecer con el
CTA. El scroll *es* subir el cerro.

No hay nada generado con AI. Cada escena es una fotografía real con un
movimiento de cámara lento aplicado con ffmpeg, que el motor scrubea según el
scroll — la misma técnica de las páginas scroll-through de Apple. Costo de
generación: **cero**.

> ⚠️ **Las fotos no son de Terra Volcano y están pendientes de licencia.**
> Ver [`LICENCIAS-PENDIENTES.md`](LICENCIAS-PENDIENTES.md). El sitio no se
> publica hasta resolver eso.

Los otros cuatro volcanes del catálogo (Quetrupillán, Lanín, Sollipulli,
Mocho-Choshuenco) viven en la tabla de exigencia, en texto. Cuestan $0 y se
actualizan sin re-renderizar nada.

| | Estado |
|---|---|
| Guion de 4 escenas (el ascenso al Villarrica) | ✅ |
| Brand kit y paleta | ✅ borrador, por validar con el cliente |
| 17 prompts listos para generar | ✅ |
| Motor de scroll cableado y verificado | ✅ |
| Secciones de conversión (exigencia, guía, reserva) | ✅ copy con datos por confirmar |
| Bilingüe ES/EN | ✅ |
| Clips desde fotografía real | ✅ 1280×720, sin costo |
| Metraje de drone propio y licenciado | ⬜ lo que falta de verdad |
| Versión móvil nativa 9:16 | ⬜ opcional, duplica el costo de video |

## Estructura

```
index.html                     la página
assets/js/scrub-engine.js      motor de scroll (de la skill, sin modificar)
assets/js/contenido.js         GENERADO — escenas y copy del vuelo
assets/js/textos.js            copy bilingüe de las secciones de conversión
assets/js/sitio.js             arranque: idioma, montaje, tablas
assets/stills/                 posters por escena (placeholder)
assets/vid/                    6 inmersiones + 5 conectores (placeholder)
produccion/escenas.py          FUENTE ÚNICA de escenas → prompts + contenido.js
produccion/generar_clips.py    convierte las fotos en los clips del vuelo
produccion/referencias/        las fotos de origen (pendientes de licencia)
produccion/prompts/            prompts, por si algún día se genera con AI
produccion/brand-kit.md        paleta, tono y style preamble
produccion/analisis-competitivo.md   por qué el sitio está armado así
produccion/knockout.py         recorte de fondo (de la skill), opcional
```

## Cómo trabajarlo

```bash
python3 produccion/escenas.py              # tras editar escenas o copy del vuelo
python3 produccion/generar_clips.py        # tras cambiar fotos o recortes
python3 -m http.server 8777                # y abrir http://127.0.0.1:8777
```

`contenido.js` y los prompts son **archivos generados**: se sobrescriben. Editar
`produccion/escenas.py`, no la salida.

## Cuando haya presupuesto

El reemplazo es un swap de archivos, la página no cambia una línea: los clips
reales van en `assets/vid/` con los mismos nombres (`villarrica.mp4`,
`conector-0.mp4`, …) y los stills en `assets/stills/`.

La regla que no se puede romper al generar los conectores: sus extremos son los
**frames reales renderizados** de los clips vecinos (último del anterior,
primero del siguiente), nunca los stills. Es lo que hace que la costura calce.
`produccion/generar_placeholders.py` ya lo hace así, a propósito, para que el
pipeline real sea el mismo procedimiento.

Costos estimados y rutas de pago: ver el análisis y
[SKILL.md de scroll-world](https://github.com/oso95/scroll-world).

## Pendiente de confirmar con el cliente

La lista vive en [`produccion/analisis-competitivo.md`](produccion/analisis-competitivo.md).
Todo dato marcado `[POR CONFIRMAR]` en el copy salió de plataformas de reserva o
de reseñas de clientes, **no de Terra Volcano**. No publicar sin validar.

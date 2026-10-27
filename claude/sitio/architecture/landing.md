# La landing del Villarrica

## Qué es

Una página donde **el scroll es subir el cerro**. La cámara está
pre-renderizada; el scroll sólo mueve el tiempo del video. Es la misma técnica
de las páginas scroll-through de Apple.

Construida con la skill [`oso95/scroll-world`](https://github.com/oso95/scroll-world) (MIT).

## Las cuatro escenas

| # | Escena | Acento | Rol |
|---|---|---|---|
| 1 | El lago — Pucón y el cono al fondo | Lago `#3A7CA5` | El hero |
| 2 | El ascenso — la cordada en la nieve | Nieve | La exigencia |
| 3 | El cráter — la fumarola desde el aire | Lava `#D64A1E` | El premio |
| 4 | Atardecer — el cierre con el CTA | Azufre `#E8B33C` | La reserva |

Arquitectura **A** de la skill: recorrido continuo hacia adelante, **sin
conectores**. La cámara nunca retrocede.

## Cómo se generan los clips

No hay AI. Cada escena es una fotografía real con un movimiento de cámara lento
aplicado en ffmpeg (`produccion/generar_clips.py`), a 1280×720 — el material de
origen no da para 1080p honesto y escalarlo sería inflar píxeles.

Cuando llegue metraje de drone real, se reemplazan los `.mp4` de `assets/vid/`
con los mismos nombres y la página no cambia una línea.

## Fuente única

`produccion/escenas.py` genera `assets/js/contenido.js` y los prompts. **Editar
el script, no la salida**: se sobrescribe.

## Dos arreglos sobre el motor

1. **Las capas fijas no se sueltan.** `scroll-world` fija `.sw-sky`,
   `.sw-stage`, `.sw-copylayer`, `.sw-route`, `.sw-hint` y `.sw-topbar` al
   viewport y nunca los libera, porque asume que la página es sólo el vuelo.
   Tapaban las secciones de conversión. Se apagan al salir de la banda del
   vuelo con la clase `body.fuera-del-vuelo`, sin tocar el motor.
2. **El selector de idioma** chocaba con el nav arriba a la derecha y con los
   botones del CTA abajo a la izquierda. Vive debajo del nav, sobre el riel de
   ruta: el único hueco libre en todo el scroll.

## Verificado

Blobs seekables, `currentTime` siguiendo el scroll, sin errores de consola, sin
desborde horizontal en 390px.

## ⚠️ Pendiente que bloquea publicación

Ninguna foto es de Terra Volcano. Ver
[`../../../LICENCIAS-PENDIENTES.md`](../../../LICENCIAS-PENDIENTES.md).

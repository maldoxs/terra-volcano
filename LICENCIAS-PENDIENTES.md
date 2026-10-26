# Licencias pendientes — leer antes de publicar

**Ninguna de las fotografías de este repositorio es de Terra Volcano.** Todas
llegaron como capturas de pantalla, buscadas como referencia visual del
Villarrica. Sirven para construir y evaluar el sitio; **no para publicarlo.**

| Archivo | Qué es | Dónde se usa | Estado |
|---|---|---|---|
| `produccion/referencias/ref-costanera-lago.webp` | El volcán desde la costanera de Pucón, con el lago y los botes | Escena 1 del vuelo | ⚠️ Autor desconocido |
| `produccion/referencias/ref-cordada-ascenso.webp` | Cordada subiendo la nieve al amanecer | Escena 2 del vuelo | ⚠️ Autor desconocido |
| `produccion/referencias/ref-crater-aereo.webp` | El cráter desde el aire, con fumarola | Escena 3 del vuelo | ⚠️ Autor desconocido |
| `produccion/referencias/ref-cono-atardecer.webp` | El cono con luz dorada, desde el bosque | Escena 4 del vuelo | ⚠️ Autor desconocido |
| `produccion/referencias/ref-fumarola-aerea.webp` | Aérea con columna de humo, cono de ceniza | Banda entre secciones | ⚠️ Autor desconocido |
| `produccion/referencias/ref-centro-esqui.webp` | Base del volcán, refugio y gente en la nieve | Retrato de la sección del guía | ⚠️ Autor desconocido |

Además se revisó un reel de Instagram (`instagram.com/reels/DaJbQ-AxBQ3/`) como
posible metraje del vuelo. **Descartado**: es de un tercero, y la captura de
pantalla deja un área útil de 1000×1750 px con pérdida de tres compresiones
encadenadas. La toma sí es la correcta (drone, continua, hacia adelante), lo
que confirma qué hay que conseguir.

## Qué hacer antes de publicar

1. **Pedirle a Richard las fotos propias de la agencia.** Es gratis y es lo
   primero.
2. **Contratar media jornada de drone en Pucón.** Cuatro tomas continuas de 10
   a 15 segundos: el volcán desde el lago, el ascenso por la nieve, el cráter
   desde arriba y la zona del refugio. Material crudo, sin cortes ni música. En
   el orden de los US$27 que costaría generarlo con AI, y queda propio,
   licenciado y reutilizable para redes.
3. **O licenciar las tomas de quien ya las tiene.** La cuenta del reel revisado
   tiene drone y conoce el cerro: es un proveedor, no un obstáculo.

El reemplazo es un swap de archivos: mismos nombres en
`produccion/referencias/`, se corre `python3 produccion/generar_clips.py` y la
página no cambia una línea.

## Y lo que falta además de las fotos

- Foto real de Richard guiando, en alta resolución
- Fotos de los otros cuatro volcanes del catálogo
- Consentimiento si aparecen caras reconocibles de clientes

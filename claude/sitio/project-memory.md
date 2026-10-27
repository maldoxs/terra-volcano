# Sitio — historial narrativo

## 2026-10-26 — Del catálogo al ascenso

El guion original recorría cinco volcanes, uno por escena. Se cambió a **el
ascenso al Villarrica en cuatro escenas** por tres razones: casi toda la
facturación visible de la agencia es el Villarrica, no se pudo confirmar que
dos de esos volcanes siguieran en el catálogo, y la página medía 17 pantallas
de scroll antes de la primera línea de texto. Ahora mide 11.

Como efecto secundario, el cambio permitió pasar a un recorrido continuo hacia
adelante: la cámara nunca retrocede, y desaparece el tartamudeo en las costuras
que trae el formato de catálogo.

## Por qué no se generó con AI

El plan inicial era generar las escenas con Higgsfield (~US$27 el chain de
1080p). Al llegar fotografías reales del Villarrica se descartó: para vender un
destino real, una foto de verdad le gana a cualquier render, y cuesta cero.

La técnica no cambió — el motor scrubea video pre-renderizado sin importar de
dónde venga. Sólo cambió la fuente.

## Dos fallos que sólo aparecieron al mirar el render

- **La nieve con el color del fondo.** En los placeholders dibujados con PIL, la
  cumbre nevada usaba el mismo valor que el fondo de la página y desaparecía.
- **El parche del overlay.** Una captura traía el badge "Mostrar a tamaño real"
  encima de la foto. El primer intento lo tapó copiando la franja de arriba, que
  era cielo, y quedó un bloque gris. La textura de un paisaje es continua en
  horizontal, no en vertical.

## El motor fija todo al viewport

`scroll-world` está pensado para páginas que son **sólo** el vuelo: fija
`.sw-sky`, `.sw-stage`, `.sw-copylayer`, `.sw-route`, `.sw-hint` y
`.sw-topbar` al viewport y nunca los suelta. Con contenido debajo, los tapaba.
Se resolvió apagando esas capas al salir de la banda del vuelo, sin tocar el
motor original.

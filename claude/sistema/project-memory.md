# Sistema — historial narrativo

El detalle de **por qué** el sistema quedó como quedó. Lo vigente está en
[`../ESTADO-ACTUAL.md`](../ESTADO-ACTUAL.md); el log por sesión en
[`../CAMBIOS.md`](../CAMBIOS.md).

## 2026-10-26 — De dónde salió el proyecto

El problema no lo trajo un brief: apareció conversando. **Todos los pasajeros
de la agencia están registrados en papel**, y no hay forma de saber quién subió
un día determinado sin revisar carpetas.

Eso tiene dos caras. La administrativa es obvia. La que pesa más es la de
seguridad: en un volcán activo hay que saber en minutos quién está arriba, con
qué guía y cuál es su contacto de emergencia.

## La decisión de alcance que evitó un problema

La tentación era construir reservas online junto con el registro. Se descartó:
la agencia vende los mismos cupos en Viator, GetYourGuide, Expedia y su sitio,
y un sistema propio sin sincronización de inventario **los haría sobrevender**.
Eso en temporada alta es una reseña de una estrella y un cliente furioso en la
puerta.

El registro, en cambio, se llena al momento o después de la salida y **da lo
mismo de dónde vino la reserva**. Riesgo cero. Por eso es la fase 1 y las
reservas son la fase 4, con sistema comprado.

## El formulario real cambió el diseño

Hasta tener la foto del formulario legal el diseño iba sobre supuestos. Al
verlo aparecieron dos cosas: pide el **peso** del participante —condiciona
arnés y crampones— y exige **dos** contactos de emergencia, no uno.

Y la decisión de modelado que ordena todo: el papel **repite los datos de la
actividad en cada hoja** (guía, fecha, horas, lugares, itinerario). En la base
viven una sola vez, en `salida`, y el PDF de cada pasajero se arma fusionando.
Digitalizar esto no es escanear el formulario, es reestructurarlo.

## Un fallo que sólo apareció al renderizar

El formulario imprimible salía con los encabezados en español y la declaración
de riesgo en inglés, porque el idioma se aplicaba sólo al texto legal. Es
legalmente discutible: quien firma tiene que poder leer el documento entero.
Ahora se emite completo en el idioma firmado.

## Lo que se decidió NO resolver todavía

- **Autenticación**: el prototipo la omitió a propósito para avanzar, y por eso
  quedó anotada como riesgo abierto, no como funcionalidad pendiente.
- **PDF binario**: se entrega vista imprimible. Para producción hay que
  generarlo en el servidor y archivarlo con su hash.
- **El texto legal**: lleva un párrafo agregado sobre veracidad de la
  información que no está en el decreto. Es sensato, pero no lo decide quien
  programa.

# Sistema Terra Volcano — levantamiento de requerimientos

Documento de planificación. **No es un plan de implementación todavía**: es la
lista completa de lo que el sistema debería cubrir para que la agencia quede a
la par del mercado, ordenada por área y con prioridad.

Estado: borrador para discutir con Richard. Todo lo marcado 🔎 hay que
confirmarlo con él o con la autoridad correspondiente.

---

## A. Reemplazar el papel — la operación diaria

Hoy cada pasajero llena y firma un formulario en papel. No hay forma de saber
quién subió un día X sin revisar carpetas. Esto es lo que hay que digitalizar.

### A1. Ficha del pasajero
- Nombre completo, RUT o pasaporte, nacionalidad, idioma
- Fecha de nacimiento (hay edad mínima en varios tours)
- Email y teléfono con código de país
- **Contacto de emergencia**: nombre, parentesco, teléfono
- Alojamiento en Pucón y número de habitación (para recogerlos)

### A2. Declaración de salud
- Condiciones preexistentes: cardíacas, respiratorias, epilepsia, diabetes
- Medicamentos en uso y alergias
- Cirugías o lesiones recientes
- Nivel de experiencia en montaña autodeclarado
- ¿Tiene seguro médico de viaje? ¿Cuál?

Esto no es burocracia: a 2.847 m con crampones, que el guía sepa que alguien es
asmático cambia decisiones.

### A3. Exención de responsabilidad, firmada
El documento que hoy se firma en papel. Ver sección **E** para cómo hacerlo
legalmente válido en digital.

### A4. Autorización de uso de imagen — **separada**
Van a querer publicar fotos del grupo en Instagram. Tiene que ser una casilla
aparte, no enterrada en la exención. Hay gente que no quiere salir en fotos y
tiene derecho a decir que no sin renunciar al tour.

### A5. Consentimiento de marketing — **también separado**
Tercera casilla, independiente de las dos anteriores. Sin esto no se puede
enviar el descuento promocional. Guardar fecha y hora del consentimiento.

### A6. Manifiesto de salida
La lista del día: quién va, con qué guía, con qué contacto de emergencia.

- Exportable a PDF e **imprimible**
- **Disponible offline**: en el volcán no hay señal. El guía tiene que poder
  descargarlo antes de salir
- Visible desde el celular
- Debe incluir las condiciones de salud relevantes de cada pasajero

### A7. Asignación de guías y verificación de ratio
Asignar guías a cada salida y que el sistema **avise si se rompe la ratio de
1 guía cada 3 personas**, que es justamente lo que venden.

### A8. Control de equipamiento
Qué se le entregó a cada pasajero y en qué talla: botas, casco, crampones,
piolet, chaqueta, máscara de gas. Y marcar la devolución.

Es casi seguro que esto también es papel hoy, y que se les pierde equipo sin
saber con quién se fue.

### A9. Check-in del día
Quién llegó, quién no se presentó, a qué hora salió el grupo.

### A10. Resultado del ascenso
- ¿Llegó a la cumbre? Si no, ¿hasta dónde y por qué?
- Hora de cumbre, hora de regreso
- Condiciones del día

**Este campo es el que habilita la mejor campaña de retención que tienen.**
Ver sección C.

### A11. Registro de incidentes
Caídas, mal de altura, rescates, evacuaciones, cancelaciones en ruta. Para
mejorar y para respaldarse ante un reclamo o un seguro.

---

## B. Reservas y venta

### B1. Reserva desde la web
Fecha, tour, número de personas, datos de contacto. Confirmación inmediata.

### B2. Reserva presencial cargada al mismo sistema
El que llega al local de O'Higgins 717 entra a la misma base. **Un solo
registro de verdad, no dos sistemas paralelos.**

### B3. Canal de origen — campo obligatorio
`web | presencial | whatsapp | telefono | viator | getyourguide | expedia | tripadvisor | ...`

**Es el campo más valioso de todo el sistema.** Es lo que permite calcular
cuánta plata se va en comisiones contra cuánto entra directo. Hoy ese número no
existe en ninguna parte.

### B4. Abonos, saldo y pagos
- Abono al reservar, saldo al llegar
- Webpay, Flow o Mercado Pago para el canal directo
- Transferencia y efectivo para el presencial
- Registro de qué se pagó, cuándo y por qué medio

### B5. Política de cancelación aplicada sola
Las OTAs publican 24 h con reembolso total 🔎. El sistema debería calcular
automáticamente si una cancelación da reembolso o no.

### B6. Reagendamiento masivo por clima
**Un botón que mueva una salida completa a otra fecha y notifique a todos.**
Cancelan por viento seguido; hoy eso es una ronda de llamadas.

### B7. Cupos y disponibilidad
Cupo máximo por salida, cupos tomados, lista de espera automática.

### B8. Sincronización con las OTAs
⚠️ **El riesgo grande.** Venden los mismos cupos en Viator, GetYourGuide,
Expedia y su sitio. Sin sincronizar inventario, van a sobrevender.

Opciones: usar un sistema especializado que ya sincroniza (Bókun, Rezdy,
FareHarbor, Checkfront), o mantener un bloqueo manual de cupos. **No
construir esto desde cero.**

### B9. Voucher de confirmación
Con QR o código, en el idioma del cliente, con punto de encuentro y hora.

---

## C. Comunicación automatizada

El idioma de cada mensaje sale del campo `idioma` del cliente.

| Momento | Mensaje | Tipo |
|---|---|---|
| Al reservar | Confirmación, voucher, qué incluye, cómo llegar | Transaccional |
| T-72 h | Qué llevar, qué ropa, recomendaciones físicas | Transaccional |
| T-24 h | Confirmación de hora, pronóstico y **alerta volcánica Sernageomin** | Transaccional |
| Mañana de la salida | Hora y punto de encuentro exacto | Transaccional |
| Si cancelan por clima | Aviso inmediato con opciones de reagendamiento | Transaccional |
| T+1 día | Gracias, fotos del grupo, y **pedir reseña en Tripadvisor y Google** | Transaccional / marketing |
| T+7 días, si NO llegó a cumbre | "Quedaste a 300 m. Vuelve a terminarlo con descuento" | Marketing ⚠️ consentimiento |
| T+1 año | Aniversario del ascenso, otro volcán del catálogo | Marketing ⚠️ consentimiento |
| Temporada baja | Oferta a la base de datos | Marketing ⚠️ consentimiento |

**La campaña de los que no llegaron a la cumbre es la joya.** Esa gente viajó
hasta Pucón, pagó, y se fue con la espina clavada. Nadie más en el mercado
puede hacerles esa oferta porque nadie más tiene ese dato.

Pedir la reseña automáticamente también vale oro: son **#1 en Tripadvisor en
Pucón** y esa posición se defiende con reseñas nuevas, no con las de 2019.

---

## D. Datos y gestión

### D1. Tablero de control
- Ocupación por fecha y por tour
- **Ingresos por canal y comisión pagada a OTAs** ← el número que justifica todo
- Tasa de cumbre por mes, por guía, por condición climática
- Tasa de no-show
- Clientes que repiten y valor de vida del cliente (LTV)
- Estacionalidad, para planificar temporada

### D2. Exportación para contabilidad
CSV o integración con el sistema contable que usen 🔎.

---

## E. El formulario firmado — cómo digitalizarlo

Lo que preguntaste específicamente. En Chile la **Ley 19.799** reconoce la
firma electrónica y distingue dos niveles:

- **Firma electrónica simple**: válida entre privados. Menor peso probatorio.
- **Firma electrónica avanzada**: con certificado acreditado. Más peso, más
  costo y fricción.

**Para una exención de responsabilidad entre la agencia y un pasajero, la firma
simple sirve.** Y bien implementada **es más sólida que el papel**, porque el
papel no deja rastro de auditoría.

### Qué hay que guardar para que se sostenga

No basta con un garabato en un canvas. Hay que registrar:

1. **Versión exacta del documento firmado** — guardar el texto completo y su
   hash. Si mañana cambian la exención, hay que poder probar cuál firmó él.
2. **Identidad verificada** — email o teléfono confirmado con código, no solo
   escrito a mano.
3. **Marca de tiempo** del momento de la firma.
4. **IP y user-agent** del dispositivo.
5. **Trazo de la firma** si se dibuja en pantalla, como imagen.
6. **Copia inmediata al firmante** por correo, con el PDF adjunto. Esto es
   clave: que el cliente tenga su copia es lo que hace difícil que después
   alegue que no sabía.
7. **Casillas separadas** para exención, uso de imagen y marketing. Nunca una
   sola que acepte las tres.

### El flujo que yo haría

**No los hagas llenar el formulario en el local.**

Al reservar, el sistema manda un link único al pasajero. Lo llena en su
alojamiento, con calma, en su idioma, desde su celular. Llega al local **ya
firmado**.

Eso resuelve tres cosas de una:
- Elimina 15 minutos de papeleo a las 6 de la mañana con gente dormida
- La letra ilegible y los emails mal escritos desaparecen
- El guía ve las condiciones de salud **antes** del día de la salida, no en el
  momento

Para el que llega sin reserva: **un QR pegado en el mostrador** que abre el
mismo formulario en su propio teléfono. Cero papel igual.

Y un detalle que importa: si el pasajero es **menor de edad**, el formulario lo
firma el adulto responsable, y eso es otro flujo 🔎 (confirmar si aceptan
menores y desde qué edad).

---

## F. Cumplimiento y seguridad

- 🔎 **Registro Nacional de Prestadores de Servicios Turísticos** de Sernatur,
  vigente
- 🔎 **Normas chilenas de turismo aventura** (familia NCh 2950) y qué certifica
  la acreditación municipal de Pucón que ya mencionan
- 🔎 **Seguros**: responsabilidad civil y accidentes. Verificar cobertura y que
  esté vigente
- 🔎 **Permisos CONAF** y entradas al Parque Nacional Villarrica
- **Alerta volcánica Sernageomin**: integrarla al sistema y al sitio. Si sube
  de nivel, el acceso se cierra y hay que reagendar a todos
- **Protección de datos**: Ley 19.628, y la Ley 21.719 que viene entrando en
  vigor con obligaciones bastante más exigentes. Con clientes europeos, además
  GDPR. Consentimiento explícito, derecho a borrado, política de retención
- **Respaldos** de la base, automáticos y probados

---

## G. Paridad con el mercado — lo que la competencia ya tiene

Lo que un cliente espera hoy y hoy no encuentra en terravolcano.com:

| | Estado actual |
|---|---|
| Precios visibles | ❌ Ninguno en todo el sitio |
| Reserva online que funcione | ⚠️ Los 11 CTA van a una página sin contenido en el HTML |
| Confirmación instantánea | ❌ |
| Política de cancelación publicada | ❌ Está en las OTAs, no en su sitio |
| Reseñas en el propio sitio | ⚠️ Tres, y el resto manda a Tripadvisor |
| Sitio bilingüe | ❌ Solo inglés |
| Qué incluye y qué no, detallado | ❌ |
| Nivel de exigencia física por tour | ❌ |
| Fotos del tour para el cliente | ❌ |
| Galería real del ascenso | ⚠️ |

---

## Prioridad sugerida

**Fase 1 — El registro (sin tocar reservas, riesgo cero)**
A1 a A6, A10, E completo, y respaldos. Reemplaza el papel y habilita todo lo
demás. No toca inventario, así que no hay riesgo de sobreventa.

**Fase 2 — Comunicación**
C completo, más D1 básico. Es donde aparece el retorno visible.

**Fase 3 — Venta directa**
B completo, con sistema especializado para la sincronización con OTAs.

**Transversal** — F, desde el día uno. El consentimiento no se puede agregar
retroactivamente.

---

## Preguntas abiertas

- [ ] ¿Esto es solo para Terra Volcano o es un producto para varias agencias de
      Pucón? Cambia el diseño por completo (multi-tenant)
- [ ] ¿Cuántos pasajeros al año? Define si esto es una planilla con esteroides
      o un sistema de verdad
- [ ] ¿Cuántos guías y qué tan cómodos son con tecnología?
- [ ] ¿Qué usan hoy para contabilidad y facturación?
- [ ] ¿Aceptan menores de edad? ¿Desde qué edad?
- [ ] ¿Quién mantiene el sistema cuando tú no estés?

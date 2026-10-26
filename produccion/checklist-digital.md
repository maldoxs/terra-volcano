# Checklist digital Terra Volcano — todo lo que debería existir

Complemento de `requerimientos-sistema.md`. Ese cubre el sistema interno; este
cubre **la cara pública y la automatización**: el sitio, los QR, los canales
y lo que hoy no existe.

Marcado: ✅ ya lo tienen · ⚠️ existe a medias · ❌ no existe

---

## 1. La firma del formulario desde el teléfono

### Lo que ve el pasajero

1. Reserva (web, presencial o WhatsApp). El sistema genera un **token único** y
   un link: `terravolcano.com/registro/a7f3k9...`
2. Le llega por correo y por WhatsApp.
3. Lo abre en su celular. **Elige idioma** (es/en).
4. **Verifica identidad**: recibe un código de 6 dígitos al correo o por SMS y
   lo escribe. Este paso es el que ata la firma a una persona real — sin él,
   cualquiera pudo haber llenado el formulario.
5. Llena ficha personal, contacto de emergencia y declaración de salud.
6. **Lee el documento completo en pantalla.** El botón de aceptar se habilita
   solo al llegar al final: así nadie puede alegar que no lo leyó.
7. **Tres casillas separadas, ninguna premarcada**:
   - [ ] Acepto la exención de responsabilidad
   - [ ] Autorizo el uso de mi imagen *(opcional, no condiciona el tour)*
   - [ ] Quiero recibir ofertas *(opcional)*
8. **Firma con el dedo** sobre un canvas.
9. Confirma. Recibe el **PDF por correo al instante**.

### Lo que guarda el sistema — el paquete de prueba

Esto es lo que hace que la firma se sostenga si alguien la discute:

| Campo | Por qué |
|---|---|
| `documento_version` + `documento_hash` (SHA-256 del texto exacto) | Probar **qué** versión firmó. Si mañana cambia el texto, el hash viejo lo demuestra |
| `firma_trazo` (PNG del dibujo) | El gesto de firmar |
| `firmado_en` (timestamp del servidor, UTC) | Cuándo |
| `ip` y `user_agent` | Desde dónde y con qué |
| `metodo_verificacion` + `verificado_en` | Que era él y no cualquiera |
| `acepto_exencion` / `acepto_imagen` / `acepto_marketing`, cada uno con su timestamp | Consentimientos separados y fechados |
| `pdf_hash` | Que la copia enviada es la misma que se firmó |

**Esto es más sólido que el papel.** Un papel firmado no prueba qué versión del
texto leyó la persona ni cuándo lo firmó; este registro sí.

### El marco legal

La **Ley 19.799** reconoce la firma electrónica y distingue:

- **Firma electrónica simple** — válida entre privados. Es la que corresponde
  acá: pedirle a un turista alemán que saque un certificado digital chileno es
  inviable.
- **Firma electrónica avanzada** — más peso probatorio, pero exige certificado
  de un prestador acreditado. No tiene sentido para este caso.

Si quieren más respaldo sin construirlo, un servicio de firma externo
(DocuSign, Dropbox Sign o equivalentes chilenos) entrega un certificado de
auditoría ya armado. Cuesta por firma, pero quita responsabilidad técnica.

> ⚠️ **No soy abogado.** El mecanismo de firma es lo fácil; lo que importa de
> verdad es **el texto de la exención**. Que lo redacte o revise un abogado
> chileno con experiencia en turismo aventura. Una exención mal escrita no
> protege aunque esté perfectamente firmada.

### Detalles que se olvidan

- **Menores de edad**: firma el adulto responsable, y es otro flujo 🔎
- **Sin señal**: si el pasajero llega sin haberlo llenado, el QR del mostrador
  resuelve; pero debe haber respaldo en papel para el caso extremo
- **Idioma**: el documento firmado debe estar en el idioma que el pasajero
  entiende, o pierde fuerza
- **Vigencia**: ¿la exención vale por salida o por temporada? Si alguien hace
  tres tours, ¿firma tres veces? 🔎

---

## 2. Todos los usos del código QR

| Dónde | Para qué |
|---|---|
| **Mostrador del local** | Abre el formulario de registro en el teléfono del pasajero. Cero papel para el que llega sin reserva |
| **Voucher de reserva** | Check-in el día de la salida: el guía escanea y marca presente |
| **Manifiesto del guía** | Pasar lista escaneando, sin buscar nombres |
| **Tarjeta de fin de tour** | Lleva a la galería de fotos del día **y** a dejar la reseña. Se entrega cuando la gente está eufórica recién bajada |
| **Equipamiento** (casco, piolet, botas) | Control de entrega y devolución. Se sabe con quién se fue cada pieza |
| **Certificado de cumbre** | Verifica que es auténtico |
| **Flyers en hostales y hoteles de Pucón** | **Con código de referido por alojamiento.** Permite saber qué hostal les manda clientes y pagarles comisión con datos |
| **Vitrina del local** | Reservar fuera del horario de atención. El local cierra, el QR no |
| **Instagram en bio y stories** | Directo a WhatsApp con mensaje precargado |

---

## 3. El sitio web — qué debería tener

### Contenido
- ❌ **Una página por tour**, en HTML indexable: descripción, itinerario hora a
  hora, qué incluye, qué no incluye, qué llevar, exigencia física, edad mínima
- ❌ **Precios visibles**, en CLP y USD
- ❌ **Nivel de exigencia** por tour: duración, desnivel, condición requerida
- ❌ **Qué pasa si cancela el clima** — política escrita
- ❌ **Preguntas frecuentes**: ¿es difícil? ¿necesito experiencia? ¿qué pasa si
  no llego? ¿hay baños? ¿puedo ir solo?
- ❌ **Blog con contenido que rankea**: "qué llevar para subir el Villarrica",
  "mejor época del año", "¿es difícil subir el Villarrica?". Esas son las
  búsquedas reales
- ❌ **Página del equipo**: Richard y los guías, con cara, nombre y
  acreditación
- ⚠️ **Galería real** de los ascensos
- ❌ **Versión en español** (hoy el sitio es solo inglés)
- ❌ **Villarrica bien escrito** (hoy aparece 12 veces con una sola r)

### Conversión
- ❌ **Botón flotante de WhatsApp** con mensaje precargado, visible siempre
- ⚠️ **Reserva online** que cargue sin depender de un widget de terceros
- ❌ **Calendario de disponibilidad** real
- ❌ **Captura de correo** con gancho: la guía de preparación a cambio del mail
- ❌ **Barra de alerta volcánica Sernageomin** en vivo. Nadie en Pucón la tiene
- ❌ **Gift cards** — regalar un ascenso es un producto en sí mismo
- ❌ **Reserva de grupos y empresas**, formulario aparte

### Confianza
- ⚠️ **"#1 en Tripadvisor en Pucón"** — lo tienen pero merece más protagonismo
- ❌ **Reseñas embebidas** de Google y Tripadvisor, actualizadas solas
- ❌ **Sellos de Sernatur, seguros y acreditación** visibles
- ❌ **Tasa de cumbre publicada.** "El 87% de nuestros grupos llega a la
  cumbre" es el dato más persuasivo que podrían mostrar, y hoy nadie lo publica
- ❌ **Política de cancelación y reembolso** clara

### Técnico
- ❌ **Schema.org** (`TouristTrip`, `LocalBusiness`, `Review`) — hace que
  Google muestre precio y estrellas en los resultados
- ❌ **Open Graph** para que el link se vea bien al compartirlo por WhatsApp
- ❌ **Sitemap y robots.txt** revisados
- ❌ **Google Search Console** y **Analytics**
- ❌ **Pixel de Meta** para remarketing
- ❌ **Certificado y velocidad** auditados
- ⚠️ **Contenido mixto**: carga una fuente por http:// desde https://

---

## 4. Presencia digital fuera del sitio

Hoy tienen Instagram y web. Falta:

### ❌ Google Business Profile — lo más urgente de esta lista
Cuando alguien en Pucón busca "agencia volcán Villarrica" en Google Maps,
**ahí se decide la venta**. Es gratis, y pesa más que Tripadvisor para la
búsqueda local. Necesitan: ficha reclamada, fotos, horario, link directo a
WhatsApp, preguntas respondidas y **pedir reseñas de Google sistemáticamente**.

Si solo se hace una cosa de todo este documento, es esta.

### ❌ WhatsApp Business
Catálogo de tours con precios, respuestas rápidas, mensaje de ausencia,
etiquetas por estado del cliente. Gratis.

### ❌ TikTok
Su producto es espectacular en video y su cliente es joven y extranjero. Un
ascenso al amanecer, el deslizamiento en la nieve, la fumarola. Es el canal
con mejor alcance orgánico que existe hoy y les calza perfecto.

### ❌ YouTube
Videos largos del ascenso completo. Rankean en Google y resuelven la pregunta
"¿cómo es subir el Villarrica?" mejor que cualquier texto.

### ❌ Newsletter
La base de datos sin un canal para hablarle no sirve de nada.

---

## 5. Ideas para potenciar, más allá de lo básico

- **Certificado de cumbre con nombre y fecha**, descargable y bonito. La gente
  lo publica en sus redes. Marketing gratis hecho por el cliente.
- **Galería del día entregada por link** a las 24 horas, junto con el pedido de
  reseña. La euforia dura poco: hay que pedirla el mismo día.
- **Programa de referidos con alojamientos**, con QR por hostal. Permite saber
  quién les manda clientes de verdad y pagar comisión con datos, no con
  intuición.
- **Lista de espera por clima**: si se libera un cupo porque alguien canceló,
  avisar automáticamente al siguiente.
- **Publicar la tasa de cumbre.** Nadie lo hace y responde al miedo real.
- **Paquete de varios tours con descuento**: el que sube el Villarrica el lunes
  puede hacer rafting el miércoles.
- **Precios en CLP y USD**, según de dónde venga el visitante.
- **Contenido en temporada baja**: el sitio no puede morir en invierno — ahí
  está el ski touring, que hoy casi no se promociona.

---

## 6. Prioridad, si hubiera que elegir cinco

1. **Google Business Profile** optimizado y pidiendo reseñas
2. **Precios visibles** en el sitio, en texto indexable
3. **Formulario digital con firma** (reemplaza el papel y habilita la base de datos)
4. **WhatsApp como camino de reserva**, con botón flotante y mensaje precargado
5. **Una página por tour**, en español e inglés, con exigencia y qué incluye

Lo demás viene después. Estos cinco mueven facturación esta temporada.

# Terra Volcano — todo lo que falta, consolidado

Reúne en una sola lista todo lo verificado: las plataformas de reserva, su
sitio `terravolcano.com`, su ficha de Google y la operación. Ordenado por
retorno, no por tema.

Última revisión: 2026-10-26.

---

## Lo que ya está bien — no romper

- **4,8 ★ con 141 opiniones en Google** y **#1 en Tripadvisor en Pucón**. Es su
  mejor activo y está infrautilizado.
- **Posicionamiento premium definido**: *"EXTRAORDINARY EXPEDITIONS.
  EXCLUSIVELY YOURS."* No compiten por precio. Cualquier copy nuevo va en ese
  registro.
- **Ratio 1 guía cada 3 personas**, equipo propio completo, 11 años de Richard
  guiando, acreditación municipal, fundada en 2015, family-run.
- **Catálogo amplio**: ascensos (Villarrica, Lanín 2 días), ski touring
  (Villarrica, Quetrupillán, Lanín, Lonquimay), trekking, rafting, canyoning,
  termas, Andean Lakes.
- **WhatsApp operativo**: +56 9 8338 8317.
- Ficha de Google con fotos, video, horario y dirección correcta.

---

## NIVEL 0 — Gratis, sin código, esta semana

Nada de esto requiere tocar el sitio. Todo se hace desde paneles.

- [ ] **Cargar servicios con precio en Google Business.** Hoy el sitio no
      muestra ningún precio, así que el que quiere saber cuánto cuesta se va a
      Viator — donde la agencia paga 20-30% de comisión. Esto lo ataca hoy
      mismo y gratis.
- [ ] **Corregir los servicios listados en Google.** Dice "Visitas guiadas de
      la ciudad", que no hacen. Debe decir: Ascenso al Villarrica, Ski touring,
      Lanín 2 días, Rafting, Trekking.
- [ ] **Verificar el horario.** El perfil marcaba "Cerrado, abre el martes" un
      lunes. 🔎 ¿Es real o está mal cargado?
- [ ] **Publicaciones semanales en Google** (Google Posts): estado del cerro,
      cupos de la semana, ofertas de temporada baja.
- [ ] **Sembrar preguntas y respuestas en Google**: ¿es difícil?, ¿necesito
      experiencia?, ¿qué pasa si cancela el clima?, ¿hay edad mínima?
- [ ] **Limpiar la ficha de Terra Volcano Hostel**, que ya no opera y sigue
      apareciendo con el mismo teléfono. Confunde y divide reseñas.
- [ ] **WhatsApp Business con catálogo y precios**, respuestas rápidas y
      mensaje de ausencia.
- [ ] **Pedir reseñas de Google sistemáticamente** al terminar cada tour. Las
      141 se defienden con reseñas nuevas, no con las de 2019.

---

## NIVEL 1 — El sitio, una a dos semanas, mueve facturación

- [ ] **Precios visibles**, en CLP y USD, más bajos que la OTA, con el
      argumento de reserva directa explícito.
- [ ] **Una página por tour en HTML indexable.** Hoy los **11 botones del home**
      apuntan a `/tours/`, cuyo `<main>` pesa **1.376 bytes**: el contenido lo
      inyecta un widget de terceros. Para Google esa página está vacía. Por eso
      las OTAs rankean sobre ellos en su propio producto.
- [ ] **🔎 Verificar a mano que `/tours/` carga para un visitante real.** No
      pude comprobarlo porque este entorno bloquea el host del widget. Si no
      carga, es una emergencia comercial: todos los CTA del sitio mueren ahí.
- [ ] **Corregir "Villarrica".** Aparece **12 veces con una sola r** contra 2
      bien escritas, incluida la URL del producto estrella
      (`villarica-volcano-ascent`). Nadie busca "Villarica". Con redirecciones
      301.
- [ ] **Versión en español.** El sitio es solo inglés (`lang="en-US"`), y el
      título de la página About quedó en español: "Sobre Nosotros".
- [ ] **Botón flotante de WhatsApp** con mensaje precargado, visible siempre.
- [ ] **Política de cancelación por clima publicada.** Está en las OTAs (24 h,
      reembolso total 🔎) pero no en su sitio. Para quien viaja desde Europa
      con tres días en Pucón, esa promesa vale tanto como la foto del cráter.
- [ ] **Nivel de exigencia por tour**: duración, desnivel, condición física,
      edad mínima. El bloqueador de conversión no es el precio, es el miedo a
      no poder.
- [ ] **Publicar la tasa de cumbre.** "El 87% de nuestros grupos llega" es el
      dato más persuasivo que podrían mostrar y **nadie en el mercado lo
      publica**. Requiere la base de datos del Nivel 2.
- [ ] **Resolver la contradicción**: el home dice "15 years of expertise", el
      About dice fundada en 2015, las OTAs dicen 11 años. Elegir una cifra.
- [ ] **Formulario de contacto útil**: hoy pide nombre, email y mensaje. Falta
      qué tour, qué fecha, cuántas personas.
- [ ] **Arreglar el contenido mixto**: carga una fuente por `http://` desde una
      página `https://`.
- [ ] **Técnico**: schema.org (`TouristTrip`, `LocalBusiness`, `Review`), Open
      Graph, sitemap, Search Console, Analytics.

---

## NIVEL 2 — El sistema interno, el dolor de hoy

Detalle completo en `requerimientos-sistema.md`.

- [ ] **Formulario digital con firma electrónica.** Hoy cada pasajero llena y
      firma en papel, y no hay forma de saber quién subió un día sin revisar
      carpetas. Se manda al reservar, se llena en el alojamiento, llega
      firmado.
- [ ] **Manifiesto de salida**, exportable a PDF y **disponible offline** — en
      el volcán no hay señal.
- [ ] **Base de datos de clientes** con el campo **canal de origen**: es lo
      único que permite saber cuánta plata se va en comisiones contra cuánto
      entra directo. Hoy ese número no existe.
- [ ] **Registro del resultado del ascenso** (llegó o no a la cumbre). Habilita
      la mejor campaña de retención posible y la tasa de cumbre del Nivel 1.
- [ ] **Control de equipamiento** entregado y devuelto, por pasajero y talla.
- [ ] **Verificación automática de la ratio 1:3.**
- [ ] **Recordatorios automáticos**: T-72h qué llevar, T-24h clima y alerta
      Sernageomin, mañana de la salida punto de encuentro.
- [ ] **Reagendamiento masivo por clima**: un botón que mueva una salida
      completa y notifique a todos.
- [ ] **Campaña post-ascenso**: fotos, pedido de reseña, y la oferta a quien
      **no** llegó a la cumbre.
- [ ] **Consentimientos separados y fechados** (exención, imagen, marketing),
      desde el día uno. Retroactivamente no se puede.
- [ ] **Registro de incidentes.**

---

## NIVEL 3 — Venta directa

- [ ] **Reserva online que funcione** sin depender de un widget ajeno, con
      calendario de disponibilidad real.
- [ ] **Botón "Reservar" en Google Business.** Requiere primero una página de
      reserva con URL por tour: el enlace debe llevar directo a elegir servicio
      y fecha, no a la portada.
- [ ] **Pagos**: Webpay, Flow o Mercado Pago para el canal directo.
- [ ] **⚠️ Sincronización de inventario con las OTAs.** Venden los mismos cupos
      en Viator, GetYourGuide, Expedia y su sitio. Sin sincronizar, van a
      sobrevender. Esto **no se construye desde cero**: Bókun, Rezdy,
      FareHarbor o Checkfront ya lo resuelven.
- [ ] **Precio canónico y más bajo en el sitio propio.** Hoy publican US$190 en
      Tripadvisor, US$208 en Expedia, "desde US$170" en otra, £155 en la UK y
      SGD 241 en Pelago. Un cliente que compara dos pestañas desconfía.

---

## NIVEL 4 — Crecimiento

- [ ] **TikTok.** Su producto es espectacular en video y su cliente es joven y
      extranjero. El canal con mejor alcance orgánico hoy, y no lo usan.
- [ ] **YouTube**: el ascenso completo. Responde "¿cómo es subir el Villarrica?"
      mejor que cualquier texto y rankea en Google.
- [ ] **Blog con las búsquedas reales**: qué llevar, mejor época, ¿es difícil?
- [ ] **Certificado de cumbre** con nombre y fecha, descargable. La gente lo
      publica: marketing gratis hecho por el cliente.
- [ ] **Galería del día entregada a las 24 h**, junto con el pedido de reseña.
- [ ] **Programa de referidos con alojamientos de Pucón**, con QR y código por
      hostal. Permite pagar comisión con datos, no con intuición.
- [ ] **Newsletter.** La base de datos sin un canal para hablarle no sirve.
- [ ] **Gift cards.** Regalar un ascenso es un producto en sí mismo.
- [ ] **Promocionar el ski touring.** Es una línea completa, casi invisible
      hoy, y es justo el producto que llena la temporada baja.
- [ ] **Paquetes multi-tour**: el que sube el lunes puede hacer rafting el
      miércoles.
- [ ] **Barra de alerta volcánica Sernageomin** en vivo. Nadie en Pucón la
      tiene, es útil de verdad y da una razón para volver al sitio.

---

## Si hubiera que elegir cinco

1. **Servicios con precio en Google Business** — gratis, hoy, ataca la fuga a
   las OTAs
2. **Verificar que `/tours/` funciona** — puede estar matando todas las
   conversiones del sitio
3. **Precios y páginas por tour en el sitio**, en texto indexable
4. **Formulario digital con firma** — resuelve el dolor operativo y desbloquea
   la base de datos
5. **"Villarrica" bien escrito** — una tarde de trabajo, el término de búsqueda
   más valioso que tienen

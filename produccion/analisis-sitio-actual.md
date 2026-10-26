# El sitio actual de Terra Volcano — análisis

Revisado el 2026-10-26 sobre `terravolcano.com`, leyendo el HTML y además
renderizando con navegador. WordPress, inglés únicamente, cuatro páginas:
Home, Tours, About Us, Contact Us.

## Lo que ya está bien y hay que respetar

**El posicionamiento está definido y es premium.** El titular del home es
*"EXTRAORDINARY EXPEDITIONS. EXCLUSIVELY YOURS."* No compiten por precio,
compiten por exclusividad. Eso justifica cobrar US$190 donde otro cobra US$115,
y **nuestro copy tiene que estar en ese registro**, no en tono campechano.

Activos reales que hay que usar:

- **WhatsApp confirmado: +56 9 8338 8317** — ahora sí es oficial, sale de su
  propio sitio, no de una reseña.
- **Dirección**: Av. Bernardo O'Higgins 717, Local 4, Boulevard Patagonia, Pucón.
- **Instagram** `@terravolcano_pucon` · **Facebook** `/puconterravolcano/`
- **"#1 rated on Tripadvisor in Pucón"** — es la mejor credencial que tienen y
  va arriba, grande.
- **Fundada en 2015 por Richard Díaz, escalador chileno. Family-owned y
  family-run.** La historia está escrita y es buena: reservar con ellos sostiene
  familias locales.
- Sostenibilidad: restauración de bosque nativo, reconocimientos de turismo
  sostenible.
- Tres testimonios reales de Tripadvisor, con nombre.

## Correcciones a mi análisis anterior

Me equivoqué en el catálogo. Lo real, según su propio sitio:

| Línea | Qué incluye |
|---|---|
| **Volcano Ascents** | Villarrica, Lanín (2 días, 3.776 m) |
| **Ski Touring** | Villarrica, Quetrupillán, Lanín, **Lonquimay (2.865 m)** |
| **Treks & Adventures** | Trekking, rafting, canyoning, termas, Andean Lakes |

- **El ski touring es una línea principal y yo no la tenía.** Es además el
  producto más vendible en video: bajar esquiando un volcán activo es
  movimiento puro.
- **Lonquimay** no estaba en mi lista.
- **Sollipulli y Mocho-Choshuenco no aparecen en su sitio.** Hay que sacarlos de
  nuestra tabla de exigencia.
- **Andean Lakes** (Quillelhue, Escondida, Huinfiuca, bajo el Lanín) es una
  expedición firma que yo desconocía.

## Los problemas, por gravedad

### 🔴 1. Los 11 botones del home van a la misma página, y esa página no tiene contenido en el HTML

Todos los CTA —cuatro "Book Now" del carrusel, "RESERVE YOUR EXPERIENCE",
"BEGIN YOUR ASCENT", "EXPLORE THE EXPERIENCE", "BEGIN YOUR EXPEDITION",
"SEE MORE TOURS", "DISCOVER ALL EXPERIENCES"— apuntan a `/tours/`.

El `<main>` de `/tours/` pesa **1.376 bytes**: solo el título "Tours". El
contenido lo inyecta un widget de terceros desde `tourtask-booking.pages.dev`,
con rutas por hash (`/tours/#/info/1660/villarica-volcano-ascent`).

**No pude verificar si el widget funciona para un visitante real**, porque este
entorno tiene bloqueado el host del widget. Lo que sí es seguro:

**Para Google esa página está vacía.** Cero contenido indexable de tours, cero
precios, cero descripciones. Toda la autoridad SEO del producto estrella —
"ascenso volcán Villarrica Pucón"— es inalcanzable. Por eso las OTAs rankean
por encima de ellos en su propio producto.

👉 **Verificar a mano que `/tours/` carga tours y precios en un navegador
normal.** Si no carga, es una emergencia comercial.

### 🔴 2. No hay un solo precio en todo el sitio

Ni uno. El home dice "Book Now" cinco veces y nunca dice cuánto cuesta.
Mientras tanto Tripadvisor publica US$190 y Expedia US$208.

El visitante que quiere saber el precio **se va a la OTA**, y ahí Terra Volcano
paga entre 20% y 30% de comisión. El sitio propio está alimentando a sus
propios intermediarios. Son ~US$45 por persona.

### 🔴 3. "Villarica" con una sola r, 12 veces

Contra 2 veces escrito bien. Y está **en la URL del producto estrella**:
`/tours/#/info/1660/villarica-volcano-ascent`.

Nadie busca "Villarica". Es el término de búsqueda más valioso que tienen y lo
están escribiendo mal en su propia ficha.

### 🟡 4. Solo inglés, y mal cerrado

`<html lang="en-US">` en todas las páginas. Pero el título de la página About
quedó en español: **"Sobre Nosotros"**. O sea ni es bilingüe ni es
consistentemente inglés.

### 🟡 5. Se contradicen en su propia experiencia

El home dice *"With 15 years of expertise"*. El About dice fundada **en 2015**
(≈11 años). Las OTAs dicen *"11 years of guiding experience"*. Hay que elegir
una cifra y repetirla en todas partes.

### 🟡 6. El formulario de contacto no sirve para vender tours

Pide nombre, email y mensaje. Para turismo de aventura falta lo esencial: qué
tour, qué fecha, cuántas personas, nivel de experiencia. Y exige JavaScript
para funcionar.

### 🟡 7. Contenido mixto

La página carga una fuente por `http://` desde una página `https://`. El
navegador la bloquea. Viene del widget de reservas.

### 🟡 8. Lo que ya habíamos detectado sigue faltando

- Nada sobre exigencia física. El miedo a no poder sigue sin respuesta.
- Nada sobre política de cancelación por clima, aunque las OTAs dicen 24 h con
  reembolso total.
- La ratio de 1 guía cada 3 personas no aparece por ninguna parte.

## Qué significa para nuestro sitio

El trabajo deja de ser "hacer algo más bonito" y pasa a ser **hacer lo que el
sitio actual no hace**:

1. **Precios visibles**, en texto indexable, más bajos que la OTA y con el
   argumento de la reserva directa.
2. **Un camino a la reserva que funcione sin JavaScript de terceros**: WhatsApp
   directo con mensaje precargado.
3. **Contenido de los tours en el HTML**, no inyectado por un widget. Eso es lo
   que rankea.
4. **"Villarrica" bien escrito**, en todas partes.
5. **Bilingüe de verdad**, ES/EN.
6. Mantener su tono premium y su mejor credencial: #1 en Tripadvisor en Pucón.

Y una idea nueva que sale de acá: **el ski touring merece su propia escena en
el vuelo.** Bajar esquiando un volcán activo es el plano con más movimiento de
todo su catálogo, y es justo lo que el scroll-scrub hace mejor.

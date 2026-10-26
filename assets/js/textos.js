/* Copy estático bilingüe de las secciones de conversión.
   Las escenas del vuelo viven en contenido.js (generado desde escenas.py).

   TODO ANTES DE PUBLICAR: cada dato marcado [POR CONFIRMAR] sale de OTAs o de
   reseñas de clientes, no de Terra Volcano. Validar con Richard y borrar las
   marcas. Ver produccion/analisis-competitivo.md. */

window.TV_TEXTOS = {
  es: {
    "aviso.html": "<b>Prototipo.</b> Las fotos son referencias <b>pendientes de licencia</b> y los precios están por confirmar con Terra Volcano. No publicar así.",

    "exigencia.cejilla": "Antes de reservar",
    "exigencia.titulo": "¿Puedo hacerlo?",
    "exigencia.subtabla": "El catálogo completo. El vuelo de arriba es el Villarrica, que es el que casi todos vienen a subir.",
    "exigencia.sub": "La pregunta real no es cuánto cuesta, es si vas a poder. Acá está la exigencia sin adornos. Si no te calza, mejor saberlo ahora: subimos con un guía cada tres personas y preferimos que llegues arriba.",
    "exigencia.th1": "Expedición", "exigencia.th2": "Duración",
    "exigencia.th3": "Desnivel", "exigencia.th4": "Exigencia",

    "guia.cejilla": "Quién te sube",
    "guia.titulo": "Richard Díaz",
    "guia.foto": "Falta la foto de Richard guiando — pedirla en alta resolución",
    "guia.p1": "Once años guiando en estos cerros. Dueño y guía principal de Terra Volcano, acreditado por la Municipalidad de Pucón.",
    "guia.p2": "Lo que más repiten quienes suben con él no es el paisaje: es el ritmo. Que nadie se queda atrás, que el grupo llega completo, y que cuando alguien flaquea en el tramo final hay una mano.",
    "guia.credenciales": [
      "Un guía cada tres personas. No es marketing: es la razón por la que la gente llega arriba.",
      "Equipo propio completo: botas, ropa de montaña, casco, crampones, piolet y máscara de gas.",
      "Acreditación de la Municipalidad de Pucón. [POR CONFIRMAR: registro Sernatur y seguros]",
      "Cinco volcanes en el catálogo, no uno. Si el Villarrica cierra por alerta, hay dónde ir."
    ],

    "reserva.cejilla": "Reserva directa",
    "reserva.titulo": "Reserva con Richard, no con un intermediario.",
    "reserva.sub": "Las plataformas de reserva cobran entre 20% y 30% de comisión. Reservando acá, esa plata se queda en Pucón y el precio te baja.",
    "reserva.monto": "US$190",
    "reserva.por": "por persona · ascenso al Villarrica · [POR CONFIRMAR]",
    "reserva.ahorro": "≈ US$45 menos que por una plataforma de reserva. [POR CONFIRMAR]",
    "reserva.btn1": "Reservar por WhatsApp",
    "reserva.btn2": "Volver a ver los volcanes",
    "reserva.promesa": "Si el clima obliga a cancelar, te reagendamos al día siguiente o te devolvemos. No perdiste el viaje. [POR CONFIRMAR la política textual]",

    "pie.legal": "Turismo Aventura Richard Díaz Suazo EIRL · Av. Bernardo O'Higgins, Pucón, Región de La Araucanía, Chile",
    "pie.nota": "Las condiciones de ascenso dependen del nivel de alerta volcánica del Sernageomin."
  },

  en: {
    "aviso.html": "<b>Prototype.</b> The photos are references <b>pending licensing</b> and prices are unconfirmed. Not for publication as is.",

    "exigencia.cejilla": "Before you book",
    "exigencia.titulo": "Can I actually do this?",
    "exigencia.subtabla": "The full catalogue. The flight above is Villarrica, which is what almost everyone comes to climb.",
    "exigencia.sub": "The real question isn't the price, it's whether you'll make it. Here's what each climb demands, with nothing dressed up. If it doesn't fit you, better to know now: we climb one guide per three people, and we'd rather you reach the top.",
    "exigencia.th1": "Expedition", "exigencia.th2": "Duration",
    "exigencia.th3": "Ascent", "exigencia.th4": "Difficulty",

    "guia.cejilla": "Who takes you up",
    "guia.titulo": "Richard Díaz",
    "guia.foto": "Missing: a photo of Richard guiding — request in high resolution",
    "guia.p1": "Eleven years guiding these mountains. Owner and lead guide of Terra Volcano, accredited by the Municipality of Pucón.",
    "guia.p2": "What climbers repeat isn't the view, it's the pace. Nobody gets left behind, the group arrives whole, and when someone falters on the last stretch there's a hand.",
    "guia.credenciales": [
      "One guide per three climbers. Not marketing — it's why people reach the summit.",
      "All gear provided: boots, mountain clothing, helmet, crampons, ice axe and gas mask.",
      "Accredited by the Municipality of Pucón. [TO CONFIRM: Sernatur registry and insurance]",
      "Five volcanoes in the catalogue, not one. If Villarrica closes on alert, there's somewhere to go."
    ],

    "reserva.cejilla": "Book direct",
    "reserva.titulo": "Book with Richard, not with a middleman.",
    "reserva.sub": "Booking platforms take 20% to 30% in commission. Book here and that money stays in Pucón — and your price drops.",
    "reserva.monto": "US$190",
    "reserva.por": "per person · Villarrica ascent · [TO CONFIRM]",
    "reserva.ahorro": "≈ US$45 less than through a booking platform. [TO CONFIRM]",
    "reserva.btn1": "Book on WhatsApp",
    "reserva.btn2": "Back to the volcanoes",
    "reserva.promesa": "If the weather forces a cancellation, we rebook you for the next day or refund you. You didn't lose the trip. [TO CONFIRM the exact policy]",

    "pie.legal": "Turismo Aventura Richard Díaz Suazo EIRL · Av. Bernardo O'Higgins, Pucón, Araucanía Region, Chile",
    "pie.nota": "Climbing conditions depend on the Sernageomin volcanic alert level."
  }
};

/* Tabla de exigencia: acá vive el catálogo completo. El vuelo de arriba es
   solo el Villarrica, que es lo que vende; los otros cuatro volcanes se listan
   aquí en texto, que cuesta $0 y se actualiza sin re-renderizar nada.
   Cifras [POR CONFIRMAR] con Richard. */
window.TV_EXIGENCIA = [
  { nombre:"Villarrica",       dur:{es:"6 a 8 h",      en:"6 to 8 h"},     desnivel:"~1.400 m", nivel:3,
    label:{es:"Exigente",   en:"Demanding"} },
  { nombre:"Quetrupillán",     dur:{es:"Día completo", en:"Full day"},     desnivel:"~1.100 m", nivel:2,
    label:{es:"Moderada",   en:"Moderate"} },
  { nombre:"Lanín",            dur:{es:"2 a 3 días",   en:"2 to 3 days"},  desnivel:"~2.000 m", nivel:3,
    label:{es:"Expedición", en:"Expedition"} },
  { nombre:"Sollipulli",       dur:{es:"Día completo", en:"Full day"},     desnivel:"~900 m",   nivel:2,
    label:{es:"Moderada",   en:"Moderate"} },
  { nombre:"Mocho-Choshuenco", dur:{es:"Día completo", en:"Full day"},     desnivel:"~1.200 m", nivel:2,
    label:{es:"Moderada",   en:"Moderate"} }
];

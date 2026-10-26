/* Texto de la declaración de riesgo, versionado.
   Se guarda el hash del texto exacto que el pasajero aceptó: si mañana cambia
   la redacción, el hash viejo prueba cuál versión firmó él.

   OJO: este texto es el del formulario del Decreto 19/2018 y NO reemplaza una
   revisión legal. Que lo valide un abogado antes de usarlo en producción. */
'use strict';
const crypto = require('node:crypto');

const VERSION = '2026-10-v1';

const TEXTO = {
  es: `Declaro conocer y comprender los riesgos que implica la participación en estas actividades, los cuales no pueden ser completamente eliminados aun cuando se cumplan las normas de seguridad acreditadas por el prestador, que tienen por objeto reducir los riesgos que el desarrollo de estas actividades involucra.

Es deber del prestador de servicios de turismo aventura informar las condiciones y requisitos del servicio, así como es deber del participante tomar el servicio de turismo aventura adecuadamente informado de las condiciones, de las condiciones mínimas que debe tener previo a la actividad, y cumplir con las instrucciones del guía y de la empresa a cargo de la actividad indicada.

Declaro que la información entregada en este formulario es veraz y completa, en especial la referida a mi estado de salud, y entiendo que omitirla o falsearla puede poner en riesgo mi seguridad y la del grupo.`,

  en: `I declare to know and understand the risks involved in participation in these activities, which cannot be completely eliminated, even if there is compliance with the safety standards accredited by the provider, which aim to reduce the risks the development of these activities involves.

It is the duty of the provider of adventure tourism to report the conditions and requirements of the service, as it is also the duty of participants to take the adventure service adequately informed of the conditions, of the minimum conditions that the participant must have prior to the activity, and to comply with the instructions of the guide and the company in charge of the activity indicated.

I declare that the information given in this form is truthful and complete, especially that concerning my state of health, and I understand that omitting or falsifying it may endanger my safety and that of the group.`,
};

const hash = (idioma) =>
  crypto.createHash('sha256').update(`${VERSION}\n${TEXTO[idioma]}`, 'utf8').digest('hex');

module.exports = { VERSION, TEXTO, hash };

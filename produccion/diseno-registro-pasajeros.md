# Diseño: registro de pasajeros y módulo de administración

Basado en el formulario legal real: **"Form of Registration and Acceptance of
Risk — Adventure Tourism Services"**, exigido por el **Decreto N°19/2018** del
Ministerio de Economía, Fomento y Turismo 🔎 (confirmar que sigue vigente y si
hay versión posterior).

El decreto exige que el formulario esté disponible **al menos en español e
inglés**. El bilingüe no es una mejora del producto: es obligación.

---

## 1. Lo que exige el formulario, campo por campo

### Datos personales
Nombre · Nacionalidad · Número de pasaporte · Edad · **Peso**

> El peso no estaba en mi diseño anterior y sí importa: condiciona arnés,
> crampones y decisiones del guía.

### Datos de la actividad
Actividad · Fecha · Nombre del guía · N° de identificación del guía ·
Hora de inicio · Hora de término · Lugar de salida · Lugar de llegada ·
Itinerario y recorrido

### Contacto de emergencia
**Dos contactos**, cada uno con nombre, teléfono y correo.

### Declaración — ocho ítems, SÍ/NO + especificar
Experiencia en la misma actividad · ¿Tiene seguro? · Alergias ·
Medicamentos contraindicados · Dietas especiales · Cirugías recientes ·
Embarazo · Otros

### Menores de edad
Los datos los completa el tutor que lo acompaña.

### Declaración de riesgo y firma
Texto de aceptación de riesgo, más **firma del participante o tutor, nombre y
número de identificación**.

---

## 2. La decisión de diseño que importa

El formulario en papel **repite los datos de la actividad en cada hoja**:
guía, fecha, horas, lugares, itinerario. Para doce pasajeros, se escribe doce
veces lo mismo.

En la base de datos **eso vive una sola vez, en la salida.** El PDF legal de
cada pasajero se arma fusionando los datos de la salida con los suyos.

Por eso digitalizar esto no es "escanear el formulario": es reestructurarlo.
El resultado es que el guía llena los datos de la actividad una vez y los doce
PDF salen correctos y consistentes.

---

## 3. Modelo de datos

```sql
guia(id, nombre, documento_id, telefono, acreditacion, activo)

actividad(id, nombre_es, nombre_en, lugar_salida, lugar_llegada,
          itinerario_es, itinerario_en, duracion_estimada,
          desnivel, dificultad, edad_minima, precio_base, activa)

salida(id, actividad_id, fecha,
       hora_inicio_prevista, hora_fin_prevista,
       hora_inicio_real,     hora_fin_real,
       cupo_max, estado,            -- programada|confirmada|cancelada_clima|realizada
       nota_clima, alerta_sernageomin)

salida_guia(salida_id, guia_id, rol)        -- varios guías: habilita la ratio 1:3

cliente(id, nombre, email, telefono, nacionalidad,
        documento_tipo, documento_numero, fecha_nacimiento,
        idioma, consentimiento_marketing, consentimiento_marketing_en)

reserva(id, salida_id, cliente_id,
        canal,                       -- web|presencial|whatsapp|viator|getyourguide|...
        precio_pagado, moneda, abono, estado,
        token_registro, token_expira, creada_en)

-- El formulario legal. Guarda SNAPSHOT: la edad y el peso de ese día, no los
-- actuales. El documento debe reflejar lo declarado en su momento.
registro(id, reserva_id, edad, peso_kg,
         es_menor, tutor_nombre, tutor_documento,
         exp_actividad, exp_detalle,
         tiene_seguro, seguro_detalle,
         alergias, alergias_detalle,
         medicamentos, medicamentos_detalle,
         dieta, dieta_detalle,
         cirugias, cirugias_detalle,
         embarazo, embarazo_detalle,
         otros, otros_detalle,
         completado_en)

contacto_emergencia(id, registro_id, orden, nombre, telefono, email)

-- El paquete de prueba de la firma
firma(id, registro_id,
      documento_version, documento_hash,      -- SHA-256 del texto firmado
      trazo_png, firmado_en, ip, user_agent,
      metodo_verificacion, verificado_en,
      acepto_riesgo, acepto_imagen, acepto_marketing,
      pdf_url, pdf_hash)

ascenso(reserva_id, llego_cumbre, altitud_alcanzada, hora_cumbre, nota)
equipo_entregado(id, reserva_id, item, talla, entregado_en, devuelto_en)
incidente(id, salida_id, reserva_id, tipo, descripcion, ocurrido_en)
comunicacion(id, cliente_id, tipo, canal, enviado_en, estado)
```

**Nota sobre datos sensibles:** `embarazo`, `alergias`, `medicamentos` y
`cirugias` son datos de salud. Bajo la Ley 19.628 y la Ley 21.719 tienen
protección reforzada. Hay que definir **cuánto tiempo se conservan** y
restringir quién los ve: el guía de esa salida, no todo el personal.

---

## 4. El flujo completo

### Paso 1 — El admin crea la salida
Actividad, fecha, hora prevista, guías asignados, cupo. El sistema avisa si la
asignación rompe la **ratio de 1 guía cada 3 personas**.

Al crearla genera dos cosas: un **enlace de registro** y un **QR** para esa
salida.

### Paso 2 — Entra una reserva
Por web, presencial, WhatsApp o una OTA. Se crea la reserva con el mínimo
—nombre, correo, teléfono— y **el canal de origen**, que es obligatorio.

El sistema envía por correo y WhatsApp un **enlace único con token**:
`terravolcano.com/registro/a7f3k9`

### Paso 3 — El pasajero llena el formulario
Desde su teléfono, en su alojamiento, con calma:

1. Elige idioma (ES/EN, obligatorio por decreto)
2. **Verifica identidad** con un código de 6 dígitos al correo o SMS
3. Ve precargados los datos de la actividad: guía, fecha, horas, itinerario
4. Completa datos personales, incluido el **peso**
5. Agrega **dos contactos de emergencia**
6. Responde los **ocho ítems** de la declaración
7. Si es menor, el tutor completa sus datos y firma él
8. **Lee la declaración de riesgo completa** — el botón se habilita solo al
   llegar al final
9. Marca **tres casillas separadas**: riesgo, uso de imagen, marketing
10. **Firma con el dedo**
11. Recibe el **PDF idéntico al formulario legal** por correo

Guardado parcial: puede dejarlo a medias y volver con el mismo enlace.

### Paso 4 — Quien llega sin reserva
**QR en el mostrador.** Abre el mismo formulario en su propio teléfono, ligado
a la salida del día. Cero papel igual.

### Paso 5 — El día de la salida
El guía abre el manifiesto, hace check-in escaneando el QR del voucher, y al
volver registra hora real de término, quién llegó a la cumbre y cualquier
incidente.

---

## 5. El módulo de administración

### Pantalla 1 — Calendario de salidas
Vista mensual y de lista. Cada salida muestra: actividad, hora, guía,
**ocupación (8/12)** y un semáforo de registros pendientes.

Filtros por actividad, guía y estado.

### Pantalla 2 — Detalle de la salida = el manifiesto
La pantalla más usada del sistema.

**Cabecera:** actividad, fecha, horas, lugares, itinerario, guías asignados,
alerta Sernageomin del día, clima.

**Lista de pasajeros**, cada fila con:

| Pasajero | Nac. | Edad | Contacto emerg. | Registro | Firma | Check-in |
|---|---|---|---|---|---|---|
| Anna Schmidt | 🇩🇪 | 34 | +49... | ✅ | ✅ | ✅ |
| John Carter | 🇺🇸 | 51 | +1... | ✅ | ⏳ | — |
| Marco Rossi | 🇮🇹 | 28 | — | ❌ | ❌ | — |

**Avisos destacados arriba, no escondidos en la ficha:**
- ⚠️ 2 pasajeros sin firmar — *botón: enviar recordatorio*
- 🩺 1 pasajero con asma · 1 con alergia a frutos secos
- 👥 Ratio actual 1:4 — falta un guía

**Acciones:**
- Exportar manifiesto en PDF
- **Descargar paquete offline** — en el volcán no hay señal
- Reagendar la salida completa por clima y notificar a todos
- Agregar pasajero manualmente (walk-in)
- Cerrar la salida: hora real, cumbre sí/no por pasajero, incidentes

### Pantalla 3 — Ficha del pasajero
Sus datos, su declaración, su PDF firmado descargable, su historial de tours,
y sus consentimientos con fecha.

### Pantalla 4 — Buscador de clientes
Por nombre, correo, pasaporte o nacionalidad. Responde la pregunta que hoy
obliga a revisar carpetas: *"¿quién subió el 14 de marzo?"*

### Pantalla 5 — Panel
Ocupación por fecha · **ingresos por canal y comisión pagada a OTAs** ·
tasa de cumbre · tasa de no-show · clientes que repiten.

---

## 6. Reglas que el sistema debe hacer cumplir

- No se puede hacer check-in a un pasajero **sin firma**
- No se puede cerrar una salida con pasajeros sin registro completo
- Avisa si la ratio guía/pasajeros supera 1:3
- Avisa si un pasajero no alcanza la **edad mínima** de la actividad
- Un menor **exige** datos y firma del tutor
- Los recordatorios de firma salen solos a las 48 h y 24 h de la salida
- El token de registro **expira** después de la salida

---

## 7. Stack sugerido

- **Postgres** en Supabase o Neon — plan gratuito sobra para este volumen
- **Nuxt** para el panel y el formulario público, por tu experiencia en Vue
- **PWA** para que el guía cargue el manifiesto y funcione sin señal
- `signature_pad` para el trazo de la firma
- Generación del PDF en el servidor, con el formato idéntico al legal
- **Brevo** o **Resend** para los correos
- Respaldos automáticos y probados

---

## 8. Por confirmar antes de construir

- [ ] 🔎 ¿El Decreto 19/2018 sigue vigente? ¿Hay versión posterior?
- [ ] 🔎 ¿Sernatur o la municipalidad exigen conservar el formulario firmado
      por un plazo determinado?
- [ ] 🔎 ¿Aceptan menores? ¿Desde qué edad por actividad?
- [ ] 🔎 ¿La exención vale por salida o por temporada? Si alguien hace tres
      tours, ¿firma tres veces?
- [ ] 🔎 ¿Cuántos pasajeros al año? Define el tamaño real del sistema
- [ ] ¿Cuántos guías y qué tan cómodos con tecnología?
- [ ] Que un abogado revise el texto de la declaración de riesgo

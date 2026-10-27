# Terra Volcano — plan de trabajo

**Este es el único documento que hay que leer para saber dónde estamos.**
Todo lo demás es detalle y está enlazado desde acá.

Acá va **el orden del trabajo**. Los **hechos vigentes** (datos de la agencia,
qué está construido, qué está bloqueado) viven en
[`claude/ESTADO-ACTUAL.md`](claude/ESTADO-ACTUAL.md), y el historial de cómo se
llegó a cada cosa en [`claude/BITACORA-IAS.md`](claude/BITACORA-IAS.md). No se
repiten entre sí: un dato, un solo lugar.

Actualizado: 2026-10-26

---

## En una frase

Construir el canal propio de Terra Volcano: un sistema que reemplace el papel
y un sitio que venda directo, para dejar de pagar 20-30% de comisión a las
plataformas de reserva.

---

## Decisiones ya tomadas — no volver a discutirlas

| Decisión | Resuelto |
|---|---|
| Repositorio | `maldoxs/terra-volcano`, público |
| Idiomas | **Español e inglés. Nada más.** Es el mínimo que exige el Decreto 19/2018 |
| Guion de la landing | El ascenso al Villarrica en 4 escenas, no el catálogo de 5 volcanes |
| Técnica de la landing | Fotografía real con movimiento de cámara. **Cero generación con AI** |
| Base de datos | PostgreSQL. SQLite solo para el prototipo |
| Reservas con sincronización a OTAs | **No se construye.** Se compra (Bókun, Rezdy, FareHarbor) |
| WordPress actual | **No se migra.** Se arregla. Migrar no resuelve ninguno de sus cuatro problemas |

---

## Lo que NO vamos a hacer ahora

Esto es tan importante como la lista de tareas. Aparcado a propósito:

- ❌ **Caburgua Home** — buena oportunidad, otro proyecto. Se retoma cuando
  Terra Volcano esté andando
- ❌ **Portugués, francés, alemán**
- ❌ **Video generado con AI** para la landing
- ❌ **Motor de reservas propio**
- ❌ **TikTok, YouTube, blog** — fase 5
- ❌ **Migrar a Astro, Nuxt o Vue** el sitio actual

---

## ¿Está claro el modelo de datos?

Sí. **Doce tablas**, y el esquema de producción ya está escrito y probado en
[`sistema/schema.sql`](sistema/schema.sql).

```
        actividad ──┐
                    ├──> salida ──> salida_guia ──> guia
        cliente ────┴──> reserva ──┬──> registro ──┬──> contacto_emergencia
                                   │               └──> firma
                                   ├──> ascenso
                                   └──> equipo_entregado
                      incidente, comunicacion
```

| Tabla | Para qué |
|---|---|
| `guia` | Nombre y **documento de identidad**, que el formulario legal exige |
| `actividad` | El tour: lugares, itinerario, desnivel, edad mínima. Bilingüe |
| `salida` | Una fecha concreta de una actividad, con cupo y estado |
| `salida_guia` | Varios guías por salida → permite verificar la **ratio 1:3** |
| `cliente` | La persona. Su idioma y su consentimiento de marketing con fecha |
| `reserva` | Une cliente y salida. Lleva el **canal de origen**, el campo más valioso del sistema |
| `registro` | El formulario legal. Guarda **snapshot** de edad y peso: lo declarado ese día |
| `contacto_emergencia` | Los **dos** contactos que pide el decreto |
| `firma` | El paquete de prueba: hash del texto, momento, IP, verificación, tres consentimientos |
| `ascenso` | Llegó o no a la cumbre → habilita la campaña de retención y la tasa de cumbre |
| `equipo_entregado` | Qué se le dio y si lo devolvió |
| `incidente`, `comunicacion` | Registro de seguridad y de mensajes enviados |

**Las dos decisiones de modelado que importan:**

1. **Los datos de la actividad viven en `salida`, no repetidos en cada
   formulario.** El papel los escribe doce veces; acá se cargan una vez y el
   PDF de cada pasajero se arma fusionando.
2. **`reserva.canal` es obligatorio.** Sin ese campo no se puede saber cuánta
   plata se va en comisiones. Hoy ese número no existe en la agencia.

---

## La pauta, por fases

### Fase 0 — Gratis, sin código, no depende de nosotros
*Lo hace Richard o quien administre la ficha. Se puede hacer esta semana.*

- [ ] Cargar servicios **con precio** en Google Business
- [ ] Corregir los servicios listados (dice "visitas guiadas de la ciudad")
- [ ] Verificar el horario (marcaba cerrado un lunes)
- [ ] Limpiar la ficha del hostal que ya no opera
- [ ] Pedir reseñas de Google al terminar cada tour

→ Detalle en [`produccion/brechas-terra-volcano.md`](produccion/brechas-terra-volcano.md)

### Fase 1 — Registro de pasajeros ← **ESTAMOS ACÁ**
*Reemplaza el papel. No toca reservas, así que no hay riesgo de sobreventa.*

- [x] Modelo de datos y esquema PostgreSQL
- [x] Formulario del pasajero, bilingüe, con firma electrónica
- [x] Manifiesto por fecha con alertas médicas y verificación de ratio
- [x] Formulario legal imprimible con el rastro de auditoría
- [ ] 🔴 **Texto oficial de la declaración del decreto** ← bloquea producción
- [ ] 🔴 **Autenticación y roles** — hoy `/admin` está abierto con datos de salud
- [ ] Código de verificación por correo
- [ ] Envío del PDF al pasajero
- [ ] Migrar de SQLite a PostgreSQL
- [ ] Respaldos

→ Prototipo en [`sistema/`](sistema/) · corre con `node sistema/server.js`

### Fase 2 — El sitio público
- [ ] Verificar si `/tours/` carga para un visitante real
- [ ] Precios visibles, en texto indexable
- [ ] Una página por tour, ES/EN
- [ ] Corregir "Villarrica" (12 veces mal escrito) con redirecciones 301
- [ ] Botón flotante de WhatsApp
- [ ] Política de cancelación por clima
- [ ] Nivel de exigencia por tour
- [ ] Decidir dónde vive la landing del volcán: home, landing de campaña o nada

### Fase 3 — Comunicación automatizada
- [ ] Confirmación de reserva
- [ ] Recordatorios T-72h y T-24h
- [ ] Pedido de reseña a las 24h
- [ ] Campaña a quienes **no** llegaron a la cumbre
- [ ] Certificado de ascensión con QR verificable

### Fase 4 — Venta directa
- [ ] Calendario de disponibilidad
- [ ] Abono online
- [ ] Sistema de reservas con sincronización a OTAs (comprado)
- [ ] Botón "Reservar" en Google Business

### Fase 5 — Crecimiento
TikTok, YouTube, blog, referidos con QR por alojamiento, gift cards,
promoción del ski touring para temporada baja.

---

## Lo que está bloqueado y por qué

| Bloqueo | Quién lo resuelve |
|---|---|
| Texto oficial de la declaración del decreto | Richard o un abogado |
| ¿El Decreto 19/2018 sigue vigente? | Verificar con Sernatur |
| ¿La exención vale por salida o por temporada? | Richard |
| Licencias de las fotos de la landing | Richard, o contratar drone |
| ¿Cuántos pasajeros al año? | Richard. Define el tamaño real del sistema |
| Precio canónico a publicar | Richard |

---

## Índice de documentos

**Entender el negocio**
- [`produccion/analisis-competitivo.md`](produccion/analisis-competitivo.md) — las plataformas de reserva y qué dicen las reseñas
- [`produccion/analisis-sitio-actual.md`](produccion/analisis-sitio-actual.md) — su sitio actual, hallazgos
- [`produccion/brechas-terra-volcano.md`](produccion/brechas-terra-volcano.md) — todo lo que falta, por nivel

**El sistema**
- [`produccion/requerimientos-sistema.md`](produccion/requerimientos-sistema.md) — requerimientos completos
- [`produccion/diseno-registro-pasajeros.md`](produccion/diseno-registro-pasajeros.md) — diseño sobre el formulario legal
- [`sistema/README.md`](sistema/README.md) — cómo correr el prototipo

**El sitio**
- [`produccion/checklist-digital.md`](produccion/checklist-digital.md) — firma, QR, canales
- [`produccion/ideas-funcionalidades.md`](produccion/ideas-funcionalidades.md) — catálogo de ideas
- [`produccion/brand-kit.md`](produccion/brand-kit.md) · [`produccion/guion.md`](produccion/guion.md) — la landing
- [`LICENCIAS-PENDIENTES.md`](LICENCIAS-PENDIENTES.md) — ⚠️ las fotos no son de la agencia

---

## Lo próximo, concretamente

**Autenticación del panel.** No es una funcionalidad pendiente: es un riesgo
abierto hoy. `/admin` muestra alergias, medicamentos y embarazos sin pedir
contraseña.

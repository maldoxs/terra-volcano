# Prototipo — registro de pasajeros y manifiesto

Implementa el formulario legal del **Decreto N°19/2018** (Registro y Aceptación
de Riesgo, Turismo Aventura) y el módulo de administración con el manifiesto
por fecha.

**Corre sin instalar nada.** Node 22 trae SQLite incorporado; no hay un solo
`npm install`.

```bash
node sistema/server.js
```

Imprime en consola los enlaces de registro pendientes, que son los que se le
enviarían a cada pasajero al reservar.

- **Admin / manifiesto** → http://localhost:3000/admin
- **Formulario del pasajero** → `/registro/<token>`
- **Formulario legal imprimible** → `/imprimir/registro/<token>`
- **Manifiesto imprimible** → `/imprimir/salida/<id>`

Borra `sistema/terravolcano.db` para volver a los datos de ejemplo.

## Qué hay

```
schema.sql     el esquema de PRODUCCIÓN (PostgreSQL) — el artefacto que importa
db.js          el mismo esquema en SQLite + datos de ejemplo
documento.js   texto versionado de la declaración de riesgo y su hash
server.js      rutas, validaciones y las vistas imprimibles
public/        admin.html (manifiesto) · registro.html (formulario del pasajero)
```

## Decisiones de diseño

**Los datos de la actividad viven en la salida, no en cada formulario.** El
papel repite guía, fecha, horas, lugares e itinerario en cada hoja. Acá se
cargan una vez y el PDF de cada pasajero se arma fusionando. Doce pasajeros,
doce PDF consistentes, un solo tipeo.

**El documento se emite completo en el idioma que el pasajero firmó.** Un
formulario con encabezados en español y declaración en inglés es discutible:
tiene que poder leerlo entero quien lo firma. El decreto exige ambos idiomas
disponibles.

**Snapshot de edad y peso.** Se guardan en `registro`, no en `cliente`: el
documento debe reflejar lo declarado ese día.

**El consentimiento de riesgo se habilita al llegar al final del texto.** Nadie
puede alegar que no lo leyó.

**Tres consentimientos separados.** Aceptar el riesgo no puede implicar
autorizar el uso de tu cara ni recibir publicidad. Cada uno con su fecha.

**Sin firma no hay check-in.** Es una regla del servidor, no del navegador.

## El paquete de prueba de la firma

Ley 19.799, firma electrónica simple. Lo que la sostiene no es el trazo:

| Dato | Para qué |
|---|---|
| `documento_version` + `documento_hash` | Probar **qué** texto firmó |
| `trazo_png` | El gesto |
| `firmado_en`, `ip`, `user_agent` | Cuándo y desde dónde |
| `metodo_verificacion`, `verificado_en` | Que era él |
| Tres consentimientos con fecha | Qué autorizó exactamente |

Todo eso aparece al pie del formulario imprimible.

## Lo que el prototipo NO hace todavía

- **Enviar correos.** El botón de recordatorio muestra a quién se le enviaría.
- **Verificar identidad de verdad.** Registra `metodo_verificacion = email`
  pero no manda el código de 6 dígitos. Es el siguiente paso.
- **Generar PDF binario.** Entrega una vista imprimible; el navegador la
  convierte. Para producción conviene generarlo en el servidor y archivarlo.
- **Autenticación del panel.** `/admin` está abierto. Obvio, pero hay que
  decirlo.
- Reservas, pagos y sincronización con OTAs — eso es la fase 3.

## Antes de producción

- [ ] 🔎 Confirmar que el Decreto 19/2018 sigue vigente
- [ ] ⚖️ Que un abogado revise el texto de `documento.js`
- [ ] Autenticación y roles: los datos de salud los ve el guía de esa salida,
      no todo el personal
- [ ] Plazo de conservación y borrado (Ley 19.628 / 21.719)
- [ ] Respaldos automáticos y probados
- [ ] Migrar de SQLite a PostgreSQL con `schema.sql`

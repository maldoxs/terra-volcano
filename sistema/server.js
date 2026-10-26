/* Prototipo del registro de pasajeros y el manifiesto.
   Sin dependencias: http + node:sqlite. Arrancar con `node sistema/server.js`. */
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { db, sembrar } = require('./db.js');
const doc = require('./documento.js');

sembrar();

const PUERTO = Number(process.env.PORT || 3000);
const PUBLICO = path.join(__dirname, 'public');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g,
  (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function json(res, code, data) {
  const cuerpo = JSON.stringify(data);
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8',
                        'content-length': Buffer.byteLength(cuerpo) });
  res.end(cuerpo);
}
function html(res, code, cuerpo) {
  res.writeHead(code, { 'content-type': 'text/html; charset=utf-8' });
  res.end(cuerpo);
}
function archivo(res, rel) {
  const p = path.join(PUBLICO, rel);
  if (!p.startsWith(PUBLICO) || !fs.existsSync(p)) return html(res, 404, 'No encontrado');
  const tipo = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[path.extname(p)]
             || 'application/octet-stream';
  res.writeHead(200, { 'content-type': `${tipo}; charset=utf-8` });
  fs.createReadStream(p).pipe(res);
}
const cuerpoJSON = (req) => new Promise((ok, mal) => {
  let d = ''; req.on('data', (c) => { d += c; if (d.length > 2e6) req.destroy(); });
  req.on('end', () => { try { ok(JSON.parse(d || '{}')); } catch (e) { mal(e); } });
});

// ---------- consultas ----------
const SALIDAS = `
  SELECT s.id, s.fecha, s.hora_inicio_prevista AS hora, s.estado, s.cupo_max,
         s.alerta_sernageomin,
         a.nombre_es AS actividad, a.edad_minima,
         (SELECT count(*) FROM reserva r WHERE r.salida_id = s.id)            AS inscritos,
         (SELECT count(*) FROM reserva r JOIN registro g ON g.reserva_id = r.id
            JOIN firma f ON f.registro_id = g.id WHERE r.salida_id = s.id)    AS firmados,
         (SELECT count(*) FROM salida_guia sg WHERE sg.salida_id = s.id)      AS guias
  FROM salida s JOIN actividad a ON a.id = s.actividad_id
  ORDER BY s.fecha`;

const MANIFIESTO = `
  SELECT r.id AS reserva_id, r.canal, r.checkin_en, r.token_registro,
         c.nombre, c.nacionalidad, c.idioma, c.telefono,
         g.id AS registro_id, g.edad, g.peso_kg, g.completado_en, g.es_menor,
         g.alergias, g.alergias_detalle, g.medicamentos, g.medicamentos_detalle,
         g.cirugias, g.cirugias_detalle, g.embarazo, g.dieta, g.dieta_detalle,
         g.tiene_seguro, g.otros, g.otros_detalle,
         f.id AS firma_id, f.firmado_en, f.acepto_imagen,
         (SELECT nombre || ' · ' || telefono FROM contacto_emergencia
           WHERE registro_id = g.id ORDER BY orden LIMIT 1) AS emergencia
  FROM reserva r
  JOIN cliente c ON c.id = r.cliente_id
  LEFT JOIN registro g ON g.reserva_id = r.id
  LEFT JOIN firma f ON f.registro_id = g.id
  WHERE r.salida_id = ? ORDER BY c.nombre`;

function detalleSalida(id) {
  const s = db.prepare(`SELECT s.*, a.nombre_es, a.nombre_en, a.lugar_salida, a.lugar_llegada,
                               a.itinerario_es, a.itinerario_en, a.edad_minima, a.dificultad,
                               a.desnivel_m
                        FROM salida s JOIN actividad a ON a.id = s.actividad_id
                        WHERE s.id = ?`).get(id);
  if (!s) return null;
  s.guias = db.prepare(`SELECT g.nombre, g.documento_id, sg.rol FROM salida_guia sg
                        JOIN guia g ON g.id = sg.guia_id WHERE sg.salida_id = ?`).all(id);
  s.pasajeros = db.prepare(MANIFIESTO).all(id);
  // Ratio 1:3 — lo que la agencia vende y nadie verifica hoy
  s.ratio_ok = s.guias.length > 0 && s.pasajeros.length <= s.guias.length * 3;
  return s;
}

function porToken(token) {
  const r = db.prepare(`
    SELECT r.id AS reserva_id, r.token_registro, r.checkin_en,
           c.id AS cliente_id, c.nombre, c.email, c.telefono, c.nacionalidad,
           c.documento_tipo, c.documento_numero, c.idioma,
           s.id AS salida_id, s.fecha, s.hora_inicio_prevista, s.hora_fin_prevista,
           a.nombre_es, a.nombre_en, a.lugar_salida, a.lugar_llegada,
           a.itinerario_es, a.itinerario_en, a.edad_minima,
           g.id AS registro_id, g.completado_en, f.id AS firma_id
    FROM reserva r
    JOIN cliente c ON c.id = r.cliente_id
    JOIN salida s ON s.id = r.salida_id
    JOIN actividad a ON a.id = s.actividad_id
    LEFT JOIN registro g ON g.reserva_id = r.id
    LEFT JOIN firma f ON f.registro_id = g.id
    WHERE r.token_registro = ?`).get(token);
  if (!r) return null;
  r.guias = db.prepare(`SELECT g.nombre, g.documento_id FROM salida_guia sg
                        JOIN guia g ON g.id = sg.guia_id WHERE sg.salida_id = ?`).all(r.salida_id);
  return r;
}

// ---------- guardar el formulario ----------
function guardarRegistro(token, d, req) {
  const r = porToken(token);
  if (!r) return { error: 'token_invalido', code: 404 };
  if (r.firma_id) return { error: 'ya_firmado', code: 409 };
  if (!d.acepto_riesgo) return { error: 'riesgo_obligatorio', code: 400 };
  if (!d.contactos || d.contactos.length < 1 || !d.contactos[0].nombre)
    return { error: 'falta_contacto_emergencia', code: 400 };
  if (r.edad_minima && Number(d.edad) < r.edad_minima && !d.es_menor)
    return { error: 'edad_minima', code: 400, minima: r.edad_minima };
  if (d.es_menor && !d.tutor_nombre)
    return { error: 'menor_sin_tutor', code: 400 };

  const idioma = d.idioma === 'en' ? 'en' : 'es';
  const b = (v) => (v ? 1 : 0);

  db.exec('BEGIN');
  try {
    db.prepare(`UPDATE cliente SET nombre=?, nacionalidad=?, documento_tipo=?,
                  documento_numero=?, idioma=?, consentimiento_marketing=?,
                  consentimiento_marketing_en=CASE WHEN ? THEN datetime('now') ELSE NULL END
                WHERE id=?`)
      .run(d.nombre || r.nombre, d.nacionalidad, d.documento_tipo || 'pasaporte',
           d.documento_numero, idioma, b(d.acepto_marketing), b(d.acepto_marketing), r.cliente_id);

    db.prepare(`INSERT INTO registro
      (reserva_id, edad, peso_kg, es_menor, tutor_nombre, tutor_documento,
       exp_actividad, exp_detalle, tiene_seguro, seguro_detalle,
       alergias, alergias_detalle, medicamentos, medicamentos_detalle,
       dieta, dieta_detalle, cirugias, cirugias_detalle,
       embarazo, embarazo_detalle, otros, otros_detalle, completado_en)
      VALUES (?,?,?,?,?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, datetime('now'))`)
      .run(r.reserva_id, Number(d.edad) || null, Number(d.peso_kg) || null,
           b(d.es_menor), d.tutor_nombre || null, d.tutor_documento || null,
           b(d.exp_actividad), d.exp_detalle || null,
           b(d.tiene_seguro), d.seguro_detalle || null,
           b(d.alergias), d.alergias_detalle || null,
           b(d.medicamentos), d.medicamentos_detalle || null,
           b(d.dieta), d.dieta_detalle || null,
           b(d.cirugias), d.cirugias_detalle || null,
           b(d.embarazo), d.embarazo_detalle || null,
           b(d.otros), d.otros_detalle || null);
    const rid = db.prepare('SELECT last_insert_rowid() id').get().id;

    for (const [i, c] of (d.contactos || []).entries()) {
      if (!c.nombre) continue;
      db.prepare(`INSERT INTO contacto_emergencia (registro_id, orden, nombre, telefono, email)
                  VALUES (?,?,?,?,?)`).run(rid, i + 1, c.nombre, c.telefono || '', c.email || null);
    }

    // El paquete de prueba de la firma
    const trazo = String(d.firma_png || '');
    db.prepare(`INSERT INTO firma
      (registro_id, documento_version, documento_hash, trazo_png, ip, user_agent,
       metodo_verificacion, verificado_en, acepto_riesgo, acepto_imagen, acepto_marketing, pdf_hash)
      VALUES (?,?,?,?,?,?, 'email', datetime('now'), 1, ?, ?, ?)`)
      .run(rid, doc.VERSION, doc.hash(idioma), trazo.slice(0, 400000),
           req.socket.remoteAddress || null, req.headers['user-agent'] || null,
           b(d.acepto_imagen), b(d.acepto_marketing),
           crypto.createHash('sha256').update(`${rid}|${doc.hash(idioma)}`).digest('hex'));
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }
  return { ok: true };
}

// ---------- vistas imprimibles ----------
function imprimirRegistro(token) {
  const r = porToken(token);
  if (!r) return null;
  const g = db.prepare('SELECT * FROM registro WHERE reserva_id = ?').get(r.reserva_id);
  if (!g) return null;
  const f = db.prepare('SELECT * FROM firma WHERE registro_id = ?').get(g.id);
  const cs = db.prepare('SELECT * FROM contacto_emergencia WHERE registro_id = ? ORDER BY orden').all(g.id);
  // El documento se emite COMPLETO en el idioma que el pasajero firmó. Un
  // formulario con los encabezados en un idioma y la declaración en otro es
  // discutible legalmente: tiene que poder leerlo entero quien lo firma.
  const L = r.idioma === 'en' ? 'en' : 'es';
  const W = {
    es: { tit:'FORMULARIO DE REGISTRO Y ACEPTACIÓN DE RIESGO',
          sub:'SERVICIOS DE TURISMO AVENTURA · Decreto N°19/2018 · Terra Volcano, Pucón',
          personales:'Datos personales', nombre:'Nombre', nacionalidad:'Nacionalidad',
          documento:'Documento', edadpeso:'Edad / Peso', actividad:'Datos de la actividad',
          act:'Actividad', fecha:'Fecha', horario:'Horario', guia:'Guía', idguia:'ID guía',
          salida:'Lugar de salida', llegada:'Lugar de llegada', itin:'Itinerario',
          emergencia:'Contacto en caso de emergencia', declaracion:'Declaración',
          exp:'Experiencia en la actividad', seg:'¿Tiene seguro?', ale:'Alergias',
          med:'Medicamentos contraindicados', die:'Dietas especiales', cir:'Cirugías recientes',
          emb:'Embarazo', otr:'Otros', tutor:'Tutor responsable', riesgo:'Aceptación de riesgo',
          sinfirma:'Sin firma registrada', si:'SÍ', no:'NO',
          m1:'Firmado electrónicamente el', m2:'Ley 19.799, firma electrónica simple',
          m3:'Versión del documento', m4:'Verificación de identidad', m5:'Uso de imagen',
          m6:'Comunicaciones comerciales', aut:'autorizado', noaut:'NO autorizado',
          acep:'aceptadas', noacep:'no aceptadas' },
    en: { tit:'FORM OF REGISTRATION AND ACCEPTANCE OF RISK',
          sub:'ADVENTURE TOURISM SERVICES · Decree N°19/2018 · Terra Volcano, Pucón',
          personales:'Personal data', nombre:'Name', nacionalidad:'Nationality',
          documento:'Document', edadpeso:'Age / Weight', actividad:'Activity data',
          act:'Activity', fecha:'Date', horario:'Time', guia:'Guide', idguia:'Guide ID',
          salida:'Place of departure', llegada:'Place of arrival', itin:'Itinerary',
          emergencia:'Contact in case of emergency', declaracion:'Declaration',
          exp:'Experience in the same activity', seg:'Do you have insurance?', ale:'Allergies',
          med:'Medications contraindicated', die:'Special diets', cir:'Recent medical surgeries',
          emb:'Pregnancy', otr:'Others', tutor:'Responsible guardian', riesgo:'Acceptance of risk',
          sinfirma:'No signature on record', si:'YES', no:'NO',
          m1:'Electronically signed on', m2:'Law 19,799, simple electronic signature',
          m3:'Document version', m4:'Identity verification', m5:'Use of image',
          m6:'Commercial communications', aut:'authorised', noaut:'NOT authorised',
          acep:'accepted', noacep:'not accepted' },
  }[L];
  const si = (v, det) => `${v ? W.si : W.no}${det ? ' — ' + esc(det) : ''}`;
  const actividad  = L === 'en' ? r.nombre_en : r.nombre_es;
  const itinerario = L === 'en' ? r.itinerario_en : r.itinerario_es;

  return `<!doctype html><meta charset="utf-8"><title>${esc(W.tit)} — ${esc(r.nombre)}</title>
<style>body{font:13px/1.5 -apple-system,system-ui,sans-serif;max-width:760px;margin:30px auto;padding:0 20px;color:#14110F}
h1{font-size:17px;text-align:center;margin:0 0 2px}h2{font-size:11px;letter-spacing:.1em;text-transform:uppercase;background:#eee;padding:5px 8px;margin:22px 0 8px}
table{width:100%;border-collapse:collapse}td{border:1px solid #bbb;padding:5px 7px;vertical-align:top}
td.k{background:#fafafa;width:30%;font-weight:600}.sub{text-align:center;font-size:11px;color:#666;margin-bottom:18px}
.decl{font-size:12px;white-space:pre-wrap;border:1px solid #bbb;padding:10px;background:#fafafa}
.firma{margin-top:22px;border-top:1px solid #14110F;padding-top:6px}
.meta{font-size:10px;color:#777;margin-top:14px;line-height:1.7}
img{max-width:230px;display:block}@media print{body{margin:0}}</style>
<h1>${esc(W.tit)}</h1>
<div class="sub">${esc(W.sub)}</div>

<h2>${esc(W.personales)}</h2><table>
<tr><td class="k">${esc(W.nombre)}</td><td>${esc(r.nombre)}</td><td class="k">${esc(W.nacionalidad)}</td><td>${esc(r.nacionalidad)}</td></tr>
<tr><td class="k">${esc(W.documento)}</td><td>${esc(r.documento_numero)}</td><td class="k">${esc(W.edadpeso)}</td><td>${esc(g.edad)} · ${esc(g.peso_kg)} kg</td></tr></table>

<h2>${esc(W.actividad)}</h2><table>
<tr><td class="k">${esc(W.act)}</td><td colspan="3">${esc(actividad)}</td></tr>
<tr><td class="k">${esc(W.fecha)}</td><td>${esc(r.fecha)}</td><td class="k">${esc(W.horario)}</td><td>${esc(r.hora_inicio_prevista)} – ${esc(r.hora_fin_prevista)}</td></tr>
<tr><td class="k">${esc(W.guia)}</td><td>${esc(r.guias.map((x) => x.nombre).join(', '))}</td><td class="k">${esc(W.idguia)}</td><td>${esc(r.guias.map((x) => x.documento_id).join(', '))}</td></tr>
<tr><td class="k">${esc(W.salida)}</td><td>${esc(r.lugar_salida)}</td><td class="k">${esc(W.llegada)}</td><td>${esc(r.lugar_llegada)}</td></tr>
<tr><td class="k">${esc(W.itin)}</td><td colspan="3">${esc(itinerario)}</td></tr></table>

<h2>${esc(W.emergencia)}</h2><table>
${cs.map((c) => `<tr><td class="k">${esc(c.nombre)}</td><td>${esc(c.telefono)}</td><td colspan="2">${esc(c.email || '')}</td></tr>`).join('')}</table>

<h2>${esc(W.declaracion)}</h2><table>
<tr><td class="k">${esc(W.exp)}</td><td colspan="3">${si(g.exp_actividad, g.exp_detalle)}</td></tr>
<tr><td class="k">${esc(W.seg)}</td><td colspan="3">${si(g.tiene_seguro, g.seguro_detalle)}</td></tr>
<tr><td class="k">${esc(W.ale)}</td><td colspan="3">${si(g.alergias, g.alergias_detalle)}</td></tr>
<tr><td class="k">${esc(W.med)}</td><td colspan="3">${si(g.medicamentos, g.medicamentos_detalle)}</td></tr>
<tr><td class="k">${esc(W.die)}</td><td colspan="3">${si(g.dieta, g.dieta_detalle)}</td></tr>
<tr><td class="k">${esc(W.cir)}</td><td colspan="3">${si(g.cirugias, g.cirugias_detalle)}</td></tr>
<tr><td class="k">${esc(W.emb)}</td><td colspan="3">${si(g.embarazo, g.embarazo_detalle)}</td></tr>
<tr><td class="k">${esc(W.otr)}</td><td colspan="3">${si(g.otros, g.otros_detalle)}</td></tr>
${g.es_menor ? `<tr><td class="k">${esc(W.tutor)}</td><td colspan="3">${esc(g.tutor_nombre)} · ${esc(g.tutor_documento)}</td></tr>` : ''}
</table>

<h2>${esc(W.riesgo)}</h2>
<div class="decl">${esc(doc.TEXTO[L])}</div>

<div class="firma">
  ${f && f.trazo_png ? `<img src="${esc(f.trazo_png)}" alt="firma">` : `<i>${esc(W.sinfirma)}</i>`}
  <b>${esc(g.es_menor ? g.tutor_nombre : r.nombre)}</b> · ${esc(g.es_menor ? g.tutor_documento : r.documento_numero)}
</div>

<div class="meta">
  ${esc(W.m1)} ${esc(f && f.firmado_en)} (UTC) · ${esc(W.m2)}<br>
  ${esc(W.m3)}: ${esc(f && f.documento_version)} · Hash SHA-256: ${esc(f && f.documento_hash)}<br>
  ${esc(W.m4)}: ${esc(f && f.metodo_verificacion)} · IP: ${esc(f && f.ip)}<br>
  ${esc(W.m5)}: ${f && f.acepto_imagen ? esc(W.aut) : esc(W.noaut)} ·
  ${esc(W.m6)}: ${f && f.acepto_marketing ? esc(W.acep) : esc(W.noacep)}
</div>`;
}

function imprimirManifiesto(id) {
  const s = detalleSalida(id);
  if (!s) return null;
  const alertas = s.pasajeros.filter((p) => p.alergias || p.medicamentos || p.cirugias || p.embarazo);
  return `<!doctype html><meta charset="utf-8"><title>Manifiesto ${esc(s.fecha)}</title>
<style>body{font:12px/1.45 -apple-system,system-ui,sans-serif;margin:24px;color:#14110F}
h1{font-size:16px;margin:0 0 3px}.sub{color:#666;margin-bottom:14px}
table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border:1px solid #bbb;padding:5px 6px;text-align:left}
th{background:#eee;font-size:10px;letter-spacing:.06em;text-transform:uppercase}
.al{background:#FDF0E8;border:1px solid #D64A1E;padding:8px 10px;margin:12px 0;font-size:12px}
@media print{body{margin:8mm}}</style>
<h1>Manifiesto de salida — ${esc(s.nombre_es)}</h1>
<div class="sub">${esc(s.fecha)} · ${esc(s.hora_inicio_prevista)}–${esc(s.hora_fin_prevista)} ·
Guías: ${esc(s.guias.map((g) => `${g.nombre} (${g.documento_id})`).join(', '))} ·
Alerta volcánica: ${esc(s.alerta_sernageomin || 's/i')} ·
${s.pasajeros.length}/${s.cupo_max} pasajeros · Ratio ${s.ratio_ok ? 'OK' : '⚠ EXCEDIDA'}</div>
<div class="sub">Salida: ${esc(s.lugar_salida)} → Llegada: ${esc(s.lugar_llegada)}</div>
${alertas.length ? `<div class="al"><b>Atención médica del grupo:</b><br>${alertas.map((p) =>
  `${esc(p.nombre)}: ${[p.alergias && 'alergias ' + (p.alergias_detalle || ''),
    p.medicamentos && 'medicamentos ' + (p.medicamentos_detalle || ''),
    p.cirugias && 'cirugía reciente ' + (p.cirugias_detalle || ''),
    p.embarazo && 'embarazo'].filter(Boolean).map(esc).join(' · ')}`).join('<br>')}</div>` : ''}
<table><tr><th>Pasajero</th><th>Nac.</th><th>Edad</th><th>Peso</th><th>Contacto emergencia</th>
<th>Teléfono</th><th>Registro</th><th>Firma</th><th>Check-in</th></tr>
${s.pasajeros.map((p) => `<tr><td>${esc(p.nombre)}</td><td>${esc(p.nacionalidad)}</td>
<td>${esc(p.edad ?? '—')}</td><td>${esc(p.peso_kg ?? '—')}</td>
<td>${esc(p.emergencia || '—')}</td><td>${esc(p.telefono || '')}</td>
<td>${p.completado_en ? 'OK' : 'FALTA'}</td><td>${p.firma_id ? 'OK' : 'FALTA'}</td>
<td>${p.checkin_en ? 'OK' : '☐'}</td></tr>`).join('')}</table>`;
}

// ---------- rutas ----------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname;
  try {
    if (p === '/') { res.writeHead(302, { location: '/admin' }); return res.end(); }
    if (p === '/admin') return archivo(res, 'admin.html');
    if (p.startsWith('/estatico/')) return archivo(res, p.slice(10));

    let m;
    if ((m = p.match(/^\/registro\/([\w-]+)$/))) return archivo(res, 'registro.html');
    if ((m = p.match(/^\/imprimir\/registro\/([\w-]+)$/))) {
      const h = imprimirRegistro(m[1]);
      return h ? html(res, 200, h) : html(res, 404, 'Sin registro');
    }
    if ((m = p.match(/^\/imprimir\/salida\/(\d+)$/))) {
      const h = imprimirManifiesto(Number(m[1]));
      return h ? html(res, 200, h) : html(res, 404, 'Sin salida');
    }

    if (p === '/api/salidas') return json(res, 200, db.prepare(SALIDAS).all());
    if ((m = p.match(/^\/api\/salida\/(\d+)$/))) {
      const s = detalleSalida(Number(m[1]));
      return s ? json(res, 200, s) : json(res, 404, { error: 'no_existe' });
    }
    if ((m = p.match(/^\/api\/salida\/(\d+)\/checkin$/)) && req.method === 'POST') {
      const { reserva_id } = await cuerpoJSON(req);
      const r = db.prepare(`SELECT f.id AS firma FROM reserva r
                            LEFT JOIN registro g ON g.reserva_id = r.id
                            LEFT JOIN firma f ON f.registro_id = g.id WHERE r.id = ?`).get(reserva_id);
      // Regla dura: sin firma no hay check-in.
      if (!r || !r.firma) return json(res, 409, { error: 'sin_firma' });
      db.prepare("UPDATE reserva SET checkin_en = datetime('now') WHERE id = ?").run(reserva_id);
      return json(res, 200, { ok: true });
    }
    if ((m = p.match(/^\/api\/registro\/([\w-]+)$/))) {
      if (req.method === 'GET') {
        const r = porToken(m[1]);
        return r ? json(res, 200, { ...r, declaracion: doc.TEXTO, version: doc.VERSION })
                 : json(res, 404, { error: 'token_invalido' });
      }
      if (req.method === 'POST') {
        const d = await cuerpoJSON(req);
        const out = guardarRegistro(m[1], d, req);
        return json(res, out.error ? out.code : 200, out);
      }
    }
    html(res, 404, 'No encontrado');
  } catch (e) {
    console.error(e);
    json(res, 500, { error: 'interno', detalle: String(e.message) });
  }
});

server.listen(PUERTO, () => {
  const ts = db.prepare(`SELECT r.token_registro t, c.nombre n, s.fecha f
                         FROM reserva r JOIN cliente c ON c.id=r.cliente_id
                         JOIN salida s ON s.id=r.salida_id
                         WHERE NOT EXISTS (SELECT 1 FROM registro g WHERE g.reserva_id=r.id)
                         LIMIT 3`).all();
  console.log(`\n  Terra Volcano · prototipo en http://localhost:${PUERTO}`);
  console.log(`  Admin:  http://localhost:${PUERTO}/admin\n`);
  console.log('  Enlaces de registro pendientes (los que se enviarían al pasajero):');
  for (const t of ts) console.log(`    ${t.n} (${t.f}) → http://localhost:${PUERTO}/registro/${t.t}`);
  console.log('');
});

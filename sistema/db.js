/* Base del prototipo. SQLite incorporado de Node 22 — cero dependencias.
   El esquema de producción está en schema.sql (PostgreSQL); acá va la misma
   estructura adaptada a los tipos de SQLite. */
'use strict';
const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
const path = require('node:path');

const RUTA = process.env.TV_DB || path.join(__dirname, 'terravolcano.db');
const db = new DatabaseSync(RUTA);
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS guia (
  id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, documento_id TEXT NOT NULL,
  telefono TEXT, acreditacion TEXT, activo INTEGER NOT NULL DEFAULT 1);

CREATE TABLE IF NOT EXISTS actividad (
  id INTEGER PRIMARY KEY, nombre_es TEXT NOT NULL, nombre_en TEXT NOT NULL,
  lugar_salida TEXT NOT NULL, lugar_llegada TEXT NOT NULL,
  itinerario_es TEXT NOT NULL, itinerario_en TEXT NOT NULL,
  desnivel_m INTEGER, dificultad TEXT, edad_minima INTEGER,
  precio_base REAL, moneda TEXT DEFAULT 'CLP', activa INTEGER DEFAULT 1);

CREATE TABLE IF NOT EXISTS salida (
  id INTEGER PRIMARY KEY, actividad_id INTEGER NOT NULL REFERENCES actividad(id),
  fecha TEXT NOT NULL, hora_inicio_prevista TEXT, hora_fin_prevista TEXT,
  hora_inicio_real TEXT, hora_fin_real TEXT,
  cupo_max INTEGER NOT NULL, estado TEXT NOT NULL DEFAULT 'programada',
  nota_clima TEXT, alerta_sernageomin TEXT);

CREATE TABLE IF NOT EXISTS salida_guia (
  salida_id INTEGER NOT NULL REFERENCES salida(id) ON DELETE CASCADE,
  guia_id INTEGER NOT NULL REFERENCES guia(id),
  rol TEXT NOT NULL DEFAULT 'guia', PRIMARY KEY (salida_id, guia_id));

CREATE TABLE IF NOT EXISTS cliente (
  id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, email TEXT, telefono TEXT,
  nacionalidad TEXT, documento_tipo TEXT, documento_numero TEXT,
  idioma TEXT NOT NULL DEFAULT 'es',
  consentimiento_marketing INTEGER DEFAULT 0, consentimiento_marketing_en TEXT,
  creado_en TEXT NOT NULL DEFAULT (datetime('now')));

CREATE TABLE IF NOT EXISTS reserva (
  id INTEGER PRIMARY KEY,
  salida_id INTEGER NOT NULL REFERENCES salida(id) ON DELETE CASCADE,
  cliente_id INTEGER NOT NULL REFERENCES cliente(id),
  canal TEXT NOT NULL, precio_pagado REAL, moneda TEXT DEFAULT 'CLP',
  estado TEXT NOT NULL DEFAULT 'confirmada',
  token_registro TEXT NOT NULL UNIQUE, checkin_en TEXT,
  creada_en TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (salida_id, cliente_id));

CREATE TABLE IF NOT EXISTS registro (
  id INTEGER PRIMARY KEY,
  reserva_id INTEGER NOT NULL UNIQUE REFERENCES reserva(id) ON DELETE CASCADE,
  edad INTEGER, peso_kg REAL, es_menor INTEGER DEFAULT 0,
  tutor_nombre TEXT, tutor_documento TEXT,
  exp_actividad INTEGER, exp_detalle TEXT,
  tiene_seguro INTEGER, seguro_detalle TEXT,
  alergias INTEGER, alergias_detalle TEXT,
  medicamentos INTEGER, medicamentos_detalle TEXT,
  dieta INTEGER, dieta_detalle TEXT,
  cirugias INTEGER, cirugias_detalle TEXT,
  embarazo INTEGER, embarazo_detalle TEXT,
  otros INTEGER, otros_detalle TEXT,
  completado_en TEXT);

CREATE TABLE IF NOT EXISTS contacto_emergencia (
  id INTEGER PRIMARY KEY,
  registro_id INTEGER NOT NULL REFERENCES registro(id) ON DELETE CASCADE,
  orden INTEGER NOT NULL, nombre TEXT NOT NULL, telefono TEXT NOT NULL, email TEXT,
  UNIQUE (registro_id, orden));

CREATE TABLE IF NOT EXISTS firma (
  id INTEGER PRIMARY KEY,
  registro_id INTEGER NOT NULL UNIQUE REFERENCES registro(id) ON DELETE CASCADE,
  documento_version TEXT NOT NULL, documento_hash TEXT NOT NULL,
  trazo_png TEXT, firmado_en TEXT NOT NULL DEFAULT (datetime('now')),
  ip TEXT, user_agent TEXT, metodo_verificacion TEXT, verificado_en TEXT,
  acepto_riesgo INTEGER NOT NULL, acepto_imagen INTEGER DEFAULT 0,
  acepto_marketing INTEGER DEFAULT 0, pdf_hash TEXT);

CREATE TABLE IF NOT EXISTS ascenso (
  reserva_id INTEGER PRIMARY KEY REFERENCES reserva(id) ON DELETE CASCADE,
  llego_cumbre INTEGER, altitud_alcanzada INTEGER, nota TEXT);
`);

const token = () => crypto.randomBytes(9).toString('base64url');

function sembrar() {
  if (db.prepare('SELECT count(*) n FROM actividad').get().n > 0) return;

  const g = db.prepare(
    'INSERT INTO guia (nombre, documento_id, telefono, acreditacion) VALUES (?,?,?,?)');
  g.run('Richard Díaz', '14.521.883-7', '+56983388317', 'Municipalidad de Pucón');
  g.run('Camila Fuentes', '18.904.112-K', '+56912345678', 'Municipalidad de Pucón');
  g.run('Matías Soto', '17.223.455-1', '+56987654321', 'Municipalidad de Pucón');

  const a = db.prepare(`INSERT INTO actividad
    (nombre_es, nombre_en, lugar_salida, lugar_llegada, itinerario_es, itinerario_en,
     desnivel_m, dificultad, edad_minima, precio_base)
    VALUES (?,?,?,?,?,?,?,?,?,?)`);
  a.run('Ascenso al volcán Villarrica', 'Villarrica Volcano Ascent',
    'Av. Bernardo O\'Higgins 717, Local 4, Pucón', 'Av. Bernardo O\'Higgins 717, Local 4, Pucón',
    'Traslado a Pucón Ski. Ascenso por la cara norte con crampones y piolet hasta el cráter (2.847 m). Descenso deslizando por la nieve. Regreso a Pucón.',
    'Transfer to Pucón Ski. Ascent of the north face with crampons and ice axe to the crater (2,847 m). Descent sliding on the snow. Return to Pucón.',
    1400, 'Exigente', 14, 170000);
  a.run('Ski touring volcán Quetrupillán', 'Quetrupillán Ski Touring',
    'Av. Bernardo O\'Higgins 717, Local 4, Pucón', 'Av. Bernardo O\'Higgins 717, Local 4, Pucón',
    'Aproximación en vehículo. Ascenso con pieles de foca hasta el borde del cráter. Descenso fuera de pista.',
    'Vehicle approach. Skin up to the crater rim. Off-piste descent.',
    1100, 'Moderada', 16, 190000);

  const s = db.prepare(`INSERT INTO salida
    (actividad_id, fecha, hora_inicio_prevista, hora_fin_prevista, cupo_max, estado, alerta_sernageomin)
    VALUES (?,?,?,?,?,?,?)`);
  const hoy = new Date();
  const dia = (n) => new Date(hoy.getTime() + n * 864e5).toISOString().slice(0, 10);
  s.run(1, dia(2), '06:00', '16:00', 12, 'confirmada', 'Verde');
  s.run(1, dia(5), '06:00', '16:00', 12, 'programada', 'Verde');
  s.run(2, dia(7), '07:30', '17:00', 8, 'programada', 'Verde');

  const sg = db.prepare('INSERT INTO salida_guia (salida_id, guia_id, rol) VALUES (?,?,?)');
  sg.run(1, 1, 'principal'); sg.run(1, 2, 'guia');
  sg.run(2, 1, 'principal');
  sg.run(3, 3, 'principal');

  const c = db.prepare(`INSERT INTO cliente
    (nombre, email, telefono, nacionalidad, documento_tipo, documento_numero, idioma)
    VALUES (?,?,?,?,?,?,?)`);
  const r = db.prepare(`INSERT INTO reserva
    (salida_id, cliente_id, canal, precio_pagado, token_registro) VALUES (?,?,?,?,?)`);

  const gente = [
    ['Anna Schmidt', 'anna@example.de', '+4915112345', 'Alemania', 'pasaporte', 'C01X9FG4H', 'en', 1, 'web', 170000],
    ['John Carter', 'john@example.com', '+14155550123', 'Estados Unidos', 'pasaporte', '563412789', 'en', 1, 'viator', 208000],
    ['Marco Rossi', 'marco@example.it', '+393331112', 'Italia', 'pasaporte', 'YA3345612', 'en', 1, 'getyourguide', 205000],
    ['Camila Rojas', 'camila@example.cl', '+56955512345', 'Chile', 'rut', '19.556.221-4', 'es', 1, 'presencial', 160000],
    ['Pedro Lagos', 'pedro@example.cl', '+56966654321', 'Chile', 'rut', '16.223.998-0', 'es', 2, 'whatsapp', 170000],
    ['Sophie Martin', 'sophie@example.fr', '+33612345678', 'Francia', 'pasaporte', '19FR44821', 'en', 3, 'web', 190000],
  ];
  for (const [nom, mail, tel, nac, dt, dn, idi, sal, canal, precio] of gente) {
    c.run(nom, mail, tel, nac, dt, dn, idi);
    const cid = db.prepare('SELECT last_insert_rowid() id').get().id;
    r.run(sal, cid, canal, precio, token());
  }

  // Dos pasajeros de la primera salida ya vienen con el formulario completo,
  // para que el manifiesto muestre los tres estados posibles de entrada.
  const reservas = db.prepare('SELECT id FROM reserva WHERE salida_id = 1 ORDER BY id').all();
  completarDemo(reservas[0].id, { edad: 34, peso: 62, alergias: 0 });
  completarDemo(reservas[1].id, { edad: 51, peso: 88, alergias: 1, detalle: 'Frutos secos' });
}

function completarDemo(reservaId, { edad, peso, alergias, detalle }) {
  db.prepare(`INSERT INTO registro
    (reserva_id, edad, peso_kg, exp_actividad, tiene_seguro, alergias, alergias_detalle,
     medicamentos, dieta, cirugias, embarazo, otros, completado_en)
    VALUES (?,?,?,1,1,?,?,0,0,0,0,0, datetime('now'))`)
    .run(reservaId, edad, peso, alergias, detalle || null);
  const rid = db.prepare('SELECT last_insert_rowid() id').get().id;
  db.prepare('INSERT INTO contacto_emergencia (registro_id, orden, nombre, telefono, email) VALUES (?,?,?,?,?)')
    .run(rid, 1, 'Contacto demo', '+49000000', 'demo@example.com');
  db.prepare(`INSERT INTO firma
    (registro_id, documento_version, documento_hash, firmado_en, metodo_verificacion,
     verificado_en, acepto_riesgo, acepto_imagen, acepto_marketing)
    VALUES (?,?,?,datetime('now'),'email',datetime('now'),1,1,?)`)
    .run(rid, 'demo', 'demo-hash', alergias ? 0 : 1);
}

module.exports = { db, token, sembrar };

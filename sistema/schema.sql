-- Terra Volcano — esquema de producción (PostgreSQL)
--
-- Modela el formulario legal del Decreto N°19/2018 (Registro y Aceptación de
-- Riesgo, Servicios de Turismo Aventura).
--
-- Decisión central: el formulario en papel repite los datos de la actividad en
-- cada hoja. Acá viven UNA vez, en `salida`; el PDF de cada pasajero se arma
-- fusionando salida + registro.

BEGIN;

CREATE TABLE guia (
  id            bigserial PRIMARY KEY,
  nombre        text NOT NULL,
  documento_id  text NOT NULL,              -- el "ID N°" del guía que pide el formulario
  telefono      text,
  acreditacion  text,
  activo        boolean NOT NULL DEFAULT true
);

CREATE TABLE actividad (
  id                 bigserial PRIMARY KEY,
  nombre_es          text NOT NULL,
  nombre_en          text NOT NULL,
  lugar_salida       text NOT NULL,
  lugar_llegada      text NOT NULL,
  itinerario_es      text NOT NULL,
  itinerario_en      text NOT NULL,
  duracion_estimada  interval,
  desnivel_m         integer,
  dificultad         text,
  edad_minima        integer,
  precio_base        numeric(12,2),
  moneda             text NOT NULL DEFAULT 'CLP',
  activa             boolean NOT NULL DEFAULT true
);

CREATE TABLE salida (
  id                    bigserial PRIMARY KEY,
  actividad_id          bigint NOT NULL REFERENCES actividad(id),
  fecha                 date NOT NULL,
  hora_inicio_prevista  time,
  hora_fin_prevista     time,
  hora_inicio_real      timestamptz,
  hora_fin_real         timestamptz,
  cupo_max              integer NOT NULL CHECK (cupo_max > 0),
  estado                text NOT NULL DEFAULT 'programada'
                        CHECK (estado IN ('programada','confirmada','cancelada_clima','realizada')),
  nota_clima            text,
  alerta_sernageomin    text,
  creada_en             timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX salida_fecha_idx ON salida (fecha);

-- Varios guías por salida: es lo que permite verificar la ratio 1:3
CREATE TABLE salida_guia (
  salida_id bigint NOT NULL REFERENCES salida(id) ON DELETE CASCADE,
  guia_id   bigint NOT NULL REFERENCES guia(id),
  rol       text NOT NULL DEFAULT 'guia' CHECK (rol IN ('guia','principal')),
  PRIMARY KEY (salida_id, guia_id)
);

CREATE TABLE cliente (
  id                          bigserial PRIMARY KEY,
  nombre                      text NOT NULL,
  email                       text,
  telefono                    text,
  nacionalidad                text,
  documento_tipo              text,          -- pasaporte | rut | otro
  documento_numero            text,
  fecha_nacimiento            date,
  idioma                      text NOT NULL DEFAULT 'es' CHECK (idioma IN ('es','en')),
  consentimiento_marketing    boolean NOT NULL DEFAULT false,
  consentimiento_marketing_en timestamptz,
  creado_en                   timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX cliente_email_idx ON cliente (lower(email)) WHERE email IS NOT NULL;

CREATE TABLE reserva (
  id              bigserial PRIMARY KEY,
  salida_id       bigint NOT NULL REFERENCES salida(id) ON DELETE CASCADE,
  cliente_id      bigint NOT NULL REFERENCES cliente(id),
  -- El campo más valioso del sistema: sin esto no se puede saber cuánta plata
  -- se va en comisiones de OTA contra cuánto entra directo.
  canal           text NOT NULL
                  CHECK (canal IN ('web','presencial','whatsapp','telefono',
                                   'viator','getyourguide','expedia','tripadvisor','otro')),
  precio_pagado   numeric(12,2),
  moneda          text DEFAULT 'CLP',
  abono           numeric(12,2),
  estado          text NOT NULL DEFAULT 'confirmada'
                  CHECK (estado IN ('confirmada','no_show','completada','cancelada')),
  token_registro  text NOT NULL UNIQUE,
  token_expira    timestamptz,
  checkin_en      timestamptz,
  creada_en       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (salida_id, cliente_id)
);

-- El formulario legal. Guarda SNAPSHOT de edad y peso: el documento debe
-- reflejar lo declarado ese día, no los datos actuales del cliente.
CREATE TABLE registro (
  id                   bigserial PRIMARY KEY,
  reserva_id           bigint NOT NULL UNIQUE REFERENCES reserva(id) ON DELETE CASCADE,
  edad                 integer,
  peso_kg              numeric(5,1),
  es_menor             boolean NOT NULL DEFAULT false,
  tutor_nombre         text,
  tutor_documento      text,
  exp_actividad        boolean, exp_detalle         text,
  tiene_seguro         boolean, seguro_detalle      text,
  alergias             boolean, alergias_detalle    text,
  medicamentos         boolean, medicamentos_detalle text,
  dieta                boolean, dieta_detalle       text,
  cirugias             boolean, cirugias_detalle    text,
  embarazo             boolean, embarazo_detalle    text,
  otros                boolean, otros_detalle       text,
  completado_en        timestamptz,
  CONSTRAINT menor_con_tutor CHECK (NOT es_menor OR tutor_nombre IS NOT NULL)
);

CREATE TABLE contacto_emergencia (
  id          bigserial PRIMARY KEY,
  registro_id bigint NOT NULL REFERENCES registro(id) ON DELETE CASCADE,
  orden       smallint NOT NULL CHECK (orden IN (1,2)),   -- el formulario pide dos
  nombre      text NOT NULL,
  telefono    text NOT NULL,
  email       text,
  UNIQUE (registro_id, orden)
);

-- El paquete de prueba de la firma electrónica (Ley 19.799, firma simple).
-- Lo que hace que se sostenga no es el trazo: es poder probar QUÉ texto se
-- firmó, CUÁNDO, DESDE DÓNDE y que la identidad fue verificada.
CREATE TABLE firma (
  id                  bigserial PRIMARY KEY,
  registro_id         bigint NOT NULL UNIQUE REFERENCES registro(id) ON DELETE CASCADE,
  documento_version   text NOT NULL,
  documento_hash      text NOT NULL,         -- SHA-256 del texto exacto firmado
  trazo_png           bytea,
  firmado_en          timestamptz NOT NULL DEFAULT now(),
  ip                  inet,
  user_agent          text,
  metodo_verificacion text CHECK (metodo_verificacion IN ('email','sms','ninguno')),
  verificado_en       timestamptz,
  -- Consentimientos SEPARADOS: aceptar el riesgo no puede implicar aceptar
  -- que publiquen tu cara ni recibir publicidad.
  acepto_riesgo       boolean NOT NULL,
  acepto_imagen       boolean NOT NULL DEFAULT false,
  acepto_marketing    boolean NOT NULL DEFAULT false,
  pdf_url             text,
  pdf_hash            text,
  CONSTRAINT riesgo_obligatorio CHECK (acepto_riesgo)
);

CREATE TABLE ascenso (
  reserva_id        bigint PRIMARY KEY REFERENCES reserva(id) ON DELETE CASCADE,
  llego_cumbre      boolean,
  altitud_alcanzada integer,
  hora_cumbre       timestamptz,
  nota              text
);

CREATE TABLE equipo_entregado (
  id           bigserial PRIMARY KEY,
  reserva_id   bigint NOT NULL REFERENCES reserva(id) ON DELETE CASCADE,
  item         text NOT NULL,
  talla        text,
  entregado_en timestamptz NOT NULL DEFAULT now(),
  devuelto_en  timestamptz
);

CREATE TABLE incidente (
  id          bigserial PRIMARY KEY,
  salida_id   bigint NOT NULL REFERENCES salida(id) ON DELETE CASCADE,
  reserva_id  bigint REFERENCES reserva(id) ON DELETE SET NULL,
  tipo        text NOT NULL,
  descripcion text NOT NULL,
  ocurrido_en timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE comunicacion (
  id         bigserial PRIMARY KEY,
  cliente_id bigint NOT NULL REFERENCES cliente(id) ON DELETE CASCADE,
  reserva_id bigint REFERENCES reserva(id) ON DELETE SET NULL,
  tipo       text NOT NULL,   -- confirmacion|recordatorio_72h|recordatorio_24h|post_ascenso|campania
  canal      text NOT NULL CHECK (canal IN ('email','whatsapp','sms')),
  enviado_en timestamptz NOT NULL DEFAULT now(),
  estado     text NOT NULL DEFAULT 'enviado'
);

-- Manifiesto por fecha: la consulta que hoy obliga a revisar carpetas.
CREATE VIEW v_manifiesto AS
SELECT s.id              AS salida_id,
       s.fecha,
       a.nombre_es       AS actividad,
       c.nombre          AS pasajero,
       c.nacionalidad,
       r.edad,
       r.peso_kg,
       res.canal,
       res.checkin_en IS NOT NULL              AS con_checkin,
       r.completado_en IS NOT NULL             AS registro_completo,
       f.id IS NOT NULL                        AS firmado,
       (COALESCE(r.alergias,false) OR COALESCE(r.medicamentos,false)
        OR COALESCE(r.cirugias,false) OR COALESCE(r.embarazo,false)) AS alerta_salud
FROM salida s
JOIN actividad a ON a.id = s.actividad_id
JOIN reserva  res ON res.salida_id = s.id
JOIN cliente   c  ON c.id = res.cliente_id
LEFT JOIN registro r ON r.reserva_id = res.id
LEFT JOIN firma    f ON f.registro_id = r.id;

COMMIT;

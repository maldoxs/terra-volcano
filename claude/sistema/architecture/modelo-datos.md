# Modelo de datos

El esquema ejecutable vive en [`../../../sistema/schema.sql`](../../../sistema/schema.sql)
(PostgreSQL). Este documento explica **por qué** está así; el SQL es la verdad.

```mermaid
erDiagram
    ACTIVIDAD ||--o{ SALIDA : "se programa en fechas"
    SALIDA    ||--o{ SALIDA_GUIA : "asigna"
    GUIA      ||--o{ SALIDA_GUIA : "trabaja en"
    SALIDA    ||--o{ RESERVA : "recibe"
    CLIENTE   ||--o{ RESERVA : "hace"
    RESERVA   ||--|| REGISTRO : "formulario legal"
    REGISTRO  ||--o{ CONTACTO_EMERGENCIA : "declara 2"
    REGISTRO  ||--|| FIRMA : "se firma con"
    RESERVA   ||--o| ASCENSO : "resultado"
    RESERVA   ||--o{ EQUIPO_ENTREGADO : "retira"
    SALIDA    ||--o{ INCIDENTE : "registra"
    RESERVA   ||--o{ INCIDENTE : "puede involucrar"
    CLIENTE   ||--o{ COMUNICACION : "recibe"
    RESERVA   ||--o{ COMUNICACION : "origina"

    ACTIVIDAD {
        bigserial id PK
        text      nombre_es
        text      nombre_en
        text      itinerario_es
        text      itinerario_en
        integer   desnivel_m
        integer   edad_minima
        numeric   precio_base
    }
    GUIA {
        bigserial id PK
        text      nombre
        text      documento_id "lo exige el decreto"
        text      acreditacion
    }
    SALIDA {
        bigserial id PK
        bigint    actividad_id FK
        date      fecha
        integer   cupo_max
        text      estado "programada|confirmada|cancelada_clima|realizada"
        text      alerta_sernageomin
    }
    SALIDA_GUIA {
        bigint salida_id PK,FK
        bigint guia_id   PK,FK
        text   rol "guia|principal — habilita ratio 1:3"
    }
    CLIENTE {
        bigserial id PK
        text      nombre
        text      email
        text      nacionalidad
        text      idioma "es|en"
        boolean   consentimiento_marketing
    }
    RESERVA {
        bigserial   id PK
        bigint      salida_id FK
        bigint      cliente_id FK
        text        canal "web|presencial|viator|getyourguide|..."
        numeric     precio_pagado
        text        estado "confirmada|no_show|completada|cancelada"
        text        token_registro UK "el QR del pasajero"
        timestamptz checkin_en
    }
    REGISTRO {
        bigserial id PK
        bigint    reserva_id FK,UK
        integer   edad "snapshot del dia"
        numeric   peso_kg "snapshot del dia"
        boolean   es_menor
        text      tutor_nombre
        boolean   alergias "DATO DE SALUD"
        boolean   medicamentos "DATO DE SALUD"
        boolean   cirugias "DATO DE SALUD"
        boolean   embarazo "DATO DE SALUD"
    }
    CONTACTO_EMERGENCIA {
        bigserial id PK
        bigint    registro_id FK
        smallint  orden "1 o 2"
        text      nombre
        text      telefono
    }
    FIRMA {
        bigserial   id PK
        bigint      registro_id FK,UK
        text        documento_version
        text        documento_hash "SHA-256 del texto firmado"
        bytea       trazo_png
        timestamptz firmado_en
        inet        ip
        text        metodo_verificacion "email|sms|ninguno"
        boolean     acepto_riesgo "obligatorio"
        boolean     acepto_imagen
        boolean     acepto_marketing
        text        pdf_hash
    }
    ASCENSO {
        bigint      reserva_id PK,FK
        boolean     llego_cumbre
        integer     altitud_alcanzada
        timestamptz hora_cumbre
    }
    EQUIPO_ENTREGADO {
        bigserial   id PK
        bigint      reserva_id FK
        text        item
        text        talla
        timestamptz devuelto_en
    }
    INCIDENTE {
        bigserial   id PK
        bigint      salida_id FK
        bigint      reserva_id FK "nullable"
        text        tipo
        timestamptz ocurrido_en
    }
    COMUNICACION {
        bigserial   id PK
        bigint      cliente_id FK
        bigint      reserva_id FK "nullable"
        text        tipo "recordatorio_72h|post_ascenso|campania"
        text        canal "email|whatsapp|sms"
        timestamptz enviado_en
    }
```

## Las tablas

| Tabla | Para qué |
|---|---|
| `guia` | Nombre y **documento de identidad**, que el formulario legal exige explícitamente |
| `actividad` | El tour: lugares, itinerario, desnivel, edad mínima. Campos `_es` y `_en` |
| `salida` | Una fecha concreta de una actividad, con cupo, estado y alerta volcánica |
| `salida_guia` | Varios guías por salida → permite verificar la **ratio 1:3** |
| `cliente` | La persona. Su idioma y su consentimiento de marketing con fecha |
| `reserva` | Une cliente y salida. Lleva **`canal`** |
| `registro` | El formulario legal: los 8 ítems de la declaración, edad, peso, tutor |
| `contacto_emergencia` | Los **dos** contactos que pide el decreto, con `orden` 1 y 2 |
| `firma` | El paquete de prueba de la firma electrónica |
| `ascenso` | Llegó o no a la cumbre, altitud alcanzada |
| `equipo_entregado` | Qué se le dio, en qué talla, y si lo devolvió |
| `incidente`, `comunicacion` | Registro de seguridad y de mensajes enviados |

## Las cuatro decisiones que importan

### 1. Los datos de la actividad viven en `salida`, no en cada formulario

El papel repite guía, fecha, horas, lugares e itinerario **en cada hoja**. Para
doce pasajeros se escribe doce veces lo mismo, y basta un error del guía para
que queden inconsistentes.

Acá se cargan una vez y el PDF de cada pasajero se arma fusionando
`salida` + `actividad` + `registro`. Doce PDF consistentes, un solo tipeo.

### 2. `reserva.canal` es obligatorio

`web | presencial | whatsapp | telefono | viator | getyourguide | expedia | tripadvisor | otro`

Es el campo más valioso del sistema: **es lo único que permite saber cuánta
plata se va en comisiones contra cuánto entra directo.** Hoy ese número no
existe en la agencia. Con tres meses de datos se tiene la cifra exacta de la
fuga, y ese número es el que justifica invertir en el canal propio.

### 3. `registro` guarda snapshot, no referencia

`edad` y `peso_kg` viven en `registro`, no en `cliente`. El documento legal
debe reflejar **lo declarado ese día**. Si alguien sube tres veces en dos años,
cada formulario conserva su propia edad.

### 4. `firma` es un paquete de prueba, no un dibujo

Bajo la Ley 19.799 la firma electrónica simple es válida entre privados. Lo que
la sostiene no es el trazo:

| Campo | Para qué |
|---|---|
| `documento_version` + `documento_hash` | Probar **qué** texto firmó. SHA-256 del texto exacto |
| `trazo_png` | El gesto |
| `firmado_en`, `ip`, `user_agent` | Cuándo y desde dónde |
| `metodo_verificacion`, `verificado_en` | Que era él y no cualquiera |
| `acepto_riesgo` / `acepto_imagen` / `acepto_marketing` | Tres consentimientos **separados**, cada uno con su fecha |
| `pdf_hash` | Que la copia enviada es la que se firmó |

Restricción `riesgo_obligatorio`: no existe una firma sin aceptación de riesgo.

## Datos sensibles

`alergias`, `medicamentos`, `cirugias` y `embarazo` son **datos de salud**.
Bajo la Ley 19.628 y la Ley 21.719 tienen protección reforzada.

Pendiente de definir: **plazo de conservación** y **quién los ve**. Deberían
ser visibles para el guía de esa salida, no para todo el personal. Hoy el
prototipo no lo restringe porque no tiene autenticación.

## La vista `v_manifiesto`

Responde de una la pregunta que hoy obliga a revisar carpetas: *¿quién subió el
14 de marzo?* Incluye una columna `alerta_salud` que marca al pasajero con
cualquier condición declarada.

# Flujos y reglas de negocio

## El recorrido completo

```mermaid
flowchart TB
    subgraph S1["1 · ADMIN arma la salida"]
        A1["Actividad + fecha + cupo"] --> A2["Asigna guias"] --> A3{"Ratio 1:3?"}
        A3 -- "no" --> A4["Avisa: faltan guias"] --> A2
        A3 -- "si" --> A5["Genera token y QR de la salida"]
    end

    subgraph S2["2 · Entra la reserva"]
        B1["Web · Presencial · WhatsApp"] --> B3
        B2["OTA: Viator · GetYourGuide · Expedia"] --> B3["Cliente + reserva<br/><b>CANAL obligatorio</b>"]
        B3 --> B4["Enlace unico /registro/token"]
    end

    subgraph S4["4 · Walk-in"]
        D1["QR impreso en el mostrador"] --> D2["Mismo formulario, ligado<br/>a la salida del dia"]
    end

    subgraph S3["3 · El pasajero llena el formulario, desde su telefono"]
        C1["Idioma: ES o EN"] --> C2["Codigo de verificacion al correo"]
        C2 --> C3["Datos + alojamiento + 2 contactos de emergencia"]
        C3 --> C5["8 items de la declaracion de salud"]
        C5 --> C6["Lee el texto legal completo"] --> C7{"Llego al final?"}
        C7 -- "no, casilla deshabilitada" --> C6
        C7 -- "si" --> C8["3 casillas separadas, ninguna premarcada"]
        C8 --> C9["Firma + guarda hash, IP y momento"] --> C11["PDF firmado al correo"]
    end

    subgraph S5["5 · Dia de la salida"]
        E1["Manifiesto por fecha,<br/>alertas de salud arriba"] --> E3{"Firmo?"}
        E3 -- "no" --> E4["Check-in BLOQUEADO"]
        E3 -- "si" --> E5["Check-in por QR"] --> E6["Al volver: hora real,<br/>cumbre si o no, incidentes"]
    end

    subgraph S6["6 · Despues del ascenso"]
        F1{"Llego a la cumbre?"}
        F1 -- "si" --> F2["Certificado con QR verificable"]
        F1 -- "no" --> F3["Campania de revancha con descuento"]
        F2 --> F4["Resena a las 24h + galeria del grupo"]
        F3 --> F4
        F4 --> F6["Base de clientes para campanias,<br/>solo con consentimiento"]
    end

    subgraph LEY["Leyenda"]
        L1["Ya construido"] ~~~ L2["Pendiente — fase 3"] ~~~ L3["Bloqueado: falta el texto<br/>oficial del decreto"]
    end

    A5 --> B1
    A5 --> D1
    B4 --> C1
    D2 --> C1
    C11 --> E1
    E6 --> F1

    classDef hecho     fill:#2F5D4A,stroke:#8FD6B4,color:#F2EDE6
    classDef pendiente fill:#4A3C14,stroke:#E8B33C,color:#F2EDE6
    classDef bloqueado fill:#5C2010,stroke:#D64A1E,color:#F2EDE6
    classDef decision  fill:#1F1B18,stroke:#7A736C,color:#F2EDE6

    class A1,A2,A4,A5,B1,B2,B3,B4,C1,C3,C5,C8,C9,D1,D2,E1,E4,E5,E6,L1 hecho
    class C2,C11,F2,F3,F4,F6,L2 pendiente
    class C6,L3 bloqueado
    class A3,C7,E3,F1 decision
```

## Reglas que el servidor hace cumplir

No son validaciones del navegador: están en el servidor, donde no se pueden
saltar.

| Regla | Por qué |
|---|---|
| **Sin firma no hay check-in** | Es el punto donde el papel servía de respaldo legal |
| **La aceptación de riesgo es obligatoria** | Restricción en base de datos, no sólo en la aplicación |
| **Un menor exige nombre y documento del tutor** | Lo pide el formulario legal |
| **Edad mínima por actividad** | Evita que alguien reserve algo que no puede hacer |
| **Primer contacto de emergencia obligatorio** | El decreto pide dos; uno es el mínimo operativo |
| **Un formulario por reserva** | `registro.reserva_id` es único: no se firma dos veces |

## Reglas de interfaz que importan legalmente

- **La casilla de aceptación de riesgo se habilita sólo al llegar al final del
  texto.** Nadie puede alegar que no lo leyó.
- **Tres casillas separadas, ninguna premarcada.** Aceptar el riesgo no puede
  implicar autorizar el uso de tu cara ni recibir publicidad.
- **El documento se emite completo en el idioma firmado.** Encabezados y
  declaración en el mismo idioma: quien firma tiene que poder leerlo entero.

## Lo que el prototipo todavía no hace

- Enviar correos. El botón de recordatorio muestra a quién se le enviaría.
- Mandar el código de verificación. Registra `metodo_verificacion = email`
  pero no lo ejecuta.
- PDF binario archivado. Hoy es vista imprimible.
- Autenticación. `/admin` está abierto.

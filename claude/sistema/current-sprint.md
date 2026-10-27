# Sistema — sprint actual

Fase 1 del [`PLAN.md`](../../PLAN.md): registro de pasajeros.

## Hecho

- [x] Modelo de datos, 12 tablas, PostgreSQL (`sistema/schema.sql`)
- [x] Prototipo corriendo sin dependencias (`node sistema/server.js`)
- [x] Formulario del pasajero bilingüe con firma electrónica
- [x] Manifiesto por fecha con alertas médicas y ratio 1:3
- [x] Formulario legal imprimible con rastro de auditoría
- [x] Reglas duras en servidor: sin firma no hay check-in; menor exige tutor

## En curso

Nada. Esperando decisión sobre qué sigue.

## Lo próximo, por prioridad

1. 🔴 **Autenticación y roles.** No es una funcionalidad pendiente, es un
   riesgo: `/admin` muestra datos de salud sin pedir contraseña. Los datos
   médicos los debe ver el guía de esa salida, no todo el personal.
2. **Código de verificación por correo.** Es lo que le da peso real a la firma.
3. **Envío del PDF al pasajero** al terminar de firmar.
4. **Migrar a PostgreSQL** con `schema.sql`.
5. **Respaldos** automáticos y probados.

## Bloqueado

- Texto oficial de la declaración del decreto → Richard o abogado
- ¿Decreto 19/2018 vigente? → Sernatur
- ¿La exención vale por salida o por temporada? → Richard
- Plazo de conservación de los datos de salud → definir con abogado

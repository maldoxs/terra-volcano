# Protocolo de documentación

Cómo dejar la documentación al terminar una sesión en este repositorio.

Sigue la misma idea que el proyecto de Grupos Empresariales —estado vigente
separado del historial, un dato en un solo lugar— pero es **independiente**:
otros nombres de archivo, otras áreas, y todas las rutas relativas al
repositorio en vez de a una carpeta del Mac.

## Dónde está la documentación

Repositorio: `maldoxs/terra-volcano`, **público**. Lo que no esté commiteado no
existe, y lo que esté commiteado lo ve cualquiera.

**Primero leer [`ESTADO-ACTUAL.md`](ESTADO-ACTUAL.md)**: un hecho vigente por
línea, con enlace al detalle. Es el punto de entrada, no `project-memory.md`,
que es el historial narrativo y es largo.

El vault está partido en tres áreas, cada una con su `project-memory.md`,
`current-sprint.md`, `architecture/` y `sessions/`:

- `sistema/` — registro de pasajeros, base de datos, firma electrónica
- `sitio/` — la landing del Villarrica y el sitio público
- `negocio/` — la agencia, el mercado, las brechas

**Un dato, un solo lugar.** Si un hecho ya está escrito en algún archivo, no lo
repitas en otro: enlázalo. Si dos archivos dicen el mismo número y uno cambia,
el otro queda mintiendo en silencio.

## La secuencia, en orden

### 1. Antes de editar: traer lo que haya en el remoto

Varias sesiones escriben sobre los mismos archivos, y a `CAMBIOS.md` todas
le agregan arriba de todo. Traer primero evita el conflicto; traer al final lo
garantiza.

```bash
git -C . fetch && git status -sb
git pull --rebase origin main      # si el remoto viene adelantado
```

### 2. Modificar el archivo que corresponda

| Qué cambió | Dónde se escribe |
|---|---|
| Modelo de datos, tablas, campos | `claude/sistema/architecture/modelo-datos.md` y `sistema/schema.sql` |
| Flujos del registro, reglas de negocio | `claude/sistema/architecture/flujos.md` |
| La landing, escenas, copy | `claude/sitio/architecture/landing.md` y `produccion/guion.md` |
| Hallazgos sobre la agencia o el mercado | `produccion/analisis-*.md` |
| Estado del sprint | `claude/<area>/current-sprint.md` |
| El detalle narrativo de por qué | `claude/<area>/project-memory.md` |
| Bitácora del día, corta | `claude/<area>/sessions/AAAA-MM-DD.md` |
| Un hecho vigente cambió | `claude/ESTADO-ACTUAL.md` |
| El orden de las fases | `PLAN.md` |

### 3. Escribir la entrada en `CAMBIOS.md`

Es el archivo común donde cada sesión anota lo que hizo, de cualquier IA. La
entrada va **arriba de la última**, con este formato:

```markdown
### [AREA] [modelo o IA], AAAA-MM-DD

**Archivos modificados:** `ruta/archivo.md` (L inicio-fin), `ruta/otro.sql` (nuevo)

- Qué cambiaste y por qué, una línea por cosa, con la ruta completa
- Lo que falte ejecutar, enviar o decidir, anotado como pendiente en la misma
  línea
```

Áreas válidas: `SISTEMA`, `SITIO`, `NEGOCIO`, `DOC`.

### 4. Dejar listo para commitear

No commitear sin que el usuario lo pida, salvo que la sesión tenga instrucción
explícita de hacerlo. Si se commitea, el mensaje explica **por qué**, no sólo
qué archivo se tocó.

## Errores comunes en este proyecto

- **Inventar datos de la agencia.** Precios, teléfonos, altitudes y tasas van
  marcados `[POR CONFIRMAR]` hasta que Richard los valide. Ya hubo que corregir
  el catálogo dos veces por suponer.
- **Repetir el estado en dos lados.** `ESTADO-ACTUAL.md` se sobrescribe;
  `CAMBIOS.md` sólo crece. No mezclarlos.
- **Tocar el texto legal.** `sistema/documento.js` lleva la declaración de
  riesgo versionada con su hash. Cambiarla invalida la trazabilidad de las
  firmas anteriores: si se cambia, se sube la versión, nunca se edita en el
  lugar.
- **Publicar las fotos.** Ninguna es de Terra Volcano. Ver
  `LICENCIAS-PENDIENTES.md`.
- **Agregar idiomas.** Español e inglés y nada más, por decisión tomada.

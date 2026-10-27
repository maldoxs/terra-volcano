# `.claude/` — configuración de agentes

**Ojo: no confundir con [`../claude/`](../claude/), sin punto**, que es la
memoria del proyecto. Esta carpeta es configuración de herramientas.

## Motion AI Kit

`skills/motion/` y `agents/motion-reviewer.md` vienen del paquete
[`motion-ai`](https://github.com/motiondivision/ai-kit) **v14.2.0**, de Matt
Perry (el autor de Motion, antes Framer Motion). Licencia MIT.

Están versionados en el repositorio para que funcionen apenas se clona, sin
ejecutar nada. Para actualizarlos a la última versión:

```bash
npx motion-ai        # elegir: scope "project" y agente "Claude Code"
```

Ese comando reescribe estas carpetas y actualiza `../.mcp.json`.

### Qué aporta

Buenas prácticas de animación para **JS vanilla**, React, Vue, Base UI y Radix;
generación de springs en CSS; auditoría de rendimiento (jank, layout thrash);
y búsqueda en la documentación de Motion.

Lo relevante para este proyecto es la parte de **vanilla JS y CSS**: la landing
usa el motor de scroll-world sin dependencias, y el panel del sistema es HTML
plano. No hace falta instalar la librería `motion` para aprovechar la guía.

### Los servidores MCP

`../.mcp.json` apunta a dos servidores alojados por Motion:

| Servidor | Para qué |
|---|---|
| `motion` | Funciona sin cuenta |
| `motion-plus` | Devuelve 401 hasta iniciar sesión desde el agente (OAuth) |

Son servicios **externos**: las consultas que haga el agente a esos servidores
salen del equipo. No llevan credenciales ni código del repositorio, pero
conviene saberlo.

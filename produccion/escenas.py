#!/usr/bin/env python3
"""Fuente única de verdad del sitio.

De acá salen, por generación, tres cosas que de otro modo se desincronizan:

  1. produccion/prompts/*.txt  — los 17 prompts para Higgsfield / Monid
  2. assets/js/contenido.js    — el contenido bilingüe que consume el motor
  3. el orden de las escenas, que es el mismo en ambos

Editar el copy o el orden acá y volver a correr `python3 produccion/escenas.py`.
Nunca editar los archivos generados a mano: se sobrescriben.
"""

import json
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent

# --- Paleta -----------------------------------------------------------------
PALETA = {
    "obsidiana": "#14110F",
    "lava":      "#D64A1E",
    "azufre":    "#E8B33C",
    "araucaria": "#2F5D4A",
    "lago":      "#3A7CA5",
    "nieve":     "#F2EDE6",
}

# --- Style preamble ---------------------------------------------------------
# Va CARÁCTER POR CARÁCTER en los 6 prompts de escena. Es lo que mantiene el
# mundo cohesionado. Si se edita, se edita para las seis o el mundo se parte.
PREAMBULO = (
    "Soft matte low-poly clay diorama, high isometric view, tilt-shift miniature, "
    "warm volcanic light at golden hour, visible hand-sculpted clay texture, subtle "
    "contact shadows. Palette: #14110F obsidian black, #D64A1E lava orange, #E8B33C "
    "sulphur yellow, #2F5D4A araucaria green, #3A7CA5 lake blue, #F2EDE6 snow bone. "
    "On a plain solid #F2EDE6 background with a soft contact shadow. No text, no "
    "letters, no logos, centered, 3:2."
)

COLA_ESTILO = (
    "Soft matte clay diorama, tilt-shift miniature, warm golden volcanic light, "
    "palette #14110F #D64A1E #E8B33C #2F5D4A #3A7CA5 #F2EDE6"
)

# --- Escenas ----------------------------------------------------------------
# Una escena por volcán: el vuelo ES el catálogo. La última es el campamento
# base, que es donde cae el CTA.
#
# OJO: altitudes y duraciones son de fuentes públicas y están PENDIENTES de
# confirmar con Richard. No publicar sin validar.
ESCENAS = [
    {
        "id": "villarrica",
        "acento": PALETA["lava"],
        "scroll": 1.7, "linger": 0.45,
        "label": {"es": "Villarrica", "en": "Villarrica"},
        "sujeto": "A miniature island of the Villarrica volcano as seen from Pucón: a broad symmetrical stratovolcano with a slightly TRUNCATED flat-topped summit and a wide open crater, NOT a sharp peak, the upper third covered by a permanent glacier cap with narrow ice tongues running down radial gullies and dark basalt ribs showing between them, a steady white steam plume and a faint orange glow from the open summit crater, a line of six tiny roped climbers with ice axes on the snow, a deep blue lake at its foot with a black-sand shore, a small lakeside town of low red-roofed buildings and a wooden pier, a dense dark forest skirt around the base",
        "foco": "the glowing summit crater",
        "copy": {
            "es": {
                "eyebrow": "2.847 m · 6 a 8 horas",
                "title": "El volcán que todavía respira.",
                "body": "Uno de los más activos de Sudamérica. Subes con crampones y piolet, "
                        "te asomas al cráter, y bajas deslizando por la nieve.",
                "tags": ["1 guía cada 3", "Equipo incluido", "Desde Pucón"],
            },
            "en": {
                "eyebrow": "2,847 m · 6 to 8 hours",
                "title": "The volcano that still breathes.",
                "body": "One of South America's most active. You climb it with crampons and "
                        "ice axe, look into the crater, and slide back down the snow.",
                "tags": ["1 guide per 3", "Gear included", "From Pucón"],
            },
        },
    },
    {
        "id": "quetrupillan",
        "acento": PALETA["azufre"],
        "scroll": 1.3, "linger": 0.3,
        "label": {"es": "Quetrupillán", "en": "Quetrupillán"},
        "sujeto": "A miniature island of the Quetrupillán volcano: a BROAD, LOW, eroded volcano with a wide flat shoulder and several old craters rather than one summit, weathered dark lava flows fanning out across a bare volcanic plateau, steaming fumaroles on a rock shoulder, scattered araucaria monkey-puzzle trees on the lower flanks, no roads and no buildings anywhere, two tiny hikers crossing the plateau",
        "foco": "the empty summit plateau",
        "copy": {
            "es": {
                "eyebrow": "2.360 m · Día completo",
                "title": "El vecino sin fila.",
                "body": "Entre el Villarrica y el Lanín, casi nadie lo sube. Mismo "
                        "territorio, la mitad de la gente.",
                "tags": ["Grupos pequeños", "Sin multitudes"],
            },
            "en": {
                "eyebrow": "2,360 m · Full day",
                "title": "The one without the queue.",
                "body": "Between Villarrica and Lanín, and almost nobody climbs it. Same "
                        "terrain, half the people.",
                "tags": ["Small groups", "No crowds"],
            },
        },
    },
    {
        "id": "lanin",
        "acento": PALETA["araucaria"],
        "scroll": 1.5, "linger": 0.4,
        "label": {"es": "Lanín", "en": "Lanín"},
        "sujeto": "A miniature island of the Lanín volcano: a TALL, SLENDER, isolated cone rising far higher than everything around it, steep straight flanks, snow only on the upper half with bare dark rock ridges below and NO glacier cap, a dense grove of umbrella-shaped araucaria monkey-puzzle trees at its base, a small high camp with two orange tents on a ridge, long evening shadows",
        "foco": "the high camp below the summit",
        "copy": {
            "es": {
                "eyebrow": "3.776 m · 2 a 3 días",
                "title": "El grande.",
                "body": "El cono perfecto de la frontera. Se sube en dos o tres días, "
                        "durmiendo arriba entre araucarias.",
                "tags": ["Expedición", "Campamento de altura"],
            },
            "en": {
                "eyebrow": "3,776 m · 2 to 3 days",
                "title": "The big one.",
                "body": "The perfect cone on the border. Two or three days, sleeping high "
                        "up among the araucarias.",
                "tags": ["Expedition", "High camp"],
            },
        },
    },
    {
        "id": "sollipulli",
        "acento": PALETA["lago"],
        "scroll": 1.5, "linger": 0.45,
        "label": {"es": "Sollipulli", "en": "Sollipulli"},
        "sujeto": "A miniature island of the Sollipulli volcano: an enormous CIRCULAR caldera, wide and low rather than a cone, filled edge to edge with a flat white glacier, blue ice cracks across its surface, the dark crater rim ringing it like a wall, native forest climbing the outer slopes, three tiny figures standing on the rim looking in",
        "foco": "the glacier filling the caldera",
        "copy": {
            "es": {
                "eyebrow": "2.282 m · Día completo",
                "title": "Un cráter lleno de hielo.",
                "body": "Una caldera de cuatro kilómetros con un glaciar adentro. No se "
                        "parece a nada más en la zona.",
                "tags": ["Glaciar", "Caldera"],
            },
            "en": {
                "eyebrow": "2,282 m · Full day",
                "title": "A crater full of ice.",
                "body": "A four-kilometre caldera with a glacier sitting inside it. There is "
                        "nothing else like it around here.",
                "tags": ["Glacier", "Caldera"],
            },
        },
    },
    {
        "id": "mocho",
        "acento": PALETA["nieve"],
        "scroll": 1.3, "linger": 0.3,
        "label": {"es": "Mocho-Choshuenco", "en": "Mocho-Choshuenco"},
        "sujeto": "A miniature island of the Mocho-Choshuenco massif: TWO summits side by side on one base, the left one FLAT-TOPPED and capped by a wide white ice cap, the right one a sharper rocky peak, deep temperate Valdivian rainforest and a small dark lake at their feet, mist caught in the valleys, a single track climbing from the forest up to the ice",
        "foco": "the ice cap on the flat summit",
        "copy": {
            "es": {
                "eyebrow": "2.422 m · Día completo",
                "title": "Dos cumbres, un glaciar.",
                "body": "El más remoto del catálogo. Selva valdiviana abajo, casquete de "
                        "hielo arriba.",
                "tags": ["Remoto", "Selva valdiviana"],
            },
            "en": {
                "eyebrow": "2,422 m · Full day",
                "title": "Two summits, one glacier.",
                "body": "The remotest in the catalogue. Valdivian rainforest below, an ice "
                        "cap on top.",
                "tags": ["Remote", "Rainforest"],
            },
        },
    },
    {
        "id": "base",
        "acento": PALETA["lava"],
        "scroll": 1.9, "linger": 0.5,
        "label": {"es": "Reservar", "en": "Book"},
        "sujeto": (
            "A miniature mountain base-camp island at sunset: a timber and stone refuge "
            "with warm glowing windows and a lit fire pit, expedition gear racked under an "
            "awning, ice axes, helmets and coiled ropes on a rack, two 4x4 pickup trucks, "
            "string lights between posts, a wooden signpost, the snow volcano standing "
            "small on the horizon behind"
        ),
        "foco": "the fire pit and the racked gear",
        "copy": {
            "es": {
                "eyebrow": "Reserva directa",
                "title": "Terra Volcano te sube.",
                "body": "Once años guiando en estos cerros, equipo propio y un guía cada "
                        "tres personas. Reservas directo con ellos, sin intermediarios.",
                "tags": ["Acreditado en Pucón", "Equipo incluido", "Si el clima cancela, reagendamos"],
                "cta": {
                    "primary":   {"label": "Reservar por WhatsApp", "href": "#CONFIRMAR-WHATSAPP"},
                    "secondary": {"label": "Ver los tours", "href": "#villarrica"},
                },
            },
            "en": {
                "eyebrow": "Book direct",
                "title": "Terra Volcano takes you up.",
                "body": "Eleven years guiding these mountains, their own gear, and one guide "
                        "per three climbers. You book straight with them, no middleman.",
                "tags": ["Pucón accredited", "Gear included", "Weather cancels, we rebook"],
                "cta": {
                    "primary":   {"label": "Book on WhatsApp", "href": "#CONFIRMAR-WHATSAPP"},
                    "secondary": {"label": "See the tours", "href": "#villarrica"},
                },
            },
        },
    },
]

MARCA = {
    "es": {"hint": "scroll para volar", "tagline": "Expediciones en la Araucanía andina"},
    "en": {"hint": "scroll to fly in",  "tagline": "Expeditions in the Andean Araucanía"},
}


def escribir_prompts():
    destino = RAIZ / "produccion" / "prompts"
    destino.mkdir(parents=True, exist_ok=True)
    for i, e in enumerate(ESCENAS):
        # Still de la escena
        (destino / f"{i}-{e['id']}-still.txt").write_text(
            f"{PREAMBULO} Subject: {e['sujeto']}.\n", encoding="utf-8")

        # Clip de inmersión (dive). start-image = el still de esta escena.
        (destino / f"{i}-{e['id']}-dive.txt").write_text(
            "Single continuous cinematic camera move, no cuts. Begin high and far, "
            f"looking down at the whole {e['id']} diorama from outside like a tiny model. "
            "The camera slowly glides forward and descends toward it, sweeping in toward "
            f"{e['foco']}, as if flying inside. The camera flies low across the scene "
            f"toward {e['foco']}. {COLA_ESTILO}. Smooth, graceful, slow motion, subtle "
            "parallax. No text, no captions.\n", encoding="utf-8")

        # Conector hacia la siguiente escena.
        # start-image = ÚLTIMO frame renderizado del dive i
        # end-image   = PRIMER frame renderizado del dive i+1
        # Nunca los stills: esa es la regla que evita el salto en la costura.
        if i < len(ESCENAS) - 1:
            sig = ESCENAS[i + 1]
            (destino / f"{i}-conector-{e['id']}-a-{sig['id']}.txt").write_text(
                "Single continuous cinematic camera move, no cuts. The camera smoothly "
                f"pulls up and back out of the {e['id']} diorama, rising into the sky, then "
                "glides forward across the connected miniature world of volcanoes and "
                f"arrives above the {sig['id']} diorama, beginning to descend toward it. One "
                "connected miniature clay world, seamless flowing aerial transition. "
                f"{COLA_ESTILO}. Smooth graceful slow motion. No text, no captions.\n",
                encoding="utf-8")
    return destino


def escribir_contenido():
    secciones = []
    for e in ESCENAS:
        s = {
            "id": e["id"],
            "accent": e["acento"],
            "scroll": e["scroll"],
            "linger": e["linger"],
            "still": f"assets/stills/{e['id']}.png",
            "clip": f"assets/vid/{e['id']}.mp4",
            "label": {k: v for k, v in e["label"].items()},
            "copy": e["copy"],
        }
        secciones.append(s)

    conectores = [f"assets/vid/conector-{i}.mp4" for i in range(len(ESCENAS) - 1)]
    datos = {"marca": MARCA, "secciones": secciones, "conectores": conectores,
             "paleta": PALETA}

    destino = RAIZ / "assets" / "js" / "contenido.js"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(
        "/* GENERADO por produccion/escenas.py — no editar a mano. */\n"
        "window.TV_CONTENIDO = " +
        json.dumps(datos, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    return destino


if __name__ == "__main__":
    p = escribir_prompts()
    c = escribir_contenido()
    n = len(list(p.glob("*.txt")))
    print(f"{n} prompts en {p.relative_to(RAIZ)}")
    print(f"contenido en {c.relative_to(RAIZ)}")

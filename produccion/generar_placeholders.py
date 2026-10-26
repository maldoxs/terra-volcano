#!/usr/bin/env python3
"""Genera stills y clips PLACEHOLDER, sin costo ni AI.

Existe por una razón concreta: el motor de scroll no se puede evaluar sin
material. Estos archivos dejan la página funcionando de verdad —el vuelo
scrubea, las costuras calzan, el copy aparece donde corresponde— antes de
gastar un peso en generación.

Cuando lleguen los clips reales de Higgsfield/Monid, se reemplazan los .mp4 y
los .png con los mismos nombres y la página no cambia una línea.

Uso:  python3 produccion/generar_placeholders.py
"""

import math
import pathlib
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFilter

RAIZ = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "produccion"))
from escenas import ESCENAS, PALETA  # noqa: E402

W, H = 1536, 1024                     # 3:2, igual que el still real
VW, VH = 1920, 1080                   # 16:9, el clip
DUR_DIVE, DUR_CONN = 8, 5             # segundos, igual que el plan real
FPS = 24


def hx(c):
    c = c.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


def mezcla(a, b, t):
    return tuple(round(x + (y - x) * t) for x, y in zip(hx(a), hx(b)))


def cono(d, cx, base_y, medio_ancho, alto, color, nieve=None, plano=0.0):
    """Cono volcánico. `plano` recorta la cumbre (0 = punta, 1 = meseta)."""
    cima = medio_ancho * plano
    pts = [(cx - medio_ancho, base_y), (cx - cima, base_y - alto),
           (cx + cima, base_y - alto), (cx + medio_ancho, base_y)]
    d.polygon(pts, fill=color)
    if nieve:
        f = 0.42
        ny = base_y - alto * (1 - f)
        nw = medio_ancho * f + cima * (1 - f)
        d.polygon([(cx - nw, ny), (cx - cima, base_y - alto),
                   (cx + cima, base_y - alto), (cx + nw, ny)], fill=nieve)


def isla(d, cx, cy, rx, ry, color):
    """Base de la isla en perspectiva isométrica: elipse + faldón."""
    d.polygon([(cx - rx, cy), (cx + rx, cy), (cx + rx * 0.55, cy + ry * 1.45),
               (cx - rx * 0.55, cy + ry * 1.45)], fill=color)
    d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=color)


def arbol(d, x, y, s, color):
    """Araucaria esquemática: tronco + tres niveles de copa."""
    d.line([(x, y), (x, y - s * 1.5)], fill=color, width=max(2, int(s * 0.16)))
    for i, k in enumerate((1.0, 0.72, 0.46)):
        yy = y - s * (0.6 + i * 0.45)
        d.polygon([(x - s * k * 0.5, yy), (x + s * k * 0.5, yy),
                   (x, yy - s * 0.55)], fill=color)


def dibujar(esc, idx):
    fondo = hx(PALETA["nieve"])
    im = Image.new("RGB", (W, H), fondo)
    d = ImageDraw.Draw(im)

    obs, lava, azufre, arauc, lago = (
        hx(PALETA[k]) for k in ("obsidiana", "lava", "azufre", "araucaria", "lago"))
    # OJO: la nieve NO puede ser PALETA["nieve"]: ese es el color del fondo y
    # la cumbre se vuelve invisible. Se enfría apenas hacia el azul del lago.
    nieve = mezcla(PALETA["nieve"], PALETA["lago"], 0.14)
    roca = mezcla(PALETA["obsidiana"], PALETA["nieve"], 0.18)
    roca_clara = mezcla(PALETA["obsidiana"], PALETA["nieve"], 0.34)
    cx, suelo = W // 2, int(H * 0.70)

    # Sombra de contacto
    som = Image.new("RGB", (W, H), fondo)
    ImageDraw.Draw(som).ellipse(
        [cx - 520, suelo + 50, cx + 520, suelo + 190],
        fill=mezcla(PALETA["nieve"], PALETA["obsidiana"], 0.13))
    im = Image.blend(im, som.filter(ImageFilter.GaussianBlur(44)), 0.85)
    d = ImageDraw.Draw(im)

    isla(d, cx, suelo, 500, 86, roca)
    d.ellipse([cx - 500, suelo - 86, cx + 500, suelo + 86], fill=roca_clara)

    vid = esc["id"]
    if vid == "villarrica":
        # El Villarrica no es un cono puntiagudo: la cumbre está achatada por el
        # cráter abierto, y el tercio superior lo cubre un glaciar con lenguas
        # que bajan por las canaletas. Y se reconoce tanto por el lago y Pucón a
        # sus pies como por el cerro mismo.
        cono(d, cx, suelo - 10, 300, 420, roca, plano=0.17)
        cima_y = suelo - 430
        # Casquete glaciar sobre el tercio superior
        gw = 300 * 0.17 + (300 - 300 * 0.17) * 0.36
        d.polygon([(cx - gw, cima_y + 150), (cx - 51, cima_y), (cx + 51, cima_y),
                   (cx + gw, cima_y + 150)], fill=nieve)
        # Lenguas de hielo bajando por las canaletas
        for k in (-0.72, -0.3, 0.12, 0.56):
            xa = cx + gw * k
            d.polygon([(xa - 16, cima_y + 150), (xa + 16, cima_y + 150),
                       (xa + 9, cima_y + 150 + 120 + abs(k) * 40),
                       (xa - 9, cima_y + 150 + 120 + abs(k) * 40)], fill=nieve)
        # Cráter abierto con el resplandor
        d.polygon([(cx - 51, cima_y), (cx + 51, cima_y),
                   (cx + 34, cima_y + 26), (cx - 34, cima_y + 26)], fill=lava)
        for i_ in range(6):                                  # cordada en la nieve
            t = i_ / 5
            d.ellipse([cx - 108 + t * 78 - 7, suelo - 90 - t * 300 - 7,
                       cx - 108 + t * 78 + 7, suelo - 90 - t * 300 + 7], fill=lava)
        for i_ in range(5):                                  # fumarola
            r = 26 + i_ * 15
            y = cima_y - 40 - i_ * 58
            d.ellipse([cx - r + i_ * 11, y - r * 0.5, cx + r + i_ * 11, y + r * 0.5],
                      fill=mezcla(PALETA["nieve"], PALETA["obsidiana"], 0.09 - i_ * 0.015))
        # El lago a sus pies, con Pucón en la orilla: la postal reconocible
        d.ellipse([cx - 470, suelo + 18, cx - 30, suelo + 104], fill=lago)
        d.rectangle([cx - 300, suelo + 40, cx - 190, suelo + 50], fill=obs)   # muelle
        for i_, x in enumerate(range(-460, -300, 46)):                        # casas
            d.rectangle([cx + x, suelo + 2, cx + x + 32, suelo + 26], fill=roca_clara)
            d.polygon([(cx + x - 5, suelo + 2), (cx + x + 37, suelo + 2),
                       (cx + x + 16, suelo - 16)], fill=lava)
        for x in (180, 250, 330, 400):                                        # bosque
            arbol(d, cx + x, suelo + 58, 34, arauc)
    elif vid == "quetrupillan":
        cono(d, cx + 30, suelo - 10, 330, 300, roca, plano=0.30)
        cono(d, cx - 250, suelo - 4, 150, 130, roca_clara)
        for i in range(3):                                   # fumarolas
            d.ellipse([cx + 90 + i * 40, suelo - 330 - i * 26,
                       cx + 140 + i * 40, suelo - 300 - i * 26],
                      fill=mezcla(PALETA["nieve"], PALETA["azufre"], 0.45))
        for i, x in enumerate((-430, -360, 340, 420)):
            arbol(d, cx + x, suelo + 44, 42, arauc)
    elif vid == "lanin":
        cono(d, cx, suelo - 14, 265, 520, roca, nieve)
        for i, x in enumerate((-440, -370, -300, 300, 380, 450)):
            arbol(d, cx + x, suelo + 50, 54 - abs(i - 2) * 4, arauc)
        for x in (-150, -105):                               # carpas
            d.polygon([(cx + x, suelo - 180), (cx + x + 46, suelo - 180),
                       (cx + x + 23, suelo - 218)], fill=lava)
    elif vid == "sollipulli":
        cono(d, cx, suelo - 10, 420, 250, roca, plano=0.62)
        d.ellipse([cx - 262, suelo - 300, cx + 262, suelo - 196], fill=nieve)
        for i in range(4):                                   # grietas azules
            d.arc([cx - 220 + i * 26, suelo - 290 + i * 9,
                   cx + 150 - i * 20, suelo - 210 + i * 7], 200, 340, fill=lago, width=5)
        for x in (-70, -20, 30):
            d.ellipse([cx + x - 6, suelo - 310, cx + x + 6, suelo - 298], fill=lava)
    elif vid == "mocho":
        cono(d, cx - 110, suelo - 10, 290, 330, roca, plano=0.52)
        d.ellipse([cx - 110 - 160, suelo - 372, cx - 110 + 160, suelo - 300], fill=nieve)
        cono(d, cx + 250, suelo - 6, 175, 290, roca_clara, nieve)
        d.ellipse([cx - 430, suelo + 30, cx - 230, suelo + 96], fill=lago)
        for i, x in enumerate(range(-460, 470, 78)):
            arbol(d, cx + x, suelo + 118, 34, arauc if i % 2 else mezcla(PALETA["araucaria"], PALETA["obsidiana"], 0.3))
    else:                                                    # base camp
        cono(d, cx + 330, suelo - 40, 180, 230, roca_clara, nieve)
        d.polygon([(cx - 330, suelo - 20), (cx - 30, suelo - 20),
                   (cx - 30, suelo - 170), (cx - 180, suelo - 258),
                   (cx - 330, suelo - 170)], fill=roca)       # refugio
        for i in range(3):                                   # ventanas
            d.rectangle([cx - 290 + i * 86, suelo - 140, cx - 240 + i * 86, suelo - 80],
                        fill=azufre)
        for i in range(6):                                   # fogón
            a = math.pi * (0.2 + i * 0.12)
            d.ellipse([cx + 60 + math.cos(a) * 40, suelo - 70 - math.sin(a) * 46,
                       cx + 92 + math.cos(a) * 40, suelo - 34 - math.sin(a) * 46],
                      fill=lava if i % 2 else azufre)
        d.rectangle([cx + 150, suelo - 46, cx + 290, suelo - 6], fill=obs)   # camioneta
        d.rectangle([cx + 182, suelo - 84, cx + 258, suelo - 46], fill=obs)
        for i in range(5):                                   # guirnalda
            d.ellipse([cx - 330 + i * 92, suelo - 300 + abs(i - 2) * 9,
                       cx - 316 + i * 92, suelo - 286 + abs(i - 2) * 9], fill=azufre)

    # Marca de agua: que nadie confunda esto con el render final.
    d.rectangle([0, H - 54, W, H], fill=mezcla(PALETA["nieve"], PALETA["obsidiana"], 0.07))
    d.text((26, H - 38), f"PLACEHOLDER · escena {idx} · {vid} · reemplazar con el render real",
           fill=mezcla(PALETA["obsidiana"], PALETA["nieve"], 0.35))
    return im


def ff(args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
       "-g", "8", "-keyint_min", "8", "-sc_threshold", "0", "-movflags", "+faststart", "-an"]


def main():
    sd = RAIZ / "assets" / "stills"
    vd = RAIZ / "assets" / "vid"
    tmp = RAIZ / "produccion" / ".tmp"
    for p in (sd, vd, tmp):
        p.mkdir(parents=True, exist_ok=True)

    # 1. Stills
    for i, e in enumerate(ESCENAS):
        dibujar(e, i).save(sd / f"{e['id']}.png")
    print(f"{len(ESCENAS)} stills")

    # 2. Clips de inmersión: un empuje lento hacia el centro (simula el dive)
    for e in ESCENAS:
        src, out = sd / f"{e['id']}.png", vd / f"{e['id']}.mp4"
        n = DUR_DIVE * FPS
        ff(["-loop", "1", "-i", str(src), "-t", str(DUR_DIVE), "-r", str(FPS),
            "-vf", (f"scale={VW*2}:-2,"
                    f"zoompan=z='1+0.20*on/{n}':x='iw/2-(iw/zoom/2)':"
                    f"y='ih/2-(ih/zoom/2)+(ih*0.03*on/{n})':d=1:s={VW}x{VH}:fps={FPS},"
                    "format=yuv420p"), *ENC, str(out)])
    print(f"{len(ESCENAS)} clips de inmersión")

    # 3. Conectores, con la MISMA regla que el pipeline real:
    #    start = ÚLTIMO frame renderizado del dive i
    #    end   = PRIMER frame renderizado del dive i+1
    #    Los extremos salen de los videos, nunca de los stills. Es lo que hace
    #    que la costura calce exacto en ambos lados.
    for i in range(len(ESCENAS) - 1):
        a, b = ESCENAS[i]["id"], ESCENAS[i + 1]["id"]
        fa, fb = tmp / f"{a}_ultimo.png", tmp / f"{b}_primero.png"
        ff(["-sseof", "-0.15", "-i", str(vd / f"{a}.mp4"), "-frames:v", "1", "-q:v", "2", str(fa)])
        ff(["-ss", "0", "-i", str(vd / f"{b}.mp4"), "-frames:v", "1", "-q:v", "2", str(fb)])
        ff(["-loop", "1", "-t", str(DUR_CONN), "-i", str(fa),
            "-loop", "1", "-t", str(DUR_CONN), "-i", str(fb),
            "-filter_complex",
            (f"[0:v]scale={VW}:{VH},zoompan=z='1.20-0.20*on/{DUR_CONN*FPS}':"
             f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={VW}x{VH}:fps={FPS}[a];"
             f"[1:v]scale={VW}:{VH},zoompan=z='1+0.06*on/{DUR_CONN*FPS}':"
             f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={VW}x{VH}:fps={FPS}[b];"
             f"[a][b]xfade=transition=fade:duration={DUR_CONN-1}:offset=0.5,format=yuv420p[v]"),
            "-map", "[v]", "-t", str(DUR_CONN), "-r", str(FPS), *ENC,
            str(vd / f"conector-{i}.mp4")])
    print(f"{len(ESCENAS)-1} conectores")

    for f in tmp.glob("*.png"):
        f.unlink()
    tmp.rmdir()


if __name__ == "__main__":
    main()

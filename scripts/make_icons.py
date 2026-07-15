#!/usr/bin/env python3
# 生成应用图标：512/192 PNG（几何"翻开的书"造型）+ SVG favicon
import os, struct, zlib, math

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
FAV = os.path.join(os.path.dirname(__file__), '..', 'public', 'favicon.svg')
os.makedirs(OUT, exist_ok=True)

def new_canvas(w, h, bg):
    return bytearray(bg * (w * h))

def set_px(buf, w, h, x, y, color):
    if 0 <= x < w and 0 <= y < h:
        i = (y * w + x) * 4
        buf[i:i+3] = bytes(color[:3])
        buf[i+3] = 255

def fill_poly(buf, w, h, poly, color):
    # poly: list of (x,y); 填充凸多边形（按扫描线求交）
    ys = [p[1] for p in poly]
    y0, y1 = int(min(ys)), int(max(ys))
    n = len(poly)
    for y in range(y0, y1 + 1):
        xs = []
        for i in range(n):
            x0, y_a = poly[i]
            x1, y_b = poly[(i+1) % n]
            if (y_a <= y < y_b) or (y_b <= y < y_a):
                t = (y - y_a) / (y_b - y_a)
                xs.append(x0 + t * (x1 - x0))
        xs.sort()
        for k in range(0, len(xs) - 1, 2):
            xa, xb = int(math.ceil(xs[k])), int(math.floor(xs[k+1]))
            for x in range(xa, xb + 1):
                set_px(buf, w, h, x, y, color)

def fill_round_rect(buf, w, h, x, y, rw, rh, r, color):
    for yy in range(y, y + rh):
        for xx in range(x, x + rw):
            if (xx - x - r)**2 + (yy - y - r)**2 <= r*r or \
               (xx - x - rw + r + 1)**2 + (yy - y - r)**2 <= r*r or \
               (xx - x - r)**2 + (yy - y - rh + r + 1)**2 <= r*r or \
               (xx - x - rw + r + 1)**2 + (yy - y - rh + r + 1)**2 <= r*r or \
               (r <= xx - x <= rw - r and r <= yy - y <= rh - r):
                set_px(buf, w, h, xx, yy, color)

def hline(buf, w, h, x0, x1, y, color):
    for x in range(int(x0), int(x1) + 1):
        set_px(buf, w, h, x, y, color)

def make_icon(size):
    buf = new_canvas(size, size, (31, 27, 22, 255))  # 深暖背景 #1f1b16
    # 圆角背景块
    m = int(size * 0.06)
    fill_round_rect(buf, size, size, m, m, size - 2*m, size - 2*m, int(size*0.18), (31, 27, 22, 255))
    cx = size / 2
    half = size * 0.30
    top = size * 0.27
    bot = size * 0.73
    cream = (245, 240, 230, 255)
    # 左页
    fill_poly(buf, size, size, [(cx, top+size*0.03), (cx-half, top+size*0.06),
                                (cx-half, bot), (cx, bot-size*0.02)], cream)
    # 右页
    fill_poly(buf, size, size, [(cx, top+size*0.03), (cx+half, top+size*0.06),
                                (cx+half, bot), (cx, bot-size*0.02)], cream)
    # 书脊
    hline(buf, size, size, int(cx-2), int(cx+2), int(top+size*0.03), (120, 110, 95, 255))
    # 文字行（左）
    line_c = (200, 190, 170, 255)
    for i in range(4):
        yy = int(top + size*0.14 + i*size*0.11)
        hline(buf, size, size, int(cx-half*0.85), int(cx-6), yy, line_c)
    for i in range(4):
        yy = int(top + size*0.14 + i*size*0.11)
        hline(buf, size, size, int(cx+6), int(cx+half*0.85), yy, line_c)
    return buf

def write_png(path, w, h, buf):
    def chunk(typ, data):
        c = struct.pack('>I', len(data)) + typ + data
        return c + struct.pack('>I', zlib.crc32(typ + data) & 0xffffffff)
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    raw = bytearray()
    for y in range(h):
        raw.append(0)
        raw.extend(buf[y*w*4:(y+1)*w*4])
    idat = zlib.compress(bytes(raw), 9)
    with open(path, 'wb') as f:
        f.write(sig + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b''))

big = make_icon(512)
write_png(os.path.join(OUT, 'icon-512.png'), 512, 512, big)
# 192 降采样（最近邻）
small = bytearray(192*192*4)
for y in range(192):
    for x in range(192):
        sx, sy = int(x*512/192), int(y*512/192)
        i = (sy*512 + sx)*4
        j = (y*192 + x)*4
        small[j:j+4] = big[i:i+4]
write_png(os.path.join(OUT, 'icon-192.png'), 192, 192, small)
print('icons written:', os.path.join(OUT, 'icon-512.png'), os.path.join(OUT, 'icon-192.png'))

svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#1f1b16"/>
<path d="M32 20 L18 22 L18 46 L32 44 Z" fill="#f5f0e6"/>
<path d="M32 20 L46 22 L46 46 L32 44 Z" fill="#f5f0e6"/>
<line x1="32" y1="20" x2="32" y2="44" stroke="#786e5f" stroke-width="1.5"/>
<line x1="21" y1="27" x2="30" y2="26" stroke="#c8bfa9" stroke-width="1.2"/>
<line x1="21" y1="32" x2="30" y2="31" stroke="#c8bfa9" stroke-width="1.2"/>
<line x1="21" y1="37" x2="30" y2="36" stroke="#c8bfa9" stroke-width="1.2"/>
<line x1="34" y1="26" x2="43" y2="27" stroke="#c8bfa9" stroke-width="1.2"/>
<line x1="34" y1="31" x2="43" y2="32" stroke="#c8bfa9" stroke-width="1.2"/>
<line x1="34" y1="36" x2="43" y2="37" stroke="#c8bfa9" stroke-width="1.2"/>
</svg>'''
with open(FAV, 'w', encoding='utf-8') as f:
    f.write(svg)
print('favicon written:', FAV)

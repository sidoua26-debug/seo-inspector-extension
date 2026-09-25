import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, colorFn) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = colorFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // Helper to calculate CRC32
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(8 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: 6 (RGBA)
  ihdrData[10] = 0; // Compression: 0
  ihdrData[11] = 0; // Filter: 0
  ihdrData[12] = 0; // Interlace: 0
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT chunk
  const idatChunk = makeChunk('IDAT', deflated);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// Icon generator with SEO magnifying glass and bar chart in cyan & emerald
function seoIconColor(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const radius = w * 0.45;

  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Rounded background circle
  if (dist > radius) {
    return [0, 0, 0, 0];
  }

  // Gradient background: Dark slate / navy
  const t = (x + y) / (w + h);
  let bgR = Math.round(15 + t * 10);
  let bgG = Math.round(23 + t * 20);
  let bgB = Math.round(42 + t * 30);

  // Inner icon: Magnifying glass and bar graph
  const nx = x / w;
  const ny = y / h;

  // Magnifying glass lens center (0.42, 0.42), radius 0.22
  const lensDx = nx - 0.42;
  const lensDy = ny - 0.42;
  const lensDist = Math.sqrt(lensDx * lensDx + lensDy * lensDy);

  // Ring around lens
  if (lensDist >= 0.16 && lensDist <= 0.24) {
    return [6, 182, 212, 255]; // Cyan 500
  }

  // Handle of magnifying glass: from (0.58, 0.58) to (0.78, 0.78)
  if (nx >= 0.54 && ny >= 0.54 && nx <= 0.78 && ny <= 0.78) {
    const lineDist = Math.abs((ny - 0.54) - (nx - 0.54));
    if (lineDist < 0.05) {
      return [16, 185, 129, 255]; // Emerald 500
    }
  }

  // Inside lens: mini 3-bar chart
  // Bar 1: x: 0.32 - 0.36, y: 0.44 - 0.50
  if (nx >= 0.33 && nx <= 0.37 && ny >= 0.44 && ny <= 0.50) {
    return [56, 189, 248, 255]; // Sky blue
  }
  // Bar 2: x: 0.40 - 0.44, y: 0.38 - 0.50
  if (nx >= 0.40 && nx <= 0.44 && ny >= 0.38 && ny <= 0.50) {
    return [16, 185, 129, 255]; // Emerald
  }
  // Bar 3: x: 0.47 - 0.51, y: 0.32 - 0.50
  if (nx >= 0.47 && nx <= 0.51 && ny >= 0.32 && ny <= 0.50) {
    return [245, 158, 11, 255]; // Amber
  }

  return [bgR, bgG, bgB, 255];
}

const iconsDir = path.resolve('public/icons');
fs.mkdirSync(iconsDir, { recursive: true });

for (const size of [16, 48, 128]) {
  const png = createPNG(size, size, seoIconColor);
  const filePath = path.join(iconsDir, `icon-${size}.png`);
  fs.writeFileSync(filePath, png);
  console.log(`Generated ${filePath} (${png.length} bytes)`);
}

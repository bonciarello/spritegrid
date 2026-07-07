/**
 * Sprite Engine — calcola layout, disegna canvas, genera CSS.
 * Tutte le funzioni sono pure (nessun side-effect DOM oltre al canvas 2D).
 */

/**
 * @typedef {Object} IconEntry
 * @property {string} id
 * @property {number} width  - larghezza naturale dell'icona
 * @property {number} height - altezza naturale dell'icona
 * @property {HTMLImageElement} [image] - riferimento all'immagine caricata
 */

/**
 * @typedef {Object} IconPosition
 * @property {number} x      - coordinata X nel canvas (angolo sup. sinistro dell'icona)
 * @property {number} y      - coordinata Y nel canvas
 * @property {number} width  - larghezza originale icona
 * @property {number} height - altezza originale icona
 * @property {number} col    - colonna nella griglia (0-based)
 * @property {number} row    - riga nella griglia (0-based)
 * @property {number} cellX  - coordinata X della cella
 * @property {number} cellY  - coordinata Y della cella
 */

/**
 * @typedef {Object} LayoutResult
 * @property {number} cellWidth
 * @property {number} cellHeight
 * @property {number} spriteWidth
 * @property {number} spriteHeight
 * @property {number} cols
 * @property {number} rows
 * @property {number} maxIconWidth
 * @property {number} maxIconHeight
 * @property {IconPosition[]} positions
 */

/**
 * Calcola il layout dello sprite a griglia.
 * @param {IconEntry[]} icons
 * @param {number} cols
 * @param {number} spacingX
 * @param {number} spacingY
 * @param {number} padding
 * @returns {LayoutResult}
 */
export function computeLayout(icons, cols, spacingX, spacingY, padding) {
  if (!icons || icons.length === 0) {
    return {
      cellWidth: 0,
      cellHeight: 0,
      spriteWidth: 0,
      spriteHeight: 0,
      cols: cols || 4,
      rows: 0,
      maxIconWidth: 0,
      maxIconHeight: 0,
      positions: [],
    };
  }

  const safeCols = Math.max(1, Math.min(cols, icons.length));
  const safeSpacingX = Math.max(0, spacingX);
  const safeSpacingY = Math.max(0, spacingY);
  const safePadding = Math.max(0, padding);

  // Trova le dimensioni massime tra tutte le icone
  let maxW = 0;
  let maxH = 0;
  for (const icon of icons) {
    if (icon.width > maxW) maxW = icon.width;
    if (icon.height > maxH) maxH = icon.height;
  }

  // Dimensione cella = icona massima + padding su ogni lato
  const cellW = maxW + 2 * safePadding;
  const cellH = maxH + 2 * safePadding;

  // Larghezza totale dello sprite
  const spriteW = safeCols * cellW + (safeCols - 1) * safeSpacingX;

  // Numero di righe e altezza totale
  const numRows = Math.ceil(icons.length / safeCols);
  const spriteH = numRows * cellH + (numRows - 1) * safeSpacingY;

  // Calcola posizione di ogni icona
  const positions = icons.map((icon, i) => {
    const row = Math.floor(i / safeCols);
    const col = i % safeCols;

    const cellX = col * (cellW + safeSpacingX);
    const cellY = row * (cellH + safeSpacingY);

    // Centra l'icona nella cella
    const iconX = cellX + safePadding + (maxW - icon.width) / 2;
    const iconY = cellY + safePadding + (maxH - icon.height) / 2;

    return {
      x: iconX,
      y: iconY,
      width: icon.width,
      height: icon.height,
      col,
      row,
      cellX,
      cellY,
    };
  });

  return {
    cellWidth: cellW,
    cellHeight: cellH,
    spriteWidth: spriteW,
    spriteHeight: spriteH,
    cols: safeCols,
    rows: numRows,
    maxIconWidth: maxW,
    maxIconHeight: maxH,
    positions,
  };
}

/**
 * Disegna lo sprite su un canvas 2D.
 * @param {HTMLCanvasElement} canvas
 * @param {LayoutResult} layout
 * @param {IconEntry[]} icons
 * @param {Object} [options]
 * @param {boolean} [options.showGrid=true] - mostra la griglia blueprint
 */
export function drawSprite(canvas, layout, icons, options = {}) {
  const { showGrid = true } = options;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const w = layout.spriteWidth;
  const h = layout.spriteHeight;

  if (w === 0 || h === 0) {
    canvas.width = 1;
    canvas.height = 1;
    ctx.clearRect(0, 0, 1, 1);
    return;
  }

  // Imposta dimensioni canvas con supporto retina
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);

  // Sfondo trasparente con pattern a scacchi per visualizzare trasparenze
  drawCheckerboard(ctx, w, h);

  // Disegna ogni icona
  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i];
    const pos = layout.positions[i];
    if (!pos || !icon.image || !icon.image.complete) continue;

    ctx.drawImage(icon.image, pos.x, pos.y, pos.width, pos.height);
  }

  // Griglia blueprint (sopra le icone)
  if (showGrid && w > 0 && h > 0) {
    drawBlueprintGrid(ctx, layout);
  }
}

/**
 * Pattern a scacchi per visualizzare aree trasparenti.
 */
function drawCheckerboard(ctx, w, h) {
  const size = 8;
  const light = '#F0F0F0';
  const dark = '#E5E5E5';

  for (let y = 0; y < h; y += size) {
    for (let x = 0; x < w; x += size) {
      ctx.fillStyle = ((x / size + y / size) % 2 === 0) ? light : dark;
      ctx.fillRect(x, y, size, size);
    }
  }
}

/**
 * Disegna la griglia blueprint con linee sottili attorno alle celle.
 */
function drawBlueprintGrid(ctx, layout) {
  const { cellWidth, cellHeight, positions } = layout;

  ctx.save();
  ctx.strokeStyle = 'rgba(79, 70, 229, 0.10)';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([4, 4]);

  for (const pos of positions) {
    ctx.strokeRect(pos.cellX + 0.25, pos.cellY + 0.25, cellWidth - 0.5, cellHeight - 0.5);
  }

  ctx.restore();
}

/**
 * Genera il CSS per lo sprite.
 * @param {LayoutResult} layout
 * @param {IconEntry[]} icons
 * @param {string} spriteFilename - nome del file PNG dello sprite
 * @returns {string}
 */
export function generateCSS(layout, icons, spriteFilename = 'sprite.png') {
  if (!icons || icons.length === 0) {
    return '/* Nessuna icona caricata */\n';
  }

  const { spriteWidth, spriteHeight, positions, maxIconWidth, maxIconHeight } = layout;

  const lines = [
    '/* ════════════════════════════════════════════',
    '   Sprite CSS generato — Convertitore Icone PNG',
    `   Dimensioni sprite: ${spriteWidth}×${spriteHeight}px`,
    `   Icone: ${icons.length}  |  Colonne: ${layout.cols}  |  Righe: ${layout.rows}`,
    '   ════════════════════════════════════════════ */',
    '',
    '/* Classe base comune a tutte le icone */',
    '.icon {',
    '  display: inline-block;',
    `  background-image: url('${spriteFilename}');`,
    '  background-repeat: no-repeat;',
    `  background-size: ${spriteWidth}px ${spriteHeight}px;`,
    '  vertical-align: middle;',
    '}',
    '',
    '/* Singole icone */',
  ];

  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i];
    const pos = positions[i];
    if (!pos) continue;

    lines.push(`.icon-${i} {`);
    lines.push(`  width: ${icon.width}px;`);
    lines.push(`  height: ${icon.height}px;`);
    lines.push(`  background-position: -${Math.round(pos.x)}px -${Math.round(pos.y)}px;`);
    lines.push('}');
    lines.push('');
  }

  // Classe helper per dimensione fissa (max icon size)
  lines.push('/* Classe helper: dimensione fissa (icona più grande) */');
  lines.push(`.icon-fixed {`);
  lines.push(`  width: ${maxIconWidth}px;`);
  lines.push(`  height: ${maxIconHeight}px;`);
  lines.push('}');

  return lines.join('\n');
}

/**
 * Esporta il canvas come Blob PNG.
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<Blob>}
 */
export function exportSpritePNG(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Impossibile generare il blob PNG'));
      },
      'image/png',
    );
  });
}

/**
 * Formatta i byte in una stringa leggibile.
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = bytes / Math.pow(k, i);
  const formatted = i === 0 ? Math.round(val).toString() : val.toFixed(1);
  return formatted + ' ' + sizes[i];
}

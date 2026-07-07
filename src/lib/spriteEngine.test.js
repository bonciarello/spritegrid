import { describe, it, expect } from 'vitest';
import { computeLayout, generateCSS, formatBytes } from './spriteEngine.js';

// Mock icons: oggetti con id, width, height (senza image per i test puri)
function makeIcon(id, width, height) {
  return { id, width, height, image: null };
}

describe('computeLayout', () => {
  it('restituisce layout vuoto per array icone vuoto', () => {
    const result = computeLayout([], 4, 10, 10, 0);
    expect(result.spriteWidth).toBe(0);
    expect(result.spriteHeight).toBe(0);
    expect(result.positions).toHaveLength(0);
  });

  it('calcola il layout per 4 icone, 2 colonne, spaziatura 10px', () => {
    const icons = [
      makeIcon('a', 64, 64),
      makeIcon('b', 64, 64),
      makeIcon('c', 64, 64),
      makeIcon('d', 64, 64),
    ];
    const result = computeLayout(icons, 2, 10, 10, 0);

    // 2 colonne => 2 righe
    expect(result.cols).toBe(2);
    expect(result.rows).toBe(2);
    expect(result.maxIconWidth).toBe(64);
    expect(result.maxIconHeight).toBe(64);

    // cella 64x64, 2 colonne con 10px tra loro
    // spriteWidth = 2 * 64 + 1 * 10 = 138
    expect(result.spriteWidth).toBe(138);
    // spriteHeight = 2 * 64 + 1 * 10 = 138
    expect(result.spriteHeight).toBe(138);

    // Posizioni
    expect(result.positions).toHaveLength(4);

    // Prima icona (0,0): cella a (0,0), centrata automaticamente (stessa dimensione)
    expect(result.positions[0].x).toBe(0);
    expect(result.positions[0].y).toBe(0);
    expect(result.positions[0].col).toBe(0);
    expect(result.positions[0].row).toBe(0);

    // Seconda icona (0,1): cella a (64+10=74, 0)
    expect(result.positions[1].x).toBe(74);
    expect(result.positions[1].y).toBe(0);
    expect(result.positions[1].col).toBe(1);
    expect(result.positions[1].row).toBe(0);

    // Terza icona (1,0): cella a (0, 74)
    expect(result.positions[2].x).toBe(0);
    expect(result.positions[2].y).toBe(74);
    expect(result.positions[2].col).toBe(0);
    expect(result.positions[2].row).toBe(1);

    // Quarta icona (1,1): cella a (74, 74)
    expect(result.positions[3].x).toBe(74);
    expect(result.positions[3].y).toBe(74);
    expect(result.positions[3].col).toBe(1);
    expect(result.positions[3].row).toBe(1);
  });

  it('gestisce icone di dimensioni diverse allineandole alla più grande', () => {
    const icons = [
      makeIcon('a', 32, 32),
      makeIcon('b', 64, 48),
      makeIcon('c', 48, 64),
    ];
    const result = computeLayout(icons, 3, 0, 0, 0);

    expect(result.maxIconWidth).toBe(64);
    expect(result.maxIconHeight).toBe(64);
    expect(result.cellWidth).toBe(64);
    expect(result.cellHeight).toBe(64);

    // Icona 32x32 centrata in cella 64x64: offset = (64-32)/2 = 16
    expect(result.positions[0].x).toBe(16);
    expect(result.positions[0].y).toBe(16);

    // Icona 64x48 centrata: x offset = 0, y offset = (64-48)/2 = 8
    expect(result.positions[1].x).toBe(64); // seconda cella
    expect(result.positions[1].y).toBe(8);

    // Icona 48x64 centrata: x offset = (64-48)/2 = 8, y offset = 0
    expect(result.positions[2].x).toBe(128 + 8); // terza cella + offset
    expect(result.positions[2].y).toBe(0);
  });

  it('applica il padding alle celle', () => {
    const icons = [
      makeIcon('a', 32, 32),
      makeIcon('b', 32, 32),
    ];
    const result = computeLayout(icons, 2, 0, 0, 5);

    // cella = 32 + 2*5 = 42
    expect(result.cellWidth).toBe(42);
    expect(result.cellHeight).toBe(42);

    // spriteWidth = 2 * 42 + 0 = 84
    expect(result.spriteWidth).toBe(84);

    // Posizione icona: cellX + padding + centering (stessa dimensione, centering=0)
    expect(result.positions[0].x).toBe(5);  // 0 + 5 + 0
    expect(result.positions[0].y).toBe(5);

    expect(result.positions[1].x).toBe(47); // 42 + 5 + 0
    expect(result.positions[1].y).toBe(5);
  });

  it('rispetta spaziatura orizzontale e verticale diverse', () => {
    const icons = [
      makeIcon('a', 32, 32),
      makeIcon('b', 32, 32),
      makeIcon('c', 32, 32),
      makeIcon('d', 32, 32),
    ];
    const result = computeLayout(icons, 2, 20, 5, 0);

    expect(result.spriteWidth).toBe(2 * 32 + 20); // 84
    expect(result.spriteHeight).toBe(2 * 32 + 5); // 69
  });

  it('limita le colonne a non più del numero di icone', () => {
    const icons = [makeIcon('a', 32, 32)];
    const result = computeLayout(icons, 10, 10, 10, 0);
    expect(result.cols).toBe(1);
  });

  it('gestisce valori negativi azzerandoli', () => {
    const icons = [makeIcon('a', 32, 32)];
    const result = computeLayout(icons, 1, -10, -5, -3);
    expect(result.spriteWidth).toBe(32); // spacingX=0
    expect(result.spriteHeight).toBe(32);
    expect(result.cellWidth).toBe(32); // padding=0
  });
});

describe('generateCSS', () => {
  it('genera CSS con classi .icon-N per ogni icona', () => {
    const icons = [
      { id: 'a', width: 64, height: 64 },
      { id: 'b', width: 32, height: 32 },
    ];
    const layout = computeLayout(icons, 2, 10, 10, 0);
    // 2 icone in 1 riga: spriteWidth = 2*64+10=138, spriteHeight = 1*64 = 64
    const css = generateCSS(layout, icons, 'sprite.png');

    expect(css).toContain('.icon-0');
    expect(css).toContain('.icon-1');
    expect(css).toContain('width: 64px');
    expect(css).toContain('width: 32px');
    expect(css).toContain('background-image: url(\'sprite.png\')');
    expect(css).toContain('background-position: -0px -0px');
    expect(css).toContain('background-size: 138px 64px');
  });

  it('genera background-position corrette con padding', () => {
    const icons = [
      { id: 'a', width: 32, height: 32 },
      { id: 'b', width: 32, height: 32 },
    ];
    const layout = computeLayout(icons, 2, 0, 0, 5);
    const css = generateCSS(layout, icons);

    // Icona 0: x=5, y=5
    expect(css).toContain('background-position: -5px -5px');
    // Icona 1: x=47 (42+5), y=5
    expect(css).toContain('background-position: -47px -5px');
    // La dimensione visualizzata resta 32px
    expect(css).toContain('width: 32px;');
    expect(css).toContain('height: 32px;');
  });

  it('restituisce commento per array icone vuoto', () => {
    const css = generateCSS(computeLayout([], 4, 10, 10, 0), []);
    expect(css).toContain('Nessuna icona caricata');
  });

  it('include le dimensioni totali dello sprite nel background-size', () => {
    const icons = [makeIcon('a', 48, 48)];
    const layout = computeLayout(icons, 1, 0, 0, 0);
    const css = generateCSS(layout, icons);

    expect(css).toContain('background-size: 48px 48px');
  });
});

describe('formatBytes', () => {
  it('formatta byte in formato leggibile', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1048576)).toBe('1.0 MB');
  });
});

import { writable, derived } from 'svelte/store';
import { computeLayout } from './spriteEngine.js';

/** @type {import('svelte/store').Writable<Array<{id: string, file: File, image: HTMLImageElement, width: number, height: number}>>} */
export const icons = writable([]);

export const columns = writable(4);
export const spacingX = writable(10);
export const spacingY = writable(10);
export const padding = writable(0);

/** Layout calcolato in modo reattivo */
export const layout = derived(
  [icons, columns, spacingX, spacingY, padding],
  ([$icons, $cols, $sx, $sy, $pad]) => {
    const iconData = $icons.map((ic) => ({
      id: ic.id,
      width: ic.width,
      height: ic.height,
      image: ic.image,
    }));
    return computeLayout(iconData, $cols, $sx, $sy, $pad);
  }
);

/** Numero totale di icone */
export const iconCount = derived(icons, ($icons) => $icons.length);

/**
 * Aggiunge una lista di icone (da File objects).
 * Restituisce una Promise che risolve quando tutte le immagini sono caricate.
 * @param {File[]} files
 * @returns {Promise<void>}
 */
export function addIcons(files) {
  const pngFiles = files.filter((f) => f.type === 'image/png');
  if (pngFiles.length === 0) return Promise.resolve();

  const loadPromises = pngFiles.map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            file,
            image: img,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        };
        img.onerror = () => reject(new Error(`Impossibile caricare: ${file.name}`));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error(`Impossibile leggere: ${file.name}`));
      reader.readAsDataURL(file);
    });
  });

  return Promise.all(loadPromises).then((newIcons) => {
    icons.update((current) => [...current, ...newIcons]);
  });
}

/** Rimuove un'icona per id */
export function removeIcon(id) {
  icons.update((list) => list.filter((ic) => ic.id !== id));
}

/** Rimuove tutte le icone */
export function clearIcons() {
  icons.set([]);
}

/** Riordina le icone (sposta da fromIndex a toIndex) */
export function reorderIcons(fromIndex, toIndex) {
  icons.update((list) => {
    const copy = [...list];
    const [moved] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, moved);
    return copy;
  });
}

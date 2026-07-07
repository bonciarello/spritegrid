<script>
  import { icons, iconCount, layout, columns, spacingX, spacingY, padding } from './lib/stores.js';
  import { generateCSS, exportSpritePNG, formatBytes } from './lib/spriteEngine.js';
  import DropZone from './lib/components/DropZone.svelte';
  import IconList from './lib/components/IconList.svelte';
  import Controls from './lib/components/Controls.svelte';
  import SpritePreview from './lib/components/SpritePreview.svelte';
  import CssPreview from './lib/components/CssPreview.svelte';
  import DownloadButtons from './lib/components/DownloadButtons.svelte';
  import EmptyState from './lib/components/EmptyState.svelte';

  let cssCode = '';
  let cssLines = 0;
  let spriteCanvasEl = null;
  let spriteBlob = null;
  let spriteSize = '0 B';

  $: {
    cssCode = generateCSS($layout, $icons, 'sprite.png');
    cssLines = cssCode.split('\n').length;
  }

  /** Chiamato dal componente SpritePreview quando il canvas è pronto */
  function onCanvasReady(event) {
    spriteCanvasEl = event.detail;
    updateBlob();
  }

  /** Chiamato quando lo sprite viene ridisegnato */
  function onSpriteDrawn() {
    updateBlob();
  }

  async function updateBlob() {
    if (!spriteCanvasEl || $iconCount === 0) {
      spriteBlob = null;
      spriteSize = '0 B';
      return;
    }
    try {
      const blob = await exportSpritePNG(spriteCanvasEl);
      spriteBlob = blob;
      spriteSize = formatBytes(blob.size);
    } catch {
      spriteBlob = null;
      spriteSize = '—';
    }
  }
</script>

<div class="app-shell">
  <header class="app-header">
    <div class="header-content">
      <div class="header-brand">
        <span class="brand-mark" aria-hidden="true">◈</span>
        <div>
          <h1>Convertitore di icone PNG in sprite CSS</h1>
          <p class="header-subtitle">
            Carica le tue icone, scegli la griglia e scarica lo sprite con il foglio CSS già pronto.
          </p>
        </div>
      </div>
      <div class="header-badge" aria-live="polite">
        {$iconCount === 0
          ? 'Nessuna icona'
          : `${$iconCount} icon${$iconCount === 1 ? 'a' : 'e'}`}
      </div>
    </div>
  </header>

  <main class="app-main">
    {#if $iconCount === 0}
      <section class="upload-section">
        <DropZone />
        <EmptyState />
      </section>
    {:else}
      <div class="workspace">
        <section class="workspace-left" aria-label="Icone e controlli">
          <DropZone compact={true} />
          <IconList />
          <Controls />
        </section>

        <section class="workspace-right" aria-label="Anteprima e download">
          <SpritePreview
            layout={$layout}
            icons={$icons}
            on:canvasReady={onCanvasReady}
            on:spriteDrawn={onSpriteDrawn}
          />
          <div class="actions-bar">
            <DownloadButtons
              {spriteBlob}
              {spriteSize}
              {cssCode}
              disabled={$iconCount === 0}
            />
          </div>
          <CssPreview code={cssCode} lines={cssLines} />
        </section>
      </div>
    {/if}
  </main>

  <footer class="app-footer">
    <p>Strumento gratuito — nessun dato inviato al server, tutto avviene nel tuo browser.</p>
  </footer>
</div>

<style>
  .app-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 var(--space-4);
  }

  /* ── Header ── */
  .app-header {
    padding: var(--space-6) 0 var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  .header-content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .header-brand {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
    color: #fff;
    font-size: 1.25rem;
    border-radius: var(--radius-sm);
  }

  h1 {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--color-text);
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .header-subtitle {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    margin-top: var(--space-1);
    max-width: 480px;
  }

  .header-badge {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 500;
    padding: var(--space-1) var(--space-3);
    background: var(--color-primary-light);
    color: var(--color-primary);
    border-radius: 999px;
    white-space: nowrap;
    margin-top: var(--space-1);
  }

  /* ── Main ── */
  .app-main {
    flex: 1;
    padding: var(--space-4) 0;
  }

  .upload-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    max-width: 640px;
    margin: var(--space-8) auto;
  }

  .workspace {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: var(--space-6);
    align-items: start;
  }

  .workspace-left,
  .workspace-right {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .actions-bar {
    display: flex;
    gap: var(--space-3);
    align-items: center;
    flex-wrap: wrap;
  }

  /* ── Footer ── */
  .app-footer {
    padding: var(--space-4) 0;
    border-top: 1px solid var(--color-border);
    text-align: center;
  }

  .app-footer p {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .workspace {
      grid-template-columns: 1fr;
    }

    .header-content {
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    .app-shell {
      padding: 0 var(--space-3);
    }

    h1 {
      font-size: var(--text-lg);
    }

    .header-brand {
      gap: var(--space-2);
    }

    .brand-mark {
      width: 32px;
      height: 32px;
      font-size: 1rem;
    }
  }
</style>

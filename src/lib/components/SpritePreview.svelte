<script>
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
  import { drawSprite } from '../spriteEngine.js';

  export let layout;
  export let icons;

  const dispatch = createEventDispatcher();

  let canvasEl;
  let zoom = 1;
  let showGrid = true;

  $: spriteDims = layout
    ? `${layout.spriteWidth} × ${layout.spriteHeight} px`
    : '—';

  $: if (canvasEl && layout && icons) {
    redraw();
  }

  function redraw() {
    if (!canvasEl || !layout || !icons) return;
    drawSprite(canvasEl, layout, icons, { showGrid });
    dispatch('spriteDrawn');
  }

  onMount(() => {
    if (canvasEl) {
      dispatch('canvasReady', canvasEl);
      redraw();
    }
  });

  function toggleGrid() {
    showGrid = !showGrid;
    redraw();
  }

  function zoomIn() {
    zoom = Math.min(3, zoom + 0.25);
  }

  function zoomOut() {
    zoom = Math.max(0.25, zoom - 0.25);
  }

  function resetZoom() {
    zoom = 1;
  }
</script>

<div class="preview-panel">
  <div class="panel-header">
    <h2 class="panel-title">Anteprima sprite</h2>
    <div class="panel-actions">
      <span class="sprite-dims" aria-live="polite">{spriteDims}</span>
    </div>
  </div>

  <div class="preview-canvas-wrap">
    <div
      class="canvas-scroll"
      style="transform: scale({zoom}); transform-origin: top left;"
    >
      <canvas
        bind:this={canvasEl}
        class="sprite-canvas"
        aria-label="Anteprima dello sprite sheet generato"
      ></canvas>
    </div>
  </div>

  <div class="preview-toolbar">
    <div class="toolbar-group">
      <button
        class="toolbar-btn"
        on:click={zoomOut}
        disabled={zoom <= 0.25}
        aria-label="Zoom indietro"
        title="Zoom indietro"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>
      <button
        class="toolbar-btn toolbar-btn-zoom"
        on:click={resetZoom}
        aria-label="Ripristina zoom"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        class="toolbar-btn"
        on:click={zoomIn}
        disabled={zoom >= 3}
        aria-label="Zoom avanti"
        title="Zoom avanti"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>
    </div>

    <div class="toolbar-group">
      <label class="toggle-label">
        <input
          type="checkbox"
          checked={showGrid}
          on:change={toggleGrid}
          class="toggle-input"
        />
        <span class="toggle-switch"></span>
        <span class="toggle-text">Griglia</span>
      </label>
    </div>
  </div>
</div>

<style>
  .preview-panel {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    background: #FAFBFC;
  }

  .panel-title {
    font-family: var(--font-display);
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .panel-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .sprite-dims {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--color-text-tertiary);
  }

  /* Canvas area */
  .preview-canvas-wrap {
    padding: var(--space-3);
    background:
      repeating-conic-gradient(#F0F0F0 0% 25%, transparent 0% 50%) 50% / 16px 16px;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    max-height: 500px;
  }

  .canvas-scroll {
    transition: transform var(--duration-normal) var(--ease-out);
  }

  .sprite-canvas {
    display: block;
    image-rendering: auto;
    /* Durante zoom, pixel-perfect rendering */
  }

  /* Toolbar */
  .preview-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-3);
    border-top: 1px solid var(--color-border);
    background: #FAFBFC;
  }

  .toolbar-group {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .toolbar-btn:hover:not(:disabled) {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: var(--color-primary-light);
  }

  .toolbar-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .toolbar-btn-zoom {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 500;
    width: auto;
    padding: 0 var(--space-2);
    min-width: 44px;
  }

  /* Toggle */
  .toggle-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
    min-height: 32px;
    user-select: none;
  }

  .toggle-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-switch {
    position: relative;
    width: 36px;
    height: 20px;
    background: var(--color-border-strong);
    border-radius: 10px;
    transition: background var(--duration-fast) var(--ease-out);
    flex-shrink: 0;
  }

  .toggle-switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
    transition: transform var(--duration-fast) var(--ease-out);
    box-shadow: 0 1px 2px rgba(0,0,0,0.15);
  }

  .toggle-input:checked + .toggle-switch {
    background: var(--color-primary);
  }

  .toggle-input:checked + .toggle-switch::after {
    transform: translateX(16px);
  }

  .toggle-input:focus-visible + .toggle-switch {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  .toggle-text {
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  @media (max-width: 480px) {
    .preview-canvas-wrap {
      padding: var(--space-2);
    }
  }
</style>

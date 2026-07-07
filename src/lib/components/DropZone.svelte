<script>
  import { createEventDispatcher } from 'svelte';
  import { addIcons } from '../stores.js';

  export let compact = false;

  let dragging = false;
  let error = '';

  const dispatch = createEventDispatcher();

  function handleDragOver(e) {
    e.preventDefault();
    dragging = true;
  }

  function handleDragLeave(e) {
    e.preventDefault();
    dragging = false;
  }

  async function handleDrop(e) {
    e.preventDefault();
    dragging = false;
    error = '';

    const files = Array.from(e.dataTransfer.files);
    try {
      await addIcons(files);
    } catch (err) {
      error = err.message || 'Errore nel caricamento';
    }
  }

  async function handleFileSelect(e) {
    error = '';
    const files = Array.from(e.target.files);
    try {
      await addIcons(files);
    } catch (err) {
      error = err.message || 'Errore nel caricamento';
    }
    e.target.value = '';
  }
</script>

<div class="dropzone-wrapper" class:dropzone-wrapper-compact={compact}>
  <div
    class="dropzone"
    class:dragging
    class:hasError={error}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    role="button"
    tabindex="0"
    aria-label="Carica icone PNG — trascina qui o clicca per selezionare"
    on:keydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.currentTarget.querySelector('input[type="file"]')?.click();
      }
    }}
  >
    <input
      type="file"
      accept="image/png"
      multiple
      on:change={handleFileSelect}
      class="sr-only"
      aria-hidden="true"
    />

    <svg class="dropzone-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>

    {#if compact}
      <span class="dropzone-text-compact">Trascina altre icone PNG</span>
    {:else}
      <span class="dropzone-text">
        <strong>Trascina qui le tue icone PNG</strong>
        <span>oppure clicca per selezionare i file</span>
      </span>
      <span class="dropzone-hint">Solo file PNG. Caricamento multiplo supportato.</span>
    {/if}
  </div>

  {#if error}
    <p class="error-msg" role="alert">{error}</p>
  {/if}
</div>

<style>
  .dropzone-wrapper {
    width: 100%;
  }

  .dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-8) var(--space-4);
    border: 2px dashed var(--color-border-strong);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    cursor: pointer;
    transition:
      border-color var(--duration-fast) var(--ease-out),
      background-color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
    text-align: center;
    min-height: 44px;
  }

  .dropzone:hover {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }

  .dropzone:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  .dropzone.dragging {
    border-color: var(--color-accent);
    background: var(--color-accent-light);
    transform: scale(1.01);
  }

  .dropzone.hasError {
    border-color: var(--color-error);
  }

  .dropzone-wrapper-compact .dropzone {
    flex-direction: row;
    padding: var(--space-3) var(--space-4);
    gap: var(--space-3);
    border-radius: var(--radius-md);
    justify-content: center;
  }

  .dropzone-wrapper-compact .dropzone-text-compact {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .dropzone-icon {
    color: var(--color-primary);
    flex-shrink: 0;
  }

  .dropzone.dragging .dropzone-icon {
    color: var(--color-accent);
  }

  .dropzone-wrapper-compact .dropzone-icon {
    width: 20px;
    height: 20px;
  }

  .dropzone-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  .dropzone-text strong {
    color: var(--color-text);
    font-weight: 600;
  }

  .dropzone-hint {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .error-msg {
    margin-top: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-error);
    font-weight: 500;
  }

  /* Screen reader only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>

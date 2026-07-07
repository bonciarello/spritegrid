<script>
  import { icons, removeIcon, clearIcons } from '../stores.js';

  let draggedIndex = null;

  function handleDragStart(e, index) {
    draggedIndex = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e, targetIndex) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    icons.update((list) => {
      const copy = [...list];
      const [moved] = copy.splice(draggedIndex, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
    draggedIndex = null;
  }
</script>

<div class="icon-list-panel">
  <div class="panel-header">
    <h2 class="panel-title">Icone caricate</h2>
    <button
      class="btn-ghost btn-sm"
      on:click={clearIcons}
      disabled={$icons.length === 0}
      aria-label="Rimuovi tutte le icone"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
      Rimuovi tutte
    </button>
  </div>

  <div class="icon-grid" role="list" aria-label="Elenco icone caricate">
    {#each $icons as icon, idx (icon.id)}
      <div
        class="icon-card"
        role="listitem"
        draggable="true"
        on:dragstart={(e) => handleDragStart(e, idx)}
        on:dragover={handleDragOver}
        on:drop={(e) => handleDrop(e, idx)}
        on:dragend={() => (draggedIndex = null)}
      >
        <span class="icon-num" aria-label={`Icona ${idx}`}>{idx}</span>
        <div class="icon-thumb">
          <img
            src={icon.image.src}
            alt={icon.file.name}
            width={icon.width}
            height={icon.height}
            loading="lazy"
          />
        </div>
        <div class="icon-info">
          <span class="icon-name" title={icon.file.name}>{icon.file.name}</span>
          <span class="icon-dims">{icon.width}×{icon.height}</span>
        </div>
        <button
          class="btn-icon-remove"
          on:click={() => removeIcon(icon.id)}
          aria-label={`Rimuovi ${icon.file.name}`}
          title="Rimuovi icona"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    {/each}
  </div>

  {#if $icons.length === 0}
    <p class="empty-hint">Carica icone PNG per iniziare. Ogni icona avrà la sua classe <code>.icon-N</code> nel CSS.</p>
  {/if}
</div>

<style>
  .icon-list-panel {
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

  /* Icon grid */
  .icon-grid {
    display: flex;
    flex-direction: column;
    max-height: 320px;
    overflow-y: auto;
    padding: var(--space-1);
  }

  .icon-card {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2);
    border-radius: var(--radius-sm);
    cursor: grab;
    transition: background var(--duration-fast) var(--ease-out);
    min-height: 44px;
  }

  .icon-card:hover {
    background: var(--color-bg);
  }

  .icon-card:active {
    cursor: grabbing;
    background: var(--color-primary-light);
  }

  .icon-num {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--color-text-tertiary);
    width: 20px;
    text-align: center;
    flex-shrink: 0;
  }

  .icon-thumb {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="4" height="4" fill="%23f0f0f0"/><rect x="4" width="4" height="4" fill="%23e5e5e5"/><rect y="4" width="4" height="4" fill="%23e5e5e5"/><rect x="4" y="4" width="4" height="4" fill="%23f0f0f0"/></svg>');
    background-size: 8px 8px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .icon-thumb img {
    max-width: 32px;
    max-height: 32px;
    object-fit: contain;
    image-rendering: auto;
  }

  .icon-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .icon-name {
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon-dims {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--color-text-tertiary);
  }

  .btn-icon-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: var(--color-text-tertiary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    flex-shrink: 0;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .btn-icon-remove:hover {
    background: rgba(239, 68, 68, 0.08);
    color: var(--color-error);
  }

  /* Ghost button */
  .btn-ghost {
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: var(--font-body);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .btn-sm {
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--color-text-secondary);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    min-height: 32px;
    min-width: 32px;
  }

  .btn-sm:hover:not(:disabled) {
    color: var(--color-error);
    background: rgba(239, 68, 68, 0.06);
  }

  .btn-sm:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .empty-hint {
    padding: var(--space-4) var(--space-3);
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
    text-align: center;
    line-height: 1.5;
  }

  .empty-hint code {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    background: var(--color-bg);
    padding: 1px 5px;
    border-radius: 3px;
    color: var(--color-primary);
  }
</style>

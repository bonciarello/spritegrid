<script>
  export let spriteBlob = null;
  export let spriteSize = '0 B';
  export let cssCode = '';
  export let disabled = false;

  function downloadSprite() {
    if (!spriteBlob) return;
    const url = URL.createObjectURL(spriteBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sprite.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadCSS() {
    if (!cssCode) return;
    const blob = new Blob([cssCode], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sprite.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<div class="download-buttons">
  <button
    class="btn btn-primary"
    on:click={downloadSprite}
    disabled={disabled || !spriteBlob}
    aria-label="Scarica sprite PNG"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
    <span class="btn-content">
      <span>Scarica PNG</span>
      {#if !disabled && spriteBlob}
        <span class="btn-meta">{spriteSize}</span>
      {/if}
    </span>
  </button>

  <button
    class="btn btn-secondary"
    on:click={downloadCSS}
    disabled={disabled || !cssCode}
    aria-label="Scarica foglio CSS"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
    <span class="btn-content">
      <span>Scarica CSS</span>
      {#if !disabled && cssCode}
        <span class="btn-meta">{cssCode.split('\n').length} righe</span>
      {/if}
    </span>
  </button>
</div>

<style>
  .download-buttons {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
    width: 100%;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    border: none;
    border-radius: var(--radius-md);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
    min-height: 44px;
    text-decoration: none;
    white-space: nowrap;
  }

  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
  }

  .btn-meta {
    font-size: 0.6875rem;
    font-weight: 400;
    opacity: 0.75;
    font-family: var(--font-mono);
  }

  /* Primary — sprite PNG */
  .btn-primary {
    background: var(--color-primary);
    color: #fff;
    flex: 1;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--color-primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  /* Secondary — CSS */
  .btn-secondary {
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    flex: 1;
  }

  .btn-secondary:hover:not(:disabled) {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: var(--color-primary-light);
  }

  .btn-secondary:active:not(:disabled) {
    background: var(--color-primary-light);
  }

  @media (max-width: 480px) {
    .download-buttons {
      flex-direction: column;
    }

    .btn {
      justify-content: center;
    }
  }
</style>

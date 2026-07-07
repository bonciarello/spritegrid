<script>
  export let code = '';
  export let lines = 0;

  let collapsed = false;

  /**
   * Applica una semplice colorazione sintattica al CSS.
   */
  function highlightCSS(css) {
    return css
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Commenti
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>')
      // Selettori (.icon-N, .icon, .icon-fixed)
      .replace(/^(\.[\w-]+)(\s*\{)/gm, '<span class="tok-selector">$1</span>$2')
      // Proprietà
      .replace(/^(\s+)([\w-]+)(\s*:)/gm, '$1<span class="tok-property">$2</span>$3')
      // Valori numerici con px
      .replace(/(\d+)(px)/g, '<span class="tok-number">$1</span><span class="tok-unit">$2</span>')
      // Stringhe url(...)
      .replace(/(url\([^)]+\))/g, '<span class="tok-string">$1</span>')
      // Valori keyword
      .replace(/:\s*(no-repeat|inline-block|middle|hidden|auto)/g,
        ': <span class="tok-keyword">$1</span>');
  }

  $: highlighted = highlightCSS(code);
</script>

<div class="css-panel">
  <div class="panel-header">
    <h2 class="panel-title">CSS generato</h2>
    <div class="panel-actions">
      <span class="css-meta">{lines} righe</span>
      <button
        class="btn-ghost btn-sm"
        on:click={() => (collapsed = !collapsed)}
        aria-label={collapsed ? 'Espandi CSS' : 'Comprimi CSS'}
      >
        {collapsed ? 'Espandi' : 'Comprimi'}
      </button>
    </div>
  </div>

  {#if !collapsed}
    <div class="css-code-wrap">
      <pre class="css-code" aria-label="Codice CSS generato"><code>{@html highlighted || '<span class="tok-comment">/* Nessuna icona caricata */</span>'}</code></pre>
    </div>
  {/if}
</div>

<style>
  .css-panel {
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

  .css-meta {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--color-text-tertiary);
  }

  .css-code-wrap {
    padding: var(--space-3);
    max-height: 400px;
    overflow: auto;
    background: #1E1E2E;
  }

  .css-code {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    line-height: 1.7;
    color: #CDD6F4;
    margin: 0;
    white-space: pre;
    tab-size: 2;
  }

  .css-code code {
    font-family: inherit;
    font-size: inherit;
  }

  /* Syntax highlighting (Catppuccin Mocha inspired) */
  :global(.tok-comment) { color: #6C7086; font-style: italic; }
  :global(.tok-selector) { color: #89B4FA; font-weight: 500; }
  :global(.tok-property) { color: #89DCEB; }
  :global(.tok-number) { color: #FAB387; }
  :global(.tok-unit) { color: #F9E2AF; }
  :global(.tok-string) { color: #A6E3A1; }
  :global(.tok-keyword) { color: #CBA6F7; }

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

  .btn-sm:hover {
    color: var(--color-primary);
    background: var(--color-primary-light);
  }
</style>

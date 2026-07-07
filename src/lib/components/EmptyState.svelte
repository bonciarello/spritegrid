<script>
  // Nessuna logica — componente puramente presentazionale
</script>

<div class="empty-state">
  <div class="empty-illustration" aria-hidden="true">
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <!-- Griglia vuota stilizzata -->
      <rect x="4" y="4" width="24" height="24" rx="3" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.5" />
      <rect x="32" y="4" width="24" height="24" rx="3" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.5" />
      <rect x="4" y="32" width="24" height="24" rx="3" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.5" />
      <rect x="32" y="32" width="24" height="24" rx="3" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.5" />
      <!-- Freccia -->
      <path d="M28 16 L36 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />
      <path d="M28 44 L36 44" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />
      <path d="M16 28 L16 36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />
      <path d="M44 28 L44 36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />
    </svg>
  </div>

  <h2 class="empty-title">Come funziona</h2>

  <ol class="empty-steps">
    <li>
      <strong>Carica</strong> le tue icone PNG — trascina i file qui sopra o clicca per selezionarli.
      Puoi caricare quante icone vuoi, anche di dimensioni diverse.
    </li>
    <li>
      <strong>Regola</strong> la griglia: scegli il numero di colonne, la spaziatura tra le icone
      e un eventuale padding per distanziarle dai bordi della cella.
    </li>
    <li>
      <strong>Scarica</strong> lo sprite PNG e il foglio CSS. Ogni icona avrà la sua classe
      <code>.icon-0</code>, <code>.icon-1</code>, <code>.icon-2</code>… con le coordinate
      <code>background-position</code> già calcolate.
    </li>
  </ol>

  <div class="empty-tip">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
    <span>Nessun upload sul server: tutto funziona direttamente nel tuo browser.</span>
  </div>
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-4);
    padding: var(--space-4) 0;
  }

  .empty-illustration {
    color: var(--color-text-tertiary);
    margin-bottom: var(--space-2);
  }

  .empty-title {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--color-text);
    letter-spacing: -0.01em;
  }

  .empty-steps {
    list-style: none;
    counter-reset: step;
    text-align: left;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .empty-steps li {
    counter-increment: step;
    display: flex;
    gap: var(--space-3);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: 1.6;
    align-items: flex-start;
  }

  .empty-steps li::before {
    content: counter(step);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    background: var(--color-primary-light);
    color: var(--color-primary);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 600;
    border-radius: 50%;
    margin-top: 1px;
  }

  .empty-steps li strong {
    color: var(--color-text);
    font-weight: 600;
  }

  .empty-steps code {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    background: var(--color-bg);
    padding: 1px 5px;
    border-radius: 3px;
    color: var(--color-primary);
  }

  .empty-tip {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    padding: var(--space-2) var(--space-3);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    max-width: 420px;
  }

  .empty-tip svg {
    flex-shrink: 0;
  }
</style>

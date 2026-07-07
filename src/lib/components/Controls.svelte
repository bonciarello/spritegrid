<script>
  import { columns, spacingX, spacingY, padding } from '../stores.js';

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function handleColumns(e) {
    columns.set(clamp(parseInt(e.target.value) || 1, 1, 20));
  }

  function handleSpacingX(e) {
    spacingX.set(clamp(parseInt(e.target.value) || 0, 0, 200));
  }

  function handleSpacingY(e) {
    spacingY.set(clamp(parseInt(e.target.value) || 0, 0, 200));
  }

  function handlePadding(e) {
    padding.set(clamp(parseInt(e.target.value) || 0, 0, 100));
  }
</script>

<div class="controls-panel">
  <div class="panel-header">
    <h2 class="panel-title">Parametri griglia</h2>
    <button
      class="btn-ghost btn-sm"
      on:click={() => {
        columns.set(4);
        spacingX.set(10);
        spacingY.set(10);
        padding.set(0);
      }}
      aria-label="Ripristina valori predefiniti"
    >
      Predefiniti
    </button>
  </div>

  <div class="controls-grid">
    <!-- Colonne -->
    <div class="control-field">
      <label for="ctrl-cols" class="field-label">
        Colonne
        <span class="field-hint">1–20</span>
      </label>
      <div class="number-input-wrap">
        <input
          id="ctrl-cols"
          type="number"
          min="1"
          max="20"
          value={$columns}
          on:input={handleColumns}
          on:blur={handleColumns}
          class="number-input"
        />
        <div class="stepper">
          <button
            class="stepper-btn"
            on:click={() => columns.update((v) => clamp(v - 1, 1, 20))}
            aria-label="Riduci colonne"
            disabled={$columns <= 1}
          >−</button>
          <button
            class="stepper-btn"
            on:click={() => columns.update((v) => clamp(v + 1, 1, 20))}
            aria-label="Aumenta colonne"
            disabled={$columns >= 20}
          >+</button>
        </div>
      </div>
    </div>

    <!-- Spaziatura orizzontale -->
    <div class="control-field">
      <label for="ctrl-sx" class="field-label">
        Spaziatura O
        <span class="field-hint">px</span>
      </label>
      <div class="number-input-wrap">
        <input
          id="ctrl-sx"
          type="number"
          min="0"
          max="200"
          step="2"
          value={$spacingX}
          on:input={handleSpacingX}
          on:blur={handleSpacingX}
          class="number-input"
        />
        <div class="stepper">
          <button
            class="stepper-btn"
            on:click={() => spacingX.update((v) => clamp(v - 2, 0, 200))}
            aria-label="Riduci spaziatura orizzontale"
            disabled={$spacingX <= 0}
          >−</button>
          <button
            class="stepper-btn"
            on:click={() => spacingX.update((v) => clamp(v + 2, 0, 200))}
            aria-label="Aumenta spaziatura orizzontale"
            disabled={$spacingX >= 200}
          >+</button>
        </div>
      </div>
    </div>

    <!-- Spaziatura verticale -->
    <div class="control-field">
      <label for="ctrl-sy" class="field-label">
        Spaziatura V
        <span class="field-hint">px</span>
      </label>
      <div class="number-input-wrap">
        <input
          id="ctrl-sy"
          type="number"
          min="0"
          max="200"
          step="2"
          value={$spacingY}
          on:input={handleSpacingY}
          on:blur={handleSpacingY}
          class="number-input"
        />
        <div class="stepper">
          <button
            class="stepper-btn"
            on:click={() => spacingY.update((v) => clamp(v - 2, 0, 200))}
            aria-label="Riduci spaziatura verticale"
            disabled={$spacingY <= 0}
          >−</button>
          <button
            class="stepper-btn"
            on:click={() => spacingY.update((v) => clamp(v + 2, 0, 200))}
            aria-label="Aumenta spaziatura verticale"
            disabled={$spacingY >= 200}
          >+</button>
        </div>
      </div>
    </div>

    <!-- Padding -->
    <div class="control-field">
      <label for="ctrl-pad" class="field-label">
        Padding icona
        <span class="field-hint">px</span>
      </label>
      <div class="number-input-wrap">
        <input
          id="ctrl-pad"
          type="number"
          min="0"
          max="100"
          value={$padding}
          on:input={handlePadding}
          on:blur={handlePadding}
          class="number-input"
        />
        <div class="stepper">
          <button
            class="stepper-btn"
            on:click={() => padding.update((v) => clamp(v - 1, 0, 100))}
            aria-label="Riduci padding"
            disabled={$padding <= 0}
          >−</button>
          <button
            class="stepper-btn"
            on:click={() => padding.update((v) => clamp(v + 1, 0, 100))}
            aria-label="Aumenta padding"
            disabled={$padding >= 100}
          >+</button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .controls-panel {
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

  .controls-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
    padding: var(--space-3);
  }

  /* Campo di controllo */
  .control-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .field-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text);
    letter-spacing: 0.01em;
  }

  .field-hint {
    font-family: var(--font-mono);
    font-size: 0.625rem;
    font-weight: 400;
    color: var(--color-text-tertiary);
  }

  .number-input-wrap {
    display: flex;
    align-items: stretch;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--color-surface);
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .number-input-wrap:focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.12);
  }

  .number-input {
    flex: 1;
    min-width: 0;
    border: none;
    padding: var(--space-2) var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text);
    background: transparent;
    outline: none;
    text-align: center;
    -moz-appearance: textfield;
  }

  .number-input::-webkit-inner-spin-button,
  .number-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .stepper {
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--color-border);
  }

  .stepper-btn {
    flex: 1;
    width: 26px;
    min-height: 20px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--duration-fast) var(--ease-out);
    line-height: 1;
  }

  .stepper-btn:hover:not(:disabled) {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }

  .stepper-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .stepper-btn:first-child {
    border-bottom: 1px solid var(--color-border);
  }

  /* Ghost button (shared) */
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

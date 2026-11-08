<script setup lang="ts">
import { DONATION_CONFIG } from '~~/app/data/donation';

const config = DONATION_CONFIG;
</script>

<template>
  <div class="donation-card">
    <!-- Bloco 1: Espaço para o QRCode -->
    <div class="qrcode-section">
      <img
        :src="config.qrCodeImage"
        alt="QR Code Pix para doação"
        class="qrcode-image"
        loading="eager"
      >
      <p class="qrcode-caption">
        Aponte a câmera do aplicativo do seu banco para o QR Code
      </p>
    </div>

    <!-- Divisor visual -->
    <div class="donation-divider" role="separator" aria-orientation="horizontal" />

    <!-- Bloco 2: Espaço para a Chave por Extenso -->
    <div class="key-section">
      <div class="key-header">
        <span class="key-badge">Chave Pix</span>
        <span class="key-recipient">Destinatário: <strong>{{ config.recipientName }}</strong></span>
      </div>

      <div class="key-box-container">
        <div class="key-box" title="Chave Pix por extenso">
          <code>{{ config.pixKey }}</code>
        </div>
        <button
          type="button"
          class="copy-btn primary"
          data-copy-value="contato@heleno.dev"
          data-copy-success="Chave copiada!"
          aria-label="Copiar chave Pix por extenso"
        >
          <IconsCopy class="btn-icon icon-copy" />
          <IconsCheck class="btn-icon icon-check" />
          <span class="btn-label">Copiar Chave</span>
        </button>
      </div>

      <!-- Opção secundária: Copia e Cola completo -->
      <div class="copia-cola-container">
        <button
          type="button"
          class="copy-btn-text"
          :data-copy-value="config.pixCopiaECola"
          data-copy-success="Código Pix copiado!"
          aria-label="Copiar código Pix Copia e Cola completo"
        >
          <IconsLink class="btn-icon-subtle" />
          <span class="btn-label">Copiar código Pix Copia e Cola completo</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.donation-card {
  width: 100%;
  max-width: 640px;
  background-color: var(--color-background-elevated);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2.25rem 2rem;
  box-shadow: 0 8px 30px var(--color-shadow);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  margin: 2rem auto;
}

/* Seção do QRCode */
.qrcode-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.qrcode-image {
  width: 100%;
  max-width: 280px;
  height: auto;
  aspect-ratio: 1 / 1;
  display: block;
  border-radius: 8px;
  image-rendering: pixelated;
}

.qrcode-caption {
  margin-top: 1rem !important;
  font-family: var(--font-sans) !important;
  font-size: 0.95rem !important;
  line-height: 1.45 !important;
  color: var(--color-text-secondary) !important;
  max-width: 380px;
}

/* Divisor sutil */
.donation-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 1.75rem 0;
  width: 100%;
}

/* Seção da Chave por Extenso */
.key-section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.key-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-family: var(--font-sans);
}

.key-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  background-color: var(--color-background-hover);
  color: var(--color-primary);
  border: 1px solid var(--color-border);
}

.key-recipient {
  color: var(--color-text-secondary);
}

.key-recipient strong {
  color: var(--color-text-heading);
}

.key-box-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.key-box {
  flex: 1;
  min-width: 220px;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  overflow-x: auto;
}

.key-box code {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-text-heading);
  letter-spacing: -0.01em;
  user-select: all;
  white-space: nowrap;
}

/* Botão principal de cópia */
.copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--color-primary-button-border);
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.copy-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.copy-btn:active {
  transform: translateY(0);
}

.copy-btn .btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.copy-btn .icon-check {
  display: none;
}

/* Estado quando copiado */
.copy-btn.is-copied {
  background-color: #10b981 !important;
  border-color: #10b981 !important;
  color: #ffffff !important;
}

.copy-btn.is-copied .icon-copy {
  display: none;
}

.copy-btn.is-copied .icon-check {
  display: inline-block;
}

/* Botão secundário de Copia e Cola */
.copia-cola-container {
  margin-top: 0.25rem;
}

.copy-btn-text {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: transparent;
  border: none;
  padding: 0.35rem 0;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s ease;
}

.copy-btn-text:hover {
  color: var(--color-primary);
}

.copy-btn-text .btn-icon-subtle {
  width: 15px;
  height: 15px;
}

.copy-btn-text.is-copied {
  color: #10b981 !important;
  text-decoration: none;
}

@media (max-width: 540px) {
  .donation-card {
    padding: 1.5rem 1.25rem;
  }

  .key-box-container {
    flex-direction: column;
    align-items: stretch;
  }

  .key-box {
    width: 100%;
  }

  .copy-btn {
    width: 100%;
  }

  .qrcode-image {
    max-width: min(260px, 75vw);
  }
}
</style>

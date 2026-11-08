/**
 * apoiar.js — Script isolado para a página de doações (/apoiar).
 * Gerencia a cópia da chave Pix e do código Copia e Cola para a área de transferência
 * com feedback visual acessível sem poluir o runtime global.
 */
(() => {
  'use strict';

  const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback para navegadores legados ou contextos sem navigator.clipboard
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      if (document.exec('copy')) {
        resolve();
      } else {
        reject(new Error('Falha ao executar cópia via comando.'));
      }
      textArea.remove();
    });
  };

  const showCopyFeedback = (button, successMessage = 'Copiado!') => {
    if (!button) return;
    const textSpan = button.querySelector('.btn-label') || button;
    const originalText = textSpan.getAttribute('data-original-text') || textSpan.textContent;
    if (!textSpan.hasAttribute('data-original-text')) {
      textSpan.setAttribute('data-original-text', originalText);
    }

    button.classList.add('is-copied');
    textSpan.textContent = successMessage;

    const currentTimeout = button.getAttribute('data-timeout-id');
    if (currentTimeout) {
      clearTimeout(Number(currentTimeout));
    }

    const timeoutId = setTimeout(() => {
      textSpan.textContent = originalText;
      button.classList.remove('is-copied');
      button.removeAttribute('data-timeout-id');
    }, 2500);

    button.setAttribute('data-timeout-id', String(timeoutId));
  };

  const handleCopyAction = async (target) => {
    const copyButton = target.closest('[data-copy-value]');
    if (!copyButton) return;

    const valueToCopy = copyButton.getAttribute('data-copy-value');
    const successMessage = copyButton.getAttribute('data-copy-success') || 'Copiado!';

    if (!valueToCopy) return;

    try {
      await copyToClipboard(valueToCopy);
      showCopyFeedback(copyButton, successMessage);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  // Event delegation restrito ao documento
  document.addEventListener('click', (event) => {
    handleCopyAction(event.target);
  });

  // Exporta função utilitária global para compatibilidade com handlers inline caso necessário
  window.__copyPix = (value, button, successMsg) => {
    copyToClipboard(value).then(() => {
      showCopyFeedback(button, successMsg);
    }).catch((err) => {
      console.error('Erro ao copiar Pix:', err);
    });
  };
})();

(function() {
  const sharePostContainer = document.querySelector('.share-post');
  if (!sharePostContainer) return;

  const postTitle = sharePostContainer.dataset.postTitle;
  const postUrl = sharePostContainer.dataset.postUrl;

  if (!postTitle || !postUrl) {
    console.error('postTitle or postUrl not found in data attributes of .share-post container.');
    return;
  }

  const encodedPostTitle = encodeURIComponent(postTitle);
  const encodedPostUrl = encodeURIComponent(postUrl);

  document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?text=${encodedPostTitle}&url=${encodedPostUrl}`;
  document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodedPostUrl}`;
  document.getElementById('share-linkedin').href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedPostUrl}&title=${encodedPostTitle}`;
  document.getElementById('share-whatsapp').href = `https://api.whatsapp.com/send?text=${encodedPostTitle}%20${encodedPostUrl}`;

  const copiedMessage = document.getElementById('copied-message');
  const copyButton = document.getElementById('copy-link');

  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(postUrl);
        if (copiedMessage) {
          copiedMessage.style.display = 'block';
          setTimeout(() => {
            copiedMessage.style.display = 'none';
          }, 2000);
        }
      } catch (err) {
        console.error('Falha ao copiar o link: ', err);
        alert('Não foi possível copiar o link. Por favor, copie manualmente: ' + postUrl);
      }
    });
  }
})();
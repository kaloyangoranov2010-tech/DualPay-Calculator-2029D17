// Minimal PWA helper: handles beforeinstallprompt and registers service worker.
// Expects an element with id="installBtn" in the page.
(function () {
  let deferredPrompt = null;
  const installBtn = document.getElementById('installBtn');
  if (installBtn) installBtn.style.display = 'none';

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'inline-block';
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) {
        alert('За да инсталирате: използвайте "Add to Home Screen" в менюто на браузъра.');
        return;
      }
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBtn.style.display = 'none';
      // optionally log outcome
      console.log('User choice:', outcome);
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(() => console.log('Service worker registered.'))
      .catch(err => console.warn('SW register failed:', err));
  }
})();

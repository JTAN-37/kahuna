function handleLogoError(img) {
  if (img.dataset.fallback1) {
    img.src = img.dataset.fallback1;
    img.dataset.fallback1 = '';
  } else if (img.dataset.fallback2) {
    img.src = img.dataset.fallback2;
    img.dataset.fallback2 = '';
  } else {
    img.style.display = 'none';
  }
}

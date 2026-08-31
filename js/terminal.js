function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(element, text, speed = 40) {
  element.textContent = '';
  for (const char of text) {
    element.textContent += char;
    await sleep(speed);
  }
}

async function typeTextInElement(selector, text, speed = 40) {
  const el = document.querySelector(selector);
  if (!el) return;
  await typeText(el, text, speed);
}

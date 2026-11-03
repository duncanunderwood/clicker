import { icon } from './icons.js';
import { PRODUCT_SHARE, SOCIAL_LINKS } from './share-config.js';
import { facebookUrl, hashtagLine, mailtoUrl, whatsappUrl, xUrl } from './share-utils.js';

const status = document.getElementById('share-status');
const fallback = document.getElementById('copy-fallback');

function announce(text) {
  status.textContent = text;
}

const channels = [
  { key: 'native', label: 'Share', icon: 'x_share_native' },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'x_share_whatsapp', href: whatsappUrl(PRODUCT_SHARE) },
  { key: 'email', label: 'Email', icon: 'x_share_email', href: mailtoUrl(PRODUCT_SHARE) },
  { key: 'facebook', label: 'Facebook', icon: 'x_share_facebook', href: facebookUrl(PRODUCT_SHARE) },
  { key: 'x', label: 'X', icon: 'x_share_x', href: xUrl(PRODUCT_SHARE) },
  { key: 'copy', label: 'Copy link', icon: 'x_share_copy_link' },
];

const external = 'target="_blank" rel="noopener noreferrer"';

document.getElementById('share-summary').textContent = PRODUCT_SHARE.shareMessage;
document.getElementById('share-tags').textContent = hashtagLine(PRODUCT_SHARE.hashtags);

document.getElementById('share-buttons').innerHTML = channels
  .map(({ key, label, icon: iconKey, href }) => {
    const inner = `${icon(iconKey)}${label}`;
    // Every control keeps a visible text label, so icon-only controls are avoided.
    return href
      ? `<a class="share-button" href="${href}" data-network="${key}" ${external}>${inner}</a>`
      : `<button type="button" class="share-button" data-network="${key}">${inner}</button>`;
  })
  .join('');

document.getElementById('social-links').innerHTML = SOCIAL_LINKS
  .filter((link) => link.enabled && link.href)
  .map((link) =>
    `<a href="${link.href}" ${external} aria-label="${link.label} (opens in a new tab)" title="${link.label} (opens in a new tab)">${icon(link.icon, 20)}</a>`)
  .join('');

function flashLabel(button, text) {
  const original = button.textContent.trim();
  button.textContent = text;
  setTimeout(() => { button.textContent = original; }, 2000);
}

async function copyLink(button, successMessage = 'Link copied to clipboard') {
  const url = PRODUCT_SHARE.canonicalUrl;
  let copied = false;

  try {
    await navigator.clipboard.writeText(url);
    copied = true;
  } catch {
    // Clipboard API blocked (insecure context or denied permission): offer a selectable link.
    fallback.value = url;
    fallback.hidden = false;
    fallback.select();
    try { copied = document.execCommand('copy'); } catch { copied = false; }
  }

  if (copied) {
    announce(successMessage);
    if (button) flashLabel(button, 'Copied');
    return;
  }
  announce(`Copying failed. The link is shown below, select it and copy manually: ${url}`);
}

async function shareNatively(button) {
  if (!navigator.share) {
    await copyLink(button, 'Sharing is not supported in this browser. Link copied to clipboard');
    return;
  }
  try {
    await navigator.share({
      title: PRODUCT_SHARE.shareTitle,
      text: PRODUCT_SHARE.shareMessage,
      url: PRODUCT_SHARE.canonicalUrl,
    });
    announce('Shared');
  } catch (error) {
    if (error && error.name === 'AbortError') return;
    await copyLink(button, 'Sharing failed. Link copied to clipboard');
  }
}

document.getElementById('share-buttons').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-network]');
  if (!button) return;
  if (button.dataset.network === 'native') shareNatively(button);
  if (button.dataset.network === 'copy') copyLink(button);
});

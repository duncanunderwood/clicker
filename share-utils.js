// Share link builders for the MyEvent Labs share footer. Pure functions only,
// so they are unit tested without a DOM.

export function hashtagLine(hashtags) {
  return hashtags.map((tag) => `#${tag}`).join(' ');
}

/** Message + canonical URL + hashtags, the shape used by WhatsApp and email. */
export function composeShareText({ shareMessage, canonicalUrl, hashtags }) {
  return `${shareMessage.trim()}\n\n${canonicalUrl}\n\n${hashtagLine(hashtags)}`;
}

export function whatsappUrl(config) {
  return `https://wa.me/?text=${encodeURIComponent(composeShareText(config))}`;
}

export function mailtoUrl({ productName, ...config }) {
  const subject = `Take a look at ${productName}`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composeShareText(config))}`;
}

export function facebookUrl({ canonicalUrl }) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`;
}

export function xUrl(config) {
  const { message, hashtags } = fitForX(config);
  const params = new URLSearchParams({
    text: message,
    url: config.canonicalUrl,
    hashtags: hashtags.join(','),
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

// X counts every link as 23 characters regardless of its real length.
const X_LINK_LENGTH = 23;
export const X_LIMIT = 280;

export function xPostLength({ shareMessage, hashtags }) {
  return shareMessage.trim().length + 1 + X_LINK_LENGTH + 1 + hashtagLine(hashtags).length;
}

/**
 * Shortens the hashtag set (never below #MyEventLabs) and then the message so the
 * composed post fits X's limit. Words are never cut midway.
 */
export function fitForX({ shareMessage, hashtags, limit = X_LIMIT }) {
  const tags = [...hashtags];
  let message = shareMessage.trim();
  const fits = (text, list) =>
    text.length + 1 + X_LINK_LENGTH + (list.length ? 1 + hashtagLine(list).length : 0) <= limit;

  while (tags.length > 1 && !fits(message, tags)) tags.pop();
  if (!fits(message, tags)) {
    const overhead = 1 + X_LINK_LENGTH + 1 + hashtagLine(tags).length;
    message = trimToWord(message, limit - overhead);
  }
  return { message, hashtags: tags };
}

function trimToWord(text, room) {
  if (room <= 0) return '';
  if (text.length <= room) return text;
  const cut = text.slice(0, room);
  const lastSpace = cut.lastIndexOf(' ');
  const trimmed = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return trimmed.replace(/[\s,;:.!?-]+$/, '');
}

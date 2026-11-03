import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCT_SHARE, SOCIAL_LINKS } from '../share-config.js';
import {
  X_LIMIT, composeShareText, facebookUrl, hashtagLine, mailtoUrl, whatsappUrl, xPostLength, xUrl,
} from '../share-utils.js';

const config = PRODUCT_SHARE;

test('hashtags: three to four, no spaces or punctuation, always includes MyEventLabs', () => {
  assert.ok(config.hashtags.length >= 3 && config.hashtags.length <= 4, 'expected 3-4 hashtags');
  assert.equal(config.hashtags[0], 'MyEventLabs');
  for (const tag of config.hashtags) {
    assert.match(tag, /^[A-Za-z0-9]+$/, `invalid hashtag: ${tag}`);
  }
});

test('share copy: accurate length, no em dash', () => {
  assert.ok(config.shareMessage.length <= 160, `message is ${config.shareMessage.length} chars`);
  assert.ok(config.shareMessage.length > 40);
  assert.ok(!config.shareMessage.includes('\u2014'), 'em dash not allowed');
});

test('canonical URL is production HTTPS and not localhost', () => {
  const url = new URL(config.canonicalUrl);
  assert.equal(url.protocol, 'https:');
  assert.ok(!/localhost|127\.0\.0\.1/.test(url.hostname));
  assert.equal(config.canonicalUrl, 'https://clicker.myevent.io');
});

test('canonical URL is the deployed clicker host and the embed src is untouched', async () => {
  assert.equal(new URL(config.canonicalUrl).hostname, 'clicker.myevent.io');
  const { readFile } = await import('node:fs/promises');
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(html.includes('https://www.internetclicker.com?code=jka&branding=false&sn=1'), 'embed src changed unexpectedly');
  assert.ok(html.includes('<script type="module" src="./footer.js">'), 'footer script tag missing');
});

test('whatsapp URL carries message, URL and hashtags, URL encoded', () => {
  const href = whatsappUrl(config);
  assert.ok(href.startsWith('https://wa.me/?text='));
  const decoded = decodeURIComponent(href.slice('https://wa.me/?text='.length));
  assert.equal(decoded, composeShareText(config));
  assert.ok(decoded.includes(config.canonicalUrl));
  assert.ok(decoded.includes('#MyEventLabs'));
});

test('mailto URL encodes subject and body', () => {
  const href = mailtoUrl(config);
  const url = new URL(href);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.searchParams.get('subject'), `Take a look at ${config.productName}`);
  const body = url.searchParams.get('body');
  assert.ok(body.includes(config.shareMessage));
  assert.ok(body.includes(config.canonicalUrl));
  assert.ok(body.includes('#MyEventLabs'));
});

test('facebook URL shares the canonical URL only', () => {
  const href = facebookUrl(config);
  const url = new URL(href);
  assert.equal(url.searchParams.get('u'), config.canonicalUrl);
  assert.equal(url.searchParams.getAll('u').length, 1);
});

test('X post fits the limit while keeping MyEventLabs and whole words', () => {
  const href = xUrl(config);
  assert.ok(href.startsWith('https://twitter.com/intent/tweet?'));
  const url = new URL(href);
  const text = url.searchParams.get('text');
  const tags = url.searchParams.get('hashtags').split(',').filter(Boolean);
  assert.equal(url.searchParams.get('url'), config.canonicalUrl);
  assert.ok(tags.includes('MyEventLabs'));
  assert.ok(xPostLength({ shareMessage: text, hashtags: tags }) <= X_LIMIT);
  for (const word of text.split(' ')) {
    assert.ok(config.shareMessage.includes(word), `word cut midway: ${word}`);
  }
});

test('X fallback shortens a long message instead of overflowing', async () => {
  const { fitForX } = await import('../share-utils.js');
  const long = { shareMessage: 'word '.repeat(120).trim(), hashtags: config.hashtags };
  const { message, hashtags } = fitForX(long);
  assert.ok(message.length > 0);
  assert.ok(hashtags.length >= 1);
  assert.ok(xPostLength({ shareMessage: message, hashtags }) <= X_LIMIT);
  assert.ok(!message.endsWith(' '));
});

test('hashtagLine prefixes every tag', () => {
  assert.equal(hashtagLine(['MyEventLabs', 'Clicker']), '#MyEventLabs #Clicker');
});

test('every enabled social link is an absolute HTTPS URL and every icon exists', async () => {
  const { ICONS } = await import('../icons.js');
  const enabled = SOCIAL_LINKS.filter((link) => link.enabled);
  assert.ok(enabled.length >= 8);
  for (const link of enabled) {
    assert.ok(link.href.startsWith('https://'), `${link.label} is not https`);
    assert.ok(ICONS[link.icon], `missing icon for ${link.label}`);
    assert.ok(link.label.trim().length > 0);
  }
});

test('no launch-blocking placeholder copy in the page', async () => {
  const { readFile } = await import('node:fs/promises');
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const word of ['lorem', 'TODO', 'placeholder', 'example.com', 'localhost']) {
    assert.ok(!html.toLowerCase().includes(word.toLowerCase()), `found ${word}`);
  }
  assert.ok(html.includes('Developed by'), 'credit row missing');
  assert.ok(html.includes('href="https://myevent-labs.io"'), 'credit link missing');
  assert.ok(html.includes('PRECISION IN MOTION'), 'tagline missing');
});

// Single source of truth for the share copy and the MyEvent Labs social links.
// URLs verified against the live footer on https://www.myevent-labs.io/shop/file-convert

export const PRODUCT_SHARE = {
  productName: 'Clicker',
  shareTitle: 'Clicker by MyEvent Labs',
  shareMessage:
    'Advance slides from any phone or browser with a simple remote clicker built for live presentations.',
  canonicalUrl: 'https://clicker.myevent.io',
  hashtags: ['MyEventLabs', 'Clicker', 'PresenterTools'],
};

const WEB_URL = 'https://www.myevent-labs.io';
const INSIGHTS_URL = 'https://www.myevent-labs.io/insights';
const RSS_URL = 'https://www.myevent-labs.io/rss.xml';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61594440112583';
const INSTAGRAM_URL = 'https://www.instagram.com/myeventlabs';
const THREADS_URL = 'https://www.threads.com/@myeventlabs';
const X_URL = 'https://x.com/MyEventLabs';
const LINKEDIN_URL = 'https://www.linkedin.com/company/myevent-labs';
const TIKTOK_URL = 'https://www.tiktok.com/@myeventlabs';
const YOUTUBE_URL = 'https://youtube.com/@myevent-labs';

export const SOCIAL_LINKS = [
  { label: 'MyEvent Labs website', href: WEB_URL, icon: 's_web', enabled: Boolean(WEB_URL) },
  { label: 'MyEvent Labs insights', href: INSIGHTS_URL, icon: 's_insights', enabled: Boolean(INSIGHTS_URL) },
  { label: 'MyEvent Labs RSS feed', href: RSS_URL, icon: 's_rss', enabled: Boolean(RSS_URL) },
  { label: 'Facebook', href: FACEBOOK_URL, icon: 's_facebook', enabled: Boolean(FACEBOOK_URL) },
  { label: 'Instagram', href: INSTAGRAM_URL, icon: 's_instagram', enabled: Boolean(INSTAGRAM_URL) },
  { label: 'Threads', href: THREADS_URL, icon: 's_threads', enabled: Boolean(THREADS_URL) },
  { label: 'X', href: X_URL, icon: 's_x', enabled: Boolean(X_URL) },
  { label: 'LinkedIn', href: LINKEDIN_URL, icon: 's_linkedin', enabled: Boolean(LINKEDIN_URL) },
  { label: 'TikTok', href: TIKTOK_URL, icon: 's_tiktok', enabled: Boolean(TIKTOK_URL) },
  { label: 'YouTube', href: YOUTUBE_URL, icon: 's_youtube', enabled: Boolean(YOUTUBE_URL) },
];

function upsertMeta({ name, property, content }) {
  if (typeof document === 'undefined' || !content) return;

  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    if (name) element.setAttribute('name', name);
    if (property) element.setAttribute('property', property);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (typeof document === 'undefined' || !href) return;

  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  if (typeof document === 'undefined' || !data) return;

  let element = document.head.querySelector(`script[data-seo-id="${id}"]`);
  if (!element) {
    element = document.createElement('script');
    element.setAttribute('type', 'application/ld+json');
    element.setAttribute('data-seo-id', id);
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

export function applySeo({
  title,
  description,
  keywords,
  url,
  image,
  robots = 'index, follow',
  author = 'Rajaganesh T',
  structuredData,
}) {
  if (typeof document === 'undefined') return;

  if (title) {
    document.title = title;
  }

  upsertMeta({ name: 'description', content: description });
  upsertMeta({ name: 'keywords', content: keywords });
  upsertMeta({ name: 'author', content: author });
  upsertMeta({ name: 'robots', content: robots });
  upsertMeta({ name: 'googlebot', content: robots });
  upsertMeta({ property: 'og:type', content: 'website' });
  upsertMeta({ property: 'og:site_name', content: 'Rajaganesh T Portfolio' });
  upsertMeta({ property: 'og:locale', content: 'en_IN' });
  upsertMeta({ property: 'og:title', content: title });
  upsertMeta({ property: 'og:description', content: description });
  upsertMeta({ property: 'og:url', content: url });
  upsertMeta({ property: 'og:image', content: image });
  upsertMeta({ property: 'og:image:alt', content: 'Rajaganesh T portfolio profile photo' });
  upsertMeta({ name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' });
  upsertMeta({ name: 'twitter:title', content: title });
  upsertMeta({ name: 'twitter:description', content: description });
  upsertMeta({ name: 'twitter:image', content: image });
  upsertLink('canonical', url);
  upsertJsonLd('portfolio-page', structuredData);
}

export function applyNoIndexSeo({ title, description }) {
  applySeo({
    title,
    description,
    robots: 'noindex, nofollow, noarchive',
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  });
}

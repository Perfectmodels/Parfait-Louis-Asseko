// Short, precise share URLs with server-side OG tags
// Usage examples:
// - /api/s/a/{slug}       -> article
// - /api/s/m/{id}         -> model profile
// - /api/s/al/{albumId}   -> gallery album
// - /api/s/n/{newsId}     -> news item
// - /api/s/fd/{edition}   -> fashion day event
// - /api/s/s/{serviceSlug}-> service detail
// - /api/s/p/{pageSlug}   -> static pages (services, galerie, ...)

export const config = { api: { bodyParser: false } };

const DB_URL = 'https://pmmdb-89a3f-default-rtdb.firebaseio.com';

export default async function handler(req, res) {
  try {
    const { type, id } = req.query || {};
    const host = req.headers['x-forwarded-host'] || req.headers.host || '';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const origin = `${protocol}://${host}`;

    const absolutize = (u) => {
      if (!u) return '';
      try {
        if (u.startsWith('http://') || u.startsWith('https://')) return u;
        return new URL(u, origin).toString();
      } catch {
        return '';
      }
    };

    // Fetch full app data once (DB is public-read per rules)
    const r = await fetch(`${DB_URL}/.json`);
    const data = await r.json();

    let og = {
      title: 'Perfect Models Management',
      description:
        "L'agence de mannequins de référence à Libreville, Gabon. Découvrez nos talents, nos événements mode et notre vision qui redéfinit l'élégance africaine.",
      image: data?.siteConfig?.logo || '/og/default.png',
      url: origin,
      ogType: 'website',
    };

    const safe = (s) => String(s || '');

    if (type === 'a') {
      const art = (data?.articles || []).find((a) => a?.slug === id);
      if (art) {
        og = {
          title: safe(art.title),
          description: safe(art.excerpt),
          image: art.imageUrl,
          url: `${origin}/magazine/${art.slug}`,
          ogType: 'article',
        };
      }
    } else if (type === 'm') {
      const m = (data?.models || []).find((mm) => mm?.id === id);
      if (m) {
        og = {
          title: safe(m.name),
          description: `Découvrez le portfolio de ${m.name}, mannequin chez Perfect Models Management.`,
          image: m.imageUrl,
          url: `${origin}/mannequins/${m.id}`,
          ogType: 'profile',
        };
      }
    } else if (type === 'al') {
      const al = (data?.galleryAlbums || []).find((a) => a?.id === id);
      if (al) {
        const cover = al.coverUrl || (al.images || [])[0] || data?.siteImages?.fashionDayBg || '';
        og = {
          title: safe(al.title),
          description: safe(al.description || `Découvrez l'album ${al.title}`),
          image: cover,
          url: `${origin}/galerie`,
          ogType: 'website',
        };
      }
    } else if (type === 'n') {
      const n = (data?.newsItems || []).find((nn) => nn?.id === id);
      if (n) {
        og = {
          title: safe(n.title),
          description: safe(n.excerpt),
          image: n.imageUrl,
          url: n.link ? `${origin}${n.link}` : origin,
          ogType: 'website',
        };
      }
    } else if (type === 'fd') {
      const ed = (data?.fashionDayEvents || []).find((e) => String(e?.edition) === String(id));
      if (ed) {
        const img = (ed.stylists?.[0]?.images?.[0]) || data?.siteImages?.fashionDayBg || '';
        og = {
          title: `Perfect Fashion Day – Édition ${safe(ed.edition)}`,
          description: safe(ed.theme || 'Événement mode de référence.'),
          image: img,
          url: `${origin}/fashion-day`,
          ogType: 'event',
        };
      }
    } else if (type === 's') {
      const svc = (data?.agencyServices || []).find((s) => s?.slug === id);
      if (svc) {
        og = {
          title: safe(svc.title),
          description: safe(svc.description),
          image: data?.siteImages?.about || '',
          url: `${origin}/services/${svc.slug}`,
          ogType: 'website',
        };
      }
    } else if (type === 'p') {
      const page = String(id || '').toLowerCase();
      if (page === 'services') {
        og = {
          title: 'Nos Services | Perfect Models Management',
          description: 'Découvrez nos prestations sur mesure et réservez directement.',
          image: data?.siteImages?.about || '',
          url: `${origin}/services`,
          ogType: 'website',
        };
      } else if (page === 'galerie') {
        const a = (data?.galleryAlbums || [])[0];
        const img = a?.coverUrl || (a?.images || [])[0] || data?.siteImages?.fashionDayBg || '';
        og = {
          title: 'Galerie Photos | Perfect Models Management',
          description: 'Découvrez nos albums photos d\'événements, shootings et collaborations.',
          image: img,
          url: `${origin}/galerie`,
          ogType: 'website',
        };
      }
    }

    const safeTitle = og.title.slice(0, 140);
    const safeDesc = og.description.slice(0, 300);
    const safeImage = absolutize(og.image);
    const targetUrl = absolutize(og.url) || origin;

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="robots" content="noindex, nofollow"/>
  <title>${safeTitle}</title>
  <link rel="canonical" href="${targetUrl}" />

  <meta property="og:site_name" content="Perfect Models Management"/>
  <meta property="og:title" content="${safeTitle}"/>
  <meta property="og:description" content="${safeDesc}"/>
  <meta property="og:image" content="${safeImage}"/>
  <meta property="og:type" content="${og.ogType}"/>
  <meta property="og:url" content="${targetUrl}"/>

  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${safeTitle}"/>
  <meta name="twitter:description" content="${safeDesc}"/>
  <meta name="twitter:image" content="${safeImage}"/>

  <meta http-equiv="refresh" content="0; url=${targetUrl}"/>
  <style>body{background:#0b0b0b;color:#f6f6f6;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;padding:24px}a{color:#D4AF37}</style>
</head>
<body>
  <p>Redirection vers <a href="${targetUrl}">${targetUrl}</a>…</p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (e) {
    return res.status(500).json({ error: 'short-share-error', details: String(e) });
  }
}

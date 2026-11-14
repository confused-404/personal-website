#!/usr/bin/env python3
"""Run before publishing: python3 scripts/version_assets.py.

Give local CSS, JavaScript, and image references a content-based cache version.
Page URLs stay stable, including the project stop query parameters.
"""
from hashlib import sha256
from pathlib import Path
import re
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parent.parent
ASSET_TYPES = {'.css', '.js', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.ico'}
REFERENCE = re.compile(r'(?P<prefix>\b(?:src|href)=[\"\x27])(?P<url>[^\"\x27]+)(?P<quote>[\"\x27])')


def version_page(page):
    def replace(match):
        url = urlsplit(match['url'])
        if url.scheme or url.netloc or not url.path:
            return match[0]
        asset = (ROOT / url.path.lstrip('/') if url.path.startswith('/')
                 else page.parent / url.path).resolve()
        if not asset.is_relative_to(ROOT) or asset.suffix.lower() not in ASSET_TYPES:
            return match[0]
        version = sha256(asset.read_bytes()).hexdigest()[:12]
        query = [(key, value) for key, value in parse_qsl(url.query) if key != 'v']
        query.append(('v', version))
        updated = urlunsplit(url._replace(query=urlencode(query)))
        return match['prefix'] + updated + match['quote']

    original = page.read_text()
    updated = REFERENCE.sub(replace, original)
    if updated != original:
        page.write_text(updated)
        print(page.relative_to(ROOT))


if __name__ == '__main__':
    for page in [ROOT / 'index.html', *sorted((ROOT / 'runs').glob('*.html'))]:
        version_page(page)

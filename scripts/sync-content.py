#!/usr/bin/env python3
"""Generate discovery files from canonical HTML metadata; validate local links.
Run from any directory. --check validates without writing files.
"""
import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
from xml.sax.saxutils import escape
ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://huongquynhgroupvn.com/'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.title = ''; self.in_title = False; self.meta = {}; self.canonical = None
        self.ids = set(); self.refs = []; self.feed(text)
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == 'title': self.in_title = True
        if 'id' in d: self.ids.add(d['id'])
        if tag == 'meta': self.meta[d.get('name', d.get('property'))] = d.get('content', '')
        if tag == 'link' and d.get('rel') == 'canonical': self.canonical = d.get('href')
        if tag in ('a', 'link', 'script', 'img', 'form'):
            for key in ('href', 'src', 'action'):
                if d.get(key): self.refs.append(d[key])
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
    def handle_data(self, text):
        if self.in_title: self.title += text


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    pages = {p.name: Page(p.read_text(encoding='utf-8-sig')) for p in ROOT.glob('*.html') if p.name != 'popup.html'}
    entries = []; urls = []
    for name, page in sorted(pages.items(), key=lambda pair: (pair[0] != 'index.html', pair[0])):
        expected = ORIGIN + ('' if name == 'index.html' else name)
        assert page.canonical == expected, f'{name}: canonical mismatch'
        for ref in page.refs:
            u = urlsplit(ref)
            if u.scheme and u.scheme not in ('http', 'https'): continue
            if u.netloc and u.netloc != 'huongquynhgroupvn.com': continue
            target = unquote(u.path).lstrip('/') or (name if not u.netloc else 'index.html')
            assert (ROOT / target).is_file(), f'{name}: missing file {ref}'
            if u.fragment and target in pages:
                assert unquote(u.fragment) in pages[target].ids, f'{name}: missing anchor {ref}'
        if 'noindex' in page.meta.get('robots', ''): continue
        assert page.title and page.meta.get('description'), f'{name}: missing metadata'
        entries.append({'file': name, 'title': page.meta.get('og:title', page.title).strip(), 'description': page.meta['description']})
        urls.append(expected)
    outputs = {
        'js/search-index.js': 'window.HQ_SEARCH_INDEX = ' + json.dumps(entries, ensure_ascii=False, indent=2) + ';\n',
        'sitemap.xml': '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>{escape(url)}</loc></url>\n' for url in urls) + '</urlset>\n'
    }
    for name, content in outputs.items():
        path = ROOT / name
        if args.check: assert path.read_text(encoding='utf-8') == content, f'{name}: run scripts/sync-content.py to synchronize'
        else: path.write_text(content, encoding='utf-8')
    print(f'PASS: {len(pages)} pages, local links/assets/anchors and canonical URLs; {len(entries)} searchable/sitemap entries')

if __name__ == '__main__': main()

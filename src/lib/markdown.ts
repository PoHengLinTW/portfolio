import { Marked, type Tokens } from 'marked'

export interface TocEntry {
  id: string
  text: string
  depth: number
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Drops HTML comments (used for drafting notes in the admin editor), then drops any heading
 * whose section ended up empty, so a half-written case study never shows a bare heading.
 */
export function stripEmptySections(md: string): string {
  const lines = md.replace(/<!--[\s\S]*?-->/g, '').split('\n')
  // Lines inside fenced code blocks are never headings (think `# install` in a shell snippet).
  let inFence = false
  const fenced = lines.map(line => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      return true
    }
    return inFence
  })
  const headingDepth = (i: number) =>
    fenced[i] ? 0 : (/^(#{1,6})\s/.exec(lines[i])?.[1].length ?? 0)

  const keep = lines.map(() => true)
  for (let i = 0; i < lines.length; i++) {
    const depth = headingDepth(i)
    if (!depth) continue
    // A section has content if a non-blank, non-heading line (or a deeper kept heading) appears
    // before the next heading of the same or higher level.
    let hasContent = false
    for (let j = i + 1; j < lines.length; j++) {
      const d = headingDepth(j)
      if (d && d <= depth) break
      if (!d && lines[j].trim()) {
        hasContent = true
        break
      }
    }
    if (!hasContent) keep[i] = false
  }
  return lines
    .filter((_, i) => keep[i])
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const VIDEO_SRC = /\.(mp4|webm)(?:[?#]|$)/i

/**
 * `![alt](src)` as an <img>, or, for .mp4/.webm, a muted looping <video> that behaves like a GIF
 * (a fraction of the size). Use video for screen recordings rather than large GIFs.
 */
function renderMedia({ href, text }: Tokens.Image): string {
  const src = escapeAttr(href)
  const alt = escapeAttr(text)
  if (VIDEO_SRC.test(href)) {
    return `<video src="${src}" autoplay loop muted playsinline preload="metadata"${alt ? ` aria-label="${alt}"` : ''}></video>`
  }
  return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`
}

/** Renders trusted (admin-authored) Markdown to HTML, with ids on headings and a table of contents. */
export function renderMarkdown(md: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = []
  const seen = new Map<string, number>()
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading(this: { parser: { parseInline(t: Tokens.Generic[]): string } }, token: Tokens.Heading) {
        const text = token.text
        let id = slugify(text) || 'section'
        const n = seen.get(id) ?? 0
        seen.set(id, n + 1)
        if (n) id = `${id}-${n}`
        toc.push({ id, text, depth: token.depth })
        return `<h${token.depth} id="${id}">${this.parser.parseInline(token.tokens)}</h${token.depth}>\n`
      },
      link(this: { parser: { parseInline(t: Tokens.Generic[]): string } }, { href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens)
        const external = /^https?:\/\//.test(href)
        const attrs = external ? ' target="_blank" rel="noreferrer"' : ''
        const t = title ? ` title="${title}"` : ''
        return `<a href="${href}"${t}${attrs}>${text}</a>`
      },
      image(token: Tokens.Image) {
        return renderMedia(token)
      },
      // An image alone in its paragraph becomes a block-level <figure>; its title is the caption:
      // ![Alt text](/media/uploads/abc.webp "Caption shown under the image")
      paragraph(this: { parser: { parseInline(t: Tokens.Generic[]): string } }, token: Tokens.Paragraph) {
        const only = token.tokens.filter(t => !(t.type === 'text' && !t.raw.trim()))
        if (only.length === 1 && only[0].type === 'image') {
          const img = only[0] as Tokens.Image
          const caption = img.title ? `<figcaption>${escapeAttr(img.title)}</figcaption>` : ''
          return `<figure>${renderMedia(img)}${caption}</figure>\n`
        }
        return `<p>${this.parser.parseInline(token.tokens)}</p>\n`
      }
    }
  })
  const html = marked.parse(stripEmptySections(md), { async: false })
  return { html, toc }
}

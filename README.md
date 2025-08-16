# one-blog

PS: Link to [Initial discussion with ChatGPT](https://chatgpt.com/share/68a0cf97-c584-8004-bfcc-b6c16b0ac910). Just building something for fun!

## v0 after ChatGPT Discussion

### Refined Vision

I am building a **minimalist, client-first writing tool** for personal + public writing.

* **Audience (starting point):** myself (personal + technical writing).
* **Key differentiator:** Obsidian-like simplicity, but **AI-native**, with first-class support for **markdown + drawings (Excalidraw)**.
* **End goal:** Portable writing that can be exported to **blog posts, LinkedIn, GitHub Pages**, etc.

---

### Core Problems to Solve

1. Writing in markdown with **grammar + sentence correction** (inline + AI sidebar review).
2. Quick drawings with **Excalidraw integration** inside markdown.
3. **Syncing + portability** → markdown + drawings should live in Google Drive or GitHub repo.
4. **Export-ready content** → easy to push out to blogs or social media.

---

### Technical Foundation

* **Platform:** Web app (maybe also with PWA support for offline).
* **File format:** Plain `.md` + `.excalidraw` (same as Excalidraw’s format).
* **Storage + sync:**
  * **MVP:**
    * Google Drive API for sync.
    * GitHub sync (commit/push markdown + drawings).
  * **Later:** Local-first (IndexedDB) + sync engines like [isomorphic-git](https://isomorphic-git.org/) or \[Google Drive Realtime API].

---

### AI Integration

* **Inline support:** grammar fixes, sentence rewriting (like Grammarly, but local to markdown).
* **Sidebar chat:** holistic review, tone checks, suggestions.
* **Models:**
  * User-provided API key (OpenAI, Anthropic, maybe local via LM Studio API).
  * Defaults → templates (summarize, rewrite, blogify).
  * Custom prompt templates per project.

---

### UX & Differentiation

* **Minimalist UI** (iA Writer x Obsidian hybrid).
* **Excalidraw block support** → `/draw` in markdown inserts a canvas.
* **Single-player first** (collab later).
* **Export flows:**
  * To personal blog (Markdown → Hugo/Jekyll/Next.js MDX).
  * To LinkedIn (generate shorter post with AI from longer article).

---

### MVP Roadmap

1. **MVP Editor**
   * Markdown editor (ProseMirror, TipTap, or CodeMirror 6).
   * Inline AI grammar correction.
   * Sidebar AI review.
   * Excalidraw block support.

2. **Sync (Phase 1)**
   * Google Drive integration.
   * GitHub repo sync (push/pull markdown + excalidraw).

3. **Export (Phase 1)**
   * Export to Markdown files.
   * Generate blog-ready content.

4. **AI Enhancements (Phase 2)**
   * Custom prompt templates.
   * Multiple model support.

5. **Offline-first (Phase 3)**
   * Local cache with IndexedDB.
   * Sync conflict resolution.

---

At this point, I have **two big “unknowns” to decide early**:

1. **Editor engine** → CodeMirror 6 (flexible, markdown-native) vs TipTap (rich text + markdown extension).
2. **Sync approach** →
   * Do you want **real-time sync** with Google Drive,
   * Or **manual sync (push/pull)** like Obsidian Git plugin?


# Lagezentrum posts

One analysis is two Markdown files with the **same file name**: one in `de/`,
one in `en/`. The file name becomes the address — `2026-09-ostflanke.md` is
`/lagezentrum/2026-09-ostflanke/` and `/en/lagezentrum/2026-09-ostflanke/`.
The build stops if either twin is missing.

```md
---
title: Titel der Analyse
teaser: Zwei, drei Sätze. Stehen in der Übersicht, unter dem Titel und in Suchergebnissen.
date: 2026-09-14
stand: 2026-09-20          # optional, wenn die Analyse später nachgezogen wurde
author: Viktor Fink        # muss zu einem Namen in `people` passen
image: ../../../assets/karte-ostflanke.webp   # optional
imageAlt: Was auf dem Bild zu sehen ist        # Pflicht, wenn image gesetzt
imageCaption: Bildunterschrift                  # optional
---

Einleitung …

## Zwischenüberschrift

Text …

> Ein Satz, der als hervorgehobenes Zitat groß im Text steht.
```

Images go into `src/assets/`. Everything else is ordinary Markdown: `##` and
`###` headings, lists, links, `>` for a pull quote.

Placeholder posts carry `placeholder: true`. They show on localhost and never
in a production build — delete them once the real ones are in.

/**
 * Content collections. One so far: the Lagezentrum's posts, as Markdown in
 * src/content/lagezentrum/de/ and …/en/. A post is the same file name in both
 * folders — see src/content/lagezentrum.ts for how they are read, and
 * src/content/lagezentrum/README.md for how to write one.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lagezentrum = defineCollection({
  loader: glob({ pattern: '{de,en}/*.md', base: './src/content/lagezentrum' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        /** Two or three sentences: on the overview, under the title, and as the page description. */
        teaser: z.string(),
        date: z.coerce.date(),
        /** The date the analysis reflects, if it has been brought up to date since. Defaults to `date`. */
        stand: z.coerce.date().optional(),
        /** Must match a name in `people` (src/content/copy.ts) for the author box. */
        author: z.string().default('Viktor Fink'),
        image: image().optional(),
        imageAlt: z.string().optional(),
        imageCaption: z.string().optional(),
        /** Shown on localhost only, never in a production build. */
        placeholder: z.boolean().default(false),
      })
      .refine((post) => !post.image || post.imageAlt, {
        message: 'A post with an image needs imageAlt.',
        path: ['imageAlt'],
      }),
});

export const collections = { lagezentrum };

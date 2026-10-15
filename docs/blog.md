# Blog

The blog is self-hosted. Each post is one Markdown file in
`src/content/posts/`, read at build time by `src/lib/blog/posts.ts` and
rendered to HTML by `src/lib/blog/markdown.ts`. There is no CMS and no
network call: adding a post is adding a file.

## Adding a post

1. Create `src/content/posts/<slug>.md`. The file name is the slug and the
   URL: `/blog/<slug>`. Use lower-case letters, digits and hyphens only.
2. Put images in `public/images/blog/<slug>/` and reference them from the
   post as `/images/blog/<slug>/<file>`.
3. Start the file with front matter:

   ```md
   ---
   title: "Cleanup Is the Reason You Don’t Cook"
   date: "2026-03-31T12:46:01.000Z"
   updated: "2026-04-15T09:00:00.000Z"
   excerpt: "One or two sentences shown in the list."
   lead: "An optional subtitle shown under the title."
   image: "/images/blog/cleanup-is-the-reason-you-dont-cook/01.jpeg"
   tags: ["food", "habits"]
   medium: "https://easyplantlife.medium.com/..."
   ---
   ```

   | Field     | Required | Notes                                                       |
   | --------- | -------- | ----------------------------------------------------------- |
   | `title`   | yes      | Rendered as the h1 and in the list.                         |
   | `date`    | yes      | ISO 8601. Posts are listed newest first.                    |
   | `updated` | no       | ISO 8601. Set it after a real revision; shown as "Updated". |
   | `excerpt` | no       | Meta description and list text. Aim for 120–160 characters. |
   | `lead`    | no       | One line under the title.                                   |
   | `image`   | no       | Thumbnail on `/blog`, social previews and structured data.  |
   | `tags`    | no       | Keywords, `article:tag`, and related-post matching.         |
   | `medium`  | no       | Original URL when the piece was first published on Medium.  |

4. Write the body in CommonMark. House rules:
   - `##` for section headings (the title is the h1).
   - An image on the very first line of the body is the cover: it is shown
     full width above the text instead of inside it. Point `image` at the
     same file so social previews match.
   - An image on its own line becomes a `<figure>`. Its title becomes the
     caption: `![alt text](/images/blog/<slug>/02.jpeg "Caption")`.
   - End a line with `\` for a hard line break inside a paragraph.
5. Run `npm run dev` and open `/blog/<slug>`.

A post without a title or a valid date fails the build on purpose, so a
broken file never silently disappears from the list.

## Where the posts show up

- `/blog` lists every post, newest first.
- `/blog/<slug>` renders the post with BlogPosting structured data.
- The home page shows the three newest posts.
- `/sitemap.xml` includes every post with its last revision date and cover.
- `/blog/feed.xml` is an RSS feed with the full text of every post.
- Under each post, "Keep reading" links the three posts sharing the most
  tags (newest first on ties).

## SEO

Every post gets, without extra work:

- A canonical URL, `Title | Easy Plant Life` as its title, and the excerpt
  as its meta description.
- Open Graph article tags (published and modified time, tags, cover with
  its alt text) and a large Twitter card. Posts without an `image` fall
  back to the brand banner.
- BlogPosting and BreadcrumbList structured data. `/blog` adds a Blog
  node listing every post.
- An `id` on every heading, so `/blog/<slug>#<heading>` links to a section.

What still depends on the author:

- **Excerpt.** It is the search snippet. Say plainly what the piece is
  about, with the words a reader would search for.
- **Tags.** Reuse existing tags so related posts connect. Spelling and
  case do not matter (`Meal Prep` = `meal-prep`), but synonyms do
  (`vegan` ≠ `veganism`).
- **Alt text.** Describe what the image shows.

## Reading time

Estimated at 200 words per minute from the Markdown body, never less than
one minute.

## History

The first five posts were published on Medium (`@easyplantlife`) between
February and March 2026 and copied here from the Medium RSS feed, images
included. Their `medium` field points back to the original.

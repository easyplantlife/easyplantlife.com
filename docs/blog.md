| `image` | no | Used for social previews and structured data (see below). |# Blog

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
   excerpt: "One or two sentences shown in the list."
   lead: "An optional subtitle shown under the title."
   image: "/images/blog/cleanup-is-the-reason-you-dont-cook/01.jpeg"
   tags: ["food", "habits"]
   medium: "https://easyplantlife.medium.com/..."
   ---
   ```

   | Field     | Required | Notes                                                      |
   | --------- | -------- | ---------------------------------------------------------- |
   | `title`   | yes      | Rendered as the h1 and in the list.                        |
   | `date`    | yes      | ISO 8601. Posts are listed newest first.                   |
   | `excerpt` | no       | Falls back to the first paragraph of the body.             |
   | `lead`    | no       | One line under the title.                                  |
   | `image`   | no       | Cover image, used for social previews and structured data. |
   | `tags`    | no       | Kept for later; not rendered yet.                          |
   | `medium`  | no       | Original URL when the piece was first published on Medium. |

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
- `/sitemap.xml` includes every post with its publication date.

## Reading time

Estimated at 200 words per minute from the Markdown body, never less than
one minute.

## History

The first five posts were published on Medium (`@easyplantlife`) between
February and March 2026 and copied here from the Medium RSS feed, images
included. Their `medium` field points back to the original.

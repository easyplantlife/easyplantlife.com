import { renderMarkdown } from "@/lib/blog/markdown";

describe("renderMarkdown", () => {
  it("renders headings, paragraphs and emphasis", () => {
    const html = renderMarkdown("## Title\n\nSome *soft* and **strong** text.");
    expect(html).toContain("<h2>Title</h2>");
    expect(html).toContain(
      "<p>Some <em>soft</em> and <strong>strong</strong> text.</p>"
    );
  });

  it("turns a lone image into a figure instead of a paragraph", () => {
    const html = renderMarkdown("![A sink](/images/blog/post/01.jpeg)");
    expect(html).toBe(
      '<figure><img src="/images/blog/post/01.jpeg" alt="A sink" loading="lazy" decoding="async"></figure>\n'
    );
    expect(html).not.toContain("<p>");
  });

  it("uses the image title as the caption", () => {
    const html = renderMarkdown('![A sink](/img.jpeg "One pot. One exit.")');
    expect(html).toContain("<figcaption>One pot. One exit.</figcaption>");
  });

  it("escapes alt text and captions", () => {
    const html = renderMarkdown('![a <b> & "c"](/img.jpeg "x < y")');
    expect(html).toContain('alt="a &lt;b&gt; &amp; &quot;c&quot;"');
    expect(html).toContain("<figcaption>x &lt; y</figcaption>");
  });

  it("keeps a backslash at the end of a line as a hard break", () => {
    const html = renderMarkdown("One.\\\nTwo.");
    expect(html).toBe("<p>One.<br>Two.</p>\n");
  });

  it("renders lists and links", () => {
    const html = renderMarkdown("- one\n- [two](/books)\n");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>one</li>");
    expect(html).toContain('<li><a href="/books">two</a></li>');
  });

  it("renders block quotes", () => {
    expect(renderMarkdown("> Quiet.")).toContain(
      "<blockquote>\n<p>Quiet.</p>\n</blockquote>"
    );
  });

  it("returns an empty string for empty input", () => {
    expect(renderMarkdown("")).toBe("");
  });
});

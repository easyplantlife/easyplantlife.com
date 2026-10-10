import { renderMarkdown, splitLeadImage } from "@/lib/blog/markdown";

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

describe("splitLeadImage", () => {
  it("lifts an image that opens the body out as the cover", () => {
    const { cover, body } = splitLeadImage(
      '![A sink](/images/blog/post/01.jpeg "Soft light.")\n\nFirst paragraph.'
    );
    expect(cover).toEqual({
      src: "/images/blog/post/01.jpeg",
      alt: "A sink",
      caption: "Soft light.",
    });
    expect(body).toBe("First paragraph.");
  });

  it("leaves the caption out when the image has no title", () => {
    const { cover } = splitLeadImage("![A sink](/img.jpeg)\n\nText.");
    expect(cover).toEqual({ src: "/img.jpeg", alt: "A sink" });
    expect(cover).not.toHaveProperty("caption");
  });

  it("keeps the body whole when it does not open with an image", () => {
    const markdown = "First paragraph.\n\n![A sink](/img.jpeg)";
    expect(splitLeadImage(markdown)).toEqual({ body: markdown });
  });

  it("does not take an image that shares its paragraph with text", () => {
    const markdown = "![A sink](/img.jpeg) and some words.";
    expect(splitLeadImage(markdown)).toEqual({ body: markdown });
  });

  it("handles an empty body", () => {
    expect(splitLeadImage("")).toEqual({ body: "" });
  });
});

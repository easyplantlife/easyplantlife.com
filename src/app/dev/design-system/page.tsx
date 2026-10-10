"use client";

import { useState } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Link } from "@/components/ui/Link";
import { Panel } from "@/components/ui/Panel";
import { StatusNote } from "@/components/ui/StatusNote";
import { Text } from "@/components/ui/Text";
import { Textarea } from "@/components/ui/Textarea";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {label && (
        <Text size="sm" color="secondary" className="mb-1">
          {label}
        </Text>
      )}
      <div className="relative rounded-md border border-line bg-surface p-4">
        <pre className="overflow-x-auto">
          <code className="font-mono text-sm text-ink">{code}</code>
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-2 top-2 rounded-md border border-line bg-ground px-2 py-1 text-xs font-medium text-muted transition-colors hover:text-ink"
          aria-label="Copy code"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function ColorSwatch({
  name,
  token,
  className,
}: {
  name: string;
  token: string;
  className: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`h-16 w-full rounded-md border border-line ${className}`}
      />
      <Text size="sm" className="font-medium">
        {name}
      </Text>
      <Text size="xs" color="secondary">
        {token}
      </Text>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <Heading level={2} className="mb-6 border-b border-line pb-2">
        {title}
      </Heading>
      {children}
    </section>
  );
}

function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <Heading level={3} className="mb-4">
        {title}
      </Heading>
      {children}
    </div>
  );
}

const surfaces = [
  { name: "Ground", token: "bg-ground", className: "bg-ground" },
  { name: "Surface", token: "bg-surface", className: "bg-surface" },
  { name: "Tint", token: "bg-tint", className: "bg-tint" },
  { name: "Field", token: "bg-field", className: "bg-field" },
  { name: "Line", token: "border-line", className: "bg-line" },
  { name: "Tint line", token: "border-tint-line", className: "bg-tint-line" },
];

const inks = [
  { name: "Ink", token: "text-ink", className: "bg-ink" },
  { name: "Ink soft", token: "text-ink-soft", className: "bg-ink-soft" },
  { name: "Muted", token: "text-muted", className: "bg-muted" },
  { name: "Faint", token: "text-faint", className: "bg-faint" },
];

const accents = [
  { name: "Accent", token: "text-accent / bg-accent", className: "bg-accent" },
  {
    name: "Accent hover",
    token: "bg-accent-hover",
    className: "bg-accent-hover",
  },
  { name: "On accent", token: "text-on-accent", className: "bg-on-accent" },
  { name: "Error", token: "text-error", className: "bg-error" },
];

/**
 * Design System reference page (development only).
 *
 * Living documentation of the tokens and primitives. Every swatch is a
 * semantic class, so flipping the theme toggle shows the dark palette too.
 */
export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Container variant="wide" className="py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Heading level={1}>Design System</Heading>
        <ThemeToggle />
      </div>
      <Text size="lg" color="secondary" className="mb-12">
        Living documentation for the Easy Plant Life design system. This page is
        only accessible in development mode.
      </Text>

      <Section title="Colors">
        <Subsection title="Surfaces">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
            {surfaces.map((swatch) => (
              <ColorSwatch key={swatch.name} {...swatch} />
            ))}
          </div>
        </Subsection>
        <Subsection title="Text colors">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {inks.map((swatch) => (
              <ColorSwatch key={swatch.name} {...swatch} />
            ))}
          </div>
        </Subsection>
        <Subsection title="Accent">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {accents.map((swatch) => (
              <ColorSwatch key={swatch.name} {...swatch} />
            ))}
          </div>
        </Subsection>
        <CodeBlock
          label="Tokens are CSS variables that switch with [data-theme]"
          code={`<p className="bg-surface text-muted border-line">…</p>`}
        />
      </Section>

      <Section title="Typography">
        <Subsection title="Headings">
          <div className="space-y-4">
            <Heading level={1}>Heading 1 — page titles</Heading>
            <Heading level={2}>Heading 2 — sections</Heading>
            <Heading level={3}>Heading 3 — items</Heading>
            <Heading level={4}>Heading 4</Heading>
            <Heading level={5}>Heading 5</Heading>
            <Heading level={6}>Heading 6</Heading>
          </div>
          <CodeBlock
            label="Usage"
            code={`<Heading level={2}>Recent writing</Heading>`}
          />
        </Subsection>
        <Subsection title="Text">
          <div className="space-y-2">
            <Text size="2xl">Text 2xl</Text>
            <Text size="xl" color="secondary">
              Text xl secondary — leads
            </Text>
            <Text size="lg" color="soft">
              Text lg soft — long-form prose
            </Text>
            <Text size="base">Text base — body</Text>
            <Text size="sm" color="faint">
              Text sm faint — captions and helper text
            </Text>
            <Eyebrow>Eyebrow — section labels</Eyebrow>
          </div>
          <CodeBlock
            label="Usage"
            code={`<Text size="lg" color="secondary">…</Text>`}
          />
        </Subsection>
      </Section>

      <Section title="Components">
        <Subsection title="Button">
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <ButtonLink href="/newsletter" variant="secondary" size="sm">
              ButtonLink
            </ButtonLink>
          </div>
          <CodeBlock
            label="Usage"
            code={`<Button variant="primary" size="md">Subscribe</Button>\n<ButtonLink href="/newsletter" variant="secondary">Newsletter</ButtonLink>`}
          />
        </Subsection>

        <Subsection title="Link">
          <div className="mb-4 flex flex-wrap items-center gap-6">
            <Link href="/about">Inline link</Link>
            <Link href="https://medium.com/@easyplantlife">External link</Link>
            <ArrowLink href="/blog">Arrow link</ArrowLink>
            <ArrowLink href="https://medium.com/@easyplantlife">
              External arrow link
            </ArrowLink>
          </div>
          <CodeBlock
            label="Usage"
            code={`<Link href="/about">About</Link>\n<ArrowLink href="/blog">Read the blog</ArrowLink>`}
          />
        </Subsection>

        <Subsection title="Input">
          <div className="mb-4 flex max-w-md flex-col gap-4">
            <Input label="Email address" placeholder="you@example.com" />
            <Input
              label="With hint"
              hint="Only used to reply to you."
              placeholder="you@example.com"
            />
            <Input
              label="With error"
              defaultValue="you@example"
              error="That does not look like an email address."
            />
            <Input label="Disabled" placeholder="Disabled" disabled />
            <Textarea label="Message" hint="A short note is fine." />
          </div>
          <CodeBlock
            label="Usage"
            code={`<Input type="email" label="Email address" error={error} />\n<Textarea label="Message" rows={6} />`}
          />
        </Subsection>

        <Subsection title="Status note">
          <div className="mb-4 max-w-xl">
            <StatusNote title="You're on the list.">
              Nothing else arrives until there is something worth sending.
            </StatusNote>
          </div>
          <CodeBlock
            label="Usage"
            code={`<StatusNote title="Message sent.">Thanks for writing.</StatusNote>`}
          />
        </Subsection>

        <Subsection title="Panel">
          <div className="mb-4">
            <Panel columns>
              <div>
                <Text className="font-serif text-[22px]">
                  Not sure where to start?
                </Text>
                <Text color="secondary">
                  A quiet aside, at most one per page.
                </Text>
              </div>
              <ArrowLink href="/books">See the books</ArrowLink>
            </Panel>
          </div>
          <CodeBlock label="Usage" code={`<Panel columns>…</Panel>`} />
        </Subsection>

        <Subsection title="Container">
          <div className="mb-4 space-y-2">
            <Container
              variant="prose"
              className="rounded-md border border-dashed border-tint-line py-2"
            >
              <Text size="sm" color="secondary">
                prose · 680px
              </Text>
            </Container>
            <Container
              variant="narrow"
              className="rounded-md border border-dashed border-tint-line py-2"
            >
              <Text size="sm" color="secondary">
                narrow · 704px
              </Text>
            </Container>
            <Container className="rounded-md border border-dashed border-tint-line py-2">
              <Text size="sm" color="secondary">
                default · 1120px
              </Text>
            </Container>
          </div>
          <CodeBlock
            label="Usage"
            code={`<Container variant="narrow">…</Container>`}
          />
        </Subsection>
      </Section>
    </Container>
  );
}

"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

/**
 * Code block with copy functionality
 */
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
      <div className="relative rounded-md bg-neutral-100 p-4">
        <pre className="overflow-x-auto">
          <code className="font-mono text-sm text-text">{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 rounded-md bg-neutral-200 px-2 py-1 text-xs font-medium text-text-secondary hover:bg-neutral-300 transition-colors"
          aria-label="Copy code"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

/**
 * Color swatch component
 */
function ColorSwatch({
  name,
  value,
  className,
}: {
  name: string;
  value: string;
  className: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className={`h-16 w-full rounded-md border border-neutral-200 ${className}`} />
      <Text size="sm" className="font-medium">
        {name}
      </Text>
      <Text size="xs" color="secondary">
        {value}
      </Text>
    </div>
  );
}

/**
 * Section wrapper for consistent spacing
 */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <Heading level={2} className="mb-6 border-b border-neutral-200 pb-2">
        {title}
      </Heading>
      {children}
    </section>
  );
}

/**
 * Subsection wrapper
 */
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

/**
 * Design System Reference Page
 *
 * A dev-only page displaying all components and their variants.
 * This serves as living documentation for the design system.
 *
 * Only accessible in development mode.
 */
export default function DesignSystemPage() {
  // Only render in development mode
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Container variant="wide" className="py-12">
      <Heading level={1} className="mb-8">
        Design System
      </Heading>
      <Text size="lg" color="secondary" className="mb-12">
        Living documentation for the Easy Plant Life design system. This page is
        only accessible in development mode.
      </Text>

      {/* Colors Section */}
      <Section title="Colors">
        <Subsection title="Primary">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 md:grid-cols-10">
            <ColorSwatch name="50" value="#F1F8E9" className="bg-primary-50" />
            <ColorSwatch name="100" value="#E8F5E9" className="bg-primary-100" />
            <ColorSwatch name="200" value="#C8E6C9" className="bg-primary-200" />
            <ColorSwatch name="300" value="#A5D6A7" className="bg-primary-300" />
            <ColorSwatch name="400" value="#81C784" className="bg-primary-400" />
            <ColorSwatch name="500" value="#66BB6A" className="bg-primary-500" />
            <ColorSwatch name="600" value="#4CAF50" className="bg-primary-600" />
            <ColorSwatch name="700" value="#43A047" className="bg-primary-700" />
            <ColorSwatch name="800" value="#388E3C" className="bg-primary-800" />
            <ColorSwatch name="900" value="#2E7D32" className="bg-primary-900" />
          </div>
          <CodeBlock
            code='<div className="bg-primary-400">Primary color</div>'
            label="Usage"
          />
        </Subsection>

        <Subsection title="Neutral">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 md:grid-cols-10">
            <ColorSwatch name="50" value="#FDFCFB" className="bg-neutral-50" />
            <ColorSwatch name="100" value="#F5F5F0" className="bg-neutral-100" />
            <ColorSwatch name="200" value="#E8E6E1" className="bg-neutral-200" />
            <ColorSwatch name="300" value="#D5D3CE" className="bg-neutral-300" />
            <ColorSwatch name="400" value="#A8A5A0" className="bg-neutral-400" />
            <ColorSwatch name="500" value="#7A7875" className="bg-neutral-500" />
            <ColorSwatch name="600" value="#5C5A58" className="bg-neutral-600" />
            <ColorSwatch name="700" value="#3E3D3B" className="bg-neutral-700" />
            <ColorSwatch name="800" value="#2D2D2D" className="bg-neutral-800" />
            <ColorSwatch name="900" value="#1A1A1A" className="bg-neutral-900" />
          </div>
          <CodeBlock
            code='<div className="bg-neutral-100">Neutral background</div>'
            label="Usage"
          />
        </Subsection>

        <Subsection title="Background">
          <div className="grid grid-cols-3 gap-4">
            <ColorSwatch name="Default" value="#FDFCFB" className="bg-background" />
            <ColorSwatch
              name="Secondary"
              value="#F5F5F0"
              className="bg-background-secondary"
            />
            <ColorSwatch
              name="Accent"
              value="#E8F5E9"
              className="bg-background-accent"
            />
          </div>
          <CodeBlock
            code='<div className="bg-background">Default background</div>'
            label="Usage"
          />
        </Subsection>

        <Subsection title="Text Colors">
          <div className="flex flex-col gap-4">
            <div className="rounded-md border border-neutral-200 p-4">
              <Text color="default">text-text (Default) - #2D2D2D</Text>
            </div>
            <div className="rounded-md border border-neutral-200 p-4">
              <Text color="secondary">text-text-secondary - #5C5A58</Text>
            </div>
            <div className="rounded-md border border-neutral-200 p-4">
              <Text color="accent">text-text-accent - #4CAF50</Text>
            </div>
            <div className="rounded-md border border-neutral-200 bg-neutral-800 p-4">
              <Text color="inverse">text-text-inverse - #FDFCFB</Text>
            </div>
          </div>
          <CodeBlock
            code='<Text color="secondary">Muted text</Text>'
            label="Usage"
          />
        </Subsection>
      </Section>

      {/* Typography Section */}
      <Section title="Typography">
        <Subsection title="Headings">
          <div className="flex flex-col gap-4">
            <div className="border-b border-neutral-200 pb-4">
              <Heading level={1}>Heading Level 1 (text-5xl)</Heading>
              <Text size="sm" color="secondary">
                48px / 3rem - Page titles
              </Text>
            </div>
            <div className="border-b border-neutral-200 pb-4">
              <Heading level={2}>Heading Level 2 (text-4xl)</Heading>
              <Text size="sm" color="secondary">
                36px / 2.25rem - Section titles
              </Text>
            </div>
            <div className="border-b border-neutral-200 pb-4">
              <Heading level={3}>Heading Level 3 (text-3xl)</Heading>
              <Text size="sm" color="secondary">
                30px / 1.875rem - Subsections
              </Text>
            </div>
            <div className="border-b border-neutral-200 pb-4">
              <Heading level={4}>Heading Level 4 (text-2xl)</Heading>
              <Text size="sm" color="secondary">
                24px / 1.5rem - Card titles
              </Text>
            </div>
            <div className="border-b border-neutral-200 pb-4">
              <Heading level={5}>Heading Level 5 (text-xl)</Heading>
              <Text size="sm" color="secondary">
                20px / 1.25rem - Small headings
              </Text>
            </div>
            <div className="border-b border-neutral-200 pb-4">
              <Heading level={6}>Heading Level 6 (text-lg)</Heading>
              <Text size="sm" color="secondary">
                18px / 1.125rem - Labels
              </Text>
            </div>
          </div>
          <CodeBlock
            code='<Heading level={1}>Page Title</Heading>
<Heading level={2} color="accent">Accent Section</Heading>'
            label="Usage"
          />
        </Subsection>

        <Subsection title="Text Sizes">
          <div className="flex flex-col gap-4">
            <div className="border-b border-neutral-200 pb-2">
              <Text size="xs">text-xs - 12px / 0.75rem - Captions, labels</Text>
            </div>
            <div className="border-b border-neutral-200 pb-2">
              <Text size="sm">text-sm - 14px / 0.875rem - Helper text</Text>
            </div>
            <div className="border-b border-neutral-200 pb-2">
              <Text size="base">text-base - 16px / 1rem - Body text (default)</Text>
            </div>
            <div className="border-b border-neutral-200 pb-2">
              <Text size="lg">text-lg - 18px / 1.125rem - Lead paragraphs</Text>
            </div>
            <div className="border-b border-neutral-200 pb-2">
              <Text size="xl">text-xl - 20px / 1.25rem - Large body</Text>
            </div>
            <div className="border-b border-neutral-200 pb-2">
              <Text size="2xl">text-2xl - 24px / 1.5rem - Extra large</Text>
            </div>
          </div>
          <CodeBlock
            code='<Text size="lg" color="secondary">Lead paragraph text</Text>'
            label="Usage"
          />
        </Subsection>

        <Subsection title="Font Families">
          <div className="flex flex-col gap-4">
            <div className="rounded-md border border-neutral-200 p-4">
              <p className="font-heading text-2xl">
                Lora (Serif) - Headings
              </p>
              <Text size="sm" color="secondary">
                font-heading, font-serif
              </Text>
            </div>
            <div className="rounded-md border border-neutral-200 p-4">
              <p className="font-body text-xl">
                Source Sans 3 (Sans-serif) - Body
              </p>
              <Text size="sm" color="secondary">
                font-body, font-sans
              </Text>
            </div>
          </div>
        </Subsection>
      </Section>

      {/* Components Section */}
      <Section title="Components">
        <Subsection title="Button">
          <Text className="mb-4">
            Buttons support three variants (primary, secondary, ghost) and three
            sizes (sm, md, lg).
          </Text>

          <div className="mb-6">
            <Text size="sm" color="secondary" className="mb-2">
              Variants
            </Text>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          <div className="mb-6">
            <Text size="sm" color="secondary" className="mb-2">
              Sizes
            </Text>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div className="mb-6">
            <Text size="sm" color="secondary" className="mb-2">
              States
            </Text>
            <div className="flex flex-wrap items-center gap-4">
              <Button>Default</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          <CodeBlock
            code={`<Button variant="primary" size="lg">Subscribe</Button>
<Button variant="secondary">Learn More</Button>
<Button variant="ghost" disabled>Cancel</Button>`}
            label="Usage"
          />
        </Subsection>

        <Subsection title="Link">
          <Text className="mb-4">
            Links automatically detect external URLs and open them in new tabs
            with proper security attributes.
          </Text>

          <div className="mb-6 flex flex-col gap-4">
            <div>
              <Text size="sm" color="secondary" className="mb-2">
                Internal Link
              </Text>
              <Link href="/about">About Us</Link>
            </div>
            <div>
              <Text size="sm" color="secondary" className="mb-2">
                External Link
              </Text>
              <Link href="https://example.com">External Site</Link>
            </div>
          </div>

          <CodeBlock
            code={`<Link href="/about">Internal Link</Link>
<Link href="https://example.com">External Link (new tab)</Link>`}
            label="Usage"
          />
        </Subsection>

        <Subsection title="Input">
          <Text className="mb-4">
            Form inputs with optional labels and error states. Includes proper
            accessibility attributes.
          </Text>

          <div className="mb-6 grid max-w-md gap-6">
            <Input label="Email" placeholder="Enter your email" />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
            />
            <Input
              label="With Error"
              error="This field is required"
              placeholder="Error state"
            />
            <Input
              label="Disabled"
              disabled
              placeholder="Cannot edit"
              value="Disabled input"
            />
          </div>

          <CodeBlock
            code={`<Input label="Email" placeholder="Enter your email" />
<Input label="Password" type="password" error="Invalid password" />`}
            label="Usage"
          />
        </Subsection>

        <Subsection title="Card">
          <Text className="mb-4">
            Cards for displaying content blocks. Supports clickable variant with
            href prop.
          </Text>

          <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <Heading level={4}>Basic Card</Heading>
              <Text color="secondary" className="mt-2">
                A simple card with content.
              </Text>
            </Card>

            <Card href="/example">
              <Heading level={4}>Clickable Card</Heading>
              <Text color="secondary" className="mt-2">
                Click to navigate.
              </Text>
            </Card>

            <Card as="article">
              <Heading level={4}>Article Card</Heading>
              <Text color="secondary" className="mt-2">
                Uses semantic article element.
              </Text>
            </Card>
          </div>

          <CodeBlock
            code={`<Card>
  <Heading level={4}>Card Title</Heading>
  <Text>Card content</Text>
</Card>

<Card href="/details">Clickable Card</Card>`}
            label="Usage"
          />
        </Subsection>

        <Subsection title="Container">
          <Text className="mb-4">
            Layout container with four width variants: default (max-w-6xl),
            prose (max-w-prose), wide (max-w-7xl), and full.
          </Text>

          <div className="mb-6 flex flex-col gap-4">
            <div className="rounded-md bg-neutral-100 p-4">
              <Text size="sm" color="secondary">
                variant=&quot;default&quot; - max-w-6xl (1152px)
              </Text>
              <div className="mt-2 h-4 max-w-6xl bg-primary-200" />
            </div>
            <div className="rounded-md bg-neutral-100 p-4">
              <Text size="sm" color="secondary">
                variant=&quot;prose&quot; - max-w-prose (~65ch)
              </Text>
              <div className="mt-2 h-4 max-w-prose bg-primary-200" />
            </div>
            <div className="rounded-md bg-neutral-100 p-4">
              <Text size="sm" color="secondary">
                variant=&quot;wide&quot; - max-w-7xl (1280px)
              </Text>
              <div className="mt-2 h-4 max-w-7xl bg-primary-200" />
            </div>
            <div className="rounded-md bg-neutral-100 p-4">
              <Text size="sm" color="secondary">
                variant=&quot;full&quot; - No max-width
              </Text>
              <div className="mt-2 h-4 w-full bg-primary-200" />
            </div>
          </div>

          <CodeBlock
            code={`<Container>Default width content</Container>
<Container variant="prose">Article content</Container>
<Container variant="wide" as="main">Full layout</Container>`}
            label="Usage"
          />
        </Subsection>

        <Subsection title="Heading">
          <Text className="mb-4">
            Typography component for headings (h1-h6) with color variants.
          </Text>

          <div className="mb-6 flex flex-col gap-4">
            <Heading level={3} color="default">
              Default Color
            </Heading>
            <Heading level={3} color="secondary">
              Secondary Color
            </Heading>
            <Heading level={3} color="accent">
              Accent Color
            </Heading>
            <div className="rounded-md bg-neutral-800 p-4">
              <Heading level={3} color="inverse">
                Inverse Color
              </Heading>
            </div>
          </div>

          <CodeBlock
            code={`<Heading level={1}>Page Title</Heading>
<Heading level={2} color="accent">Accent Heading</Heading>`}
            label="Usage"
          />
        </Subsection>

        <Subsection title="Text">
          <Text className="mb-4">
            Typography component for body text with size and color variants.
          </Text>

          <div className="mb-6 flex flex-col gap-4">
            <Text as="p" size="base" color="default">
              Default paragraph text (p element)
            </Text>
            <Text as="span" size="sm" color="secondary">
              Inline span text
            </Text>
            <Text size="lg" color="accent">
              Large accent text
            </Text>
          </div>

          <CodeBlock
            code={`<Text>Default paragraph</Text>
<Text as="span" size="sm" color="secondary">Helper text</Text>`}
            label="Usage"
          />
        </Subsection>
      </Section>

      {/* Spacing Section */}
      <Section title="Spacing">
        <Text className="mb-4">
          The spacing scale emphasizes generous white space for a calm aesthetic.
        </Text>

        <div className="mb-6 grid gap-2">
          {[
            { name: "1", value: "0.25rem (4px)" },
            { name: "2", value: "0.5rem (8px)" },
            { name: "4", value: "1rem (16px)" },
            { name: "6", value: "1.5rem (24px)" },
            { name: "8", value: "2rem (32px)" },
            { name: "12", value: "3rem (48px)" },
            { name: "16", value: "4rem (64px)" },
            { name: "24", value: "6rem (96px)" },
          ].map(({ name, value }) => (
            <div key={name} className="flex items-center gap-4">
              <div
                className="h-4 bg-primary-400"
                style={{ width: `${parseInt(name) * 0.25}rem` }}
              />
              <Text size="sm" color="secondary">
                {name} - {value}
              </Text>
            </div>
          ))}
        </div>

        <CodeBlock
          code={`<div className="p-4">Padding 1rem</div>
<div className="mb-8">Margin bottom 2rem</div>
<div className="gap-6">Gap 1.5rem</div>`}
          label="Usage"
        />
      </Section>
    </Container>
  );
}

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Link } from "@/components/ui/Link";

/**
 * 404 Not Found Page
 *
 * A calm, brand-consistent page shown when users navigate to a non-existent route.
 * Follows brand guidelines: friendly tone, no technical jargon, helpful navigation.
 */
export default function NotFound() {
  return (
    <main className="py-12 md:py-16 text-center">
      <Container>
        <Heading level={1} className="text-4xl mb-6">
          This page has wandered off
        </Heading>
        <Text size="lg" color="secondary" className="mb-8 max-w-md mx-auto">
          It looks like the page you were looking for has moved or never
          existed. Let&apos;s get you back on track.
        </Text>
        <Link href="/">Return home</Link>
      </Container>
    </main>
  );
}

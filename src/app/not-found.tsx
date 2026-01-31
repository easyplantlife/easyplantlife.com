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
          Oops, nothing here
        </Heading>
        <Text size="lg" color="secondary" className="mb-8 max-w-md mx-auto">
          This page does not exist. No worries.
        </Text>
        <Link href="/">Return home</Link>
      </Container>
    </main>
  );
}

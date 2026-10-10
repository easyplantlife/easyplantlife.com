import { ArrowLink } from "@/components/ui/ArrowLink";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export default function NotFound() {
  return (
    <main className="flex-1 py-24">
      <Container
        variant="narrow"
        className="flex flex-col items-center gap-6 text-center"
      >
        <Eyebrow>404</Eyebrow>
        <Heading level={1}>Nothing here.</Heading>
        <Text size="xl" color="secondary" className="max-w-md">
          This page does not exist. No worries.
        </Text>
        <ArrowLink href="/">Back to the home page</ArrowLink>
      </Container>
    </main>
  );
}

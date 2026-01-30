export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Easy Plant Life
        </h1>
        <p className="text-lg text-foreground/70">
          A calm approach to living with plants
        </p>
        <div
          data-testid="tailwind-test"
          className="mt-8 p-4 bg-green-100 text-green-800 rounded-lg"
        >
          Tailwind CSS is working correctly
        </div>
      </div>
    </main>
  );
}

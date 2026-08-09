import BuilderGenerator from "@/components/builder-generator/BuilderGenerator";

export default function Home() {
  return (
    <main className="min-h-screen w-full px-4 py-8 sm:py-12 md:py-16 flex flex-col items-center justify-center">
      <BuilderGenerator />
    </main>
  );
}

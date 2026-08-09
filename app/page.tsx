import BuilderGenerator from "@/components/builder-generator/BuilderGenerator";

export default function Home() {
  return (
    <main className="min-h-screen w-full px-4 pt-3 pb-10 md:py-1 flex flex-col items-center justify-center">
      <BuilderGenerator />
    </main>
  );
}

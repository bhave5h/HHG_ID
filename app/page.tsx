import BuilderGenerator from "@/components/builder-generator/BuilderGenerator";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between max-w-4xl mx-auto p-5">
      <BuilderGenerator />
    </main>
  );
}

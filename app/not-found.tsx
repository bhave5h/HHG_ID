import Link from "next/link";
import HeaderBar from "@/components/builder-generator/HeaderBar";
import Footer from "@/components/ui/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between px-4 sm:px-6 md:px-10 pt-0 pb-0 bg-[#0B6839] bg-[radial-gradient(rgba(0,0,0,0.25)_2px,transparent_2px)] [background-size:24px_24px] font-body text-white">
      <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-between">
        {/* Header Bar */}
        <HeaderBar />

        {/* 404 Card Container matching card page aesthetic */}
        <div className="w-full max-w-md sm:max-w-lg bg-[#FFFBE8] text-[#0B6839] rounded-lg shadow-[5px_5px_0px_0px_#084e2a] p-6 sm:p-8 text-center my-auto flex flex-col items-center gap-4 z-10">
          <div className="text-6xl sm:text-7xl font-heading font-black text-[#FF0080] tracking-tight">
            404
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase text-[#0B6839] mb-0">
            ID Card Not Found
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#0B6839]/90 max-w-xs leading-relaxed">
            The builder pass you are looking for does not exist or may have expired.
          </p>

          <Link
            href="/"
            className="btn-pink text-xs sm:text-sm px-5 py-2.5 rounded-full font-bold hover:underline inline-block mt-2"
          >
            CREATE YOUR OWN ID PASS ↗
          </Link>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}

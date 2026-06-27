import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1b120c] text-[#f4ead8] px-6">
      <section className="max-w-3xl text-center">
        <p className="uppercase tracking-[0.35em] text-xs text-[#c49a3c] mb-8">
          DOMUS PENATI
        </p>

        <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-8">
          Bentornato
          <br />
          a casa.
        </h1>

        <p className="text-lg md:text-xl leading-relaxed text-[#f4ead8]/75 mb-12">
          La tecnologia più avanzata non è quella che ci porta più lontano.
          <br />
          È quella che ci riporta a casa.
        </p>

        <Link
          href="/register"
          className="inline-flex rounded-full bg-[#c49a3c] px-8 py-4 text-[#1b120c] font-medium hover:bg-[#d8b45a] transition"
        >
          Inizia la tua Domus
        </Link>
      </section>
    </main>
  );
}
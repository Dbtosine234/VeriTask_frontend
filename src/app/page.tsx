const pillars = [
  {
    title: "Fresh code foundation",
    description: "A clean repo structure built to satisfy hackathon fresh-code submission requirements.",
  },
  {
    title: "Sponsor challenge ready",
    description: "A modular core so we can plug in the exact challenge workflow without rewriting the app.",
  },
  {
    title: "Partner bounty friendly",
    description: "Integration slots for APIs, SDKs, wallets, identity, analytics, or payments.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-12 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
          <p className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm text-emerald-300">
            Fresh code • Hackathon scaffold
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Start fast, stay clean, and build a sponsor-ready demo.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            This starter gives us the repo structure, landing page, backend API, docs, and judging checklist we need to begin building a real submission.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="http://localhost:8000/docs"
              className="rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:opacity-90"
            >
              Open API docs
            </a>
            <a
              href="http://localhost:8000/api/v1/project/overview"
              className="rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              View project overview
            </a>
          </div>
        </div>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">{pillar.title}</h2>
              <p className="mt-3 text-slate-300">{pillar.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

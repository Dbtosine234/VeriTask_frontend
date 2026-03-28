import Link from "next/link";

const highlights = [
  "World ID-gated access",
  "Human-only marketplace",
  "Escrow-backed payouts",
  "Reputation that grows with completed work",
];

const steps = [
  {
    title: "Post work with escrow",
    description:
      "Requesters create tasks, define rewards, and fund escrow before work begins.",
  },
  {
    title: "Verified humans complete tasks",
    description:
      "Workers accept tasks, submit proof, and build trust through completed work.",
  },
  {
    title: "Review and release payout",
    description:
      "Proof is reviewed before rewards are released, keeping both sides protected.",
  },
];

const trustPoints = [
  "Verified human access reduces fake accounts and bot abuse.",
  "Escrow-backed flows make rewards feel credible and safer.",
  "Proof submission creates accountability before payout.",
  "Portable reputation helps reliable workers stand out over time.",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white">
      <div className="mx-auto max-w-md">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
              VeriTask
            </div>
            <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
              Human-only work marketplace
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              Trust-first task platform
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight">
              Verified humans. Real tasks. Escrow-backed rewards.
            </h1>
            <p className="mt-4 text-base leading-7 text-white/70">
              VeriTask helps real people post work, prove completion, build reputation,
              and release rewards with more trust and less bot noise.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/80"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/marketplace"
                className="rounded-2xl bg-white px-4 py-3 text-center font-medium text-black transition hover:opacity-90"
              >
                Explore marketplace
              </Link>
              <Link
                href="/tasks/new"
                className="rounded-2xl border border-white/15 px-4 py-3 text-center font-medium transition hover:bg-white/10"
              >
                Post a task
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link
                href="/me"
                className="rounded-2xl border border-white/15 px-4 py-3 text-center text-sm transition hover:bg-white/10"
              >
                My profile
              </Link>
              <Link
                href="/wallet"
                className="rounded-2xl border border-white/15 px-4 py-3 text-center text-sm transition hover:bg-white/10"
              >
                Wallet
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-white/50">How VeriTask works</p>
          <div className="mt-4 space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/10 p-4"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-sm font-medium text-white/80">
                    {index + 1}
                  </div>
                  <h2 className="text-lg font-semibold">{step.title}</h2>
                </div>
                <p className="text-sm leading-6 text-white/70">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-white/50">Why this stands out</p>
          <h2 className="mt-2 text-2xl font-semibold">
            Built for trust, proof, and real work completion
          </h2>

          <div className="mt-4 space-y-3">
            {trustPoints.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-white/10 p-4 text-sm leading-6 text-white/75"
              >
                {point}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-white/50">Core product flow</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-sm text-white/50">For task posters</p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Create tasks, fund escrow, review proof, and release payouts when work is
                completed.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-sm text-white/50">For workers</p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Accept tasks, submit proof of contribution, earn rewards, and grow a trusted
                reputation profile.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-sm text-white/50">For the platform</p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Reduce fake work, increase accountability, and create a safer human-only
                marketplace experience.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-white/50">Get started</p>
          <h2 className="mt-2 text-2xl font-semibold">
            Step into a more trustworthy task marketplace
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Browse tasks, create work opportunities, track your earnings, and build a
            reputation that proves you deliver.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              href="/marketplace"
              className="rounded-2xl bg-white px-4 py-3 text-center font-medium text-black transition hover:opacity-90"
            >
              Open marketplace
            </Link>
            <Link
              href="/activity"
              className="rounded-2xl border border-white/15 px-4 py-3 text-center font-medium transition hover:bg-white/10"
            >
              View activity
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

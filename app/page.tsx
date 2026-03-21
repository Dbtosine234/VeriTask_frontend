import Link from "next/link";

const highlights = [
  "World ID-gated access",
  "Human-only task marketplace",
  "Escrow-backed payouts",
  "Proof of work submission",
  "Reputation built from real completions",
  "Mobile-first UX for World App",
];

const steps = [
  {
    title: "1. Post a task",
    text: "Create a job with reward, category, and deadline.",
  },
  {
    title: "2. Fund escrow",
    text: "Lock the payout before work begins.",
  },
  {
    title: "3. Verified human accepts",
    text: "Workers browse and claim open tasks.",
  },
  {
    title: "4. Submit proof",
    text: "Completed work is reviewed before payout.",
  },
  {
    title: "5. Release reward",
    text: "Approval updates payout and reputation.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-8">
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          VeriTask • World Mini App • Human-only work marketplace
        </div>

        <h1 className="text-4xl font-semibold leading-tight">
          Human-only work, escrow payouts, and reputation you can trust.
        </h1>

        <p className="mt-4 text-base leading-7 text-white/70">
          VeriTask helps real people post, complete, and get paid for tasks inside
          World App without bot farming, fake accounts, or low-trust gig flows.
        </p>

        <div className="mt-8 grid gap-3">
          {highlights.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/50">How it works</p>
          <div className="mt-4 space-y-3">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/10 p-4"
              >
                <h2 className="text-sm font-semibold">{step.title}</h2>
                <p className="mt-1 text-sm text-white/65">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          <Link
            href="/marketplace"
            className="rounded-2xl bg-white px-4 py-4 text-center font-semibold text-black"
          >
            Enter marketplace
          </Link>
          <Link
            href="/tasks/new"
            className="rounded-2xl border border-white/15 px-4 py-4 text-center"
          >
            Post a task
          </Link>
          <Link
            href="/me"
            className="rounded-2xl border border-white/15 px-4 py-4 text-center"
          >
            My reputation
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/50">Why this matters</p>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Online task markets often struggle with spam, fake identities, and low
            trust. VeriTask uses human verification, proof submission, escrow-backed
            rewards, and reputation scoring to create a safer and more reliable way
            to coordinate real work.
          </p>
        </div>
      </section>
    </main>
  );
}

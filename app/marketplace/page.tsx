"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

type Task = {
  id: string;
  title: string;
  description: string;
  reward_amount: string;
  currency: string;
  status: string;
  created_by?: string | null;
  category?: string | null;
  deadline?: string | null;
  worker_id?: string | null;
  proof_text?: string | null;
  proof_url?: string | null;
  escrow_status?: string | null;
};

export default function MarketplacePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<Task[]>("/tasks")
      .then(setTasks)
      .catch((err) => setError(err.message || "Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/50">Marketplace</p>
          <h1 className="text-3xl font-bold">Human-only tasks</h1>
          <p className="mt-2 text-sm text-white/70">
            Verified work opportunities with escrow-backed rewards.
          </p>
        </div>

        <div className="mb-4 flex gap-3">
          <Link
            href="/tasks/new"
            className="flex-1 rounded-xl bg-white px-4 py-3 text-center font-medium text-black"
          >
            Post a task
          </Link>
          <Link
            href="/me"
            className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-center font-medium"
          >
            My reputation
          </Link>
        </div>

        {loading && <p className="text-sm text-white/60">Loading tasks...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="space-y-4">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="block rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{task.title}</h2>
                  <p className="mt-1 text-sm text-white/60">{task.category || "general"}</p>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                  {task.status}
                </div>
              </div>

              <p className="line-clamp-3 text-sm text-white/75">{task.description}</p>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-white/60">
                  Escrow: {task.escrow_status || "unfunded"}
                </span>
                <span className="font-semibold">
                  {task.reward_amount} {task.currency}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

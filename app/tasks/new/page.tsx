"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import { DEMO_USERS, DemoUser, getCurrentUser, setStoredUserId } from "../../../lib/session";
import AppHeader from "../../../components/app-header";
import PageShell from "../../../components/page-shell";

type TaskResponse = {
  id: string;
};

const CATEGORY_OPTIONS = ["review", "field", "survey", "research", "delivery", "general"];
const CURRENCY_OPTIONS = ["USDC", "USD"];

export default function NewTaskPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardAmount, setRewardAmount] = useState("5");
  const [currency, setCurrency] = useState("USDC");
  const [category, setCategory] = useState("review");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  function handleUserChange(userId: string) {
    setStoredUserId(userId);
    const selected = DEMO_USERS.find((user) => user.id === userId) || null;
    setCurrentUser(selected);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const numericReward = Number(rewardAmount);

    if (!title.trim()) {
      setError("Task title is required.");
      setLoading(false);
      return;
    }

    if (!description.trim()) {
      setError("Task description is required.");
      setLoading(false);
      return;
    }

    if (!Number.isFinite(numericReward) || numericReward <= 0) {
      setError("Reward amount must be a valid number greater than 0.");
      setLoading(false);
      return;
    }

    if (deadline && deadline < today) {
      setError("Deadline cannot be in the past.");
      setLoading(false);
      return;
    }

    try {
      const task = await apiFetch<TaskResponse>("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          reward_amount: rewardAmount.trim(),
          currency,
          created_by: currentUser?.id || "user_1",
          category,
          deadline: deadline || null,
        }),
      });

      router.push(`/tasks/${task.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <AppHeader
        title="Create escrow-backed work"
        subtitle="Post clear work, fund escrow, and let verified humans complete it."
        backHref="/marketplace"
      />

      <div className="mb-4 flex gap-3">
        <Link
          href="/marketplace"
          className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-center font-medium transition hover:bg-white/10"
        >
          Marketplace
        </Link>
        <Link
          href="/me"
          className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-center font-medium transition hover:bg-white/10"
        >
          My profile
        </Link>
      </div>

      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-white/50">Active demo identity</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO_USERS.map((user) => {
            const selected = currentUser?.id === user.id;
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => handleUserChange(user.id)}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  selected
                    ? "bg-white text-black"
                    : "border border-white/15 text-white/80 hover:bg-white/10"
                }`}
              >
                {user.name} · {user.role}
              </button>
            );
          })}
        </div>

        {currentUser && (
          <div className="mt-4 rounded-xl border border-white/10 p-3 text-sm">
            <p className="text-white/50">Creating task as</p>
            <p className="mt-1 font-medium">
              {currentUser.name} ({currentUser.role})
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-white/50">Post a task</p>
        <h2 className="text-2xl font-bold">Create a new task</h2>
        <p className="mt-2 text-sm text-white/70">
          Describe the work clearly, define the reward, and set expectations before funding escrow.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="rounded-xl border border-white/10 p-4">
            <label className="mb-2 block text-sm text-white/60">Task title</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
              placeholder="Example: Record store shelf availability"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="rounded-xl border border-white/10 p-4">
            <label className="mb-2 block text-sm text-white/60">Task description</label>
            <textarea
              className="min-h-[150px] w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
              placeholder="Explain the work clearly, what proof is expected, and how success will be judged."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 p-4">
              <label className="mb-2 block text-sm text-white/60">Reward amount</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
                placeholder="5"
                inputMode="decimal"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                required
              />
            </div>

            <div className="rounded-xl border border-white/10 p-4">
              <label className="mb-2 block text-sm text-white/60">Currency</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {CURRENCY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 p-4">
              <label className="mb-2 block text-sm text-white/60">Category</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-white/10 p-4">
              <label className="mb-2 block text-sm text-white/60">Deadline</label>
              <input
                type="date"
                min={today}
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 p-4 text-sm text-white/70">
            <p className="font-medium text-white">How this works</p>
            <p className="mt-2">
              1. Post the task clearly. 2. Fund escrow on the task page. 3. A verified human
              accepts it. 4. Proof is submitted. 5. You review and release payout.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create task"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}

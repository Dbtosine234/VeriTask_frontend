"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import { DEMO_USERS, DemoUser, getCurrentUser, setStoredUserId } from "../../../lib/session";

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
    const user = getCurrentUser();
    setCurrentUser(user);
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
    <main className="min-h-screen bg-black px-4 py-6 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-4">
          <Link
            href="/marketplace"
            className="text-sm text-white/70 underline underline-offset-4"
          >
            Back to marketplace
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/50">Post a task</p>
          <h1 className="text-3xl font-bold">Create escrow-backed work</h1>
          <p className="mt-2 text-sm text-white/70">
            Publish work clearly, fund escrow, then wait for a verified human worker to complete
            the task.
          </p>

          <div className="mt-5 rounded-xl border border-white/10 p-4">
            <p className="text-sm text-white/50">Active demo identity</p>
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
                        : "border border-white/15 text-white/80"
                    }`}
                  >
                    {user.name} · {user.role}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <input
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              className="min-h-[140px] w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
              placeholder="Describe the work clearly"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
              placeholder="Reward amount"
              inputMode="decimal"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(e.target.value)}
              required
            />

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

            <input
              type="date"
              min={today}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="rounded-xl border border-white/10 p-4 text-sm text-white/70">
              <p className="font-medium text-white">How it works</p>
              <p className="mt-2">
                1. Post the task clearly. 2. Fund escrow on the task page. 3. A verified human
                accepts it. 4. Proof is reviewed before payout is released.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create task"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

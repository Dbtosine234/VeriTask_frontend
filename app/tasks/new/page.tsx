"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";

type TaskResponse = {
  id: string;
};

export default function NewTaskPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardAmount, setRewardAmount] = useState("5");
  const [currency, setCurrency] = useState("USDC");
  const [category, setCategory] = useState("review");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const task = await apiFetch<TaskResponse>("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          reward_amount: rewardAmount,
          currency,
          created_by: "user_1",
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
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-white/50">Post a task</p>
        <h1 className="text-3xl font-bold">Create escrow-backed work</h1>

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
            value={rewardAmount}
            onChange={(e) => setRewardAmount(e.target.value)}
            required
          />

          <input
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
            placeholder="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          />

          <input
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="date"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black disabled:opacity-60"
          >
            {loading ? "Creating..." : "Verify & fund escrow later"}
          </button>
        </form>
      </div>
    </main>
  );
}

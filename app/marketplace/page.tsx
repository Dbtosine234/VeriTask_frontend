"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api";
import { DEMO_USERS, DemoUser, getCurrentUser, setStoredUserId } from "../../lib/session";
import AppHeader from "../../components/app-header";
import PageShell from "../../components/page-shell";

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

const STATUS_FILTERS = ["all", "open", "accepted", "submitted", "paid"] as const;

export default function MarketplacePage() {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]>("all");

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    apiFetch<Task[]>("/tasks")
      .then(setTasks)
      .catch((err) => setError(err.message || "Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  function handleUserChange(userId: string) {
    setStoredUserId(userId);
    const selected = DEMO_USERS.find((user) => user.id === userId) || null;
    setCurrentUser(selected);
  }

  const filteredTasks = useMemo(() => {
    if (statusFilter === "all") return tasks;
    return tasks.filter((task) => task.status === statusFilter);
  }, [tasks, statusFilter]);

  function statusClasses(status: string) {
    switch (status) {
      case "open":
        return "border-white/15 text-white/80";
      case "accepted":
        return "border-blue-400/30 text-blue-300";
      case "submitted":
        return "border-yellow-400/30 text-yellow-300";
      case "paid":
        return "border-green-400/30 text-green-300";
      default:
        return "border-white/15 text-white/70";
    }
  }

  function escrowClasses(status: string | null | undefined) {
    switch (status) {
      case "funded":
        return "border-blue-400/30 text-blue-300";
      case "released":
        return "border-green-400/30 text-green-300";
      case "unfunded":
      default:
        return "border-white/15 text-white/70";
    }
  }

  return (
    <PageShell>
      <AppHeader
        title="Human-only tasks"
        subtitle="Verified work opportunities with escrow-backed rewards."
        backHref="/"
      />

      <div className="mb-4 flex gap-3">
        <Link
          href="/tasks/new"
          className="flex-1 rounded-xl bg-white px-4 py-3 text-center font-medium text-black transition hover:opacity-90"
        >
          Post a task
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
            <p className="text-white/50">Viewing marketplace as</p>
            <p className="mt-1 font-medium">
              {currentUser.name} ({currentUser.role})
            </p>
          </div>
        )}
      </div>

      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => {
            const selected = statusFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`rounded-full px-3 py-2 text-sm capitalize transition ${
                  selected
                    ? "bg-white text-black"
                    : "border border-white/15 text-white/80 hover:bg-white/10"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {loading && <p className="text-sm text-white/60">Loading tasks...</p>}
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {!loading && !error && filteredTasks.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-lg font-semibold">No tasks found</p>
          <p className="mt-2 text-sm text-white/60">
            There are no tasks in this filter yet. Try another filter or post a new task.
          </p>
          <Link
            href="/tasks/new"
            className="mt-4 inline-block rounded-xl bg-white px-4 py-3 text-sm font-medium text-black"
          >
            Create a task
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Link
            key={task.id}
            href={`/tasks/${task.id}`}
            className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{task.title}</h2>
                <p className="mt-1 text-sm text-white/60">
                  {task.category || "general"}
                </p>
              </div>

              <div
                className={`rounded-full border px-3 py-1 text-xs capitalize ${statusClasses(
                  task.status
                )}`}
              >
                {task.status}
              </div>
            </div>

            <p className="line-clamp-3 text-sm text-white/75">{task.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-white/50">Escrow</p>
                <p
                  className={`mt-1 inline-flex rounded-full border px-2 py-1 text-xs capitalize ${escrowClasses(
                    task.escrow_status
                  )}`}
                >
                  {task.escrow_status || "unfunded"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-white/50">Reward</p>
                <p className="mt-1 font-semibold">
                  {task.reward_amount} {task.currency}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-white/50">Deadline</p>
                <p className="mt-1 font-medium">{task.deadline || "Not set"}</p>
              </div>

              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-white/50">Worker</p>
                <p className="mt-1 font-medium">{task.worker_id || "Unassigned"}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

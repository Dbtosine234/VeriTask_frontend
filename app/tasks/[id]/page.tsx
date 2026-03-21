"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "../../../lib/api";

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

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const taskId = params.id;

  const [task, setTask] = useState<Task | null>(null);
  const [proofText, setProofText] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  async function loadTask() {
    try {
      setError("");
      const data = await apiFetch<Task>(`/tasks/${taskId}`);
      setTask(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load task");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!taskId) return;
    loadTask();
  }, [taskId]);

  async function fundEscrow() {
    setActionLoading("fund");
    setError("");
    try {
      await apiFetch("/escrow/fund", {
        method: "POST",
        body: JSON.stringify({ task_id: taskId }),
      });
      await loadTask();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fund escrow");
    } finally {
      setActionLoading("");
    }
  }

  async function acceptTask() {
    setActionLoading("accept");
    setError("");
    try {
      await apiFetch(`/tasks/${taskId}/accept`, {
        method: "POST",
        body: JSON.stringify({ worker_id: "user_2" }),
      });
      await loadTask();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept task");
    } finally {
      setActionLoading("");
    }
  }

  async function submitTask() {
    setActionLoading("submit");
    setError("");
    try {
      await apiFetch(`/tasks/${taskId}/submit`, {
        method: "POST",
        body: JSON.stringify({
          worker_id: "user_2",
          proof_text: proofText,
          proof_url: proofUrl || null,
        }),
      });
      await loadTask();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit task");
    } finally {
      setActionLoading("");
    }
  }

  async function approveTask() {
    setActionLoading("approve");
    setError("");
    try {
      await apiFetch(`/tasks/${taskId}/approve`, {
        method: "POST",
      });
      await loadTask();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve task");
    } finally {
      setActionLoading("");
    }
  }



  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white">
        <div className="mb-4">
  <Link
    href="/marketplace"
    className="text-sm text-white/70 underline underline-offset-4"
  >
    Back to marketplace
  </Link>
</div>
      <div className="mx-auto max-w-md">
        {loading && <p className="text-sm text-white/60">Loading task...</p>}
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        {task && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Task detail</p>
            <h1 className="text-3xl font-bold">{task.title}</h1>

            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl border border-white/10 p-3">
                <span className="text-white/50">Status:</span> {task.status}
              </div>
              <div className="rounded-xl border border-white/10 p-3">
                <span className="text-white/50">Escrow:</span> {task.escrow_status}
              </div>
              <div className="rounded-xl border border-white/10 p-3">
                <span className="text-white/50">Reward:</span> {task.reward_amount} {task.currency}
              </div>
              <div className="rounded-xl border border-white/10 p-3">
                <span className="text-white/50">Category:</span> {task.category || "general"}
              </div>
              <div className="rounded-xl border border-white/10 p-3">
                <span className="text-white/50">Deadline:</span> {task.deadline || "Not set"}
              </div>
              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-white/50">Description</p>
                <p className="mt-2 text-white/80">{task.description}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {task.escrow_status === "unfunded" && (
                <button
                  onClick={fundEscrow}
                  disabled={actionLoading === "fund"}
                  className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black"
                >
                  {actionLoading === "fund" ? "Funding..." : "Fund escrow"}
                </button>
              )}

              {task.status === "open" && (
                <button
                  onClick={acceptTask}
                  disabled={actionLoading === "accept"}
                  className="w-full rounded-xl border border-white/15 px-4 py-3 font-semibold"
                >
                  {actionLoading === "accept" ? "Accepting..." : "Accept task"}
                </button>
              )}

              {task.status === "accepted" && (
                <div className="space-y-3 rounded-xl border border-white/10 p-3">
                  <textarea
                    className="min-h-[120px] w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
                    placeholder="Enter proof of work"
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                  />
                  <input
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
                    placeholder="Proof URL (optional)"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                  />
                  <button
                    onClick={submitTask}
                    disabled={actionLoading === "submit" || !proofText.trim()}
                    className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black"
                  >
                    {actionLoading === "submit" ? "Submitting..." : "Submit proof"}
                  </button>
                </div>
              )}

              {task.status === "submitted" && (
                <button
                  onClick={approveTask}
                  disabled={actionLoading === "approve"}
                  className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black"
                >
                  {actionLoading === "approve" ? "Approving..." : "Approve & release payout"}
                </button>
              )}

              {task.proof_text && (
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-white/50">Proof submitted</p>
                  <p className="mt-2 text-white/80">{task.proof_text}</p>
                  {task.proof_url && (
                    <p className="mt-2 break-all text-sm text-white/60">{task.proof_url}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

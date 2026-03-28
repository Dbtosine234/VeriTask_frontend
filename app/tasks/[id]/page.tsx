"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import {
  DEMO_USERS,
  DemoUser,
  getCurrentUser,
  getUserById,
  setStoredUserId,
} from "../../../lib/session";
import AppHeader from "../../../components/app-header";
import PageShell from "../../../components/page-shell";

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

type ApproveResponse = {
  message?: string;
  task?: Task;
};

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const taskId = params.id;

  const [task, setTask] = useState<Task | null>(null);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [proofText, setProofText] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

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

  function handleUserChange(userId: string) {
    setStoredUserId(userId);
    const selected = DEMO_USERS.find((user) => user.id === userId) || null;
    setCurrentUser(selected);
    setError("");
    setSuccess("");
  }

  const creator = useMemo(() => getUserById(task?.created_by), [task?.created_by]);
  const worker = useMemo(() => getUserById(task?.worker_id), [task?.worker_id]);

  const isPoster = !!currentUser && currentUser.id === task?.created_by;
  const isAssignedWorker = !!currentUser && currentUser.id === task?.worker_id;

  const canFund = !!task && task.escrow_status === "unfunded" && isPoster;
  const canAccept =
    !!currentUser && !!task && task.status === "open" && currentUser.id !== task.created_by;
  const canSubmit = !!task && task.status === "accepted" && isAssignedWorker;
  const canApprove = !!task && task.status === "submitted" && isPoster;

  async function fundEscrow() {
    setActionLoading("fund");
    setError("");
    setSuccess("");

    try {
      await apiFetch("/escrow/fund", {
        method: "POST",
        body: JSON.stringify({ task_id: taskId }),
      });
      setSuccess("Escrow funded successfully.");
      await loadTask();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fund escrow");
    } finally {
      setActionLoading("");
    }
  }

  async function acceptTask() {
    if (!currentUser) return;

    setActionLoading("accept");
    setError("");
    setSuccess("");

    try {
      await apiFetch(`/tasks/${taskId}/accept`, {
        method: "POST",
        body: JSON.stringify({ worker_id: currentUser.id }),
      });
      setSuccess("Task accepted successfully.");
      await loadTask();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept task");
    } finally {
      setActionLoading("");
    }
  }

  async function submitTask() {
    if (!currentUser) return;

    setActionLoading("submit");
    setError("");
    setSuccess("");

    try {
      await apiFetch(`/tasks/${taskId}/submit`, {
        method: "POST",
        body: JSON.stringify({
          worker_id: currentUser.id,
          proof_text: proofText.trim(),
          proof_url: proofUrl.trim() || null,
        }),
      });
      setSuccess("Proof submitted successfully.");
      setProofText("");
      setProofUrl("");
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
    setSuccess("");

    try {
      const response = await apiFetch<ApproveResponse>(`/tasks/${taskId}/approve`, {
        method: "POST",
      });
      setSuccess(response.message || "Task approved and payout released.");
      await loadTask();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve task");
    } finally {
      setActionLoading("");
    }
  }

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
        title="Task detail"
        subtitle="Review task information, workflow status, proof, and payout actions."
        backHref="/marketplace"
      />

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
            <p className="text-white/50">Viewing task as</p>
            <p className="mt-1 font-medium">
              {currentUser.name} ({currentUser.role})
            </p>
          </div>
        )}
      </div>

      {loading && <p className="text-sm text-white/60">Loading task...</p>}
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {success && <p className="mb-4 text-sm text-green-400">{success}</p>}

      {task && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-white/50">Task</p>
                <h2 className="text-2xl font-bold">{task.title}</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs capitalize ${statusClasses(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs capitalize ${escrowClasses(
                    task.escrow_status
                  )}`}
                >
                  escrow: {task.escrow_status || "unfunded"}
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-white/75">{task.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/50">Task summary</p>
              <div className="mt-3 space-y-3 text-sm">
                <div className="rounded-xl border border-white/10 p-3">
                  <span className="text-white/50">Task ID:</span> {task.id}
                </div>
                <div className="rounded-xl border border-white/10 p-3">
                  <span className="text-white/50">Category:</span> {task.category || "general"}
                </div>
                <div className="rounded-xl border border-white/10 p-3">
                  <span className="text-white/50">Deadline:</span> {task.deadline || "Not set"}
                </div>
                <div className="rounded-xl border border-white/10 p-3">
                  <span className="text-white/50">Reward:</span> {task.reward_amount}{" "}
                  {task.currency}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/50">Actors</p>
              <div className="mt-3 space-y-3 text-sm">
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-white/50">Requester</p>
                  <p className="mt-1 font-medium">
                    {creator ? `${creator.name} (${creator.id})` : task.created_by || "Unknown"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-white/50">Assigned worker</p>
                  <p className="mt-1 font-medium">
                    {worker ? `${worker.name} (${worker.id})` : task.worker_id || "Unassigned"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-white/50">Escrow status</p>
                  <p className="mt-1 font-medium capitalize">
                    {task.escrow_status || "unfunded"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/50">Workflow progress</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-5">
              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-white/50">Open</p>
                <p className="mt-1 font-medium">
                  {["open", "accepted", "submitted", "paid"].includes(task.status) ? "Yes" : "No"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-white/50">Funded</p>
                <p className="mt-1 font-medium">
                  {task.escrow_status === "funded" || task.escrow_status === "released"
                    ? "Yes"
                    : "No"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-white/50">Accepted</p>
                <p className="mt-1 font-medium">
                  {["accepted", "submitted", "paid"].includes(task.status) ? "Yes" : "No"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-white/50">Proof</p>
                <p className="mt-1 font-medium">
                  {["submitted", "paid"].includes(task.status) ? "Submitted" : "Pending"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-white/50">Payout</p>
                <p className="mt-1 font-medium">{task.status === "paid" ? "Released" : "Pending"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/50">Available actions</p>
            <div className="mt-4 space-y-3">
              {canFund && (
                <button
                  onClick={fundEscrow}
                  disabled={actionLoading === "fund"}
                  className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:opacity-90"
                >
                  {actionLoading === "fund" ? "Funding..." : "Fund escrow"}
                </button>
              )}

              {canAccept && (
                <button
                  onClick={acceptTask}
                  disabled={actionLoading === "accept"}
                  className="w-full rounded-xl border border-white/15 px-4 py-3 font-semibold transition hover:bg-white/10"
                >
                  {actionLoading === "accept" ? "Accepting..." : "Accept task"}
                </button>
              )}

              {canSubmit && (
                <div className="space-y-3 rounded-xl border border-white/10 p-3">
                  <p className="text-sm text-white/50">Submit proof of work</p>
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
                    className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
                  >
                    {actionLoading === "submit" ? "Submitting..." : "Submit proof"}
                  </button>
                </div>
              )}

              {canApprove && (
                <button
                  onClick={approveTask}
                  disabled={actionLoading === "approve"}
                  className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:opacity-90"
                >
                  {actionLoading === "approve" ? "Approving..." : "Approve & release payout"}
                </button>
              )}

              {!canFund && !canAccept && !canSubmit && !canApprove && (
                <div className="rounded-xl border border-white/10 p-4 text-sm text-white/60">
                  No action is available for this task under the current identity and task status.
                </div>
              )}
            </div>
          </div>

          {task.proof_text && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/50">Proof submitted</p>
              <p className="mt-3 text-white/80">{task.proof_text}</p>
              {task.proof_url && (
                <div className="mt-3 rounded-xl border border-white/10 p-3 text-sm text-white/60 break-all">
                  {task.proof_url}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Link
              href="/marketplace"
              className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-center font-medium transition hover:bg-white/10"
            >
              Back to marketplace
            </Link>
            <Link
              href="/me"
              className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-center font-medium transition hover:bg-white/10"
            >
              My profile
            </Link>
          </div>
        </div>
      )}
    </PageShell>
  );
}

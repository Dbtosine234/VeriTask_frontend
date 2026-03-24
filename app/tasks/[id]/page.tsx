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
    setSuccess("");
    setError("");
  }

  const creator = useMemo(() => getUserById(task?.created_by), [task?.created_by]);
  const worker = useMemo(() => getUserById(task?.worker_id), [task?.worker_id]);

  const isPoster = !!currentUser && currentUser.id === task?.created_by;
  const isAssignedWorker = !!currentUser && currentUser.id === task?.worker_id;
  const canAccept = !!currentUser && !!task && task.status === "open" && currentUser.id !== task.created_by;
  const canFund = !!task && task.escrow_status === "unfunded" && isPoster;
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

  function renderStatusPill(label: string | null | undefined) {
    return (
      <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
        {label || "unknown"}
      </span>
    );
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
                    selected ? "bg-white text-black" : "border border-white/15 text-white/80"
                  }`}
                >
                  {user.name} · {user.role}
                </button>
              );
            })}
          </div>
        </div>

        {loading && <p className="text-sm text-white/60">Loading task...</p>}
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        {success && <p className="mb-4 text-sm text-green-400">{success}</p>}

        {task && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Task detail</p>
            <h1 className="text-3xl font-bold">{task.title}</h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {renderStatusPill(`Status: ${task.status}`)}
              {renderStatusPill(`Escrow: ${task.escrow_status || "unfunded"}`)}
              {renderStatusPill(`Reward: ${task.reward_amount} ${task.currency}`)}
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-xl border border-white/10 p-3">
                <span className="text-white/50">Task ID:</span> {task.id}
              </div>
              <div className="rounded-xl border border-white/10 p-3">
                <span className="text-white/50">Created by:</span>{" "}
                {creator ? `${creator.name} (${creator.id})` : task.created_by || "Unknown"}
              </div>
              <div className="rounded-xl border border-white/10 p-3">
                <span className="text-white/50">Assigned worker:</span>{" "}
                {worker ? `${worker.name} (${worker.id})` : task.worker_id || "Not assigned"}
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

            <div className="mt-5 rounded-xl border border-white/10 p-4">
              <p className="text-sm text-white/50">Workflow progress</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-white/50">Open</p>
                  <p className="mt-1 font-medium">
                    {["open", "accepted", "submitted", "paid"].includes(task.status)
                      ? "Yes"
                      : "No"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-white/50">Escrow funded</p>
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
                  <p className="text-white/50">Proof submitted</p>
                  <p className="mt-1 font-medium">
                    {["submitted", "paid"].includes(task.status) ? "Yes" : "No"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-white/50">Payout released</p>
                  <p className="mt-1 font-medium">{task.status === "paid" ? "Yes" : "No"}</p>
                </div>
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-white/50">You are viewing as</p>
                  <p className="mt-1 font-medium">
                    {currentUser ? `${currentUser.name} (${currentUser.role})` : "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {canFund && (
                <button
                  onClick={fundEscrow}
                  disabled={actionLoading === "fund"}
                  className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black"
                >
                  {actionLoading === "fund" ? "Funding..." : "Fund escrow"}
                </button>
              )}

              {canAccept && (
                <button
                  onClick={acceptTask}
                  disabled={actionLoading === "accept"}
                  className="w-full rounded-xl border border-white/15 px-4 py-3 font-semibold"
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
                    className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black"
                  >
                    {actionLoading === "submit" ? "Submitting..." : "Submit proof"}
                  </button>
                </div>
              )}

              {canApprove && (
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

              {!canFund && !canAccept && !canSubmit && !canApprove && (
                <div className="rounded-xl border border-white/10 p-4 text-sm text-white/60">
                  No action is available for this task under the current identity and task status.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

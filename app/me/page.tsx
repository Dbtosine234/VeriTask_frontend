"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { DEMO_USERS, DemoUser, getCurrentUser, setStoredUserId } from "../../lib/session";

type Reputation = {
  user_id: string;
  verified: boolean;
  tasks_completed: number;
  reputation_score: number;
  approval_rate: number;
  disputes: number;
  total_earned: number;
  badges: string[];
};

export default function MePage() {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [profile, setProfile] = useState<Reputation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;

    setLoading(true);
    setError("");

    apiFetch<Reputation>(`/reputation/${currentUser.id}`)
      .then(setProfile)
      .catch((err) => setError(err.message || "Failed to load reputation"))
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  function handleUserChange(userId: string) {
    setStoredUserId(userId);
    const selected = DEMO_USERS.find((user) => user.id === userId) || null;
    setCurrentUser(selected);
  }

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex gap-3">
          <Link
            href="/marketplace"
            className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-center font-medium"
          >
            Marketplace
          </Link>
          <Link
            href="/tasks/new"
            className="flex-1 rounded-xl bg-white px-4 py-3 text-center font-medium text-black"
          >
            Post a task
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
                      : "border border-white/15 text-white/80"
                  }`}
                >
                  {user.name} · {user.role}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/50">My profile</p>
          <h1 className="text-3xl font-bold">Verified human reputation</h1>

          {currentUser && (
            <div className="mt-5 rounded-xl border border-white/10 p-4">
              <p className="text-sm text-white/50">Identity</p>
              <p className="mt-1 text-lg font-semibold">{currentUser.name}</p>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-white/50">Role</p>
                  <p className="mt-1 font-medium capitalize">{currentUser.role}</p>
                </div>

                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-white/50">Wallet</p>
                  <p className="mt-1 font-medium">
                    {currentUser.wallet_connected ? "Connected" : "Not connected"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-white/50">World ID</p>
                  <p className="mt-1 font-medium capitalize">
                    {currentUser.world_id_status}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-white/50">User ID</p>
                  <p className="mt-1 font-medium">{currentUser.id}</p>
                </div>
              </div>
            </div>
          )}

          {loading && <p className="mt-4 text-sm text-white/60">Loading reputation...</p>}
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          {profile && (
            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-white/10 p-4">
                <p className="text-sm text-white/50">Verification</p>
                <p className="mt-1 text-lg font-semibold">
                  {profile.verified ? "World ID verified" : "World ID pending"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 p-4">
                  <p className="text-sm text-white/50">Tasks completed</p>
                  <p className="mt-1 text-lg font-semibold">{profile.tasks_completed}</p>
                </div>

                <div className="rounded-xl border border-white/10 p-4">
                  <p className="text-sm text-white/50">Approval rate</p>
                  <p className="mt-1 text-lg font-semibold">{profile.approval_rate}%</p>
                </div>

                <div className="rounded-xl border border-white/10 p-4">
                  <p className="text-sm text-white/50">Reputation score</p>
                  <p className="mt-1 text-lg font-semibold">
                    {profile.reputation_score} / 100
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 p-4">
                  <p className="text-sm text-white/50">Disputes</p>
                  <p className="mt-1 text-lg font-semibold">{profile.disputes}</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 p-4">
                <p className="text-sm text-white/50">Total earned</p>
                <p className="mt-1 text-lg font-semibold">{profile.total_earned} USDC</p>
              </div>

              <div className="rounded-xl border border-white/10 p-4">
                <p className="text-sm text-white/50">Badges</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.badges.length > 0 ? (
                    profile.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-white/10 px-3 py-1 text-sm"
                      >
                        {badge}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-white/60">No badges yet</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 p-4">
                <p className="text-sm text-white/50">Quick actions</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Link
                    href="/marketplace"
                    className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm"
                  >
                    Browse tasks
                  </Link>

                  <Link
                    href="/tasks/new"
                    className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm"
                  >
                    Create task
                  </Link>

                  <Link
                    href="/wallet"
                    className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm"
                  >
                    View wallet
                  </Link>

                  <Link
                    href="/activity"
                    className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm"
                  >
                    View activity
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

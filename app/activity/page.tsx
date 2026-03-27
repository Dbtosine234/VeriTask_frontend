"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { DEMO_USERS, DemoUser, getCurrentUser, setStoredUserId } from "../../lib/session";

type ActivityItem = {
  id: string;
  type: string;
  task_id: string;
  message: string;
};

type ActivityResponse = {
  user_id: string;
  items: ActivityItem[];
};

export default function ActivityPage() {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [activity, setActivity] = useState<ActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;

    setLoading(true);
    setError("");

    apiFetch<ActivityResponse>(`/activity/${currentUser.id}`)
      .then(setActivity)
      .catch((err) => setError(err.message || "Failed to load activity"))
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
            href="/me"
            className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-center font-medium"
          >
            My profile
          </Link>
          <Link
            href="/wallet"
            className="flex-1 rounded-xl bg-white px-4 py-3 text-center font-medium text-black"
          >
            Wallet
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

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/50">Activity</p>
          <h1 className="text-3xl font-bold">Recent actions</h1>

          {loading && <p className="mt-4 text-sm text-white/60">Loading activity...</p>}
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          {activity && (
            <div className="mt-5 space-y-3">
              {activity.items.length > 0 ? (
                activity.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <p className="font-medium">{item.message}</p>
                    <div className="mt-2 flex items-center justify-between text-sm text-white/60">
                      <span className="capitalize">{item.type.replaceAll("_", " ")}</span>
                      <span>{item.task_id}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-white/10 p-4 text-sm text-white/60">
                  No activity yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

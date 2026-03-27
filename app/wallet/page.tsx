"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { DEMO_USERS, DemoUser, getCurrentUser, setStoredUserId } from "../../lib/session";

type WalletTransaction = {
  id: string;
  task_id: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
};

type WalletResponse = {
  user_id: string;
  currency: string;
  pending_balance: number;
  released_balance: number;
  total_earned: number;
  transactions: WalletTransaction[];
};

export default function WalletPage() {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;

    setLoading(true);
    setError("");

    apiFetch<WalletResponse>(`/wallet/${currentUser.id}`)
      .then(setWallet)
      .catch((err) => setError(err.message || "Failed to load wallet"))
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
            href="/activity"
            className="flex-1 rounded-xl bg-white px-4 py-3 text-center font-medium text-black"
          >
            Activity
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
          <p className="text-xs text-white/50">Wallet</p>
          <h1 className="text-3xl font-bold">Earnings overview</h1>

          {loading && <p className="mt-4 text-sm text-white/60">Loading wallet...</p>}
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          {wallet && (
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 p-4">
                  <p className="text-sm text-white/50">Pending</p>
                  <p className="mt-1 text-lg font-semibold">
                    {wallet.pending_balance} {wallet.currency}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 p-4">
                  <p className="text-sm text-white/50">Released</p>
                  <p className="mt-1 text-lg font-semibold">
                    {wallet.released_balance} {wallet.currency}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 p-4">
                <p className="text-sm text-white/50">Total earned</p>
                <p className="mt-1 text-lg font-semibold">
                  {wallet.total_earned} {wallet.currency}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 p-4">
                <p className="text-sm text-white/50">Transactions</p>

                <div className="mt-3 space-y-3">
                  {wallet.transactions.length > 0 ? (
                    wallet.transactions.map((txn) => (
                      <div
                        key={txn.id}
                        className="rounded-xl border border-white/10 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{txn.title}</p>
                            <p className="mt-1 text-sm text-white/60">
                              Task ID: {txn.task_id}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {txn.amount} {txn.currency}
                            </p>
                            <p className="mt-1 text-sm text-white/60 capitalize">
                              {txn.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-white/60">No wallet transactions yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

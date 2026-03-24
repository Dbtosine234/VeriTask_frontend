export type DemoUser = {
  id: string;
  name: string;
  role: "poster" | "worker";
  world_id_status: "verified" | "pending";
  wallet_connected: boolean;
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: "user_1",
    name: "Demo Poster",
    role: "poster",
    world_id_status: "verified",
    wallet_connected: true,
  },
  {
    id: "user_2",
    name: "Demo Worker",
    role: "worker",
    world_id_status: "verified",
    wallet_connected: true,
  },
];

const STORAGE_KEY = "veritask_demo_user_id";

export function getDefaultUser(): DemoUser {
  return DEMO_USERS[1];
}

export function getStoredUserId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setStoredUserId(userId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, userId);
}

export function getCurrentUser(): DemoUser {
  const storedId = getStoredUserId();
  return DEMO_USERS.find((user) => user.id === storedId) || getDefaultUser();
}

export function getUserById(userId: string | null | undefined): DemoUser | null {
  if (!userId) return null;
  return DEMO_USERS.find((user) => user.id === userId) || null;
}

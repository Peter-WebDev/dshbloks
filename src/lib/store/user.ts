import { createSignal } from "solid-js";
import type { UserModel } from "~/generated/prisma/models";

export type User = Pick<UserModel, "id" | "email" | "name">;

export function createUserStore() {
    const [user, setUser] = createSignal<User | null>(null);

    return { user, setUser };
}
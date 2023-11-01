import type { User } from "@auth/core/types";
import { writable } from "svelte/store";

export const user = writable<User | null | undefined>(undefined);

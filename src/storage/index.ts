import type { Storage } from "./types";
import { memoryStorage } from "./memoryStorage";

export const storage: Storage = memoryStorage;

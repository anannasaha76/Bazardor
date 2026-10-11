
"use client";

import { useSyncExternalStore } from "react";
import { getBanglaDate } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function useBanglaDate(): string {
  return useSyncExternalStore(
    emptySubscribe,
    getBanglaDate,
    () => ""
  );
}

"use client";

import dynamic from "next/dynamic";

export const DynamicProtokolsForm = dynamic(
  () => import("./ProtokolsForm").then((mod) => mod.ProtokolsForm),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-zinc-500" aria-live="polite">
        Ielādē formu...
      </p>
    ),
  },
);

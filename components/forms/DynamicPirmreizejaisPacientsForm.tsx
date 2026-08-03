"use client";

import dynamic from "next/dynamic";

export const DynamicPirmreizejaisPacientsForm = dynamic(
  () =>
    import("./PirmreizejaisPacientsForm").then(
      (mod) => mod.PirmreizejaisPacientsForm,
    ),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-zinc-500" aria-live="polite">
        Ielādē formu...
      </p>
    ),
  },
);

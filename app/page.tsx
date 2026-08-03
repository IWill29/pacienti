import Link from "next/link";

import { FormNavigation } from "@/components/FormNavigation";

export default function Home() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-50 to-white">
      <main className="mx-auto flex min-h-full w-full min-w-0 max-w-5xl flex-col px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto w-full min-w-0 max-w-3xl space-y-6 sm:space-y-8">
          <header className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl">
              Dokumentu kopsavilkums
            </h1>
            <p className="text-base text-zinc-600">
              Izvēlieties formu, aizpildiet laukus un ģenerējiet AI
              kopsavilkumu kopēšanai.
            </p>
          </header>

          <FormNavigation />

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/pirmreizejais-pacients"
              className="group rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] transition hover:border-indigo-200 hover:shadow-md sm:p-6"
            >
              <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-indigo-700">
                Pirmreizējais pacients
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Anamnēzes forma — dzemdības, izglītība, darbs, ģimene, PAV.
              </p>
            </Link>
            <Link
              href="/protokols"
              className="group rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)] transition hover:border-indigo-200 hover:shadow-md sm:p-6"
            >
              <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-indigo-700">
                Protokols (uzn.nod.1)
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Psihiatriskā apskate — uzņemšanas nodaļas protokols.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

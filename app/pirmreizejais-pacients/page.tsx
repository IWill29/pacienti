import { DynamicPirmreizejaisPacientsForm } from "@/components/forms/DynamicPirmreizejaisPacientsForm";
import { FormNavigation } from "@/components/FormNavigation";

export default function PirmreizejaisPacientsPage() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-50 to-white">
      <main className="mx-auto flex min-h-full w-full min-w-0 max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-6">
          <FormNavigation />
        </div>
        <DynamicPirmreizejaisPacientsForm />
      </main>
    </div>
  );
}

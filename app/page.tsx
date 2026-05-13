import { Suspense } from "react";

import { Dashboard } from "@/components/dashboard/dashboard";

export default function Home() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading dashboard...</div>}>
      <Dashboard />
    </Suspense>
  );
}

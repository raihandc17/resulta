import { Suspense } from "react";

import DefaultDashboard from "@/components/defaultComponent/defaultDashboard";

export default function Home() {
  return (
    <main>
      <Suspense fallback={null}>
        <DefaultDashboard />
      </Suspense>
    </main>
  );
}

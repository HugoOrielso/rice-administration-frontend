"use client";

import ResultadoContent from "@/components/result/result";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando pago...</div>}>
      <ResultadoContent />
    </Suspense>
  );
}
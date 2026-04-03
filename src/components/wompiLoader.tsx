"use client";

import Script from "next/script";
import { useState } from "react";

export function WompiScriptLoader() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Script
        src="https://checkout.wompi.co/widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Wompi widget cargado");
          setLoaded(true);
        }}
      />
    </>
  );
}
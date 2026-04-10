"use client";
import Script from "next/script";

export function WompiScriptLoader() {
  return (
    <Script
      src="https://checkout.wompi.co/widget.js"
      data-render="false"
      strategy="afterInteractive"
    />
  );
}
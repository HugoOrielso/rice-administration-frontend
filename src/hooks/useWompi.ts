"use client";

import { useEffect, useState } from "react";

interface WompiState {
  sessionId: string | null;
  deviceId: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useWompi(): WompiState {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 40;
    const tryInitialize = () => {
      if (cancelled) return;

      const wompi = window.$wompi;

      if (!wompi?.initialize) {
        attempts += 1;

        if (attempts >= maxAttempts) {
          setError("No se pudo cargar Wompi.");
          setIsLoading(false);
          return;
        }

        setTimeout(tryInitialize, 250);
        return;
      }

      wompi.initialize((data, initError) => {
        if (cancelled) return;

        if (initError) {
          setError("Error al inicializar Wompi.");
          setIsLoading(false);
          return;
        }

        setSessionId(data?.sessionId ?? null);
        setDeviceId(data?.deviceData?.deviceID ?? null);
        setIsLoading(false);
      });
    };

    tryInitialize();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    sessionId,
    deviceId,
    isLoading,
    error,
  };
}
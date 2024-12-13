"use client";

import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [timerDone, setTimerDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimerDone(true);
    }, 300); // show loading only after 300ms to avoid flickering

    return () => clearTimeout(timer);
  }, []);

  if (timerDone) {
    return <strong>Loading…</strong>;
  }

  return null;
}

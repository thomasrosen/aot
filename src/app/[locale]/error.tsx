"use client"; // Error boundaries must be Client Components

import { H2, P } from "@/components/Typography";
import { useTranslations } from "@/components/client/Translation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <H2>{t("unkown-error")}</H2>
      {error.message ? (
        <P>{t("error-with-message", { message: error.message })}</P>
      ) : null}
      <br />
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        {t("try-again")}
      </Button>
    </div>
  );
}

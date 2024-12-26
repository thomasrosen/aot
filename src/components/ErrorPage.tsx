import { SubHeader } from "@/components/SubHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ErrorPage({
  title = "Error",
  error,
}: {
  title: string;
  error: string;
}) {
  return (
    <div className="lg:absolute lg:top-[64px] lg:bottom-0 lg:left-0 lg:right-0 lg:overflow-auto lg:grid lg:grid-rows-[auto_minmax(0,1fr)] lg:p-8 lg:pt-6 lg:pb-0">
      <SubHeader
        className="relative top-0"
        breadcrumb={title}
        title={title}
        actions={undefined}
      />

      <div>
        <Alert
          variant="destructive"
          className="bg-destructive text-destructive-foreground"
        >
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

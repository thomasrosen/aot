import { cn } from "@/lib/utils";
import { Marker, MarkerProps } from "@vis.gl/react-maplibre";

export function CustomMarker({
  className,
  children,
  ...props
}: { className: string; children: React.ReactNode } & MarkerProps) {
  return (
    <Marker {...props}>
      <div className="relative">
        <div
          className={cn("shadow-md size-6 bg-white rounded-full", className)}
        />
        {children}
      </div>
    </Marker>
  );
}

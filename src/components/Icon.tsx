import { cn } from "@/lib/utils";
import localFont from "next/font/local";

// Font files can be colocated inside of `app`
const MaterialSymbols = localFont({
  src: "../fonts/Material_Symbols_Outlined,Material_Symbols_Rounded,Material_Symbols_Sharp/Material_Symbols_Rounded/MaterialSymbolsRounded-VariableFont_FILL,GRAD,opsz,wght.ttf",
  variable: "--material-symbols-font",
  display: "block",
  fallback: [],
  adjustFontFallback: false,
});

export function Icon({
  name,
  className,
  size = "md",
}: {
  name: string;
  className?: string;
  size?: "md"; // "sm" | "md" | "lg";
}) {
  return (
    <span
      data-name={name}
      className={cn(
        MaterialSymbols.className,
        "iconframe",
        "inline-flex items-center justify-center leading-none",
        // size === "sm" && "w-4 h-4 text-base",
        size === "md" && "w-6 h-6 text-2xl",
        // size === "lg" && "w-8 h-8 text-3xl",
        className
      )}
    ></span>
  );
}

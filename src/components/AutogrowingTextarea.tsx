import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function AutogrowingTextarea({
  rows,
  value,
  className,
  style,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function recalcHeight() {
    if (textareaRef.current) {
      // Reset the height to calculate the correct height
      textareaRef.current.style.height = "auto";
      const newHeight = textareaRef.current.scrollHeight + "px";
      setTextareaHeight(newHeight);
    }
  }

  useEffect(() => recalcHeight(), [value]);

  return (
    <Textarea
      rows={rows || 1}
      value={value}
      className={cn("min-h-[0px] resize-none", className)}
      {...props}
      style={{ ...style, height: textareaHeight }}
      ref={textareaRef}
    />
  );
}

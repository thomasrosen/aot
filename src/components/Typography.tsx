import { cn } from "@/lib/utils";

export function H1({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h1">) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
      {...props}
    />
  );
}

export function H2({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      className={cn(
        "scroll-m-20 mb-4 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  );
}

export function H3({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function H4({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h4">) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function P({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  );
}

export function List({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  );
}

export function Lead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p className={cn("text-xl text-muted-foreground", className)} {...props} />
  );
}

export function Muted({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

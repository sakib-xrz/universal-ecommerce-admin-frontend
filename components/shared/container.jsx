import { cn } from "@/utils/cn";

export default function Container({ children, className }) {
  const containerClasses = cn(
    "mx-auto",
    "max-w-7xl",
    "px-4",
    "py-5",
    "lg:py-8",
    className,
  );

  return <div className={containerClasses}>{children}</div>;
}

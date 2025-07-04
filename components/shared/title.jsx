import { cn } from "@/utils/cn";

export default function Title({ className, title }) {
  return (
    <h2
      className={cn(
        "text-center text-2xl font-semibold text-primary",
        className,
      )}
    >
      {title}
    </h2>
  );
}

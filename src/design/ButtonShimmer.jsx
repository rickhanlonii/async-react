import { cn } from "@/lib/utils";

export default function ButtonShimmer({ isPending, long }) {
  return (
    <span
      className={cn(
        "absolute pointer-events-none inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pending shimmer",
        {
          "isPending animate-shimmer-long long": isPending && long,
          "isPending animate-shimmer": isPending && !long,
        },
      )}
    ></span>
  );
}

export function IconButtonShimmer({ isPending, children }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden h-full w-full cursor-pointer text-lg flex flex-col align-center items-center justify-center rounded-md",
      )}
    >
      {children}
      <ButtonShimmer isPending={isPending} />
    </div>
  );
}

import { useTransition } from "react";
import { Button as ShaButton } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function Button({ children, action }) {
  const [isPending, transition] = useTransition();

  function handleClick(e) {
    e.stopPropagation();
    transition(async () => {
      await action();
    });
  }
  return (
    <ShaButton onClick={handleClick}>
      {isPending ? <Spinner /> : children}
    </ShaButton>
  );
}

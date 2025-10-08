import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import ButtonShimmer from "./ButtonShimmer.jsx";
import { startTransition, useOptimistic } from "react";
import { cn } from "@/lib/utils";

export default function SearchInput({ value, changeAction }) {
  const [inputValue, setInputValue] = useOptimistic(value);
  const isPending = inputValue !== value;
  function handleChange(e) {
    const newValue = e.target.value;
    startTransition(async () => {
      setInputValue(newValue);
      await changeAction(newValue);
    });
  }

  return (
    <div className="px-8">
      <InputGroup className="relative overflow-hidden">
        <InputGroupInput
          placeholder="Search..."
          value={inputValue}
          onChange={handleChange}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon
          align="inline-end"
          className={cn("pending", { "isPending long": isPending })}
        >
          <Spinner />
        </InputGroupAddon>
        <ButtonShimmer isPending={isPending} long />
      </InputGroup>
    </div>
  );
}

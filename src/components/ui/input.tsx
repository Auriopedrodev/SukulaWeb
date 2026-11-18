// Campo de texto (shadcn/ui) simples, sem borda: a borda fica na caixa à volta (ver components/Campo.tsx).
import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-full w-full min-w-0 bg-transparent text-sm font-medium text-fundo outline-none placeholder:font-normal placeholder:text-texto-exemplo disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export { Input };

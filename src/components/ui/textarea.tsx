// Caixa de texto com várias linhas (shadcn/ui), com o estilo dos formulários do Figma.
import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-xl border border-borda-campo bg-white px-[15px] py-3.5 text-sm font-medium leading-[21px] text-fundo outline-none focus:border-[1.5px] focus:border-azul",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };

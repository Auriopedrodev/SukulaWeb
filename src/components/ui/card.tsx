// Cartão (shadcn/ui). No Figma os cartões são brancos com borda azul e cantos de 16px.
import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-2xl border border-painel-borda bg-white", className)} {...props} />;
}

export { Card };

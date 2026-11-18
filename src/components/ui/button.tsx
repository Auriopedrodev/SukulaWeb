// Botão (shadcn/ui) com as cores dos botões do Figma.
// Uso:  <Button variant="escuro">Guardar</Button>
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-[18px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        escuro: "bg-fundo text-white", // "Guardar alterações"
        claro: "bg-claro text-fundo", // "Adicionar ...", "Editar ..."
        branco: "border border-borda bg-white text-fundo", // "Cancelar" nas janelas
        perigo: "bg-perigo text-white", // "Remover"
        painel: "border border-painel-borda bg-painel text-claro", // "Filtrar", "Cancelar" ao remover
        azul: "bg-azul text-white", // "Adicionar serviço"
      },
      size: {
        normal: "h-11 px-[18px]",
        pequeno: "h-10 px-[18px]",
        grande: "h-12 w-full px-5",
      },
    },
    defaultVariants: { variant: "escuro", size: "normal" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };

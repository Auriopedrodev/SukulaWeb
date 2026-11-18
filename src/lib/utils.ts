// Pequenas funções de ajuda usadas em várias páginas.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Junta classes do Tailwind (usado pelos componentes shadcn/ui).
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

// 1000 -> "1.000 Kz"
export function formatarKz(valor: number) {
  return formatarNumero(valor) + " Kz";
}

// 1248 -> "1.248"
export function formatarNumero(valor: number) {
  return String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Iniciais para os avatares (como no Figma):
//   "Nelson Tchipa" -> "NT"     "Lava Express Kilamba" -> "LE"
//   "Lavandaria Sol Nascente" -> "SN"     "Lavandaria Lavimpa" -> "LL"
//   "Sukulinha" -> "SK" (uma só palavra: 1.ª letra + 1.ª consoante seguinte)
export function iniciais(nome: string) {
  let palavras = nome.trim().split(" ").filter((p) => p !== "");
  if (palavras[0] === "Lavandaria" && palavras.length > 2) palavras = palavras.slice(1);
  if (palavras.length >= 2) return (palavras[0][0] + palavras[1][0]).toUpperCase();
  const palavra = palavras[0] ?? "";
  const consoante = palavra.slice(1).match(/[^aeiouáàâãéêíóôõú]/i)?.[0] ?? palavra[1] ?? "";
  return (palavra[0] + consoante).toUpperCase();
}

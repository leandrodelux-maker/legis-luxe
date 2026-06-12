import { useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

function initials(nome: string) {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

type Props = {
  nome: string;
  foto?: string | null;
  size?: number;
  className?: string;
  rounded?: "full" | "lg" | "xl" | "2xl";
};

/**
 * Avatar institucional para vereadores, com fallback em cascata:
 * 1) foto (signed/public URL)
 * 2) iniciais do nome
 * 3) ícone genérico (User)
 *
 * Erros de carregamento são reportados em console.error.
 */
export function VereadorAvatar({
  nome,
  foto,
  size = 64,
  className,
  rounded = "full",
}: Props) {
  const [errored, setErrored] = useState(false);
  const ini = initials(nome || "?");
  const radius = {
    full: "rounded-full",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
  }[rounded];

  const showImage = foto && !errored;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0",
        radius,
        className,
      )}
      style={{ width: size, height: size }}
      aria-label={nome}
    >
      {showImage ? (
        <img
          src={foto!}
          alt={nome}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={() => {
            console.error("[VereadorAvatar] Falha ao carregar imagem", { nome, foto });
            setErrored(true);
          }}
        />
      ) : ini ? (
        <span
          className="font-display font-bold text-primary"
          style={{ fontSize: Math.max(12, size * 0.36) }}
        >
          {ini}
        </span>
      ) : (
        <User className="text-primary/40" style={{ width: size * 0.5, height: size * 0.5 }} />
      )}
    </div>
  );
}

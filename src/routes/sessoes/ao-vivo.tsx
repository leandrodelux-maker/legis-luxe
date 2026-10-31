import { createFileRoute, redirect } from "@tanstack/react-router";

// A transmissão fica na página de Sessões, com o canal cadastrado no painel.
export const Route = createFileRoute("/sessoes/ao-vivo")({
  beforeLoad: () => {
    throw redirect({ to: "/sessoes", replace: true });
  },
});

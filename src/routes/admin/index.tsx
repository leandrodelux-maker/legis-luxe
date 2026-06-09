import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  beforeLoad: ({ navigate }) => {
    throw navigate({ to: "/admin/dashboard", replace: true });
  },
});

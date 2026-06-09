import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sessoes/ao-vivo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sessoes/ao-vivo"!</div>
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sessoes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sessoes/"!</div>
}

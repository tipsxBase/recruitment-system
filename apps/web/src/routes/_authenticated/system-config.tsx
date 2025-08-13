import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/system-config')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/system-config"!</div>
}

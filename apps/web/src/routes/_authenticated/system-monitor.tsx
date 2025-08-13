import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/system-monitor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/system-monitor"!</div>
}

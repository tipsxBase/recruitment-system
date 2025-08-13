import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/org-system-manage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/org-system-manage"!</div>
}

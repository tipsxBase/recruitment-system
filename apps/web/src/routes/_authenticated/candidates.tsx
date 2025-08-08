import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/candidates')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/candidates"!</div>
}

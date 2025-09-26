import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="space-y-4 p-8">Dashboard</div>
}

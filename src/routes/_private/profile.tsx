import { createFileRoute } from '@tanstack/react-router'

import { Container } from '@/components/elements/container'

export const Route = createFileRoute('/_private/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Container requiredPermission="read" module="me" title="My Profile" className="w-full px-8 sm:px-16"></Container>
    </>
  )
}

import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="from-background via-background to-primary-100/30 relative flex min-h-screen w-full bg-radial-[at_50%_75%] to-90% md:h-screen">
        <div className="absolute top-10 right-10">
          <img src="/logo-full.png" className="w-[80px]" />
        </div>
        <div className="bg-muted relative m-5 w-1/2 rounded-xl">
          <div className="absolute top-4 left-4">
            <img src="/logo320.png" className="w-[40px]" />
          </div>
        </div>
        <div className="flex h-full w-1/2 items-center justify-center py-18 md:py-0">
          <Outlet />
        </div>
      </div>
    </>
  )
}

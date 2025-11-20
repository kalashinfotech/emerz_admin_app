import { Outlet, createFileRoute } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="from-background via-background to-primary-100/30 relative flex min-h-screen w-full flex-col-reverse bg-radial-[at_50%_75%] to-90% md:h-screen md:flex-row">
        <div className="absolute top-10 right-10">
          <img src="/logo-full.png" className="w-[80px]" />
        </div>
        <div className="relative h-screen w-full bg-transparent md:w-1/2">
          <div
            className={cn(
              'from-muted via-foreground to-muted absolute top-10 left-[5%] h-px w-[90%]',
              '[-webkit-mask:repeating-linear-gradient(90deg,#000_0_4px,transparent_4px_8px)]',
              'bg-gradient-to-r [mask:repeating-linear-gradient(90deg,#000_0_4px,transparent_4px_8px)]',
            )}
          />
          <div
            className={cn(
              'from-muted via-foreground to-muted absolute top-[3%] left-[8%] h-[96%] w-px',
              '[-webkit-mask:repeating-linear-gradient(0deg,#000_0_4px,transparent_4px_8px)]',
              'bg-gradient-to-b [mask:repeating-linear-gradient(0deg,#000_0_4px,transparent_4px_8px)]',
            )}
          />
          <div
            className={cn(
              'from-muted via-foreground to-muted absolute bottom-10 left-[5%] h-px w-[90%]',
              '[-webkit-mask:repeating-linear-gradient(90deg,#000_0_4px,transparent_4px_8px)]',
              'bg-gradient-to-r [mask:repeating-linear-gradient(90deg,#000_0_4px,transparent_4px_8px)]',
            )}
          />
          <div
            className={cn(
              'from-muted via-foreground to-muted absolute top-[3%] right-[8%] h-[96%] w-px',
              '[-webkit-mask:repeating-linear-gradient(0deg,#000_0_4px,transparent_4px_8px)]',
              'bg-gradient-to-b [mask:repeating-linear-gradient(0deg,#000_0_4px,transparent_4px_8px)]',
            )}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-serif text-xl">
            <p>
              Every idea is a seed.
              <br /> Your wisdom helps it grow.
            </p>
          </div>
          <div className="absolute top-12 left-18">
            <img src="/logo320.png" className="w-[40px]" />
          </div>
        </div>
        <div className="flex h-screen w-full items-center justify-center py-18 md:w-1/2 md:py-0">
          <Outlet />
        </div>
      </div>
    </>
  )
}

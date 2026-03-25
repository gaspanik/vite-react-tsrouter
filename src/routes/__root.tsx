import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SquareCode } from 'lucide-react'

const RootLayout = () => (
  <>
    <header className="top-0 z-10 sticky flex gap-2 bg-white shadow-xs p-2 border-slate-100 border-b">
      <SquareCode className="-mr-1 w-4 h-4" />
      <nav className="font-light text-xs">
        <ul className="flex sm:flex-row flex-col gap-2">
          <li>
            <Link
              to="/"
              className="font-bold [&.active]:font-bold text-slate-500 hover:text-blue-800 [&.active]:text-blue-600"
            >
              Tanstack Router Home
            </Link>{' '}
          </li>
          <li>
            <Link
              to="/about"
              className="font-bold [&.active]:font-bold text-slate-500 hover:text-blue-800 [&.active]:text-blue-600"
            >
              About
            </Link>{' '}
          </li>
        </ul>
      </nav>
    </header>
    <div className="p-2">
      <Outlet />
    </div>
    <TanStackRouterDevtools position="bottom-right" />
  </>
)

export const Route = createRootRoute({ component: RootLayout })

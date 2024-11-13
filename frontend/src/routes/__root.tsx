import { Outlet, createRootRoute } from "@tanstack/react-router"
import { Suspense } from "react"

import NotFound from "../components/Common/NotFound"

const TanStackDevtools = () => null

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Suspense>
        <TanStackDevtools />
      </Suspense>
    </>
  ),
  notFoundComponent: () => <NotFound />,
})

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from '@/routeTree.gen'

// Import global styles w/ Tailwind CSS
import '@/index.css'

// Create a new router instance
const router = createRouter({
  routeTree,
  // Set the base path for the router, if building with a base path other than `/`
  // use the build option: `--base=/some-path/` to set this value
  basepath: import.meta.env.BASE_URL,
  // scroll restoration behavior
  defaultPreload: 'intent',
  scrollRestoration: true,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

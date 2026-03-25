import { createFileRoute, Link } from '@tanstack/react-router'
import { FileBraces } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="flex flex-col justify-center items-center bg-white p-6 min-h-[90vh]">
      {/* Page specific title */}
      <title>About | React w/ Tanstack Router Starter</title>
      <meta name="description" content="Learn more about this React setup with Tanstack Router and Tailwind CSS v4." />

      <div className="flex flex-col items-start gap-1 w-full md:w-1/2">
        <div className="flex items-center gap-2">
          <FileBraces className="w-6 h-6" />
          <h1 className="font-medium text-neutral-900 text-xl">I am the about page!</h1>
        </div>
        <p className="mt-2 mb-4 text-neutral-500 text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit temporibus eaque asperiores sint, eos
          molestiae quae hic nisi neque sapiente voluptas esse aperiam numquam iure, exercitationem aliquam aspernatur
          voluptatem consequuntur!
        </p>
        <p className="mb-6 font-normal text-sm">
          <Link to="/" className="text-neutral-500 hover:text-blue-600 hover:underline">
            Go back home
          </Link>
        </p>
      </div>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { SquareCode, Square, CheckSquare2 } from 'lucide-react'
import { Button } from '@/components/ButtonCn'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex flex-col justify-center items-center bg-white p-6 min-h-[90vh]">
      {/* Page specific title */}
      <title>React w/ Tanstack Router</title>
      <meta
        name="description"
        content="A modern React setup with TypeScript, SWC compiler, Tanstack Router, Tailwind CSS v4, and Lucide icons."
      />

      <div className="flex flex-col items-start gap-1 w-full md:w-1/2">
        <div className="flex items-center gap-2">
          <SquareCode className="w-6 h-6" />
          <h1 className="font-medium text-neutral-900 text-xl">React + Tanstack Router and Tailwind CSS v4 Starter</h1>
        </div>
        <p className="mt-2 mb-4 text-neutral-500 text-sm">
          A modern React setup with TypeScript, SWC compiler, Tanstack Router, Tailwind CSS v4, and Lucide icons.
          Guidelines included :D — GitHub Copilot and Gemini —
        </p>
        <p className="mb-6 font-medium text-neutral-600 text-sm">
          Get started by editing <code>`src/routes/index.tsx`</code>
        </p>
        <h2 className="mb-3 font-semibold text-neutral-800 text-base">
          Shadcn/ui `cn` utility function to conditionally join classNames.
        </h2>
        <div className="my-1">
          {/* Demonstrate active state styling */}
          <Button active>
            <CheckSquare2 className="mr-1 w-4 h-4" />
            Button w/ active
          </Button>
          {` `}
          {/* Demonstrate override of tailwind classes */}
          <Button className="bg-neutral-50" disabled>
            <Square className="mr-1 w-4 h-4" />
            Button w/ disabled
          </Button>
        </div>
      </div>
    </div>
  )
}

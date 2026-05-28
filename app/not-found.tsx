import Link from "next/link"
import { ArrowLeft, FileQuestion } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6">
        <div className="rounded-2xl bg-primary/10 p-4 text-primary">
          <FileQuestion className="size-12" />
        </div>
        <h1 className="text-6xl font-bold tracking-tighter">404</h1>
        <p className="text-lg font-medium text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className={buttonVariants()}>
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </div>
    </main>
  )
}

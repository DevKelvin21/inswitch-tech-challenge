import { createFileRoute } from '@tanstack/react-router'
import { InfiniteScrollContainer } from '../components/features/InfiniteScroll/containers/InfiniteScrollContainer'
import { defaultScrollConfig } from '../components/features/InfiniteScroll/config/scrollConfig'

export const Route = createFileRoute('/infinite-scroll')({
  component: InfiniteScrollPage,
})

function InfiniteScrollPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <InfiniteScrollContainer config={defaultScrollConfig} />
    </div>
  )
}

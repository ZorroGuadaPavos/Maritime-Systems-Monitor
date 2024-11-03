import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/vessels/$vesselId')({
  component: () => <div>Hello /_layout/vessels/$vesselId!</div>
})
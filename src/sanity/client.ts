import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'wj66bxat',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
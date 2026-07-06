import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

// Orphan media uploads not referenced by any book: inspired.jpg (20), designasart-1.jpg (47)
const ids = [20, 47]

for (const id of ids) {
  try {
    const doc = await payload.findByID({ collection: 'media', id })
    console.log(`deleting media ${id} -> ${doc.filename}`)
    await payload.delete({ collection: 'media', id })
    console.log(`  deleted ${id}`)
  } catch (err) {
    console.log(`  skip ${id}: ${(err as Error).message}`)
  }
}

const remaining = await payload.count({ collection: 'media' })
console.log(`media docs remaining: ${remaining.totalDocs}`)
process.exit(0)

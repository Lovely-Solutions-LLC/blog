import fs from 'fs/promises'
import path from 'path'
import StartupsClient from './StartupsClient'

type Row = Record<string, string>

type CsvResult = {
  headers: string[]
  rows: Row[]
}

async function loadCsv(): Promise<CsvResult> {
  const csvPath = path.join(
    process.cwd(),
    'public',
    'startups',
    'data-in-use.csv'
  )
  const file = await fs.readFile(csvPath, 'utf8')

  const lines = file.trim().split('\n')
  if (lines.length === 0) {
    return { headers: [], rows: [] }
  }

  const headerLine = lines[0]
  const headers = headerLine.split(',').map((h) => h.trim())

  const rows: Row[] = lines
    .slice(1)
    .filter((l) => l.trim().length > 0)
    .map((line) => {
      const cols = line.split(',')
      const obj: Row = {}
      headers.forEach((h, i) => {
        obj[h] = (cols[i] ?? '').trim()
      })
      return obj
    })

  return { headers, rows }
}

export const metadata = {
  title: 'NYC Startups Directory',
}

export default async function StartupsPage() {
  const { headers, rows } = await loadCsv()

  return (
    <div className="su-root">
      <header className="su-header">
        <div className="su-wrap">
          <h1>NYC Startups Directory</h1>
          <div className="su-sub">Search matches across all columns.</div>
        </div>
      </header>

      <main className="su-wrap">
        <StartupsClient headers={headers} rows={rows} />
      </main>
    </div>
  )
}

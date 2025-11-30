import fs from 'fs/promises'
import path from 'path'
import StartupsClient from './StartupsClient'

type Row = Record<string, string>

type CsvResult = {
  headers: string[]      // columns we actually display
  rows: Row[]            // filtered rows
}

const norm = (s: string) =>
  (s ?? '')
    .replace(/^\uFEFF/, '') // strip BOM
    .trim()
    .toLowerCase()

async function loadCsv(): Promise<CsvResult> {
  const csvPath = path.join(
    process.cwd(),
    'public',
    'startups',
    'data-in-use.csv'
  )

  let file = await fs.readFile(csvPath, 'utf8')
  file = file.replace(/^\uFEFF/, '')

  const lines = file.trim().split('\n')
  if (lines.length === 0) {
    return { headers: [], rows: [] }
  }

  // First line: full header list, including our control column "Header"
  const headerLine = lines[0]
  const allHeaders = headerLine.split(',').map((h) => h.trim())

  // The meta/control column we'll use to hide rows
  const metaKey =
    allHeaders.find((h) => h.toLowerCase() === 'header') ?? null

  // Columns we actually render in the table (everything except "Header")
  const displayHeaders = allHeaders.filter(
    (h) => h.toLowerCase() !== 'header'
  )

  const allRows: Row[] = lines
    .slice(1)
    .filter((l) => l.trim().length > 0)
    .map((line) => {
      const cols = line.split(',')
      const obj: Row = {}
      allHeaders.forEach((h, i) => {
        obj[h] = (cols[i] ?? '').trim()
      })
      return obj
    })

  // Filter out any row explicitly marked as header in the meta column
  const rows = allRows.filter((row) => {
    if (!metaKey) return true
    const v = norm(row[metaKey] ?? '')
    return v !== 'header'
  })

  return { headers: displayHeaders, rows }
}

export const metadata = {
  title: 'Startups Directory',
}

export default async function StartupsPage() {
  const { headers, rows } = await loadCsv()

  return (
    <div className="su-root">
      <header className="su-header">
        <div className="su-wrap">
          <h1>Startups Directory</h1>
          <div className="su-sub">I built this list and used it while job hunting, and wanted to make it public so others can use it. Everything currently in this list is hiring for at least one role in NYC. Many are hiring in other locations, as well as for remote roles.</div>
        </div>
      </header>

      <main className="su-wrap">
        <StartupsClient headers={headers} rows={rows} />
      </main>
    </div>
  )
}

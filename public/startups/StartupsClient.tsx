'use client'

import { useMemo, useState } from 'react'

type Row = Record<string, string>

type Props = {
  headers: string[]
  rows: Row[]
}

const norm = (s: string) =>
  (s ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()

export default function StartupsClient({ headers, rows }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return rows
    const nq = norm(query)
    return rows.filter((row) =>
      headers.some((h) => norm(row[h] ?? '').includes(nq))
    )
  }, [headers, rows, query])

  return (
    <div className="su-card">
      <div className="su-meta">
        <span>Source: data-in-use.csv</span>
        <span>{headers.length} columns</span>
      </div>

      <div className="su-searchbar">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or website url"
          autoComplete="off"
          className="su-input"
        />
        <span className="su-pill">{filtered.length}</span>
      </div>

      <div className="su-table-wrap">
        <table className="su-table">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={idx}>
                {headers.map((h) => {
                  const val = row[h] ?? ''
                  const isUrl = /^(https?:)?\/\//.test(val)

                  return (
                    <td key={h}>
                      {isUrl ? (
                        <a
                          href={val.startsWith('http') ? val : `https://${val}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {val}
                        </a>
                      ) : (
                        val
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

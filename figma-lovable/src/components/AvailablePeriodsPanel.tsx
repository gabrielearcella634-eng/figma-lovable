import { useState, useEffect } from "react"
import { X, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Constants ──────────────────────────────────────────────────────────────

const MIN_YEAR = 1900
const MAX_YEAR = 2100

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
]

const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

// Mock available day-counts per year per month
function getAvailableCount(_year: number, _month: number): number {
  return 0
}

// ── Mini month calendar ────────────────────────────────────────────────────

function MiniMonth({ year, monthIndex }: { year: number; monthIndex: number }) {
  const firstDay = new Date(year, monthIndex, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const count = getAvailableCount(year, monthIndex)

  // Shift so Monday is first (0=Mon … 6=Sun)
  const offset = (firstDay + 6) % 7

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="border border-gray-200 rounded-lg bg-white p-3 flex flex-col gap-2">
      {/* Month title + count badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700">{MONTHS[monthIndex]}</span>
        {count > 0 ? (
          <span className="text-[10px] bg-blue-100 text-blue-600 font-semibold px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        ) : (
          <span className="text-[10px] text-gray-300 font-medium">—</span>
        )}
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-px">
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <span key={i} className="text-[9px] text-center text-gray-400 font-medium">{d}</span>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-px">
        {cells.map((day, i) => (
          <div
            key={i}
            className={cn(
              "text-[10px] text-center rounded-sm py-0.5 leading-4",
              day === null
                ? ""
                : "text-gray-300 cursor-default select-none"
            )}
          >
            {day ?? ""}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Panel ──────────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  onClose: () => void
}

export default function AvailablePeriodsPanel({ open, onClose }: Props) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [inputYear, setInputYear] = useState(String(new Date().getFullYear()))
  const [visible, setVisible] = useState(false)

  const clamp = (y: number) => Math.max(MIN_YEAR, Math.min(MAX_YEAR, y))

  const applyYear = (raw: string) => {
    const n = parseInt(raw, 10)
    if (!isNaN(n)) {
      const clamped = clamp(n)
      setSelectedYear(clamped)
      setInputYear(String(clamped))
    } else {
      setInputYear(String(selectedYear))
    }
  }

  // Drive the slide-in/out animation
  useEffect(() => {
    if (open) {
      // small delay so the transition fires after mount
      const t = setTimeout(() => setVisible(true), 10)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open && !visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Slide panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-2xl bg-gray-50 shadow-2xl flex flex-col",
          "transition-transform duration-300 ease-in-out",
          visible ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 py-5 bg-white border-b border-gray-200 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium tracking-wide uppercase">Location</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Marseille</h2>
            <p className="text-sm text-gray-500 mt-0.5">Available sailing periods</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 mt-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Year selector ── */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-700">Year</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const y = clamp(selectedYear - 1)
                setSelectedYear(y)
                setInputYear(String(y))
              }}
              disabled={selectedYear <= MIN_YEAR}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            <input
              type="number"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={inputYear}
              onChange={(e) => setInputYear(e.target.value)}
              onBlur={(e) => applyYear(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") applyYear(inputYear) }}
              className="w-20 text-center border border-gray-200 rounded-md py-1.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            <button
              onClick={() => {
                const y = clamp(selectedYear + 1)
                setSelectedYear(y)
                setInputYear(String(y))
              }}
              disabled={selectedYear >= MAX_YEAR}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>

          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto sidebar-scroll px-6 py-5 space-y-6">

          {/* Monthly calendar grid */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Monthly overview · {selectedYear}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MONTHS.map((_, i) => (
                <MiniMonth key={i} year={selectedYear} monthIndex={i} />
              ))}
            </div>
          </div>

          {/* Empty data table */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Available periods · {selectedYear}
            </h3>

            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Month</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Start date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">End date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Days</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MONTH_SHORT.map((m, i) => (
                    <tr key={m} className={cn("border-b border-gray-100 last:border-0", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                      <td className="px-4 py-3 text-gray-400 font-medium">{m}</td>
                      <td className="px-4 py-3 text-gray-300">—</td>
                      <td className="px-4 py-3 text-gray-300">—</td>
                      <td className="px-4 py-3 text-gray-300">—</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-gray-300 bg-gray-100 px-2 py-0.5 rounded-full">
                          No data
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

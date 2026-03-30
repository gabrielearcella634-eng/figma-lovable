import { useState } from "react"
import { Filter, ChevronUp, ChevronDown, Clock, ExternalLink, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import AvailablePeriodsPanel from "@/components/AvailablePeriodsPanel"

// ── Types ──────────────────────────────────────────────────────────────────

type RangeValues = {
  minSpeed: number
  maxSpeed: number
  minDir: number
  maxDir: number
}

// ── Helpers ────────────────────────────────────────────────────────────────

const HOURS = Array.from({ length: 24 }, (_, i) =>
  `${String(i).padStart(2, "0")}:00`
)

const MOCK_DATES = [
  "Mar 23, 2026",
  "Mar 22, 2026",
  "Mar 21, 2026",
  "Mar 20, 2026",
  "Mar 19, 2026",
  "Mar 18, 2026",
]

// ── Sub-components ─────────────────────────────────────────────────────────

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <label className="text-[11px] text-gray-500 leading-none">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-gray-200 rounded-md px-2 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white transition"
      />
    </div>
  )
}

function TimeSelect({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] text-gray-500">{label}</label>
      <div className="relative">
        <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-gray-200 rounded-md pl-8 pr-8 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer transition"
        >
          <option value="">{placeholder}</option>
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function FilterSidebar() {
  const [wind, setWind] = useState<RangeValues>({
    minSpeed: 0,
    maxSpeed: 50,
    minDir: 0,
    maxDir: 360,
  })

  const [current, setCurrent] = useState<RangeValues>({
    minSpeed: 0,
    maxSpeed: 5,
    minDir: 0,
    maxDir: 360,
  })

  const [timeRange, setTimeRange] = useState({ start: "", end: "" })

  const [dateRange, setDateRange] = useState({
    start: "01/01/2022",
    end: "25/03/2026",
  })

  const [matchingDates, setMatchingDates] = useState<string[] | null>(null)
  const [checkedDates, setCheckedDates] = useState<Set<string>>(new Set())
  const [periodsOpen, setPeriodsOpen] = useState(false)

  const handleShowDates = () => {
    setMatchingDates(MOCK_DATES)
    setCheckedDates(new Set())
  }

  const toggleDate = (date: string) => {
    setCheckedDates((prev) => {
      const next = new Set(prev)
      if (next.has(date)) next.delete(date)
      else next.add(date)
      return next
    })
  }

  const selectAll = () => setCheckedDates(new Set(MOCK_DATES))
  const clearAll = () => setCheckedDates(new Set())

  return (
    <aside className="h-full flex flex-col bg-gray-50 min-w-0">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto sidebar-scroll p-4 space-y-3">
        {/* Header */}
        <div className="mb-1">
          <div className="flex items-center gap-2 mb-0.5">
            <Filter className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-blue-700">Filters</h2>
          </div>
          <p className="text-xs text-gray-500 pl-6">Configure filters to analyze sailing data</p>
        </div>

        {/* Wind */}
        <SectionCard title="Wind">
          <div className="grid grid-cols-2 gap-3 mt-3">
            <NumberInput label="Min speed (kt)" value={wind.minSpeed} min={0}
              onChange={(v) => setWind((w) => ({ ...w, minSpeed: v }))} />
            <NumberInput label="Max speed (kt)" value={wind.maxSpeed} min={0}
              onChange={(v) => setWind((w) => ({ ...w, maxSpeed: v }))} />
            <NumberInput label="Min direction (°)" value={wind.minDir} min={0} max={360}
              onChange={(v) => setWind((w) => ({ ...w, minDir: v }))} />
            <NumberInput label="Max direction (°)" value={wind.maxDir} min={0} max={360}
              onChange={(v) => setWind((w) => ({ ...w, maxDir: v }))} />
          </div>
        </SectionCard>

        {/* Current */}
        <SectionCard title="Current">
          <div className="grid grid-cols-2 gap-3 mt-3">
            <NumberInput label="Min speed (kt)" value={current.minSpeed} min={0}
              onChange={(v) => setCurrent((c) => ({ ...c, minSpeed: v }))} />
            <NumberInput label="Max speed (kt)" value={current.maxSpeed} min={0}
              onChange={(v) => setCurrent((c) => ({ ...c, maxSpeed: v }))} />
            <NumberInput label="Min direction (°)" value={current.minDir} min={0} max={360}
              onChange={(v) => setCurrent((c) => ({ ...c, minDir: v }))} />
            <NumberInput label="Max direction (°)" value={current.maxDir} min={0} max={360}
              onChange={(v) => setCurrent((c) => ({ ...c, maxDir: v }))} />
          </div>
        </SectionCard>

        {/* Time Range */}
        <SectionCard title="Time Range">
          <div className="space-y-3 mt-3">
            <TimeSelect
              label="Start Time"
              value={timeRange.start}
              onChange={(v) => setTimeRange((t) => ({ ...t, start: v }))}
              placeholder="Start"
            />
            <TimeSelect
              label="End Time"
              value={timeRange.end}
              onChange={(v) => setTimeRange((t) => ({ ...t, end: v }))}
              placeholder="End"
            />
          </div>
        </SectionCard>

        {/* Date Range */}
        <SectionCard title="Date Range">
          <div className="space-y-3 mt-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-gray-500">Start date</label>
              <input
                type="text"
                value={dateRange.start}
                placeholder="DD/MM/YYYY"
                onChange={(e) => setDateRange((d) => ({ ...d, start: e.target.value }))}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-gray-500">End date</label>
              <input
                type="text"
                value={dateRange.end}
                placeholder="DD/MM/YYYY"
                onChange={(e) => setDateRange((d) => ({ ...d, end: e.target.value }))}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>

            <button
              onClick={() => setPeriodsOpen(true)}
              className="w-full flex items-center justify-center gap-2 border border-blue-200 rounded-md py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-colors font-medium"
            >
              <CalendarDays className="w-4 h-4" />
              View available periods
            </button>

            <button
              onClick={handleShowDates}
              className="w-full border border-gray-300 rounded-md py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium"
            >
              Show matching dates
            </button>

            {/* Matching dates list */}
            {matchingDates !== null && (
              <div className="mt-1">
                {/* Count + subtitle */}
                <p className="text-sm font-semibold text-blue-600 mb-0.5">
                  Available dates ({matchingDates.length})
                </p>
                <p className="text-[11px] text-gray-500 mb-2">Based on selected filters</p>

                {/* Scrollable date list */}
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="max-h-[180px] overflow-y-auto sidebar-scroll divide-y divide-gray-100">
                    {matchingDates.map((date) => (
                      <div
                        key={date}
                        className="flex items-center justify-between px-3 py-2.5 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={checkedDates.has(date)}
                            onChange={() => toggleDate(date)}
                            className={cn(
                              "w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer flex-shrink-0"
                            )}
                          />
                          <span className="text-sm text-gray-700 truncate">{date}</span>
                        </label>
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 ml-2 flex-shrink-0"
                        >
                          Open
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select all / Clear */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={selectAll}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Select all
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Sticky footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg py-3 text-sm transition-colors shadow-sm">
          Create stats (all dates)
        </button>
      </div>

      {/* Available periods slide panel */}
      <AvailablePeriodsPanel open={periodsOpen} onClose={() => setPeriodsOpen(false)} />
    </aside>
  )
}

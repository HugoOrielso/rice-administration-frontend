import { useState, useRef, useEffect } from "react";
import { Building2, MapPin, Globe, ChevronDown, Search } from "lucide-react";
import { LATAM_COUNTRIES, LOCATION_BY_COUNTRY } from "./locationInfo";

interface LocationSelectorProps {
  city: string;
  region: string;
  country: string;
  onCityChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onCountryChange: (value: string) => void;
}


function useDropdown() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return { open, setOpen, query, setQuery, ref };
}


function FieldWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}


function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (name: string) => void;
}) {
  const { open, setOpen, query, setQuery, ref } = useDropdown();

  const selected = LATAM_COUNTRIES.find((c) => c.name === value);

  const filtered = LATAM_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase())
  );

  function pick(name: string) {
    onChange(name);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-600"
      >
        <Globe className="h-4 w-4 shrink-0 text-slate-400" />
        {selected ? (
          <span className="flex flex-1 items-center gap-2 text-left">
            <span>{selected.flag}</span>
            <span>{selected.name}</span>
          </span>
        ) : (
          <span className="flex-1 text-left text-slate-400">Selecciona un país</span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-2xl border border-slate-200 bg-white shadow-lg">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar país..."
              className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-2 text-sm text-slate-400">Sin resultados</li>
            )}
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => pick(c.name)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition hover:bg-emerald-50 ${
                    c.name === value ? "font-medium text-emerald-700" : "text-slate-800"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span className="flex-1 text-left">{c.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── DepartmentSelect ──────────────────────────────────────────────────────────

function DepartmentSelect({
  value,
  onChange,
  onCityReset,
  optionsMap,
  label = "Departamento / Región",
}: {
  value: string;
  onChange: (dep: string) => void;
  onCityReset: () => void;
  optionsMap: Record<string, string[]>;
  label?: string;
}) {
  const { open, setOpen, query, setQuery, ref } = useDropdown();

  const departments = Object.keys(optionsMap).sort();
  const filtered = departments.filter((d) =>
    d.toLowerCase().includes(query.toLowerCase())
  );

  function pick(dep: string) {
    onChange(dep);
    onCityReset();
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-600"
      >
        <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
        <span className={`flex-1 text-left ${value ? "text-slate-900" : "text-slate-400"}`}>
          {value || label}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Buscar ${label.toLowerCase()}...`}
              className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-2 text-sm text-slate-400">Sin resultados</li>
            )}
            {filtered.map((dep) => (
              <li key={dep}>
                <button
                  type="button"
                  onClick={() => pick(dep)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition hover:bg-emerald-50 ${
                    dep === value ? "font-medium text-emerald-700" : "text-slate-800"
                  }`}
                >
                  {dep}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── CitySelect ────────────────────────────────────────────────────────────────

function CitySelect({
  value,
  department,
  onChange,
  optionsMap,
}: {
  value: string;
  department: string;
  onChange: (city: string) => void;
  optionsMap: Record<string, string[]>;
}) {
  const { open, setOpen, query, setQuery, ref } = useDropdown();

  const cities = department ? optionsMap[department] ?? [] : [];
  const filtered = cities.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  function pick(city: string) {
    onChange(city);
    setOpen(false);
    setQuery("");
  }

  if (!department) {
    return (
      <div className="relative">
        <Building2 className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe tu ciudad"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
        />
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-600"
      >
        <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
        <span className={`flex-1 text-left ${value ? "text-slate-900" : "text-slate-400"}`}>
          {value || "Selecciona una ciudad"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar ciudad..."
              className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-2 text-sm text-slate-400">Sin resultados</li>
            )}
            {filtered.map((city) => (
              <li key={city}>
                <button
                  type="button"
                  onClick={() => pick(city)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition hover:bg-emerald-50 ${
                    city === value ? "font-medium text-emerald-700" : "text-slate-800"
                  }`}
                >
                  {city}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
// ── Main export ───────────────────────────────────────────────────────────────

export default function LocationSelector({
  city,
  region,
  country,
  onCityChange,
  onRegionChange,
  onCountryChange,
}: LocationSelectorProps) {
  const isColombia = country === "Colombia";
  const isVenezuela = country === "Venezuela";
  const hasMappedRegions = isColombia || isVenezuela;

  const selectedMap = LOCATION_BY_COUNTRY[country] ?? {};

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <FieldWrapper label="País">
        <CountrySelect value={country} onChange={onCountryChange} />
      </FieldWrapper>

      <FieldWrapper label="Departamento / Región">
        {hasMappedRegions ? (
          <DepartmentSelect
            value={region}
            onChange={onRegionChange}
            onCityReset={() => onCityChange("")}
            optionsMap={selectedMap}
            label={isVenezuela ? "Estado" : "Departamento / Región"}
          />
        ) : (
          <div className="relative">
            <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={region}
              onChange={(e) => onRegionChange(e.target.value)}
              placeholder="Departamento / Región"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
            />
          </div>
        )}
      </FieldWrapper>

      <FieldWrapper label="Ciudad">
        {hasMappedRegions ? (
          <CitySelect
            value={city}
            department={region}
            onChange={onCityChange}
            optionsMap={selectedMap}
          />
        ) : (
          <div className="relative">
            <Building2 className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Ciudad"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
            />
          </div>
        )}
      </FieldWrapper>
    </div>
  );
}
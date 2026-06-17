"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getProvinceSearchKey, SORTED_PROVINCES } from "@/lib/provinces";

interface ProvinceSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  leftIcon?: ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function ProvinceSelect({
  label,
  value,
  onChange,
  leftIcon,
  error,
  required,
  disabled,
  className,
}: ProvinceSelectProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const searchKey = getProvinceSearchKey(query);
    if (!searchKey) return SORTED_PROVINCES;

    const startsWithMatches = SORTED_PROVINCES.filter((province) =>
      getProvinceSearchKey(province).startsWith(searchKey)
    );
    if (startsWithMatches.length > 0) return startsWithMatches;

    return SORTED_PROVINCES.filter((province) =>
      getProvinceSearchKey(province).includes(searchKey)
    );
  }, [query]);

  useEffect(() => {
    if (!open) setQuery(value);
  }, [open, value]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function selectProvince(province: string) {
    onChange(province);
    setQuery(province);
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-[var(--text)]">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-[var(--text-muted)]">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${inputId}-listbox`}
          autoComplete="off"
          required={required}
          disabled={disabled}
          value={query}
          placeholder="Gõ để tìm tỉnh/thành..."
          onFocus={() => {
            setQuery("");
            setOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onBlur={() => {
            window.setTimeout(() => {
              setOpen(false);
              setQuery(value);
            }, 120);
          }}
          onKeyDown={(e) => {
            if (!open && ["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
              setOpen(true);
              return;
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            }
            if (e.key === "Enter" && open && filtered[activeIndex]) {
              e.preventDefault();
              selectProvince(filtered[activeIndex]);
            }
            if (e.key === "Escape") {
              setOpen(false);
              setQuery(value);
            }
          }}
          className={cn(
            "w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-2.5 pr-10 text-sm text-[var(--text)] outline-none",
            "focus:border-[var(--blue)] focus:ring-2 focus:ring-[#1e7ab8]/20 transition-all",
            "placeholder:text-[var(--input-placeholder)]",
            leftIcon && "pl-10",
            error && "border-red-500",
            className
          )}
        />

        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setQuery("");
            setOpen((current) => !current);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[#777]"
          style={{ color: "var(--text-muted)" }}
          aria-label="Mở danh sách tỉnh thành"
        >
          <i className={`fas fa-chevron-${open ? "up" : "down"}`} />
        </button>

        {open && (
          <div
            id={`${inputId}-listbox`}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-[350] overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-1 shadow-[0_10px_28px_rgba(30,122,184,.18)]"
            style={{ maxHeight: "210px" }}
          >
            {filtered.length > 0 ? (
              filtered.map((province, index) => {
                const selected = province === value;
                const active = index === activeIndex;
                return (
                  <button
                    key={province}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectProvince(province);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      selected && "bg-[var(--blue-light)] font-semibold text-[var(--blue)]",
                      !selected && active && "bg-[var(--bg-muted)]",
                      !selected && !active && "text-[var(--text)]"
                    )}
                  >
                    <span className="w-4 text-center text-xs text-[var(--blue)]">
                      {selected && <i className="fas fa-check" />}
                    </span>
                    <span>{province}</span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-3 text-sm text-[var(--text-muted)]">
                Không tìm thấy tỉnh/thành phù hợp
              </div>
            )}
          </div>
        )}
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

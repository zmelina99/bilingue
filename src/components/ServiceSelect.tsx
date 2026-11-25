"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type Option = { value: string; label: string };

/**
 * Select-only combobox (WAI-ARIA APG pattern) styled to match the form.
 * Focus stays on the button; the active option is announced through
 * aria-activedescendant. The value is submitted via a hidden input, so the
 * form's FormData and validation are unchanged. Rendered inside the form's
 * `Control`, which supplies the outline and floating label; `data-filled`
 * tells those CSS variants that a value is chosen.
 */
export default function ServiceSelect({
  id,
  name,
  options,
  defaultValue,
  placeholder,
  invalid,
  describedBy,
  className,
}: {
  id: string;
  name: string;
  options: Option[];
  defaultValue?: string;
  /** Shown only while focused and empty (the floating label covers the rest). */
  placeholder: string;
  invalid: boolean;
  describedBy?: string;
  /** Shared field classes (size, padding, typography). */
  className: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const optionId = (i: number) => `${listId}-${i}`;
  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  // Close on any pointer press outside the field (mouse and touch).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const show = () => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };
  const choose = (i: number) => {
    setValue(options[i].value);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(i + 1, last));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={root} className="service-select">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-labelledby={`${id}-label ${id}`}
        aria-required
        aria-invalid={invalid}
        aria-describedby={describedBy}
        data-filled={selected ? "" : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        onBlur={() => setOpen(false)}
        className={`${className} cursor-pointer pr-10 text-left service-select__button`}
      >
        {selected ? (
          <span className="block truncate service-select__value">
            {selected.label}
          </span>
        ) : (
          <span className="block truncate text-secondary opacity-0 cf-float:opacity-100 service-select__placeholder">
            {placeholder}
          </span>
        )}
      </button>

      <svg
        aria-hidden="true"
        className={`pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 transition-transform duration-200 ease-out motion-reduce:transition-none ${open ? "rotate-180" : ""} service-select__chevron`}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="m3 6 5 5 5-5" />
      </svg>

      <ul
        id={listId}
        role="listbox"
        aria-labelledby={`${id}-label`}
        tabIndex={-1}
        // Keep focus on the button while clicking inside the list.
        onMouseDown={(e) => e.preventDefault()}
        className={`absolute inset-x-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-lg border border-black/10 bg-surface py-1 shadow-[0_8px_24px_-6px_rgb(0_1_66/0.18)] transition-[opacity,translate,visibility] duration-150 ease-out motion-reduce:transition-none ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"} service-select__list`}
      >
        {options.map((o, i) => {
          const isSelected = o.value === value;
          return (
            <li
              key={o.value}
              id={optionId(i)}
              role="option"
              aria-selected={isSelected}
              onClick={() => choose(i)}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center justify-between gap-4 px-4 py-3 font-sans text-base ${i === active ? "bg-primary-800/5" : ""} ${isSelected ? "text-primary-800" : "text-foreground"} service-select__option${isSelected ? " service-select__option--selected" : ""}`}
            >
              <span className="truncate">{o.label}</span>
              {isSelected && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  className="size-4 shrink-0 service-select__check"
                >
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

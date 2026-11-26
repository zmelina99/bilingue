type Option = { value: string; label: string };

/**
 * Native <select> styled to match the form (appearance: none + own chevron).
 * Keeps the platform picker on phones, type-ahead and form participation for
 * free. Rendered inside the form's `Control`, which supplies the outline and
 * floating label: the empty option keeps the required select `:invalid`, which
 * the cf-float variant reads as "empty". Its placeholder text is only visible
 * while focused (see `.contact-form__select` in globals.css).
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
  placeholder: string;
  invalid: boolean;
  describedBy?: string;
  /** Shared field classes (size, padding, typography). */
  className: string;
}) {
  return (
    <>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        required
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={`${className} cursor-pointer appearance-none pr-10 contact-form__select`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 service-select__chevron"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="m3 6 5 5 5-5" />
      </svg>
    </>
  );
}

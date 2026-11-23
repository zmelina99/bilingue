type Props = { rows: { label: string; value: string }[] };

// Plain ruled list. The unit after "/" (per hour, per lesson) is set quieter than the price.
export default function RatesList({ rows }: Props) {
  return (
    <dl className="border-t border-foreground/15">
      {rows.map((row, i) => {
        const cut = row.value.indexOf("/");
        const price = cut === -1 ? row.value : row.value.slice(0, cut);
        const unit = cut === -1 ? "" : row.value.slice(cut);
        return (
          <div
            key={i}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-foreground/15 py-4 md:py-5"
          >
            <dt className="text-base md:text-lg">{row.label}</dt>
            <dd className="whitespace-nowrap tabular-nums">
              <span className="text-xl font-semibold text-foreground md:text-2xl">
                {price}
              </span>
              <span className="text-sm text-secondary">{unit}</span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

type Props = { rows: { label: string; value: string }[] };

// Plain ruled list. The unit after "/" (per hour, per lesson) is set quieter than the price.
export default function RatesList({ rows }: Props) {
  return (
    <dl className="border-t border-foreground/15 rates-list">
      {rows.map((row, i) => {
        const cut = row.value.indexOf("/");
        const price = cut === -1 ? row.value : row.value.slice(0, cut);
        const unit = cut === -1 ? "" : row.value.slice(cut);
        return (
          <div
            key={i}
            className="flex items-baseline justify-between gap-4 md:gap-6 border-b border-foreground/15 py-4 md:py-5 rates-list__row"
          >
            <dt className="min-w-0 text-left text-base md:text-lg rates-list__label">{row.label}</dt>
            <dd className="shrink-0 whitespace-nowrap text-right tabular-nums rates-list__value">
              <span className="text-xl font-semibold max-md:font-bold text-foreground md:text-2xl rates-list__price">
                {price}
              </span>
              <span className="text-[0.8125rem] text-secondary md:text-sm rates-list__unit">{unit}</span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

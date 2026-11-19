import { slugify } from "@/lib/slug";

type Props = {
  items: { title: string; body: string }[];
  /** Grid columns from the md breakpoint up. */
  className?: string;
};

// Independent services side by side (no numbering: they are not steps).
// Each gets an anchor id from its title.
export default function ServiceList({
  items,
  className = "md:grid-cols-2",
}: Props) {
  return (
    <ul className={`grid gap-x-8 gap-y-10 md:gap-y-12 lg:gap-x-10 ${className}`}>
      {items.map((item) => (
        <li
          key={item.title}
          id={slugify(item.title)}
          className="group relative scroll-mt-24 border-t border-foreground/15 pt-6"
        >
          <span
            aria-hidden
            className="absolute -top-px left-0 h-0.5 w-0 bg-primary-800 transition-[width] duration-500 ease-soft group-hover:w-full group-focus-within:w-full"
          />
          <h3 className="text-2xl font-semibold">{item.title}</h3>
          <p className="mt-3 max-w-xl leading-relaxed text-foreground/70">
            {item.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

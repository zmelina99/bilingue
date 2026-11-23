import Image, { type StaticImageData } from "next/image";

type Props = {
  src: StaticImageData;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Skip the hover zoom (e.g. for images inside a clickable card that zooms itself). */
  still?: boolean;
  borderRadius?: boolean;
};

export default function MediaImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  sizes = "(min-width: 768px) 560px, 100vw",
  priority,
  still,
  borderRadius,
}: Props) {
  return (
    <div className={`relative w-full overflow-hidden bg-surface media-image ${className}`}>
      <Image
        src={src}
        style={borderRadius ? { borderRadius: "8px" } : {}}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover media-image__image ${imageClassName} ${
          still
            ? "media-image__image--still"
            : "transition-transform duration-700 ease-soft motion-safe:hover:scale-105"
        }`}
      />
    </div>
  );
}

import type { ComponentProps } from "react";
import ButtonLink from "@/components/ButtonLink";

// Every page ends with the same #contact section, so a hash link is enough.
export default function ContactButton(
  props: Omit<ComponentProps<typeof ButtonLink>, "href">,
) {
  return <ButtonLink href="#contact-form" {...props} />;
}

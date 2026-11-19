// Content that is the same in every language (proper nouns, contact details).
// Source: the manuscript supplied by the client (Manus_Website.docx).

export const brand = {
  name: "Bilingue",
  descriptor: "Sprachcoaching & Lektorat",
  owner: "Danielle Lerch Süess",
};

export const contact = {
  name: brand.owner,
  street: "Riedacker 1",
  city: "8914 Aeugstertal",
  email: "info@bilingue.ch",
  phone: "044 760 50 50",
  phoneHref: "tel:+41447605050",
  mobile: "079 233 78 43",
  mobileHref: "tel:+41792337843",
};

// Website links verified to resolve; clients without one are shown unlinked.
export const clients: { name: string; url?: string }[] = [
  { name: "Baccarat", url: "https://www.baccarat.com" },
  { name: "Betty Bossi", url: "https://www.bettybossi.ch" },
  { name: "Center Parcs" },
  { name: "Chantelle", url: "https://chantelle.com" },
  { name: "Circus Knie", url: "https://www.knie.ch" },
  { name: "Eterna Uhren", url: "https://www.eterna.com" },
  { name: "Fiat", url: "https://www.fiat.ch" },
  { name: "Greenpeace", url: "https://www.greenpeace.ch" },
  { name: "Honda", url: "https://www.honda.ch" },
  { name: "Ikea", url: "https://www.ikea.com/ch" },
  { name: "Kosho" },
  { name: "Kulturmagazin «Du»", url: "https://www.du-magazin.com" },
  { name: "Le Menu", url: "https://lemenu.ch" },
  { name: "Maserati", url: "https://www.maserati.com" },
  { name: "Migros-Kulturprozent", url: "https://www.migros-kulturprozent.ch" },
  { name: "Moulinex", url: "https://www.moulinex.ch" },
  { name: "Philips", url: "https://www.philips.ch" },
  { name: "Porsche Design", url: "https://www.porsche-design.com" },
  { name: "Ringier Romandie" },
  { name: "Rivella", url: "https://www.rivella.ch" },
  { name: "Swissgrid", url: "https://www.swissgrid.ch" },
  { name: "Tamedia Publications romandes" },
  { name: "The Bath Shop", url: "https://the-bath-shop.com" },
  { name: "Tissot", url: "https://www.tissotwatches.com" },
  { name: "Verband Schweizer Medien", url: "https://www.schweizermedien.ch" },
  { name: "Wemf", url: "https://wemf.ch" },
];

// Mobile number from the manuscript, assumed to be on WhatsApp — to be confirmed
// (international format, digits only).
export const whatsappNumber = "41792337843";

// Shown above the remaining clients, in this order. A logo is an image in public/clients/;
// width/height are its display size in px at desktop, tuned by eye so every logo carries
// similar visual weight (thin wordmarks wider, dense marks smaller).
// Without a logo the name is set as text. Logos are trademarks of their owners.
export const featuredClients: {
  name: string;
  logo?: { src: string; width: number; height: number };
}[] = [
  {
    name: "Betty Bossi",
    logo: { src: "/clients/betty-bossi.png", width: 112, height: 38 },
  },
  {
    name: "Porsche Design",
    logo: { src: "/clients/porsche-design.svg", width: 220, height: 12 },
  },
  { name: "Ikea", logo: { src: "/clients/ikea.svg", width: 96, height: 38 } },
  {
    name: "Greenpeace",
    logo: { src: "/clients/greenpeace.svg", width: 176, height: 27 },
  },
  {
    name: "Tissot",
    logo: { src: "/clients/tissot.svg", width: 108, height: 40 },
  },
  { name: "Honda", logo: { src: "/clients/honda.svg", width: 58, height: 47 } },
  {
    name: "Philips",
    logo: { src: "/clients/philips.svg", width: 118, height: 22 },
  },
  {
    name: "Maserati",
    logo: { src: "/clients/maserati.svg", width: 40, height: 57 },
  },
];

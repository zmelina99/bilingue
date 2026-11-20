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

export type Client = {
  id: string;
  name: string;
  url?: string;
  // A logo is an image in public/clients/; width/height are its display size in
  // px at desktop, tuned by eye so every logo carries similar visual weight
  // (thin wordmarks wider, dense marks smaller). Logos are trademarks of their
  // owners. Clients without a logo are set as text in the full list.
  logo?: { src: string; width: number; height: number };
};

// The complete client list. Website links verified to resolve; clients without
// one are shown unlinked. Every client and logo is kept here even if not
// currently featured — see `featuredClientIds` for what the site displays.
export const allClients: Client[] = [
  { id: "baccarat", name: "Baccarat", url: "https://www.baccarat.com" },
  {
    id: "betty-bossi",
    name: "Betty Bossi",
    url: "https://www.bettybossi.ch",
    logo: { src: "/clients/betty-bossi.png", width: 112, height: 38 },
  },
  { id: "center-parcs", name: "Center Parcs" },
  { id: "chantelle", name: "Chantelle", url: "https://chantelle.com" },
  { id: "circus-knie", name: "Circus Knie", url: "https://www.knie.ch" },
  { id: "eterna-uhren", name: "Eterna Uhren", url: "https://www.eterna.com" },
  { id: "fiat", name: "Fiat", url: "https://www.fiat.ch" },
  {
    id: "greenpeace",
    name: "Greenpeace",
    url: "https://www.greenpeace.ch",
    logo: { src: "/clients/greenpeace.svg", width: 176, height: 27 },
  },
  {
    id: "honda",
    name: "Honda",
    url: "https://www.honda.ch",
    logo: { src: "/clients/honda.svg", width: 58, height: 47 },
  },
  {
    id: "ikea",
    name: "Ikea",
    url: "https://www.ikea.com/ch",
    logo: { src: "/clients/ikea.svg", width: 96, height: 38 },
  },
  { id: "kosho", name: "Kosho" },
  {
    id: "kulturmagazin-du",
    name: "Kulturmagazin «Du»",
    url: "https://www.du-magazin.com",
  },
  { id: "le-menu", name: "Le Menu", url: "https://lemenu.ch" },
  {
    id: "maserati",
    name: "Maserati",
    url: "https://www.maserati.com",
    logo: { src: "/clients/maserati.svg", width: 40, height: 57 },
  },
  {
    id: "migros-kulturprozent",
    name: "Migros-Kulturprozent",
    url: "https://www.migros-kulturprozent.ch",
  },
  { id: "moulinex", name: "Moulinex", url: "https://www.moulinex.ch" },
  {
    id: "philips",
    name: "Philips",
    url: "https://www.philips.ch",
    logo: { src: "/clients/philips.svg", width: 118, height: 22 },
  },
  {
    id: "porsche-design",
    name: "Porsche Design",
    url: "https://www.porsche-design.com",
    logo: { src: "/clients/porsche-design.svg", width: 220, height: 12 },
  },
  { id: "ringier-romandie", name: "Ringier Romandie" },
  { id: "rivella", name: "Rivella", url: "https://www.rivella.ch" },
  { id: "swissgrid", name: "Swissgrid", url: "https://www.swissgrid.ch" },
  {
    id: "tamedia-publications-romandes",
    name: "Tamedia Publications romandes",
  },
  {
    id: "the-bath-shop",
    name: "The Bath Shop",
    url: "https://the-bath-shop.com",
  },
  {
    id: "tissot",
    name: "Tissot",
    url: "https://www.tissotwatches.com",
    logo: { src: "/clients/tissot.svg", width: 108, height: 40 },
  },
  {
    id: "verband-schweizer-medien",
    name: "Verband Schweizer Medien",
    url: "https://www.schweizermedien.ch",
  },
  { id: "wemf", name: "Wemf", url: "https://wemf.ch" },
];

// Mobile number from the manuscript, assumed to be on WhatsApp — to be confirmed
// (international format, digits only).
export const whatsappNumber = "41792337843";

// The logos displayed on the Editing page, in order. To change which brands are
// featured, edit only this list — any id from `allClients` that has a `logo`
// works. Every other client stays in `allClients` above, ready to be reviewed.
export const featuredClientIds = [
  "betty-bossi",
  "porsche-design",
  "ikea",
  "greenpeace",
] as const;

// The featured clients resolved to their full records, in the order above.
export const featuredClients: Client[] = featuredClientIds.map((id) => {
  const client = allClients.find((c) => c.id === id);
  if (!client) throw new Error(`Unknown featured client id: ${id}`);
  return client;
});

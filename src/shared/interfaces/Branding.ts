export interface Branding {
  companyName: string;
  tagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  quotePaymentText: string;
  quoteDeliveryText: string;
  logoUrl: string | null;
  themeName: "elegantGold" | "darkElegance";
  accentColor: string;
}

export const defaultBranding: Branding = {
  companyName: "Sua marca",
  tagline: "Impressão 3D e projetos sob medida",
  heroEyebrow: "IMPRESSÃO 3D SOB DEMANDA",
  heroTitle: "SUAS IDEIAS EM",
  heroHighlight: "TRÊS DIMENSÕES.",
  heroDescription:
    "Explore nosso catálogo ou peça um orçamento para transformar sua ideia em uma peça única.",
  quotePaymentText: "Forma de pagamento a combinar",
  quoteDeliveryText: "Entrega ou retirada conforme disponibilidade",
  logoUrl: null,
  themeName: "elegantGold",
  accentColor: "#D4AF37",
};

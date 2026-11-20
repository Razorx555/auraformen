import type { Fragrance, FragranceId, ImageAsset } from "@/lib/types";

/**
 * Imagens oficiais (fornecidas pela marca). Para substituir, troque o arquivo
 * mantendo o nome em /public/images/fragrancias/ ou edite o caminho aqui.
 * O foco (focal) mantém o frasco centralizado em recortes verticais.
 */
export const fragranceImages: Record<FragranceId, ImageAsset> = {
  halo: {
    src: "/images/fragrancias/halo.jpg",
    alt: "Frasco AURA FOR MEN HALO Body Splash 200 ml diante de um halo de luz, montanhas geladas e água azul-clara",
    width: 1122,
    height: 1402,
    focal: "50% 48%",
    official: true,
  },
  ember: {
    src: "/images/fragrancias/ember.jpg",
    alt: "Frasco AURA FOR MEN EMBER Body Splash 200 ml diante de um anel de luz âmbar, rochas escuras e brasas",
    width: 1122,
    height: 1402,
    focal: "50% 48%",
    official: true,
  },
  eclipse: {
    src: "/images/fragrancias/eclipse.jpg",
    alt: "Frasco AURA FOR MEN ECLIPSE Body Splash 200 ml diante de um eclipse prateado, com respingos de água sobre fundo preto",
    width: 1122,
    height: 1402,
    focal: "50% 48%",
    official: true,
  },
};

export const fragrances: Record<FragranceId, Fragrance> = {
  halo: {
    id: "halo",
    name: "HALO",
    tagline: "Elegância sem esforço.",
    concept: ["Leveza", "Autenticidade", "Liberdade", "Elegância"],
    headline: "Você não precisa exagerar para ter estilo.",
    story: [
      "Há uma elegância que não exige esforço. Ela aparece nos detalhes, nas escolhas e na tranquilidade de quem conhece o próprio estilo.",
      "HALO é a expressão desse universo: leve, luminoso e contemporâneo.",
    ],
    signature: "HALO. Elegância sem esforço.",
    cta: "Conhecer HALO",
    cardHint: "Gelo, luz e frescor.",
    palette: {
      accent: "#8FCAFF",
      deep: "#153A68",
      soft: "#E8F7FF",
      metal: "#D9E4F0",
      base: "#06101c",
    },
    aesthetic: {
      atmosfera: "Fresca e luminosa",
      estilo: "Elegante e contemporâneo",
      identidade: "Leveza",
    },
    notes: null,
    usage: null,
  },
  ember: {
    id: "ember",
    name: "EMBER",
    tagline: "Calor que permanece.",
    concept: ["Intensidade", "Confiança", "Energia", "Calor"],
    headline: "Algumas personalidades não nasceram para ser mornas.",
    story: [
      "Existe uma intensidade que não precisa de explicação. Está no olhar decidido, na autenticidade e na coragem de assumir o próprio estilo.",
      "EMBER traduz essa energia em um universo quente, profundo e envolvente.",
    ],
    signature: "EMBER. Calor que permanece.",
    cta: "Explorar EMBER",
    cardHint: "Âmbar, brasa e profundidade.",
    palette: {
      accent: "#F28A30",
      deep: "#A84F1D",
      soft: "#D6A06B",
      metal: "#D6A06B",
      base: "#160B08",
    },
    aesthetic: {
      atmosfera: "Quente e envolvente",
      estilo: "Intenso e sofisticado",
      identidade: "Energia",
    },
    notes: null,
    usage: null,
  },
  eclipse: {
    id: "eclipse",
    name: "ECLIPSE",
    tagline: "Presença. Identidade. Impacto.",
    concept: ["Mistério", "Individualidade", "Sofisticação", "Presença"],
    headline: "Nem tudo que marca precisa fazer barulho.",
    story: [
      "Há quem prefira o extraordinário sem excessos. A força do contraste. A elegância do silêncio. A liberdade de não seguir o óbvio.",
      "ECLIPSE nasce desse universo, onde o mistério encontra uma identidade inconfundível.",
    ],
    signature: "ECLIPSE. Presença. Identidade. Impacto.",
    cta: "Descobrir ECLIPSE",
    cardHint: "Preto, prata e contraste.",
    palette: {
      accent: "#C5C5D0",
      deep: "#24252C",
      soft: "#E6E8ED",
      metal: "#C5C5D0",
      base: "#020204",
    },
    aesthetic: {
      atmosfera: "Escura e misteriosa",
      estilo: "Marcante e minimalista",
      identidade: "Contraste",
    },
    notes: null,
    usage: null,
  },
};

export const fragranceOrder: FragranceId[] = ["halo", "ember", "eclipse"];

export const isFragranceId = (v: string): v is FragranceId =>
  (fragranceOrder as string[]).includes(v);

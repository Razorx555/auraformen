export const mainNav = [
  { href: "/colecao", label: "Coleção" },
  { href: "/descubra-sua-aura", label: "Descubra sua Aura" },
  { href: "/sobre", label: "Sobre a Aura" },
];

export const mobileNav = [
  { href: "/colecao", label: "Coleção" },
  { href: "/descubra-sua-aura", label: "Descubra sua Aura" },
  { href: "/kits", label: "Kits" },
  { href: "/sobre", label: "Sobre a Aura" },
  { href: "/contato", label: "Contato" },
];

export const footerNav = {
  explorar: [
    { href: "/colecao", label: "Coleção" },
    { href: "/fragrancias/halo", label: "HALO" },
    { href: "/fragrancias/ember", label: "EMBER" },
    { href: "/fragrancias/eclipse", label: "ECLIPSE" },
    { href: "/kits", label: "Kits" },
    { href: "/descubra-sua-aura", label: "Descubra sua Aura" },
  ],
  marca: [
    { href: "/sobre", label: "Sobre" },
    { href: "/contato", label: "Contato" },
    { href: "/faq", label: "Perguntas frequentes" },
  ],
  politicas: [
    { href: "/politica-de-privacidade", label: "Política de privacidade" },
    { href: "/termos-de-uso", label: "Termos de uso" },
    { href: "/trocas-e-devolucoes", label: "Trocas e devoluções" },
    { href: "/entrega", label: "Política de entrega" },
  ],
};

/** FAQ — apenas respostas verificáveis. Itens pendentes ficam sinalizados. */
export const faq: { q: string; a: string; pending?: boolean }[] = [
  {
    q: "O que é a AURA FOR MEN?",
    a: "Uma marca brasileira de fragrâncias e cosméticos masculinos. A primeira coleção, Signature Series, reúne três body splashes: HALO, EMBER e ECLIPSE.",
  },
  {
    q: "Qual é o volume de cada frasco?",
    a: "Cada body splash da Signature Series tem 200 ml (6,76 fl. oz.), em frasco preto com válvula spray.",
  },
  {
    q: "Qual é a diferença entre HALO, EMBER e ECLIPSE?",
    a: "Cada fragrância tem um universo próprio: HALO é leve e luminoso; EMBER é quente e envolvente; ECLIPSE é contrastante e misterioso. Essas descrições traduzem a proposta estética de cada criação. A composição olfativa oficial será publicada nas páginas dos produtos.",
  },
  {
    q: "Como funciona o “Descubra sua Aura”?",
    a: "São três perguntas rápidas sobre atmosfera, cenário e forma de expressar presença. Cada resposta soma um ponto para uma fragrância e a mais pontuada é sugerida. Em caso de empate, vale a resposta da última pergunta. É uma sugestão estética, não uma análise de personalidade.",
  },
  {
    q: "Quais são as formas de pagamento?",
    a: "As formas de pagamento serão exibidas no checkout assim que a plataforma de pagamento estiver conectada.",
    pending: true,
  },
  {
    q: "Qual é o prazo e o valor do frete?",
    a: "O frete é calculado no checkout a partir do seu CEP, quando o serviço de entrega estiver integrado. Consulte a Política de entrega.",
    pending: true,
  },
  {
    q: "Posso trocar ou devolver um produto?",
    a: "Sim, conforme a Política de trocas e devoluções e o Código de Defesa do Consumidor. As condições detalhadas estão em validação e serão publicadas na página correspondente.",
    pending: true,
  },
];

export const searchIndex = [
  { href: "/fragrancias/halo", title: "HALO", kind: "Fragrância", text: "halo elegância sem esforço leve luminoso fresco azul gelo body splash 200 ml" },
  { href: "/fragrancias/ember", title: "EMBER", kind: "Fragrância", text: "ember calor que permanece quente intenso âmbar laranja body splash 200 ml" },
  { href: "/fragrancias/eclipse", title: "ECLIPSE", kind: "Fragrância", text: "eclipse presença identidade impacto mistério preto prata body splash 200 ml" },
  { href: "/kits", title: "Signature Trio e Duo", kind: "Kits", text: "kit trio duo combinação coleção completa presente" },
  { href: "/colecao", title: "Coleção Signature Series", kind: "Coleção", text: "coleção signature series catálogo todas fragrâncias comparar" },
  { href: "/descubra-sua-aura", title: "Descubra sua Aura", kind: "Experiência", text: "quiz descubra qual fragrância combina comigo teste" },
  { href: "/sobre", title: "Sobre a AURA", kind: "Marca", text: "sobre história manifesto marca identidade the art of presence" },
  { href: "/contato", title: "Contato", kind: "Atendimento", text: "contato atendimento fale conosco email whatsapp" },
  { href: "/faq", title: "Perguntas frequentes", kind: "Ajuda", text: "faq dúvidas perguntas pagamento frete volume" },
  { href: "/entrega", title: "Política de entrega", kind: "Ajuda", text: "entrega frete prazo envio cep" },
  { href: "/trocas-e-devolucoes", title: "Trocas e devoluções", kind: "Ajuda", text: "troca devolução arrependimento reembolso" },
  { href: "/carrinho", title: "Carrinho", kind: "Compra", text: "carrinho bolsa sacola finalizar compra checkout" },
];

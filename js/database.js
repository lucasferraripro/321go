/**
 * 321 GO! — Banco de Dados Centralizado de Pacotes
 * Fonte única de verdade: home, pacote.html e editor usam este arquivo.
 * Adicione novos pacotes aqui e eles aparecerão automaticamente no site.
 *
 * Campos obrigatórios: title, subtitle, location, duration, price,
 *   priceCartao, parcelas, flag, badge, category, images[], desc,
 *   incluso[], nao_incluso[], roteiro[]
 *
 * Categorias: 'nacional' | 'internacional' | 'copa'
 */

/* ── DADOS DA AGÊNCIA ── */
const SITE = {
    nome:     '321 GO! Agência de Viagens',
    whatsapp: '5521966501302',
    email:    'patriciaetatiana@321go.com.br',
    tel:      '(21) 99095-0961',
    insta:    '321go.patriciaetatiana'
};

/* ── THUMB MAP (imagens dos cards na home e "outros pacotes") ── */
const THUMB = {
    balneario:   'imagens/balneario_camboriu.png',
    maceio:      'imagens/maceio.png',
    curitiba:    'imagens/curitiba.png',
    gramado:     'imagens/gramado.png',
    bariloche:   'imagens/bariloche.png',
    porto:       'imagens/porto_seguro.png',
    copa_mexico: 'imagens/mexico.png',
    copa_miami:  'imagens/miami.png',
    copa_ny:     'imagens/nova_york.png',
    copa_cancun: 'imagens/cancun.png',
    copa_final:  'imagens/copa_estadio.png'
};

/* ── BANCO DE PACOTES ── */
const DB = {

    /* ════ NACIONAIS ════ */
    balneario: {
        category: 'nacional',
        title:    'Balneário Camboriú + Beto Carrero',
        subtitle: 'O melhor de SC: praia, roda gigante e parque temático',
        location: 'Balneário Camboriú, SC',
        duration: '5 dias / 4 noites',
        price:       '2.486,13',
        priceCartao: '2.605,80',
        parcelas:    '10x de R$ 260,58 sem juros',
        flag:  'Brasil 🇧🇷',
        badge: '🔥 Oferta',
        images: [
            'imagens/balneario_camboriu.png',
            'imagens/bc_roda_gigante.png',
            'imagens/bc_beto_carrero.png'
        ],
        dates: '📅 11/07 – 15/07/2026 · 1 pessoa',
        desc: 'Localizada no litoral norte de Santa Catarina, Balneário Camboriú tem além de praias lindas, uma infraestrutura moderna com comércio forte e farta opção gastronômica. Conheça a Barra Sul, o Letreiro I AMO BC, a passarela histórica, o píer do Barco Pirata e o Parque Unipraias — único complexo turístico que une duas praias no mundo! O Parque Beto Carrero World é o maior centro de lazer e entretenimento da América Latina, repleto de diversão para adultos e crianças de todas as idades.',
        incluso: [
            'Passagem aérea ida e volta GIG → NVT (Gol, voo direto)',
            'Hospedagem 4 noites – Sagres Praia Hotel (3★, café da manhã)',
            'Bilhete Roda Gigante FG Big Wheel – 65m de altura',
            'Transfer In/Out Aeroporto Navegantes ↔ Balneário Camboriú',
            '1 Transfer ao Parque Beto Carrero World (sem ingresso)',
            'Seguro viagem 20K BRL'
        ],
        nao_incluso: ['Ingresso Beto Carrero World', 'Almoços e jantares', 'Passeios extras', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Balneário Camboriú', desc: 'Voo GIG → NVT às 07h25, chegada às 09h00. Transfer do aeroporto ao hotel. Check-in, descanso e primeira caminhada pela orla da Barra Sul.' },
            { dia: '2º Dia', title: 'Parque Unipraias + Barra Sul', desc: 'Dia para explorar o Parque Unipraias, o Letreiro I AMO BC e a Passarela. Tarde livre na praia.' },
            { dia: '3º Dia', title: 'Beto Carrero World', desc: 'Transfer até o maior parque temático da América Latina! Áreas temáticas, shows, zoológico e brinquedos radicais.' },
            { dia: '4º Dia', title: 'Roda Gigante + Cidade Livre', desc: 'Experiência única na Roda Gigante FG Big Wheel — 65 metros de altura e vista panorâmica de BC.' },
            { dia: '5º Dia', title: 'Retorno ao Rio', desc: 'Café da manhã. Check-out e transfer ao aeroporto. Voo de volta às 19h15, chegada ao GIG às 20h40.' }
        ]
    },

    maceio: {
        category: 'nacional',
        title:    'Maceió – Praias Paradisíacas',
        subtitle: 'O Caribe Brasileiro com piscinas naturais de tirar o fôlego',
        location: 'Maceió, AL',
        duration: '8 dias / 7 noites',
        price:       '4.281,83',
        priceCartao: '4.502,69',
        parcelas:    '10x de R$ 450,27 sem juros',
        flag:  'Brasil 🌊',
        badge: '⭐ Popular',
        images: [
            'imagens/maceio.png',
            'imagens/maceio_maragogi.png',
            'imagens/maceio_pajucara.png'
        ],
        dates: '📅 09/07 – 16/07/2026 · 1 pessoa',
        desc: 'Maceió é a capital de Alagoas — 40 km de praias com águas transparentes que variam entre o azul e o verde, formando piscinas naturais únicas. Entre a Lagoa Mundaú e o Oceano Atlântico, a cidade encanta com praias urbanas movimentadas e selvagens totalmente desertas.',
        incluso: [
            'Passagem aérea ida e volta GIG → MCZ (Azul, voo direto)',
            'Hospedagem 7 noites – Palms Ponta Verde by Tropicalis (4★, café da manhã)',
            'City Tour Maceió + Praia do Francês (Litoral Sul)',
            'Transfer In/Out Aeroporto Maceió ↔ Hotel',
            'Seguro viagem 20K BRL'
        ],
        nao_incluso: ['Almoços e jantares', 'Passeios opcionais', 'Snorkel e equipamentos', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Maceió', desc: 'Voo GIG → MCZ às 09h40, chegada às 12h20. Transfer ao hotel. Check-in e primeira caminhada pela orla de Ponta Verde.' },
            { dia: '2º Dia', title: 'Piscinas de Pajuçara', desc: 'Passeio de jangada até as piscinas naturais a 1km da praia — nadar entre peixes coloridos em águas rasas e cristalinas.' },
            { dia: '3º Dia', title: 'Praia do Francês + City Tour', desc: 'Excursão panorâmica por Maceió incluindo os principais pontos históricos e encerramento na Praia do Francês.' },
            { dia: '4º Dia', title: 'Praia de Ipioca', desc: 'Dia livre para explorar praias mais afastadas como Ipioca ou Ponta do Gamela — totalmente desertas.' },
            { dia: '5º Dia', title: 'Lagoa Mundaú', desc: 'Passeio pela Lagoa Mundaú, com ilhotes e restaurantes flutuantes e frutos do mar fresquíssimos.' },
            { dia: '6º Dia', title: 'Maragogi (opcional)', desc: 'Excursão opcional para Maragogi — o Caribe Brasileiro a 130km de Maceió.' },
            { dia: '7º Dia', title: 'Dia Livre', desc: 'Dia livre para revisitar praias favoritas ou relaxar na piscina do hotel.' },
            { dia: '8º Dia', title: 'Retorno ao Rio', desc: 'Café da manhã. Check-out e transfer ao aeroporto. Voo MCZ → GIG às 13h00.' }
        ]
    },

    curitiba: {
        category: 'nacional',
        title:    'Curitiba + Trem de Morretes',
        subtitle: 'A capital ecológica + a viagem de trem mais linda do Brasil',
        location: 'Curitiba, PR',
        duration: '4 dias / 3 noites',
        price:       '1.794,00',
        priceCartao: '1.882,50',
        parcelas:    '10x de R$ 188,25 sem juros',
        flag:  'Brasil 🌿',
        badge: '🔥 Oferta',
        images: [
            'imagens/curitiba.png',
            'imagens/curitiba_trem.png',
            'imagens/curitiba_opera.png'
        ],
        dates: '📅 14/07 – 17/07/2026 · 2 pessoas',
        desc: 'Curitiba é a capital mais sustentável do Brasil — uma cidade que surpreende com seus parques, museus e gastronomia. O grande destaque é o Trem de Morretes: uma viagem panorâmica pela Serra Paranaense com paisagens de Mata Atlântica exuberante até a charmosa Morretes, famosa pelo barreado.',
        incluso: [
            'Passagem aérea ida e volta (GIG → CWB)',
            'Hospedagem 3 noites com café da manhã',
            'City Tour histórico por Curitiba',
            'Trem para Morretes (Serra Verde Express)',
            'Transfer de chegada ao hotel'
        ],
        nao_incluso: ['Almoços e jantares', 'Transfer de saída', 'Passeios extras', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Curitiba', desc: 'Desembarque, transfer ao hotel. À tarde visita ao Jardim Botânico e Shopping Mueller.' },
            { dia: '2º Dia', title: 'City Tour Curitiba', desc: 'Rua XV de Novembro, Ópera de Arame, Parque Tanguá, Museu Oscar Niemeyer e Bosque do Papa.' },
            { dia: '3º Dia', title: 'Trem de Morretes', desc: 'Embarque na Serra Verde Express cedo pela manhã. Viagem panorâmica pela Serra Paranaense. Chegada a Morretes para almoço com o famoso barreado.' },
            { dia: '4º Dia', title: 'Retorno ao Rio', desc: 'Café da manhã, check-out e traslado ao aeroporto. Voo de retorno ao Rio.' }
        ]
    },

    gramado: {
        category: 'nacional',
        title:    'Gramado + Noite Gaúcha',
        subtitle: 'A Serra Gaúcha europeia com cultura, vinhos e fondue',
        location: 'Gramado, RS',
        duration: '7 dias / 6 noites',
        price:       '2.550,00',
        priceCartao: '2.550,00',
        parcelas:    '10x de R$ 255,00 sem juros',
        flag:  'Brasil 🍷',
        badge: '⭐ Popular',
        images: [
            'imagens/gramado.png',
            'imagens/bariloche.png',
            'imagens/curitiba_trem.png'
        ],
        dates: '📅 20/08 – 26/08/2026 · 6 noites',
        desc: 'Gramado é a joia da Serra Gaúcha — uma cidade que encanta com sua arquitetura enxaimel, ruas floridas, chocolates artesanais, cafés coloniais e fondue. A famosa Noite Gaúcha leva os visitantes para um espetáculo cultural com danças, músicas e gastronomia típica.',
        incluso: [
            'Passagem aérea ida e volta (GIG → POA)',
            'Hospedagem 6 noites com café da manhã',
            'City Tour por Gramado e Canela',
            'Noite Gaúcha (jantar + show cultural)',
            'Transfer in/out aeroporto'
        ],
        nao_incluso: ['Parque do Caracol (ingresso a pagar)', 'Almoços', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Porto Alegre', desc: 'Desembarque em POA e transfer para Gramado (1h30). Check-in e primeira caminhada pela Rua Coberta.' },
            { dia: '2º Dia', title: 'Gramado City Tour', desc: 'Mini Mundo, Rua Coberta, Lago Negro, fábricas de chocolate e lojas artesanais.' },
            { dia: '3º Dia', title: 'Canela + Caracol', desc: 'Excursão a Canela: Parque do Caracol (Cascata 131m) e Catedral de Pedra.' },
            { dia: '4º Dia', title: 'Noite Gaúcha', desc: 'O famoso espetáculo com jantar típico, danças e música gaúcha num ambiente encantador.' },
            { dia: '5º Dia', title: 'Vale dos Vinhedos', desc: 'Excursão à região produtora de vinhos: vinícolas, degustações e gastronomia italiana.' },
            { dia: '6º Dia', title: 'Dia Livre em Gramado', desc: 'Último dia para chocolates, compras e desfrutar dos cafés com fondue clássico.' },
            { dia: '7º Dia', title: 'Retorno ao Rio', desc: 'Transfer a Porto Alegre e voo de retorno com as malas cheias de chocolate.' }
        ]
    },

    porto: {
        category: 'nacional',
        title:    'Porto Seguro + City Tour',
        subtitle: 'A Terra do Descobrimento com praias, falésias e história',
        location: 'Porto Seguro, BA',
        duration: '6 dias / 5 noites',
        price:       '2.399,72',
        priceCartao: '2.399,72',
        parcelas:    '10x de R$ 239,97 sem juros',
        flag:  'Brasil 🇧🇷',
        badge: '🔥 Oferta',
        images: [
            'imagens/porto_seguro.png',
            'imagens/maceio_pajucara.png',
            'imagens/maceio_maragogi.png'
        ],
        dates: '📅 15/07 – 20/07/2026 · 1 pessoa',
        desc: 'Porto Seguro é a Terra do Descobrimento — onde o Brasil nasceu. Além da história rica, tem praias exuberantes com águas mornas e cristalinas, falésias coloridas, a animada Passarela do Álcool e arredores paradisíacos como Arraial d\'Ajuda e Trancoso.',
        incluso: [
            'Passagem aérea ida e volta GIG → BPS (ida e volta)',
            'Hospedagem 5 noites – Hotel Porto Dourado (Rede Bem Bahia, café da manhã)',
            'Transfer In/Out Aeroporto BPS ↔ Hotel',
            'City Tour por Porto Seguro (cortesia)',
            'Seguro viagem 20K BRL'
        ],
        nao_incluso: ['Passeios a Arraial e Trancoso', 'Almoços e jantares', 'Bebidas', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Porto Seguro', desc: 'Desembarque e transfer ao hotel. Tarde para conhecer a praia local e o calçadão da orla.' },
            { dia: '2º Dia', title: 'City Tour Histórico', desc: 'Tour de cortesia pelo Centro Histórico (Cidade Alta), Marco do Descobrimento e Igreja de Nossa Senhora da Pena.' },
            { dia: '3º Dia', title: 'Passarela do Álcool + Praia', desc: 'Manhã de praia. À noite, a famosa Passarela do Álcool com shows ao vivo e lambada.' },
            { dia: '4º Dia', title: 'Arraial d\'Ajuda (opcional)', desc: 'Excursão ao encantador Arraial d\'Ajuda — praias paradisíacas como Pitinga e Lagoa Azul.' },
            { dia: '5º Dia', title: 'Trancoso (opcional)', desc: 'O Quadrado de Trancoso — um dos vilarejos mais bonitos do Brasil.' },
            { dia: '6º Dia', title: 'Retorno ao Rio', desc: 'Café da manhã, check-out e transfer ao aeroporto BPS. Voo de retorno.' }
        ]
    },

    /* ════ INTERNACIONAIS ════ */
    bariloche: {
        category: 'internacional',
        title:    'Bariloche – Circuito Chico + Cerro Catedral',
        subtitle: 'A Suíça Argentina com neve, lagos e montanhas deslumbrantes',
        location: 'Bariloche, Argentina',
        duration: '6 dias / 5 noites',
        price:       '10.704,00',
        priceCartao: '10.704,00',
        parcelas:    '12x de R$ 892,00 sem juros (quarto duplo)',
        flag:  'Argentina 🇦🇷',
        badge: '💎 Premium',
        images: [
            'imagens/bariloche.png',
            'imagens/bariloche_montanhas_alt.png',
            'imagens/curitiba_opera.png'
        ],
        dates: '📅 06/07 – 11/07/2026 · 2 adultos, quarto duplo',
        desc: 'Bariloche é o destino dos sonhos na Patagônia Argentina — lagos cristalinos, montanhas nevadas, chocolates artesanais e a charmosa arquitetura alpina que lembra a Suíça. O Circuito Chico é considerado um dos passeios mais bonitos da América do Sul.',
        incluso: [
            'Passagem aérea ida e volta GIG → USH (via Buenos Aires)',
            'Hospedagem 5 noites com café da manhã (2 adultos, quarto duplo)',
            'Tour panorâmico Circuito Chico completo',
            'Excursão ao Cerro Catedral (ski ou passeio panorâmico)',
            'Transfer in/out aeroporto Bariloche'
        ],
        nao_incluso: ['Aluguel de equipamentos de ski', 'Almoços e jantares', 'Passeios extras', 'Seguro viagem'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Bariloche', desc: 'Voo RIO → GRU → BRC. Transfer ao hotel. Tarde de aclimatação e passeio pelo Centro Cívico e chocolaterie.' },
            { dia: '2º Dia', title: 'Circuito Chico', desc: 'O passeio mais famoso: Cerro Campanário (vista 360°), Villa Angliru, Llao Llao, Bahía Lopez e Ponto Panorâmico.' },
            { dia: '3º Dia', title: 'Cerro Catedral', desc: 'Excursão ao maior complexo de ski da América do Sul. Opções de ski ou passeio de teleférico.' },
            { dia: '4º Dia', title: 'Circuito Grande', desc: 'Lago Nahuel Huapi de barco, Villa Traful e cachoeiras. A Patagônia mais selvagem.' },
            { dia: '5º Dia', title: 'Chocolate + Artesanato', desc: 'Tarde livre para as famosas lojas de chocolate de Bariloche e cervejarias artesanais.' },
            { dia: '6º Dia', title: 'Retorno ao Rio', desc: 'Café da manhã, check-out e transfer ao aeroporto BRC. Voo de retorno.' }
        ]
    },

    paris: {
        category: 'internacional',
        title:    'Paris Clássica – A Cidade Luz',
        subtitle: 'Torre Eiffel, Louvre e cruzeiro pelo Rio Sena',
        location: 'Paris, França',
        duration: '7 dias / 6 noites',
        price:       '8.950,00',
        priceCartao: '8.950,00',
        parcelas:    '10x de R$ 895,00 sem juros',
        flag:  'França 🇫🇷',
        badge: '⭐ Popular',
        images: [
            'https://images.unsplash.com/photo-1502602898657-3e90760b2172?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=800&q=80'
        ],
        dates: '📅 Consulte datas para 2026',
        desc: 'Descubra a magia de Paris! Um roteiro imperdível pela capital francesa, com passeios pelos principais cartões-postais do mundo: Torre Eiffel, Museu do Louvre, Arco do Triunfo e um cruzeiro pelas águas do Rio Sena.',
        incluso: [
            'Passagem aérea ida e volta',
            'Hospedagem 6 noites com café da manhã em hotel central',
            'Ingresso para o 2º andar da Torre Eiffel',
            'Passeio de barco Bateaux Parisiens no Rio Sena',
            'Transfer In/Out Aeroporto CDG ↔ Hotel'
        ],
        nao_incluso: ['Almoços e jantares', 'Taxas locais', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Paris', desc: 'Transfer do aeroporto ao hotel. Tarde livre para caminhar pelas margens do Sena.' },
            { dia: '2º Dia', title: 'City Tour', desc: 'Arco do Triunfo, Champs-Élysées e Torre Eiffel.' },
            { dia: '3º Dia', title: 'Museu do Louvre', desc: 'Dia dedicado para explorar o Louvre e o Jardim das Tulherias.' },
            { dia: '4º Dia', title: 'Montmartre', desc: 'Passeio pelo bairro boêmio de Montmartre e Basílica de Sacré-Cœur.' },
            { dia: '5º Dia', title: 'Cruzeiro no Sena', desc: 'Noite com passeio de barco com vistas deslumbrantes de Paris iluminada.' },
            { dia: '6º Dia', title: 'Dia Livre', desc: 'Tempo livre para compras ou passeios opcionais.' },
            { dia: '7º Dia', title: 'Retorno', desc: 'Café da manhã, check-out e transfer ao aeroporto.' }
        ]
    },

    /* ════ COPA 2026 ════ */
    copa_mexico: {
        category: 'copa',
        title:    '🇲🇽 Copa 2026 – Cidade do México',
        subtitle: 'Econômico de alto volume com jogo da fase de grupos',
        location: 'Cidade do México, MEX',
        duration: '6 dias / 5 noites',
        price:       '14.900,00',
        priceCartao: '14.900,00',
        parcelas:    'Consulte condições de parcelamento',
        flag:  'Copa 2026 🏆🇲🇽',
        badge: '🏆 Copa 2026',
        images: [
            'imagens/mexico.png',
            'imagens/cancun.png',
            'imagens/copa_estadio.png'
        ],
        dates: '📅 Consulte datas disponíveis',
        desc: 'Viva a emoção da Copa do Mundo 2026 na Cidade do México — o pacote mais acessível para quem quer estar lá! Combina a magia de assistir ao Brasil ao vivo na fase de grupos com a experiência cultural única da capital mexicana.',
        incluso: [
            'Passagem aérea Rio → Cidade do México (ida e volta)',
            'Hospedagem Hotel 3★ com café da manhã',
            '🎟 1 ingresso jogo fase de grupos',
            'Transfer aeroporto + transfer estádio',
            '🗺 City tour cultural (Teotihuacán, Centro Histórico)'
        ],
        nao_incluso: ['Demais refeições', 'Passeios extras', 'Seguro viagem', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada à Cidade do México', desc: 'Desembarque no CDMX, transfer ao hotel. Tarde livre para explorar o bairro.' },
            { dia: '2º Dia', title: 'Teotihuacán + Histórico', desc: 'Tour pelas Pirâmides de Teotihuacán e pelo Centro Histórico.' },
            { dia: '3º Dia', title: 'DIA DO JOGO – Fase de Grupos', desc: '🏆 O grande dia! Transfer ao estádio e Brasil em campo!' },
            { dia: '4º Dia', title: 'Museu Frida Kahlo + Coyoacán', desc: 'Tour cultural ao bairro de Coyoacán e ao Museu de Frida Kahlo.' },
            { dia: '5º Dia', title: 'Xochimilco + Dia Livre', desc: 'Passeio de trajinera pelas famosas trajineras de Xochimilco.' },
            { dia: '6º Dia', title: 'Retorno ao Brasil', desc: 'Café da manhã, check-out e transfer ao aeroporto CDMX.' }
        ]
    },

    copa_miami: {
        category: 'copa',
        title:    '🇺🇸 Copa 2026 – Miami + Orlando',
        subtitle: 'O pacote MAIS VENDIDO – Jogo + Parques + Diversão',
        location: 'Miami & Orlando, FL, EUA',
        duration: '8 dias / 7 noites',
        price:       '21.900,00',
        priceCartao: '21.900,00',
        parcelas:    'Consulte condições de parcelamento',
        flag:  'Copa 2026 ⭐🏆',
        badge: '⭐ Mais Vendido',
        images: [
            'imagens/miami.png',
            'imagens/cancun.png',
            'imagens/copa_estadio.png'
        ],
        dates: '📅 Consulte datas disponíveis',
        desc: 'O carro-chefe da nossa linha Copa 2026 — combina o glamour de Miami Beach com a magia de Orlando e a emoção de assistir ao Brasil ao vivo! Miami com suas praias, Art Deco e vida noturna, mais um dia de parque temático em Orlando.',
        incluso: [
            'Passagem aérea Rio → Miami (ida e volta)',
            'Hospedagem Hotel 3★ Miami Beach (3 noites)',
            'Hospedagem Hotel 3★ Orlando (4 noites)',
            '🎟 1 ingresso jogo da Copa',
            '🚗 Aluguel de carro (Miami + Orlando)',
            '🎡 1 dia de parque temático em Orlando'
        ],
        nao_incluso: ['Demais refeições', 'Seguro viagem', 'Ingressos adicionais parques', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Miami', desc: 'Desembarque em MIA, retirada do carro alugado, check-in em Miami Beach.' },
            { dia: '2º Dia', title: 'Miami Beach + Wynwood', desc: 'Manhã na praia de Miami Beach. Tarde no Wynwood Walls.' },
            { dia: '3º Dia', title: 'Aventura + Compras', desc: 'Visita ao Aventura Mall, Bal Harbour e Miami Design District.' },
            { dia: '4º Dia', title: 'DIA DO JOGO 🏆', desc: '🏆 O dia mais esperado! Transfer ao estádio. Brasil em campo!' },
            { dia: '5º Dia', title: 'Drive para Orlando', desc: 'Viagem de carro Miami → Orlando (4h). Check-in no hotel.' },
            { dia: '6º Dia', title: 'Parque Temático', desc: '🎡 Dia inteiro no parque escolhido — Universal ou Disney.' },
            { dia: '7º Dia', title: 'Compras + International Drive', desc: 'Dia de compras no Premium Outlets e International Drive.' },
            { dia: '8º Dia', title: 'Retorno ao Brasil', desc: 'Devolução do carro, transfer ao aeroporto e voo de retorno.' }
        ]
    },

    copa_ny: {
        category: 'copa',
        title:    '🗽 Copa 2026 – Nova York Premium',
        subtitle: 'Hotel Manhattan + Jogo Decisivo (oitavas/quartas)',
        location: 'Nova York, NY, EUA',
        duration: '7 dias / 6 noites',
        price:       '29.900,00',
        priceCartao: '29.900,00',
        parcelas:    'Consulte condições de parcelamento',
        flag:  'Copa 2026 🇺🇸',
        badge: '💎 Premium',
        images: [
            'imagens/nova_york.png',
            'imagens/miami.png',
            'imagens/copa_estadio.png'
        ],
        dates: '📅 Consulte datas disponíveis',
        desc: 'O pacote para quem quer viver a Copa com status! Nova York é a cidade mais icônica do mundo — Times Square, Central Park, Empire State Building e Brooklyn Bridge. O jogo é das fases decisivas (oitavas ou quartas de final).',
        incluso: [
            'Passagem aérea Rio → Nova York (ida e volta)',
            'Hospedagem Hotel 4★ – Manhattan (6 noites)',
            '🎟 1 ingresso jogo decisivo (oitavas/quartas)',
            '🚁 Passeio de helicóptero ou experiência premium NYC',
            '🗺 City tour Nova York (Manhattan, Brooklyn, Central Park)'
        ],
        nao_incluso: ['Demais refeições', 'Seguro viagem', 'Passeios extras', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Nova York', desc: 'Desembarque em JFK ou EWR, transfer ao hotel em Manhattan.' },
            { dia: '2º Dia', title: 'Baixa Manhattan + Brooklyn', desc: 'Wall Street, Brooklyn Bridge, 9/11 Memorial e DUMBO.' },
            { dia: '3º Dia', title: 'Central Park + Upper East Side', desc: 'Central Park, Met Museum, Fifth Avenue e Rockefeller Center.' },
            { dia: '4º Dia', title: 'DIA DO JOGO 🇺🇸🏆', desc: '🇺🇸🏆 Jogo decisivo da Copa na arena MetLife. Emoção ao máximo!' },
            { dia: '5º Dia', title: 'Helicóptero + Experiência Premium', desc: '🚁 Passeio de helicóptero sobre Manhattan — a melhor vista possível.' },
            { dia: '6º Dia', title: 'Compras + Soho', desc: 'Soho, Meatpacking District e compras premium em Fifth Avenue.' },
            { dia: '7º Dia', title: 'Retorno ao Brasil', desc: 'Último café da manhã em Nova York. Transfer ao aeroporto.' }
        ]
    },

    copa_cancun: {
        category: 'copa',
        title:    '🌴🌊 Copa 2026 – México + Cancún',
        subtitle: 'Futebol + Férias! A combinação perfeita em 9 dias',
        location: 'Cidade do México + Cancún, MEX',
        duration: '9 dias / 8 noites',
        price:       '23.900,00',
        priceCartao: '23.900,00',
        parcelas:    'Consulte condições de parcelamento',
        flag:  'Copa 2026 🌴🏆',
        badge: '🌴 Experiência',
        images: [
            'imagens/mexico.png',
            'imagens/cancun.png',
            'imagens/maceio_maragogi.png'
        ],
        dates: '📅 Consulte datas disponíveis',
        desc: 'O multi-destino mais completo da Copa 2026 — uma semana que combina a emoção de ver o Brasil ao vivo na Cidade do México com 3 dias de férias em all inclusive em Cancún! Praias do Caribe mexicano com águas turquesa.',
        incluso: [
            'Passagem aérea multidestino (Rio → CDMX → Cancún → Rio)',
            'Hospedagem Hotel 3★ Cidade do México (5 noites)',
            'Hospedagem Resort Cancún All Inclusive (3 noites)',
            '🎟 1 ingresso jogo da Copa',
            '🚌 Todos os transfers inclusos'
        ],
        nao_incluso: ['Passeios extras em Cancún', 'Seguro viagem', 'Bebidas fora do resort', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada à Cidade do México', desc: 'Desembarque no CDMX, transfer ao hotel.' },
            { dia: '2º Dia', title: 'Teotihuacán + Cultura', desc: 'Tour pelas Pirâmides de Teotihuacán e Centro Histórico.' },
            { dia: '3º Dia', title: 'DIA DO JOGO 🏆', desc: '🏆 Brasil em campo na Copa! Transfer ao estádio.' },
            { dia: '4º Dia', title: 'Xochimilco + Coyoacán', desc: 'Trajineras em Xochimilco e visita ao Museu Frida Kahlo.' },
            { dia: '5º Dia', title: 'Voo para Cancún ✈', desc: 'Voo interno CDMX → CUN. Transfer ao resort all inclusive.' },
            { dia: '6º Dia', title: 'Cancún – Praia + Piscina', desc: 'Dia inteiro de relaxamento no resort. Praia, piscinas e drinks.' },
            { dia: '7º Dia', title: 'Chichén Itzá (opcional)', desc: 'Excursão às ruínas maias de Chichén Itzá.' },
            { dia: '8º Dia', title: 'Isla Mujeres + Mergulho', desc: 'Passeio de barco para Isla Mujeres. Snorkel no recife de coral.' },
            { dia: '9º Dia', title: 'Retorno ao Brasil', desc: 'Último café da manhã no resort. Transfer ao aeroporto CUN.' }
        ]
    },

    copa_final: {
        category: 'copa',
        title:    '🏆 Final da Copa + Nova York',
        subtitle: 'O auge da Copa do Mundo com o luxo de Manhattan',
        location: 'Nova York, NY, EUA',
        duration: '7 dias / 6 noites',
        price:       '49.900,00',
        priceCartao: '49.900,00',
        parcelas:    'Consulte condições de parcelamento',
        flag:  'Copa 2026 🏆🗽',
        badge: '💎 Luxo',
        images: [
            'imagens/copa_estadio.png',
            'imagens/nova_york.png',
            'imagens/miami.png'
        ],
        dates: '📅 Consulte datas disponíveis',
        desc: 'Viva o momento mais esperado do esporte mundial! Este pacote exclusivo leva você para a grande Final da Copa do Mundo 2026, com hospedagem de luxo em Manhattan, Nova York. Uma experiência inesquecível combinando futebol de elite e o melhor da Big Apple.',
        incluso: [
            'Passagem aérea (Econômica Premium)',
            'Hospedagem Hotel 4★/5★ em Manhattan',
            '🎟 INGRESSO PARA A FINAL DA COPA',
            '🍽 Experiências VIP e jantares exclusivos',
            '🚐 Transfer executivo aeroporto/estádio',
            '🚁 Passeio de helicóptero sobre NYC'
        ],
        nao_incluso: ['Demais refeições', 'Seguro viagem', 'Passeios extras', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Nova York', desc: 'Transfer executivo do aeroporto para o hotel em Manhattan. Check-in e jantar de boas-vindas.' },
            { dia: '2º Dia', title: 'Experiência NYC', desc: 'City tour privado pelos principais pontos da cidade e passeio de helicóptero.' },
            { dia: '3º Dia', title: 'DIA DA GRANDE FINAL 🏆', desc: '🏆 O ápice! Transfer executivo para o estádio para assistir à Final da Copa do Mundo.' },
            { dia: '4º Dia', title: 'Dia de Celebração', desc: 'Dia livre para compras na 5ª Avenida ou relaxar no Central Park.' },
            { dia: '5º Dia', title: 'Cultura e Gastronomia', desc: 'Visita a museus ou shows da Broadway (opcional) com assessoria da agência.' },
            { dia: '6º Dia', title: 'Despedida de NYC', desc: 'Último dia para desfrutar da cidade. Jantar de encerramento.' },
            { dia: '7º Dia', title: 'Retorno ao Brasil', desc: 'Transfer executivo para o aeroporto e voo de retorno.' }
        ]
    }

}; // fim DB


/**
 * Mescla pacotes criados pelo editor (localStorage e servidor)
 * com o banco de dados base. Executado automaticamente ao carregar a página.
 */
(function mergeCMS() {
    try {
        const draft = JSON.parse(localStorage.getItem('321go_cms_v1') || '{}');

        // 1. Aplica __db_overrides — sincroniza preços/títulos entre home e pacote.html
        if (draft.__db_overrides && typeof draft.__db_overrides === 'object') {
            Object.entries(draft.__db_overrides).forEach(([pkgId, overrides]) => {
                if (DB[pkgId] && typeof overrides === 'object') {
                    Object.assign(DB[pkgId], overrides);
                }
            });
        }

        // 2. Mescla pacotes novos criados pelo editor
        if (draft.__new_packages && typeof draft.__new_packages === 'object') {
            Object.entries(draft.__new_packages).forEach(([id, pkg]) => {
                if (!pkg.category) pkg.category = 'nacional';
                DB[id] = pkg;
            });
        }

        // 3. Pacotes publicados via servidor (window.__321GO_SRV_CMS)
        const srv = window.__321GO_SRV_CMS;
        if (srv) {
            if (srv.__db_overrides && typeof srv.__db_overrides === 'object') {
                Object.entries(srv.__db_overrides).forEach(([pkgId, overrides]) => {
                    if (DB[pkgId] && typeof overrides === 'object') {
                        Object.assign(DB[pkgId], overrides);
                    }
                });
            }
            if (srv.__new_packages && typeof srv.__new_packages === 'object') {
                Object.entries(srv.__new_packages).forEach(([id, pkg]) => {
                    if (!pkg.category) pkg.category = 'nacional';
                    DB[id] = pkg;
                });
            }
        }
    } catch (_) {}
})();

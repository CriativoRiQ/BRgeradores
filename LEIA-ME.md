# BR Geradores — Landing page

Site estático (HTML + CSS + JS puro, sem build). Abra `index.html` ou publique a pasta inteira.

## Estrutura

## PENDÊNCIAS (dependem de acessos/decisões da empresa)
1. **IDs de rastreamento** em `js/tracking.js` (GTM, GA4, Meta Pixel, Google Ads + rótulo de conversão). Vazios = nada é carregado. Os eventos já disparam: `whatsapp_click`, `generate_lead`, `cta_click`/`cta_orcamento`, `click_phone`, `click_email`, `click_instagram`.
2. **Domínio / hospedagem / HTTPS**: canonical, og:url, sitemap e JSON-LD usam `https://brgerador.com.br/` — confirme o domínio final. HTTPS depende da hospedagem.
3. **WhatsApp**: botões abrem conversa com (84) 99479-3000. O site antigo apontava para o catálogo `wa.me/c/558499002212` — confirme o número correto em `js/main.js` (`WA_NUMBER`).
4. **E-mail**: o site antigo exibia `brggeradores@gmail.com` mas o link apontava para `contato@brestruturas.com.br`. Usei o exibido.
5. **Formulário**: não há servidor; ao enviar, abre o WhatsApp com a mensagem pronta. Para guardar leads (CRM/planilha/e-mail) é preciso um serviço de backend.
6. **Política de Privacidade**: texto-base; completar razão social/CNPJ/endereço e revisar com assessoria jurídica.
7. **Provas sociais**: não há depoimentos reais fornecidos, então não foram inventados. Envie depoimentos/logos de clientes e cases para incluir.
8. **Endereço/mapa/horários**: não fornecidos; não incluídos.
9. **Fontes**: Montserrat via Google Fonts (conecta à internet). Para LGPD estrita, hospede a fonte localmente.
10. **Fotos**: recortadas das artes enviadas. Fotos originais em alta resolução melhoram nitidez e peso.


## Carrossel de eventos (9:16)
No `index.html`, cada `<li class="ev-card" data-photo="" data-video="">` é um evento. Para ativar:
- `data-photo="img/eventos/tardezinha.webp"` (foto vertical 9:16, ex. 720x1280, webp)
- `data-video="video/tardezinha.mp4"` (MP4 H.264, sem áudio, 5-10 s, até ~2 MB) — só é baixado quando o mouse passa (no celular, ao tocar no cartão).
Enquanto vazio, aparece a logo como espaço reservado. **Pendência: enviar fotos/vídeos reais dos 12 eventos.**

## Rodada 4
- Novas seções: Climatização (#climatizacao) e Eventos corporativos (#corporativos), com textos das artes enviadas.
- Imagens ilustrativas (frota, climatização, corporativo, portfólio) estão turvas com o aviso "Imagem em produção": trocar `img/ph-*.webp` por fotos reais quando houver.
- Mapa do Google (busca por "BR Geradores 59066-850") e bloco de depoimento (link de avaliação do Google). **Pendência: conferir se o mapa abre no ponto certo; se não, trocar o `src` do iframe pelo embed oficial do Google Maps.**
- Rodapé: "© Copyright RiQ Tecnologias Digitais. Todos os direitos reservados."
- Seções brancas têm fundo animado de malha de pontos (canvas leve, pausa fora da tela, estático se o usuário prefere menos movimento).

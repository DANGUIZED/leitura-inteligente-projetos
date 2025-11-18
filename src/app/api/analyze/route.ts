import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Formatos suportados
const SUPPORTED_IMAGE_FORMATS = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
];

const SUPPORTED_PDF_FORMAT = 'application/pdf';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const customSymbols = formData.get('customSymbols');
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Validação de formato de arquivo
    const fileType = file.type.toLowerCase();
    const isPDF = fileType === SUPPORTED_PDF_FORMAT;
    const isImage = SUPPORTED_IMAGE_FORMATS.includes(fileType);
    
    if (!isPDF && !isImage) {
      return NextResponse.json(
        { 
          error: 'Formato não suportado',
          details: `Atualmente apenas imagens (PNG, JPG, JPEG, WEBP) e PDF são suportados. Você enviou: ${fileType || 'formato desconhecido'}`,
          supportedFormats: ['PDF', 'PNG', 'JPG', 'JPEG', 'WEBP'],
          tip: 'Para arquivos DWG, converta para PDF ou imagem antes de enviar.'
        },
        { status: 400 }
      );
    }

    // Validação de tamanho (máx 200MB)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          error: 'Arquivo muito grande',
          details: `O arquivo deve ter no máximo 200MB. Tamanho atual: ${(file.size / 1024 / 1024).toFixed(2)}MB`
        },
        { status: 400 }
      );
    }

    // Converte arquivo para buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let analysisResult: string;

    // Processamento específico para PDF
    if (isPDF) {
      try {
        // Importação dinâmica do pdf-parse
        const pdfParse = (await import('pdf-parse')).default;
        
        // Extrai texto do PDF
        const pdfData = await pdfParse(buffer);
        const pdfText = pdfData.text;
        const numPages = pdfData.numpages;

        // Converte primeira página para base64 para análise visual
        // (OpenAI não aceita PDF diretamente, então usamos o texto + contexto)
        const base64 = buffer.toString('base64');
        const dataUrl = `data:application/pdf;base64,${base64}`;

        // Prompt especializado para PDF com texto extraído
        const pdfPrompt = `Você é um analista técnico especializado em projetos de engenharia e arquitetura conforme normas ABNT.

Este é um PDF de projeto técnico com ${numPages} página(s).

TEXTO EXTRAÍDO DO PDF:
${pdfText.substring(0, 8000)} ${pdfText.length > 8000 ? '...(texto truncado)' : ''}

Analise este projeto técnico e forneça um relatório COMPLETO e ESTRUTURADO em formato JSON com as seguintes informações:

1. **IDENTIFICAÇÃO DO PROJETO**
   - Tipo de projeto (arquitetônico, elétrico, hidráulico, estrutural, sanitário, PPCI)
   - Escala detectada (ex: 1:50, 1:75, 1:100)
   - Nome da prancha/projeto se visível
   - Número de páginas analisadas

2. **LEITURA DE LEGENDA E SÍMBOLOS**
   - Liste TODOS os símbolos encontrados na legenda
   - Identifique símbolos no desenho mesmo sem legenda (use conhecimento ABNT)
   - Para cada símbolo: código, nome, descrição, categoria

3. **QUANTITATIVOS - ÁREAS**
   - Área total do projeto
   - Área de cada ambiente/cômodo identificado
   - Área útil, área molhada, área de circulação
   - Medidas em metros quadrados (m²)

4. **QUANTITATIVOS - ELEMENTOS LINEARES**
   - Paredes: metragem linear por espessura (ex: 15cm, 20cm)
   - Perímetros de ambientes

5. **PONTOS ELÉTRICOS** (se aplicável)
   - Liste cada ponto: tipo, localização, coordenadas aproximadas, circuito
   - Tipos: tomadas, interruptores, pontos de luz, quadros, etc.

6. **PONTOS HIDRÁULICOS** (se aplicável)
   - Liste cada ponto: tipo, localização, diâmetro se visível
   - Tipos: água fria, água quente, esgoto, ralos, etc.

7. **ELEMENTOS ESTRUTURAIS** (se aplicável)
   - Pilares: dimensões, posição, eixos
   - Vigas: identificação, eixos
   - Lajes: espessura, tipo

8. **OBSERVAÇÕES TÉCNICAS**
   - Inconsistências encontradas
   - Símbolos sem legenda
   - Informações faltantes
   - Sugestões de melhoria

Retorne APENAS um objeto JSON válido seguindo esta estrutura:

{
  "projectType": "tipo_do_projeto",
  "scale": {
    "detected": true/false,
    "value": "1:50",
    "ratio": 50
  },
  "projectName": "nome_se_encontrado",
  "numPages": ${numPages},
  "symbols": [
    {
      "code": "código",
      "name": "nome",
      "description": "descrição",
      "category": "eletrico|hidraulico|arquitetonico|estrutural",
      "count": numero_de_ocorrencias
    }
  ],
  "areas": [
    {
      "name": "nome_do_ambiente",
      "type": "comodo|total|util|molhada|circulacao",
      "value": valor_em_m2,
      "dimensions": "largura x comprimento"
    }
  ],
  "walls": [
    {
      "thickness": espessura_em_cm,
      "linearMeters": metragem,
      "location": "descrição"
    }
  ],
  "electricalPoints": [
    {
      "type": "tipo_do_ponto",
      "location": "ambiente",
      "coordinates": "posição_aproximada",
      "circuit": "circuito_se_houver",
      "details": "detalhes_adicionais"
    }
  ],
  "hydraulicPoints": [
    {
      "type": "tipo_do_ponto",
      "location": "ambiente",
      "diameter": diametro_em_mm,
      "details": "detalhes"
    }
  ],
  "structuralElements": [
    {
      "type": "pilar|viga|laje",
      "dimensions": "dimensões",
      "position": "posição",
      "axis": "eixo_se_houver"
    }
  ],
  "observations": [
    "observação_1",
    "observação_2"
  ],
  "inconsistencies": [
    "inconsistência_1"
  ],
  "suggestions": [
    "sugestão_1"
  ]
}

IMPORTANTE: 
- Seja EXTREMAMENTE detalhado e preciso
- Use conhecimento técnico de normas ABNT
- Se não conseguir identificar algo, indique nas observações
- Calcule áreas baseado na escala detectada
- Identifique TODOS os pontos visíveis no projeto
- Use o texto extraído para identificar legendas, cotas e anotações`;

        // Chama OpenAI com análise de texto
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: pdfPrompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.2,
          response_format: { type: 'json_object' }
        });

        analysisResult = response.choices[0].message.content || '';

      } catch (pdfError: any) {
        console.error('Erro ao processar PDF:', pdfError);
        return NextResponse.json(
          { 
            error: 'Erro ao processar PDF',
            details: 'Não foi possível extrair informações do PDF. Verifique se o arquivo não está corrompido ou protegido por senha.'
          },
          { status: 500 }
        );
      }

    } else {
      // Processamento para imagens (código original)
      const base64 = buffer.toString('base64');
      const mimeType = file.type || 'image/png';
      const dataUrl = `data:${mimeType};base64,${base64}`;

      const imagePrompt = `Você é um analista técnico especializado em projetos de engenharia e arquitetura conforme normas ABNT.

Analise esta planta/projeto técnico e forneça um relatório COMPLETO e ESTRUTURADO em formato JSON com as seguintes informações:

1. **IDENTIFICAÇÃO DO PROJETO**
   - Tipo de projeto (arquitetônico, elétrico, hidráulico, estrutural, sanitário, PPCI)
   - Escala detectada (ex: 1:50, 1:75, 1:100)
   - Nome da prancha/projeto se visível

2. **LEITURA DE LEGENDA E SÍMBOLOS**
   - Liste TODOS os símbolos encontrados na legenda
   - Identifique símbolos no desenho mesmo sem legenda (use conhecimento ABNT)
   - Para cada símbolo: código, nome, descrição, categoria

3. **QUANTITATIVOS - ÁREAS**
   - Área total do projeto
   - Área de cada ambiente/cômodo identificado
   - Área útil, área molhada, área de circulação
   - Medidas em metros quadrados (m²)

4. **QUANTITATIVOS - ELEMENTOS LINEARES**
   - Paredes: metragem linear por espessura (ex: 15cm, 20cm)
   - Perímetros de ambientes

5. **PONTOS ELÉTRICOS** (se aplicável)
   - Liste cada ponto: tipo, localização, coordenadas aproximadas, circuito
   - Tipos: tomadas, interruptores, pontos de luz, quadros, etc.

6. **PONTOS HIDRÁULICOS** (se aplicável)
   - Liste cada ponto: tipo, localização, diâmetro se visível
   - Tipos: água fria, água quente, esgoto, ralos, etc.

7. **ELEMENTOS ESTRUTURAIS** (se aplicável)
   - Pilares: dimensões, posição, eixos
   - Vigas: identificação, eixos
   - Lajes: espessura, tipo

8. **OBSERVAÇÕES TÉCNICAS**
   - Inconsistências encontradas
   - Símbolos sem legenda
   - Informações faltantes
   - Sugestões de melhoria

Retorne APENAS um objeto JSON válido seguindo esta estrutura:

{
  "projectType": "tipo_do_projeto",
  "scale": {
    "detected": true/false,
    "value": "1:50",
    "ratio": 50
  },
  "projectName": "nome_se_encontrado",
  "symbols": [
    {
      "code": "código",
      "name": "nome",
      "description": "descrição",
      "category": "eletrico|hidraulico|arquitetonico|estrutural",
      "count": numero_de_ocorrencias
    }
  ],
  "areas": [
    {
      "name": "nome_do_ambiente",
      "type": "comodo|total|util|molhada|circulacao",
      "value": valor_em_m2,
      "dimensions": "largura x comprimento"
    }
  ],
  "walls": [
    {
      "thickness": espessura_em_cm,
      "linearMeters": metragem,
      "location": "descrição"
    }
  ],
  "electricalPoints": [
    {
      "type": "tipo_do_ponto",
      "location": "ambiente",
      "coordinates": "posição_aproximada",
      "circuit": "circuito_se_houver",
      "details": "detalhes_adicionais"
    }
  ],
  "hydraulicPoints": [
    {
      "type": "tipo_do_ponto",
      "location": "ambiente",
      "diameter": diametro_em_mm,
      "details": "detalhes"
    }
  ],
  "structuralElements": [
    {
      "type": "pilar|viga|laje",
      "dimensions": "dimensões",
      "position": "posição",
      "axis": "eixo_se_houver"
    }
  ],
  "observations": [
    "observação_1",
    "observação_2"
  ],
  "inconsistencies": [
    "inconsistência_1"
  ],
  "suggestions": [
    "sugestão_1"
  ]
}

IMPORTANTE: 
- Seja EXTREMAMENTE detalhado e preciso
- Use conhecimento técnico de normas ABNT
- Se não conseguir identificar algo, indique nas observações
- Calcule áreas baseado na escala detectada
- Identifique TODOS os pontos visíveis no projeto`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: imagePrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: dataUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 4000,
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      analysisResult = response.choices[0].message.content || '';
    }

    if (!analysisResult) {
      throw new Error('Nenhuma resposta da API');
    }

    const parsedResult = JSON.parse(analysisResult);

    // Adiciona metadados
    const finalResult = {
      ...parsedResult,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      analyzedAt: new Date().toISOString(),
      status: 'completed'
    };

    return NextResponse.json(finalResult);

  } catch (error: any) {
    console.error('Erro na análise:', error);
    
    // Tratamento de erros específicos
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { 
          error: 'Configuração necessária',
          details: 'Chave da API OpenAI não configurada. Configure OPENAI_API_KEY nas variáveis de ambiente.'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Erro ao processar arquivo',
        details: error.message || 'Erro desconhecido ao analisar o projeto'
      },
      { status: 500 }
    );
  }
}

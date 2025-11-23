/**
 * UC-Contratos: Template de contrato com dados preenchidos automaticamente
 */
export const generateContractTemplate = (project, company, freelancers) => {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const valorPorExtenso = numeroParaExtenso(project.orcamento_total || 0);
  
  return `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento particular de contrato de prestação de serviços, de um lado:

CONTRATANTE: ${company.nome_empresa}
CNPJ: ${company.cnpj}
Endereço: ${company.endereco || 'Não informado'}
E-mail: ${company.email}
Telefone: ${company.telefone || 'Não informado'}

E de outro lado:

CONTRATADO(S):
${freelancers.map((f, index) => `
${index + 1}. ${f.nome_completo}
   ${f.is_pj ? 'CNPJ' : 'CPF'}: ${f.cpf_cnpj}
   E-mail: ${f.email}
   Valor/Hora: R$ ${f.valor_hora.toFixed(2)}
   Papel no Projeto: ${f.papel || 'Não especificado'}
   Valor Acordado: R$ ${f.valor_acordado ? f.valor_acordado.toFixed(2) : '0,00'}
`).join('\n')}

Têm entre si justo e contratado o presente contrato de prestação de serviços, que se regerá pelas seguintes cláusulas e condições:

CLÁUSULA 1ª - DO OBJETO
O presente contrato tem por objeto a prestação de serviços profissionais de natureza técnica, especificamente:

Projeto: ${project.titulo}
Descrição: ${project.descricao}

CLÁUSULA 2ª - DO PRAZO
O prazo de execução dos serviços será:
Data de Início: ${project.data_inicio ? new Date(project.data_inicio).toLocaleDateString('pt-BR') : 'A definir'}
Data de Término: ${project.data_fim_prevista ? new Date(project.data_fim_prevista).toLocaleDateString('pt-BR') : 'A definir'}

CLÁUSULA 3ª - DO VALOR E FORMA DE PAGAMENTO
O valor total dos serviços contratados é de R$ ${(project.orcamento_total || 0).toFixed(2)} (${valorPorExtenso}).

Os pagamentos serão realizados conforme entregas e aprovações estabelecidas no cronograma do projeto, mediante apresentação de nota fiscal ou recibo.

CLÁUSULA 4ª - DAS OBRIGAÇÕES DO CONTRATADO
São obrigações do CONTRATADO:
a) Executar os serviços com qualidade e dentro dos prazos estabelecidos;
b) Manter sigilo sobre informações confidenciais do projeto;
c) Comunicar imediatamente qualquer impedimento na execução dos serviços;
d) Entregar os arquivos e documentação conforme especificado;
e) Estar disponível para revisões e ajustes solicitados.

CLÁUSULA 5ª - DAS OBRIGAÇÕES DO CONTRATANTE
São obrigações do CONTRATANTE:
a) Fornecer todas as informações necessárias para execução do projeto;
b) Efetuar os pagamentos nas datas acordadas;
c) Aprovar ou solicitar revisões das entregas em até 5 dias úteis;
d) Fornecer feedback claro sobre o trabalho realizado.

CLÁUSULA 6ª - DA PROPRIEDADE INTELECTUAL
Todos os direitos autorais e de propriedade intelectual sobre o trabalho desenvolvido serão transferidos ao CONTRATANTE após o pagamento integral dos serviços, salvo acordo em contrário.

CLÁUSULA 7ª - DA CONFIDENCIALIDADE
As partes comprometem-se a manter sigilo sobre todas as informações confidenciais trocadas durante a execução do projeto, sob pena de responsabilização civil e criminal.

CLÁUSULA 8ª - DO CANCELAMENTO
O presente contrato poderá ser cancelado por qualquer das partes mediante comunicação prévia de 15 (quinze) dias, sendo devidos os valores referentes aos serviços já executados até a data do cancelamento.

CLÁUSULA 9ª - DAS PENALIDADES
O não cumprimento das obrigações estabelecidas neste contrato sujeitará a parte infratora ao pagamento de multa de 10% (dez por cento) sobre o valor total do contrato.

CLÁUSULA 10ª - DO FORO
As partes elegem o foro da comarca de São Paulo - SP para dirimir quaisquer dúvidas oriundas do presente contrato, renunciando a qualquer outro, por mais privilegiado que seja.

E, por estarem assim justos e contratados, assinam o presente instrumento em duas vias de igual teor e forma.

Data de Emissão: ${dataAtual}


_________________________________
${company.nome_empresa}
CONTRATANTE

${freelancers.map(f => `
_________________________________
${f.nome_completo}
CONTRATADO
`).join('\n')}


Status: AGUARDANDO ASSINATURAS
  `.trim();
};

/**
 * Converte número para extenso (simplificado)
 */
function numeroParaExtenso(valor) {
  if (valor === 0) return 'zero reais';
  
  const parteInteira = Math.floor(valor);
  const parteCentavos = Math.round((valor - parteInteira) * 100);
  
  // Implementação simplificada - em produção usar biblioteca como "extenso"
  if (valor < 1000) {
    return `${parteInteira} reais${parteCentavos > 0 ? ` e ${parteCentavos} centavos` : ''}`;
  }
  
  const mil = Math.floor(parteInteira / 1000);
  const resto = parteInteira % 1000;
  
  return `${mil} mil${resto > 0 ? ` e ${resto}` : ''} reais${parteCentavos > 0 ? ` e ${parteCentavos} centavos` : ''}`;
}

/**
 * Gera HTML formatado do contrato para visualização
 */
export const generateContractHTML = (contractText) => {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contrato de Prestação de Serviços</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: white;
      color: #333;
    }
    h1 {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 30px;
      text-transform: uppercase;
    }
    p {
      text-align: justify;
      margin-bottom: 15px;
    }
    .section {
      margin-bottom: 20px;
    }
    .signature-block {
      margin-top: 50px;
      text-align: center;
    }
    .signature-line {
      border-top: 1px solid #333;
      width: 300px;
      margin: 50px auto 10px;
    }
    .signed {
      color: #10b981;
      font-weight: bold;
    }
    .pending {
      color: #f59e0b;
      font-weight: bold;
    }
    @media print {
      body {
        margin: 0;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <pre style="font-family: 'Times New Roman', Times, serif; white-space: pre-wrap; word-wrap: break-word;">${contractText}</pre>
</body>
</html>
  `.trim();
};
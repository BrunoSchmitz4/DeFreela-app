// ========================================
// TYPES BASEADOS NO SCHEMA POSTGRESQL
// ========================================

/**
 * PESSOA (tabela base)
 */
export const PessoaType = {
  id: null,
  email: '',
  tipo_usuario: '', // 'ADMIN' | 'EMPRESA' | 'FREELANCER'
  criado_em: '',
  atualizado_em: ''
};

/**
 * EMPRESA (herda de Pessoa)
 */
export const EmpresaType = {
  id: null,
  email: '',
  tipo_usuario: 'EMPRESA',
  nome_empresa: '',
  cnpj: '',
  telefone: '',
  endereco: '',
  criado_em: '',
  atualizado_em: ''
};

/**
 * FREELANCER (herda de Pessoa)
 */
export const FreelancerType = {
  id: null,
  email: '',
  tipo_usuario: 'FREELANCER',
  nome_completo: '',
  cpf_cnpj: '',
  is_pj: false,
  habilidades: '', // string separada por vírgulas no banco
  valor_hora: 0,
  portfolio_url: '',
  criado_em: '',
  atualizado_em: ''
};

/**
 * PROJETO
 */
export const ProjetoType = {
  id: null,
  empresa_id: null,
  titulo: '',
  descricao: '',
  orcamento_total: 0,
  data_inicio: '',
  data_fim_prevista: '',
  status: 'PLANEJAMENTO', // enum
  criado_em: '',
  atualizado_em: '',
  
  // Relacionamentos (populados via joins)
  empresa: null, // EmpresaType
  atividades: [], // AtividadeType[]
  freelancers: [], // ProjetoFreelancerType[]
  contrato: null // ContratoType
};

/**
 * PROJETO_FREELANCER (tabela de relacionamento N:N)
 */
export const ProjetoFreelancerType = {
  projeto_id: null,
  freelancer_id: null,
  papel: '', // ex: "Designer Principal"
  valor_acordado: 0,
  atribuido_em: '',
  
  // Relacionamentos
  projeto: null, // ProjetoType
  freelancer: null // FreelancerType
};

/**
 * CONTRATO
 */
export const ContratoType = {
  id: null,
  projeto_id: null,
  termos: '',
  valor_total: 0,
  data_inicio: '',
  data_fim: '',
  status: 'ATIVO', // enum
  assinado_empresa: false,
  assinado_freelancer: false,
  criado_em: '',
  
  // Relacionamentos
  projeto: null // ProjetoType
};

/**
 * ATIVIDADE
 */
export const AtividadeType = {
  id: null,
  projeto_id: null,
  nome: '',
  descricao: '',
  ordem: 0, // ordem sequencial no projeto
  status: 'PENDENTE', // enum
  criado_em: '',
  atualizado_em: '',
  
  // Relacionamentos
  projeto: null, // ProjetoType
  tarefas: [] // TarefaType[]
};

/**
 * TAREFA
 */
export const TarefaType = {
  id: null,
  atividade_id: null,
  freelancer_id: null,
  titulo: '',
  descricao: '',
  prioridade: 'MEDIA', // enum
  prazo: '',
  valor: 0,
  status: 'PENDENTE', // enum
  criado_em: '',
  atualizado_em: '',
  
  // Relacionamentos
  atividade: null, // AtividadeType
  freelancer: null, // FreelancerType
  entregas: [], // EntregaType[]
  comentarios: [], // ComentarioType[]
  pagamentos: [] // PagamentoType[]
};

/**
 * ENTREGA
 */
export const EntregaType = {
  id: null,
  tarefa_id: null,
  arquivo_url: '',
  observacoes: '',
  status: 'AGUARDANDO_APROVACAO', // enum
  enviado_em: '',
  aprovado_em: '',
  aprovado_por: null, // id da pessoa
  
  // Relacionamentos
  tarefa: null, // TarefaType
  aprovador: null // PessoaType
};

/**
 * PAGAMENTO
 */
export const PagamentoType = {
  id: null,
  tarefa_id: null,
  projeto_id: null,
  freelancer_id: null,
  valor: 0,
  data_pagamento: '',
  metodo_pagamento: 'PIX', // enum
  status: 'PENDENTE', // enum
  observacoes: '',
  criado_em: '',
  
  // Relacionamentos
  tarefa: null, // TarefaType
  projeto: null, // ProjetoType
  freelancer: null // FreelancerType
};

/**
 * COMENTARIO
 */
export const ComentarioType = {
  id: null,
  autor_id: null,
  tarefa_id: null,
  atividade_id: null,
  conteudo: '',
  criado_em: '',
  
  // Relacionamentos
  autor: null, // PessoaType
  tarefa: null, // TarefaType
  atividade: null // AtividadeType
};

/**
 * NOTIFICACAO
 */
export const NotificacaoType = {
  id: null,
  usuario_id: null,
  tipo: '', // enum
  titulo: '',
  mensagem: '',
  lida: false,
  link_referencia: '',
  criado_em: '',
  
  // Relacionamentos
  usuario: null // PessoaType
};

/**
 * LOG
 */
export const LogType = {
  id: null,
  usuario_id: null,
  entidade: '', // ex: 'PROJETO', 'TAREFA'
  entidade_id: null,
  acao: '', // enum
  descricao: '',
  dados_antigos: null, // JSONB
  dados_novos: null, // JSONB
  ip_address: '',
  criado_em: '',
  
  // Relacionamentos
  usuario: null // PessoaType
};

// ========================================
// HELPERS
// ========================================

/**
 * Cria cópia profunda de um tipo
 * @param {object} type 
 * @returns {object}
 */
export function createInitial(type) {
  return JSON.parse(JSON.stringify(type));
}

/**
 * Converte habilidades (string → array)
 * @param {string} habilidades 
 * @returns {string[]}
 */
export function parseHabilidades(habilidades) {
  if (!habilidades) return [];
  return habilidades.split(',').map(h => h.trim()).filter(Boolean);
}

/**
 * Converte habilidades (array → string)
 * @param {string[]} habilidades 
 * @returns {string}
 */
export function stringifyHabilidades(habilidades) {
  if (!Array.isArray(habilidades)) return '';
  return habilidades.filter(Boolean).join(', ');
}

/**
 * Verifica se é empresa
 * @param {object} user 
 * @returns {boolean}
 */
export function isEmpresa(user) {
  return user?.tipo_usuario === 'EMPRESA';
}

/**
 * Verifica se é freelancer
 * @param {object} user 
 * @returns {boolean}
 */
export function isFreelancer(user) {
  return user?.tipo_usuario === 'FREELANCER';
}

/**
 * Verifica se é admin
 * @param {object} user 
 * @returns {boolean}
 */
export function isAdmin(user) {
  return user?.tipo_usuario === 'ADMIN';
}

// ========================================
// SHAPES PARA FORMULÁRIOS
// ========================================

export const CreateProjetoForm = {
  titulo: '',
  descricao: '',
  orcamento_total: '',
  data_inicio: '',
  data_fim_prevista: ''
};

export const CreateAtividadeForm = {
  nome: '',
  descricao: '',
  ordem: 1
};

export const CreateTarefaForm = {
  titulo: '',
  descricao: '',
  prioridade: 'MEDIA',
  prazo: '',
  valor: '',
  freelancer_id: null
};

export const CreateEntregaForm = {
  arquivo: null, // File object
  observacoes: ''
};

export const CreatePagamentoForm = {
  valor: '',
  data_pagamento: '',
  metodo_pagamento: 'PIX',
  observacoes: ''
};

export const CreateComentarioForm = {
  conteudo: ''
};

export const RegisterForm = {
  nome: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export const LoginForm = {
  email: '',
  password: ''
};
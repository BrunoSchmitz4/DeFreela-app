import axios from "axios";

// 🔧 CONFIGURAÇÃO PARA CONECTAR COM SPRING BOOT
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 15000, // 15 segundos
  withCredentials: false // Mude para true se usar cookies
});

// ==========================================
// INTERCEPTOR - REQUEST (Adiciona Token JWT)
// ==========================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debug (remover em produção)
    if (process.env.REACT_APP_ENV === 'development') {
      console.log('🔵 REQUEST:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

// ==========================================
// INTERCEPTOR - RESPONSE (Trata Erros)
// ==========================================
api.interceptors.response.use(
  (response) => {
    // Log para debug (remover em produção)
    if (process.env.REACT_APP_ENV === 'development') {
      console.log('🟢 RESPONSE:', response.config.method?.toUpperCase(), response.config.url, response.status);
    }
    
    return response;
  },
  (error) => {
    // Log detalhado do erro
    console.error('❌ RESPONSE ERROR:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });

    // Tratamento específico por status
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token inválido ou expirado
          console.warn('🔐 Token inválido ou expirado. Redirecionando para login...');
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          
          // Só redireciona se não estiver em rota de auth
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/register')) {
            window.location.href = "/login";
          }
          break;

        case 403:
          // Acesso negado
          console.warn('🚫 Acesso negado');
          alert('Você não tem permissão para realizar esta ação.');
          break;

        case 404:
          // Recurso não encontrado
          console.warn('🔍 Recurso não encontrado');
          break;

        case 500:
          // Erro interno do servidor
          console.error('💥 Erro interno do servidor');
          alert('Erro no servidor. Tente novamente mais tarde.');
          break;

        default:
          console.error('❓ Erro desconhecido:', error.response.status);
      }
    } else if (error.request) {
      // Request foi feito mas não houve resposta
      console.error('📡 Sem resposta do servidor. Verifique se o backend está rodando.');
      
      if (process.env.REACT_APP_ENV === 'development') {
        alert('❌ Erro de conexão!\n\nVerifique se o backend Spring Boot está rodando em http://localhost:8080');
      }
    } else {
      // Erro ao configurar request
      console.error('⚙️ Erro ao configurar request:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

// ==========================================
// HELPER: Testar conexão com backend
// ==========================================
export async function testConnection() {
  try {
    const response = await api.get('/actuator/health');
    console.log('✅ Backend conectado:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Falha ao conectar com backend:', error.message);
    return { success: false, error: error.message };
  }
}

// ==========================================
// HELPER: Verificar token
// ==========================================
export function hasValidToken() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return false;
  }

  try {
    // Decodifica JWT (simples, sem validação de assinatura)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp * 1000; // Converter para milliseconds
    
    // Verifica se expirou
    if (Date.now() >= expiration) {
      console.warn('⏰ Token expirado');
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao validar token:', error);
    return false;
  }
}
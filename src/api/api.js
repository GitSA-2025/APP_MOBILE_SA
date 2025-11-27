import axios from 'axios'; // Importa o Axios para fazer requisições HTTP
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage para salvar/ler dados locais (como token)

// URL base da sua API
const API_URL = 'https://api-web-mobile.accesssystemfatec.workers.dev/';

// Cria uma instância do Axios com configurações iniciais
const api = axios.create({
  baseURL: API_URL, // Todas as requisições usarão essa URL como base
  headers: {
    'Content-Type': 'application/json', // Todas as requisições enviam JSON
  },
});

// Interceptor que adiciona o token de autenticação em cada requisição
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken'); // Pega o token salvo localmente
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token no cabeçalho Authorization
    }
    return config; // Retorna a configuração atualizada
  },
  (error) => {
    return Promise.reject(error); // Caso ocorra erro ao configurar a requisição, rejeita a promise
  }
);

export default api; // Exporta a instância para ser usada em todo o app

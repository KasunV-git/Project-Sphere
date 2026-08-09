import api from './api';

const dataService = {
  // Fetch all services with optional filters (category, search, page, limit)
  getServices: async (params = {}) => {
    try {
      const response = await api.get('/services', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Fetch a single service by ID
  getServiceById: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Fetch all categories
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Usage related functions (can be expanded later)
  recordUsage: async (serviceId) => {
    try {
      const response = await api.post('/usage', { serviceId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default dataService;

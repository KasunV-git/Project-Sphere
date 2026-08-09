import { useState, useEffect } from 'react';
import dataService from '../../services/dataService';
import ServiceCard from '../../components/ServiceCard';
import Loader from '../../components/Loader';
import '../../styles/pages.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [servicesData, categoriesData] = await Promise.all([
          dataService.getServices(),
          dataService.getCategories()
        ]);
        
        setServices(servicesData.data || []);
        setCategories(categoriesData.data || []);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter services based on search and category
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Some backend APIs return full category objects, some return IDs
    const categoryId = service.category?._id || service.category;
    const matchesCategory = selectedCategory === '' || categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Discover Services</h1>
          <p className="page-subtitle">Find the tools you need to boost your productivity.</p>
        </div>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search services..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="category-filter">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-input"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <Loader fullScreen />
      ) : (
        <>
          {filteredServices.length === 0 ? (
            <div className="empty-state">
              <h3>No services found</h3>
              <p>Try adjusting your search or category filters.</p>
            </div>
          ) : (
            <div className="services-grid">
              {filteredServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Services;

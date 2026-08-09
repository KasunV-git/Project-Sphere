import { Link } from 'react-router-dom';
import '../styles/components.css';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <div className="service-card-header">
        <div className="service-icon">
          {/* Fallback icon if none provided */}
          <span className="material-icons">{service.icon || 'apps'}</span>
        </div>
        <div className="service-rating">
          <span className="star">★</span>
          <span>{service.averageRating ? service.averageRating.toFixed(1) : 'New'}</span>
        </div>
      </div>
      
      <div className="service-card-body">
        <h3 className="service-title">{service.name}</h3>
        {service.category && (
          <span className="service-category">{service.category.name || service.category}</span>
        )}
        <p className="service-description">{service.description}</p>
      </div>
      
      <div className="service-card-footer">
        <Link to={`/services/${service._id}`} className="btn-primary">
          Open Service
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;

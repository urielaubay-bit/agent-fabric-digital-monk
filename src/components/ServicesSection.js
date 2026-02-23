import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaVideo, FaDrone, FaCamera, FaMusic, FaVolumeUp, FaChartLine } from 'react-icons/fa';
import './ServicesSection.css';

const services = [
  { icon: <FaVideo />, title: 'Video Production', description: 'High-quality video content for all your needs.' },
  { icon: <FaDrone />, title: 'Drone Flights', description: 'Breathtaking aerial footage and photography.' },
  { icon: <FaCamera />, title: 'Photography', description: 'Capturing moments that last a lifetime.' },
  { icon: <FaMusic />, title: 'DJ Services', description: 'Setting the perfect mood for any event.' },
  { icon: <FaVolumeUp />, title: 'Sound Design', description: 'Creating immersive audio experiences.' },
  { icon: <FaChartLine />, title: 'Digital Marketing', description: 'Boosting your online presence and reach.' }
];

const ServicesSection = () => {
  return (
    <section className="services-section">
      <Container>
        <h2 className="text-center mb-5">Our Services</h2>
        <Row>
          {services.map((service, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={4} className="mb-4">
              <div className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ServicesSection;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import serverUrl from '../config/config';
import { useNavigate } from 'react-router-dom';

const CompanyDetails = () => {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${serverUrl.apiUrl}api/config`);
        setConfig(response.data);
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    fetchConfig();
  }, []);

  const navigate = useNavigate();

  const NavigateHandle = () => {
    navigate('/Configuration');
  };

  if (!config) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center my-4">
        <h2>Configuration Details</h2>
        <div>
          <button type="button" className="btn btn-primary mx-4 " onClick={() => window.location.reload()}>
            Refresh
          </button>
          <button type="button" className="btn btn-primary mx-4 " onClick={NavigateHandle}>
            Configure App
          </button>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <img src={`${serverUrl.apiUrl}${config.companyLogo}`} alt="Company Logo" className="img-fluid rounded" />
            </div>
            <div className="col-md-8">
              <h4 className="card-title">{config.companyName}</h4>
              <p className="card-text">
                <strong>Company Size:</strong> {config.companySize}
              </p>
              <p className="card-text">
                <strong>In Time:</strong> {config.inTime}
              </p>
              <p className="card-text">
                <strong>Last In Time:</strong> {config.lastInTime}
              </p>
              <p className="card-text">
                <strong>Out Time:</strong> {config.outTime}
              </p>
              <p className="card-text">
                <strong>Week Type:</strong> {config.weekType}
              </p>
              <p className="card-text">
                <strong>Departments:</strong>{' '}
                {config.departments.map((department, index) => (
                  <span key={index}>
                    {department}
                    {index < config.departments.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;

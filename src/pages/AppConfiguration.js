import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import serverUrl from '../config/config';

const AppConfiguration = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyLogo: null,
    companySize: '',
    inTime: '',
    outTime: '',
    weekType: 'Monday to Friday',
    lastInTime: '',
    holidays: [''],
    departments: ['']
  });
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${serverUrl.apiUrl}api/config`);
        setConfig(response.data);
        setFormData(response.data); // Set the form data with fetched config
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };
  
    fetchConfig();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, companyLogo: e.target.files[0] });
  };

  const handleArrayChange = (index, e, arrayName) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = e.target.value;
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const addArrayField = (arrayName) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], ''] });
  };

  const removeArrayField = (index, arrayName) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === 'object' && formData[key] !== null) {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
    

    try {
      const response = await axios.post(`${serverUrl.apiUrl}api/config`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Configuration saved successfully!');
      // console.log('Configuration saved:', response.data);
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>App Configuration</h2>
      <form onSubmit={handleSubmit}>
        {/* Other fields */}
        <div className="mb-3">
          <label htmlFor="companyName" className="form-label">
            Company Name
          </label>
          <input type="text" className="form-control" id="companyName" name="companyName" value={formData.companyName || ''}onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="companyLogo" className="form-label">
            Company Logo
          </label>
          <input type="file" className="form-control" id="companyLogo" name="companyLogo" onChange={handleFileChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="companySize" className="form-label">
            Company Size
          </label>
          <input type="number" className="form-control" id="companySize" name="companySize" value={formData.companySize} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="inTime" className="form-label">
            In Time
          </label>
          <input type="time" className="form-control" id="inTime" name="inTime" value={formData.inTime} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="outTime" className="form-label">
            Out Time
          </label>
          <input type="time" className="form-control" id="outTime" name="outTime" value={formData.outTime} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="lastInTime" className="form-label">
            Last In Time
          </label>
          <input type="time" className="form-control" id="lastInTime" name="lastInTime" value={formData.lastInTime} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="weekType" className="form-label">
            Week Type
          </label>
          <select className="form-select" id="weekType" name="weekType" value={formData.weekType} onChange={handleChange}>
            <option value="Monday to Friday">Monday to Friday</option>
            <option value="Monday to Saturday">Monday to Saturday</option>
          </select>
        </div>
        {/* Holidays */}
        <div className="mb-3">
          <label className="form-label">Company Holidays</label>
          {formData.holidays && formData.holidays.map((holiday, index) => (
            <div key={index} className="input-group mb-2">
              <input type="date" className="form-control" value={holiday} onChange={(e) => handleArrayChange(index, e, 'holidays')} />
              <button type="button" className="btn btn-danger" onClick={() => removeArrayField(index, 'holidays')}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={() => addArrayField('holidays')}>
            Add Holiday
          </button>
        </div>
        {/* Departments */}
        <div className="mb-3">
          <label className="form-label">Departments</label>
          {formData.departments.map((department, index) => (
            <div key={index} className="input-group mb-2">
              <input type="text" className="form-control" value={department} onChange={(e) => handleArrayChange(index, e, 'departments')} />
              <button type="button" className="btn btn-danger" onClick={() => removeArrayField(index, 'departments')}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={() => addArrayField('departments')}>
            Add Department
          </button>
        </div>
        <button type="submit" className="btn btn-primary">
          Save Configuration
        </button>
      </form>
    </div>
  );
};

export default AppConfiguration;

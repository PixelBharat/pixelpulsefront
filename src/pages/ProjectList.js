import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import AddProject from '../popups/AddProject';
import UploadIcon from '../assets/Upload (1).svg';
import PlusIcon from '../assets/plus.svg';
import list_close from '../assets/close_small.svg';
import axios from 'axios';
import ServerUrl from '../config/config';
import Head from '../components/Head';
import cnder from '../assets/Calendar.svg';
import plus from '../assets/plus.svg';
import { set } from 'mongoose';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

const ProjectList = () => {
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tasks, setTasks] = useState([{ id: 1, name: '' }]);
  const [links, setLinks] = useState([{ id: 1, url: '' }]);
  const [teammemeber, setteammemeber] = useState([{ id: 1, name: '' }]);
  const [config, setConfig] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [managernamee, setmanagernamee] = useState('');
  const [getdepartment, setgetdepartment] = useState([]);
  const user = useContext(AuthContext);
  const currentuserId = user.user.id;
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${ServerUrl.apiUrl}api/employee/getemployees`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
        console.log('employees', employees);
      } else {
        console.error('Failed to fetch employees:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${ServerUrl.apiUrl}api/config`);
        const data = response.data;
        setConfig(data);
        console.log('res data', response.data);
        setgetdepartment(response.data.department);
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    fetchConfig();
  }, []);

  const openDatePicker = () => {
    document.getElementById('startDateInput').focus();
  };

  const openDatePicker1 = () => {
    document.getElementById('endDateInput').focus();
  };

  const openPopup = () => {
    setOpen(true);
  };

  const closePopup = () => {
    setOpen(false);
  };

  const handleClientNameChange = (e) => {
    setClientName(e.target.value);
  };

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    console.log('Selected Category:', selectedCategory);
  };

  const managername = employees.filter((e) => {
    return e.role === 'Manager' && e.departmentId === category;
  });
  console.log('managername filter', managername);

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prevAttachments) => [...prevAttachments, ...files]);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files) => {
    setAttachments((prevAttachments) => [...prevAttachments, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleTaskChange = (id, value) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, name: value } : task)));
  };

  const addTaskField = () => {
    setTasks([...tasks, { id: tasks.length + 1, name: '' }]);
  };

  const handleLinkChange = (id, value) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, url: value } : link)));
  };

  const addLinkField = () => {
    setLinks([...links, { id: links.length + 1, url: '' }]);
  };
  const handleManagerChange = (e) => {
    setmanagernamee(e.target.value);
    const selectedCategory = e.target.value;
    setmanagernamee(selectedCategory);
    console.log('Selected maneger:', selectedCategory);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('clientName', clientName);
    formData.append('projectName', projectName);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('createdBy', currentuserId);
    formData.append('reportingTo', managernamee);

    tasks.forEach((task, index) => {
      formData.append(`tasks[${index}]`, task.name);
    });

    links.forEach((link, index) => {
      formData.append(`links[${index}]`, link.url);
    });

    attachments.forEach((file, index) => {
      formData.append('attachments', file);
    });

    try {
      const response = await axios.post(`${ServerUrl.apiUrl}api/projects`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Project saved:', response.data);
      setOpen(false);
      setClientName('');
      setProjectName('');
      setCategory('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setmanagernamee('');
      setTasks([{ id: 1, name: '' }]);
      setLinks([{ id: 1, url: '' }]);
      setAttachments([]);
      toast.success('Project Created successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Error creating project!');
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleCancel = () => {
    // Implement cancel logic here if needed
    console.log('Cancel button clicked');
    setOpen(false);
  };

  const handleSave = () => {
    handleSubmit();
  };

  const removeAttachment = (index) => {
    setAttachments((prevAttachments) => prevAttachments.filter((_, i) => i !== index));
  };

  const removeTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const removeLink = (index) => {
    setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="maincnt">
      <Head heading="Add Project" />
      <div className="styled-container">{open && <AddProject close={closePopup} />}</div>

      <div className="header-project-list">
        <h2 className="headertxt-project-list m-0">Mandatory Options</h2>
      </div>

      <div className="client-project-section">
        <div className="input-field">
          <label htmlFor="clientNameInput">Client Name:</label>
          <input type="text" id="clientNameInput" value={clientName} onChange={handleClientNameChange} placeholder="Enter Client Name" className="project-input" />
        </div>

        <div className="input-field">
          <label htmlFor="projectNameInput">Project Name:</label>
          <input type="text" id="projectNameInput" value={projectName} onChange={handleProjectNameChange} placeholder="Enter Project Name" className="project-input" />
        </div>

        <div className="input-field">
          <label htmlFor="categorySelect">Category:</label>
          <select id="categorySelect" value={category} onChange={handleCategoryChange} className="selector-dropdown">
            <option value="">Select department</option>
            {config?.departments?.map((department, index) => {
              return (
                <>
                  <option key={index}>{department}</option>
                </>
              );
            })}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="description-project-list">Description</label>
        <input type="text" id="description-project-list" value={description} onChange={handleDescriptionChange} placeholder="What have you worked on?" className="description-input" />
      </div>
      <div className="attach-project-list">
        <div className="attachment-wrapper-main">
          <label htmlFor="attachment">Attachments</label>
          <div className="attachment-wrapper" onDrop={handleFileDrop} onDragOver={handleDragOver}>
            <p>
              {' '}
              <div className="upload-icon" onClick={() => document.getElementById('fileInput').click()}>
                <img src={UploadIcon} alt="Upload Icon" />
                Drop File To Atach{' '}
              </div>
            </p>
            <input type="file" multiple onChange={handleAttachmentChange} style={{ display: 'none' }} id="fileInput" />
          </div>

          <p className="file-item-attach">Attach Here</p>
        </div>
        <div className="frrr">
          <div className="fielddd">
            {attachments.length > 0 ? (
              attachments.map((file, index) => (
                <div key={index} className="file-item">
                  <p>
                    File {index + 1}: {file.name}
                    <img src={list_close} alt="Close Icon" className="close-icon" onClick={() => removeAttachment(index)} />
                  </p>
                </div>
              ))
            ) : (
              <p>No files attached</p>
            )}
          </div>
        </div>
      </div>

      <div className="ftr">
        <h2 className="footertext m-0">Optional info</h2>
      </div>

      <div className="task-field">
        <div className="fieldd">
          <div className="task-field-div-add">
            <div className="plus-button-container">
              <label htmlFor="tasknameinput">Tasks:</label>
            </div>
          </div>
          <div className="frrr">
            <div className="fielddd2">
              {tasks.map((task, index) => (
                <div key={task.id} className="task-item">
                  <div className="project-input-div-1">
                    <input type="text" id={`taskNameInput-${task.id}`} value={task.name} onChange={(e) => handleTaskChange(task.id, e.target.value)} placeholder={`Task ${index + 1}`} className="project-input-task" />
                    <img src={list_close} alt="Close Icon" className="close-icon" onClick={() => removeTask(index)} />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addTaskField} className="add-task-button">
                <img src={PlusIcon} alt="Add Task" className="add-task-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="task-field">
        <div className="fieldd">
          <div className="task-field-div-add">
            <div className="plus-button-container">
              <label htmlFor="linkInput">Add Links:</label>
            </div>
          </div>
          <div className="fielddd2">
            {links.map((link, index) => (
              <div key={link.id} className="task-item">
                <div className="project-input-div-1 project-input-div-2">
                  <input type="text" id={`linkInput-${link.id}`} value={link.url} onChange={(e) => handleLinkChange(link.id, e.target.value)} placeholder={`Link ${index + 1}`} className="project-input" />
                  <img src={list_close} alt="Close Icon" className="close-icon" onClick={() => removeLink(index)} />
                </div>
              </div>
            ))}
            <button type="button" onClick={addLinkField} className="add-task-button">
              <img src={plus} alt="Add Link" className="add-task-icon" />
            </button>
          </div>
        </div>
      </div>

      <div className="duration-wrapper">
        <h2 className="duration-title">Project Duration</h2>
        <div className="duration-inputs">
          <div className="date-input">
            <label htmlFor="startDateInput">Start Date:</label>
            <div className="date-container-img">
              <input type="date" id="startDateInput" value={startDate} onChange={handleStartDateChange} className="project-input" />
              <div class="image-container">
                <img src={cnder} alt="Open Calendar" onClick={openDatePicker} className="calendar-icon" />
              </div>
            </div>
          </div>
          <p>-</p>
          <div className="date-input">
            <label htmlFor="endDateInput">End Date:</label>
            <div className="date-container-img">
              <input type="date" id="endDateInput" value={endDate} onChange={handleEndDateChange} className="project-input" />
              <div class="image-container">
                <img src={cnder} onClick={openDatePicker1} alt="Open Calendar" className="calendar-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="assignment-form">
        <div className="input-field">
          <label htmlFor="assignToInput">Assign to:</label>
          <select id="categorySelect" value={managernamee} onChange={handleManagerChange} className="selector-dropdown">
            <option value="">select manager</option>
            {managername.map((department, index) => {
              return (
                <>
                  <option key={index} value={department._id}>
                    {department.name}
                  </option>
                </>
              );
            })}
          </select>
        </div>
      </div>
      <div className="savcanbtn">
        <div className="btnstart">
          <button className="cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button className="save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" className="toast-container" />
    </div>
  );
};

export default ProjectList;

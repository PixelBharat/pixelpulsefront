import React, { useEffect, useState } from 'react';
import AddProject from "../popups/AddProject";
import UploadIcon from "../assets/Upload (1).svg";
import PlusIcon from "../assets/plus.svg";
import list_close from "../assets/close_small.svg";
import axios from "axios";
import ServerUrl from '../config/config';
import Head from './Head';

const ProjectSettings = ({ projectId,setHeading,setstaus }) => {
  // console.log(projectId);
  const [newProject, setNewProject] = useState(projectId.ProjectId);
  const [project, setProject] = useState({
    clientName: '',
    projectName: '',
    category: '',
    description: '',
    startDate: '',
    endDate: '',
    tasks: [],
    links: [],
    attachments: [],

  });
  useEffect(()=>{
    setHeading("Project Settings")
    setstaus("")
  })

  const newid = projectId.ProjectId
  // console.log(newid);
  useEffect(() => {
    // Fetch the current project data when the component mounts
    const fetchProject = async () => {
      try {
        const response = await axios.get(` ${ServerUrl.apiUrl}api/projects/${newid}`);
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTasksChange = (e, index) => {
    const { value } = e.target;
    const newTasks = [...project.tasks];
    newTasks[index] = value;
    setProject(prevState => ({ ...prevState, tasks: newTasks }));
  };

  const handleLinksChange = (e, index) => {
    const { value } = e.target;
    const newLinks = [...project.links];
    newLinks[index] = value;
    setProject(prevState => ({ ...prevState, links: newLinks }));
  };

  const handleFileChange = (e) => {
    setProject(prevState => ({ ...prevState, attachments: [...e.target.files] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newformdata = Object.fromEntries(formData.entries());


    newformdata.tasks = JSON.stringify(project.tasks);
    newformdata.links = JSON.stringify(project.links);

    project.attachments.forEach((file, index) => {
      newformdata[`attachments[${index}]`] = file;
    });
    // console.log(newformdata);

    try {
      const response = await axios.put(
        `${ServerUrl.apiUrl}api/projects/updateprojects/${newid}`, {
        newformdata,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      );
      // console.log('Project updated:', response.data);

    } catch (error) {
      console.error('Error updating project:', error);

    }

  };


  return (<>
   <div className="main">
   <div className="frame">
    <div className="header-project-list">
        <h2 className="headertxt-project-list m-0">Project Update Settings</h2>
      </div>
    <form onSubmit={handleSubmit}>
    <div className="client-project-section">
      <div className='input-field'>
        <label className="form-label">Client Name</label>
        <input
          type="text"
          name="clientName"
          value={project.clientName}
          onChange={handleChange}
          className="form-control"
          placeholder='Client Name'
        />
      </div>
      <div className='input-field'>
        <label>Project Name</label>
        <input
          type="text"
          name="projectName"
          value={project.projectName}
          onChange={handleChange}
          className="form-control"
          placeholder='Project Name'
        />
      </div>
      <div className='input-field'>
        <label>Category</label>
        <input
          type="text"
          name="category"
          value={project.category}
          onChange={handleChange}
          className="form-control"
          placeholder='Category'
        />
      </div>
      </div>
      <div className='field'>
        <label htmlFor='description-project-list'>Description</label>
        <textarea
          name="description"
          value={project.description}
          onChange={handleChange}
          className="form-control"
          placeholder='Description'
          id="description-project-list"
        />
      </div>
      <div className="client-project-section">
      <div className='input-field'>
        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={project.startDate}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className='input-field'>
        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          value={project.endDate}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      </div>
      <div className='input-field'>
        <label>Tasks</label>
        {project.tasks.map((task, index) => (
          <input
            key={index}
            type="text" 
            value={task}
            onChange={(e) => handleTasksChange(e, index)}
            className="form-control task-control-div"
          />
        ))}
        <button className='save' type="button" onClick={() => setProject(prevState => ({ ...prevState, tasks: [...prevState.tasks, ''] }))}>
          Add Task
        </button>
      </div>
      <div className='input-field'>
        <label>Links</label>
        {project.links.map((link, index) => (
          <input
            key={index}
            type="text"
            value={link}
            onChange={(e) => handleLinksChange(e, index)}
             className="form-control task-control-div"
          />
        ))}
        <button className='save' type="button" onClick={() => setProject(prevState => ({ ...prevState, links: [...prevState.links, ''] }))}>
          Add Link
        </button>
      </div>
      <div className='input-field'>
        <label>Attachments</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
           className="form-control"
        />
      </div>
      <button className='save' type="submit">Update Project</button>
    </form>
  </div>
  </div></>);
}

export default ProjectSettings
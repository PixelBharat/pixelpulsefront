import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ServerUrl from '../config/config';
import Head from '../components/Head';
import { set } from 'mongoose';
import { ToastContainer,toast } from 'react-toastify';
const AddTask = () => {
  const { user } = useContext(AuthContext);
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState(['']);
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('low');
  const [attachments, setAttachments] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState(null);
  const [TaskId, setTaskId] = useState(null);
  const [newtask, setnewtask] = useState([]);
  const navigate = useNavigate();
  const projectId = useParams();
  const generateTaskId = () => Math.floor(1000 + Math.random() * 9000);
  const generateTaskAlias = (name) => name.slice(0, 2).toUpperCase() + Math.floor(10 + Math.random() * 90);
  let taskId = null;
  const project = projectId.ProjectId;
  taskId = useParams().ProjectId;
  console.log("new id ", taskId);
  console.log(taskId.length)

  console.log(teamMembers);
  useEffect(() => {
    if (!project) {
      setError('Project ID is undefined');
      return;
    }
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`${ServerUrl.apiUrl}api/projects/${project}/teamMembers`);
        if (response.status === 200) {
          const memberIds = response.data.teamMembers;
          const memberDetails = await Promise.all(memberIds.map((id) => axios.get(`${ServerUrl.apiUrl}api/employee/getsingleemployee/${id}`)));
          setTeamMembers(memberDetails.map((res) => res.data));
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {

        console.error('Error fetching team members:', error);
      }
    };

    fetchTeamMembers();
  }, [project]);

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project) {
      setError('Project ID is not available');
      return;
    }

    const taskId = generateTaskId();
    const taskAlias = generateTaskAlias(taskName);
    const today = new Date().toISOString().split('T')[0];

    const formData = new FormData();
    formData.append('taskId', taskId);
    formData.append('projectId', project);
    formData.append('taskAlias', taskAlias);
    formData.append('name', taskName);
    formData.append('description', description);
    formData.append('assignedTo', assignedTo);
    formData.append('status', status);
    formData.append('startDate', today);
    formData.append('endDate', today);
    formData.append('priority', priority);
    formData.append('createdBy', user.id);
    formData.append('reporter', user.id);

    attachments.forEach((file) => {
      formData.append('attachments', file);
    });

    try {
      await axios.post(`${ServerUrl.apiUrl}api/tasks`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate(`/ProjectDashboard/${project}`);
    } catch (error) {
      setError('Error creating task');
      console.error('Error creating task:', error);
    }

  };


  const handleSubmit2 = async (e) => {
    e.preventDefault();
    if (!project) {
      setError('Project ID is not available');
      return;
    }

    const taskAlias = generateTaskAlias(taskName);
    const today = new Date().toISOString().split('T')[0];

    const formData = new FormData();
    formData.append('projectId', project);
    formData.append('taskAlias', taskAlias);
    formData.append('name', taskName);
    formData.append('description', description);
    formData.append('assignedTo', assignedTo);
    formData.append('status', status);
    formData.append('startDate', today);
    formData.append('endDate', today);
    formData.append('priority', priority);
    formData.append('createdBy', user.id);
    formData.append('reporter', user.id);

    attachments.forEach((file) => {
      formData.append('attachments', file);
    });
console.log("form2",formData)
    try {
      await axios.put(`${ServerUrl.apiUrl}api/tasks/updatetask/${taskId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Task Updated Successfully");
      navigate(`/task/${taskId}`);
    } catch (err) {
      console.log(err);
    }

  }



  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(`${ServerUrl.apiUrl}api/tasks/gettaskdetails/${taskId}`);
        console.log("tadataaa", res.data);
        console.log("dataaaa", res.data[0].name);
        setTaskName(res.data[0].name);
        setDescription(res.data[0].description);
        setAssignedTo(res.data[0].assignedTo);
        setStatus(res.data[0].status);
        setPriority(res.data[0].priority);
        setTaskId(res.data[0].taskId);
        setAttachments(res.data[0].attachments);
      } catch (err) {
        console.log(err);
      }
    };
    if (taskId) {
      fetchdata();
    }
  }, [taskId]);




  return (
    <>
      <Head heading={taskId.length == 4 ? "Update Task" : "Add Task"} />
      <div className="container-add-task">
        <div className="header-project-list">
          <h2 className="headertxt-project-list m-0">{taskId.length == 4 ? "Upadte task" : "Add Task"}</h2>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={taskId.length !== 4 ? handleSubmit : handleSubmit2} encType="multipart/form-data">
          <div className="client-project-section">
            <div className="input-field">
              <label htmlFor="taskName" className="form-label">
                Task Name
              </label>
              <input placeholder="Task Name" type="text" className="form-control" id="taskName" value={taskName} onChange={(e) => setTaskName(e.target.value)} required />
            </div>
            <div className="input-field">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select className="form-select" id="status" value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>
            <div className="input-field" style={{ display: taskId.length == 4 ? 'none' : 'block' }}
            >
              <label htmlFor="assignedTo" className="form-label">
                Assigned To
              </label>
              {assignedTo.map((member, index) => (
                <div key={index} className="mb-2"

                >

                  <select
                    className="form-select"
                    value={member}
                    onChange={(e) => {
                      const newAssignedTo = [...assignedTo];
                      newAssignedTo[index] = e.target.value;
                      setAssignedTo(newAssignedTo);
                    }}
                  >
                    <option value="">Select team member</option>
                    {teamMembers.flatMap((memberArray) =>
                      memberArray.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              ))}
              <button type="button" className="btn btn-secondary mt-2" onClick={() => setAssignedTo([...assignedTo, ''])}>
                Add Member
              </button>
            </div>
          </div>

          <div className="field">
            <label htmlFor="description-project-list" className="form-label">
              Description
            </label>
            <textarea placeholder="Description" className="form-control" id="description-project-list" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select className="form-select" id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="attachments" className="form-label">
              Attachments
            </label>
            <input type="file" className="form-control" id="attachments" multiple onChange={handleFileChange} />
          </div>
          <button type="submit" className="save">
            {taskId.length == 4 ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>
      <ToastContainer/>
    </>
  );
};

export default AddTask;
/**
 * The `TaskPage` component represents the main page for displaying and interacting with a task.
 * It fetches the task details from the server, allows updating the task status, adding comments, and deleting the task.
 * The component also handles the display of the task details, comments, and various UI interactions.
 */
import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ServerUrl from '../config/config';
import '../css/TaskPage.css';
import { ReactComponent as AttachIcon } from '../assets/attatchment.svg';
import { ReactComponent as ChildIcon } from '../assets/Child.svg';
import { ReactComponent as LinkIcon } from '../assets/Link.svg';
import { ReactComponent as DesignIcon } from '../assets/Design.svg';
import { ReactComponent as AndIcon } from '../assets/and.svg';
import { ReactComponent as ButtonIcon } from '../assets/add-button-icon.svg';
import { ReactComponent as ActionIcon } from '../assets/Thunder.svg';
import { ReactComponent as EditIcon } from '../assets/Edit.svg';
import { ReactComponent as SettingIcon } from '../assets/setting2.svg';
import { ReactComponent as LeftIcon } from '../assets/left-icon-task.svg';
import { ReactComponent as CheckIcon } from '../assets/check-task.svg';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePic from '../assets/profilepic.jpg';
import serverUrl from '../config/config';
import { set } from 'mongoose';

const TaskPage = () => {
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isRightSideVisible, setIsRightSideVisible] = useState(false);
  const [taskdata, setTaskdata] = useState([]);
  const [newStatus, setStatus] = useState([]);
  const accordionToggleRef = useRef('');
  const [comments, setcomments] = useState([]);
  const { user } = useContext(AuthContext);
  const TaskId = useParams();
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState([]);
  const [createdemployeeName, setCreatedEmployeeName] = useState('Loading...');
  const [selectedFile, setSelectedFile] = useState(null);
  const [employeeNames, setEmployeeNames] = useState({});
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [employeeProfilePics, setEmployeeProfilePics] = useState({});

  // State for design popup
  const [showDesignPopup, setShowDesignPopup] = useState(false); // State for popup visibility
  const [designUrl, setDesignUrl] = useState('');

  // console.log(taskdata[0]?.comments);
  const toggleContent = () => {
    setIsContentOpen(!isContentOpen);
    setIsRightSideVisible(!isRightSideVisible);
  };

  const taskId = TaskId.TaskId;
  const fetchTask = async () => {
    const res = await axios.get(`${serverUrl.apiUrl}api/tasks/gettaskdetails/${taskId}`);
    const maindata = res.data;
    // console.log(maindata);
    setTaskdata(maindata);
    // console.log(taskdata);
  };
  useEffect(() => {
    fetchTask();
  }, []);

  const getEmployeeName = async (employeeId) => {
    try {
      // console.log(employeeId);
      const response = await axios.get(`${serverUrl.apiUrl}api/employee/getsingleemployee/${employeeId}`);
      // console.log(response.data);
      const data = response.data;
      const newdata = data[0]?.name;
      return newdata;
    } catch (error) {
      console.error('Error fetching employee data:', error);
      return 'Unknown';
    }
  };
  const getEmployeeProfilePic = async (employeeId) => {
    try {
      // console.log(employeeId);
      const response = await axios.get(`${serverUrl.apiUrl}api/employee/getsingleemployee/${employeeId}`);
      console.log(response.data);
      const data = response.data;
      const profilePic = data[0]?.profilePicture;
      return profilePic || ProfilePic; // Return default ProfilePic if no custom pic is available
    } catch (error) {
      console.error('Error fetching employee profile picture:', error);
      return ProfilePic; // Return default ProfilePic on error
    }
  };

  useEffect(() => {
    if (taskdata[0]?.assignedTo && taskdata[0].assignedTo.length > 0) {
      const fetchEmployeeNames = async () => {
        const ids = taskdata[0].assignedTo[0].split(',');
        const employeeNames = await Promise.all(ids.map((id) => getEmployeeName(id.trim())));
        setEmployeeName(employeeNames.join(', '));
      };

      fetchEmployeeNames();
    }

    if (taskdata[0]?.createdBy) {
      getEmployeeName(taskdata[0].createdBy).then((name) => setCreatedEmployeeName(name));
    }
  }, [taskdata]);

  const handleUpdateStatus = async (taskdata) => {
    if (taskdata.length > 0) {
      const currentStatus = taskdata[0].status;
      let newStatus;

      if (currentStatus === 'IN_PROGRESS') {
        newStatus = 'DONE';
      } else if (currentStatus === 'DONE') {
        newStatus = 'TODO';
      } else if (currentStatus === 'TODO') {
        newStatus = 'IN_PROGRESS';
      }

      const taskId = taskdata[0]._id;
      console.log(taskId);

      try {
        const response = await axios.put(`${ServerUrl.apiUrl}api/tasks/${taskId}`, { status: newStatus });
        if (response.status === 200) {
          toast.success('Status updated successfully!');
          // Optionally, update local state here instead of reloading the page
        } else {
          toast.error('Failed to update status.');
        }
        // Consider using a less disruptive way to refresh data
        fetchTask();
      } catch (error) {
        console.error('Error updating status:', error);
        toast.error('Error updating status.');
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`${ServerUrl.apiUrl}api/tasks/deletetask/${taskId}`);
      if (response.status === 200) {
        toast.success('Task deleted successfully!');

        setTimeout(() => {
          navigate(`/ProjectDashboard/${taskdata[0]?.projectId}`);
        }, 1000);
        // Optionally, update local state here instead of reloading the page
      } else {
        toast.error('Failed to delete task.');
      }
      // Consider using a less disruptive way to refresh data
      fetchTask();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error deleting task.');
    }
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('attachment', selectedFile);
      const response = await axios.post(`${ServerUrl.apiUrl}api/tasks/${taskId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('File uploaded successfully:', response.data);
      toast.success('File uploaded successfully!');
      setSelectedFile(null);
      // Optionally refresh attachments list or clear selected file
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file.');
    }
  };

  const handleDesignChange = (event) => {
    setSelectedDesign(event.target.files[0]);
  };
  const handleDesignSave = async () => {
    if (designUrl) {
      try {
        const response = await axios.post(`${serverUrl.apiUrl}api/tasks/${taskId}/adddesign`, {
          designUrl: designUrl // Send the design URL to the backend
        });

        if (response.status === 200) {
          toast.success('Design added successfully!');
          setDesignUrl(''); // Clear the input field
          setShowDesignPopup(false); // Close the popup
          fetchTask(); // Refresh task data to include the new design
        } else {
          toast.error('Failed to add design.');
        }
      } catch (error) {
        console.error('Error adding design:', error);
        toast.error('Error adding design.');
      }
    } else {
      toast.warning('Please enter a design URL.');
    }
  };

  const hadlecomments = async (e) => {
    const id = user.id;
    const author = user.name;
    const taskId = TaskId.TaskId;
    e.preventDefault();
    const data = new FormData(e.target);
    const comment = Object.fromEntries(data.entries());
    setcomments(comment);

    const res = await axios.post(`${serverUrl.apiUrl}api/tasks/addcomments`, {
      id,
      comment,
      author,
      taskId
    });

    if (res.status === 200) {
      toast.success('Comment added successfully!');
      console.log(res.data);
      fetchTask();
    } else {
      toast.error('Failed to add comment.');
    }
    e.target.reset();
  };
  const handledescriptions = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const des = Object.fromEntries(data.entries());
    console.log(des);
    e.target.reset();
  };

  function formatISODate(isoString) {
    const date = new Date(isoString);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const hour = hours % 12 || 12;
    const minute = minutes < 10 ? `0${minutes}` : minutes;
    const period = hours < 12 ? 'AM' : 'PM';

    return `${month} ${day}, ${year}`;
  }

  // const getBackgroundColor = (status) => {
  //   switch (status) {
  //     case 'completed':
  //       return 'green';
  //     case 'IN_PROGRESS':
  //       return 'blue';
  //     case 'pending':
  //       return 'orange';
  //     case 'overdue':
  //       return 'red';
  //     default:
  //       return 'grey';
  //   }
  // };
  const newdtaArray = taskdata[0]?.comments;

  const sortedComments = taskdata[0]?.comments ? taskdata[0].comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
  const latestComments = sortedComments.slice(0, 5);
  const olderComments = sortedComments.slice(5);
  useEffect(() => {
    const toggleAccordion = () => {
      const content = accordionToggleRef.current.nextElementSibling;
      content.classList.toggle('active');
    };

    if (accordionToggleRef.current) {
      accordionToggleRef.current.addEventListener('click', toggleAccordion);
    }

    return () => {
      if (accordionToggleRef.current) {
        accordionToggleRef.current.removeEventListener('click', toggleAccordion);
      }
    };
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const data = {};
      for (const comment of latestComments) {
        data[comment.id] = {
          name: await getEmployeeName(comment.id),
          profilePic: await getEmployeeProfilePic(comment.id) // Assuming this function exists
        };
      }
      setEmployeeNames((prevNames) => ({ ...prevNames, ...Object.fromEntries(Object.entries(data).map(([id, { name }]) => [id, name])) }));
      setEmployeeProfilePics((prevPics) => ({ ...prevPics, ...Object.fromEntries(Object.entries(data).map(([id, { profilePic }]) => [id, profilePic])) }));
    };
    fetchEmployeeData();
  }, [latestComments]);

  const printdata = (
    <>
      {latestComments.map((e, index) => (
        <div key={index} className="task-page-comment">
          <img className="task-page-comment-userprofile" src={employeeProfilePics[e.id] ? `${serverUrl.apiUrl + employeeProfilePics[e.id]}` : ProfilePic} alt={`${employeeNames[e.id] || 'User'}'s profile`} />
          <div className="task-page-comment-content">
            <div className="task-page-comment-content-upperContent">
              <h3 className="task-page-comment-user m-0">{employeeNames[e.id] || 'Loading...'}</h3>
              <h4 className="task-page-comment-date m-0">{formatISODate(e?.createdAt)}</h4>
            </div>
            <h2 className="task-page-comment-content-comment m-0">{e?.text}</h2>
          </div>
        </div>
      ))}
      {olderComments.length > 0 && (
        <div className="older-comments-accordion">
          <button ref={accordionToggleRef} className="accordion-toggle">
            View All Comments
          </button>
          <div className="accordion-content">
            {olderComments.map((e, index) => (
              <div key={index} className="task-page-comment">
                <img className="task-page-comment-userprofile" src={ProfilePic} alt="" />
                <div className="task-page-comment-content">
                  <div className="task-page-comment-content-upperContent">
                    <h3 className="task-page-comment-user m-0">{employeeNames[e.id] || 'Loading...'}</h3>
                    <h4 className="task-page-comment-date m-0">{formatISODate(e?.createdAt)}</h4>
                  </div>
                  <h2 className="task-page-comment-content-comment m-0">{e?.text}</h2>
                </div>{' '}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
  const gotoaddtask = () => {
    const taskId = TaskId.TaskId;
    navigate(`/addtask/${taskId}`);
  };
  return (
    <>
      <div className="task-page-container">
        <div className="task-page-leftside" style={{ flex: isRightSideVisible ? 1 : '999' }}>
          <div className="task-page-leftside-header">{taskdata.length > 0 ? taskdata[0].name : 'Loading...'}</div>

          <div className="task-page-leftside-functionsButtons">
            <div className="task-page-leftside-functionsButtons-button " onClick={() => document.getElementById('fileInput').click()}>
              <AttachIcon />
              <h4 className="task-page-leftside-functionsButtons-button-text m-0">Attach</h4>
              <input id="fileInput" type="file" accept="*" onChange={handleFileChange} style={{ display: 'none' }} required />
            </div>
            {/* Conditional rendering for the alert and upload button */}{' '}
            <div className="task-page-leftside-functionsButtons-button">
              <ChildIcon />
              <h4 className="task-page-leftside-functionsButtons-button-text m-0">Add a child issue</h4>
            </div>
            <div className="task-page-leftside-functionsButtons-button">
              <LinkIcon />
              <h4 className="task-page-leftside-functionsButtons-button-text m-0">Link issue</h4>
            </div>
            <div className="task-page-leftside-functionsButtons-button" onClick={() => setShowDesignPopup(true)}>
              <DesignIcon />
              <h4 className="task-page-leftside-functionsButtons-button-text m-0">Add a Design</h4>
            </div>
            {showDesignPopup && (
              <div
                className="design-popup"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  zIndex: 1
                }}
              >
                <input
                  type="url"
                  placeholder="Enter design link"
                  value={designUrl}
                  onChange={(e) => setDesignUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <div
                  className="design-popup-buttons"
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px'
                  }}
                >
                  <button onClick={handleDesignSave} className="save" style={{}}>
                    Save
                  </button>
                  <button onClick={() => setShowDesignPopup(false)} className="cancel" style={{}}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {selectedDesign && (
              <div className="selected-design">
                <p>Selected design: {selectedDesign.name}</p>
              </div>
            )}
            <div className="task-page-leftside-functionsButtons-button">
              <AndIcon />
              <h4 className="task-page-leftside-functionsButtons-button-text m-0">Create</h4>
            </div>
          </div>
          <div className="slected-file">
            {' '}
            {selectedFile && (
              <div className="selected-file-container">
                <p className="selected-file-name">Selected file: {selectedFile.name}</p>
                {/* Alert confirmation before uploading */}
                <button
                  onClick={() => {
                    if (window.confirm(`Do you want to upload ${selectedFile.name}?`)) {
                      handleFileUpload(); // Upload the file if confirmed
                    }
                  }}
                  className="upload-button"
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    background: 'none',
                    paddingBottom: '22px',
                    color: 'white',
                    transition: 'background 0.3s ease'
                  }}
                >
                  <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Upload" opacity="0.5" clip-path="url(#clip0_1191_11997)">
                      <g id="Group">
                        <path id="Vector" d="M16.5 14.5L12.5 10.5M12.5 10.5L8.5 14.5M12.5 10.5V19.5" stroke="#374557" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path id="Vector_2" d="M20.8904 16.8895C21.8658 16.3578 22.6363 15.5164 23.0803 14.4981C23.5244 13.4799 23.6167 12.3427 23.3427 11.2662C23.0686 10.1896 22.4439 9.23501 21.5671 8.55294C20.6903 7.87088 19.6113 7.50023 18.5004 7.4995H17.2404C16.9378 6.32874 16.3736 5.24183 15.5904 4.32049C14.8072 3.39915 13.8253 2.66735 12.7185 2.1801C11.6118 1.69286 10.409 1.46285 9.20057 1.50738C7.99213 1.5519 6.80952 1.8698 5.74163 2.43716C4.67374 3.00453 3.74836 3.8066 3.03507 4.78308C2.32178 5.75956 1.83914 6.88503 1.62343 8.07489C1.40772 9.26475 1.46455 10.488 1.78966 11.6528C2.11477 12.8175 2.69969 13.8934 3.50045 14.7995" stroke="#374557" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path id="Vector_3" d="M16.5 14.5L12.5 10.5L8.5 14.5" stroke="#374557" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_1191_11997">
                        <rect width="24" height="20" fill="white" transform="translate(0.5 0.5)" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            )}{' '}
          </div>

          <div className="task-page-leftside-description">
            <form onSubmit={handledescriptions} className="task-page-leftside-description">
              <label className="task-page-leftside-description-label m-0">Description</label>
              <textarea name="description" className="task-page-leftside-description-textarea" placeholder="Add Description" value={taskdata && taskdata[0] ? taskdata[0].description : 'Loading...'}></textarea>
              <div className="task-page-leftside-description-button-div">
                {/* <button type="submit" className="task-page-leftside-description-button">
                  <ButtonIcon />
                  <h4 className="task-page-leftside-description-buttons-text m-0">Add</h4>
                </button> */}
              </div>
            </form>
          </div>
          <div className="task-page-leftside-commentbox">
            <h3 className="task-page-leftside-comment-heading m-0">Comments</h3>
            <div className="task-page-leftside-filters">
              <div className="task-page-leftside-show">Show:</div>
              <div className="task-page-leftside-filter-buttons">
                <div className="task-page-leftside-filter">All</div>
                <div className="task-page-leftside-filter">Comment</div>
                <div className="task-page-leftside-filter">History</div>
              </div>
            </div>

            <form onSubmit={hadlecomments} className="task-page-type-comment-box">
              <div className="task-page-type-comment">
                <img src={ServerUrl.apiUrl + user.profilePicture} alt="" className="task-page-type-profile-pic" />
                <textarea name="comment" type="text" placeholder="Type a comment" className="task-page-type-input"></textarea>
                <button type="submit" className="task-page-leftside-description-button">
                  <ButtonIcon />
                  <h4 className="task-page-leftside-description-buttons-text m-0">Add Comment</h4>
                </button>
              </div>
              <div className="task-page-leftside-description-button-div"></div>
            </form>

            <div className="task-page-comments">{printdata ? printdata : 'Loading...'}</div>
          </div>
        </div>

        <div className={`task-page-rightside ${isContentOpen ? '' : 'closed'}`}>
          <div className={`task-page-rightside-content ${isContentOpen ? 'open' : 'closed'}`}>
            <div className="task-page-rightside-content-header">
              <h5 className={`task-page-rightside-content-header-button rightside-head-btn-${taskdata[0]?.status.toLowerCase()} m-0`} onClick={() => handleUpdateStatus(taskdata)}>
                {taskdata[0]?.status === 'IN_PROGRESS' ? 'IN PROGRESS' : taskdata[0]?.status}
              </h5>
              <div className="task-page-rightside-content-header-action">
                {/* <ActionIcon /> */}

                <h4 className="task-page-rightside-content-header-action-text m-0" onClick={() => handleDeleteTask(taskdata[0]?._id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4607 2.73147V3.2889H8.04045V2.73147C8.04045 2.39688 8.30069 2.13665 8.63528 2.13665H10.8659C11.2005 2.13665 11.4607 2.39688 11.4607 2.73147ZM6.99951 2.73147V3.2889H2.5V4.4042H3.65618L4.65667 17.2676C4.73102 18.1599 5.51172 18.9034 6.40396 18.9034H13.0957C13.988 18.9034 14.7687 18.197 14.843 17.2676L15.8435 4.4042H16.9988V3.2889H12.5016V2.73147C12.5016 1.83923 11.7581 1.0957 10.8659 1.0957H8.63528C7.74304 1.0957 6.99951 1.83923 6.99951 2.73147ZM14.7224 4.4042H4.77725L5.77196 17.1933C5.80914 17.5279 6.10655 17.7881 6.40396 17.7881H13.0957C13.4303 17.7881 13.7277 17.4907 13.7277 17.1933L14.7224 4.4042ZM8.07737 6.63444H6.96208V15.5568H8.07737V6.63444ZM10.3072 6.63444H9.19189V15.5568H10.3072V6.63444ZM11.4225 6.63444H12.5378V15.5568H11.4225V6.63444Z" fill="#B02A37" />
                  </svg>{' '}
                </h4>
              </div>
            </div>

            <div className="task-page-rightside-content-body">
              <div className="task-page-rightside-content-body-header">
                <h3 className="task-page-rightside-content-body-header-title m-0">Details</h3>
                <EditIcon style={{ cursor: 'pointer' }} onClick={gotoaddtask} />
              </div>
              <div className="task-page-rightside-content-div">
                <ul className="task-page-rightside-content-child-div color1">
                  <li>AssignedTo</li>
                  <li>CreatedBy</li>
                  <li>Name</li>
                  <li>Priority</li>
                </ul>
                <ul className="task-page-rightside-content-child-div color2">
                  <li>{employeeName}</li>
                  <li>{createdemployeeName}</li>
                  <li>{taskdata[0]?.name}</li>
                  <li style={{ textTransform: 'uppercase' }}>{taskdata[0]?.priority}</li>
                </ul>
              </div>
            </div>
<div className='w-100 gap-4 d-flex justify-content-between  align-items-center '>
            <div className="task-page-rightside-content-body w-50">
              <h3 className="task-page-rightside-content-body-header-title m-0">Attachments</h3>

              {taskdata[0]?.attachments.map((e, index) => {
                return (
                  <div className="task-page-rightside-content-body-header" key={index}>
                    <ul>
                      <a href={`${ServerUrl.apiUrl + e}`} target="_blank" download>
                        <li>See File</li>
                      </a>
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="task-page-rightside-content-body w-50">
              <h3 className="task-page-rightside-content-body-header-title m-0">Design Links</h3>

              {taskdata[0]?.design.map((e, index) => {
                return (
                  <div className="task-page-rightside-content-body-header" key={index}>
                    <ul>
                      <a href={`${e}`} target="_blank" >
                        <li>Figma</li>
                      </a>
                    </ul>
                  </div>
                );
              })}
            </div>
            </div>
            <div className="task-page-rightside-lastdiv">
              <ul className="task-page-rightside-dates">
                <li>{formatISODate(taskdata[0]?.startDate)} </li>
              </ul>
              <div className="task-page-rightside-configure" onClick={gotoaddtask}>
                <SettingIcon />
                <h4 className="task-page-rightside-content-header-action-text m-0">Configure</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="task-page-rightside-slider">
          <div onClick={toggleContent} className="task-page-rightside-slider-left-icon-div toggle-button">
            <LeftIcon className={`task-page-rightside-slider-left-icon ${isContentOpen ? 'rotate-icon1' : 'rotate-icon2'}`} />
          </div>
          <div className={`task-page-rightside-slider-check-icon-div-${taskdata[0]?.status.toLowerCase()}`}>
            <CheckIcon className={`task-page-rightside-slider-check-icon`} />
          </div>
        </div>
      </div>

      {/* <div className="task-page-header">{TaskId.TaskId}</div> */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" className="toast-container" />
    </>
  );
};

export default TaskPage;

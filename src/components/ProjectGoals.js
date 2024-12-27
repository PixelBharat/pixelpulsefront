import React, { useState, useEffect } from 'react';
import { AddMilstonePopup } from '../popups/AllotherPopups';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import serverUrl from '../config/config';
import axios from 'axios';
import updatee from '../assets/update-con.svg';
import deletee from '../assets/Delete.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProjectGoals = ({ projectId, setButtonTxt, setstaus, setHeading, setonclick, opnepopGoals, setopenpopGoals, setbutton }) => {
  const [AddMilstonePopupstatus, setAddMilstonePopupstaus] = useState(opnepopGoals);
  const [resdata, setResdata] = useState([]);

  const [formData, setFormData] = useState([]);
  const { user } = useContext(AuthContext);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  // useEffect to set initial values only once
  useEffect(() => {
    setButtonTxt('Add Milestone');
    setstaus('button');
    setHeading('Project Goals');
  }, []);
  const handleEdit = (milestone) => {
    setEditingMilestone(milestone);
    setAddMilstonePopupstaus(true);
    setopenpopGoals(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${serverUrl.apiUrl}api/milestones/${id}`);
      if (response.status === 200) {
        setResdata((prevData) => prevData.filter((item) => item._id !== id));
        // setShowSuccessMessage(true);
        // setTimeout(() => setShowSuccessMessage(false), 3000);
        toast.success('Milestone deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const handleClose = () => {
    setAddMilstonePopupstaus(false);
    setopenpopGoals(false);
    setEditingMilestone(null);
  };

  const projectid = projectId.ProjectId;
  const userid = user.id;
  
  // console.log(userid, projectid);

  
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${serverUrl.apiUrl}api/milestones/getdata`,
          { projectid, userid }, // Pass data as an object
          {
            headers: {
              'Content-Type': 'application/json',
              // Authorization: `Bearer ${user.token}`
            }
          }
        );
        // console.log(response.data);
        setResdata(response.data);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

   useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="goals-container">
      {resdata.map((item, index) => (
        <div className="goals-div" key={index}>
          <div className="goals-div-header">
            <h5 className="goals-text">{item.MilestoneName}</h5>
            <div className="goals-update-delete">
              <div className="goals-update">
                <img src={updatee} alt="Edit" onClick={() => handleEdit(item)} style={{ cursor: 'pointer'}} />
              </div>
              <div className="goals-update goals-delete">
                <img src={deletee} alt="Delete" onClick={() => handleDelete(item._id)} style={{ cursor: 'pointer' }} />
              </div>
            </div>
          </div>
          <div className="goals-div-body">
            <div className="goals-div-body-div1">
              <p className="goals-text-title">Created At:</p>
              <h6 className="date-goal-text">
                {new Date(item?.timestamp).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h6>
            </div>
            <div className="goals-div-body-div1">
              <p className="goals-text-title">Due By:</p>
              <h6 className="date-goal-text">{item?.DueBy}</h6>
            </div>
            <div className="goals-div-body-div1">
              <p className="goals-text-title">Created By:</p>
              <h6 className="date-goal-text">{item?.CreatedBy}</h6>
            </div>
            <div className="goals-div-body-div1">
              <p className="goals-text-title">Description:</p>
              <h6 className="date-goal-text">{item?.description}</h6>
            </div>
          </div>
        </div>
      ))}
      {opnepopGoals && <AddMilstonePopup close={handleClose} projectId={projectId} setFormData={setFormData} projectid={projectId} editingMilestone={editingMilestone}  fetchData={fetchData} />}
      {showSuccessMessage && (
        <div className="success-message-container">
          <div className="success-message-content">
            <div className="success-icon-container">
              <div className="success-icon"></div>
            </div>
            <div className="success-text-container">
              <div className="success-header">
                <div className="success-title">Success!</div>
                <div className="close-icon-container" onClick={() => setShowSuccessMessage(false)}>
                  <div className="close-icon"></div>
                </div>
              </div>
              <div className="success-description">Milestone deleted successfully</div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" className="toast-container" />
    </div>
  );
};

export default ProjectGoals;

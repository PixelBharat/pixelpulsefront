import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import ServerUrl from '../config/config';
import { ToastContainer, toast } from 'react-toastify';
import closeimg from "../assets/close_small.svg"
import 'react-toastify/dist/ReactToastify.css';



export const AddProjectPopup = ({ close, setCollectFormData }) => {
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');
  const [timeDifference, setTimeDifference] = useState('');
  const [formSubmissions, setFormSubmissions] = useState([]);
  const { user } = useContext(AuthContext);
  const submitForm = (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData.entries());
    formObj.currentDate = currentDate;
    formObj.totalTime = timeDifference;
    const startTime = formObj.startTime;
    const endTime = formObj.endTime;
    setTime1(startTime);
    setTime2(endTime);
    calculateTimeDifference(startTime, endTime);
    console.log(formObj);
    setCollectFormData((prevData) => [...prevData, formObj]);
    e.target.reset();
  };

  const calculateTimeDifference = (startTime, endTime) => {
    const [h1, m1] = startTime.split(':').map(Number);
    const [h2, m2] = endTime.split(':').map(Number);

    const totalSeconds1 = h1 * 3600 + m1 * 60;
    const totalSeconds2 = h2 * 3600 + m2 * 60;

    const differenceSeconds = Math.abs(totalSeconds1 - totalSeconds2);

    const hours = Math.floor(differenceSeconds / 3600);
    let remainingSeconds = differenceSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const formattedDifference = `${hours}:${minutes}`;

    setTimeDifference(formattedDifference);
  };

  return (
    <>
      <div className="over-lay-div">
        <div className="over-lay-inner">
          <p onClick={close}>x</p>
          <form onSubmit={submitForm}>
            <input type="text" name="projectName" />
            <input type="text" name="taskName" />
            <input type="time" name="startTime" />
            <input type="time" name="endTime" />
            <textarea placeholder="enter" name="description"></textarea>
            <button type="submit">Submit</button>
          </form>
          {timeDifference && <p>Time Difference: {timeDifference}</p>}
        </div>
      </div>
    </>
  );
};

export const AddMilstonePopup = ({ close, setFormData, projectId, editingMilestone, fetchData }) => {
  const [milestoneName, setMilestoneName] = useState('');
  const { user } = useContext(AuthContext);

  const username = user.name;
  const [createdBy, setCreatedBy] = useState(username);
  const [dueBy, setDueBy] = useState('');
  const [description, setDescription] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    if (editingMilestone) {
      setMilestoneName(editingMilestone.MilestoneName);
      setCreatedBy(editingMilestone.CreatedBy);
      setDueBy(editingMilestone.DueBy);
      setDescription(editingMilestone.description);
    }
  }, [editingMilestone]);
  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData.entries());
    const dataToSend = {
      MilestoneName: formObj.MilestoneName,
      CreatedBy: user.name,
      DueBy: formObj.DueBy,
      ProjectId: projectId.ProjectId,
      UserId: user.id,
      description: formObj.description
    };
    try {
      let response;
      if (editingMilestone) {
        response = await axios.put(`${ServerUrl.apiUrl}api/milestones/${editingMilestone._id}`, dataToSend, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        });
      } else {
        response = await axios.post(`${ServerUrl.apiUrl}api/milestones`, dataToSend, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        });
      }
      if (response.status === 200 || response.status === 201) {
        setFormData((prevData) => [...prevData, response.data]);
        fetchData();
        toast.success('Milestone updated successfully!');

        close();
      }
    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  };
  return (
    <div className="over-lay-div">
      <div className="over-lay-inner padd-new"
      style={{
        animation: isVisible ? 'show 1s ease' : 'hide 2s ease',
        opacity: isVisible ? '1' : '',
        transform: isVisible ? 'scale(1)' : 'scale(1)',
      }}>
        <div className="over-lay-inner-inner">
          <div className="close-button-container">
            <div className="close-button blur-img" onClick={close}>
              <img src={closeimg} />
            </div>
          </div>
        </div>
        <form onSubmit={submitForm} className="milestone-form">
          <div className="form-group">
            <div className="form-label">Milestone Name</div>
            <input type="text" name="MilestoneName" className="form-input" placeholder="Enter Name" value={milestoneName} onChange={(e) => setMilestoneName(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Created By</div>
            <input type="text" name="CreatedBy" className="form-input" placeholder="Created By" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Due By</div>
            <input type="date" name="DueBy" className="form-input" value={dueBy} onChange={(e) => setDueBy(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Description</div>
            <textarea name="description" className="form-textarea" placeholder="enter" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div className="btn-container">
            <button type="submit" className="add-button">
              {editingMilestone ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ShowdayDetailpopup = ({ closepopup, clickData }) => {
  function calculateWorkDuration(inTime, outTime) {
    if (!inTime || !outTime) return { hours: 0, minutes: 0 };
    const inDate = new Date(`1970-01-01T${inTime}:00`);
    const outDate = new Date(`1970-01-01T${outTime}:00`);
    let difference = outDate - inDate;

    if (difference < 0) {
      difference += 24 * 60 * 60 * 1000;
    }
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  }
  const inTime = clickData ? clickData[0]?.Intime : 'No data';
  const outTime = clickData ? clickData[0]?.Outtime : 'No data';
  const duration = calculateWorkDuration(inTime, outTime);
  return (
    <>
      <div className="modal showday-detail-popup" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header d-flex w-100 justify-content-between">
              <h5 className="modal-title"> {clickData ? clickData[0]?.date : 'No data'}</h5>
              <button className="btn btn-secondary" onClick={closepopup}>
                x
              </button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Status:</strong> {clickData ? clickData[0]?.status : 'No data'}
              </p>
              <p>
                <strong>Intime:</strong> {inTime || 'No data'}
              </p>
              <p>
                <strong>Outtime:</strong> {outTime || 'No data'}
              </p>
              <p>
                <strong>Total Time:</strong> {`${duration.hours} hours ${duration.minutes} minutes`}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};


export const IssuePopup = ({ close, ProjectId, fetchissues }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useContext(AuthContext);
  console.log(ProjectId);
  const handlesubmit = (e) => {
    const name = user.name;
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    delete data.ProjectId;
    axios
      .post(`${ServerUrl.apiUrl}api/projects/projects/issues`, {
        ProjectId,
        data,
        name
      })
      .then((response) => {
        console.log('Response Data:', response.data);
        fetchissues();
        e.target.reset();
        close();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  return (
    <>
      <div className="over-lay-div">
        <div className="over-lay-inner padd-new" 
        style={{
          animation: isVisible ? 'show 1s ease' : 'hide 2s ease',
          opacity: isVisible ? '1' : '',
          transform: isVisible ? 'scale(1)' : 'scale(1)',
        }}>
          <div className="over-lay-inner-inner">
            <div className="close-button-container">
              <div className="close-button blur-img" onClick={close}>

                <img src={closeimg} />
              </div>
            </div>
            <form onSubmit={handlesubmit} className='milestone-form'>
              <div className="form-group">
                <div className="form-label">Description</div>
                <input type="text" placeholder="Description" className="form-input" name="Description" />
              </div>


              <div className="form-group">
                <div className="form-label">Type</div>
                <input type="text" placeholder="Type" className="form-input" name="Type" />
              </div>


              <div className="form-group">
                <div className="form-label">ToNotify</div>
                <input type="text" placeholder="ToNotify" className="form-input" name="ToNotify" />
              </div>

              <div className="form-group">
                <div className="form-label">Issue</div>
                <input type="text" placeholder="your issue" className="form-input" name="Issuue" />
              </div>
              <div className="btn-container">
                <button className='save' type="submit">Submit</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
};
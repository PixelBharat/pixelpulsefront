import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Head from '../components/Head';
import serverUrl from '../config/config';
import '../css/LeavePortal.css';
import { ReactComponent as UploadIcon } from '../assets/Upload-leave.svg';
import { ReactComponent as CalenderIcon } from '../assets/Calendar.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const leaveData = [
  {
    id: 1,
    type: 'Total Available Leaves',
    duration: '20',
    bgClass: 'firstcard'
  },
  {
    id: 2,
    type: 'Total Sick Leaves',
    duration: '15',
    bgClass: 'secondcard'
  },
  {
    id: 3,
    type: 'Total casual Leaves',
    duration: '17',
    bgClass: 'thirdcard'
  },
  {
    id: 4,
    type: 'Total paid earned Leaves ',
    duration: '02',
    bgClass: 'fourthcard'
  }
];

const LeavePortal = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeDiv, setActiveDiv] = useState(null);
  const firstDivRef = useRef(null);
  const secondDivRef = useRef(null);
  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);
  const [activeInput, setActiveInput] = useState(null);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateFocused, setStartDateFocused] = useState(false);
  const [endDateFocused, setEndDateFocused] = useState(false);
  const [fileName, setFileName] = useState('Default File Name');

  const handleIconClick = (dateType) => {
    if (dateType === 'start') {
      setActiveDiv(1);
    } else {
      setActiveDiv(2);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    remark: '',
    file: null
  });
  const [error, setError] = useState(null);

  const resetForm = () => {
    setFormData({
      name: '',
      leaveType: '',
      fromDate: '',
      toDate: '',
      remark: '',
      file: null
    });
    setStartDate(null);
    setEndDate(null);
    setFileName('');
  };

  const DatePickerWrapper = ({ selected, onChange, placeholder }) => (
    <div className="date-picker-wrapper">
      {!selected && <span className="date-placeholder">{placeholder}</span>}
      <DatePicker selected={selected} onChange={onChange} className="leave-input-box-date" />
    </div>
  );

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      file: file
    }));
    setFileName(file ? file.name : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('userId', user.id);
    form.append('name', formData.name);
    form.append('leaveType', formData.leaveType);
    form.append('fromDate', formData.fromDate);
    form.append('toDate', formData.toDate);
    form.append('remark', formData.remark);
    form.append('file', formData.file);

    try {
      await axios.post(`${serverUrl.apiUrl}api/leaverequests`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Leave request submitted successfully');
      //   navigate('/leave-requests'); // navigate to leave requests page or any other page
    } catch (err) {
      setError(err.response.data.error || 'Something went wrong');
    }
  };

  const handleDivClick = (divIndex) => {
    setActiveDiv(divIndex);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.react-datepicker') && !event.target.closest('.leave-input-date')) {
      setActiveInput(null);
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    const defaultFile = new File([''], 'default.txt', { type: 'text/plain' });
    setFormData((prevData) => ({
      ...prevData,
      file: defaultFile
    }));
    setFileName('default.txt');
  }, []);

  useEffect(() => {
    const handleGlobalClick = (event) => {
      if (!event.target.closest('.leave-select-placeholder')) {
        setActiveDiv(null);
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="leave-request">
      <Head heading={'Leave Request'} />

      <div className="leave-request-header">
        {leaveData.map((data, index) => (
          <div key={index} className={`leave-request-header-card ${data.bgClass}`}>
            <h3 className="leave-request-header-card-left">{data.type}</h3>
            <h1 className="leave-request-header-card-right">{data.duration}</h1>
          </div>
        ))}
      </div>

      <form className="leave-request-form" onSubmit={handleSubmit}>
        <div className="leave-request-upper-input">
          <div className="leave-input-div">
            <label htmlFor="name" className="leave-input-label">
              Employee Name
            </label>
            <input type="text" className="leave-input-box" id="name" value={formData.name} onChange={handleChange} placeholder="Enter Name" required />
          </div>

          <div className="leave-input-div">
            <label htmlFor="leaveType" className="leave-input-label">
              Leave Type
            </label>
            <select id="leaveType" value={formData.leaveType} onChange={handleChange} required ref={firstDivRef} className={`leave-select-placeholder ${activeDiv === 'leaveType' ? 'clicked' : ''}`} onClick={() => handleDivClick('leaveType')}>
              <option value="" className="m-0" disabled>
                Select Leave Type
              </option>
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="earned">Earned Leave</option>
            </select>
          </div>
        </div>

        <div className="leave-request-lower-input">
          <div className="leave-request-leftside">
            <div className="leave-input-div-parent">
              <label htmlFor="name" className="leave-input-label">
                Leave
              </label>
              <div className="leave-input-div-dates">
                <div className={`leave-input-date ${startDateFocused ? 'clicked' : ''}`}>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      setFormData((prevData) => ({ ...prevData, fromDate: format(date, 'yyyy-MM-dd') }));
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                    className="leave-input-box-date"
                    id="fromDate"
                    value={formData.fromDate}
                    required
                    onFocus={() => setStartDateFocused(true)}
                    onBlur={() => setStartDateFocused(false)}
                  />
                  <CalenderIcon onClick={() => handleIconClick(firstInputRef)} />
                </div>
                <div>-</div>
                <div className={`leave-input-date ${endDateFocused ? 'clicked' : ''}`}>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => {
                      setEndDate(date);
                      setFormData((prevData) => ({ ...prevData, toDate: format(date, 'yyyy-MM-dd') }));
                    }}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    id="toDate"
                    value={formData.toDate}
                    placeholderText="End Date"
                    className="leave-input-box-date"
                    onFocus={() => setEndDateFocused(true)}
                    onBlur={() => setEndDateFocused(false)}
                  />
                  <CalenderIcon onClick={() => handleIconClick(secondInputRef)} />
                </div>
              </div>
            </div>
            <div className="leave-upload-div ">
              <h3 className="leave-input-box-heading"> We Support only JPEG and PNG under 5 MB </h3>

              <div className="leave-upload-div-dotted">
                <div className="leave-upload-div-child">
                  <input type="file" id="file" onChange={handleFileChange} style={{ display: 'none' }} />
                  <label htmlFor="file" className="leave-upload-icon">
                    <UploadIcon />
                    <h5 className="leave-upload-div-child-text">{fileName || 'Default File Name'}</h5>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="leave-request-rightside leave-input-div">
            <label htmlFor="name" className="leave-input-label ">
              Remark
            </label>
            <textarea class="leave-request-message-box leave-input-box" id="remark" value={formData.remark} onChange={handleChange} placeholder="Type your message here..."></textarea>
          </div>
        </div>

        <div className="leave-request-buttons">
          <button className="leave-request-button1" onClick={resetForm} type="">
            Reset all fields
          </button>
          <button className="leave-request-button2" type="submit">
            Apply for leaves
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeavePortal;

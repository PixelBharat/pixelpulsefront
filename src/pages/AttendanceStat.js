import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ServerUrl from '../config/config';
import axios from 'axios';
import Head from '../components/Head';
import Profile from '../assets/attendanceStateProfile.png';
import { useParams, useNavigate } from 'react-router-dom';

import { ReactComponent as dropdownIcon } from '../assets/attendancestatsDropdownIcon.svg';
import { Link } from 'react-router-dom';
import '../css/AttendanceStat.css';
import serverUrl from '../config/config';
import { FiChevronDown } from 'react-icons/fi';
import profilepic from '../assets/profilepicture.png';
import check from '../assets/check.svg';
import close from '../assets/close_small.svg';
import air from '../assets/Airplane Takeoff.svg';
import left from '../assets/chevron_left.svg';
import right from '../assets/chevron_right.svg';

const AttendanceStat = () => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState([]);
  const [officeConfig, setOfficeConfig] = useState(null);
  const [employees, setEmployees] = useState([]);
  const userId = user.id;
  const [selectedOption, setSelectedOption] = useState('');
  const [clickData, setClickData] = useState(null);
  const [mergedData, setMergedData] = useState([]);
  const [showdiv, setshowdiv] = useState(false);
  const [bgcolor1, setcolor1] = useState(true);
  const [showpopup, setshowpopup] = useState(false);
  const [newdata, setnewdata] = useState([]);
  const [newdataa, setnewdataa] = useState([]);
  const [bgcolor2, setcolor2] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [mergedLeaveData, setMergedLeaveData] = useState([]);
  const [useridd, setuseridd] = useState(null);
  const [leaveStatuses, setLeaveStatuses] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [weekType, setWeekType] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentDatee, setCurrentDatee] = useState(new Date());
  // const [presentCount, setPresentCount] = useState(0);
  // const [absentCount, setAbsentCount] = useState(0);
  // const [halfDayCount, setHalfDayCount] = useState(0);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markedPresent, setMarkedPresent] = useState(false);
  const [markedLeave, setMarkedLeave] = useState(false);
  const department = useParams().department;

  const [currentTime, setCurrentTime] = useState(new Date());


  // console.log(department);
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleSelectClickslect = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${ServerUrl.apiUrl}api/config`);
        setOfficeConfig(response.data);
        setHolidays(response.data.holidays);
        setWeekType(response.data.weekType);
      } catch (error) {
        console.error('Error fetching office configuration:', error);
      }
    };

    fetchConfig();
  }, []);

  // functions to update status by buttons
  const handleApprove = async (leaveId) => {
    console.log('Token:', user.token);
    try {
      const response = await axios.put(
        `${ServerUrl.apiUrl}api/leaverequests/updatestatus/${leaveId}`,
        { status: 'Approved' },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      if (response.data) {
        setLeaveStatuses((prev) => ({ ...prev, [leaveId]: 'Approved' }));
        // Optionally, update the mergedLeaveData state to reflect the change
        setMergedLeaveData((prevData) => prevData.map((item) => (item._id === leaveId ? { ...item, status: 'Approved' } : item)));
      }
    } catch (error) {
      console.error('Error approving leave request:', error);
    }
  };

  const handleDeny = async (leaveId) => {
    try {
      const response = await axios.put(
        `${ServerUrl.apiUrl}api/leaverequests/updatestatus/${leaveId}`,
        { status: 'Rejected' },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      if (response.data) {
        setLeaveStatuses((prev) => ({ ...prev, [leaveId]: 'Rejected' }));
        // Optionally, update the mergedLeaveData state to reflect the change
        setMergedLeaveData((prevData) => prevData.map((item) => (item._id === leaveId ? { ...item, status: 'Rejected' } : item)));
      }
    } catch (error) {
      console.error('Error denying leave request:', error);
    }
  };

  const isToday = (dateString) => {
    const today = new Date();
    const recordDate = new Date(dateString);
    return recordDate.toDateString() === today.toDateString();
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  const calculateDays = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const timeDiff = Math.abs(end - start);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both start and end dates
  };

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await fetch(`${ServerUrl.apiUrl}api/leaverequests/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
            method: 'GET'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLeaveData(data);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        setError('Failed to fetch leave requests');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${serverUrl.apiUrl}api/employee/getemployees`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        console.error('Failed to fetch employees:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchAttendance = async (employeeIds) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available. Please log in.');
      }

      const todayDate = getTodayDate();
      const response = await fetch(`${ServerUrl.apiUrl}api/attendance?date=${todayDate}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized. Token may have expired.');
        } else {
          const data = await response.json();
          console.error('Error fetching attendance:', response.statusText, data.message || data);
        }
        return;
      }

      const data = await response.json();
      // Process data to map attendance to employees
      const attendanceData = data.map((item) => ({
        ...item,
        employee: employees.find((emp) => emp.id === item.employeeId)
      }));
      setAttendance(attendanceData);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      const employeeIds = employees.map((emp) => emp.id);
      fetchAttendance(employeeIds);
    }
  }, [employees]);

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDatee.getMonth(), currentDatee.getFullYear());
    const startDay = getStartDayOfMonth(currentDatee.getMonth(), currentDatee.getFullYear());

    // Create empty cells for days before the start of the month
    const mainRowCells = [];
    const colorRowCells = [];
    for (let i = 0; i < startDay; i++) {
      // mainRowCells.push(<div key={`empty-${i}`} className="calendar-day2 empty-day"></div>);
      // colorRowCells.push(<div key={`empty-${i}`} className="calendar-day2 empty-day color-row"></div>);
    }

    // Create cells for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDatee.getFullYear(), currentDatee.getMonth(), day);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, so add 1
      const dayOfMonth = date.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${dayOfMonth}`;
      const isCurrentDay = currentDatee.toDateString() === formattedDate;
      const dayClass = getDayClass(formattedDate);

      const handleDayClick = (formattedDate) => {
        const clickedAttendance = attendance.filter((item) => item.date === formattedDate);
        setClickData(clickedAttendance.length > 0 ? clickedAttendance : null);
        setshowpopup(true);
        console.log('Attendance for', formattedDate, clickedAttendance);
      };

      // Determine background color based on attendance status
      let backgroundColor = '';
      let el = null;
      const attendanceStatus = userdataa.find((item) => item.date === formattedDate)?.status;

      switch (attendanceStatus) {
        case 'On Leave':
          backgroundColor = '#FFF3CD';
          el = (
            <div className="new-el-on">
              <i className="bi bi-dash"></i>
            </div>
          );
          break;
        case 'Present':
          backgroundColor = '#D1E7DD';
          el = (
            <div className="new-el">
              <i className="bi bi-check "></i>
            </div>
          );
          // Green color for present
          break;
        case 'Absent':
          backgroundColor = '#F8D7DA';
          el = (
            <div className="new-el-del">
              <i className="bi bi-x "></i>
            </div>
          );
          // red color for absent
          break;
        case 'Half Day':
          backgroundColor = '#FFF3CD';
          el = (
            <div className="new-el-hf">
              <i className="bi bi-x "></i>
            </div>
          );
          break;

        default:
          backgroundColor = '';
          el = (
            <div className="new-el-df">
              <img src={air} />
            </div>
          ); // No background color if status not found
          break;
      }

      mainRowCells.push(
        <div onClick={() => handleDayClick(formattedDate)} key={formattedDate} className={`calendar-day2 ${dayClass} custom-tooltip`}>
          <span>{day}</span>
          <div className="tooltiptext">{getAttendanceInfo(formattedDate)}</div>
        </div>
      );

      colorRowCells.push(
        <div key={`color-${formattedDate}`} className={`calendar-day2 color-row ${dayClass}`}>
          {el}
        </div>
      );
    }

    // Render the calendar in a horizontal layout
    days.push(
      <div className="padding-add-add">
        <div key="calendar-container" className="calendar-container">
          <div className="calendar-row2" style={{ display: 'flex' }}>
            {mainRowCells}
          </div>
          <div className="calendar-row2 color-row" style={{ display: 'flex' }}>
            {colorRowCells}
          </div>
        </div>
      </div>
    );

    return days;
  };

  function filterByUserId(data, userId) {
    return data.filter((item) => item.userId === userId);
  }
  const userdataa = filterByUserId(mergedData, useridd);

  const getAttendanceInfo = (date) => {
    const attendanceRecord = newdataa.find((item) => item.date === date);
    if (attendanceRecord) {
      const inTime = attendanceRecord.Intime || 'N/A';
      const outTime = attendanceRecord.Outtime || 'N/A';
      return (
        <div>
          {/* <strong>{date}</strong><br/> */}
          <span>In: {inTime}</span>
          <br />
          <span>Out: {outTime}</span>
        </div>
      );
    }
    return <div>No attendance record</div>;
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to get starting day of the month
  const getStartDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getDayClass = (date) => {
    if (!attendance[date]) {
      return '';
    } else {
      switch (attendance[date]) {
        case 'present':
          return 'present-day';
        case 'half-day':
          return 'half-day-day';
        case 'leave':
          return 'leave-day';
        case 'absent':
          return 'absent-day';
        default:
          return '';
      }
    }
  };
  const handleDayClick = (formattedDate) => {
    const clickedAttendance = attendance.filter((item) => item.date === formattedDate);
    setClickData(clickedAttendance.length > 0 ? clickedAttendance : null);
    setshowpopup(true);
    console.log('Attendance for', formattedDate, clickedAttendance);
  };
  const formatDate = (date) => {
    const dateString = date.toLocaleDateString('en-US', dateFormatOptions);
    const timeString = date.toLocaleTimeString('en-US', timeFormatOptions);
    return `${dateString}, ${timeString}`;
  };
  const dateFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  const timeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  useEffect(() => {
    // console.log('Attendance:', attendance);
    // console.log('Employees:', employees);
    if (attendance.length > 0 && employees.length > 0) {
      const merged = attendance.map((att) => {
        const employee = employees.find((emp) => emp._id === att.userId);
        // console.log('Matching employee for userId:', att.userId, employee);
        const result = {
          ...att,
          name: employee ? employee.name : 'Unknown',
          id: employee ? employee.id : 'Unknown ID',
          profilePicture: employee ? employee.profilePicture : 'Unknown',
          department: employee ? employee.departmentId : 'Unknown'
        };
        // console.log('Merged result:', result);
        return result;
      });
      // console.log('Final merged data:', merged);
      setMergedData(merged);
    }
  }, [attendance, employees]);

  useEffect(() => {
    if (leaveData.length > 0 && employees.length > 0) {
      const merged = leaveData.map((att) => {
        const employee = employees.find((emp) => emp._id === att.userId);
        // console.log('Matched employee:', employee);
        const result = {
          ...att,
          name: employee ? employee.name : 'Unknown',
          id: employee ? employee.id : 'Unknown ID',
          profilePicture: employee ? employee.profilePicture : 'Unknown',
          department: employee ? employee.departmentId : 'Unknown'
        };
        // console.log('Merged record:', result);
        return result;
      });
      setMergedLeaveData(merged);
    }
  }, [leaveData, employees]);

  // Example mergedData array (array of objects)

  const userIdArrays = {};

  mergedData.forEach((record) => {
    const { userId, name } = record;
    if (!userIdArrays[userId]) {
      userIdArrays[userId] = [];
    }
    userIdArrays[userId].push(record);
  });
  // console.log(userIdArrays);

  const userIdArraysArray = Object.keys(userIdArrays).map((userId) => ({
    userId,
    records: userIdArrays[userId]
  }));

  const rawData = [];
  // console.log("User IDs:", userIdArraysArray);

  const UserDetails = ({ item }) => {
    const [showdivv, setShowdivv] = useState(false);
    const [presentCount, setPresentCount] = useState(0);
    const [absentCount, setAbsentCount] = useState(0);

    const showdivfun = (e, userId) => {
      e.stopPropagation();
      setShowdivv((prevState) => {
        const newState = !prevState;
        if (newState) {
          setuseridd(userId);
        }
        return newState;
      });
    };

    useEffect(() => {
      const calculateCounts = () => {
        let present = 0;
        let absent = 0;

        const startOfMonth = new Date(currentDatee.getFullYear(), currentDatee.getMonth(), 1);

        const endOfMonth = new Date(currentDatee.getFullYear(), currentDatee.getMonth() + 1, 0);

        const endOfMonthPlusOne = new Date(endOfMonth);
        endOfMonthPlusOne.setDate(endOfMonth.getDate() + 1);

        // console.log('Start of Month:', startOfMonth);
        // console.log('End of Month:', endOfMonth);
        // console.log('End of Month Plus One Day:', endOfMonthPlusOne);

        // Filter records based on department and date range
        const filteredRecords = item.records
          .filter((record) => department === 'allemployees' || record.department === department)
          .filter((record) => {
            const recordDate = new Date(record.date);
            const isInDateRange = recordDate >= startOfMonth && recordDate <= endOfMonthPlusOne;
            if (isInDateRange) {
              // console.log('Record in Range:', record);
            }
            return isInDateRange;
          });

        // console.log('Filtered Records:', filteredRecords);

        filteredRecords.forEach((record) => {
          if (record.status === 'Present') present++;
          else if (record.status === 'Absent') absent++;
        });

        // console.log('Present Count:', present);
        // console.log('Absent Count:', absent);

        // Update state with calculated counts
        setPresentCount(present);
        setAbsentCount(absent);
      };

      // Call the function to calculate counts
      calculateCounts();
    }, [item.records, department, currentDatee]); // Dependencies to trigger recalculation
    // Dependencies to trigger recalculation
    // Dependencies to trigger recalculation

    return (
      <div onClick={(e) => showdivfun(e, item.records[0]?.userId)} className="user-details-display">
        <div className="new-month-divcon">
          <div className="details-div1-user">
            <img className="user-dp-hr" src={serverUrl.apiUrl + item.records[0]?.profilePicture} alt="User" />
            <Link to={`/attendance/${item.records[0]?.userId}`}>
              <h5 className="h5-hr-view">{item.records[0]?.name}</h5>
            </Link>
            <h6 name="userid" className="h6-hr-view">
              ID: {item.records[0]?.id}
            </h6>
          </div>
          <div className="present-month-absent-month">
            <h6 className="present-month-absent-month-h6">
              Present (Days):<div className="present-day-show-in-h6">{presentCount}</div>
            </h6>
            <h6 className="present-month-absent-month-h6">
              Absent (Days):<div className="present-day-show-in-h6 redd-d">{absentCount}</div>
            </h6>
          </div>
        </div>
        {showdivv && <>{renderCalendarDays(item.records)}</>}
      </div>
    );
  };

  const handleMonthChange = (increment) => {
    setCurrentDatee((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      console.log('New Date:', newDate); // Debugging line
      return newDate;
    });
  };
  
  const presentCount = mergedData.filter(record => isToday(record.date) && (record.status === 'Present' || record.status === 'Half Day')).length;
  const totalEmployees = employees.length;
  
  
  return (
    <div className="attendanceStat">
      <Head heading={'Attendance Panel'} status="hr" setcolor1={setcolor1} setcolor2={setcolor2} />
      {bgcolor1 && (
        <>
          <div className="daily-weekly-data">
            <div className="daily-date-div-cupdate">
              <div className="date-show">
              <h6 className="head-heading">Today Present: {presentCount} /{totalEmployees}</h6>
              </div>
            </div>
            {/* dropdown starts */}
            <div className="dropdown-input">
              <div className="custom-select">
                <select className="form-controll" value={selectedOption} onChange={handleChange} onClick={handleSelectClickslect}>
                  <option value="today">Today</option>
                  <option value="monthly"> Monthly</option>
                </select>
              </div>
            </div>
          </div>
          {selectedOption === 'monthly' ? (
            <div className="user-hr-view">
              <div className="calendar-nav">
                <button className="pre-day" onClick={() => handleMonthChange(-1)}>
                  <img src={left} />
                </button>
                <span className="month-show">
                  {currentDatee.toLocaleDateString('default', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                <button className="pre-day" onClick={() => handleMonthChange(1)}>
                  <img src={right} />
                </button>
              </div>
              {userIdArraysArray
                .filter((item) => department === 'allemployees' || item.records[0]?.department === department)
                .map((item, index) => (
                  <UserDetails key={index} item={item} department={department} />
                ))}
            </div>
          ) : (
            <div className="attendanceStats-cards-grid">
              {Array.isArray(mergedData) &&
                mergedData
                  .filter((record) => isToday(record.date) && (department === 'allemployees' || record.department === department))
                  .map((record) => (
                    <div key={record._id} className="attendanceStats-card">
                      <div className="attendanceStats-card-upperContent">
                        <div className="attendanceStats-card-upperContent-left">
                          <div className="attendanceStats-profile-card">
                            <img src={serverUrl.apiUrl + record.profilePicture} alt="Profile" className="attendanceStats-profile" />
                          </div>
                          <div className="attendanceStats-card-upperContent-left-details">
                            <div className="attendanceStats-card-name-div">
                              <div className={`attendanceStats-card-name-dot ${record.status === 'Present' ? 'present' : 'leave'}`}></div>
                              <h1 className="attendanceStats-card-name m-0">{record.name}</h1>
                            </div>
                            <h4 className="attendanceStats-card-id m-0">ID: {record.id}</h4>
                          </div>
                        </div>
                        <div className="attendanceStats-card-upperContent-right">
                          <Link to={`/attendance/${record.userId}`}>
                            <button className="attendanceStats-button">View Details</button>
                          </Link>
                        </div>
                      </div>

                      <div className="attendanceStats-card-lowerContent">
                        {record.status === 'Present' || record.status === 'Half Day' || record.status === 'Absent' ? (
                          <>
                            <div className="attendanceStats-card-lowerContent-box forpresent">
                              <h6 className="attendanceStats-card-lowerContent-box-placeHolder m-0">In Time:</h6>
                              <h2 className="attendanceStats-card-lowerContent-box-details m-0">{record.Intime || '_'}</h2>
                            </div>
                            <div className="attendanceStats-card-lowerContent-box forpresent">
                              <h6 className="attendanceStats-card-lowerContent-box-placeHolder m-0">Break Time:</h6>
                              <h2 className="attendanceStats-card-lowerContent-box-details m-0">{record.breakTime || '_'}</h2>
                            </div>
                            <div className="attendanceStats-card-lowerContent-box forpresent">
                              <h6 className="attendanceStats-card-lowerContent-box-placeHolder m-0">Work Time:</h6>
                              <WorkTimeDisplay inTime={record.Intime} outTime={record.Outtime} />
                              </div>
                            <div className="attendanceStats-card-lowerContent-box forpresent">
                              <h6 className="attendanceStats-card-lowerContent-box-placeHolder m-0">Out Time:</h6>
                              <h2 className="attendanceStats-card-lowerContent-box-details m-0">{record.Outtime || '_'}</h2>
                            </div>
                          </>
                        ) : (
                          <div className="attendanceStats-card-lowerContent-box forleave">
                            <h6 className="attendanceStats-card-lowerContent-box-placeHolder m-0">Reason:</h6>
                            <h2 className="attendanceStats-card-lowerContent-box-details m-0">{record.reason || '_'}</h2>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </>
      )}

      {bgcolor2 && (
        <div className="attendanceStats-cards-grid">
          {mergedLeaveData
            .filter((record) => department === 'allemployees' || record.department === department)
            .map((record) => (
              <div key={record.userId} className="attendanceStats-card">
                <div className="attendanceStats-card-upperContent">
                  <div className="attendanceStats-card-upperContent-left">
                    <div className="attendanceStats-profile-card">
                      <img src={serverUrl.apiUrl + record.profilePicture} alt="Profile" className="attendanceStats-profile" />
                    </div>
                    <div className="attendanceStats-card-upperContent-left-details">
                      <div className="attendanceStats-card-name-div">
                        <h1 className="attendanceStats-card-name m-0">{record.name}</h1>
                      </div>
                      <h4 className="attendanceStats-card-id m-0">ID: {record.id}</h4>
                    </div>
                  </div>
                  <div className="attendanceStats-card-upperContent-right">
                    <div className="attendanceStats-card-lowerContent-box forpresent">
                      <h2 className="attendanceStats-card-lowerContent-box-details m-0">{record.leaveType}</h2>
                      <h6 className="attendanceStats-card-lowerContent-box-sick-leave m-0">{calculateDays(record.fromDate, record.toDate) + ' days' || '_'}</h6>
                    </div>
                  </div>
                </div>

                <div className="leave-card-lowerContent-content m-0">
                  <h3 className="leave-card-lowerContent-heading">{record.leaveType}</h3>
                  <h2 className="leave-card-lowerContent-subheading m-0">
                    {new Date(record.fromDate).getDate()} {new Date(record.fromDate).toLocaleString('default', { month: 'long' })} - {new Date(record.toDate).getDate()} {new Date(record.toDate).toLocaleString('default', { month: 'long' })}
                  </h2>
                </div>

                <div className="leave-card-lowerContent-buttons m-0">
                  {record.status.toLowerCase() === 'pending' ? (
                    <>
                      <button className="leave-button deny" onClick={() => handleDeny(record._id)}>
                        Deny
                      </button>
                      <button className="leave-button approve" onClick={() => handleApprove(record._id)}>
                        Approve
                      </button>
                    </>
                  ) : (
                    <div className={`leave-status ${record.status.toLowerCase()}`}>{record.status}</div>
                  )}

                  <a className="leave-button view-details" href={serverUrl.apiUrl + record.file} target="_blank" rel="noopener noreferrer">
                    <div className="">View Attatchment</div>
                  </a>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};



const WorkTimeDisplay = ({ inTime, outTime }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const calculateWorkTime = (inTime, outTime) => {
    const today = new Date();
    const [inHours, inMinutes] = inTime.split(':').map(Number);
    
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), inHours, inMinutes);
    let end;
  
    if (outTime) {
      const [outHours, outMinutes] = outTime.split(':').map(Number);
      end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), outHours, outMinutes);
    } else {
      end = new Date();
    }
    
    const diff = end - start;
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <h2 className="attendanceStats-card-lowerContent-box-details m-0">
      {calculateWorkTime(inTime, outTime, currentTime)}
    </h2>
  );
};

export default AttendanceStat;



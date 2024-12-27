import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SmoothCorners } from 'react-smooth-corners';
import leave from '../assets/leave.svg';
import left from '../assets/chevron_left.svg';
import right from '../assets/chevron_right.svg';
import present from '../assets/present.svg';
import absent from '../assets/absent.svg';
import ServerUrl from '../config/config';
import axios from 'axios';
import { ShowdayDetailpopup } from '../popups/AllotherPopups';
import { useNavigate, useParams } from 'react-router-dom';
import { color } from 'chart.js/helpers';
import { Tooltip } from 'react-tooltip';
import AppliesLeaves from '../components/AppliedLeaves';
import arrowLeft from '../assets/arrow-left.svg';
import clocksvg from '../assets/clock-svgrepo-com.svg';
const AttendancePage = () => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState([]);
  const [newAttendance, setNewAttendance] = useState({
    date: '',
    status: ''
  });
  const [shiftDuration, setShiftDuration] = useState(0);

  const [currentDatee, setCurrentDatee] = useState(new Date());
  const [attendancee, setAttendancee] = useState({});
  const [markedPresent, setMarkedPresent] = useState(false);
  const [markedLeave, setMarkedLeave] = useState(false);
  const [formated, setformated] = useState(' ');
  const [clockedInRecord, setClockedInRecord] = useState(null);
  const [officeConfig, setOfficeConfig] = useState(null);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [halfDayCount, setHalfDayCount] = useState(0);
  const [onLeaveCount, setOnLeaveCount] = useState(0);
  const [sundayCount, setSundayCount] = useState(0);
  const [sundayAbsentCount, setSundayAbsentCount] = useState(0);
  const [saturdayCount, setSaturdayCount] = useState(0);
  const [saturdayAbsentCount, setSaturdayAbsentCount] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [clickData, setClickData] = useState(null);
  const [showpopup, setshowpopup] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const navigate = useNavigate();
  const [userLeaves, setUserLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  // Assuming you fetch and set this configuration
  const userParamId = useParams();
  const userId = user.id;

  const today = new Date().toISOString().split('T')[0];
  const isTodayHoliday = officeConfig && officeConfig.holidays.includes(today);
  const todayAttendance = attendance.find((item) => item.date === today);
  const isOnLeave = todayAttendance && todayAttendance.status === 'On Leave';

  const handleNavigate = (userId) => {
    navigate(`/leaveportal/${userId}`);
  };
  const showPopup = () => {
    setIsVisible(!isVisible);
  };
  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    console.log(user);

    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${ServerUrl.apiUrl}api/config`);
        setOfficeConfig(response.data);
      } catch (error) {
        console.error('Error fetching office configuration:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const isHoliday = (date) => {
    return officeConfig.holidays.includes(date);
  };

  useEffect(() => {
    const fetchUserLeaves = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token available. Please log in.');
        }

        const idToUse = userParamId._id !== undefined ? userParamId._id : userId;

        const response = await fetch(`${ServerUrl.apiUrl}api/leaverequests/${idToUse}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch leaves');
        }

        const data = await response.json();
        setUserLeaves(data);
      } catch (error) {
        console.error('Error fetching user leaves:', error);
      }
    };

    fetchUserLeaves();
  }, [officeConfig, userParamId, userId]);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (userParamId._id && userParamId._id !== userId) {
        try {
          const response = await axios.get(`${ServerUrl.apiUrl}api/employee/getsingleemployee/${userParamId._id}`);
          setEmployeeDetails(response.data);
          // console.log(response.data);
        } catch (error) {
          console.error('Error fetching employee details:', error);
        }
      }
    };

    fetchEmployeeDetails();
  }, [userParamId._id, userId]);

  const getAttendanceInfo = (date) => {
    const attendanceRecord = attendance.find((item) => item.date === date);
    const isWeekend = (officeConfig.weekType === 'Monday to Friday' && (new Date(date).getDay() === 0 || new Date(date).getDay() === 6)) || (officeConfig.weekType === 'Monday to Saturday' && new Date(date).getDay() === 0);
    const isHoliday = officeConfig.holidays.includes(date);

    if (isHoliday) {
      return <div>Holiday</div>;
    }
    if (attendanceRecord) {
      if (isWeekend && attendanceRecord.status === 'On Leave') {
        return <div>On Leave</div>;
      }
    }
    if (isWeekend) {
      return <div>Weekend</div>;
    }

    if (attendanceRecord) {
      if (attendanceRecord.status === 'On Leave') {
        return <div>On Leave</div>;
      }
      const inTime = attendanceRecord.Intime || '--:--';
      const outTime = attendanceRecord.Outtime || '--:--';
      return (
        <div>
          <span>In: {inTime}</span>
          <br />
          <span>Out: {outTime}</span>
        </div>
      );
    }
    return <div>No attendance record</div>;
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token available. Please log in.');
        }

        const idToUse = userParamId._id !== undefined ? userParamId._id : userId;

        // console.log('idToUse:', idToUse);
        const response = await fetch(`${ServerUrl.apiUrl}api/attendance/${idToUse}`, {
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
        const uniqueAttendance = Array.from(new Set(attendance.map((item) => item.id))).map((id) => {
          return attendance.find((a) => a.id === id);
        });

        setAttendance(data);
        // console.log(attendance);
        // Check if there is a clocked-in record without clock out
        const clockedIn = data.find((record) => !record.Outtime && record.userId === user.id);
        setClockedInRecord(clockedIn);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    if (officeConfig) {
      fetchAttendance();
    }
  }, [officeConfig, ServerUrl.apiUrl, user.id, userParamId]);

  const transformDate = (data) => {
    return data.map((entry) => {
      const dateObj = new Date(entry.date); // Parse the date string into a Date object
      const formattedDate = `${getDayOfWeek(dateObj.getDay())} ${getMonthName(dateObj.getMonth())} ${dateObj.getDate()} ${dateObj.getFullYear()}`;

      return {
        ...entry,
        date: formattedDate // Replace the original date with the formatted date
      };
    });
  };

  // Helper function to get day of week as short string (e.g., "Mon")
  const getDayOfWeek = (day) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysOfWeek[day];
  };

  // Helper function to get month name as short string (e.g., "Jul")
  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAttendance({ ...newAttendance, [name]: value });
  };
  const handleClockIn = async () => {
    if (clockedInRecord) {
      console.warn('Already clocked in. Please clock out first.');
      return;
    }

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    };
    const Intime = today.toLocaleTimeString([], options);
    const userId = user ? user.id : '';

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available. Please log in.');
      }

      // Determine the status based on the configuration
      let attendanceStatus = null;
      const configInTime = officeConfig.inTime; // Assuming officeConfig.inTime is already in "HH:mm" format
      const lastInTime = officeConfig.lastInTime; // Assuming officeConfig.lastInTime is already in "HH:mm" format
      const configOutTime = officeConfig.outTime; // Assuming officeConfig.outTime is already in "HH:mm" format

      const [configInHour, configInMinute] = configInTime.split(':').map(Number);
      const [lastInHour, lastInMinute] = lastInTime.split(':').map(Number);
      const [configOutHour, configOutMinute] = configOutTime.split(':').map(Number);
      const [userInHour, userInMinute] = Intime.split(':').map(Number);

      const configInTimeMinutes = configInHour * 60 + configInMinute;
      const lastInTimeMinutes = lastInHour * 60 + lastInMinute;
      const userInTimeMinutes = userInHour * 60 + userInMinute;
      const configOutTimeMinutes = configOutHour * 60 + configOutMinute;

      if (userInTimeMinutes <= lastInTimeMinutes) {
        attendanceStatus = 'Present';
      } else if (userInTimeMinutes > lastInTimeMinutes && userInTimeMinutes <= configOutTimeMinutes) {
        attendanceStatus = 'Half Day';
      } else if (userInTimeMinutes > configOutTimeMinutes) {
        alert('Invalid entry. Only for night shift employees.');
        return;
      } else {
        attendanceStatus = 'Absent';
      }

      const response = await fetch(`${ServerUrl.apiUrl}api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date,
          Intime,
          userId,
          status: attendanceStatus
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized. Token may have expired.');
        } else {
          const data = await response.json();
          console.error('Failed to mark attendance:', response.statusText, data.message || data);
          alert('Already clockin', response.statusText, data.message || data);
        }
        return;
      }

      const data = await response.json();
      setAttendance([...attendance, data]);
      setClockedInRecord(data);
      showpopup();
    } catch (error) {
      console.error('Error marking attendance:', error.message || error);
    }
  };

  const handleClockOut = async (id) => {
    if (!clockedInRecord) {
      console.warn('No clocked-in record found. Please clock in first.');
      return;
    }

    const today = new Date();

    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    };
    const Outtime = today.toLocaleTimeString([], options);

    console.log('Outtime:', Outtime);

    // Calculate attendance status

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available. Please log in.');
      }

      const status = calculateAttendanceStatus(clockedInRecord);

      const response = await fetch(`${ServerUrl.apiUrl}api/attendance/${id}/clockout`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ Outtime, status })
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized. Token may have expired.');
        } else {
          const data = await response.json();
          console.error('Failed to clock out:', response.statusText, data.message || data);
        }
        return;
      }

      const data = await response.json();

      // Update the attendance list with the updated record
      setAttendance((prevAttendance) => prevAttendance.map((record) => (record._id === data._id ? data : record)));
      setClockedInRecord(null);
    } catch (error) {
      console.error('Error clocking out:', error.message || error);
    }
  };

  const calculateAttendanceStatus = (record) => {
    if (!officeConfig) {
      return 'Loading...'; // Handle when office configuration is still fetching
    }

    // Convert office configuration times to minutes
    const [configInHour, configInMinute] = officeConfig.inTime.split(':').map(Number);
    const [configOutHour, configOutMinute] = officeConfig.outTime.split(':').map(Number);
    const [lastInHour, lastInMinute] = officeConfig.lastInTime.split(':').map(Number);

    const configInTimeMinutes = configInHour * 60 + configInMinute;
    const configOutTimeMinutes = configOutHour * 60 + configOutMinute;
    const lastInTimeMinutes = lastInHour * 60 + lastInMinute;

    // Convert record times to minutes
    const [userInHour, userInMinute] = record.Intime.split(':').map(Number);
    const [userOutHour, userOutMinute] = record.Outtime ? record.Outtime.split(':').map(Number) : [0, 0];

    const userInTimeMinutes = userInHour * 60 + userInMinute;
    const userOutTimeMinutes = userOutHour * 60 + userOutMinute;

    // Calculate total work minutes and half-day minutes
    const totalWorkMinutes = configOutTimeMinutes - configInTimeMinutes;
    const halfDayMinutes = totalWorkMinutes / 2;
    const workedMinutes = userOutTimeMinutes - userInTimeMinutes;

    let attendanceStatus = 'Absent'; // Default to Absent

    if (userOutTimeMinutes === 0) {
      // If Outtime is not set
      attendanceStatus = 'Absent';
    }
    if (userOutTimeMinutes < configOutTimeMinutes) {
      if (workedMinutes < totalWorkMinutes && workedMinutes < halfDayMinutes) {
        attendanceStatus = 'Absent';
      } else if (workedMinutes < totalWorkMinutes && workedMinutes > halfDayMinutes) {
        attendanceStatus = 'Half Day';
      } else if (workedMinutes >= totalWorkMinutes) {
        attendanceStatus = 'Present';
      } else if (workedMinutes < halfDayMinutes) {
        attendanceStatus = 'Absent';
      } else {
        attendanceStatus = 'Absent';
      }
    } else if (userOutTimeMinutes >= configOutTimeMinutes) {
      if (workedMinutes < totalWorkMinutes && workedMinutes < halfDayMinutes) {
        attendanceStatus = 'Absent';
      } else if (workedMinutes < totalWorkMinutes && workedMinutes > halfDayMinutes) {
        attendanceStatus = 'Half Day';
      } else if (workedMinutes >= totalWorkMinutes) {
        attendanceStatus = 'Present';
      } else if (workedMinutes < halfDayMinutes) {
        attendanceStatus = 'Absent';
      } else {
        attendanceStatus = 'Absent';
      }
    }

    console.log(`Calculated Attendance Status: ${attendanceStatus}`);
    return attendanceStatus;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newAttendance)
      });
      const data = await response.json();
      setAttendance([...attendance, data]);
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to get starting day of the month
  const getStartDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDatee((prevDate) => {
      const prevMonth = prevDate.getMonth() - 1;
      if (prevMonth < 0) {
        return new Date(prevDate.getFullYear() - 1, 11, 1);
      }
      return new Date(prevDate.getFullYear(), prevMonth, 1);
    });
  };
  const handleNextMonth = () => {
    setCurrentDatee((prevDate) => {
      const nextMonth = prevDate.getMonth() + 1;
      if (nextMonth > 11) {
        return new Date(prevDate.getFullYear() + 1, 0, 1);
      }
      return new Date(prevDate.getFullYear(), nextMonth, 1);
    });
  };
  // Function to handle month change
  const handleMonthChange = (increment) => {
    setCurrentDatee((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
    setMarkedPresent(false);
    setMarkedLeave(false);
  };
  // Function to mark attendance as present for current day
  const markAttendancePresent = () => {
    const formattedDate = currentDatee.toDateString();
    const updatedAttendance = { ...attendance };
    updatedAttendance[formattedDate] = 'present';
    setAttendance(updatedAttendance);
    setMarkedPresent(true);
  };

  useEffect(() => {
    if (!attendance.length) {
      return; // Exit if attendance is empty to avoid unnecessary computations
    }

    // Get the current year and month
    const currentYear = currentDatee.getFullYear();
    const currentMonth = currentDatee.getMonth();

    // Initialize counts
    let presentCount = 0;
    let absentCount = 0;
    let halfDayCount = 0;
    let onLeaveCount = 0;
    let saturdayCount = 0;
    let sundayCount = 0;

    // Loop through each day of the current month
    for (let day = 1; day <= 31; day++) {
      // Create a date object for the current day
      const currentDate = new Date(currentYear, currentMonth, day);

      // Filter attendance for the current date
      const filteredAttendance = attendance.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth && itemDate.getDate() === currentDate.getDate();
      });

      // Count each status type for the current date
      filteredAttendance.forEach((item) => {
        console.log('fil data', item);
        switch (item.status) {
          case 'Present':
            presentCount++;
            break;
          case 'Half Day':
            halfDayCount++;
            break;
          case 'Absent':
            absentCount++;
            break;
          case 'On Leave':
            onLeaveCount++;
          default:
            break;
        }
      });

      // Check if the current date is a Saturday or Sunday
      if (currentDate.getDay() === 6) {
        saturdayCount++;
      } else if (currentDate.getDay() === 0) {
        sundayCount++;
      }
    }

    // Update state with counts
    setPresentCount(presentCount);
    setAbsentCount(absentCount);
    setHalfDayCount(halfDayCount);
    setOnLeaveCount(onLeaveCount);
    setSaturdayCount(saturdayCount);
    setSundayCount(sundayCount);
  }, [attendance, currentDatee]);

  const renderdayadata = (e) => {
    console.log(e);
    alert('hy');
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDatee.getMonth(), currentDatee.getFullYear());
    const startDay = getStartDayOfMonth(currentDatee.getMonth(), currentDatee.getFullYear());
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (!officeConfig) return null;
    // Create headers for day names
    const dayHeaders = weekdays.map((day) => (
      <div key={`header-${day}`} className="calendar-day day-header">
        {day.slice(0, 1)}
      </div>
    ));

    days.push(
      <div key="header-row" className="calendar-row day-header">
        {dayHeaders}
      </div>
    );

    // Fill the calendar with dates
    let dayCounter = 1;
    for (let row = 0; row < 6; row++) {
      const rowCells = [];
      for (let col = 0; col < 7; col++) {
        if ((row === 0 && col < startDay) || dayCounter > daysInMonth) {
          rowCells.push(<div key={`${row}-${col}`} className="calendar-day empty-day"></div>);
        } else {
          const date = new Date(currentDatee.getFullYear(), currentDatee.getMonth(), dayCounter);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, so add 1
          const day = date.getDate().toString().padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;
          const isCurrentDay = currentDatee.toDateString() === formattedDate;
          const dayClass = getDayClass(formattedDate);

          const handleDayClick = (formattedDate) => {
            const clickedAttendance = attendance.filter((item) => item.date === formattedDate);
            setClickData(clickedAttendance.length > 0 ? clickedAttendance : null);
            setshowpopup(true);
            // console.log('Attendance for', formattedDate, clickedAttendance);
          };

          // Determine background color based on attendance status
          let backgroundColor = '';
          let color = '';
          const attendanceStatus = attendance.find((item) => item.date === formattedDate)?.status;
          const isWeekend = (officeConfig.weekType === 'Monday to Friday' && (col === 0 || col === 6)) || (officeConfig.weekType === 'Monday to Saturday' && col === 0);
          const isHolidayDate = isHoliday(formattedDate);

          if (isHolidayDate) {
            backgroundColor = 'var(--colors-orange-orange-100, #FFE5D0)'; // Pink for holidays
            color = '#984C0C';
          } else if (isWeekend && attendanceStatus == 'On Leave') {
            backgroundColor = '#CFF4FC'; // Black for weekends
            color = '#087990';
          } else if (isWeekend) {
            backgroundColor = 'var(--Gray-100, #F8F9FA)'; // Black for weekends
            color = '#49505750';
          } else {
            switch (attendanceStatus) {
              case 'Present':
                backgroundColor = '#D1E7DD'; // Green color for present
                color = '#13795B';
                break;
              case 'Absent':
                backgroundColor = '#F8D7DA'; // red color for absent
                color = '#842029';
                break;
              case 'Half Day':
                backgroundColor = '#FFF3CD'; // Yellow color for half-day
                color = '#997404';
                break;
              case 'On Leave':
                backgroundColor = '#CFF4FC'; // Light blue color for on leave
                color = '#087990';
                break;
            }
          }
          rowCells.push(
            <div onClick={() => handleDayClick(formattedDate)} key={formattedDate} className={`calendar-day ${dayClass} custom-tooltip`} style={{ backgroundColor: backgroundColor, color: color }}>
              <span>{dayCounter}</span>
              <div className="tooltiptext">{getAttendanceInfo(formattedDate)}</div>
            </div>
          );
          dayCounter++;
        }
      }
      days.push(
        <div key={`row-${row}`} className="calendar-row">
          {rowCells}
        </div>
      );
    }

    return days;
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

  // Function to get button text based on attendance status
  // const getButtonText = (date) => {
  //   if (!attendance[date]) {
  //     return 'Mark Attendance';
  //   } else {
  //     switch (attendance[date]) {
  //       case 'present':
  //         return 'Present';
  //       case 'half-day':
  //         return 'Half-Day';
  //       case 'leave':
  //         return 'Leave';
  //       case 'absent':
  //         return 'Absent';
  //       default:
  //         return 'Mark Attendance';
  //     }
  //   }
  // };

  const dayName = currentDatee.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

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
  // Custom date formatting function
  const formatDate = (date) => {
    const dateString = date.toLocaleDateString('en-US', dateFormatOptions);
    const timeString = date.toLocaleTimeString('en-US', timeFormatOptions);
    return `${dateString}, ${timeString}`;
  };

  const closepopup = () => {
    setshowpopup(false);
  };
  useEffect(() => {
    // Function to update the current time in state
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Convert hours to 12-hour format

      setCurrentTime(`${hours}:${minutes}:${seconds} ${period}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getTodayAttendanceStatus = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.find((item) => item.date === today);
    if (todayAttendance) {
      return todayAttendance.status;
    }
    return 'Not Marked';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Present':
        return 'present-div-show';
      case 'Absent':
        return 'absent-div-show';
      case 'Half Day':
        return 'half-day-div-show';
      case 'On Leave':
        return 'on-leave-div-show';
      default:
        return 'not-marked-div-show';
    }
  };
  const todayStatus = getTodayAttendanceStatus();

  const updateShiftDuration = () => {
    if (clockedInRecord && clockedInRecord.Intime) {
      const clockInTime = new Date(`${clockedInRecord.date}T${clockedInRecord.Intime}`);
      const currentTime = new Date();
      const duration = Math.floor((currentTime - clockInTime) / 1000);
      setShiftDuration(duration);
    }
  };
  useEffect(() => {
    const intervalId = setInterval(updateShiftDuration, 1000);
    return () => clearInterval(intervalId);
  }, [clockedInRecord]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const ClokInOutpopup = () => {
    return (
      <>
        <div
          className="over-lay-div"
          style={{
            display: isVisible ? 'flex' : 'none',
            justifyContent: isVisible ? 'center' : 'none',
            alignItems: isVisible ? 'center' : 'none'
          }}
        >
          <div
            className="over-lay-inner "
            style={{
              opacity: isVisible ? '1' : '0',
              transform: isVisible ? 'scale(1)' : 'scale(1)',
              width: isVisible ? 'auto' : '0',
              transform: 'translate(80%, 40%)',
              display: 'flex',
              flexDirection: 'column',
              fontSize: '1rem',
              alignItems: 'center',
              width: '19%',
              gap: '3rem'
            }}
          >
            <img
              style={{
                width: '5rem',
                height: '5rem',
                opacity: '0.7'
              }}
              src={clocksvg}
            />
            <div
              className="flex"
              style={{
                flexDirection: 'column',
                width: '100%',
                gap: '1rem'
              }}
            >
              {!clockedInRecord ? (
                <button
                  className="clock-in-btn"
                  onClick={async () => {
                    await handleClockIn();
                    showPopup();
                  }}
                  style={{
                    width: '100%',
                    padding: '1.2rem'
                  }}
                >
                  Clock In
                </button>
              ) : (
                <button
                  className="clock-in-btn"
                  onClick={async () => {
                    handleClockOut(clockedInRecord._id);
                    await showPopup();
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: 'red',
                    padding: '1.2rem',
                    borderColor: 'red'
                  }}
                >
                  Clock Out
                </button>
              )}
              <button
                className="cancel"
                onClick={showPopup}
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  borderColor: clockedInRecord && 'red'
                }}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="main">
        <div className="frame">
          <SmoothCorners corners="90, 8" borderRadius="20px">
            <div className="div-dash">
              {(!userParamId._id || userParamId._id === userId) && (
                <div className="dash-heading">
                  {/* <img src={arrowLeft} className="back-arrow" onClick={goBack} /> */}
                  Your Attendance
                </div>
              )}

              {userParamId._id && userParamId._id !== userId && (
                <div className="dash-heading">
                  {/* <img src={arrowLeft} className="back-arrow" onClick={goBack} /> */}
                  Attendance Record for {employeeDetails ? employeeDetails[0].name : 'Loading...'}
                </div>
              )}
              {(!userParamId._id || userParamId._id === userId) && (
                <button className="custom-btn d-flex justify-content-center align-items-center gap-2  bg-white clr-txt-btn" onClick={() => handleNavigate(userId)}>
                  <img src={leave} /> Apply for leave
                </button>
              )}
            </div>
          </SmoothCorners>
          <div className="daily-weekly-data">
            <div className="daily-date-div-cupdate ">
              <div className="date-show">
                <h5 className="date-para">{dayName}</h5>
                {/* <h6 className="head-heading">{currentTime}</h6>
                <h6 className="head-heading">Clock-in: {clockedInRecord ? clockedInRecord.Intime : 'Not clocked in'}</h6> */}
                {clockedInRecord && <h6 className="head-heading">Shift Duration: {formatDuration(shiftDuration)}</h6>}
              </div>
            </div>
            <div className="clock-in">
              {(!userParamId._id || userParamId._id === userId) && !isTodayHoliday && !isOnLeave && (
                <div className="clock-in">
                  <div className={getStatusClass(todayStatus)}>{todayStatus}</div>
                  {!clockedInRecord ? (
                    <button className="clock-in-btn" onClick={showPopup}>
                      Clock In
                    </button>
                  ) : (
                    <button className="clock-in-btn" onClick={showPopup}>
                      Clock Out
                    </button>
                  )}
                  {isVisible && <ClokInOutpopup />}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <ul className="list-group mt-3">
          {attendance.map((record) => (
            <li key={record._id} className="list-group-item">
              {record.date} - In: {record.Intime} - Out:{" "}
              {record.Outtime || "Pending"} - Status:{" "}
              {record.status}
            </li>
          ))}
        </ul> */}
        <div className="celender-div-supper">
          <div className="celender-div">
            <div className="calendar">
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
              <div className="calendar-days ">{renderCalendarDays()}</div>
            </div>
          </div>

          <div className="show-with-color">
            <div className="show-div1 bg-new2">
              <div className="text-show-div">
                <h6 className="h6-show">Present (Days)</h6>
                <h1 className="h1-show">
                  {presentCount}/{getDaysInMonth(currentDatee.getMonth(), currentDatee.getFullYear())}
                </h1>
              </div>
            </div>

            <div className="show-div2">
              <div className="absent-div">
                <div className="text-show-div">
                  <h6 className="h6-show clr-sbsnt">Half-Days (Days)</h6>
                  <h1 className="h1-show clr-sbsnt">{halfDayCount}</h1>
                </div>
                <img src={absent} />
              </div>
              <div className="show-div1 bg-new1">
                <div className="text-show-div">
                  <h6 className="h6-show ">Absent (Days)</h6>
                  <h1 className="h1-show ">{absentCount}</h1>
                </div>
              </div>{' '}
              <div className="show-div1 ">
                <div className="text-show-div">
                  <h6 className="h6-show ">On Leave (Days)</h6>
                  <h1 className="h1-show ">{onLeaveCount}</h1>
                </div>
                <img src={present} />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="three-alldata-show">
            <div className="alldata-div1">
            <p className="alldata-div1-p">Total Work Hours</p>
            <h6 className="alldata-div1-h6">9:00h</h6>
          </div> 

          <div className="alldata-div1">
            <p className="alldata-div1-p">Total Holidays:</p>
            <h6 className="alldata-div1-h6">{sundayCount + saturdayAbsentCount + absentCount}</h6>
          </div> 

           <div className="alldata-div1">
            <p className="alldata-div1-p">Total Attendance</p>
            <h6 className="alldata-div1-h6">
              {presentCount}/{getDaysInMonth(currentDatee.getMonth(), currentDatee.getFullYear())}
            </h6>
          </div> 
        </div> */}
        <div className="contain-all-leaves-content">
          <h5 className="applied-leaves">Applied Leaves</h5>
          <div className="applied-leaves-main">
            {userLeaves.map((leave, index) => (
              <AppliesLeaves key={index} status={leave.status} leaveData={leave} />
            ))}
          </div>
        </div>
        {/* 
        {saturdayCount}
        {sundayCount} */}
      </div>
      {showpopup && <ShowdayDetailpopup closepopup={closepopup} clickData={clickData} />}
    </>
  );
};

export default AttendancePage;

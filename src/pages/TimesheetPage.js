import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SmoothCorners } from 'react-smooth-corners';
import celendar from "../assets/Calendar.svg";
import left from "../assets/chevron_left.svg";
import right from "../assets/chevron_right.svg";
import { AddProjectPopup } from '../popups/AllotherPopups';
import dot from "../assets/more_Vertical.svg"
import update from "../assets/update-con.svg"
import dltcon from "../assets/Delete.svg"
import checkmark from "../assets/checkmark-circle.svg"
import Head from '../components/Head';
const TimesheetPage = () => {
    const { user } = useContext(AuthContext);
    const [timesheets, setTimesheets] = useState([]);
    const [newTimesheet, setNewTimesheet] = useState({
        project: '',
        task: '',
        startTime: '',
        endTime: '',
    });
    const [bgcolor1, setcolor1] = useState(true);
    const [bgcolor2, setcolor2] = useState(false);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [selectedDay, setSelectedDay] = useState(null);
    const [addprjectpop, setaddprojectpop] = useState(false);
    const [monthName, setMonthName] = useState(null);
    const [sltDay, setSltDay] = useState(null);
    const [deletepro, setdeletepro] = useState(false)
    const [delValue, setdelValue] = useState(null)
    const [collectformdata, setcollectformdata] = useState([{
        currentDate: "2024-07-17T10:09:53.086Z",
        description: "xz",
        endTime: "19:39",
        projectName: "Project Name",
        startTime: "18:39",
        taskName: "Task Name",
        totalTime: "1:0"
    },
    {
        currentDate: "2024-07-17T10:09:53.086Z",
        description: "xz",
        endTime: "19:39",
        projectName: "Project Name",
        startTime: "18:39",
        taskName: "Task name",
        totalTime: "1:0"
    },
    {
        currentDate: "2024-07-16T10:09:53.086Z",
        description: "xz",
        endTime: "19:39",
        projectName: "Project Name",
        startTime: "18:39",
        taskName: "Task Name",
        totalTime: "1:0"
    },
    {
        currentDate: "2024-07-16T10:09:53.086Z",
        description: "xz",
        endTime: "19:39",
        projectName: "Project Name",
        startTime: "18:39",
        taskName: "Task Name",
        totalTime: "1:0"
    },
    {
        currentDate: "2024-07-16T10:09:53.086Z",
        description: "xz",
        endTime: "19:39",
        projectName: "Project Name",
        startTime: "18:39",
        taskName: "Task Name ",
        totalTime: "1:0"
    },
    {
        currentDate: "2024-07-16T10:09:53.086Z",
        description: "fawfkj KJDkjds KJDGkjd skjdskbaskjd jkskajc",
        endTime: "19:39",
        projectName: "Project Name",
        startTime: "18:39",
        taskName: "Task Name",
        totalTime: "1:0"
    },
    ])
    const [filteredData, setFilteredData] = useState([]);
    const addprojectpopfun = () => {
        setaddprojectpop(true);
    };

    const closepropop = () => {
        setaddprojectpop(false);
    };

    useEffect(() => {
        const fetchTimesheets = async () => {
            try {
                const response = await fetch('/api/timesheets', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                setTimesheets(data);
            } catch (error) {
                console.error('Error fetching timesheets:', error);
            }
        };

        fetchTimesheets();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTimesheet({ ...newTimesheet, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/timesheets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newTimesheet),
            });
            const data = await response.json();
            setTimesheets([...timesheets, data]);
        } catch (error) {
            console.error('Error creating timesheet:', error);
        }
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const todayy = new Date();
    useEffect(() => {
        getCurrentDayName();

    }, [selectedDay]);
    useEffect(() => {
        filterFormDataByDate(todayy)
    }, [])

    const getCurrentDayName = () => {
        const today = selectedDay || new Date();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = daysOfWeek[today.getDay()];
        const monthName = today.toLocaleString('default', { month: 'long' });
        setMonthName(monthName);
        setSltDay(dayName);
        setSelectedDay(today);
    };


    const getCurrentWeek = (index) => {
        const today = new Date();
        const currDay = today.getDay();
        const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - currDay + (currDay === 0 ? -6 : 1)); // Adjust for Sunday
        const firstDay = new Date(monday);
        firstDay.setDate(monday.getDate() + (index * 7)); // Calculate the first day of the target week

        const weekDays = [];
        for (let i = 0; i < 6; i++) {
            const day = new Date(firstDay);
            day.setDate(firstDay.getDate() + i);
            weekDays.push(day);
        }

        return weekDays;
    };

    const previousWeek = () => {
        setCurrentWeekIndex(currentWeekIndex - 1);
        setSelectedDay(null);

    };

    const nextWeek = () => {
        setCurrentWeekIndex(currentWeekIndex + 1);
        setSelectedDay(null);
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        filterFormDataByDate(day)
    };

    const currentWeek = getCurrentWeek(currentWeekIndex);

    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S'];

    const startDate = currentWeek[0];
    const startDateFormatted = `${startDate.getDate()} ${startDate.toLocaleString('default', { month: 'long' })}`;
    const endDate = currentWeek[currentWeek.length - 1];
    const endDateFormatted = `${endDate.getDate()} ${endDate.toLocaleString('default', { month: 'long' })}`;

    const filterFormDataByDate = (dateToFilter) => {
        const filteredData = collectformdata.filter(formData => {

            const formDataDate = new Date(formData.currentDate);
            const formDataYear = formDataDate.getFullYear();
            const formDataMonth = formDataDate.getMonth();
            const formDataDay = formDataDate.getDate();
            const filterDate = new Date(dateToFilter);
            const filterYear = filterDate.getFullYear();
            const filterMonth = filterDate.getMonth();
            const filterDay = filterDate.getDate();
            return (
                formDataYear === filterYear &&
                formDataMonth === filterMonth &&
                formDataDay === filterDay
            );
        });

        console.log('Filtered Data:', filteredData);
        setFilteredData(filteredData);

    };

    const handleDeleteItem = (indexToRemove) => {
        const updatedData = [...filteredData];
        updatedData.splice(indexToRemove, 1);
        setFilteredData(updatedData);

    };
    // const truedel=()=>{
    //     set
    // }

    const DeleteProjectPopup = () => {

        return (<>
            <div className="over-lay-div">
                <div className="over-lay-inner">
                    <p>x</p>
                    <button>delete project</button>
                    <button >not delete</button>
                </div>
            </div>
        </>)
    }

    return (
        <div className='main'>
            <div className='frame'>
               <Head status="div" heading="Time sheet" setcolor1={setcolor1} setcolor2={setcolor2} />
               
                <div className='daily-weekly-data'>
                    <div className='daily-date-div-cupdate'>
                        <div className='celenter-div'><img src={celendar} alt="calendar" /></div>
                        <div className='date-show'>
                            <h5 className='head-heading'>{bgcolor1 ? monthName : "This Week"}</h5>
                            <h6 className='date-para'>{bgcolor1 ? sltDay : `${startDateFormatted} - ${endDateFormatted}`}</h6>
                        </div>
                    </div>
                    {bgcolor1 ? (
                        <div className='print-weak'>
                            <button className='week-pre' onClick={previousWeek}><img src={left} alt="previous" /></button>
                            {currentWeek.map((day, index) => (
                                <SmoothCorners key={index} corners="15, 3" borderRadius="20px">
                                    <div
                                        className={`week-day ${selectedDay && selectedDay.toDateString() === day.toDateString() ? 'selected' : ''}`}
                                        onClick={() => handleDayClick(day)}
                                    >
                                        <h6 className='week-para1'>{daysOfWeek[index]}</h6>
                                        <div className='line-weak'></div>
                                        <h6 className='week-para2'>{day.getDate()}</h6>
                                    </div>
                                </SmoothCorners>
                            ))}
                            <button className='week-next' onClick={nextWeek}><img src={right} alt="next" /></button>
                        </div>
                    ) : (
                        <div className='print-weak'>
                            <button className='week-pre' onClick={previousWeek}><img src={left} alt="previous" /></button>
                            <div className="week-container">
                                {daysOfWeek.slice(0, 1).map((day, index) => (
                                    <SmoothCorners key={index} corners="15, 3" borderRadius="20px">
                                        <div
                                            className={`week-dayy2  ${selectedDay && selectedDay.toDateString() === startDate.toDateString() ? 'selecteded' : ''}`}
                                            onClick={() => handleDayClick(startDate)}
                                        >
                                            <p className='para-slt'>This Week</p>
                                            <p className='para2-slt'>{`${startDateFormatted} - ${endDateFormatted}`}</p>
                                        </div>
                                    </SmoothCorners>
                                ))}
                            </div>
                            <button className='week-next' onClick={nextWeek}><img src={right} alt="next" /></button>
                        </div>
                    )}
                </div>
                
                {bgcolor1 ? (
                    <button onClick={addprojectpopfun} className='add-project0-div'>
                        + Add Entry
                    </button>
                ) : null}
                {addprjectpop && <AddProjectPopup close={closepropop} setCollectFormData={setcollectformdata} />}
                {bgcolor1 ? (<div className='print-array-div'>
                    {filteredData.map((e, index) => {
                        return (
                            <div className='array-1-div' key={index}>
                                <div className='-dot'><img src={dot} /></div>
                                <div className='all-content-conitainer'>
                                    <div className='content-first-pro'>

                                        <div className='pro-name-task-name'><img src={checkmark} /> <h5 className='pro-name-dis'>{e.projectName}</h5>
                                            <p className='tesk-dis'>{e.taskName}</p></div>
                                        <div className='pro-dec'>{e.description}</div>
                                    </div>
                                    <div className='dlt-button-div'>
                                        <div className='total--div'><h2 className='total-text'>{e?.totalTime}</h2>
                                            <p className='start-end-time'>{e.startTime}AM to {e.endTime}PM</p></div>
                                        <div className='dlt-container'>
                                            <div className='update-con-1'><img src={update} /></div>
                                            <div className='dlt-con-1' onClick={() => handleDeleteItem(index)}><img src={dltcon} /></div>
                                        </div>
                                    </div>

                                </div>



                            </div>
                        )
                    })}
                </div>) : null}
            </div>
        </div>
    );
};

export default TimesheetPage;
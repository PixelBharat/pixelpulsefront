import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SmoothCorners } from 'react-smooth-corners';
import check from '../assets/check.svg';
import quation from '../assets/quation.svg';
import pic from '../assets/profilepic.jpg';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import { useNavigate } from 'react-router-dom';
import Head from '../components/Head';
import bubble from '../assets/bubble.png';

import { PieChart } from 'react-minimal-pie-chart';
const AdminDashboard = () => {
  const [addnum, setAddnum] = useState(3);
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Employee'
  });

  const navigate = useNavigate();
  // console.log(user);
  const role = user.role;
  const id = user.id;
  const name = user.name;

  // console.log(role, name);
  // const chartContainer = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();
      setUsers([...users, data]);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  const recentUpdatesData = [
    {
      text: 'Recent update section has done',
      img: check
    },
    {
      text: 'Recent update section has done',
      img: check
    },
    {
      text: 'Recent update section has done',
      img: check
    },
    {
      text: 'Recent update section has done',
      img: check
    },
    {
      text: 'Recent update section has done',
      img: check
    },
    {
      text: 'Recent update section has done',
      img: check
    },
    {
      text: 'Recent update section has done',
      img: check
    }
  ];

  const printupdates = recentUpdatesData.map((item, index) => {
    return (
      <div key={index}>
        <div className="update-cointain">
          <img src={item.img} />
          <p className="update-text">{item.text}</p>
        </div>
      </div>
    );
  });

  const recentQueriesData = [
    {
      text: 'Recent update section has done',
      img: quation
    },
    {
      text: 'Recent update section has done',
      img: quation
    },
    {
      text: 'Recent update section has done',
      img: quation
    },
    {
      text: 'Recent update section has done',
      img: quation
    },
    {
      text: 'Recent update section has done',
      img: quation
    },
    {
      text: 'Recent update section has done',
      img: quation
    },
    {
      text: 'Recent update section has done',
      img: quation
    }
  ];
  const printqueries = recentQueriesData.map((item, index) => {
    return (
      <div key={index}>
        <div className="update-cointain">
          <img src={item.img} />
          <p className="update-text">{item.text}</p>
        </div>
      </div>
    );
  });

  const attendanceData = [
    {
      text: "Today's Attendence",
      num: 20
    },
    {
      text: 'Project in Progress',
      num: 15
    },
    {
      text: 'Total Projects',
      num: 17
    },
    {
      text: 'On Leave',
      num: 2
    }
  ];
  const printattendencedata = attendanceData.map((item, index) => {
    const backgroundColors = ['#5C72FF', '#00BB83', '#0DCAF0', '#FC4C00'];

    const backgroundColor = backgroundColors[index % backgroundColors.length];

    return (
      <SmoothCorners corners="20, 5" borderRadius="20px" style={{ width: '100%' }}>
        <div className="atten-div" style={{ width: '100%', backgroundColor: backgroundColor }}>
          <h5 className="atten-text">{item.text}</h5>
          <h1 className="atten-num">{item.num}</h1>
        </div>
      </SmoothCorners>
    );
  });

  const notificationData = [
    {
      pic: pic,
      text: 'Lorem ipsum dolor sit amet consectetur. Nullam nulla facilisi mattisfermentum cursus adipiscing augue vivamus leo. Tristiquepulvinar donecturpis turpis',
      date: 'June 12, 2024, 8:05:10 PM'
    },
    {
      pic: pic,
      text: 'Lorem ipsum dolor sit amet consectetur. Nullam nulla facilisi mattisfermentum cursus adipiscing augue vivamus leo. Tristiquepulvinar donecturpis turpis',
      date: 'June 12, 2024, 8:05:10 PM'
    },
    {
      pic: pic,
      text: 'Lorem ipsum dolor sit amet consectetur. Nullam nulla facilisi mattisfermentum cursus adipiscing augue vivamus leo. Tristiquepulvinar donecturpis turpis',
      date: 'June 12, 2024, 8:05:10 PM'
    },
    {
      pic: pic,
      text: 'Lorem ipsum dolor sit amet consectetur. Nullam nulla facilisi mattisfermentum cursus adipiscing augue vivamus leo. Tristiquepulvinar donecturpis turpis',
      date: 'June 12, 2024, 8:05:10 PM'
    },
    {
      pic: pic,
      text: 'Lorem ipsum dolor sit amet consectetur. Nullam nulla facilisi mattisfermentum cursus adipiscing augue vivamus leo. Tristiquepulvinar donecturpis turpis',
      date: 'June 12, 2024, 8:05:10 PM'
    },
    {
      pic: pic,
      text: 'Lorem ipsum dolor sit amet consectetur. Nullam nulla facilisi mattisfermentum cursus adipiscing augue vivamus leo. Tristiquepulvinar donecturpis turpis',
      date: 'June 12, 2024, 8:05:10 PM'
    },
    {
      pic: pic,
      text: 'Lorem ipsum dolor sit amet consectetur. Nullam nulla facilisi mattisfermentum cursus adipiscing augue vivamus leo. Tristiquepulvinar donecturpis turpis',
      date: 'June 12, 2024, 8:05:10 PM'
    },
    {
      pic: pic,
      text: 'Lorem ipsum dolor sit amet consectetur. Nullam nulla facilisi mattisfermentum cursus adipiscing augue vivamus leo. Tristiquepulvinar donecturpis turpis',
      date: 'June 12, 2024, 8:05:10 PM'
    }
  ];
  const funaddnum = () => {
    setAddnum(addnum + 3);
  };
  const printNotification = notificationData.slice(0, addnum).map((item, index) => {
    return (
      <div key={index} className="notification-cointainer">
        <img src={item.pic} />
        <div className="title-and-text">
          <p className="about-notification">{item.text}</p>
          <p className="date-notification">{item.date}</p>
        </div>
      </div>
    );
  });
  // const data1 = [
  //     { label: 'Group A', value: "hy" },
  //     // { label: 'Group B', value: 300 },
  //     // { label: 'Group C', value: 300 },
  //     // { label: 'Group D', value: 200 },
  // ];
  // const data2 = [
  //     { label: '1', value: 100 },
  //     { label: '2', value: 300 },
  //     { label: '3', value: 100 },
  //     { label: '4', value: 80 },
  // ];
  // const series = [
  //     {
  //       innerRadius: 0,
  //       outerRadius: 80,
  //       id: 'series-1',
  //       data: data1,
  //     },
  //     {
  //         innerRadius: 100,
  //         outerRadius: 65,
  //         id: 'series-2',
  //         data: data2,
  //     },
  // ];
  // function PieAnimation() {
  //     const [itemData, setItemData] = React.useState();

  //     return (
  //        <div className="red">
  //             <Box sx={{ flexGrow: 1 }}>
  //                 <PieChart
  //                     series={series}
  //                     width={400}
  //                     height={300}
  //                     slotProps={{
  //                         legend: { hidden: true },
  //                     }}
  //                     onItemClick={(event, d) => setItemData(d)}
  //                 />{' '}
  //             </Box>
  //             </div>

  //     );
  // }
  // const ctx = document.getElementById('myChart');
  const data = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
        hoverOffset: 4
      }
    ]
  };
  const chart = new Chart({
    type: 'doughnut',
    data: data,
    options: {
      onClick: (e) => {
        const canvasPosition = getRelativePosition(e, chart);

        const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
        const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
      }
    }
  });
  const chartData = [
    { title: 'One', value: 6, color: '#FC58FF' },
    { title: 'Two', value: 30, color: '#0DCAF0' },
    { title: 'Three', value: 15, color: '#FF4773' },
    { title: 'Four', value: 10, color: '#FF773D' }
  ];
  const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);

  // Calculate sum of percentages
  const sumPercentages = chartData.reduce((acc, curr) => acc + (curr.value / totalValue) * 100, 0).toFixed(1);
  return (
    <div className="main">
      <div className="frame">
        <Head heading={`Welcome ${role}  ${name}`} />
        {/* <SmoothCorners corners="90, 8" borderRadius="20px">
                    <div className="div-dash">
                        <h1 className="dash-heading">Welcome {role} with  {id}</h1>
                    </div>
                </SmoothCorners> */}
        <div className="recent-update-queries-div">
          <div className="recent-update">
            <h2 className="head-update">Recent Update</h2>
            {printupdates}
          </div>
          <div className="recent-update">
            <h2 className="head-update">Recent queries</h2>
            {printqueries}
          </div>
          <div className="attendence">{printattendencedata}</div>
        </div>

        <div className="stat-notification-div">
          <div className="stat">
            <div className="employee-statistics">
              <h2 className="head-update">Recent queries</h2>
              <select className="slt-slt">
                <option disabled selected>
                  select
                </option>
                <option value="this week"></option>
                <option value="this month"></option>
              </select>
            </div>
            <div className="stat-circle-navigate">
              <div className="cir-cle-div">
                <PieChart data={chartData} segmentsStyle={4} lineWidth={30} animate={true} animationEasing={'ease-out'} />
                <div className="percen-div">
                  <h1 className="percen-text">{totalValue}%</h1>
                  <p className="percen-para">Complete</p>
                </div>
              </div>
              <div className="nav-circle">
                <div className="percentage-color">
                  <h6 className="percen">17.6%</h6>
                  <div className="color-dot">
                    <div className="dot" style={{ backgroundColor: '#0DCAF0' }}></div>
                    <p className="pandiing">Pending</p>
                  </div>
                </div>

                <div className="percentage-color">
                  <h6 className="percen">17.6%</h6>
                  <div className="color-dot">
                    <div className="dot" style={{ backgroundColor: '#FC58FF' }}></div>
                    <p className="pandiing">Pending</p>
                  </div>
                </div>

                <div className="percentage-color">
                  <h6 className="percen">17.6%</h6>
                  <div className="color-dot">
                    <div className="dot" style={{ backgroundColor: '#FF4773' }}></div>
                    <p className="pandiing">Pending</p>
                  </div>
                </div>

                <div className="percentage-color">
                  <h6 className="percen">17.6%</h6>
                  <div className="color-dot">
                    <div className="dot" style={{ backgroundColor: '#FF773D' }}></div>
                    <p className="pandiing">pandiing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="notification">
            <h2 className="head-update">Notification</h2>
            <div className="employee-statistics">
              <div className="notification-data-show">{printNotification}</div>
            </div>
            <div className="unread">
              <h6 className="all-read" onClick={funaddnum} style={{ display: addnum == notificationData.length ? 'none' : 'block' }}>
                See All Unread
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

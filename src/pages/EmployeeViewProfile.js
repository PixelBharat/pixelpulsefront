import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import serverUrl from '../config/config';

import { ReactComponent as HomeIcon } from '../assets/Home.svg';
import { ReactComponent as CakeIcon } from '../assets/cake.svg';
import { ReactComponent as CallIcon } from '../assets/call.svg';
import { ReactComponent as MailIcon } from '../assets/mail.svg';

import ProfilePic from '../assets/viewprofile.png';

const projects = [
  {
    name: 'Project Name 1',
    task: 'UI/UX Design',
    status: 'Completed',
    statusClass: 'viewprofile-rightside-status completed',
    description: 'Lorem ipsum dolor sit amet Dui faucibus consectetur. Dui faucibus velit mi egetas. lesuada l'
  },
  {
    name: 'Project Name 2',
    task: 'UI/UX Design',
    status: 'Completed',
    statusClass: 'viewprofile-rightside-status in-progress',
    description: 'Lorem ipsum dolor sit amet Dui faucibus consectetur. Dui faucibus velit mi egetas. lesuada l'
  },
  {
    name: 'Project Name 3',
    task: 'UI/UX Design',
    status: 'Completed',
    statusClass: 'viewprofile-rightside-status review',
    description: 'Lorem ipsum dolor sit amet Dui faucibus consectetur. Dui faucibus velit mi egetas. lesuada l'
  }
];

const skills = ['HTML', 'CSS', 'JavaScript', 'React'];

export default function EmployeeViewProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${serverUrl.apiUrl}api/employee/getsingleemployee/${id}`);
        const employees = response.data;
        const employee = employees.find((emp) => emp._id === id);
        // console.log(employee); // Check the data returned
        setEmployee(employee);
      } catch (error) {
        console.error('Error fetching employee:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!employee) return <p>No employee data found.</p>;

  return (
    <div className="main">
      <div className="frame">
        <div>
          <div className="viewprofile">
            <div className="viewprofile-left">
              <div className="viewprofile-left-profile-card">
                <img
                  src={serverUrl.apiUrl + employee.profilePicture}
                  alt="Profile"
                  className="viewprofile-left-profile-card-img"
                  onError={(e) => {
                    e.target.onerror = null; // Prevents the infinite loop if default image fails
                    e.target.src = 'https://www.eclosio.ong/wp-content/uploads/2018/08/default.png';
                  }}
                />

                <div className="viewprofile-left-profile-card-content">
                  <div className="viewprofile-left-profile-card-uppercontent">
                    <div className="viewprofile-left-profile-card-headings">
                      <h1 className="viewprofile-mainHeading">{employee.name}</h1>
                      <p className="viewprofile-left-profile-card-team">{employee.designation}</p>
                    </div>

                    <div className="viewprofile-left-profile-card-reporter">
                      <div className="viewprofile-left-card-reporting">Department: </div>
                      <div className="viewprofile-left-card-reporter-name">{employee.departmentId}</div>
                    </div>
                  </div>

                  <div className="viewprofile-left-profile-card-lowercontent">
                    <div className="viewprofile-left-profile-card-employee-detail">
                      <div>Employee ID: {employee.id}</div>
                      <div>Position: {employee.role}</div>
                    </div>
                    <ul>
                      <ul className="viewprofile-left-icon-details">
                        <li>
                          <CallIcon className="icon" /> <span className="text"> {employee.phone} </span>
                        </li>
                        <li>
                          <CakeIcon className="icon" />{' '}
                          <span className="text">
                            {' '}
                            DOB:{' '}
                            {new Date(employee.dob)
                              .toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })
                              .replace(/ /g, ' ')}{' '}
                          </span>{' '}
                        </li>
                      </ul>
                      <li>
                        <MailIcon className="icon" /> <span className="text"> {employee.email} </span>{' '}
                      </li>
                      <li>
                        <HomeIcon className="icon" /> <span className="text"> {employee.address} </span>{' '}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* second */}
              <div className="viewprofile-left-sections">
                <h1 className="viewprofile-mainHeading">Introduction</h1>
                <p className="viewprofile-para">{employee.basicInfo}</p>
              </div>

              {/* Third */}
              <div className="viewprofile-left-sections">
                <div className="w-100 justify-content-between d-flex ">
                  <h1 className="viewprofile-mainHeading">Personal Information</h1>
                  <Link to={`/modifyemployee/${employee._id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M9.96416 17.4975C8.24473 17.4975 6.52362 17.5042 4.80419 17.4958C3.67743 17.4891 2.78172 16.7501 2.53728 15.6433C2.5105 15.5224 2.50547 15.3964 2.50547 15.2722C2.50212 11.9955 2.4971 8.72055 2.50212 5.44727C2.50212 4.31531 3.44639 3.27572 4.56477 3.22869C5.72334 3.17999 6.88525 3.18335 8.04382 3.20014C8.72021 3.21022 9.09523 3.80811 8.84075 4.39928C8.72355 4.66968 8.51093 4.82587 8.22966 4.87625C8.04717 4.90816 7.85798 4.91488 7.67214 4.91488C6.81493 4.91992 5.9594 4.91656 5.1022 4.91992C4.97831 4.91992 4.85274 4.92831 4.7322 4.94847C4.39065 5.00725 4.21486 5.2071 4.20314 5.55811C4.19309 5.85538 4.19812 6.15433 4.19812 6.45327C4.19812 9.22104 4.19812 11.9905 4.19812 14.7582C4.19812 14.8758 4.19812 14.9934 4.19979 15.1126C4.20649 15.4586 4.3873 15.687 4.7255 15.7592C4.85944 15.7878 4.9984 15.7945 5.13568 15.7945C8.39708 15.7962 11.6568 15.7945 14.9182 15.7945C15.5008 15.7945 15.7553 15.5543 15.7603 14.9648C15.7704 13.9941 15.7654 13.0217 15.7704 12.0509C15.7704 11.9267 15.7787 11.799 15.8122 11.6815C15.9294 11.2549 16.2726 11.013 16.6895 11.0483C17.1098 11.0852 17.4496 11.3976 17.4563 11.836C17.4731 13.0217 17.5099 14.2107 17.4446 15.3931C17.3793 16.5754 16.3865 17.4739 15.2078 17.4874C13.4599 17.5075 11.7121 17.4924 9.96416 17.4924V17.4975Z" fill="#374557" />
                      <path d="M10.2002 11.7436C10.1785 11.9871 10.0328 12.0812 9.84864 12.1332C9.23252 12.3062 8.61808 12.491 7.99694 12.6488C7.55662 12.7597 7.29376 12.4389 7.41933 11.9535C7.53653 11.4984 7.66879 11.0466 7.79436 10.5932C7.82952 10.4672 7.84626 10.3312 7.90318 10.2153C7.96178 10.091 8.06056 9.98687 8.13423 9.86931C8.1811 9.79541 8.26147 9.70472 8.2464 9.63922C8.20957 9.46456 8.26649 9.34364 8.38201 9.22943C8.67668 8.93553 8.96799 8.64162 9.26098 8.34771C10.746 6.85802 12.2361 5.37169 13.7094 3.87025C13.8668 3.7107 14.1547 3.75269 14.2217 3.42855C14.2619 3.23373 14.5197 3.0809 14.6905 2.91799C15.2715 2.36376 16.0583 2.36041 16.641 2.90959C16.8168 3.07586 16.9909 3.24549 17.1466 3.43023C17.5718 3.93407 17.6204 4.55715 17.2537 5.1013C17.0344 5.42544 16.795 5.74621 16.3882 5.86714C16.3564 5.87721 16.3279 5.91584 16.3078 5.94775C16.2057 6.10562 16.1303 6.29036 15.9997 6.42136C14.3105 8.1277 12.6111 9.82396 10.9218 11.532C10.7192 11.7369 10.5133 11.8561 10.2002 11.7436Z" fill="#374557" />
                    </svg>
                  </Link>
                </div>
                <div className="viewprofile-left-third-content">
                  <div className="viewprofile-left-third-subcontent">
                    <ul className="viewprofile-left-third-content-type1">
                      <li className="icon">Nationality:</li>
                      <li className="icon">Religion:</li>
                      <li className="icon">Marital Status:</li>
                      <li className="icon">Passport No.:</li>
                      <li className="icon">Emergency Contact:</li>
                    </ul>
                    <ul className="viewprofile-left-third-content-type2 viewprofile-left-third-content-type1">
                      <li className="icon">{employee.nationality}</li>
                      <li className="icon">{employee.religion}</li>
                      <li className="icon">{employee.maritalStatus}</li>
                      <li className="icon">{employee.passportNo}</li>
                      <li className="icon">{employee.emergencyContact}</li>
                    </ul>
                  </div>

                  <div className="viewprofile-left-third-right">
                    <h2 className="viewprofile-subHeading">Bank Information</h2>
                    <div className="viewprofile-left-third-subcontent">
                      <ul className="viewprofile-left-third-content-type1">
                        <li className="icon">Bank Name:</li>
                        <li className="icon">Account No.:</li>
                        <li className="icon">IFSC Code:</li>
                        <li className="icon">UPI Id:</li>
                      </ul>
                      <ul className="viewprofile-left-third-content-type2 viewprofile-left-third-content-type1">
                        <li className="icon">{employee.bankName}</li>
                        <li className="icon">{employee.accountNumber}</li>
                        <li className="icon">{employee.ifscCode}</li>
                        <li className="icon">{employee.panNo}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fourth */}
              <div className="viewprofile-left-sections">
                <h1 className="viewprofile-mainHeading">Personal Information</h1>
                <div className="viewprofile-left-buttons">
                  {skills.map((skill, index) => (
                    <div key={index} className="viewprofile-left-button">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* fifth */}
              <div className="viewprofile-left-sections">
                <h1 className="viewprofile-mainHeading">Experience</h1>

                <div className="viewprofile-left-sections-experiencecards">
                  <div className="viewprofile-left-sections-experiencecard">
                    <h4 className="viewprofile-left-sections-experiencecard-head">Pixel Wibes</h4>
                    <p className="viewprofile-para">Jan 2016 - Present (5 years 2 month)</p>
                  </div>
                  <div className="viewprofile-left-sections-experiencecard">
                    <h4 className="viewprofile-left-sections-experiencecard-head">Pixel Wibes</h4>
                    <p className="viewprofile-para">Jan 2016 - Present (5 years 2 month)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="viewprofile-rightside">
              <div>
                <h1 className="viewprofile-mainHeading">Project Name</h1>
              </div>
              {projects.map((project, index) => (
                <div key={index} className="viewprofile-rightside-card">
                  <div className="viewprofile-rightside-upperpart">
                    <div className="viewprofile-rightside-intro">
                      <h2 className="viewprofile-subHeading">{project.name}</h2>
                      <p className="viewprofile-rightside-task">{project.task}</p>
                    </div>
                    <h4 className={project.statusClass}>{project.status}</h4>
                  </div>
                  <p className="viewprofile-para">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

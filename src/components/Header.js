import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../assets/headerlogo.png';
import searchlogo from '../assets/searchlogo.svg';
import moon from '../assets/moon.svg';
import notify from '../assets/notify.svg';
import settings from '../assets/settings.svg';
import profilepic from '../assets/profilepicture.png';
import down from '../assets/down.svg';
import people from '../assets/people.svg';
import logoutimg from '../assets/logout.svg';
import { SmoothCorners } from 'react-smooth-corners';
import ServerUrl from '../config/config';
import axios from 'axios';
import { MdMargin } from 'react-icons/md';

const Header = () => {
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showDepartmentsPopup, setShowDepartmentsPopup] = useState(false);

  const [officeConfig, setOfficeConfig] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const userRole = user?.role || 'default';
  const userProfile = user?.profilePicture || 'default';

  const toggleProjectDropdown = (e) => {
    e.stopPropagation();
    setShowProjectDropdown(!showProjectDropdown);
    setShowProfileDropdown(false);
    setShowDepartmentsPopup(false);
  };
  
  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setShowProfileDropdown(!showProfileDropdown);
    setShowProjectDropdown(false);
    setShowDepartmentsPopup(false);
  };
  
  const toggleDepartmentsPopup = (e) => {
    e.stopPropagation();
    setShowDepartmentsPopup(!showDepartmentsPopup);
    setShowProjectDropdown(false);
    setShowProfileDropdown(false);
  };
  
  const userId = user?.id || 'default';
  const userDept = user?.departmentId || 'default';

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${ServerUrl.apiUrl}api/config`);
        setOfficeConfig(response.data);
      } catch (error) {
        console.error('Error fetching office configuration:', error);
      }
    };

    fetchConfig();
  }, []);






  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.mian-header-div')) {
        setShowProjectDropdown(false);
        setShowProfileDropdown(false);
        setShowDepartmentsPopup(false);
      }
    };
  
    document.body.addEventListener('click', handleClickOutside);
  
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <>
      <header className="mian-header-div">
        <Link to="/">
          <div className="logo-div">
            <img src={logo} alt="Logo" />
          </div>
        </Link>

        {userRole !== 'Employee' && userRole !== 'Intern' && (
          <div className="links-section" >
            <div
              // onClick={toggleProjectDropdown}
              className="select-op"
            >
              <p>Project</p>
              <img src={down} className={showProjectDropdown ? 'rotate' : ''} alt="Dropdown Icon" />
              {showProjectDropdown && (
                <div className="absolute-div1">
                  <div className="absolute-divvv">
                    <div className="recent-project">
                      <p>Recent Project</p>
                    </div>
                    <div className="content-main">
                      <div className="con1">
                        <img className="img-recent" src={profilepic} />
                        <div className="contain-heading">
                          <p className="heading-text">text</p>
                          <p className="deccription-con">software</p>
                        </div>
                      </div>
                      <div className="con1">
                        <img className="img-recent" src={profilepic} />
                        <div className="contain-heading">
                          <p className="heading-text">text</p>
                          <p className="deccription-con">software</p>
                        </div>
                      </div>
                    </div>
                    <Link to="" className="view-projects">
                      View All Projects
                    </Link>
                    <Link to="" className="view-projects">
                      Create Project
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link className="link-style">Boards</Link>
            <div onClick={toggleDepartmentsPopup} className="link-style">
              Teams
              {showDepartmentsPopup && officeConfig && (
                <div className="departments-popup">
                  {(userRole === 'Admin' || userRole === 'HR')  && (
                    <>
                      <Link to="/attendancestats/allemployees" className="department-item">
                        All Employees
                      </Link>
                      <hr />
                    </>
                  )}
                  {officeConfig.departments
                    .filter((department) => department === userDept || (userRole === 'Admin' || userRole === 'HR'))
                    .map((department, index) => (
                      <Link key={index} to={`/attendancestats/${department}`} className="department-item">
                        {department}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
              
        <div className="input-search-field">
          <SmoothCorners corners="80,8" borderRadius="5px">
            <div className="input-container-divv">
              <img src={searchlogo} alt="Search Logo" />
              <input type="text" placeholder="Enter your text here" className="search-section-div" />
            </div>
          </SmoothCorners>
          <img src={moon} alt="Dark Mode Button" />
          <div className="noti-fication">
            <img src={notify} alt="Notification Icon" />
            <div className="red-dot">3</div>
          </div>
          <img src={settings} alt="Settings Logo" />
          <div onClick={toggleProfileDropdown} className="profile-image">
            <SmoothCorners corners="5">
              <img className="profile-img" src={ServerUrl.apiUrl + userProfile} alt="User Picture" />
            </SmoothCorners>
            <img src={down} alt="Dropdown Icon" className={showProfileDropdown ? 'rotate' : ''} />
          </div>
        </div>
        {showProfileDropdown && (
          <div className="absolute-div2">
            <Link to={`/viewprofile/${userId}`} onClick={toggleProfileDropdown} className="absolute-divvv1">
              <img src={people} />
              <p>Profile</p>
            </Link>
            <div onClick={() => logout(false)} className="absolute-divvv1">
              <img src={logoutimg} />
              <p>Logout</p>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
export default Header;

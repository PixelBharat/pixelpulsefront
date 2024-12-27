import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import serverUrl from '../config/config';
import AddEmployee from '../pages/AddEmployee';
import { SmoothCorners } from 'react-smooth-corners';
import '../css/Employee.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Head from "../components/Head";

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
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

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`${serverUrl.apiUrl}api/employee/delete/${employeeId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          // Remove the employee from the local state
          toast.success('Employee deleted successfully');
          setEmployees(employees.filter((emp) => emp._id !== employeeId));
        } else {
          toast.error('Failed to delete employee');
          console.error('Failed to delete employee');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const openPopup = () => setOpen(true);
  const closePopup = () => setOpen(false);

  const handleLogout = () => alert('Logout functionality should be implemented.');

  const handleDownload = (filePath, fileName) => {
    const downloadUrl = `${serverUrl.apiUrl}${filePath}`;
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = fileName;
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleShowPage = () => {
    if (!user) {
      alert('Please login!');
      navigate('/login');
      return null;
    }
    const handleAddEmployee = () => {
      navigate('/addemployee');
    };
    return (
      <div className="main">
        <div className="frame">
          <SmoothCorners corners="90, 8" borderRadius="20px">
            <div className="div-dash">
              <div className="dash-heading">Employee Details</div>
              <button className="custom-btn d-flex justify-content-center align-items-center gap-2  bg-white clr-txt-btn" onClick={handleAddEmployee}>
                Add Employee
              </button>
            </div>
          </SmoothCorners>
          <div className="employee-card-container">
            {employees.map((employee) => (
              <div key={employee._id} className="employee-card">
                <img
                  src={`${serverUrl.apiUrl}${employee.profilePicture}`}
                  className="employee-img"
                  alt="Profile"
                  onError={(e) => {
                    e.target.onerror = null; // Prevents infinite loop in case the default image fails
                    e.target.src = 'https://www.eclosio.ong/wp-content/uploads/2018/08/default.png';
                  }}
                />{' '}
                <div className="employee-content">
                  <div className="employee-uppercontent">
                    <h5 className="employee-name">{employee.name}</h5>
                    <p className="employee-designation">{employee.designation}</p>
                  </div>
                  <p className="employee-para">{employee.description}</p>
                  <div>
                    <Link to={`/viewprofile/${employee._id}`}>
                      <button className="emp-view-btn" onClick={openPopup}>
                        View Profile
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="emp-delete-btn" onClick={() => handleDeleteEmployee(employee._id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4607 2.73147V3.2889H8.04045V2.73147C8.04045 2.39688 8.30069 2.13665 8.63528 2.13665H10.8659C11.2005 2.13665 11.4607 2.39688 11.4607 2.73147ZM6.99951 2.73147V3.2889H2.5V4.4042H3.65618L4.65667 17.2676C4.73102 18.1599 5.51172 18.9034 6.40396 18.9034H13.0957C13.988 18.9034 14.7687 18.197 14.843 17.2676L15.8435 4.4042H16.9988V3.2889H12.5016V2.73147C12.5016 1.83923 11.7581 1.0957 10.8659 1.0957H8.63528C7.74304 1.0957 6.99951 1.83923 6.99951 2.73147ZM14.7224 4.4042H4.77725L5.77196 17.1933C5.80914 17.5279 6.10655 17.7881 6.40396 17.7881H13.0957C13.4303 17.7881 13.7277 17.4907 13.7277 17.1933L14.7224 4.4042ZM8.07737 6.63444H6.96208V15.5568H8.07737V6.63444ZM10.3072 6.63444H9.19189V15.5568H10.3072V6.63444ZM11.4225 6.63444H12.5378V15.5568H11.4225V6.63444Z" fill="#B02A37"></path>
                  </svg>
                </div>
              </div>
            ))}
          </div>
          {/* {open && <AddEmployee close={closePopup} />} */}
        </div>
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" className="toast-container" />
      </div>
    );
  };

  return handleShowPage();
};

export default EmployeeDetails;

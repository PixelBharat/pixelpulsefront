import React, { useState, useRef, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import serverUrl from '../config/config';
import { ReactComponent as UploadIcon } from '../assets/Upload.svg';
import ProfilPic from '../assets/profilepicture.png';
import { format } from 'date-fns';
import axios from 'axios';
import ServerUrl from '../config/config';
import { AuthContext } from '../context/AuthContext';

import { ReactComponent as CalenderIcon } from '../assets/Calendar-addemployee.svg';
import { ReactComponent as RemoveIcon } from '../assets/close_small.svg';
import { ReactComponent as PlusIcon } from '../assets/plus-icon.svg';
import { ReactComponent as Plus2Icon } from '../assets/add-empplyee-plus.svg';

import DatePicker from 'react-datepicker';

import '../css/AddEmployee.css';

const Addemployee = ({ close }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    joinedDate: '',
    salary: '',
    role: '',
    email: '',
    phone: '',
    address: '',
    resume: null,
    joiningLetter: null,
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    departmentId: '',
    designation: '',
    profilePicture: null,
    password: '',
    basicInfo: '',
    nationality: '',
    religion: '',
    maritalStatus: '',
    emergencyContact: '',
    passportNo: '',
    panNo: '',
    fromDate: '',
    toDate: ''
  });

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      joinedDate: '',
      salary: '',
      role: '',
      email: '',
      phone: '',
      address: '',
      resume: null,
      joiningLetter: null,
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      departmentId: '',
      designation: '',
      profilePicture: null,
      password: '',
      basicInfo: '',
      nationality: '',
      religion: '',
      maritalStatus: '',
      emergencyContact: '',
      passportNo: '',
      panNo: '',
      fromDate: '',
      toDate: ''
    });
    setDob(null);
    setJoinedDate(null);
    setStartDate(null);
    setEndDate(null);
    setSkills([]);
    setSelectedImage(null);
    setUploadMessage('upload');
    setIsEmailVerified(false);
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('upload');
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [joinedDate, setJoinedDate] = useState(null);
  const [officeConfig, setOfficeConfig] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [dob, setDob] = useState(null);
  const [errors, setErrors] = useState('');

  const { id } = useParams();

  const userRole = user.role;
  // console.log(id);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${serverUrl.apiUrl}api/employee/getsingleemployee/${id}`);
        const employees = response.data;
        const employee = employees.find((emp) => emp._id === id);
        const employeeSkills = employee.skills.map((skill, index) => ({
          id: index,
          text: skill
        }));
        setSkills(employeeSkills || []);

        const dob = employee.dob ? new Date(employee.dob) : null;
        setDob(dob);

        const joinedDate = employee.joinedDate ? new Date(employee.joinedDate) : null;
        setJoinedDate(joinedDate);

        setFormData({
          name: employee.name || '',
          email: employee.email || '',
          password: employee.password || '',
          id: employee.id || '',
          phone: employee.phone || '',
          address: employee.address || '',
          accountNumber: employee.accountNumber || '',
          ifscCode: employee.ifscCode || '',
          bankName: employee.bankName || '',
          departmentId: employee.departmentId || '',
          designation: employee.designation || '',
          profilePicture: employee.profilePicture || '',
          salary: employee.salary || '',
          role: employee.role || '',
          resume: employee.resume || '',
          joiningLetter: employee.joiningLetter || '',
          basicInfo: employee.basicInfo || '',
          nationality: employee.nationality || '',
          religion: employee.religion || '',
          maritalStatus: employee.maritalStatus || '',
          emergencyContact: employee.emergencyContact || '',
          passportNo: employee.passportNo || '',
          panNo: employee.panNo || '',
          fromDate: employee.fromDate || '',
          toDate: employee.toDate || '',
          skills: employee.skills || []

          // ... other fields
        });
      } catch (error) {
        console.error('Error fetching employee:', error.response ? error.response.data : error.message);
      } finally {
        // console.log('Employee fetched successfully!');
      }
    };

    fetchEmployee();
  }, [id]);

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${ServerUrl.apiUrl}api/config`);
        setOfficeConfig(response.data);
        setDepartments(response.data.departments || []);
      } catch (error) {
        console.error('Error fetching office configuration:', error);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const addSkill = () => {
    const newSkill = prompt('Enter a new skill:');
    if (newSkill) {
      setSkills([...skills, { id: Date.now(), text: newSkill }]);
    }
  };

  const removeSkill = (id) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentSkill.trim() !== '') {
      setSkills([...skills, { text: currentSkill.trim() }]);
      setCurrentSkill('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // Validate required fields
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const data = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (key !== 'profilePicture') {
        data.append(key, formData[key]);
      }
    });

    // Append file uploads
    if (formData.profilePicture) {
      data.append('profilePicture', formData.profilePicture);
    }

    // Append skills as JSON string
    data.append('skills', JSON.stringify(skills.map((skill) => skill.text)));

    // Create and append experience
    const experience = [
      {
        companyName: formData.companyName,
        fromDate: formData.fromDate,
        toDate: formData.toDate
      }
    ];
    data.append('experience', JSON.stringify(experience));

    try {
      const response = await fetch(`${serverUrl.apiUrl}api/employee/registeremployee`, {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        alert('Employee data saved successfully!');
      } else {
        const errorData = await response.json();
        console.error(errorData);
        alert('Error saving employee data: ' + errorData.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error saving employee data: ' + error.message);
    }
  };

  const uploadFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadMessage('File size should be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setUploadMessage('Only JPEG and PNG files are allowed');
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      setFormData((prevData) => ({ ...prevData, profilePicture: file }));
      setUploadMessage('Image uploaded successfully');
    }
  };

  const verifyEmail = async () => {
    // Implement your email verification logic here

    setTimeout(() => {
      setIsEmailVerified(true);
    }, 1500);
  };

  // Generate employee ID on component mount
  useEffect(() => {
    const generateEmployeeId = () => {
      const randomNumber = Math.floor(100 + Math.random() * 900); // Generate 3 random digits
      const employeeId = `PXB-${randomNumber}`;
      setFormData((prevData) => ({ ...prevData, id: employeeId }));
    };
    generateEmployeeId();
  }, []);

  return (
    <>
      <div className="addEmployee">
        <form className="addEmployee-form" onSubmit={handleSubmit}>
          <div className="addEmployee-fields">
            <div className="addEmployee-firstFields">
              <div className="addEmployee-upperField">
                <label htmlFor="" className="addEmployee-label1">
                  Profile Picture
                </label>
                <div className="addEmployee-profilepic-upload">
                  <h6 className="addEmployee-text4">We Support only JPEG and PNG under 5MB</h6>
                  <div className="addEmployee-file">
                    {selectedImage ? <img src={selectedImage} alt="Selected" className="addEmployee-file-img" /> : <img src={ServerUrl.apiUrl + formData.profilePicture} alt="Current" className="addEmployee-file-img" />}
                    <div className="addEmployee-file-upload" onClick={handleFileUploadClick}>
                      <input ref={fileInputRef} id="fileInput" type="file" accept=".jpg,.jpeg,.png" style={{ display: 'none' }} onChange={uploadFileChange} />
                      <label htmlFor="" className="addEmployee-upload-icon">
                        <UploadIcon />
                        <h4 className="addEmployee-text5">{uploadMessage}</h4>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="addEmployee-upperField">
                <label htmlFor="" className="addEmployee-label1">
                  Basic Info
                </label>
                <textarea className="addEmployee-basic-info" placeholder="Enter basic information" name="basicInfo" onChange={handleChange} value={formData.basicInfo}></textarea>
              </div>
            </div>

            <div className="addEmployee-secondFields">
              <div className="addEmployee-input-div">
                <label htmlFor="name" className="addEmployee-label2">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input type="text" className={`addEmployee-input ${errors.name ? 'error-border' : ''}`} placeholder="Enter full name" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="addEmployee-input-div">
                <label htmlFor="" className="addEmployee-label2">
                  Email <span className="text-danger">*</span>
                </label>
                <div className="addEmployee-verification">
                  <input type="Email" className={`addEmployee-input2 ${errors.email ? 'error-border' : ''}`} id="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} required disabled={userRole !== 'Admin' && userRole !== 'HR'} />
                  {/* {isEmailVerified ? (
                    <h5 className="addEmployee-verifyText m-0">Verified</h5>
                  ) : (
                    <h5 className="addEmployee-verifyText verify m-0 " onClick={verifyEmail}>
                      Verify Email
                    </h5>
                  )} */}
                </div>
              </div>
            </div>

            <div className="addEmployee-secondFields">
              <div className="addEmployee-input-div">
                <label htmlFor="name" className="addEmployee-label2">
                  Employee Id <span className="text-danger">*</span>
                </label>
                <input type="text" className="addEmployee-input" placeholder="Enter Employee ID" id="id" name="id" value={formData.id} onChange={handleChange} required disabled={userRole !== 'Admin' && userRole !== 'HR'} />
              </div>
              <div className="addEmployee-input-div">
                <label htmlFor="name" className="addEmployee-label2">
                  Department <span className="text-danger">*</span>
                </label>
                <select className={`addEmployee-input-select ${errors.departmentId ? 'error-border' : ''}`} id="departmentId" name="departmentId" value={formData.departmentId} onChange={handleChange} required disabled={userRole !== 'Admin' && userRole !== 'HR'}>
                  <option value="" disabled>
                    Select Department
                  </option>
                  {departments &&
                    departments.length > 0 &&
                    departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="addEmployee-secondFields">
              <div className="addEmployee-input-div">
                <label htmlFor="salary" className="addEmployee-label2">
                  Salary
                </label>
                <input
                  type="number"
                  className="addEmployee-input"
                  placeholder="Enter Salary"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  // Notice there's no "required" attribute here.
                  disabled={userRole !== 'Admin' && userRole !== 'HR'}
                />
              </div>
              <div className="addEmployee-input-div">
                <label htmlFor="name" className="addEmployee-label2">
                  Role <span className="text-danger">*</span>
                </label>
                <select type="text" className={`addEmployee-input-select ${errors.role ? 'error-border' : ''}`} placeholder="Enter Employee ID" id="role" name="role" value={formData.role} onChange={handleChange} required disabled={userRole !== 'Admin' && userRole !== 'HR'}>
                  <option disabled value="">
                    Select Role
                  </option>
                  <option value="Admin">Admin</option>
                  <option value="HR">HR</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                  <option value="Intern">Intern</option>
                  <option value="Trainee">Trainee</option>
                </select>
              </div>
            </div>

            <div className="addEmployee-secondFields">
              <div className="addEmployee-input-div">
                <label htmlFor="name" className="addEmployee-label2">
                  Designation
                </label>
                <input type="text" className="addEmployee-input" placeholder="Enter designation" id="designation" name="designation" value={formData.designation} onChange={handleChange} disabled={userRole !== 'Admin' && userRole !== 'HR'} />
              </div>
            </div>

            <div className="addEmployee-secondFields">
              <div className="addEmployee-input-div">
                <label htmlFor="" className="addEmployee-label2">
                  Password <span className="text-danger">*</span>
                </label>
                <input type="text" className={`addEmployee-input ${errors.passsword ? 'error-border' : ''}`} id="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required disabled={userRole !== 'Admin' && userRole !== 'HR'} />
              </div>
              <div className="addEmployee-input-div">
                <label htmlFor="" className="addEmployee-label2">
                  Joined Date
                </label>
                <div className={`addEmployee-verification`}>
                  {/* <input type="text" className={`addEmployee-input ${errors.passsword ? 'error-border' : ''}`}  placeholder="Enter Date of Joining -->"  disabled /> */}
                  <input
                    type="date"
                    value={joinedDate ? format(joinedDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setJoinedDate(date);
                      setFormData((prevData) => ({ ...prevData, joinedDate: format(date, 'yyyy-MM-dd') }));
                    }}
                    placeholder="Pick Date"
                    className="addEmployee-input2"
                    id="joinedDate"
                    name="joinedDate"
                    disabled={userRole !== 'Admin' && userRole !== 'HR'}
                  />
                  <CalenderIcon className="addEmployee-calender-icon" />
                </div>
              </div>
            </div>

            <div className="addEmployee-skills-fields">
              <label htmlFor="" className="addEmployee-label1">
                Skills
              </label>
              <div className="addEmployee-skills-upload">
                {skills.map((skill, index) => (
                  <div key={skill.id} className="addEmployee-skill">
                    <h3 className="addEmployee-skill-text m-0">{skill.text}</h3>
                    <RemoveIcon className="addEmployee-remove-icon" onClick={() => removeSkill(skill.id)} />
                  </div>
                ))}
                <div className="addEmployee-skill1" onClick={addSkill}>
                  <PlusIcon />
                </div>
              </div>
            </div>

            <div className="addEmployee-personal-info">
              <label htmlFor="" className="addEmployee-label1">
                Personal Information
              </label>

              <div className="addEmployee-personal-info-box">
                <div className="addEmployee-input-left">
                  <label className="addEmployee-label3">Information</label>
                  <div className="addEmployee-input-div">
                    <label htmlFor="" className="addEmployee-label2">
                      D.O.B.
                    </label>
                    <div className={`addEmployee-verification`}>
                      {/* <input type="text" className={`addEmployee-input ${errors.passsword ? 'error-border' : ''}`}  placeholder="Enter DOB -->"  disabled /> */}
                      <input
                        type="date"
                        value={dob ? format(dob, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          setDob(date);
                          setFormData((prevData) => ({ ...prevData, dob: format(date, 'yyyy-MM-dd') }));
                        }}
                        placeholder="Pick Date"
                        className="addEmployee-input2"
                        id="dob"
                        name="dob"
                      />

                      <CalenderIcon className="addEmployee-calender-icon" />
                    </div>
                  </div>

                  <div className="addEmployee-input-div addEmployee-secondFields">
                    <label htmlFor="" className="addEmployee-label2">
                      Address
                    </label>
                    <input type="text" className="addEmployee-input" id="address" name="address" placeholder="Enter address" value={formData.address} onChange={handleChange} />
                  </div>
                  <div className="addEmployee-input-div addEmployee-secondFields">
                    <label htmlFor="" className="addEmployee-label2">
                      Phone No.
                    </label>
                    <input type="text" className="addEmployee-input" id="phone" name="phone" placeholder="Enter Phone" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="addEmployee-input-div addEmployee-secondFields">
                    <label htmlFor="" className="addEmployee-label2">
                      Nationality:
                    </label>
                    <input type="text" className="addEmployee-input" name="nationality" placeholder="Your nationality" value={formData.nationality} onChange={handleChange} />
                  </div>
                  <div className="addEmployee-input-div addEmployee-secondFields">
                    <label htmlFor="" className="addEmployee-label2">
                      Religion:
                    </label>
                    <input type="text" className="addEmployee-input" name="religion" placeholder="Your religion" value={formData.religion} onChange={handleChange}></input>
                  </div>
                  <div className="addEmployee-input-div addEmployee-secondFields">
                    <label htmlFor="" className="addEmployee-label2">
                      Marital Status:
                    </label>
                    <input type="text" className="addEmployee-input" name="maritalStatus" placeholder="Enter marital status" value={formData.maritalStatus} onChange={handleChange} />
                  </div>

                  <div className="addEmployee-input-div addEmployee-secondFields">
                    <label htmlFor="" className="addEmployee-label2">
                      Emergency Contact
                    </label>
                    <input type="text" className="addEmployee-input" name="emergencyContact" placeholder="Emergency contact number" value={formData.emergencyContact} onChange={handleChange} />
                  </div>
                </div>

                <div className="addEmployee-input-left">
                  <label className="addEmployee-label3">Bank Information</label>
                  <div className="addEmployee-input-div addEmployee-secondFields">
                    <label htmlFor="" className="addEmployee-label2">
                      Bank Name:
                    </label>
                    <input type="text" className="addEmployee-input" name="bankName" placeholder="Enter bank name" value={formData.bankName} onChange={handleChange} />
                  </div>
                  <div className="addEmployee-input-div addEmployee-secondFields">
                    <label htmlFor="" className="addEmployee-label2">
                      Account No.:
                    </label>
                    <input type="text" className="addEmployee-input" name="accountNumber" placeholder="Enter account number" value={formData.accountNumber} onChange={handleChange} />
                  </div>

                  <div className="addEmployee-input-div addEmployee-secondFields">
                    <label htmlFor="" className="addEmployee-label2">
                      IFSC Code:
                    </label>
                    <input type="text" className="addEmployee-input" name="ifscCode" placeholder="Enter IFSC code" value={formData.ifscCode} onChange={handleChange} />
                  </div>
                  <div className="addEmployee-input-div addEmployee-secondFields">
                    <label htmlFor="" className="addEmployee-label2">
                      Passport No.
                    </label>
                    <input type="text" className="addEmployee-input" name="passportNo" placeholder="Passport number" value={formData.passportNo} onChange={handleChange} />
                  </div>
                  <div className="addEmployee-input-div addEmployee-secondFields">
                    <label htmlFor="" className="addEmployee-label2">
                      UPI Id:
                    </label>
                    <input type="text" className="addEmployee-input" name="panNo" placeholder="UPI Id" value={formData.panNo} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            <div className="addEmployee-personal-info">
              <label htmlFor="" className="addEmployee-label1">
                Experience
              </label>
              <div className="addEmployee-input-div addEmployee-secondFields">
                <label htmlFor="" className="addEmployee-label2">
                  Company Name
                </label>
                <input type="text" className="addEmployee-input" name="companyName" placeholder="Enter Company Name " value={formData.companyName} onChange={handleChange} />

                <div className="addEmployee-experience-years">
                  <div className="addEmployee-experience-dates">
                    <div className="addEmployee-date ">
                      <input
                        type="date"
                        value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          setStartDate(date);
                          setFormData((prevData) => ({ ...prevData, fromDate: format(date, 'yyyy-MM-dd') }));
                        }}
                        placeholder="Start Date"
                        className="addEmployee-input2"
                        id="fromDate"
                        name="fromDate"
                      />

                      <CalenderIcon />
                    </div>
                    <div>-</div>
                    <div className="addEmployee-date">
                      <input
                        type="date"
                        value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          setEndDate(date);
                          setFormData((prevData) => ({ ...prevData, toDate: format(date, 'yyyy-MM-dd') }));
                        }}
                        min={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                        placeholder="End Date"
                        className="addEmployee-input2"
                        id="toDate"
                        name="toDate"
                      />

                      <CalenderIcon />
                    </div>
                  </div>
                  <div className="addEmployee-add-button">
                    <Plus2Icon />
                    <h6 className="employee-button-text color1 m-0">Add</h6>
                  </div>
                </div>
              </div>
            </div>

            <div className="addEmployee-buttons">
              <button type="submit" className="addEmployee-button-save">
                Save
              </button>
              <button onClick={resetForm} className="addEmployee-button-cancel">
                Reset
              </button>
            </div>

            <div></div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Addemployee;

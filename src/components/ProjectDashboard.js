import React, { useState, useEffect } from "react";
import serverUrl from "../config/config";
import AddTask from "../pages/AddTask";
import close from "../assets/close_small.svg";
import UploadIcon from "../assets/Upload (1).svg";
import axios from "axios";
import close2 from "../assets/close_small22.svg";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = (projectId) => {
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // New state for popup visibility
  const [selectedEmployee, setSelectedEmployee] = useState(null); // State for storing selected employee
  const [isAttachmentPopupOpen, setIsAttachmentPopupOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const [projectDetails, setProjectDetails] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);
  const [notificationDate, setNotificationDate] = useState("");
  const [selectedAttatchments, setselectedAttatchments] = useState("");

  const [notificationTime, setNotificationTime] = useState("");
  const [notifications, setNotifications] = useState([]); // St
  const [notificationMessage, setNotificationMessage] = useState("");
  const [status, setStatus] = useState(
    projectDetails ? projectDetails.status : "ToDo"
  );

  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  const [teamMemberProfileImages, setTeamMemberProfileImages] = useState({});

  const project = projectId.projectId.ProjectId;
  // console.log(project);
  const [date, setDate] = useState(getCurrentDate());
  const [currentTime, setcurrentTime] = useState(getCurrentTime());

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const handleNotificationSave = async () => {
    // 1. Construct the notification object
    const newNotification = {
      date: date,
      time: currentTime,
      message: notificationMessage,
      createdAt: new Date(),
      projectId: project,
    };
    // console.log(projectId.projectId.ProjectId);

    // 2. Send the notification to your backend API
    try {
      const response = await axios.post(
        `${serverUrl.apiUrl}api/projects/${projectId.projectId.ProjectId}/notifications`, // Replace with your actual API endpoint
        newNotification,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Notification saved successfully!");
      // 3. Update the notifications state
      setAllNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);
      setDisplayedNotifications((prevNotifications) =>
        [...prevNotifications, newNotification].slice(0, 5)
      ); // Display only the latest 5

      // 4. Close the notification popup
      handleNotificationPopupClose();

      // 5. Clear the input fields
      setNotificationDate("");
      setNotificationTime("");
      setNotificationMessage("");
    } catch (error) {
      toast.error("Error saving notification:", error);
      console.error("Error saving notification:", error);
    }
  };
  // Function to open the notification popup
  const handleNotificationPopupOpen = () => {
    setIsNotificationPopupOpen(true);
  };

  // Function to close the notification popup
  const handleNotificationPopupClose = () => {
    setIsNotificationPopupOpen(false);
  };

  // Function to handle changes in notification date input
  const handleNotificationDateChange = (event) => {
    setNotificationDate(event.target.value);
  };

  // Function to handle changes in notification time input
  const handleNotificationTimeChange = (event) => {
    setNotificationTime(event.target.value);
  };
  const handleNotificationMessageChange = (event) => {
    setNotificationMessage(event.target.value);
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await axios.delete(
          `${serverUrl.apiUrl}api/projects/${projectId.projectId.ProjectId}`
        );
        if (response.status === 200) {
          toast.success("Project deleted successfully");
          setTimeout(() => {
            navigate("/viewprojects");
          }, 2000);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project");
      }
    }
  };

  // console.log(project);
  useEffect(() => {
    const fetchRecentTasks = async () => {
      // console.log(`Fetching tasks for projectId: ${project}`);
      try {
        const response = await axios.get(
          ` ${serverUrl.apiUrl}api/tasks/project/${project}`
        );

        // console.log('API Response:', response.data);
        setRecentTasks(response.data);

        // Log the task names after fetching
        // console.log(
        //   'Fetched recent tasks:',
        //   response.data.map((task) => task.name)
        // );
      } catch (error) {
        console.error("Error fetching recent tasks:", error);
      }
    };

    fetchRecentTasks();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${serverUrl.apiUrl}api/projects/${project}/notifications`
        );
        const sortedNotifications = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllNotifications(sortedNotifications);
        setDisplayedNotifications(sortedNotifications.slice(0, 5)); // Display only the latest 5
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [project]);

  // console.log(displayedNotifications);

  useEffect(() => {
    // ... existing useEffect logic ...

    // Load teamMemberProfileImages from local storage
    const storedImages = localStorage.getItem("teamMemberProfileImages");
    if (storedImages) {
      setTeamMemberProfileImages(JSON.parse(storedImages));
    }
  }, []);

  const handleNewTaskAdded = (newTaskName) => {
    setRecentTasks([...recentTasks, newTaskName]);
  };

  const storageKey = `selectedTeamMembers_${projectId.projectId.ProjectId}`;

  const [data, setData] = useState(null);

  // console.log(projectId);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(
        `${serverUrl.apiUrl}api/projects/${projectId.projectId.ProjectId}`
      );
      setProjectDetails(response.data);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };
  const fetchTeamMemberProfileImages = async (teamMembers) => {
    const updatedProfileImages = { ...teamMemberProfileImages };

    for (const member of teamMembers) {
      try {
        const employeeResponse = await fetch(
          `${serverUrl.apiUrl}api/employee/getsingleemployee/${member}`
        );

        console.log(employeeResponse);

        if (employeeResponse.ok) {
          const employeeData = await employeeResponse.json();
          console.log(employeeData);

          // Find the employee with the matching ID in the fetched data
          const employee = employeeData.find((emp) => emp._id === member);
          console.log(employee);

          if (employee) {
            updatedProfileImages[
              member
            ] = `${serverUrl.apiUrl}${employee.profilePicture}`;
            console.log(updatedProfileImages);
          } else {
            console.warn(
              `Employee with ID ${member} not found in API response.`
            );
          }
        }
      } catch (error) {
        console.error(`Error fetching profile image for ${member}:`, error);
      }
    }

    return updatedProfileImages; // Return the updated object
  };
  useEffect(() => {
    const fetchImages = async () => {
      const updatedImages = await fetchTeamMemberProfileImages(
        selectedTeamMembers
      );
      setTeamMemberProfileImages(updatedImages); // Update the state
    };
    fetchImages();
  }, [selectedTeamMembers]);

  useEffect(() => {
    if (selectedTeamMembers.length > 0) {
      fetchTeamMemberProfileImages(selectedTeamMembers);
    }
  }, [selectedTeamMembers]);
  useEffect(() => {
    projectId.setstaus(" ");
    projectId.setHeading("Project Dashboard");
  }, []);
  useEffect(() => {
    fetchProjectDetails();
  }, [projectId.projectId.ProjectId]);
  useEffect(() => {
    fetchEmployees();
    fetchAttachments();
    // Load selected team members from localStorage
    const savedMembers = localStorage.getItem(storageKey);
    if (savedMembers) {
      setSelectedTeamMembers(JSON.parse(savedMembers));
    }
  }, [projectId.projectId.ProjectId]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        `${serverUrl.apiUrl}api/employee/getemployees`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        // Update the employees state with profile picture URLs
        const updatedEmployees = data.map((employee) => ({
          ...employee,
          profilePicture: `${serverUrl.apiUrl}${employee.profilePicture}`, // Assuming your API returns the profile picture relative to the upload URL
        }));
        setEmployees(updatedEmployees);
      } else {
        console.error("Expected an array from API");
        setEmployees([]);
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleStatusClick = () => {
    const statusOptions = ["TODO", "INPROGRESS", "COMPLETED"];
    const currentStatusIndex = statusOptions.indexOf(status);
    const nextStatusIndex = (currentStatusIndex + 1) % statusOptions.length;
    const newStatus = statusOptions[nextStatusIndex];

    setStatus(newStatus);

    handleStatusSave(newStatus);
  };

  const addTeamMember = () => {
    if (Array.isArray(employees) && employees.length > 0) {
      const nextMember =
        employees[selectedTeamMembers.length % employees.length];
      if (nextMember && nextMember.name) {
        setSelectedTeamMembers((prevMembers) => {
          const updatedMembers = [...prevMembers, nextMember.name];
          // Save to localStorage
          localStorage.setItem(storageKey, JSON.stringify(updatedMembers));
          return updatedMembers;
        });
      } else {
        console.error("Selected member is undefined or missing name");
      }
    } else {
      console.error("Employees array is empty or undefined");
    }
  };

  const handleAttachmentRemove = async (index) => {
    try {
      const response = await fetch(
        `${serverUrl.apiUrl}api/projects/${projectId.projectId.ProjectId}/files/${index}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove attachment");
      }

      const updatedProject = await response.json();
      setAttachments(updatedProject.attachments); // Update local state
      localStorage.setItem(
        `selectedAttatchments_${projectId.projectId.ProjectId}`,
        JSON.stringify(updatedProject.attachments)
      );
    } catch (error) {
      console.error("Error removing attachment:", error);
    }
  };

  const handleTeamMemberRemove = async (index) => {
    try {
      const teamMemberName = selectedTeamMembers[index];
      const updatedTeamMembers = selectedTeamMembers.filter(
        (_, i) => i !== index
      );

      const response = await fetch(
        `${serverUrl.apiUrl}api/projects/${projectId.projectId.ProjectId}/teamMembers`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teamMembers: updatedTeamMembers }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove team member");
      }

      setSelectedTeamMembers(updatedTeamMembers);
      localStorage.setItem(
        `selectedTeamMembers_${projectId.projectId.ProjectId}`,
        JSON.stringify(updatedTeamMembers)
      );
    } catch (error) {
      console.error("Error removing team member:", error);
    }
  };

  const handleStatusSave = async (newStatus) => {
    if (projectDetails) {
      try {
        await axios.put(
          `${serverUrl.apiUrl}api/projects/${projectId.projectId.ProjectId}/status`,
          { status: newStatus }
        );
        setProjectDetails((prevDetails) => ({
          ...prevDetails,
          status: newStatus,
        }));
        toast.success("Status Updated successfully!");
        // setIsStatusPopupOpen(false);
      } catch (error) {
        toast.error("Failed to Update Status.");
        // console.error(error);
      }
    }
  };

  const handlePopupOpen = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleEmployeeSelect = (event) => {
    const selectedEmployeeId = event.target.value;
    setSelectedEmployee(selectedEmployeeId);
  };
  const handleSave = async () => {
    if (selectedEmployee) {
      const updatedTeamMembers = [...selectedTeamMembers, selectedEmployee];

      try {
        const response = await fetch(
          `${serverUrl.apiUrl}api/projects/${projectId.projectId.ProjectId}/teamMembers`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ teamMembers: updatedTeamMembers }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update team members");
        }

        const updatedProject = await response.json();
        console.log("Updated project:", updatedProject);

        setSelectedTeamMembers(updatedTeamMembers);
        setSelectedEmployee(""); // Reset selected employee
        setIsPopupOpen(false);

        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify(updatedTeamMembers));

        // Fetch profile images for new team members
        updatedTeamMembers.forEach(async (member) => {
          console.log(`Fetching profile image for ${member}`);
          try {
            const employeeResponse = await fetch(
              `${serverUrl.apiUrl}api/employee/getsingleemployee/${member}`
            );
            console.log("Employee response:", employeeResponse);
            if (employeeResponse.ok) {
              const employeeData = await employeeResponse.json();
              console.log("Employee data:", employeeData);
              setTeamMemberProfileImages((prevImages) => ({
                ...prevImages,
                [member]: `${serverUrl.apiUrl}${employeeData.profilePicture}`, // Use 'profilePicture' here
              }));
            }
          } catch (error) {
            console.error("Error fetching employee profile image:", error);
          }
        });
        console.log("teamMemberProfileImages:", teamMemberProfileImages);
        // Save teamMemberProfileImages to local storage AFTER the loop
        localStorage.setItem(
          "teamMemberProfileImages",
          JSON.stringify(teamMemberProfileImages)
        );
      } catch (error) {
        console.error("Error updating team members:", error);
      }
    }
  };

  const handleAttachmentPopupOpen = () => {
    setIsAttachmentPopupOpen(true);
  };

  const handleAttachmentPopupClose = () => {
    setIsAttachmentPopupOpen(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile([...event.target.files]);
  };

  const fetchAttachments = async () => {
    try {
      const response = await fetch(
        `${serverUrl.apiUrl}api/projects/${projectId.projectId.ProjectId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch project details");
      }
      const projectData = await response.json();
      setAttachments(projectData.attachments || []);
      // Also update other project details as needed
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleAttachmentSave = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("attachment", selectedFile[0]);
      console.log(formData);
      try {
        const response = await fetch(
          `${serverUrl.apiUrl}api/projects/${projectId.projectId.ProjectId}/attachments`,
          {
            method: "PATCH",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload attachment");
        }

        const updatedProject = await response.json();
        console.log("Updated project with attachment:", updatedProject);
        setAttachments(updatedProject.attachments); // Update local state
        handleAttachmentPopupClose();
      } catch (error) {
        console.error("Error uploading attachment:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const filteremployee = employees.filter((e) => {
    return e._id === projectDetails?.reportingTo;
  });
  //  console.log("maneger name",filteremployee)

  return (
    <div className="project-dashboard container-fluid">
      <div className="row project-dash-sec1-cnt">
        <div className="col-md-6 project-dash-sec1">
          <div className="project-dash-head-cnt w-100 d-flex align-items-start justify-content-between">
            <div className="d-flex align-items-start project-dash-title">
              <div className="project-dash-profile">
                <div
                  className="card-pic"
                  style={{
                    backgroundColor: `#${Math.floor(
                      Math.random() * 16777215
                    ).toString(16)}`,
                  }}
                >
                  {projectDetails ? projectDetails.projectName.charAt(0) : "L"}
                </div>
              </div>{" "}
              <div className="d-flex flex-column gap-1 ">
                <h3 className="project-dash-name m-0">
                  {projectDetails ? projectDetails.projectName : "Loading..."}
                </h3>
                <h6 className="project-dash-id m-0">
                  Project Id: {projectId.projectId.ProjectId}
                </h6>
              </div>
            </div>
            <button
              className={`project-status-completed rightside-head-btn-${
                projectDetails ? projectDetails.status.toLowerCase() : ""
              }`} // Add class based on status
              onClick={handleStatusClick}
            >
              {projectDetails
                ? projectDetails.status == "TODO"
                  ? "To Do"
                  : projectDetails.status == "INPROGRESS"
                  ? "In Progress"
                  : projectDetails.status == "COMPLETED"
                  ? "Done"
                  : "Loading..."
                : "Loading..."}{" "}
            </button>{" "}
          </div>

          <div className="container-fluid project-dash-details-cnt p-0">
            <div className="project-dash-details ">
              <div className="project-dash-detail-card">
                <h3 className="dash-detail-title m-0">Deadline Date:</h3>
                <h5 className="dash-detail-value m-0">
                  {projectDetails
                    ? new Date(projectDetails.endDate).toLocaleDateString()
                    : "Loading..."}
                </h5>
              </div>
              <div className="project-dash-detail-card">
                <h3 className="dash-detail-title m-0">Client:</h3>
                <h5 className="dash-detail-value m-0">
                  {projectDetails ? projectDetails.clientName : "Loading..."}
                </h5>
              </div>
              <div className="project-dash-detail-card">
                <h3 className="dash-detail-title m-0">Reporting To:</h3>
                <h5 className="dash-detail-value m-0">
                  {filteremployee ? filteremployee[0]?.name : "Loading..."}
                </h5>{" "}
              </div>
            </div>
          </div>
          <button
            className="project-dash-detail-card"
            onClick={handleDeleteProject}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.4607 2.73147V3.2889H8.04045V2.73147C8.04045 2.39688 8.30069 2.13665 8.63528 2.13665H10.8659C11.2005 2.13665 11.4607 2.39688 11.4607 2.73147ZM6.99951 2.73147V3.2889H2.5V4.4042H3.65618L4.65667 17.2676C4.73102 18.1599 5.51172 18.9034 6.40396 18.9034H13.0957C13.988 18.9034 14.7687 18.197 14.843 17.2676L15.8435 4.4042H16.9988V3.2889H12.5016V2.73147C12.5016 1.83923 11.7581 1.0957 10.8659 1.0957H8.63528C7.74304 1.0957 6.99951 1.83923 6.99951 2.73147ZM14.7224 4.4042H4.77725L5.77196 17.1933C5.80914 17.5279 6.10655 17.7881 6.40396 17.7881H13.0957C13.4303 17.7881 13.7277 17.4907 13.7277 17.1933L14.7224 4.4042ZM8.07737 6.63444H6.96208V15.5568H8.07737V6.63444ZM10.3072 6.63444H9.19189V15.5568H10.3072V6.63444ZM11.4225 6.63444H12.5378V15.5568H11.4225V6.63444Z"
                fill="#B02A37"
              ></path>
            </svg>{" "}
          </button>

          {isNotificationPopupOpen && (
            <div
              className="popup-overlay"
              onClick={handleNotificationPopupClose}
            >
              <div
                className="popup-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="flex-img-h3">
                  Create Notification
                  <img onClick={handleNotificationPopupClose} src={close} />
                </h3>
                <div className="mb-3">
                  <label htmlFor="notificationDate" className="form-label">
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="notificationDate"
                    value={date}
                    onChange={handleNotificationDateChange}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="notificationTime" className="form-label">
                    Time
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    id="notificationTime"
                    value={currentTime}
                    onChange={handleNotificationTimeChange}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="notificationMessage" className="form-label">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="notificationMessage"
                    value={notificationMessage}
                    onChange={handleNotificationMessageChange}
                  />
                </div>
                <div className="savcanbtn newsavebtn">
                  <div className="dash-btn">
                    <button className="save" onClick={handleNotificationSave}>
                      Save
                    </button>
                    <button
                      className="cancel"
                      onClick={handleNotificationPopupClose}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-md-6 project-dash-sec1">
          <div className="project-dash-pills w-100">
            {attachments.map((attachment, index) => (
              <div key={index} className="project-add-pills">
                <a
                  href={`${serverUrl.apiUrl}${attachment}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginRight: "10px",
                  }}
                >
                  {`file${index + 1}`}

                  {/* This will display the filename */}
                </a>
                <button
                  className="close-button1"
                  onClick={() => handleAttachmentRemove(index)}
                >
                  {" "}
                  &times;
                </button>
              </div>
            ))}
            <button
              className="project-add-pills"
              onClick={handleAttachmentPopupOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10.8334 10.8332V15.8332H9.16675V10.8332H4.16675V9.1665H9.16675V4.1665H10.8334V9.1665H15.8334V10.8332H10.8334Z"
                  fill="#495057"
                />
              </svg>
            </button>
          </div>

          {isAttachmentPopupOpen && (
            <div className="popup-overlay" onClick={handleAttachmentPopupClose}>
              <div
                className="popup-content dash-flex"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="flex-img-h3">
                  Add Attachment
                  <img onClick={handleAttachmentPopupClose} src={close} />
                </h3>
                <div className="dash-file">
                  <p>
                    {" "}
                    <div
                      className="upload-icon attachment-wrapper"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      <img src={UploadIcon} alt="Upload Icon" />
                      Drop File To Atach{" "}
                    </div>
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="fileInput"
                  />
                  <div className="new-no-file">
                    {selectedFile.length > 0 ? (
                      selectedFile.map((file, index) => (
                        <div key={index} className="file-item">
                          <p>
                            File {index + 1}: {file.name}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No files attached</p>
                    )}
                  </div>
                </div>
                <div className="savcanbtn newsavebtn">
                  <div className="dash-btn">
                    <button className="save" onClick={handleAttachmentSave}>
                      Save
                    </button>
                    <button
                      className="cancel"
                      onClick={handleAttachmentPopupClose}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="project-dash-pills w-100">
            {selectedTeamMembers.map((member, index) => (
              <div key={index} className="project-add-pills">
                {teamMemberProfileImages[member] ? (
                  <img
                    src={teamMemberProfileImages[member]} // Use the fetched image URL
                    alt={member}
                    className="team-member-profile-image"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                    }}
                    title={member}
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/50"
                    alt={member}
                    className="team-member-profile-image"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
                    title={member}
                  />
                )}
                <button
                  className="close-button1"
                  onClick={() => handleTeamMemberRemove(index)}
                >
                  &times;
                </button>
              </div>
            ))}
            <button className="project-add-pills" onClick={handlePopupOpen}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10.8334 10.8332V15.8332H9.16675V10.8332H4.16675V9.1665H9.16675V4.1665H10.8334V9.1665H15.8334V10.8332H10.8334Z"
                  fill="#495057"
                />
              </svg>
            </button>
          </div>
        </div>
        {isPopupOpen && (
          <div className="popup-overlay" onClick={handlePopupClose}>
            <div
              className="popup-content dash-flex"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-button" onClick={handlePopupClose}>
                {/* You can add an 'x' or a close icon here */}
              </button>
              <h3 className="flex-img-h3">
                Add Team Member
                <img onClick={handlePopupClose} src={close2} />
              </h3>
              <select
                className="select-dash"
                onChange={handleEmployeeSelect}
                value={selectedEmployee}
              >
                <option value="">Select an employee</option>
                {employees.map((employee, index) => (
                  <option key={index} value={employee._id}>
                    {teamMemberProfileImages[employee._id] ? (
                      <img
                        src={teamMemberProfileImages[employee._id]}
                        alt={employee.name}
                        className="employee-profile-image"
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <span className="profile-placeholder">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M10 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                            fill="#495057"
                          />
                        </svg>
                      </span>
                    )}
                    {employee.name}
                  </option>
                ))}
              </select>

              <div className="savcanbtn newsavebtn">
                <div className="dash-btn">
                  <button className="save" onClick={handleSave}>
                    Save
                  </button>
                  <button className="cancel" onClick={handlePopupClose}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="row project-row-container">
        <div className="col-md-6 recent-tasks-container">
          <div className="recent-tasks">
            <h3>Recent tasks</h3>

            <div className="recent-tasks-list">
              <ul
                className="list-unstyled"
                style={{
                  gap: "10px", // corrected property name
                }}
              >
                {recentTasks.map((task, index) => (
                  <li
                    key={index}
                    style={{
                      paddingLeft: "1px",
                      display: "-webkit-box",
                      overflow: "hidden",
                      color: "var(--text-color, #374557)",
                      textOverflow: "ellipsis", // corrected property name
                      fontFamily: "Inter", // corrected property name
                      fontSize: "16px", // corrected property name
                      fontStyle: "normal", // corrected property name
                      fontWeight: 400, // corrected property name
                      lineHeight: "28px", // corrected property name
                    }}
                  >
                    <a
                      href={`/task/${task.taskId}`}
                      style={{
                        display: "flex",
                        alignItems: "center", // Aligns the icon and text vertically
                        textDecoration: "none", // Removes underline from the link
                        color: "inherit", // Inherits color from the parent element
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{ marginRight: "8px" }} // Space between icon and text
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.28429 15.3327H10.7831C13.2919 15.3327 14.7353 13.9001 14.7353 11.4102V4.5885C14.7353 2.09857 13.2919 0.666016 10.7831 0.666016H5.28429C2.77546 0.666016 1.33203 2.09857 1.33203 4.5885V11.4102C1.33203 13.9001 2.77546 15.3327 5.28429 15.3327ZM2.36305 4.5885C2.36305 2.63749 3.31847 1.68927 5.28429 1.68927H10.7831C12.7489 1.68927 13.7043 2.63749 13.7043 4.5885V11.4102C13.7043 13.3612 12.7489 14.3094 10.7831 14.3094H5.28429C3.31847 14.3094 2.36305 13.3612 2.36305 11.4102V4.5885ZM11.1272 6.12375H12.5019C12.7837 6.12375 13.0174 5.89182 13.0174 5.61213C13.0174 5.33244 12.7837 5.1005 12.5019 5.1005H11.1272C10.6529 5.1005 10.268 4.71848 10.268 4.24779V2.88345C10.268 2.60376 10.0343 2.37182 9.75249 2.37182C9.47068 2.37182 9.23698 2.60376 9.23698 2.88345V4.24779C9.23698 5.28469 10.0824 6.12375 11.1272 6.12375ZM8.03313 9.19318H5.28374C5.00193 9.19318 4.76823 8.96124 4.76823 8.68155C4.76823 8.40186 5.00193 8.16992 5.28374 8.16992H8.03313C8.31495 8.16992 8.54865 8.40186 8.54865 8.68155C8.54865 8.96124 8.31495 9.19318 8.03313 9.19318ZM5.28374 11.9223H10.7825C11.0643 11.9223 11.298 11.6904 11.298 11.4107C11.298 11.131 11.0643 10.8991 10.7825 10.8991H5.28374C5.00193 10.8991 4.76823 11.131 4.76823 11.4107C4.76823 11.6904 5.00193 11.9223 5.28374 11.9223Z"
                          fill={
                            task.status === "TODO"
                              ? "#0DCAF0"
                              : task.status === "IN_PROGRESS"
                              ? "#FFC107"
                              : "#28A745"
                          }
                        />
                      </svg>
                      {task.name}{" "}
                      {/* Ensure task.taskName is the correct property */}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="notifications-container">
          <div className="notifications-header d-flex justify-content-between align-items-center w-100">
            <h3>Notifications</h3>
            <div className="d-  flex justify-content-end">
              <button
                className="project-dash-admin-notify-btn"
                onClick={handleNotificationPopupOpen}
              >
                Notify
              </button>
            </div>{" "}
          </div>

          {displayedNotifications
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map((notification, index) => {
              const date = new Date(notification.createdAt); // Use createdAt property
              const isValidDate =
                !isNaN(date.getTime()) && notification.createdAt !== null;

              // console.log(displayedNotifications);

              return (
                <div key={index} className="notification-item">
                  {/* <img className="project-dash-notification-img" src="https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg" alt="Profile" /> */}
                  <div
                    className="card-pic"
                    style={{
                      backgroundColor: `#${Math.floor(
                        Math.random() * 16777215
                      ).toString(16)}`,
                    }}
                  >
                    {projectDetails
                      ? projectDetails.projectName.charAt(0)
                      : "L"}
                  </div>
                  <div className="notification-content">
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-timestamp">
                      {isValidDate
                        ? `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
                        : "Date not available"}
                    </div>
                  </div>
                </div>
              );
            })}

          <div className="ntf">
            <div className="unread-notifications">
              <button
                className="see-all-notifications-button"
                onClick={() => navigate(`/allnotifications/${project}`)}
              >
                See All Notifications (
                {allNotifications.length - displayedNotifications.length})
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="toast-container"
      />
    </div>
  );
};

export default Dashboard;

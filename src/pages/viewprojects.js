import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServerUrl from '../config/config';
import subtract from '../assets/Subtract.svg'; // Assuming subtract.svg is in assets folder
import Head from '../components/Head';
import plus from '../assets/plus.svg';
import { AuthContext } from '../context/AuthContext';

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState({});
  const user = useContext(AuthContext);

  const navigate = useNavigate();

  // console.log(tasks);

  const currentUser = user.user;
  console.log(currentUser);

  const filteredProjects = projects.filter((project) => currentUser.role === 'Admin' || project.reportingTo === currentUser.id || project.teamMembers.includes(currentUser.id) || project.createdBy === currentUser.id);
  console.log(filteredProjects);

  useEffect(() => {
    if (projects.length > 0) {
      console.log('Fetching projects...', projects);

      const fetchTasks = async (projectId) => {
        try {
          console.log(`Fetching tasks for projectId: ${projectId}`);
          const res = await axios.get(`${ServerUrl.apiUrl}api/tasks/project/${projectId}`);
          const groupedTasks = res.data.reduce(
            (acc, task) => {
              acc[task.status].push(task);
              return acc;
            },
            { TODO: [], IN_PROGRESS: [], DONE: [] }
          );
          setTasks((prevTasks) => ({
            ...prevTasks,
            [projectId]: groupedTasks
          }));
        } catch (error) {
          console.error('Failed to fetch tasks:', error);
        }
      };

      // Call fetchTasks for each project
      projects.forEach((project) => fetchTasks(project.projectId));
    }
  }, [projects]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${ServerUrl.apiUrl}api/projects`);
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const toProjectDashboard = (ProjectId) => {
    navigate(`/ProjectDashboard/${ProjectId}`);
  };
  const NavigateAddProject = () => {
    navigate('/ProjectList');
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error fetching projects: {error}</div>;
  }
  console.log(projects);

  return (
    <div className="main">
      <div className="frame">
        <Head heading="Add Project" buttonTxt="Add Project" onclick={NavigateAddProject} status="button" img={plus} />

        <div className="container-fluid  project-view-cnt">
          <div className="row projects-row ">
            {filteredProjects
              .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
              .map((project) => (
                <div key={project._id} onClick={() => toProjectDashboard(project.projectId)} className="project-card">
                  <div className="card-title-bar d-flex w-100 align-items-center justify-content-between ">
                    <div className="project-card-heading d-flex align-items-center ">
                      <div className="card-pic" style={{ backgroundColor: getRandomColor() }}>
                        {project.projectName?.charAt(0) || ''}
                      </div>
                      <div className="project-card-name ">
                        <h5 className="project-card-name-text m-0">{project.projectName}</h5>
                        <h6 className="project-card-name-text-2 m-0 p-0">{project.category}</h6>
                      </div>
                    </div>
                    <svg className="project-card-edit-img" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="All in one icon/Edit">
                        <g id="Union">
                          <path d="M9.96416 17.4975C8.24473 17.4975 6.52362 17.5042 4.80419 17.4958C3.67743 17.4891 2.78172 16.7501 2.53728 15.6433C2.5105 15.5224 2.50547 15.3964 2.50547 15.2722C2.50212 11.9955 2.4971 8.72055 2.50212 5.44727C2.50212 4.31531 3.44639 3.27572 4.56477 3.22869C5.72334 3.17999 6.88525 3.18335 8.04382 3.20014C8.72021 3.21022 9.09523 3.80811 8.84075 4.39928C8.72355 4.66968 8.51093 4.82587 8.22966 4.87625C8.04717 4.90816 7.85798 4.91488 7.67214 4.91488C6.81493 4.91992 5.9594 4.91656 5.1022 4.91992C4.97831 4.91992 4.85274 4.92831 4.7322 4.94847C4.39065 5.00725 4.21486 5.2071 4.20314 5.55811C4.19309 5.85538 4.19812 6.15433 4.19812 6.45327C4.19812 9.22104 4.19812 11.9905 4.19812 14.7582C4.19812 14.8758 4.19812 14.9934 4.19979 15.1126C4.20649 15.4586 4.3873 15.687 4.7255 15.7592C4.85944 15.7878 4.9984 15.7945 5.13568 15.7945C8.39708 15.7962 11.6568 15.7945 14.9182 15.7945C15.5008 15.7945 15.7553 15.5543 15.7603 14.9648C15.7704 13.9941 15.7654 13.0217 15.7704 12.0509C15.7704 11.9267 15.7787 11.799 15.8122 11.6815C15.9294 11.2549 16.2726 11.013 16.6895 11.0483C17.1098 11.0852 17.4496 11.3976 17.4563 11.836C17.4731 13.0217 17.5099 14.2107 17.4446 15.3931C17.3793 16.5754 16.3865 17.4739 15.2078 17.4874C13.4599 17.5075 11.7121 17.4924 9.96416 17.4924V17.4975Z" fill="#374557" />
                          <path d="M10.2002 11.7436C10.1785 11.9871 10.0328 12.0812 9.84864 12.1332C9.23252 12.3062 8.61808 12.491 7.99694 12.6488C7.55662 12.7597 7.29376 12.4389 7.41933 11.9535C7.53653 11.4984 7.66879 11.0466 7.79436 10.5932C7.82952 10.4672 7.84626 10.3312 7.90318 10.2153C7.96178 10.091 8.06056 9.98687 8.13423 9.86931C8.1811 9.79541 8.26147 9.70472 8.2464 9.63922C8.20957 9.46456 8.26649 9.34364 8.38201 9.22943C8.67668 8.93553 8.96799 8.64162 9.26098 8.34771C10.746 6.85802 12.2361 5.37169 13.7094 3.87025C13.8668 3.7107 14.1547 3.75269 14.2217 3.42855C14.2619 3.23373 14.5197 3.0809 14.6905 2.91799C15.2715 2.36376 16.0583 2.36041 16.641 2.90959C16.8168 3.07586 16.9909 3.24549 17.1466 3.43023C17.5718 3.93407 17.6204 4.55715 17.2537 5.1013C17.0344 5.42544 16.795 5.74621 16.3882 5.86714C16.3564 5.87721 16.3279 5.91584 16.3078 5.94775C16.2057 6.10562 16.1303 6.29036 15.9997 6.42136C14.3105 8.1277 12.6111 9.82396 10.9218 11.532C10.7192 11.7369 10.5133 11.8561 10.2002 11.7436Z" fill="#374557" />
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className={`card-category-${project.status}`}>
                    {project.status == 'TODO' ? 'To Do' : ''}
                    {project.status == 'INPROGRESS' ? 'In Progress' : ''}
                    {project.status == 'COMPLETED' ? 'Done' : ''}
                  </div>
                  <div className="card-description w-100">
                    <div className="card-description-text d-flex justify-content-between w-100 align-items-center">
                      <h6 className="m-0 card-desc-title">Team Members</h6>
                      <span className="card-desc-value">{project.teamMembers && project.teamMembers.length}</span>
                    </div>
                  </div>
                  <div className="card-description w-100">
                    <div className="card-description-text d-flex justify-content-between w-100 align-items-center">
                      <h6 className="m-0 card-desc-title">To Do</h6>
                      <span className="card-desc-value">{tasks[project.projectId]?.TODO?.length || 0}</span>{' '}
                    </div>
                  </div>
                  <div className="card-description w-100">
                    <div className="card-description-text d-flex justify-content-between w-100 align-items-center">
                      <h6 className="m-0 card-desc-title">Completed</h6>
                      <span className="card-desc-value">{tasks[project.projectId]?.DONE?.length || 0} </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProjects;

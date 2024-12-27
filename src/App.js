import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import MobileDetect from 'mobile-detect';
import { AuthProvider, AuthContext } from './context/AuthContext'; // Ensure AuthContext is imported
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import TimesheetPage from './pages/TimesheetPage';
import AttendancePage from './pages/AttendancePage';
import LoginPage from './pages/loginpage'; // Corrected the casing of 'loginpage' to 'LoginPage'
import AdminDashboard from './pages/AdminDashboard';
import Employeedetails from './pages/Employeedetails';
import ProjectList from './pages/ProjectList';
import Header from './components/Header';
import AppConfiguration from './pages/AppConfiguration';
import CompanyDetails from './pages/CompanyDetails';
import ViewProjects from './pages/viewprojects';
import Project from './pages/Project';
import AddTask from './pages/AddTask';
import TaskPage from './pages/TaskPage';
import EmployeeViewProfile from './pages/EmployeeViewProfile';
import Addemployee from './pages/AddEmployee';
import AttendanceStat from './pages/AttendanceStat';
import LeavePortal from './pages/LeavePortal';
import ReportPage from './pages/Report';
import AllNotifications from './pages/AllNotifications';
import './App.css';
import andro from './assets/andro.gif';

function App() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      const md = new MobileDetect(window.navigator.userAgent);
      const isMobile = md.mobile() !== null;
      const isSmallScreen = window.innerWidth <= 800;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      console.log('isMobile:', isMobile);
      console.log('isSmallScreen:', isSmallScreen);
      console.log('isTouchDevice:', isTouchDevice);

      if (isMobile || isSmallScreen || isTouchDevice) {
        setIsMobileDevice(true);
      } else {
        setIsMobileDevice(false);
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    return () => {
      window.removeEventListener('resize', checkDeviceType);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        {isMobileDevice ? (
          <div className="blur-show-nothing flex">
            <img src={andro} alt="Device not compatible" />
            Your device is not compatible with this application.
          </div>
        ) : (
          <div className="container-fluid">
            <div className="row new-pad">
              <ContentWithSidebar />
            </div>
          </div>
        )}
      </AuthProvider>
    </Router>
  );
}

function ContentWithSidebar() {
  const location = useLocation();
  const { user } = useContext(AuthContext); // Accessing user from context
  const showHeaderAndSidebar = location.pathname !== '/login';

  // Determine whether to navigate away from the login page
  const redirectToAttendance = user && location.pathname === '/login';

  return (
    <>
      {redirectToAttendance && <Navigate to="/attendance" replace />} {/* Redirect if logged in */}
      {showHeaderAndSidebar && <Header />}
      {showHeaderAndSidebar && <Sidebar />}
      <div className={showHeaderAndSidebar ? 'col-md-10 pb-3' : 'col-md-11 pb-3'} id="main_element">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/attendance" element={<ProtectedRoute allowedRoles={['Employee', 'Manager', 'Admin', 'Intern', 'HR', 'Trainee']} element={<AttendancePage />} />} />
          <Route path="/attendance/:_id" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'HR']} element={<AttendancePage />} />} />
          <Route path="/attendancestats" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'HR']} element={<AttendanceStat />} />} />
          <Route path="/attendancestats/:department" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'HR']} element={<AttendanceStat />} />} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'HR', 'Employee', 'Intern', 'Trainee']} element={<AdminDashboard />} />} />
          <Route path="/employeedetails" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'HR']} element={<Employeedetails />} />} />
          <Route path="/addemployee" element={<ProtectedRoute allowedRoles={['Admin', 'HR']} element={<Addemployee />} />} />
          <Route path="/modifyemployee/:id" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'HR', 'Employee', 'Intern', 'Trainee']} element={<Addemployee />} />} />
          <Route path="/viewprofile/:id" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'Employee', 'Intern', 'HR', 'Trainee']} element={<EmployeeViewProfile />} />} />
          <Route path="/projectlist" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'Project Manager', 'Employee', 'Intern', 'HR', 'Trainee']} element={<ProjectList />} />} />
          <Route path="/timesheet" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'Employee', 'Project Manager', 'Intern', 'Trainee']} element={<TimesheetPage />} />} />
          <Route path="/Configuration" element={<ProtectedRoute allowedRoles={['Admin', 'HR']} element={<AppConfiguration />} />} />
          <Route path="/companydetails" element={<ProtectedRoute allowedRoles={['Admin', 'HR']} element={<CompanyDetails />} />} />
          <Route path="/viewprojects" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'Project Manager', 'Employee', 'Intern', 'HR', 'Trainee']} element={<ViewProjects />} />} />
          <Route path="/ProjectDashboard/:ProjectId" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'Project Manager', 'Employee', 'Intern', 'HR', 'Trainee']} element={<Project />} />} />
          <Route path="/addtask/:ProjectId" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'Project Manager']} element={<AddTask />} />} />
          <Route path="/task/:TaskId" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'Project Manager', 'Employee', 'Intern', 'HR', 'Trainee']} element={<TaskPage />} />} />
          <Route path="/leaveportal/:_id" element={<ProtectedRoute allowedRoles={['Employee', 'Manager', 'Admin', 'Project Manager', 'Intern', 'HR', 'Trainee']} element={<LeavePortal />} />} />
          <Route path="/reports" element={<ProtectedRoute allowedRoles={['Manager', 'Admin', 'HR']} element={<ReportPage />} />} />
          <Route path="/allnotifications/:projectId" element={<AllNotifications />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
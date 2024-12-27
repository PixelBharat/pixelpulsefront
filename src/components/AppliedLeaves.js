import React from 'react';
import updatee from '../assets/update-con.svg';
import logout from '../assets/logout.svg';
import reload from '../assets/reload.svg';
const AppliesLeaves = ({ status, leaveData }) => {
  const getBorderColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'var(--Teal-300, #79DFC1)';
      case 'Rejected':
        return ' var(--Red-300, #EA868F)';
      case 'Pending':
        return 'var(--Orange-300, #FEB272)';

      default:
        return '#ccc';
    }
  };

  const getBackgroundColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'linear-gradient(90deg, #00B9E1 0%, #23CF81 100%)';
      case 'Rejected':
        return 'linear-gradient(90deg, #FC1E00 0%, #FF7A00 100%)';
      case 'Pending':
        return ' linear-gradient(90deg, #4FA0FF 0%, rgba(143, 0, 255, 0.60) 100%)';
      default:
        return '#f0f0f0';
    }
  };

  return (
    <div className="main-leaves-container" style={{ borderColor: getBorderColor(status), borderWidth: '1px', borderStyle: 'solid' }}>
      <div className="leaves-container-show">
        <div className="leaves-container-show-div1">
          <div className="leave-text">
            <p className="reason-text">Reason: {leaveData.remark}</p>
            <h5 className="leave-day">
              {(() => {
                const fromDate = new Date(leaveData.fromDate);
                const toDate = new Date(leaveData.toDate);
                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                const dayName = dayNames[fromDate.getDay()];
                const formattedDate = `${fromDate.getDate()} ${monthNames[fromDate.getMonth()]} ${fromDate.getFullYear()}`;

                const daysDifference = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

                return `${dayName}, ${formattedDate} (${daysDifference} days)`;
              })()}
            </h5>
            To: {new Date(leaveData.toDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
           
          </div>
          <div className="approved-btn" style={{ background: getBackgroundColor(status) }}>
            {status}
          </div>
        </div>
        <div className="leaves-container-show-div2">
          {status.includes('approved') || status.includes('in review') ? (
            <>
              <div className="edit-leaves goals-update">
                <img src={updatee} alt="update icon" />
              </div>
              <div className="goals-update goals-delete">
                <img src={logout} alt="logout icon" />
              </div>
            </>
          ) : (
            status === 'rejected' && (
              <div className="edit-leaves goals-update">
                <img src={reload} alt="reload icon" />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliesLeaves;

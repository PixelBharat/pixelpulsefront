import React, { useState, useEffect } from 'react';
import axios from 'axios';
import serverUrl from '../config/config';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { SmoothCorners } from 'react-smooth-corners';
import '../css/Report.css';
import { ReactComponent as CalenderIcon } from '../assets/Calendar-addemployee.svg';
import { ToastContainer, toast } from 'react-toastify';
import { data } from 'autoprefixer';
const ReportPage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [startDate, setStartDate] = useState(new Date('2024-01-01'));
  const [endDate, setEndDate] = useState(new Date('2024-02-02'));
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [attendanceCounts, setAttendanceCounts] = useState({});
  const [excelFile, setExcelFile] = useState(null);
  const [fileInputRef, setFileInputRef] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const openUpdatePopup = (record) => {
    setSelectedRecord(record);
    setIsPopupOpen(true);
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${serverUrl.apiUrl}api/employee/getemployees`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees. Please try again.');
    }
  };

  const fetchAttendanceData = async () => {
    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }

    if (startDate > endDate) {
      setError('Start date must be before end date');
      return;
    }

    setLoading(true);
    setError(null);
    setReportGenerated(true);

    try {
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      const response = await axios.get(`${serverUrl.apiUrl}api/report/${selectedEmployee}`, {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate
        }
      });

      const dataWithEmployeeName = response.data.map((record) => ({
        ...record,
        name: employees.find((emp) => emp._id === selectedEmployee)?.name || 'Unknown'
      }));
      setAttendanceData(dataWithEmployeeName);
      setAttendanceCounts(calculateAttendanceCounts(dataWithEmployeeName));
      setEmployeeName(employees.find((emp) => emp._id === selectedEmployee)?.name || 'Unknown');
      // alert('Report Generated Successfully', data);
      // Create Excel file
      // Calculate totals
      const totals = dataWithEmployeeName.reduce((acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      }, {});

      // Create Excel file
      const wb = XLSX.utils.book_new();
      const selectedFields = dataWithEmployeeName.map((record) => ({
        Date: new Date(record.date).toLocaleDateString(),
        Status: record.status,
        'In Time': record.Intime,
        'Out Time': record.Outtime || 'Not clocked out'
      }));

      const ws = XLSX.utils.json_to_sheet([]);

      // Add employee name and totals at the top
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [`Employee Name: ${dataWithEmployeeName[0].name}`],
          [`Total Present: ${totals['Present'] || 0}`],
          [`Total Absent: ${totals['Absent'] || 0}`],
          [`Total On Leave: ${totals['On Leave'] || 0}`],
          [`Total Half Day: ${totals['Half Day'] || 0}`],
          [] // Empty row for spacing
        ],
        { origin: 'A1' }
      );

      // Add the attendance data
      XLSX.utils.sheet_add_json(ws, selectedFields, { origin: 'A7', skipHeader: false });

      // Rest of the styling code remains the same...

      // Shift the rest of the data down by one row
      // XLSX.utils.sheet_add_json(ws, selectedFields, { origin: "A2", skipHeader: false });

      // const ws = XLSX.utils.json_to_sheet(dataWithEmployeeName);

      // Style the worksheet
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = { c: C, r: R };
          const cell_ref = XLSX.utils.encode_cell(cell_address);
          if (!ws[cell_ref]) continue;

          // Add borders to all cells
          ws[cell_ref].s = {
            border: {
              top: { style: 'thin', color: { rgb: 'DEE2E6' } },
              bottom: { style: 'thin', color: { rgb: 'DEE2E6' } },
              left: { style: 'thin', color: { rgb: 'DEE2E6' } },
              right: { style: 'thin', color: { rgb: 'DEE2E6' } }
            },
            font: { name: 'Arial', sz: 10 }
          };

          // Style header row
          if (R === 0) {
            ws[cell_ref].s.fill = { fgColor: { rgb: 'E9ECEF' } };
            ws[cell_ref].s.font = { bold: true, color: { rgb: '495057' }, name: 'Arial', sz: 12 };
          }

          // Color-code status cells
          // Color-code status cells
          // Color-code status cells
          XLSX.utils.sheet_to_json(ws, { header: 1 }).forEach((row, rowIndex) => {
            if (rowIndex > 0) {
              // Skip header row
              const status = row[1]; // Assuming Status is the second column (index 1)
              const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: 1 });

              if (status === 'Absent') {
                ws[cellRef].s = { ...ws[cellRef].s, fill: { fgColor: { rgb: 'FFCCCB' } } }; // Light red
              } else if (status === 'Present') {
                ws[cellRef].s = { ...ws[cellRef].s, fill: { fgColor: { rgb: '90EE90' } } }; // Light green
              } else if (status === 'Half Day') {
                ws[cellRef].s = { ...ws[cellRef].s, fill: { fgColor: { rgb: 'FFFFE0' } } }; // Light yellow
              } else if (status === 'On Leave') {
                ws[cellRef].s = { ...ws[cellRef].s, fill: { fgColor: { rgb: 'E6F3FF' } } }; // Very light blue
              }
            }
          });
        }
      }

      // Auto-size columns
      const col_width = dataWithEmployeeName.map((row) => Object.values(row).map((v) => v.toString().length));
      ws['!cols'] = col_width[0].map((w, i) => ({ wch: Math.max(...col_width.map((row) => row[i])) + 2 }));

      XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');

      // Generate Excel file as a blob
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      setExcelFile(blob);

      if (fileInputRef) {
        const file = new File([blob], `AttendanceReport_${employeeName}.xlsx`, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.files = dataTransfer.files;
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Failed to fetch attendance data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendExcelToBackend = async () => {
    if (!excelFile) {
      setError('Please generate the report first');
      return;
    }

    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }

    console.log('Excel File:', excelFile);

    try {
      const formData = new FormData();
      const file = new File([excelFile], `AttendanceReport_${employeeName}.xlsx`, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      formData.append('file', file);

      const selectedEmployeeData = employees.find((emp) => emp._id === selectedEmployee);
      const employeeEmail = selectedEmployeeData ? selectedEmployeeData.email : '';
      formData.append('employeeEmail', employeeEmail);

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(`${serverUrl.apiUrl}api/report/sendexelmail`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json'
        }
      });

      console.log('Excel file sent successfully:', response.data);
      setError(null);
      toast.success('Report sent successfully to ' + employeeEmail);
    } catch (error) {
      console.error('Error sending Excel file:', error);
      setError('Failed to send Excel file to the backend. Please try again.');
    }
  };

  const calculateAttendanceCounts = (data) => {
    return data.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {});
  };
  const UpdatePopup = ({ record, onClose, onUpdate }) => {
    const [updatedRecord, setUpdatedRecord] = useState(record);

    const handleUpdate = async () => {
      try {
        await axios.put(`${serverUrl.apiUrl}api/attendance/update/${record._id}`, updatedRecord);
        onUpdate();
        onClose();
      } catch (error) {
        console.error('Error updating record:', error);
        setError('Failed to update record. Please try again.');
      }
    };

    return (
      <div className="popup">
        <div className="popup-content">
          <h2>Update Attendance Record</h2>
          <input type="date" value={updatedRecord.date.split('T')[0]} onChange={(e) => setUpdatedRecord({ ...updatedRecord, date: e.target.value })} />
          <select value={updatedRecord.status} onChange={(e) => setUpdatedRecord({ ...updatedRecord, status: e.target.value })}>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Half Day">Half Day</option>
            <option value="On Leave">On Leave</option>
          </select>
          <input type="time" value={updatedRecord.Intime} onChange={(e) => setUpdatedRecord({ ...updatedRecord, Intime: e.target.value })} />
          <input type="time" value={updatedRecord.Outtime} onChange={(e) => setUpdatedRecord({ ...updatedRecord, Outtime: e.target.value })} />
          <button className="btn btn-primary" onClick={handleUpdate}>
            Update
          </button>
          <button className="btn btn-danger" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`${serverUrl.apiUrl}api/attendance/${recordId}`);
        toast.success('Record deleted successfully');
        fetchAttendanceData(); // Refresh the data
      } catch (error) {
        console.error('Error deleting record:', error);
        toast.error('Failed to delete record. Please try again.');
      }
    }
  };

  return (
    <div className="report">
      <SmoothCorners corners="90, 8" borderRadius="20px">
        <div className="div-dash">
          <div className="dash-heading">Employee Attendance Report</div>
        </div>
      </SmoothCorners>
      <div className="report-form">
        <div className="report-input-div">
          <label className="form-label">Employee</label>
          <select className="report-input report-select" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div className="report-input-div">
          <label className="form-label">Start Date</label>
          <div className="report-input">
            <input type="date" value={startDate.toISOString().split('T')[0]} onChange={(e) => setStartDate(new Date(e.target.value))} className="report-input-date" />
            <CalenderIcon className="addEmployee-calender-icon" />
          </div>
        </div>

        <div className="report-input-div">
          <label className="form-label">End Date</label>
          <div className="report-input">
            <input type="date" value={endDate.toISOString().split('T')[0]} onChange={(e) => setEndDate(new Date(e.target.value))} min={startDate.toISOString().split('T')[0]} className="report-input-date" />
            <CalenderIcon className="addEmployee-calender-icon" />
          </div>
        </div>

        <div className="report-input-div">
          <label className="form-label">Report File</label>
          <input type="file" ref={setFileInputRef} style={{ display: 'none' }} accept=".xlsx" />
          <input type="text" readOnly value={excelFile ? 'Report generated' : 'No file generated'} className="report-input" />
        </div>
      </div>
      <div className="report-button">
        <button className="report-button-report" onClick={fetchAttendanceData}>
          Generate Report
        </button>
        <button
          className="report-button-excel"
          onClick={() => {
            if (excelFile) {
              const url = window.URL.createObjectURL(excelFile);
              const a = document.createElement('a');
              a.href = url;
              a.download = `AttendanceReport_${employeeName}.xlsx`;
              a.click();
            } else {
              setError('Please generate the report first');
            }
          }}
        >
          Export to Excel
        </button>
        <button className="report-button-excel" onClick={sendExcelToBackend}>
          Send to Email
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && reportGenerated && !error && attendanceData.length === 0 && <p>No attendance data available for the selected period.</p>}
      {!loading && !error && attendanceData.length > 0 && (
        <div
          style={{
            overflowX: 'auto',
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '1.5rem'
            }}
          >
            {attendanceData.length > 0 && (
              <div>
                <p>
                  <strong>Employee Name:</strong> {attendanceData[0].name}
                </p>
              </div>
            )}
            <p>
              <strong>Summary:</strong> Present: {attendanceCounts['Present'] || 0}
            </p>
            <p>Absent: {attendanceCounts['Absent'] || 0}</p>
            <p>Half Day: {attendanceCounts['Half Day'] || 0}</p>
            <p>On Leave: {attendanceCounts['On Leave'] || 0}</p>
          </div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0',
              border: '1px solid #dee2e6'
            }}
          >
            <thead>
              <tr>
                {/* <th
                  style={{
                    border: '1px solid #dee2e6',
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: '#e9ecef',
                    fontWeight: 'bold',
                    color: '#495057'
                  }}
                >
                  Name
                </th> */}
                <th
                  style={{
                    border: '1px solid #dee2e6',
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: '#e9ecef',
                    fontWeight: 'bold',
                    color: '#495057'
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    border: '1px solid #dee2e6',
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: '#e9ecef',
                    fontWeight: 'bold',
                    color: '#495057'
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    border: '1px solid #dee2e6',
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: '#e9ecef',
                    fontWeight: 'bold',
                    color: '#495057'
                  }}
                >
                  In Time
                </th>
                <th
                  style={{
                    border: '1px solid #dee2e6',
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: '#e9ecef',
                    fontWeight: 'bold',
                    color: '#495057'
                  }}
                >
                  Out Time
                </th>
                <th
                  style={{
                    border: '1px solid #dee2e6',
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: '#e9ecef',
                    fontWeight: 'bold',
                    color: '#495057'
                  }}
                >
                  Edit Record
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                  }}
                >
                  {/* <td
                    style={{
                      border: '1px solid #dee2e6',
                      padding: '12px',
                      textAlign: 'left'
                    }}
                  >
                    {record.name}
                  </td> */}
                  <td
                    style={{
                      border: '1px solid #dee2e6',
                      padding: '12px',
                      textAlign: 'left'
                    }}
                  >
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td
                    style={{
                      border: '1px solid #dee2e6',
                      padding: '12px',
                      textAlign: 'left',
                      backgroundColor: record.status === 'Absent' ? '#ffcccb' : record.status === 'Present' ? 'rgb(205, 254, 194)' : record.status === 'Half Day' ? '#FFFFE0' : record.status === 'On Leave' ? '#E6F3FF' : 'transparent'
                    }}
                  >
                    {record.status}
                  </td>
                  <td
                    style={{
                      border: '1px solid #dee2e6',
                      padding: '12px',
                      textAlign: 'left'
                    }}
                  >
                    {record.Intime}
                  </td>
                  <td
                    style={{
                      border: '1px solid #dee2e6',
                      padding: '12px',
                      textAlign: 'left'
                    }}
                  >
                    {record.Outtime || 'Not clocked out'}
                  </td>
                  <td
                    className="flex gap-2"
                    style={{
                      border: '1px solid #dee2e6',
                      padding: '12px',
                      textAlign: 'left'
                    }}
                  >
                    <button onClick={() => openUpdatePopup(record)} className="btn btn-primary">
                      Update
                    </button>
                    <button onClick={() => handleDeleteRecord(record._id)} className=" btn btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" className="toast-container" />
      {isPopupOpen && (
        <UpdatePopup
          record={selectedRecord}
          onClose={() => setIsPopupOpen(false)}
          onUpdate={() => {
            fetchAttendanceData();
            setIsPopupOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ReportPage;

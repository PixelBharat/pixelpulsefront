import React, { useState } from 'react';
import serverUrl from '../config/config';

const Addemployee = ({ close }) => {
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
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: files ? files[0] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
            console.log(data);
        try {
            const response = await fetch(`${serverUrl.apiUrl}api/employee/registeremployee`, {
                method: 'POST',
                body: data,
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
    

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Employee</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={close}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="id" className="form-label">ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="id"
                                            name="id"
                                            placeholder="Enter ID"
                                            value={formData.id}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            placeholder="Enter Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="joinedDate" className="form-label">Joined Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="joinedDate"
                                            name="joinedDate"
                                            value={formData.joinedDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="salary" className="form-label">Salary</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="salary"
                                            name="salary"
                                            placeholder="Enter Salary"
                                            value={formData.salary}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="role" className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Project Manager">Project Manager</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Employee">Employee</option>
                                            <option value="Intern">Intern</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            placeholder="Enter Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Phone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="phone"
                                            name="phone"
                                            placeholder="Enter Phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            name="address"
                                            placeholder="Enter Address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="departmentId" className="form-label">Department ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="departmentId"
                                            name="departmentId"
                                            placeholder="Enter Department ID"
                                            value={formData.departmentId}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="designation" className="form-label">Designation</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="designation"
                                            name="designation"
                                            placeholder="Enter Designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="accountNumber" className="form-label">Account Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="accountNumber"
                                            name="accountNumber"
                                            placeholder="Enter Account Number"
                                            value={formData.accountNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="ifscCode" className="form-label">IFSC Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="ifscCode"
                                            name="ifscCode"
                                            placeholder="Enter IFSC Code"
                                            value={formData.ifscCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="bankName" className="form-label">Bank Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="bankName"
                                            name="bankName"
                                            placeholder="Enter Bank Name"
                                            value={formData.bankName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="resume" className="form-label">Upload Resume</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="resume"
                                            name="resume"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="joiningLetter" className="form-label">Upload Joining Letter</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="joiningLetter"
                                            name="joiningLetter"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="profilePicture"
                                            name="profilePicture"
                                            onChange={handleChange}
                                        />
                                        {formData.profilePicture && (
                                            <img
                                                src={URL.createObjectURL(formData.profilePicture)}
                                                alt="Profile Preview"
                                                className="img-thumbnail mt-2"
                                                style={{ width: '100px', height: '100px' }}
                                            />
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder="Enter Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">Submit</button>
                                <button type="button" className="btn btn-secondary" onClick={close}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Addemployee;

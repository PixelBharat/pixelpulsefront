import React, { useState } from "react";
import serverUrl from "../config/config";

const Addproject = ({ close }) => {
    const [alias,setalias]=useState()
    const [formData, setFormData] = useState({
        projectid: '',
        projectname: '',
        projectalias: '',
        description: '',
        startdate: '',
        enddate: '',
        status: '',
        attachments: null,
        reporterid: '',
        createdby: '',
        designlink: '',
       deadline:''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: files ? files[0] : value });
        if(formData.startdate){
            const startDate = new Date(formData.startdate);
        const month = startDate.getMonth() + 1; 
        const date = startDate.getDate();
        setalias(formData.projectname.slice(0, 2).toUpperCase() + month.toString().padStart(2, '0') + date.toString().padStart(2, '0'));
        setFormData({ ...formData, [name]: files ? files[0] : value, projectalias: alias });
        }else{
            setalias(".....")
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      console.table(formData)
        try {
            const response = await fetch(`${serverUrl.apiUrl}api/projects/createproject`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
        // setFormData({
        //     projectid: '',
        //     projectname: '',
        //     projectalias: '',
        //     description: '',
        //     startdate: '',
        //     enddate: '',
        //     status: '',
        //     attachments: null,
        //     reporterid: null,
        //     createdby: '',
        //     designlink: '',
        //     deadline: ''
        // });
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Project</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={close}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="projectid" className="form-label">Project ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="projectid"
                                            name="projectid"
                                            placeholder="Enter Project ID"
                                            value={formData.projectid}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="projectname" className="form-label">Project Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="projectname"
                                            name="projectname"
                                            placeholder="Enter Project Name"
                                            value={formData.projectname}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="projectalias" className="form-label">Project Alias</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="projectalias"
                                            name="projectalias"
                                            placeholder="Enter Project Alias"
                                            value={alias}
                                            onChange={handleChange}
                                            disable
                                        
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            placeholder="Enter Description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="startdate" className="form-label">Start Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="startdate"
                                            name="startdate"
                                            value={formData.startdate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="enddate" className="form-label">End Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="enddate"
                                            name="enddate"
                                            value={formData.enddate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="status" className="form-label">Status</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="status"
                                            name="status"
                                            placeholder="Enter Status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="attachments" className="form-label">Attachments</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="attachments"
                                            name="attachments"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="reporterid" className="form-label">Reporter ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="reporterid"
                                            name="reporterid"
                                            placeholder="Enter Reporter ID"
                                            value={formData.reporterid}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="createdby" className="form-label">Created By</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="createdby"
                                            name="createdby"
                                            placeholder="Enter Created By"
                                            value={formData.createdby}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="designlink" className="form-label">Design Link</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="designlink"
                                            name="designlink"
                                            placeholder="Enter Design Link"
                                            value={formData.designlink}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="deadline" className="form-label">Dead Line</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="deadline"
                                            name="deadline"
                                            placeholder="Dead Line"
                                            value={formData.deadline}
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

export default Addproject;
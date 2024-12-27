import React, { useEffect, useState } from 'react';
import { IssuePopup } from '../popups/AllotherPopups';
import ServerUrl from '../config/config';
import axios from 'axios';
import pic from "../assets/profilepic.jpg"
import btnimg from "../assets/btm-img2.svg"
import down from "../assets/down-white.svg"
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ProjectIssues = ({ projectId, setButtonTxt, setstaus, setHeading, setonclick, opnepopGoals, setopenpopGoals, setbutton }) => {
    const [issues, setissues] = useState([])
    const [showcomment, setshowcomment] = useState(false)
    const { user } = useContext(AuthContext);
    const [employeeName, setEmployeeName] = useState([]);
    console.log(projectId);
    const [AddMilstonePopupstatus, setAddMilstonePopupstaus] = useState(opnepopGoals);
    useEffect(() => {
        setButtonTxt('Add Issues');
        setstaus('button');
        setHeading('Project Issues');
    }, [])
    let maindata = []
    const fetchissues = async () => {

        const ProjectId = projectId
        console.log(ProjectId)
        const res = await axios.post(`${ServerUrl.apiUrl}api/projects/getissue`, ProjectId)
            .then(data => {
                maindata = data.data
                console.log("fetched ", maindata)
                setissues(maindata)
                console.log("issuse", issues)
            })
            .catch(err => {
                console.log(err)
            })
    }
    function timeAgo(dateStr) {
        const now = new Date();
        const pastDate = new Date(dateStr);
        const seconds = Math.floor((now - pastDate) / 1000);

        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 },
        ];

        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count > 0) {
                return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
            }
        }

        return 'just now';
    }

    useEffect(() => {
        fetchissues()

    }, [])
    function reverseArray(arr) {
        return arr.slice().reverse();
    }
    const printdata = reverseArray(issues).map((item, index) => {
        const funupdateshowcomment = (id) => {
            setshowcomment(prev => ({
                ...prev,
                [id]: !prev[id]
            }))
        }
        console.log("item", item)
        const handleSubmit = async (event, itemId) => {
            const author = user.name;
            const id = user.id
            const _id = item._id
            event.preventDefault();
            const formData = new FormData(event.target);
            const text = formData.get('text');
            console.log("Item ID:", itemId);
            console.log("Comment Text:", text);
            const res = await axios.post(`${ServerUrl.apiUrl}api/projects/issue/addcomment`, {
                id,
                _id,
                text,
                author
            })
                .then((data) => {
                    console.log("data", data)
                    toast.success('Comment Added successfully!');
                    fetchissues()
                })
                .catch((err) => {
                    console.log(err)
                    toast.error('Failed to update coment.');
                })
            event.target.reset();
        }


        return (<>
            <div key={index} className='issue-container'>
                <div className='all-content-container-issue'>
                    <div className='issue-content-with-pic'>
                        <img src={pic} />
                        <h5 className='m-0'>{item?.name ? item.name : "no name"}</h5>
                        <p className='m-0'>to</p>
                        <p className='m-0'>{item?.ToNotify}</p>
                    </div>
                    <div className='time-type-issue'>
                        <p className='m-0'>{timeAgo(item?.createdAt)}</p>
                        <p className='m-0 gap-issue'>Type:<span>{item?.Type}</span></p>
                    </div>

                </div>
                <div className='all-content-container-issue'>
                    <div className='flex gap-issue'> <h6 className='m-0'>Issue:</h6><p className='m-0'>{item.Issuue ? item.Issuue : "Unable to fetch API "}</p></div>
                    <div className='flex gap-issue'>  <p className='m-0 status-issue'> Status:</p> <p className='m-0 p-style opacity-p' style={{ color: item?.status === "unresolved" ? "red" : "black" }}> {item?.status}
                    </p></div>
                </div>

                <div className='issue-comment-container-2'>
                    <img src={pic} />
                    <form onSubmit={(e) => handleSubmit(e, item._id)}>
                        <input type="text" placeholder='Add a comment' className='issue-comment-input' name='text' />
                        <button type="submit" className='save'><img src={btnimg} />send</button>
                    </form>
                </div>
                <div className='threads-issue'>
                    <div className='threads-issue-btn-div'>
                        <button onClick={() => funupdateshowcomment(item._id)} className='save'><img
                            src={down}
                            alt="Toggle"
                            style={{
                                transform: showcomment[item._id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                            }}
                        />Threads</button>
                        {showcomment[item._id] && (<div className='absolute-issue-div-super'><div className='absolute-issue-div'>

                            {
                                item?.comments?.length > 0 ? (reverseArray(item?.comments).map((item, index) => {
                                    return (<> <div key={index} className='threads-issue-div'>
                                        <div className='threads-issue-div-content'>

                                            <div className='issue-comment-img-author'>
                                                <img src={pic} />
                                                <h6 className='m-0 h6-style'>{item?.author ? item.author : "no author"}</h6>
                                            </div>
                                            <p className='m-0 p-style '>{item?.createdAt ? timeAgo(item.createdAt) : "no date"}</p>

                                        </div>
                                        <div className='threads-issue-div-content-comment'>
                                            <h6 className='m-0 h6-style'>Reply:</h6>
                                            <p className='m-0 p-style ' >{item?.text ? item.text : "no text"}</p>
                                        </div>
                                    </div>
                                    </>
                                    )
                                })) : "no comments"
                            }
                        </div></div>)}
                    </div>
                </div>
            </div>
        </>)
    })

    return (
        <div className="goals-container">
            {printdata}
            {opnepopGoals && <IssuePopup close={() => setopenpopGoals(false)} ProjectId={projectId.ProjectId} fetchissues={fetchissues} />}
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" className="toast-container" />
        </div>
    );
};
export default ProjectIssues;
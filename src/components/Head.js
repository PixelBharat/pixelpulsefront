import React, { useEffect, useState } from "react";
import { SmoothCorners } from 'react-smooth-corners';
import arrowLeft from "../assets/arrow-left.svg";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
const Head = ({ status, heading, content, setcolor1, setcolor2, img, buttonTxt, onclick,type,select}) => {

    const [bgcolor1, setcolor11] = useState(true);
    const [bgcolor2, setcolor22] = useState(false);
    const [slash, setslash] = useState(null)
    const navigate = useNavigate()
    const location = useLocation();

    const chnagebgfun1 = () => {
        setcolor1(true);
        setcolor2(false);
        setcolor11(true)
        setcolor22(false)
    };

    const chnagebgfun2 = () => {
        setcolor2(true);
        setcolor1(false);
        setcolor22(true)
        setcolor11(false)
    };
    const goBack = () => {
        navigate(-1)
    };
  
    const handleNavigate = (userId) => {
        navigate(`/leaveportal/${userId}`);
    };
    const path = location.pathname;
    const modifiedPath = path.startsWith('/') ? path.substring(1) : path;
    const pathWithoutNumbers = modifiedPath.replace(/\d+/g, '');
    const pathWithSpaces = pathWithoutNumbers.replace(/\//g, '  /  ');
    const pathnamee = `${pathWithSpaces} ${select}`;

    const data="jfdkjvsv"
    // const moddata=data.startsWith(charAt(0))
   const moddata=data.charAt(0)
    console.log(moddata);
    return (<>
        <SmoothCorners corners="90, 8" borderRadius="20px">
            <div className="div-dash">
               <div className="dash-cointainer">
               <img src={arrowLeft} className="back-arrow" onClick={goBack} />
                <div className="dash-heading"><p className="m-0">{heading}</p>
                {type=="pathname" &&  <h6 className="path-name">{pathnamee}</h6>}
                </div>
             
                </div>
                {status == "div" && <div className='btn-sec'>
                    <button onClick={chnagebgfun1} className={bgcolor1 ? "btn-sec-btn add-css-class" : "btn-sec-btn"}>Daily</button>
                    <button onClick={chnagebgfun2} className={bgcolor2 ? "btn-sec-btn add-css-class" : "btn-sec-btn"}>Weekly</button>
                </div>}
                
                {status == "hr" && <div className='btn-sec'>
                    <button onClick={chnagebgfun1} className={bgcolor1 ? "btn-sec-btn add-css-class" : "btn-sec-btn"}>Attendance</button>
                    <button onClick={chnagebgfun2} className={bgcolor2 ? "btn-sec-btn add-css-class" : "btn-sec-btn"}>Leaves</button>
                </div>}
                {status == "button" && <button className="custom-btn d-flex justify-content-center align-items-center gap-2  bg-white clr-txt-btn" onClick={onclick} ><img src={img} /> {buttonTxt}</button>
                }
            </div>
        </SmoothCorners>
    </>)
}
export default Head
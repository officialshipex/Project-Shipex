import "./CreateZoneB2B.css";
import AddZoneForm from "./AddZoneForm";
import AllZones from "./AllZones";
import { useState } from "react";
import { useRef } from "react";



const CreateZoneB2B=()=>{

  const [formData, setFormData] = useState({
    name: "",
    fullname: "",
  });

  const [zones, setZones] = useState([]);
  const formRef = useRef(null);
 
    return(
        <>
        <h1 className="crZoneHeading">Create Zone</h1>
         <div className="addZone" ref={formRef}>
            <AddZoneForm setZones={setZones} formData={formData} setFormData={setFormData}></AddZoneForm>
         </div> 
         <br></br>
         <br></br>
         <div className="allZones">
           <AllZones  zones={zones}  setZones={setZones} setFormData={setFormData} formRef={formRef}></AllZones>
         </div>
        </>
    )
};


export default CreateZoneB2B;

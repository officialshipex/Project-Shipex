import "./CreateZoneB2B.css";
import AddZoneForm from "./AddZoneForm";
import AllZones from "./AllZones";
import { useState } from "react";



const CreateZoneB2B=()=>{

  const [zones, setZones] = useState([]);
 
    return(
        <>
        <h1 className="crZoneHeading">Create Zone</h1>
         <div className="addZone">
            <AddZoneForm setZones={setZones}></AddZoneForm>
         </div> 
         <br></br>
         <br></br>
         <div className="allZones">
           <AllZones  zones={zones}  setZones={setZones}></AllZones>
         </div>
        </>
    )
};


export default CreateZoneB2B;

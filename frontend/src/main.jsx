import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import CourierDTDC from './B2C/CourierDTDC.jsx'
// import Sidebar from './B2C/SideBar.jsx'
// import Track from './trackByMobileAWBOrderID/Track.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
    {/* <CourierDTDC/> */}
    
  </StrictMode>,
)

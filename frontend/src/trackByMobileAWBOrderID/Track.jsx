import OurOneStopSolutions from "./OurOneStopSolution"
import PartnersSection from "./PartnersSection"
import TrackByNumber from "./TrackByNumber"
import UniqueFeatures from "./UniqueFeature"
import Home from "./Home"
import OrderTracking from "./OrderTracking"
import AboutUs from "./AboutUs"
import WhyChooseUs from "./WhyChoseUs"
import Footer from "./Footer"
import OurFeatures from "./OurFeatures"
import ScrollingLogos from "./ScrollingLogos"

const Track = () => {
    return (
        <div>
            {/* <TrackByNumber /> */}
            {/* <UniqueFeatures /> */}
            <Home/>
            <ScrollingLogos/>
            <OrderTracking/>
            <OurFeatures/>
            
            <WhyChooseUs/>
            <OurOneStopSolutions />
            <AboutUs/>
            <Footer/>
            {/* <PartnersSection /> */}

        </div>
    )
}
export default Track
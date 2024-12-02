import React from "react";
import DisplayZoneRates from "./DisplayZoneRates";
import VASRateTable from "./VASRateTable";

const RateChart = () => {
  return (
    <>
      <DisplayZoneRates />
      <br />
      <VASRateTable />
    </>
  );
};

export default RateChart;

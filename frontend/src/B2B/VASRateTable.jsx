import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from "@mui/material";

// Example Data (Replace with actual data from your backend)
const vasRateData = [
  {
    id: 1,
    valueAddedField: "Min billable weight",
    value: "20.00 Kgs",
    minCharges: "50.00 Rs",
    maxCharges: "9999.00 Rs",
    fromRange: "501.00 Rs",
    toRange: "9999.00 Rs",
  },
  {
    id: 2,
    valueAddedField: "Waybill charge",
    value: "50.00 Rs",
    minCharges: "50.00 Rs",
    maxCharges: "500.00 Rs",
    fromRange: "501.00 Rs",
    toRange: "9999.00 Rs",
  },
  // Add more rows as required
];

const VASRateTable = () => {
  const [vasRates, setVasRates] = useState(vasRateData);
  const [editableRow, setEditableRow] = useState(null); // Track which row is being edited
  const [editedData, setEditedData] = useState({}); // Store edited data

  // Handle change in input fields
  const handleChange = (e, field, id) => {
    setEditedData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: e.target.value,
      },
    }));
  };

  // Start editing a row
  const handleEdit = (row) => {
    setEditableRow(row.id);
    setEditedData((prevData) => ({
      ...prevData,
      [row.id]: row,
    }));
  };

  // Save the updated row
  const handleSave = (id) => {
    setVasRates((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, ...editedData[id] } : row))
    );
    setEditableRow(null); // Exit editing mode
    setEditedData({}); // Clear edited data
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Value Added Fields</strong></TableCell>
            <TableCell><strong>Value</strong></TableCell>
            <TableCell><strong>Min Charges</strong></TableCell>
            <TableCell><strong>Max Charges</strong></TableCell>
            <TableCell><strong>From Range</strong></TableCell>
            <TableCell><strong>To Range</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vasRates.map((rate) => (
            <TableRow key={rate.id}>
              <TableCell>{rate.valueAddedField}</TableCell>
              
              {/* Editable Fields */}
              <TableCell>
                {editableRow === rate.id ? (
                  <TextField
                    value={editedData[rate.id]?.value || rate.value}
                    onChange={(e) => handleChange(e, "value", rate.id)}
                  />
                ) : (
                  rate.value
                )}
              </TableCell>
              <TableCell>
                {editableRow === rate.id ? (
                  <TextField
                    value={editedData[rate.id]?.minCharges || rate.minCharges}
                    onChange={(e) => handleChange(e, "minCharges", rate.id)}
                  />
                ) : (
                  rate.minCharges
                )}
              </TableCell>
              <TableCell>
                {editableRow === rate.id ? (
                  <TextField
                    value={editedData[rate.id]?.maxCharges || rate.maxCharges}
                    onChange={(e) => handleChange(e, "maxCharges", rate.id)}
                  />
                ) : (
                  rate.maxCharges
                )}
              </TableCell>
              <TableCell>
                {editableRow === rate.id ? (
                  <TextField
                    value={editedData[rate.id]?.fromRange || rate.fromRange}
                    onChange={(e) => handleChange(e, "fromRange", rate.id)}
                  />
                ) : (
                  rate.fromRange
                )}
              </TableCell>
              <TableCell>
                {editableRow === rate.id ? (
                  <TextField
                    value={editedData[rate.id]?.toRange || rate.toRange}
                    onChange={(e) => handleChange(e, "toRange", rate.id)}
                  />
                ) : (
                  rate.toRange
                )}
              </TableCell>
              
              {/* Actions - Edit/Save */}
              <TableCell>
                {editableRow === rate.id ? (
                  <Button color="primary" onClick={() => handleSave(rate.id)}>
                    Save
                  </Button>
                ) : (
                  <Button color="secondary" onClick={() => handleEdit(rate)}>
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VASRateTable;

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CustomField from "../models/CustomField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function NewFieldDialog({
  open,
  handleClose,
  handleSubmit,
}: {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (customField: CustomField) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("string");

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Patient Field</DialogTitle>
      <DialogContent sx={{ width: 300 }}>
        <DialogContentText>Create a new patient field.</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Field Name"
          fullWidth
          sx={{ mb: 6 }}
          variant="standard"
          onChange={(e) => setName(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel id="type-select-label">Type</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={type}
            label="Type"
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="string">Text</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="info" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => handleSubmit({ id: 0, name })}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

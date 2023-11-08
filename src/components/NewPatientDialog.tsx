import React, { useState } from "react";
import Patient, { Address, CustomFields, Status } from "../models/Patient";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { getUser } from "../utils";
import CustomField from "../models/CustomField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function NewPatientDialog({
  open,
  customFields,
  handleClose,
  handleSubmit,
}: {
  open: boolean;
  customFields: CustomField[];
  handleClose: () => void;
  handleSubmit: (patient: Patient) => void;
}) {
  const { id: providerId } = getUser();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("Inquiry");
  const [customFieldData, setCustomFieldData] = useState<CustomFields>({});
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 0, line1: "", line2: "", city: "", state: "", zip: "" },
  ]);

  const clearState = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setDob(null);
    setStatus("Inquiry");
    setCustomFieldData({});
    setAddresses([
      { id: 0, line1: "", line2: "", city: "", state: "", zip: "" },
    ]);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <DialogTitle>New Patient</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              fullWidth
              variant="standard"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Middle Name"
              fullWidth
              variant="standard"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Last Name"
              fullWidth
              variant="standard"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <DatePicker
              sx={{ mt: 2 }}
              label="Date of Birth"
              value={dob}
              onChange={(value) => setDob(value || "")}
            />
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                <MenuItem value="Inquiry">Inquiry</MenuItem>
                <MenuItem value="Onboarding">Onboarding</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Churned">Churned</MenuItem>
              </Select>
            </FormControl>
            {customFields.map((customField) => {
              if (customField.type === "date") {
                return (
                  <DatePicker
                    label={customField.name}
                    key={customField.id}
                    value={customFieldData[customField.id]}
                    onChange={(value) =>
                      setCustomFieldData({
                        ...customFieldData,
                        [customField.id]: value || "",
                      })
                    }
                  />
                );
              } else if (customField.type === "number") {
                return (
                  <TextField
                    key={customField.id}
                    type="number"
                    margin="dense"
                    label={customField.name}
                    fullWidth
                    variant="standard"
                    value={customFieldData[customField.id]}
                    onChange={(e) =>
                      setCustomFieldData({
                        ...customFieldData,
                        [customField.id]: e.target.value,
                      })
                    }
                  />
                );
              }
              return (
                <TextField
                  key={customField.id}
                  margin="dense"
                  label={customField.name}
                  fullWidth
                  variant="standard"
                  value={customFieldData[customField.id]}
                  onChange={(e) =>
                    setCustomFieldData({
                      ...customFieldData,
                      [customField.id]: e.target.value,
                    })
                  }
                />
              );
            })}
          </Grid>
          <Grid item xs={6}>
            {addresses.map((address, idx) => (
              <div key={idx}>
                <Grid container alignItems="flex-end" spacing={2}>
                  <Grid item>
                    <Typography sx={{ mt: 3, mb: 1, fontWeight: 500 }}>
                      Address {idx + 1}
                    </Typography>
                  </Grid>
                  {addresses.length > 1 && (
                    <Grid item>
                      <IconButton
                        aria-label="delete"
                        onClick={() =>
                          setAddresses((addresses) =>
                            addresses.filter((address, i) => idx !== i),
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Line 1"
                  fullWidth
                  variant="standard"
                  value={address.line1}
                  onChange={(e) =>
                    setAddresses((addresses) => {
                      const newAddresses = [...addresses];
                      newAddresses[idx] = {
                        ...newAddresses[idx],
                        line1: e.target.value,
                      };
                      return newAddresses;
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Line 2"
                  fullWidth
                  variant="standard"
                  value={address.line2}
                  onChange={(e) =>
                    setAddresses((addresses) => {
                      const newAddresses = [...addresses];
                      newAddresses[idx] = {
                        ...newAddresses[idx],
                        line2: e.target.value,
                      };
                      return newAddresses;
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="City"
                  fullWidth
                  variant="standard"
                  value={address.city}
                  onChange={(e) =>
                    setAddresses((addresses) => {
                      const newAddresses = [...addresses];
                      newAddresses[idx] = {
                        ...newAddresses[idx],
                        city: e.target.value,
                      };
                      return newAddresses;
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="State"
                  fullWidth
                  variant="standard"
                  value={address.state}
                  onChange={(e) =>
                    setAddresses((addresses) => {
                      const newAddresses = [...addresses];
                      newAddresses[idx] = {
                        ...newAddresses[idx],
                        state: e.target.value,
                      };
                      return newAddresses;
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Zip Code"
                  fullWidth
                  variant="standard"
                  value={address.zip}
                  onChange={(e) =>
                    setAddresses((addresses) => {
                      const newAddresses = [...addresses];
                      newAddresses[idx] = {
                        ...newAddresses[idx],
                        zip: e.target.value,
                      };
                      return newAddresses;
                    })
                  }
                />
              </div>
            ))}
            <Button
              color="primary"
              startIcon={<AddIcon />}
              onClick={() =>
                setAddresses((addresses) => [
                  ...addresses,
                  {
                    id: 0,
                    line1: "",
                    line2: "",
                    city: "",
                    state: "",
                    zip: "",
                  },
                ])
              }
            >
              Add address
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="info"
          onClick={() => {
            clearState();
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            await handleSubmit({
              id: 0,
              firstName,
              middleName,
              lastName,
              dob: dob || "",
              status,
              providerId,
              customFields: customFieldData,
              addresses,
            });
            clearState();
            handleClose();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

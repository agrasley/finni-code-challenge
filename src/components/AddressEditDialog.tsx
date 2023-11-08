import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Address } from "../models/Patient";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";

export default function AddressEditDialog({
  open,
  handleClose,
  addresses,
  setAddresses,
}: {
  open: boolean;
  handleClose: () => void;
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
}) {
  console.log("props addresses", addresses);
  console.log("local addresses", addresses);
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Addresses</DialogTitle>
      <DialogContent sx={{ width: 300 }}>
        {addresses.map((address, idx) => (
          <div key={address.id}>
            <Typography sx={{ mt: 3, mb: 1, fontWeight: 500 }}>
              Address {idx + 1}
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Line 1"
              fullWidth
              variant="standard"
              value={address.line1}
              onChange={(e) =>
                setAddresses((addresses) => {
                  console.log("e", e);
                  console.log("old addresses", addresses);
                  const newAddresses = addresses;
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
                  const newAddresses = addresses;
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
                  const newAddresses = addresses;
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
                  const newAddresses = addresses;
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
                  const newAddresses = addresses;
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
                isNew: true,
              },
            ])
          }
        >
          Add address
        </Button>
      </DialogContent>
      <DialogActions>
        <Button color="info" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleClose}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Address } from "../models/Patient";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AddressEditDialog({
  open,
  handleClose,
  rowAddresses,
}: {
  open: boolean;
  handleClose: () => void;
  rowAddresses: Address[];
}) {
  const [addresses, setAddresses] = useState(rowAddresses);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [changedIds, setChangedIds] = useState<number[]>([]);

  useEffect(() => {
    setAddresses(rowAddresses);
  }, [rowAddresses, setAddresses]);

  const clearState = () => {
    setAddresses(rowAddresses);
    setDeletedIds([]);
    setChangedIds([]);
  };

  const onClose = () => {
    clearState();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Addresses</DialogTitle>
      <DialogContent sx={{ width: 300 }}>
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
                    onClick={() => {
                      if (!addresses[idx].isNew) {
                        setDeletedIds([...deletedIds, addresses[idx].id]);
                        setChangedIds(
                          changedIds.filter((id) => id !== addresses[idx].id),
                        );
                      }
                      setAddresses((addresses) =>
                        addresses.filter((address, i) => idx !== i),
                      );
                    }}
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
              onChange={(e) => {
                setAddresses((addresses) => {
                  const newAddresses = [...addresses];
                  newAddresses[idx] = {
                    ...newAddresses[idx],
                    line1: e.target.value,
                  };
                  return newAddresses;
                });
                if (!addresses[idx].isNew) {
                  setChangedIds([...changedIds, addresses[idx].id]);
                }
              }}
            />
            <TextField
              margin="dense"
              label="Line 2"
              fullWidth
              variant="standard"
              value={address.line2}
              onChange={(e) => {
                setAddresses((addresses) => {
                  const newAddresses = [...addresses];
                  newAddresses[idx] = {
                    ...newAddresses[idx],
                    line2: e.target.value,
                  };
                  return newAddresses;
                });
                if (!addresses[idx].isNew) {
                  setChangedIds([...changedIds, addresses[idx].id]);
                }
              }}
            />
            <TextField
              margin="dense"
              label="City"
              fullWidth
              variant="standard"
              value={address.city}
              onChange={(e) => {
                setAddresses((addresses) => {
                  const newAddresses = [...addresses];
                  newAddresses[idx] = {
                    ...newAddresses[idx],
                    city: e.target.value,
                  };
                  return newAddresses;
                });
                if (!addresses[idx].isNew) {
                  setChangedIds([...changedIds, addresses[idx].id]);
                }
              }}
            />
            <TextField
              margin="dense"
              label="State"
              fullWidth
              variant="standard"
              value={address.state}
              onChange={(e) => {
                setAddresses((addresses) => {
                  const newAddresses = [...addresses];
                  newAddresses[idx] = {
                    ...newAddresses[idx],
                    state: e.target.value,
                  };
                  return newAddresses;
                });
                if (!addresses[idx].isNew) {
                  setChangedIds([...changedIds, addresses[idx].id]);
                }
              }}
            />
            <TextField
              margin="dense"
              label="Zip Code"
              fullWidth
              variant="standard"
              value={address.zip}
              onChange={(e) => {
                setAddresses((addresses) => {
                  const newAddresses = [...addresses];
                  newAddresses[idx] = {
                    ...newAddresses[idx],
                    zip: e.target.value,
                  };
                  return newAddresses;
                });
                if (!addresses[idx].isNew) {
                  setChangedIds([...changedIds, addresses[idx].id]);
                }
              }}
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
        <Button color="info" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onClose}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

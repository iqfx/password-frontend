import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid rgba(0,0,0,0.2)",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};
export default function DeleteModal(password: any) {
  const [deletemodal, setDeletemodal] = useState(false);
  const handleOpen = () => setDeletemodal(true);
  const handleClose = () => setDeletemodal(false);

  const submitdelete = async () => {
    await fetch("/api/password/" + password.password.row.id, {
      method: "delete",
    }).then(() => {
      handleClose();
    });
  };

  return (
    <div>
      <Button onClick={handleOpen} color="error" startIcon={<DeleteIcon />}>
        Delete
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={deletemodal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={deletemodal}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Delete {password.password.row.passwordName}
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to delete this entry?
            </Typography>
            <Button
              style={{ float: "right", marginTop: "1em" }}
              variant="contained"
              color="error"
              endIcon={<DeleteIcon />}
              onClick={submitdelete}
            >
              Delete
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

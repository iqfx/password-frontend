import {
  Box,
  Button,
  Fade,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
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

export default function EditPasswords({ password, setParameters }: any) {
  const [editmodal, setEditmodal] = useState(false);
  const handleOpen = () => setEditmodal(true);
  const handleClose = () => setEditmodal(false);
  const handleChange = () => {
    setParameters(password);
  };
  return (
    <div>
      <Button startIcon={<EditIcon />} onClick={handleOpen}>
        Edit
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={editmodal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={editmodal}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Edit {password.row.passwordName}
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <Stack spacing={2}>
                <TextField
                  style={{ marginTop: "1em" }}
                  id="passwordName"
                  label="Name"
                  variant="outlined"
                  defaultValue={password.row.passwordName}
                  onChange={handleChange}
                />
                <TextField
                  style={{ marginTop: "1em" }}
                  id="username"
                  label="Username"
                  variant="outlined"
                  defaultValue={password.row.userName}
                  onChange={handleChange}
                />
                <TextField
                  style={{ marginTop: "1em" }}
                  id="password"
                  label="Password"
                  variant="outlined"
                  defaultValue={password.row.password}
                  onChange={handleChange}
                />
                <TextField
                  style={{ marginTop: "1em" }}
                  id="url"
                  label="URL"
                  variant="outlined"
                />
              </Stack>
            </Typography>
            <Button
              style={{ float: "right", marginTop: "1em" }}
              variant="contained"
              endIcon={<SendIcon />}
            >
              Save
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

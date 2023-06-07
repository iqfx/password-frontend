import {
  Box,
  Button,
  Fade,
  Modal,
  Stack,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import AddIcon from "@mui/icons-material/Add";
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

interface FormData {
  Name: string;
  UserName: string;
  Password: string;
  URL: string;
}
interface PasswordModalParams {
  fetchData: () => void;
}
export default function AddPasswordModal({ fetchData }: PasswordModalParams) {
  const [Addmodal, setAddmodal] = useState(false);
  const handleOpen = () => setAddmodal(true);
  const handleClose = () => setAddmodal(false);
  const [openalert, setOpenalert] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    Name: "",
    UserName: "",
    Password: "",
    URL: "",
  });
  const handleReset = () => {
    setFormData({
      Name: "",
      UserName: "",
      Password: "",
      URL: "",
    }); // Reset the formData state to an empty object
  };
  useEffect(() => {
    handleReset();
  }, []);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    await fetch("/api/addpassword", {
      method: "post",
      body: JSON.stringify(formData),
    }).then(() => {
      handleClose();
      handleReset();
      setOpenalert(true);
      fetchData();
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openalert}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={() => {
            setOpenalert(false);
          }}
        >
          Password saved succesfully!
        </Alert>
      </Snackbar>
      <Button startIcon={<AddIcon />} onClick={handleOpen}>
        Add Password
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={Addmodal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={Addmodal}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Add
            </Typography>

            <Typography
              id="transition-modal-description"
              component="span"
              sx={{ mt: 2 }}
            >
              <Stack spacing={2}>
                <TextField
                  style={{ marginTop: "1em" }}
                  id="name"
                  label="Name"
                  variant="outlined"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                />
                <TextField
                  style={{ marginTop: "1em" }}
                  id="uname"
                  label="Username"
                  variant="outlined"
                  name="UserName"
                  value={formData.UserName}
                  onChange={handleChange}
                />
                <TextField
                  style={{ marginTop: "1em" }}
                  id="Password"
                  label="Password"
                  variant="outlined"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                />
                <TextField
                  style={{ marginTop: "1em" }}
                  id="URL"
                  label="URL"
                  variant="outlined"
                  name="URL"
                  value={formData.URL}
                  onChange={handleChange}
                />
              </Stack>
            </Typography>
            <Button
              style={{ float: "right", marginTop: "1em" }}
              variant="contained"
              endIcon={<SendIcon />}
              onClick={() => {
                handleSubmit();
              }}
            >
              Save
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

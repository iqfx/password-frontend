import {
  Box,
  Button,
  Fade,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import { decryptData } from "./decryptDataUtil";
import { encryptData } from "./encryptDataUtil";
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
interface EditModalParams {
  password: any;
  fetchData: () => void;
  setPasswordModal: Dispatch<SetStateAction<boolean>>;
}
export default function EditPasswords({
  password,
  fetchData,
  setPasswordModal,
}: EditModalParams) {
  const [editmodal, setEditmodal] = useState(false);
  const handleOpen = () => setEditmodal(true);
  const [submitForm, setSubmitForm] = useState(false);

  const handleClose = () => {
    handleReset();
    setEditmodal(false);
  };

  const getCookie = () => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      const cookieName = cookie[0];
      const cookieValue = cookie[1];

      if (cookieName === "token") {
        return cookieValue;
      }
    }

    return null;
  };
  const cookie = getCookie();
  const handleReset = () => {
    try {
      setFormData({
        Name: password.row.name,
        UserName: password.row.userName,
        Password: decryptData(password.row.password, cookie ?? ""),
        URL: password.row.url,
      });
    } catch (error) {
      setPasswordModal(true);
    }
  };
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      return {
        Name: password.row.name,
        UserName: password.row.userName,
        Password: decryptData(password.row.password, cookie ?? ""),
        URL: password.row.url,
      };
    } catch (error) {
      return {
        Name: "",
        UserName: "",
        Password: "",
        URL: "",
      };
    }
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    if (cookie) {
      const encryptedPassword = encryptData(formData.Password, cookie);
      setFormData((formData) => ({
        ...formData,
        Password: encryptedPassword,
      }));
      setSubmitForm(true);
    }
  };

  useEffect(() => {
    if (submitForm) {
      const submit = async () => {
        await fetch("/api/password/" + password.row.id, {
          method: "PUT",
          body: JSON.stringify(formData),
        }).then(() => {
          handleClose();
          fetchData();
        });
      };
      submit();
      setSubmitForm(false);
    }
  });

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
              Edit {formData.Name}
            </Typography>
            <Typography
              component={"span"}
              id="transition-modal-description"
              sx={{ mt: 2 }}
            >
              <Stack spacing={2}>
                <TextField
                  style={{ marginTop: "1em" }}
                  id="passwordName"
                  label="Name"
                  name="Name"
                  variant="outlined"
                  value={formData.Name}
                  onChange={handleChange}
                />
                <TextField
                  style={{ marginTop: "1em" }}
                  id="username"
                  label="Username"
                  name="UserName"
                  variant="outlined"
                  value={formData.UserName}
                  onChange={handleChange}
                />
                <TextField
                  style={{ marginTop: "1em" }}
                  id="password"
                  label="Password"
                  name="Password"
                  variant="outlined"
                  value={formData.Password}
                  onChange={handleChange}
                />
                <TextField
                  style={{ marginTop: "1em" }}
                  id="url"
                  name="URL"
                  label="URL"
                  variant="outlined"
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

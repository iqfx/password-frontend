import { useState } from "react";
import { deriveEncryptionKey } from "./pbkdf2Util";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
export default function PasswordPromptModal({ handleFinish }: any) {
  let sendPasswordSetApiRequest = async () => {
    try {
      await fetch("/api/user", { method: "post" });
    } catch (error) {
      console.log(error);
    }
  };
  let setCookie = (value: string) => {
    document.cookie = "token=" + value + "; path=/;";
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
  const [masterPassword, setMasterPassword] = useState("");
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = async () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const encryptionToken = await encryptPassword();
    if (encryptionToken) {
      setCookie(encryptionToken);
    }
    await sendPasswordSetApiRequest();
    handleClose();
    await handleFinish();
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  async function encryptPassword(): Promise<string | undefined> {
    const salt: string = process.env.SALT ?? "test123";
    const iterations: number = parseInt(process.env.ITERATIONS ?? "1000");
    const keyLength: number = parseInt(process.env.KEYLENGTH ?? "32"); // 32 bytes = 256 bits

    try {
      const encryptionKey: string = await deriveEncryptionKey(
        masterPassword,
        salt,
        iterations,
        keyLength
      );
      return encryptionKey;
      // Use the derived encryption key for encryption or decryption operations
    } catch (error) {
      console.error("Error deriving encryption key:", error);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Enter master password
          </Typography>
          <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              value={masterPassword}
              onChange={(event) => {
                setMasterPassword(event.target.value);
              }}
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Button
            style={{ float: "right", marginTop: "1em" }}
            onClick={handleSubmit}
          >
            Set Password
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

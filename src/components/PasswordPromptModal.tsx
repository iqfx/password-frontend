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
import ErrorIcon from "@mui/icons-material/Error";
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
export default function PasswordPromptModal() {
  const [masterPassword, setMasterPassword] = useState("");
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    encryptPassword();
    // setOpen(false);
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  async function encryptPassword(): Promise<void> {
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
      console.log("Derived encryption key:", encryptionKey);
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
            Set master password
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
            onClick={handleClose}
          >
            Set Password
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

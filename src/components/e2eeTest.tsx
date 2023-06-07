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
import * as Crypto from "crypto-js";
import { useState } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { deriveEncryptionKey } from "./pbkdf2Util";

const sensitiveData = "This is sensitive data";
const encryptionKey = Crypto.enc.Utf8.parse("encryptionKey123");
var iv = Crypto.enc.Hex.parse("00000000000000000000000000000000");

const encryptedData = Crypto.AES.encrypt(sensitiveData, encryptionKey, {
  iv,
  mode: Crypto.mode.CBC,
  padding: Crypto.pad.ZeroPadding,
}).toString();

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

export default function E2EETEST() {
  const [textInput, setTextInput] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  async function exampleUsage(): Promise<void> {
    const password: string = "myStrongPassword";
    const salt: string = process.env.SALT ?? "test123";
    const iterations: number = parseInt(process.env.ITERATIONS ?? "1000");
    const keyLength: number = parseInt(process.env.KEYLENGTH ?? "32"); // 32 bytes = 256 bits

    try {
      const encryptionKey: string = await deriveEncryptionKey(
        password,
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
  exampleUsage();
  const decryptData = (password: string) => {
    try {
      const decryptedData = Crypto.AES.decrypt(
        encryptedData,
        Crypto.enc.Utf8.parse(password),
        {
          iv,
          mode: Crypto.mode.CBC,
          padding: Crypto.pad.ZeroPadding,
        }
      ).toString(Crypto.enc.Utf8);
      console.log(decryptedData);
    } catch (error) {
      handleOpen();
    }
  };
  return (
    <div className="m-5">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            value={textInput}
            onChange={(event) => {
              setTextInput(event.target.value);
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
          onClick={() => {
            decryptData(textInput);
          }}
          variant="outlined"
        >
          Decrypt
        </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Master password incorrect
            <ErrorIcon style={{ color: "red", float: "right" }} />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            The master password you entered was incorrect. Please try again
          </Typography>
          <Button style={{ float: "right" }} onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

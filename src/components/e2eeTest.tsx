import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import * as Crypto from "crypto-js";
import { useState } from "react";
import ErrorIcon from "@mui/icons-material/Error";
const sensitiveData = "This is sensitive data je bolle moeder";
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
  const decryptData = (password: string) => {
    try {
      const sensitiveData = Crypto.AES.decrypt(
        encryptedData,
        Crypto.enc.Utf8.parse(password),
        {
          iv,
          mode: Crypto.mode.CBC,
          padding: Crypto.pad.ZeroPadding,
        }
      ).toString(Crypto.enc.Utf8);

      console.log(sensitiveData);
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
        <TextField
          value={textInput}
          onChange={(event) => {
            setTextInput(event.target.value);
          }}
          id="standard-basic"
          label="Password"
          variant="standard"
        />

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

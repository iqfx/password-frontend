import crypto from "crypto";

// Function to derive an encryption key using PBKDF2
function deriveEncryptionKey(
  password: string,
  salt: string,
  iterations: number,
  keyLength: number
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      keyLength,
      "sha512",
      (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          resolve(derivedKey.toString("hex"));
        }
      }
    );
  });
}

export { deriveEncryptionKey };

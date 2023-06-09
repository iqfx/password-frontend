import crypto from "crypto";

// Encrypt data using the PBKDF2-derived encryption key
function encryptData(data: string, encryptionKey: string): string {
  try {
    const iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector)
    const buffer = Buffer.from(encryptionKey, "hex");
    const cipher = crypto.createCipheriv("aes-256-cbc", buffer, iv);

    let encryptedData = cipher.update(data, "utf8", "hex");
    encryptedData += cipher.final("hex");

    // Combine the IV and encrypted data as a single string
    const encryptedMessage = `${iv.toString("hex")}:${encryptedData}`;
    return encryptedMessage;
  } catch (error) {
    console.error("Error encrypting data:", error);
    throw error;
  }
}
export { encryptData };

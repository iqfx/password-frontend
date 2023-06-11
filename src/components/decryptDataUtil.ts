import crypto from "crypto";

function decryptData(encryptedData: string, encryptionKey: string): string {
  try {
    const [ivString, encryptedString] = encryptedData.split(":");
    const iv = Buffer.from(ivString, "hex");
    const buffer = Buffer.from(encryptionKey, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", buffer, iv);

    let decryptedData = decipher.update(encryptedString, "hex", "utf8");
    decryptedData += decipher.final("utf8");
    return decryptedData;
  } catch (error) {
    // console.error("Error decrypting data:", error);
    throw error;
  }
}

export { decryptData };

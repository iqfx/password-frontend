import crypto from "crypto";

function decryptData(encryptedData: string, encryptionKey: string): string {
    const [ivString, encryptedString] = encryptedData.split(":");
    const iv = Buffer.from(ivString, "hex");
    const buffer = Buffer.from(encryptionKey, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", buffer, iv);
    let decryptedData = "";
    decipher.on("error", (error) => {
      // Handle decryption error here
      console.error("Error decrypting data:", error);
      throw error;
    });
    decryptedData = decipher.update(encryptedString, "hex", "utf8");

    decryptedData += decipher.final("utf8");
    if (decryptedData !== null) {
      // Decryption was successful
      return decryptedData;
    } else {
      // Decryption failed
      throw new Error("Decryption failed.");
    }
}

export { decryptData };

function decrypt(encryptedText: string, key: string | undefined): string {
  const decodedText = Buffer.from(encryptedText, "base64").toString("utf-8");
  let result = "";
  if (key) {
    for (let i = 0; i < decodedText.length; i++) {
      result += String.fromCharCode(decodedText.charCodeAt(i) ^ parseInt(key));
    }
  }
  return result;
}

export interface DJInfo {
  uid: string;
  displayName: string;
  photoURL: string;
}

export function extractUserInfo(encryptedHash: string): DJInfo | null {
  const key = process.env.NEXT_PUBLIC_CRYPTKEY;
  const decryptedInfo = decrypt(encryptedHash, key);

  const [uid, displayName, photoURL] = decryptedInfo.split("|");

  if (uid && displayName && photoURL) {
    return {
      uid,
      displayName,
      photoURL,
    };
  }

  return null;
}

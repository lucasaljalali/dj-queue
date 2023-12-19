function encrypt(text: string, key: string | undefined): string {
  let result = "";
  if (key) {
    const encodedText = Buffer.from(text, "utf-8");
    for (let i = 0; i < encodedText.length; i++) {
      result += String.fromCharCode(encodedText[i] ^ parseInt(key));
    }
  }
  return Buffer.from(result, "utf-8").toString("base64");
}

export function createUserHash(uid: string, displayName: string, photoURL: string): string {
  const key = process.env.NEXT_PUBLIC_CRYPTKEY;
  const userHash = `${uid}|${displayName}|${photoURL}`;
  const encryptedHash = encrypt(userHash, key);
  return encryptedHash;
}

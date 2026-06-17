import api from "./api";

type PasswordKeyResponse = {
  keyId: string;
  algorithm: "RSA-OAEP-256";
  publicKey: string;
};

type EncryptedPasswordPayload = {
  encryptedPassword: string;
  passwordKeyId: string;
};

let cachedPasswordKey: PasswordKeyResponse | null = null;

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window.btoa(binary);
};

const getPasswordKey = async (): Promise<PasswordKeyResponse> => {
  if (cachedPasswordKey) {
    return cachedPasswordKey;
  }

  const { data } = await api.get<PasswordKeyResponse>("/api/auth/password-key");
  cachedPasswordKey = data;
  return data;
};

export const encryptPassword = async (password: string): Promise<EncryptedPasswordPayload> => {
  const passwordKey = await getPasswordKey();
  const publicKey = await window.crypto.subtle.importKey(
    "spki",
    base64ToArrayBuffer(passwordKey.publicKey),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  );

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    new TextEncoder().encode(password)
  );

  return {
    encryptedPassword: arrayBufferToBase64(encrypted),
    passwordKeyId: passwordKey.keyId,
  };
};

import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || '';
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || '';

let imagekitInstance = null;

export const isImageKitConfigured = () => {
  return Boolean(publicKey && privateKey && urlEndpoint);
};

export const getImageKit = () => {
  if (!imagekitInstance && isImageKitConfigured()) {
    imagekitInstance = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint
    });
  }
  return imagekitInstance;
};

export default getImageKit;

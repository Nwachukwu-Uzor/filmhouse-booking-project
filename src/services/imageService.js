import { v2 as cloudinary } from "cloudinary";
import {
  cloudinaryApiKey,
  cloudinaryApiSecret,
  cloudinaryCloudName,
} from "../../config/index.js";

export const uploadImage = async (file, folder) => {
  try {
    cloudinary.config({
      cloud_name: cloudinaryCloudName,
      api_key: cloudinaryApiKey,
      api_secret: cloudinaryApiSecret,
    });

    const upload = await cloudinary.uploader.upload(file, { folder });

    return {
      url: upload?.secure_url,
      id: upload?.public_id,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

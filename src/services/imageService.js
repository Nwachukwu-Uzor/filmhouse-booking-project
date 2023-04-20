import { v2 as cloudinary } from "cloudinary";
import {
  cloudinaryApiKey,
  cloudinaryApiSecret,
  cloudinaryCloudName,
} from "../../config/index.js";

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

export const uploadImage = async (file, folder) => {
  try {
    const upload = await cloudinary.uploader.upload(file, { folder });

    return {
      url: upload?.secure_url,
      public_id: upload?.public_id,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteImage = async (public_id) => {
  try {
    const deletionResult = await cloudinary.uploader.destroy(public_id);
    if (deletionResult) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
};

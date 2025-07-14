import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    if (!fs.existsSync(localFilePath)) {
      console.error(" File does not exist:", localFilePath);
      return null;
    }
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("Cloudinary response: ->", response); // for testing purpose

    // file uploaded successfully
    // console.log("File is uploaded on CLoundinary: ", response.url); // for testing purpose only
    fs.unlinkSync(localFilePath);
    // await fs.unlink(localFilePath)
    return response;
  } catch (error) {
    console.error(" Cloudinary upload error:", error);
    fs.unlinkSync(localFilePath); // remove the locally saved temp. file as the upload operation got failed (synchornously ke liye using unlinkSync)
    return null;
  }
};

const getPublicId = (FilePath) => {
  try {
    const parts = FilePath.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    // Get everything after /upload/ (skipping version number)
    const publicPathParts = parts.slice(uploadIndex + 2);
    const lastPart = publicPathParts[publicPathParts.length - 1];

    // Remove file extension from last part
    publicPathParts[publicPathParts.length - 1] = lastPart.split(".")[0];

    return publicPathParts.join("/");
  } catch (err) {
    console.error("Error extracting public_id from URL:", err);
    throw err;
  }
};

const deleteFromCloudinary = async (prevFilePath) => {
  const publicId = getPublicId(prevFilePath);
  console.log("Prev file path: ", prevFilePath);
  console.log("Prev publicId: ", publicId);

  try {
    const isVideo = prevFilePath.includes("/video/");
    const resourceType = isVideo ? "video" : "image";

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    if (result.result === "not found") {
      console.log("File was not found");
    } else if (result.result === "ok")
      console.log("prev- File deleted Successfuly from Cloduinary!");
    return result;
  } catch (error) {
    console.log("Error while Deleting from cloudinary : ", error);

    throw error;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
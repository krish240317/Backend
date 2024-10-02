import {v2 as cloudinary } from "cloudinary"
import fs from 'fs'

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:  process.env.CLOUDINARY_API_KEY, 
        api_secret:  process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    const uploadOnCloudinary= async(localfilepath)=>{
        try{
            if(!localfilepath) return null;
            //upload file on cloudinary 
           const response = await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"

           })
           //file uploaded successfully 
           console.log("Successfully uploaded file ",response.url);
           //unlink after uploading 
           fs.unlinkSync(localfilepath)
           return response ;
        } catch(error){
            //if not get uploaded the file will be on server as there is local path
            //So ,remove that file 
            fs.unlinkSync(localfilepath);//remove the temporary locally saved file as upload fails 
            return null; 
        }
    }

    export {uploadOnCloudinary};
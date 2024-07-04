import {v2 as cloudinary} from "cloudinary";
import fs from "fs"
          
cloudinary.config({ 
    cloud_name: 'dleohgdkd', 
    api_key: '119483925944688', 
    api_secret: 'SufGZuhSkkypfp6PLeomaqFnIbI' // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath){
            return null;
        }
        //upload the file on cloudinary

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })


        fs.unlinkSync(localFilePath)
        return response
    }catch(error){
       //removing the file from our local server
       console.log(error);
       fs.unlinkSync(localFilePath)
       return null;
    }
}

export {uploadOnCloudinary}
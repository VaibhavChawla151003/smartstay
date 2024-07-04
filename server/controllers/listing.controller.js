import { Booking } from "../models/booking.model.js";
import { Listing } from "../models/listing.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// to create listing
const createListing = async (req, res) => {
    try {
        const {creator, category, type, streetAddress, aptSuite, city, province, country, guestCount, bedroomCount, bathroomCount, bedCount, amenities, title, description, highlight, highlightDesc, price } = req.body

        const listingPhotos = req.files

        if (!listingPhotos) {
            return res.status(400).send("No file uploaded")
        }

        const listingPhotoPaths = listingPhotos.map((file) => file.path)
        
        const listingPhotoUrls = [];
        for (const localFilePath of listingPhotoPaths) {
            const response = await uploadOnCloudinary(localFilePath);
            if (response && response.url) {
                listingPhotoUrls.push(response.url);
            } else {
                return res.status(500).send("Failed to upload image to Cloudinary");
            }
        }

        const newListing = new Listing({
            creator,
            category,
            type,
            streetAddress,
            aptSuite,
            city,
            province,
            country,
            guestCount,
            bedroomCount,
            bathroomCount,
            bedCount,
            amenities,
            listingPhotoUrls,
            title,
            description,
            highlight,
            highlightDesc,
            price
        })

        await newListing.save()

        res.status(200).json(newListing)
    } catch (error) {
        res.status(409).json({message: "Failed to create listing", error: error.message})
        console.log(error);
    }
}

//to get listings by category

const getListings = async (req, res) => {
    const qCategory = req.query.category
    try {
       
        let listings 

        if(qCategory){
            listings = await Listing.find({category:qCategory}).populate("creator")
        }else{
            listings = await Listing.find().populate("creator")
        }
        res.status(200).json(listings)
    } catch (error) {
         res.status(409).json({message: "Failed to fetch listings", error: error.message})
        console.log(error);
    }
}

//to get listings by search

const getListingsBySearch = async (req, res) => {
    const {search} = req.params
    try {
        let listings = []
    
        if (search === "all") {
          listings = await Listing.find().populate("creator")
        } else {
          listings = await Listing.find({
            $or: [
              { category: {$regex: search, $options: "i" } },
              { title: {$regex: search, $options: "i" } },
            ]
          }).populate("creator")
        }
    
        res.status(200).json(listings)
      } catch (error) {
        res.status(404).json({ message: "Fail to fetch listings", error: error.message })
        console.log(error)
      }
}


const getListingDetails = async (req, res) => {
    try {
        const { listingId } = req.params

        const listing = await Listing.findById(listingId).populate("creator")
        
        res.status(200).json(listing)
    } catch (error) {
        res.status(200).json({message:"listing cannot be found",error:error.message})
        console.log(error);
    }
}

const deleteListing = async (req, res) => {
    try {
        const { listingId } = req.params;
        const booking = await Booking.findOne({listingId : listingId})
        
        if(booking){
            const deleteBook = await Booking.findOneAndDelete({listingId : listingId})
        }

        const listing = await Listing.findByIdAndDelete(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

         
        res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Listing cannot be deleted", error: error.message });
        console.log(error);
    }
};

export { createListing , getListings , getListingDetails , getListingsBySearch , deleteListing}
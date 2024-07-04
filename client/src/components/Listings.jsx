import { useEffect, useState } from "react";
import { categories } from "../data";
import "../styles/Listings.scss";
import ListingCard from "./ListingCard";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";
import axios from 'axios'

const Listings = () => {
    const [selectedCategory, setSelectedCategory] = useState("All")
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const listings = useSelector((state) => state.listings)

    const getFeedlistings = async () => {
        try {
            const response = await axios.get(selectedCategory !== "All" ? `http://localhost:8000/api/v1/listings?category=${selectedCategory}` : "http://localhost:8000/api/v1/listings")
            const data = response.data
            dispatch(setListings({ listings: data }))
            setLoading(false)
        } catch (error) {
            console.log("Fetch listings failed", error.message);
        }
    }

    useEffect(() => {
        getFeedlistings()
    }, [selectedCategory]);

    return (
        <>
            <div className="category-list">
                {categories?.map((category, index) => (
                    <div
                        className={`category ${category.label === selectedCategory ? "selected" : ""}`}
                        key={index}
                        onClick={() => setSelectedCategory(category.label)}
                    >
                        <div className="category_icon">{category.icon}</div>
                        <p>{category.label}</p>
                    </div>
                ))}
            </div>
        
            {loading ? (
                <Loader />
            ) : (
                <div className="listings">
                    {listings.map(
                        ({
                            _id,
                            creator,
                            listingPhotoUrls,
                            city,
                            province,
                            country,
                            category,
                            type,
                            price,
                            booking = false
                        }) => (
                            <ListingCard
                                listingId={_id}
                                creator={creator}
                                listingPhotoUrls={listingPhotoUrls} 
                                city={city}
                                province={province}
                                country={country}
                                category={category}
                                type={type}
                                price={price}
                                booking={booking}
                            />
                        )
                    )}
                </div>
            )} 
        </>
    )
}

export default Listings
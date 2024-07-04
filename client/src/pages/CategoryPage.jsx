import React from 'react'
import { useState, useEffect } from "react";
import "../styles/List.scss";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import Loader from "../components/Loader";
import ListingCard from "../components/ListingCard";
import axios from 'axios';
import Footer from "../components/Footer";

const CategoryPage = () => {
    const [loading, setLoading] = useState(true)

    const { category } = useParams()

    const dispatch = useDispatch()
    const listings = useSelector((state) => state.listings)

    const getFeedlistings = async () => {
        try {
            const response = await axios.get(`https://smartstay-2.onrender.com/api/v1/listings?category=${category}`)
            const data = response.data
            dispatch(setListings({ listings: data }))
            setLoading(false)
        } catch (error) {
            console.log("Fetch listings failed", error.message);
        }
    }

    useEffect(() => {
        getFeedlistings()
    }, [category]);
    
    return loading ? (
        <Loader />
    ) : (
        <>
            <Navbar />
            <h1 className="title-list">{category} listings</h1>
            <div className="list">
                {listings.length ? listings?.map(
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
                        booking = false,
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
                ): <img src="https://cdn.dribbble.com/users/745861/screenshots/7889509/nothing_here_yet_4x.png" alt=''/>}
            </div>
            <Footer/>
        </>
    );
}

export default CategoryPage
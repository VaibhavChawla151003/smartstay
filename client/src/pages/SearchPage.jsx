import React from 'react'
import { useParams } from "react-router-dom";
import "../styles/List.scss"
import { useSelector,useDispatch  } from "react-redux";
import { setListings } from "../redux/state";
import { useEffect, useState } from "react";
import Loader from "../components/Loader"
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import axios from 'axios';
import Footer from "../components/Footer";


const SearchPage = () => {

    const [loading, setLoading] = useState(true)
    const { search } = useParams()
    const listings = useSelector((state) => state.listings)
  
    const dispatch = useDispatch()
  
    const getSearchListings = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/listings/search/${search}`)
  
        const data = response.data
        dispatch(setListings({ listings: data }))
        setLoading(false)
      } catch (error) {
        console.log("Fetch Search List failed!", error.message)
      }
    }
   
    useEffect(() => {
      getSearchListings()
    }, [search])
    
    return loading ? <Loader /> : (
        <>
          <Navbar />
          <h1 className="title-list">{search}</h1>
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

export default SearchPage
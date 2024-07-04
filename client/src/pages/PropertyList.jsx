import React from 'react'
import "../styles/List.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useEffect, useState } from "react";
import { setPropertyList } from "../redux/state";
import Loader from "../components/Loader";
import axios from 'axios';
import Footer from "../components/Footer";


const PropertyList = () => {
    const [loading,setLoading] = useState(true)
    const user = useSelector((state) => state.user)

    const dispatch = useDispatch()
    const propertyList = user?.propertyList

    const getPropertyList = async( ) =>{
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/users/${user._id}/properties`);
            const data = response.data

            dispatch(setPropertyList(data))

            setLoading(false)
        } catch (error) {
            console.log("Fetch all properties failed",error.message
            );
        }
    }

    useEffect(()=>{
        getPropertyList()
    },[])
    return loading ? <Loader /> : (
        <>
          <Navbar />
          <h1 className="title-list">Your Property List</h1>
          <div className="list">
            {propertyList.length ? propertyList?.map(
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

export default PropertyList
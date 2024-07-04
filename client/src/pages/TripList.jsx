import React from 'react'
import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import axios from 'axios'
import { setTripList } from '../redux/state';
import Footer from "../components/Footer";


const TripList = () => {

    const [loading,setLoading] = useState(true)
    const dispatch = useDispatch()
    const userId = useSelector((state) => state.user._id)
    const tripList = useSelector((state) => state.user.tripList)

    const getTripList = async() => {
        try {
            const response = await axios.get(`https://smartstay-2.onrender.com/api/v1/users/${userId}/trips`)
            const data = response.data

            dispatch(setTripList(data))

            setLoading(false)
    
        } catch (error) {
            console.log("Fetch trip list failed",error);
            setLoading(false)
        } 
    } 
    
    useEffect(()=>{
       getTripList()
    },[])

    return loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <h1 className="title-list">Your Trip List</h1>
          <div className="list"> 
            {tripList.length ? tripList?.map(({ listingId, hostId, startDate, endDate, totalPrice, booking=true }) => (
              <ListingCard
                listingId={listingId._id}
                creator={hostId._id}
                listingPhotoUrls={listingId.listingPhotoUrls}
                city={listingId.city}
                province={listingId.province}
                country={listingId.country}
                category={listingId.category}
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
                booking={booking}
              />
            )) : <img src="https://cdn.dribbble.com/users/745861/screenshots/7889509/nothing_here_yet_4x.png" alt=''/>}
          </div>
          <Footer/>
        </>
      )
}

export default TripList
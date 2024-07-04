import React from 'react'
import "../styles/List.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useEffect, useState } from "react";
import { setReservationList } from "../redux/state";
import Loader from "../components/Loader";
import axios from 'axios';
import Footer from "../components/Footer";


const ReservationList = () => {
    const [loading,setLoading] = useState(true)
    const user = useSelector((state) => state.user)

    const dispatch = useDispatch()
    const reservationList = user?.reservationList

    const getReservationList = async( ) =>{
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/users/${user._id}/reservations`);
            const data = response.data

            dispatch(setReservationList(data))

            setLoading(false)
        } catch (error) {
            console.log("Fetch reservation list failed",error.message
            );
        }
    }

    useEffect(()=>{
        getReservationList()
    },[])
    return loading ? <Loader /> : (
        <>
          <Navbar />
          <h1 className="title-list">Your Reservation List</h1>
          <div className="list">
          {reservationList.length ? reservationList?.map(({ listingId, hostId, startDate, endDate, totalPrice, booking=true }) => (
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
        )): <img src="https://cdn.dribbble.com/users/745861/screenshots/7889509/nothing_here_yet_4x.png" alt=''/>}
          </div>
          <Footer/>
        </>
      );
    
}

export default ReservationList
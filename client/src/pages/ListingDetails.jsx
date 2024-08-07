import React from 'react'
import { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { DateRange } from 'react-date-range';
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer"
import axios from 'axios'

const ListingDetails = () => {
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
    const user = useSelector((state) => state.user)


    const { listingId } = useParams()
    
    const [listing, setListing] = useState(null)
    
    const getListingDetails = async () => {
        try {
            const response = await axios.get(`https://smartstay-2.onrender.com/api/v1/listings/${listingId}`)
            setListing(response.data)

            setLoading(false)
        } catch (error) {
            console.log("Fetch listing details failed", error.message);
        }
    }

   console.log(listing)
    useEffect(() => {
        getListingDetails()
    }, [])

    /*  BOOKING CALENDAR */

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection"
        }
    ])

    const handleSelect = (ranges) => {
        //update the selected date range when user makes a selection

        setDateRange([ranges.selection])
    }

    const start = new Date(dateRange[0].startDate)
    const end = new Date(dateRange[0].endDate)
    const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24)

    /* Submit booking */

    const customerId = useSelector((state) => state?.user?._id)
     
    const handleSubmit = async () => {
        if (!user) {
            navigate('/login')
        }
        try {
            const bookingForm = {
                customerId,
                listingId,
                hostId: listing.creator._id,
                startDate: dateRange[0].startDate.toDateString(),
                endDate: dateRange[0].endDate.toDateString(),
                totalPrice: listing.price * dayCount,
            }

            const response = await axios.post("https://smartstay-2.onrender.com/api/v1/bookings/create", bookingForm);

            console.log(response.status);
            if (response.status === 200) {
                navigate(`/${customerId}/trips`)
            }
        } catch (error) {
            console.log("Submit booking failed", error.message);
        }
    }
    return loading ? <Loader /> : (
        <>
            <Navbar />

            <div className="listing-details">
                <div className="title">
                    <h1>{listing.title}</h1>
                    <div></div>
                </div>

                <div className="photos">
                    {listing.listingPhotoUrls?.map((item) => (
                        <img
                            src={item}
                            alt="listing photo"
                        />
                    ))}
                </div>

                <h2>
                    {listing.type} in {listing.city}, {listing.province},{" "}
                    {listing.country}
                </h2>
                <p>
                    {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
                    {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
                </p>
                <hr />

                <div className="profile">
                    <img
                        src={listing.creator.profileImagePath}
                        alt=""
                    />
                    <h3>
                        Hosted by {listing.creator.firstName} {listing.creator.lastName}
                    </h3>
                </div>
                <hr />

                <h3>Description</h3>
                <p>{listing.description}</p>
                <hr />

                <h3>{listing.highlight}</h3>
                <p>{listing.highlightDesc}</p>
                <hr />

                <div className="booking">
                    <div>
                        <h2>What this place offers?</h2>
                        <div className="amenities">
                            {listing.amenities[0].split(",").map((item, index) => (
                                <div className="facility" key={index}>
                                    <div className="facility_icon">
                                        {
                                            facilities.find((facility) => facility.name === item)
                                                ?.icon
                                        }
                                    </div>
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {listing.creator._id !== user._id && (<div>
                        <h2>How long do you want to stay?</h2>
                        <div className="date-range-calendar">
                            <DateRange ranges={dateRange} onChange={handleSelect} />
                            {dayCount > 1 ? (
                                <h2>
                                    ${listing.price} x {dayCount} nights
                                </h2>
                            ) : (
                                <h2>
                                    ${listing.price} x {dayCount} night
                                </h2>
                            )}

                            <h2>Total price: ${listing.price * dayCount}</h2>
                            <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
                            <p>End Date: {dateRange[0].endDate.toDateString()}</p>
                            {user ? (
                                <button disabled={!user} className="button" type="submit" onClick={handleSubmit}>
                                   BOOKING
                               </button>
                            ) : (
                                <button className="button" type="submit" onClick={navigate('/login')}>
                                   LOGIN TO BOOK
                               </button>
                            )}
                           
                        </div>
                    </div>)}
                    
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ListingDetails
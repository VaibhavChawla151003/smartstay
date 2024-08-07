import { useState } from "react";
import "../styles/ListingCard.scss";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";
import axios from 'axios'

const ListingCard = ({
  listingId,
  creator,
  listingPhotoUrls,
  city,
  province,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking
}) => {
  /* SLIDER FOR IMAGES */
  
  const [currentIndex,setCurrentIndex] = useState(0)
   const navigate = useNavigate()
   const dispatch = useDispatch()
  const goToPrevSlide = () =>{
    setCurrentIndex((prevIndex) => (prevIndex -1 + listingPhotoUrls.length) % listingPhotoUrls.length)
  }

  const goToNextSlide = () =>{
    setCurrentIndex((prevIndex) => (prevIndex +1) % listingPhotoUrls.length)
  }

  const user = useSelector((state) => state.user)
  const wishList = user?.wishList || []

  const isLiked = wishList.find((item) => item?._id === listingId)

  const patchWishList = async ()=>{

    if(user?._id !== creator._id){
      const response = await axios.patch(`https://smartstay-2.onrender.com/api/v1/users/${user?._id}/${listingId}`)
      const data = response.data.wishList
      dispatch(setWishList(data));
    }else{
      return ;
    }
   
  }
  return (
    <div
      className="listing-card"
      onClick={() => {
        navigate(`/listings/${listingId}`);
      }}
    >
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoUrls?.map((photo, index) => (
            <div key={index} className="slide">
              <img
                src={photo}
                alt={`photo ${index + 1}`}
              />
              <div
                className="prev-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide(e);
                }}
              > 
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div
                className="next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide(e);
                }}
              > 
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3>
        {city}, {province}, {country}
      </h3>
      <p>{category}</p>
      {!booking ? (
        <>
          <p>{type}</p>
          <p>
            <span>${price}</span> per night
          </p>
        </>
      ) : (
        <>
          <p>
            {startDate} - {endDate}
          </p>
          <p>
            <span>${totalPrice}</span> total
          </p>
        </>
      )}

      <button
        className="favorite"
        onClick={(e) => {
          e.stopPropagation();
          patchWishList();
        }}
        disabled={!user}
      >
        {isLiked ? (
          <Favorite sx={{ color: "red" }} />
        ) : (
          <Favorite sx={{ color: "white" }} />
        )}
      </button>
    </div>
  );
};

export default ListingCard;
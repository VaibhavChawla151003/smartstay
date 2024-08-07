import "../styles/List.scss";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
const WishList = () => {
  const wishList = useSelector((state) => state.user.wishList);

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Wish List</h1>
      <div className="list">
        {wishList.length ? wishList?.map(
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
};

export default WishList;
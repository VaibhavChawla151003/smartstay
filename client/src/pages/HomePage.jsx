import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Slide from '../components/Slide'
import Categories from '../components/Categories'
import Listings from '../components/Listings'
import Footer from "../components/Footer";
import { useDispatch, useSelector } from 'react-redux'
import { setUsers } from '../redux/state'
import axios from 'axios'

const HomePage = () => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  const users = useSelector((state) => state.users)
    console.log(users.length);
    const getAllUsers = async () => {
        try {
            
            const response = await axios.get("https://smartstay-2.onrender.com/api/v1/users")
            const data = response.data
            dispatch(setUsers(data))

        } catch (error) {
            console.log("Fetch Users failed", error.message);
        }
    }

    useEffect(()=>{
      getAllUsers();
    },[])
  return (
    <div>
      <Navbar/>
      <Slide/>
      <Categories/>
      <Listings/>
      <Footer/>
    </div>
  )
}

export default HomePage
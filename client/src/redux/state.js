import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    user:null,
    accessToken:null,
    refreshToken:null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        setLogin:(state,action) =>{
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
        },
        setLogout: (state) =>{
            state.user = null
            state.accessToken = null
            state.refreshToken = null
        },
        setListings: (state,action) =>{
            state.listings = action.payload.listings
        },
        setTripList: (state,action) =>{
            state.user.tripList = action.payload
        },
        setWishList: (state,action) =>{
            state.user.wishList = action.payload
        },
        setPropertyList: (state,action) =>{
            state.user.propertyList = action.payload
        },
        setReservationList: (state,action) =>{
            state.user.reservationList = action.payload
        }
    } 
})

export const {setLogout,setLogin,setListings,setTripList,setWishList,setPropertyList,setReservationList} = userSlice.actions
export default userSlice.reducer



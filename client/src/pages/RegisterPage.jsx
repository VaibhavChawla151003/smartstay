import React, { useEffect, useState } from 'react'
import "../styles/Register.scss"
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const RegisterPage = () => {

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        profileImage: null
    });
 
    const handleChange = (e) =>{
        const {name , value , files} = e.target
        setFormData({
            ...formData,
            [name] : value,
            [name] : name === "profileImage" ? files[0] : value
        })
    }

    const [passwordMatch,setPasswordMatch] = useState(true)

    useEffect(()=>{
       setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "")
    },[formData.password, formData.confirmPassword])
    
    const handleSubmit = async(e) =>{
       e.preventDefault()
       
       try {
         const register_form = new FormData()

         for(var key in formData){
            register_form.append(key,formData[key])
         }

         const response = await axios.post("http://localhost:8000/api/v1/users/register",register_form)

         if(response.status === 200){
            navigate('/login')
         }
       } catch (error) {
          console.log("Registration failed",error.message);
       }
    }

    return (
        <div className="register">
            <div className="register_content">
                <form className="register_content_form" onSubmit={handleSubmit}>
                    <input
                        placeholder="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        placeholder="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        placeholder="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        required
                    />
                    <input
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        type="password"
                        required
                    />

                    <input
                        id="image"
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                        required
                    />

                    <label htmlFor="image">
                        <img src="/assets/addImage.png" alt="" />
                        <p>Upload Your Photo</p>
                    </label>
 
                    {
                        formData.profileImage && (
                            <img src={URL.createObjectURL(formData.profileImage)} alt="" style={{maxWidth: "80px"}}/>
                        )
                    }
                    <button type="submit" disabled={!passwordMatch}>REGISTER</button>
                </form>

                {
                    !passwordMatch && (
                        <p style={{color:'red'}}>Passwords are not matched!</p>
                    )
                }
                <a href="/login">Already have an account? Log In Here</a>
            </div>
        </div>
    )
}

export default RegisterPage
import React, { useState } from 'react';
import "../styles/Login.scss";
import { setLogin } from '../redux/state';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://smartstay-2.onrender.com/api/v1/users/login", { email, password }, {
        withCredentials: true // Include credentials in this request
    });
      
      if (response.status === 200) {
        
        const { accessToken, refreshToken, loggedInUser } = response.data;

        dispatch(
          setLogin({
            user: loggedInUser,
            accessToken: accessToken,
            refreshToken: refreshToken,
          })
        );

        navigate('/');
      }
    } catch (error) {
      toast.error("Login failed: " + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="login">
      <ToastContainer />
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">LOG IN</button>
        </form>
        <a href="/register">Don't have an account? Sign Up Here</a>
      </div>
    </div>
  );
};

export default LoginPage;

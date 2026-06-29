import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import authApi from "../../api/authApi";

import "./CustomerAuth.css";


function CustomerRegister() {


  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);



  const [form, setForm] = useState({

    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    district: "",
    address: ""

  });



  const handleChange = (e) => {


    setForm({

      ...form,

      [e.target.name]: e.target.value

    });


  };




  const handleSubmit = async (e) => {


    e.preventDefault();



    if(
      !form.name ||
      !form.email ||
      !form.password ||
      !form.phoneNumber ||
      !form.district ||
      !form.address
    ){

      toast.error("Please fill all fields");

      return;

    }



    try {


      setLoading(true);



      const payload = {


        name: form.name,

        email: form.email,

        password: form.password,

        phoneNumber: form.phoneNumber,

        district: form.district,

        address: form.address,

        role: "CUSTOMER"


      };



      await authApi.register(payload);



      toast.success(
        "Customer Registration Successful"
      );



      navigate("/customer/login");



    }

    catch(error){


      console.error(error);



      toast.error(

        error.response?.data?.message ||

        "Registration Failed"

      );


    }

    finally{


      setLoading(false);


    }


  };





  return (


    <Box className="customer-auth-container">



      <Paper

        elevation={8}

        className="customer-auth-card"

      >



        <Typography

          variant="h4"

          className="customer-title"

        >

          🌾 UZHAVAN

        </Typography>



        <Typography

          align="center"

        >

          Customer Registration

        </Typography>





        <form onSubmit={handleSubmit}>


          <TextField

            fullWidth

            margin="normal"

            label="Full Name"

            name="name"

            value={form.name}

            onChange={handleChange}

          />





          <TextField

            fullWidth

            margin="normal"

            label="Email"

            name="email"

            type="email"

            value={form.email}

            onChange={handleChange}

          />





          <TextField

            fullWidth

            margin="normal"

            label="Phone Number"

            name="phoneNumber"

            value={form.phoneNumber}

            onChange={handleChange}

          />





          <TextField

            fullWidth

            margin="normal"

            label="District"

            name="district"

            value={form.district}

            onChange={handleChange}

          />





          <TextField

            fullWidth

            margin="normal"

            label="Address"

            name="address"

            multiline

            rows={3}

            value={form.address}

            onChange={handleChange}

          />





          <TextField

            fullWidth

            margin="normal"

            label="Password"

            type="password"

            name="password"

            value={form.password}

            onChange={handleChange}

          />






          <Button

            fullWidth

            type="submit"

            variant="contained"

            className="customer-button"

            disabled={loading}

          >


            {

              loading ?

              <CircularProgress

                size={24}

                color="inherit"

              />

              :

              "REGISTER"

            }



          </Button>



        </form>





        <Typography

          align="center"

          sx={{mt:3}}

        >


          Already have an account?


          {" "}


          <Link to="/customer/login">

            Login

          </Link>



        </Typography>




      </Paper>



    </Box>



  );


}


export default CustomerRegister;
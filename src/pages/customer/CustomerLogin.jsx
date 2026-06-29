import React, {useState} from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    CircularProgress
} from "@mui/material";

import {Link,useNavigate} from "react-router-dom";

import {toast} from "react-toastify";

import authApi from "../../api/authApi";

import "./CustomerAuth.css";


function CustomerLogin(){

const navigate = useNavigate();


const [loading,setLoading]=useState(false);


const [form,setForm]=useState({

email:"",
password:""

});


const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};



const handleSubmit=async(e)=>{

e.preventDefault();


try{

setLoading(true);


const response =
await authApi.login({

...form,

role:"CUSTOMER"

});


localStorage.setItem(
"token",
response.data.token
);
localStorage.setItem(
"role",
"CUSTOMER"
);
localStorage.setItem(
"userId",
response.data.id || ""
);
localStorage.setItem(
"user",
JSON.stringify(response.data.user || {})
);


toast.success("Login Successful");


navigate("/customer/dashboard");


}

catch(error){

toast.error(
error.response?.data?.message ||
"Login Failed"
);

}

finally{

setLoading(false);

}


};



return(

<Box className="customer-auth-container">


<Paper className="customer-auth-card"
elevation={8}>


<Typography
variant="h4"
className="customer-title"
>

🌾 UZHAVAN

</Typography>



<Typography align="center">

Customer Login

</Typography>



<form onSubmit={handleSubmit}>


<TextField

fullWidth

margin="normal"

label="Email"

name="email"

value={form.email}

onChange={handleChange}

/>



<TextField

fullWidth

margin="normal"

type="password"

label="Password"

name="password"

value={form.password}

onChange={handleChange}

/>



<Button

fullWidth

type="submit"

variant="contained"

className="customer-button"

>


{

loading ?

<CircularProgress size={24}/>

:

"LOGIN"

}


</Button>



</form>



<Typography
align="center"
sx={{mt:2}}
>

Don't have account?

{" "}

<Link to="/customer/register">

Register

</Link>


</Typography>



</Paper>


</Box>

);

}


export default CustomerLogin;
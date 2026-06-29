import React,{useState} from "react";


import {

Box,

Paper,

Typography,

TextField,

Button,

MenuItem,

CircularProgress

} from "@mui/material";


import {

Link,

useNavigate

} from "react-router-dom";


import {toast} from "react-toastify";


import authApi from "../../api/authApi";


import "./Register.css";


import registerBg from "../../assets/images/uzhavan.png";



function Register(){



const navigate=useNavigate();


const [loading,setLoading]=useState(false);



const [form,setForm]=useState({

name:"",

email:"",

password:"",

confirmPassword:"",

phoneNumber:"",

district:"",

village:"",

address:"",

role:"FARMER"

});





const handleChange=(e)=>{


setForm({

...form,

[e.target.name]:e.target.value

});


};





const handleSubmit=async(e)=>{


e.preventDefault();



if(

!form.name ||

!form.email ||

!form.password ||

!form.phoneNumber ||

!form.district ||

!form.village ||

!form.address

){

toast.error(
"Please fill all fields"
);

return;

}





if(form.password!==form.confirmPassword){


toast.error(
"Passwords do not match"
);


return;

}





try{


setLoading(true);



const payload={


name:form.name,

email:form.email,

password:form.password,

phoneNumber:form.phoneNumber,

district:form.district,

village:form.village,

address:form.address,

role:"FARMER",

approved:false


};




await authApi.register(payload);



toast.success(
"Farmer Registration Successful"
);



navigate("/login");



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





return(


<Box


className="registerContainer"


style={{


backgroundImage:`url(${registerBg})`,


backgroundSize:"cover",


backgroundPosition:"center",


minHeight:"100vh",


display:"flex",


justifyContent:"center",


alignItems:"center"


}}



>



<Paper

elevation={8}

className="registerCard"

>




<Typography

variant="h4"

className="registerTitle"

>

🌾 UZHAVAN

</Typography>




<Typography

className="registerSubTitle"

>

Farmer Registration

</Typography>





<form onSubmit={handleSubmit}>



<TextField

fullWidth

margin="normal"

label="Name"

name="name"

value={form.name}

onChange={handleChange}

/>



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



<TextField

fullWidth

margin="normal"

type="password"

label="Confirm Password"

name="confirmPassword"

value={form.confirmPassword}

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

label="Village"

name="village"

value={form.village}

onChange={handleChange}

/>



<TextField

fullWidth

margin="normal"

label="Address"

name="address"

multiline

rows={2}

value={form.address}

onChange={handleChange}

/>





<TextField

select

fullWidth

margin="normal"

label="Register As"

value="FARMER"

disabled

>


<MenuItem value="FARMER">

Farmer

</MenuItem>


</TextField>





<Button

fullWidth

variant="contained"

type="submit"

className="registerBtn"


>


{

loading

?

<CircularProgress

size={24}

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


Already have account?


{" "}


<Link to="/login">

Login

</Link>


<br/>


<Typography sx={{mt:2}}>


Are you a customer?


{" "}


<Link to="/customer/register">

Register as Customer

</Link>


</Typography>



</Typography>





</Paper>



</Box>



);


}


export default Register;
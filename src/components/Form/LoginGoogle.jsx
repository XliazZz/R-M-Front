import { GoogleLogin } from "@react-oauth/google";
import decodedJwt from "../../utils/decoded"
import axios from "axios"; 
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import AlertError from "../AlertError/AlertError";
import AlertSuccess from "../AlertSuccess/AlertSuccess";

const LoginGoogle = () => {
  const navigate = useNavigate();

  const [errores, setErrores] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleError = () => {
    console.log("Login failed");
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/loading');
      }, 1000); 
    }
  }, [success, navigate]);

  const handleSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      const token = credentialResponse.credential;
      const { payload } = decodedJwt(token);

      const { email} = payload;
      
      try {
        const URL = 'https://r-m-back-production.up.railway.appapi/signingoogle';
        let endpoint = URL;
        if (email) {
          endpoint += `?email=${email}`;
        } 
        else {
          console.error('Email is required.');
          return;
        }
    
        const { data } = await axios.get(endpoint);
        const { token } = data; 
        localStorage.setItem('token', token); 
        setSuccess(true);
        setErrores(null);
      } catch (error) {
        setErrores(error.response.data.msg);
        setSuccess(false);
      }
    }
  };

  return(
    <>
      {errores && success === false && (
        <div >
          <AlertError error={errores} />
        </div>
      )}

      {errores === null && success && (
        <div >
          <AlertSuccess texto={"Log In success"} />
        </div>
      )}

      <GoogleLogin 
        theme="filled_black"
        size="medium"
        text="signup_with"
        shape="circle"
        locale="en"
        useOneTap
        onError={handleError}
        onSuccess={handleSuccess}
      />
    </>
  );
}; 

export default LoginGoogle;
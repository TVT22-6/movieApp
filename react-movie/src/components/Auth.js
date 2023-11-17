import {useState } from "react";

import { jwtToken, userData } from "./Signals";
import axios from "axios";
import '../styles/Settings.css';
function Login() {

    return (
      <div>
        <UserInfo/>
        { jwtToken.value.length === 0 ? <LoginForm/> : 
          <button onClick={() => jwtToken.value = ''}>Logout</button>}
      </div>
    );
  }

  function UserInfo(){

    return(
      <div>
        {jwtToken.value ? <h1>{userData.value?.private}</h1> : <div className="status-message"><h1>You are guest</h1></div>}
      </div>
    )
  }

  function LoginForm(){

    const [uname, setUname] = useState('');
    const [pw, setPw] = useState('');

    

    function login(){
      axios.postForm('http://localhost:3001/user/login', {uname,pw})
      .then(resp => {
        jwtToken.value = resp.data.jwtToken;
        localStorage.setItem('jwtToken', resp.data.jwtToken); // Storing the token in local storage
      })
        .catch(error => console.log(error.response.data))
    }

    return(

        <div className="box login-box">
            <h2>Log In</h2>
            <label htmlFor="username">Username: </label>
            <input type="text" id="username" value={uname} onChange={e => setUname(e.target.value)}/>
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" value={pw} onChange={e => setPw(e.target.value)}/>
            <button onClick={login}>Login</button>
        </div>
    );
  }

export {Login};

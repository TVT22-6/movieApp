import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./Contexts";
import { jwtToken, userData } from "./Signals";
import axios from "axios";

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
        {jwtToken.value ? <h1>{userData.value?.private}</h1> : <h1>You are guest</h1>}
      </div>
    )
  }

  function LoginForm(){

    const [uname, setUname] = useState('');
    const [pw, setPw] = useState('');

    function login(){
      axios.postForm('http://localhost:3001/user/login', {uname,pw})
        .then(resp => jwtToken.value = resp.data.jwtToken )
        .catch(error => console.log(error.response.data))
    }

    return(
      <div>
        <input value={uname} onChange={e => setUname(e.target.value)}/>
        <input value={pw} onChange={e => setPw(e.target.value)}/>
        <button onClick={login}>Login</button>
      </div>
    );
  }

export {Login};
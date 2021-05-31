import React, { useState } from 'react';
//import express from 'express';
import { NavLink, useHistory } from 'react-router-dom';
//import '../CSS/Signup.css'
//import './mainStyle.css';



const AdminLogin = () => {

  const history = useHistory();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  let name, value;//(#28 8:20)
  const handleInupts = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  }

  const PostData = async () => {//(e)
    // e.preventDefault();
    const {username, password} = user;//Obj destructuring
    const res = await fetch("http://localhost:5000/signinAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName: username,password
      })
    });

    const data = await res.json();
    if (res.status === 422 || !data) {
      console.log(data)
      window.alert("Invalid Registration");
      console.log("Invalid Registration");
    } else{
      window.alert(" Login Successful");
      console.log(" Login Successful");
      window.location.href = "/results.html";
      //history.push("/results.html");
    }
  }

  function validateForm(e) {
    e.preventDefault();
    var error = 0;

    var b = document.forms["createNew_user"]["username"].value;
    document.getElementById('username_error').innerHTML = '';
    if (b === null || b === "") {
      // alert("Email must be filled out");
      error++;
      document.getElementById('username_error').innerHTML = 'User Name must be filled out';
    }


    var e = document.forms["createNew_user"]["password"].value;
    document.getElementById('password_error').innerHTML = '';
    if (e === null || e === "") {
      // alert("Roll no must be filled out");
      error++;
      document.getElementById('password_error').innerHTML = 'Please fill the Password';
    }

    if (error === 0) {
      PostData();
    }

  }


  return (
    <div class="create-account-whole-page">
      <div class="create-account-container" id="admin-login-container">
        <div class="title">Administrator Login</div>
        <form method="POST" name="createNew_user" className="register-form" id="register-form">
          <div class="create-account-user-details">
          <div class="create-account-input-box">
              <p>Don't have an account? <a href="/AdminSignup">Sign Up</a></p>
            </div>
            <div class="create-account-input-box">
              <span>Username</span>
              <input type="username" name="username" id="username"
                value={user.username}
                onChange={handleInupts}
                placeholder="Your username"
              />
              <p class="error" id="username_error"></p>
            </div>


            <div class="create-account-input-box">
              <span>Password</span>
              <input type="password" name="password" id="password"
                value={user.password}
                onChange={handleInupts}
                placeholder="Your password"
              />
              <p class="error" id="password_error"></p>
            </div>

            <div class="create-account-input-box">
              <input type="submit" name="login" id="login" value="Login"
                class="create_account"
                onClick={validateForm}
              />
            </div>
            {/* <button onClick={PostData}>Take the Shot!</button>  */}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
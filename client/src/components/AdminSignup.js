import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';


const AdminSignup = () => {
  const history = useHistory();
  const [user, setUser] = useState({
    name: "",
    username: "",
    password: "",
    cpassword: ""
  });

  let name, value;
  const handleInupts = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  }

  const PostData = async () => {
    const { name, username, password, cpassword } = user;//Obj destructuring
    const res = await fetch("http://localhost:5000/adminRegister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,userName: username,password, cpassword
      })
    });

    const data = await res.json();
    if (res.status === 422 || !data) {
      console.log(data)
      window.alert("Invalid Registration");
      console.log("Invalid Registration");
    } else if (res.status === 201) {
      window.alert(" Registration Successful");
      console.log(" Registration Successful");
      window.location.href = "/results.html";
    }
  }

  function validateForm(e) {
    e.preventDefault();
    var error = 0;
    var a = document.forms["createNew_user"]["name"].value;
    document.getElementById('name_error').innerHTML = '';
    if (a === null || a === "") {
      error++;
      document.getElementById('name_error').innerHTML = 'Name must be filled out';
    }

    var b = document.forms["createNew_user"]["username"].value;
    document.getElementById('username_error').innerHTML = '';
    if (b === null || b === "") {
      error++;
      document.getElementById('username_error').innerHTML = 'User Name must be filled out';
    }


    var e = document.forms["createNew_user"]["password"].value;
    document.getElementById('password_error').innerHTML = '';
    if (e === null || e === "") {
      error++;
      document.getElementById('password_error').innerHTML = 'Please fill the Password';
    }

    var f = document.forms["createNew_user"]["cpassword"].value;
    document.getElementById('cpassword_error').innerHTML = '';
    if (f === null || f === "") {
      error++;
      document.getElementById('cpassword_error').innerHTML = 'Please confirm your Password';
    } else if (f !== e) {
      document.getElementById('cpassword_error').innerHTML = 'Passwords Dont Mach';
    }

    if (error === 0) {
      PostData();
    }

  }


  return (
    <div class="create-account-whole-page">
      <div class="create-account-container">
        <div class="title">Create Account</div>

        <form method="POST" name="createNew_user" className="register-form" id="register-form">
          <div class="create-account-user-details">

            <div class="create-account-input-box">
              <p>Already have an account? <a href="/AdminLogin">Login</a></p>
            </div>
            <div class="create-account-input-box">
              <span>Full name</span>
              <input type="text" name="name" id="name"
                value={user.name}
                onChange={handleInupts}
                placeholder="Your Name"
              />
              <p class="error" id="name_error"></p>
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
              <span>Set password</span>
              <input type="password" name="password" id="password"
                value={user.password}
                onChange={handleInupts}
                placeholder="Your password"
              />
              <p class="error" id="password_error"></p>
            </div>

            <div class="create-account-input-box">
              <span>Confirm password</span>
              <input type="password" name="cpassword" id="cpassword"
                value={user.cpassword}
                onChange={handleInupts}
                placeholder="Confirm password"
              />
              <p class="error" id="cpassword_error"></p>
            </div>

            <div class="create-account-input-box">
              <input type="submit" name="signup" id="signup" value="Sign Up"
                class="create_account"
                onClick={validateForm}
              />
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminSignup
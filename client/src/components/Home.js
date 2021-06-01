import React, { useState } from 'react';
import img1 from "../images/login_background.jpg"
import { NavLink, useHistory } from 'react-router-dom';


const Home = () => {

  const history = useHistory();
  const [voter, setVoter] = useState('');
  const [password, setPassword] = useState('');
  const [uniqueProjectId, setuniqueProjectId] = useState('');

  const loginUser = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/signin', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }, body: JSON.stringify({
        voterID: voter, password
      })
    });
    const data = res.json();
    if (res.status === 400 || !data) {
      window.alert("Invalid Credentials");
    } else{
      sessionStorage.setItem('voter', voter);
      window.location.href = "/vote.html";
    }
  }
  function addVoter() {
    history.push("/AddUserLogin");
  }
  return (
    <section class="login-section">
      <div class="imgBx">
        <img src={img1} alt="Login" />
        <div class="intro_text_over_image">
          <h1>
            e-Voting
            <br></br>
            Using Blockchain
          </h1>
          <br></br>
          <p>
            Voting online made easy.
          </p>
        </div>
      </div>

      <div class="contentBx">
        <div class="formBx">
          <h2>Login</h2>
          <form method="POST" >

            <div class="inputBx">
              <span>Voter Id</span>
              <input type="voter" name="voter" id="voter"
                value={voter}
                onChange={(e) => setVoter(e.target.value)}
                placeholder="Enter voter id" />
            </div>

            <div class="inputBx">
              <span>Password</span>
              <input type="password" name="password" id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            <div class="inputBx">
              <input type="submit" value="Login" class="Login"
                onClick={loginUser}
              />
            </div>

            <div class="inputBx">
              <p>Are you an Administrator? <a href="/AdminLogin">Login</a></p>
            </div>
            <hr style={{"height": "2px", "width": "100%" , "border-width" : "0" , "color" : "white", "background-color" : "white"}}/>
            <div class="inputBx">
              <input type="submit" value="Add new Voter" class="Project"
                onClick={addVoter}
              />
              </div>
          </form>
        </div>

      </div>
    </section>
  )
}

export default Home
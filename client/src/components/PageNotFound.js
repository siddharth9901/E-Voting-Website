import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
//import './App.css';




function PageNotFound() {
  var link = "/"
  if (sessionStorage.getItem('username') || sessionStorage.getItem('managerUsername')) {
    link = "/OverviewPage"
  }
  return (
    // <div>
    // <h1>404</h1>
    // <h3>
    //     Error!! Page not Found
    //     </h3>
    //   <h3><a href="/">Return Home</a></h3>
    // </div>
    <div class="stars">
      <div class="central-body">
        <img class="image-404" src="http://salehriaz.com/404Page/img/404.svg" width="300px" />
        <a href={link} class="btn-go-home">GO BACK HOME</a>
      </div>
      <div class="objects">
        <img class="object_rocket" src="http://salehriaz.com/404Page/img/rocket.svg" width="40px" />
        <div class="earth-moon">
          <img class="object_earth" src="http://salehriaz.com/404Page/img/earth.svg" width="100px" />
          <img class="object_moon" src="http://salehriaz.com/404Page/img/moon.svg" width="80px" />
        </div>
        <div class="box_astronaut">
          <img class="object_astronaut" src="http://salehriaz.com/404Page/img/astronaut.svg" width="140px" />
        </div>
      </div>
      <div class="glowing_stars">
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>

      </div>
    </div >

  );
}


export default PageNotFound;
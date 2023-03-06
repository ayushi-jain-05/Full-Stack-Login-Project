import React from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from "./styles.module.css";
import { googleLogout } from "@react-oauth/google";


const Navbar = () => {

  const navigate = useNavigate();

  const logout = () => {
      googleLogout();
      localStorage.clear();
    navigate("/");
  };
  return (
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Navbar</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon">
    <div class="nav-item dropdown d-lg-none">
        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
        </div>
    </span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item">
            <Link class="nav-link" to="/" onClick={logout}>Log Out</Link>
      </li>
      <li class="nav-item">
            <Link class="nav-link" to="/data/profile" >Users Details</Link>
      </li>
      <li class="nav-item">
            <Link class="nav-link" to="/profile" >Edit Details</Link>
      </li>
      
    </ul>
  </div>
</nav>
  )
}

export default Navbar

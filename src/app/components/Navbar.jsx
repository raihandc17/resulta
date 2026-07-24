import React from "react";
import Image from "next/image";
import styles from "./navbar.module.css";
import logo from "../../assets/companylogo.jpeg";

function Navbar() {
  return (
    <nav className={styles.nav}>
      <div>
        <h1>TechSolveX</h1>
      </div>
      <div>
        <ul className={styles.list}>
          <li>Home</li>
          <li>Our services</li>
          <li>About us</li>
          <li>contact</li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

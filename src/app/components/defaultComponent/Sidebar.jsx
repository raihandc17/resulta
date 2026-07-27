import React from "react";
import styles from "./sidebar.module.css";

function Sidebar() {
  return (
    <div>
      <div>
        <ul className={styles.list}>
          <li className={styles.list_item}>Home</li>
          <li className={styles.list_item}>Our services</li>
          <li className={styles.list_item}>Payment system</li>
          <li className={styles.list_item}>About us</li>
          <li className={styles.list_item}>contact</li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;

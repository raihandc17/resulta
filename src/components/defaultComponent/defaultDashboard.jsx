// import React from "react";

// function ProtectedDashboard() {
//   return <div>Protected dashboard</div>;
// }

// export default ProtectedDashboard;
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Button from "../Button/Button";
import styles from "./defaultDashboard.module.css";
import LoginModal from "../LoginModal/LoginModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const services = [
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Cloud Solutions",
    "SEO Optimization",
    "Digital Marketing",
  ];
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setIsModalOpen(true);
    }
  }, [searchParams]);
  useEffect(() => {
    const ids = ["home", "about", "services", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -40% 0px",
        threshold: 0.2,
      },
    );

    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Navbar */}
      <header className={styles.header}>
        <div className={styles.logo}>TechSolveX</div>

        {/* <nav className={styles.nav}>
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav> */}
        <nav className={styles.nav}>
          <a
            href="#home"
            className={activeSection === "home" ? styles.active : ""}
          >
            Home
          </a>

          <a
            href="#about"
            className={activeSection === "about" ? styles.active : ""}
          >
            About
          </a>

          <a
            href="#services"
            className={activeSection === "services" ? styles.active : ""}
          >
            Services
          </a>

          <a
            href="#contact"
            className={activeSection === "contact" ? styles.active : ""}
          >
            Contact
          </a>
        </nav>

        <div>
          <Button onClick={() => setIsModalOpen(true)}>Login</Button>
          {/* <Button variant="secondary">Register</Button> */}
          <Link href="/register">
            <Button variant="secondary">Register</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Build Your Business With Modern Technology</h1>

          <p>
            We build websites, web applications, mobile apps, and digital
            solutions that help your business grow. We also transform raw data
            into meaningful insights through data analytics, interactive
            dashboards, business intelligence, and predictive analytics. Our
            solutions help businesses monitor performance, identify trends,
            optimize operations, and make informed decisions that drive
            growth.....
          </p>
        </div>

        <div className={styles.heroImage}>
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700"
            alt="Developer"
          />
        </div>
      </section>

      {/* About */}
      <section id="about" className={styles.about}>
        <h2>About Us</h2>

        <p>
          We are a software company providing high-quality web development,
          mobile applications, UI/UX design, and cloud solutions for startups
          and enterprises.
        </p>

        <div className={styles.aboutCards}>
          <div className={styles.card}>
            <h3>Mission</h3>
            <p>Deliver innovative software solutions worldwide.</p>
          </div>

          <div className={styles.card}>
            <h3>Vision</h3>
            <p>Become a trusted technology partner for every business.</p>
          </div>

          <div className={styles.card}>
            <h3>Values</h3>
            <p>Quality, Integrity, Innovation, and Customer Success.</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className={styles.services}>
        <h2>Our Services</h2>
        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <div key={service} className={styles.serviceCard}>
              <h3>{service}</h3>
              <p>
                Professional {service.toLowerCase()} solutions for your
                business.
              </p>
            </div>
          ))}
        </div>
        <div className={styles.expertise}>
          <h2>Our Technology Expertise</h2>

          <p className={styles.expertiseIntro}>
            We combine modern software engineering with advanced data analytics
            to deliver scalable, secure, and intelligent digital solutions for
            businesses of all sizes.
          </p>

          <div className={styles.expertiseGrid}>
            <div className={styles.expertiseCard}>
              <h3>🌐 Web & Mobile Development</h3>

              <p>
                We build responsive websites, enterprise web applications,
                mobile applications, and cloud-native solutions using modern
                technologies.
              </p>

              <ul>
                <li>
                  <strong>Frontend:</strong> React.js, Next.js, React Native,
                  Flutter, JavaScript, TypeScript
                </li>
                <li>
                  <strong>UI:</strong> HTML5, CSS3, Tailwind CSS, Bootstrap,
                  SCSS, Material UI
                </li>
                <li>
                  <strong>Backend:</strong> Node.js, Express.js, Python, Go
                </li>
                <li>
                  <strong>Database:</strong> PostgreSQL, MySQL, MongoDB, Redis
                </li>
                <li>
                  <strong>API:</strong> REST API, GraphQL
                </li>
                <li>
                  <strong>Authentication:</strong> JWT, OAuth, Firebase Auth
                </li>
                <li>
                  <strong>Deployment:</strong> Docker, AWS, Azure, GCP, Vercel,
                  Netlify
                </li>
              </ul>
            </div>

            <div className={styles.expertiseCard}>
              <h3>📊 Data Analytics & Business Intelligence</h3>

              <p>
                We transform business data into meaningful insights through
                visualization, reporting, predictive analytics, and business
                intelligence solutions.
              </p>

              <ul>
                <li>
                  <strong>Languages:</strong> Python, SQL
                </li>
                <li>
                  <strong>Analytics:</strong> Pandas, NumPy, SciPy
                </li>
                <li>
                  <strong>Visualization:</strong> Power BI, Tableau, Looker
                  Studio, Excel, Google Sheets
                </li>
                <li>
                  <strong>Machine Learning:</strong> Scikit-learn, TensorFlow
                </li>
                <li>
                  <strong>ETL:</strong> Power Query, Python ETL Pipelines,
                  Apache Airflow
                </li>
                <li>
                  <strong>Cloud:</strong> AWS, Azure, Google Cloud Platform
                </li>
                <li>
                  <strong>Reporting:</strong> KPI Dashboards, Forecasting,
                  Business Intelligence
                </li>
              </ul>
            </div>
          </div>
        </div>{" "}
        <div className={styles.expertise}>
          <h2>Our Technology Expertise</h2>

          <p className={styles.expertiseIntro}>
            We combine modern software engineering with advanced data analytics
            to deliver scalable, secure, and intelligent digital solutions for
            businesses of all sizes.
          </p>

          <div className={styles.expertiseGrid}>
            <div className={styles.expertiseCard}>
              <h3>🌐 Web & Mobile Development</h3>

              <p>
                We build responsive websites, enterprise web applications,
                mobile applications, and cloud-native solutions using modern
                technologies.
              </p>

              <ul>
                <li>
                  <strong>Frontend:</strong> React.js, Next.js, React Native,
                  Flutter, JavaScript, TypeScript
                </li>
                <li>
                  <strong>UI:</strong> HTML5, CSS3, Tailwind CSS, Bootstrap,
                  SCSS, Material UI
                </li>
                <li>
                  <strong>Backend:</strong> Node.js, Express.js, Python, Go
                </li>
                <li>
                  <strong>Database:</strong> PostgreSQL, MySQL, MongoDB, Redis
                </li>
                <li>
                  <strong>API:</strong> REST API, GraphQL
                </li>
                <li>
                  <strong>Authentication:</strong> JWT, OAuth, Firebase Auth
                </li>
                <li>
                  <strong>Deployment:</strong> Docker, AWS, Azure, GCP, Vercel,
                  Netlify
                </li>
              </ul>
            </div>

            <div className={styles.expertiseCard}>
              <h3>📊 Data Analytics & Business Intelligence</h3>

              <p>
                We transform business data into meaningful insights through
                visualization, reporting, predictive analytics, and business
                intelligence solutions.
              </p>

              <ul>
                <li>
                  <strong>Languages:</strong> Python, SQL
                </li>
                <li>
                  <strong>Analytics:</strong> Pandas, NumPy, SciPy
                </li>
                <li>
                  <strong>Visualization:</strong> Power BI, Tableau, Looker
                  Studio, Excel, Google Sheets
                </li>
                <li>
                  <strong>Machine Learning:</strong> Scikit-learn, TensorFlow
                </li>
                <li>
                  <strong>ETL:</strong> Power Query, Python ETL Pipelines,
                  Apache Airflow
                </li>
                <li>
                  <strong>Cloud:</strong> AWS, Azure, Google Cloud Platform
                </li>
                <li>
                  <strong>Reporting:</strong> KPI Dashboards, Forecasting,
                  Business Intelligence
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={styles.contact}>
        <h2>Contact Us</h2>

        <form className={styles.form}>
          <input type="text" placeholder="Your Name" />

          <input type="email" placeholder="Email Address" />

          <textarea rows="5" placeholder="Your Message"></textarea>

          <button>Send Message</button>
        </form>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 TechSolveX. All Rights Reserved.</p>
      </footer>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

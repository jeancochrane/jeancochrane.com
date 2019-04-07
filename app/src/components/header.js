import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle, faBook, faCode } from "@fortawesome/free-solid-svg-icons"
import "bootstrap/dist/css/bootstrap.min.css"


const NavItem = props => (
  <div className="nav-item" style={{ fontSize: '15px', margin: '10px' }}>
    <p style={{ textAlign: 'left', marginTop: '10px' }}>
      <Link to={props.href}>
        <FontAwesomeIcon icon={props.icon} />&nbsp;
        <strong>{props.title}</strong>
      </Link>
    </p>
  </div>
)

const Header = ({ siteTitle }) => (
  <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
    <div className="navbar-left">
      <Link to="/">
        <h2 style={{
          fontFamily: "Press Start 2P, sans-serif",
          display: "inline-block",
          padding: "10px 10px",
          paddingLeft: "0",
          marginTop: "0",
          color: "lightcoral"
        }}>
          {siteTitle}
        </h2>
      </Link>
    </div>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
      </Nav>
      <Nav>
        <NavItem href="/" icon={faCode} title="Work" />
        <NavItem href="/blog" icon={faBook} title="Blog" />
        <NavItem href="/about" icon={faQuestionCircle} title="About" />
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header

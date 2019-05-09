import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle, faBook, faCode } from "@fortawesome/free-solid-svg-icons"


const NavItem = props => {
  const isActive = (props.href === '/')
                    ? props.currentPath === props.href
                    : props.currentPath.startsWith(props.href)
  return (
    <li>
      <Link to={props.href} className="menu-link">
        <span className={`menu-item ${(isActive) ? 'active' : ''}`} style={{
          fontSize: "1.2rem",
          fontWeight: "400",
        }}>
          {props.title}
        </span>
      </Link>
    </li>
  )
}

const Header = props => (
  <Navbar className="navbar-default navbar-transparent" collapseOnSelect expand="lg" bg="light" variant="light">
    <div className="container nav-container">
      <div className="navbar-left">
        <Link to="/">
          <h2 className="main-logo">
            {props.siteTitle}
          </h2>
        </Link>
      </div>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
        </Nav>
        <Nav className="navbar-nav">
          <NavItem href="/" title="Work" currentPath={props.location.pathname} />
          <NavItem href="/blog" title="Blog" currentPath={props.location.pathname} />
          <NavItem href="/about" title="About" currentPath={props.location.pathname} />
        </Nav>
      </Navbar.Collapse>
    </div>
  </Navbar>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header

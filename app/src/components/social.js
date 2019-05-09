import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons"


const SocialLinks = () => (
  <>
    <a href="https://github.com/jeancochrane" title="GitHub account">
      <FontAwesomeIcon icon={faGithub} />
    </a>
    &nbsp;
    <a href="https://twitter.com/jean_cochrane" title="Twitter account">
      <FontAwesomeIcon icon={faTwitter} />
    </a>
  </>
)

export default SocialLinks

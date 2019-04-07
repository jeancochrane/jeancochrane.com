import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faQuestionCircle } from "@fortawesome/free-regular-svg-icons"

import Layout from "../components/layout"
import SEO from "../components/seo"


const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <div className="row">
      <div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8
                  col-md-offset-2 content-body">
        <h2 class="section-header">
          <FontAwesomeIcon icon={faQuestionCircle} />
          Not found
        </h2>
        <hr />
        <p>We couldn&#39;t find what you were looking for.</p>
        <Link to="/">
          <FontAwesomeIcon icon={faArrowRight} />
          Back to the home page
        </Link>
      </div>
    </div>
  </Layout>
)

export default NotFoundPage

import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import SocialLinks from "../components/social"


const AboutPage = ({ location }) => (
 <Layout location={location}>
    <SEO title="About" />
    <div className="row">
      <div className="col-xs-12 col-md-10 offset-md-1 content-body">
        <h2 className="section-header">
          About
        </h2>
        <hr />
        <p>
          Jean Cochrane builds dynamic tools for understanding geography, technology,
          and distributions of power. They strive to be a steward of the commons and
          to make the work of others more productive and more meaningful. They
          live and work in Philadelphia, PA.
        </p>
        <p>
          Jean is currently a Lead Developer at <a href="https://datamade.us">DataMade</a>,
          where they're trying to figure out how data and networked applications can be leveraged
          for liberation. In the past, Jean studied <a href="http://gendersexuality.uchicago.edu/">Gender and Sexuality Studies</a> at
          the University of Chicago, made comics and graphics for the <a href="https://southsideweekly.com/queering-black-history/">South Side Weekly</a>,
          was a reporting fellow at <a href="https://citybureau.org">City Bureau</a>, and worked
          as an Operations Engineer at <a href="https://azavea.com">Azavea</a> focusing
          on production infrastructure.
        </p>
        <p>
          Jean attended the <a href="https://recurse.com">Recurse Center</a> in
          Fall 2018 to study neural networks and deep learning. If you're interested
          in attending Recurse yourself, they highly recommend it.
        </p>
        <h1 className="text-center">
          <SocialLinks />
        </h1>
      </div>
    </div>
 </Layout>
)

export default AboutPage
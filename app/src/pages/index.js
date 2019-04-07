import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import musicIcon from "../images/icon_music_color.png"
import comicsIcon from "../images/icon_comics_color.png"
import blogIcon from "../images/icon_comics_color.png"


const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-sm-6 col-md-5">
          <p className="short-bio">
            designs dynamic tools for understanding geography, technology,
            and distributions of power&mdash;with a commitment to open data
            and critical design.
          </p>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-7 icon-illustrations text-center">
          <img className="sidebar" alt="Music illustration" src={musicIcon} />
          <img className="large1" alt="Comics illustration" src={comicsIcon} />
          <img className="large2" alt="Blog illustration" src={blogIcon} />
        </div>
      </div>
    </div>
  </Layout>
)

export default IndexPage

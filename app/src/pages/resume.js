import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileText, faGraduationCap, faWrench, faCode } from "@fortawesome/free-regular-svg-icons"

import Layout from "../components/layout"
import SEO from "../components/seo"
import SocialLinks from "../components/social"


const ResumePage = () => (
 <Layout>
    <SEO title="Resume" />
    <div className="row">
      <div className="col-xs-12 col-lg-11">
        <h2 className="section-header">
          <FontAwesomeIcon icon={faFileText} />
          Resume
        </h2>
        <hr />

        <div className="content-body">
          <h1>
            <FontAwesomeIcon icon={faGraduationCap} />
            School
          </h1>
          <h2>
            University of Chicago <small>2012 &mdash; 2016</small>
          </h2>
          <p>
            B.A. with honors in
            <a href="http://gendersexuality.uchicago.edu/">
              Gender and Sexuality Studies
            </a>
            (3.9 GPA)
          </p>
          <h2>
            Recurse Center <small>Fall 2018</small>
          </h2>
          <p>
            Led study group on neural networks and deep learning
          </p>

          <hr/>

          <h1>
            <FontAwesomeIcon icon={faWrench} />
            Work
          </h1>
          <h2 id="datamade-2019-present">
            DataMade <small>Spring 2019 &mdash; present</small>
          </h2>
          <p>
            <i>Lead Developer</i> | <a href="https://datamade.us">datamade.us</a>
          </p>
          <ul>
            <li>Managed small teams of junior developers building client projects</li>
            <li>Provided technical leadership on proposals, scopes, and work plans</li>
            <li>Speardheaded company research and development</li>
          </ul>
          <h2 id="azavea-2018-2019">
            Azavea <small>Summer 2018 &mdash; Spring 2019</small>
          </h2>
          <p>
            <i>Open Source Fellow, Operations Engineer</i> | <a href="https://azavea.com">azavea.com</a>
          </p>
          <ul>
            <li>Built out an open source framework, <a href="https://github.com/azavea/grout">Grout</a> for flexible schema management with geospatial data</li>
            <li>Moved from a fellow to an engineer on a team in charge of performance, reliability, and cost-effectiveness of production infrastructure</li>
            <li>Managed cloud infrastructure for a wide variety of small-and-medium-sized client apps</li>
          </ul>
          <h2 id="datamade-2016-2018">
            DataMade <small>Fall 2016 &mdash; Summer 2018</small>
          </h2>
          <p>
            <i>Developer</i> | <a href="https://datamade.us">datamade.us</a>
          </p>
          <ul>
            <li>Led full-stack development of a variety of data-intensive client projects, including <Link to="/pages/whowasincommand">WhoWasInCommand</Link>, <Link to="/pages/where-to-buy">Where To Buy</Link> and <Link to="/pages/thrivezones">Retail Thrive Zones</Link></li>
            <li>Worked on a small team developing the machine learning SaaS product <a href="https://dedupe.io">Dedupe.io</a>, helping launch it into public beta</li>
            <li>Paired in standardizing, documenting, and training coworkers in a new continuous-deployment stack for client projects</li>
          </ul>
          <h2 id="city-bureau-fallwinter-2015-2016">
            City Bureau <small>Fall 2015 &mdash; Winter 2016</small>
          </h2>
          <p>
            <i>Multimedia Reporting Fellow</i> | <a href="http://citybureau.org">citybureau.org</a>
          </p>
          <ul>
            <li>Collaborated on the inaugural cohort of a community journalism lab</li>
            <li>Produced data-driven graphics about police violence in Chicago</li>
          </ul>

          <hr />

          <h1 id="stack">
            <FontAwesomeIcon icon={faCode} />
            Stack
          </h1>
          <h3 id="frontend">Frontend</h3>
          <p>React, Vue, Gatsby, jQuery, Bootstrap</p>
          <h3 id="backend">Backend</h3>
          <p>Django, Flask, PostgreSQL, PostGIS, SQLAlchemy, Solr</p>
          <h3 id="data-processing">Data Processing</h3>
          <p>GNU Make, GDAL/OGR, scikit-learn, NumPy, TensorFlow, Bash, AWS Batch</p>
          <h3 id="deployment">Deployment</h3>
          <p>EC2, ECS, RDS, CodeDeploy, Terraform</p>
          <h3 id="operating-systems">Operating Systems</h3>
          <p>Ubuntu, Debian, MacOS</p>
        </div>
      </div>
      <SocialLinks />
    </div>
 </Layout>
)

export default ResumePage

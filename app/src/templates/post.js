import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"


const Post = ({ data }) => {
  let img = data.post.frontmatter.thumbnail
  const alt = `Thumbnail for ${data.post.frontmatter.title}`
  let thumbnail = ''
  // gatsby-image-sharp can't handle GIFs, so show them as plain <img>s
  if (!img.childImageSharp && img.extension === 'gif') {
    thumbnail = (<img src={img.publicURL} alt={alt}/>)
  } else {
    thumbnail = (<Img fluid={img.childImageSharp.fluid} alt={alt} />)
  }
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 text-center">
            <h1>{data.post.frontmatter.title}</h1>
            <p className="text-muted">{data.post.frontmatter.date}</p>
            {thumbnail}
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-10 col-sm-offset-1
                          col-md-8 col-md-offset-2 content-body post-body">
            <div dangerouslySetInnerHTML={{ __html: data.post.html }} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "DD MMMM, YYYY")
        thumbnail {
          childImageSharp {
            fluid(maxWidth: 630) {
              ...GatsbyImageSharpFluid
            }
          }
          extension
          publicURL
        }
      }
    }
  }
`

export default Post

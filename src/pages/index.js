import * as React from "react"

// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}
const paragraphStyles = {
  marginBottom: 48,
}


const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
}


// markup
const IndexPage = () => {
  return (
    <main style={pageStyles}>
      <title>Hello Mars podcast</title>
      <h1 style={headingStyles}>
        Welcome to the Hello Mars podcast website
        <br />
      </h1>
      <p style={paragraphStyles}>
        This website isn't quite done yet good Sir 
      </p>
    </main>
  )
}

export default IndexPage

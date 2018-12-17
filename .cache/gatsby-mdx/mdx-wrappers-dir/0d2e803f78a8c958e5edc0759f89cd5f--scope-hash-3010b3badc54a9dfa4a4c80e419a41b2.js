// .cache/gatsby-mdx/wrapper-components/{wrapper-filepath-hash}-{scope-hash}.js
import React from 'react';
import { MDXScopeProvider } from 'gatsby-mdx/context';

import __mdxScope_0 from '/Users/robertcooper/Projects/personal-website/.cache/gatsby-mdx/mdx-scopes-dir/3010b3badc54a9dfa4a4c80e419a41b2.js';

import OriginalWrapper from '/Users/robertcooper/Projects/personal-website/src/templates/blog-post.tsx';

import { graphql } from 'gatsby';

// pageQuery, etc get hoisted to here
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      code {
        body
      }
      # excerpt(pruneLength: 160)
      # html
      # frontmatter {
      #   title
      #   date(formatString: "MMMM DD, YYYY")
      # }
    }
  }
`;;

export default ({children, ...props}) => <MDXScopeProvider __mdxScope={{...__mdxScope_0}}>
  <OriginalWrapper
    {...props}
  >
    {children}
  </OriginalWrapper>
</MDXScopeProvider>
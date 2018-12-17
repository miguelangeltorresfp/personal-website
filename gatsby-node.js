const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const componentWithMDXScope = require('gatsby-mdx/component-with-mdx-scope');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.tsx')
    resolve(
      graphql(
        `
          {
            allMdx(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
              edges {
                node {
                  id
                  parent {
                    ... on File {
                      name
                      sourceInstanceName
                    }
                  }
                  code {
                    scope
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        const posts = result.data.allMdx.edges;

        posts.forEach(({ node }, index) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1].node;
          const next = index === 0 ? null : posts[index - 1].node;

          createPage({
            path: `/${node.parent.sourceInstanceName}/${node.parent.name}`,
            component: componentWithMDXScope(blogPost, node.code.scope),
            context: {
              id: node.id,
              previous,
              next,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    console.log('Slug value: ', value);
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

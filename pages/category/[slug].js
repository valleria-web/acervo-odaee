import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import ItemPost from '../../components/ItemPost'
import { slugify, ImageUrl } from '../../utils'
import { NextSeo } from 'next-seo'

// Función recursiva para obtener todos los archivos Markdown
function getAllMarkdownFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      getAllMarkdownFiles(filePath, arrayOfFiles)
    } else if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
      arrayOfFiles.push(filePath)
    }
  })

  return arrayOfFiles
}

export default function Category({ posts }) {
  return (
    <>
      <NextSeo
        title="Access your category related articles"
        description="Access your category related articles"
        openGraph={{
          url: '',
          title: 'Access your category related articles',
          description: 'Access your category related articles',
          images: [
            {
              url: `${ImageUrl('banner.png')}`,
              width: 1224,
              height: 724,
              alt: 'banner',
              type: 'image/jpeg',
            },
          ],
          site_name: 'The Digital Character Cafe',
        }}
      />

      <div className="container my-3">
        <div className="row">
          <div className="col-lg-10 post-date m-1 p-2 m-auto">
            {posts.map((post, index) => (
              <ItemPost key={index} post={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const files = getAllMarkdownFiles(path.join(process.cwd(), 'posts'))
  let categorySlugs = new Set()

  files.forEach((filePath) => {
    const markdownWithMeta = fs.readFileSync(filePath, 'utf-8')
    const { data: frontmatter } = matter(markdownWithMeta)

    if (frontmatter.draft === false && Array.isArray(frontmatter.categories)) {
      frontmatter.categories.forEach((category) => {
        categorySlugs.add(slugify(category))
      })
    }
  })

  const paths = [...categorySlugs].map((slug) => ({
    params: { slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params: { slug } }) {
  const files = getAllMarkdownFiles(path.join(process.cwd(), 'posts'))
  let posts = []

  files.forEach((filePath) => {
    const markdownWithMeta = fs.readFileSync(filePath, 'utf-8')
    const { data: frontmatter } = matter(markdownWithMeta)

    if (frontmatter.draft === false && Array.isArray(frontmatter.categories)) {
      const matchesCategory = frontmatter.categories.some(
        (category) => slugify(category) === slug
      )

      if (matchesCategory) {
        const generatedSlug = filePath
          .replace(path.join(process.cwd(), 'posts'), '')
          .replace(/\.mdx?$/, '')
          .replace(/\\/g, '/')
          .replace(/^\//, '')

        posts.push({
          ...frontmatter,
          slug: generatedSlug,
        })
      }
    }
  })

  return {
    props: {
      posts,
    },
  }
}

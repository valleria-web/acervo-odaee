import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Link from "next/link";
import { slugify, ImageUrl } from "../../utils";
import { NextSeo } from "next-seo";

export default function PostPage({ content, frontmatter }) {
  const date = new Date(frontmatter.date);

  return (
    <>
      <NextSeo
        title={frontmatter.title}
        description={frontmatter.summary}
        openGraph={{
          url: "",
          title: frontmatter.title,
          description: frontmatter.summary,
          type: "article",
          article: {
            publishedTime: frontmatter.date,
            authors: [""],
            tags: frontmatter.tags,
          },
        }}
      />
      <div className="container my-1 p-5">
        <div className="row">
          <div className="col-lg-10 m-auto">
          <div className="card card-page" style={{ marginLeft: '20px', marginRight: '20px' }}>
              <a href={`/blog/${frontmatter.slug}`}></a>

              <div className="post-title m-2">{frontmatter.title}</div >
              <div className="post-date m-2 ">
                <div className="post-date m-2">
                  <div>
                    <div>
                      {`${date.getDate()}/${
                        date.getMonth() + 1
                      }/${date.getFullYear()}`}{" "}
                    </div>{" "}
                  </div>
                  <div>
                    {" "}
                    {frontmatter.categories.map((category) => {
                      const slug = slugify(category);

                      return (
                        <Link key={category} href={`/category/${slug}`}>
                          <a className="btn">
                            <h6 className="post-title">#{category}</h6>
                          </a>
                        </Link>
                      );
                    })}{" "}
                  </div>
                </div>
              </div>

              <div
                className="post-body m-5" style={{ fontSize: '20px' }}
                dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  //  Get files from the posts dir
  const files = fs.readdirSync(path.join("posts"));

  // Get slug and frontmatter from posts
  const temppaths = files.map((filename) => {
    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(
      path.join("posts", filename),
      "utf-8"
    );

    const { data: frontmatter } = matter(markdownWithMeta);

    if (frontmatter.draft === false) {
      return {
        params: {
          slug: filename.replace(".md", ""),
        },
      };
    } else {
      return null;
    }
  });
  //   remove null in tempPosts
  const paths = temppaths.filter((path) => {
    return path && path;
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(
    path.join("posts", slug + ".md"),
    "utf-8"
  );

  const { data: frontmatter, content } = matter(markdownWithMeta);

  return {
    props: {
      frontmatter,
      slug,
      content,
    },
  };
}

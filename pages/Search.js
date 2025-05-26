import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Post from "../components/Post";
import Banner from "../components/Banner";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { ImageUrl } from "../utils";

export default function Search({ posts }) {
  const { query } = useRouter();
  const q = query.q?.toLowerCase() || "";

  // Filtrar posts que contengan la query en título, resumen o descripción
  const filteredPosts = posts.filter((post) => {
    const { title, summary, description } = post.frontmatter;
    return (
      title.toLowerCase().includes(q) ||
      summary.toLowerCase().includes(q) ||
      description.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <NextSeo
        title="Search the page"
        description="Find the search result page"
        openGraph={{
          url: "",
          title: "Search the page",
          description: "Find the search result page",
          images: [
            {
              url: `${ImageUrl("banner.png")}`,
              width: 1224,
              height: 724,
              alt: "banner",
              type: "image/jpeg",
            },
          ],
          site_name: "Acervo ODAEE",
        }}
      />
      <Banner />
      <div className="container">
        <div className="row">
          <div className="col-lg-8 m-auto">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => <Post key={index} post={post} />)
            ) : (
              <div className="m-auto p-5 mx-5 ">
                <h2 className="text-center">
                  {q ? `No post found based on "${q}"` : "Loading..."}
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data: frontmatter } = matter(fileContents);

      if (frontmatter.draft === false) {
        return {
          slug: filename.replace(".md", ""),
          frontmatter,
        };
      }
      return null;
    })
    .filter(Boolean)
    // Aquí ordenamos posts de más reciente a más antiguo
    .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));

  return {
    props: {
      posts,
    },
  };
}



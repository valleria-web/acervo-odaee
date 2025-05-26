import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextSeo } from "next-seo";
import Post from "../components/Post";
import Banner from "../components/Banner";
import Sidebar from "../components/Sidebar";
import { sortByDate, slugify, ImageUrl } from "../utils";

export default function Home({ posts }) {
  return (
    <div>
      <NextSeo
        title="Acervo ODAEE"
        description="Compilación de artículos y biografías de los galardonados de la rede ODAEE"
        openGraph={{
          url: "",
          title: "Acervo ODAEE",
          description:
            "Compilación de artículos y biografías de los galardonados de la rede ODAEE",
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
        <Sidebar />
        <div className="row">
          <div className="col">
            <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 g-4">
              {posts.map((post, index) => (
                <Post key={index} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (min-width: 768px) {
          .row-cols-md-2 > * {
            flex: 0 0 50%;
            max-width: 50%;
          }
        }

        @media (min-width: 992px) {
          .row-cols-lg-3 > * {
            flex: 0 0 33.333%;
            max-width: 33.333%;
          }
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  // Leer archivos Markdown
  const files = fs.readdirSync(path.join("posts"));

  const tempPosts = files.map((filename) => {
    const slug = filename.replace(".md", "");
    const markdownWithMeta = fs.readFileSync(
      path.join("posts", filename),
      "utf-8"
    );

    const { data: frontmatter } = matter(markdownWithMeta);

    if (frontmatter.draft === false) {
      return {
        slug,
        frontmatter,
      };
    } else {
      return null;
    }
  });

  const posts = tempPosts.filter((post) => post);

  // Guardar search.json en /public
  const searchIndex = posts.map(({ frontmatter }) => ({ frontmatter }));
  const jsonString = JSON.stringify(searchIndex, null, 2);

  fs.writeFileSync(
    path.join(process.cwd(), "public", "search.json"),
    jsonString
  );

  return {
    props: {
      posts: posts.sort(sortByDate),
    },
  };
}

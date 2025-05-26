import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Post from '../components/Post';
import Banner from '../components/Banner';
import { NextSeo } from 'next-seo';
import { ImageUrl } from '../utils';

export default function Search() {
  const { query } = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchData = async () => {
      if (!query.q) return;
      try {
        const res = await fetch('/search.json');
        const data = await res.json();

        const filtered = data.filter((post) => {
          if (post.frontmatter?.draft === false) {
            const q = query.q.toLowerCase();
            return (
              post.frontmatter.title.toLowerCase().includes(q) ||
              post.frontmatter.summary.toLowerCase().includes(q) ||
              post.frontmatter.description?.toLowerCase().includes(q)
            );
          }
          return false;
        });

        setPosts(filtered);
      } catch (err) {
        console.error('Error loading search.json', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchData();
  }, [query.q]);

  return (
    <div>
      <NextSeo
        title="Buscar en Acervo ODAEE"
        description="Resultados de búsqueda"
        openGraph={{
          url: '',
          title: 'Buscar en Acervo ODAEE',
          description: 'Resultados de búsqueda',
          images: [
            {
              url: `${ImageUrl('banner.png')}`,
              width: 1224,
              height: 724,
              alt: 'banner',
              type: 'image/jpeg',
            },
          ],
          site_name: 'Acervo ODAEE',
        }}
      />
      <Banner />
      <div className="container">
        <div className="row">
          <div className="col-lg-8 m-auto">
            {loading ? (
              <div className='text-center my-5'>Cargando...</div>
            ) : posts.length > 0 ? (
              posts.map((post, index) => (
                <Post key={index} post={post} />
              ))
            ) : (
              <div className='text-center my-5'>
                <h2>No se encontraron resultados para "{query.q}"</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


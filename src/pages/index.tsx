import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';

import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ results }) {
  //   // TODO
  console.log('aca');
  console.log(results);
  // console.log(results.length);

  return (
    <>
      <main className={styles.container}>
        <Header />

        {results.map(post => (
          <a className={styles.post}>
            <h1>{post.title}</h1>
            <p>{post.subtitle}</p>
            <div>
              <time className={styles.date}>
                <FiCalendar /> {post.createdAt}
              </time>
              <span className={styles.author}>
                <FiUser /> {post.author}
              </span>
            </div>
          </a>
        ))}

        <button>Carregar mais posts</button>
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  // TODO
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'publication')],
    {
      pageSize: 100,
    }
  );

  // console.log(JSON.stringify(postsResponse, null, 2));

  const results = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
      createdAt: post.first_publication_date,
    };
  });

  console.log('resultado');
  console.log(results);

  return {
    props: { results },
  };
};

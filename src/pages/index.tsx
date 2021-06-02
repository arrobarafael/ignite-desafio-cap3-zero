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

export default function Home({ postsPagination }: HomeProps) {
  //   // TODO
  console.log('aca');
  console.log(postsPagination);
  // console.log(postsPagination.length);

  return (
    <>
      <main className={styles.container}>
        <Header />

        {postsPagination.results.map(post => (
          <a className={styles.post} key={post.uid}>
            <h1>{post.data.title}</h1>
            <p>{post.data.subtitle}</p>
            <div>
              <time className={styles.date}>
                <FiCalendar />{' '}
                {new Date(post.first_publication_date).toLocaleDateString(
                  'pt-BR'
                )}
              </time>
              <span className={styles.author}>
                <FiUser /> {post.data.author}
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
  const postsPagination = await prismic.query(
    [Prismic.predicates.at('document.type', 'publication')],
    {
      pageSize: 100,
    }
  );

  return {
    props: { postsPagination },
  };
};

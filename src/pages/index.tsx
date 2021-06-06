import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';

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
  const [results, setResults] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const nextPost = async () => {
    const prismic = getPrismicClient();
    const response = await fetch(
      'https://desafio3.cdn.prismic.io/api/v2/documents/search?ref=YLfJ5hAAACUAh77q&q=%5B%5Bat%28document.type%2C+%22publication%22%29%5D%5D&page=2&pageSize=1'
    ).then(promise => promise.json());

    setNextPage(response.next_page);

    const newResults = response.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setResults([...results, ...newResults]);
  };

  return (
    <>
      <main className={styles.container}>
        <Header />

        {results.map(post => (
          <Link href={`/post/${post.uid}`} key={post.uid}>
            <a className={styles.post}>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <div>
                <time className={styles.date}>
                  <FiCalendar />
                  {format(
                    new Date(post.first_publication_date),
                    'dd MMM yyyy',
                    {
                      locale: ptBR,
                    }
                  )}
                </time>
                <span className={styles.author}>
                  <FiUser /> {post.data.author}
                </span>
              </div>
            </a>
          </Link>
        ))}

        {nextPage && <button onClick={nextPost}>Carregar mais posts</button>}
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  // TODO
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'publication')],
    {
      pageSize: 1,
    }
  );

  const results = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results,
      },
    },
  };
};

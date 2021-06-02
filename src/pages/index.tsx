import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';

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
  const [postList, setPostList] = useState(postsPagination);
  console.log(postList);
  console.log(postList.results);

  const nextPost = async () => {
    const prismic = getPrismicClient();
    const response = await fetch(
      'https://desafio3.cdn.prismic.io/api/v2/documents/search?ref=YLfJ5hAAACUAh77q&q=%5B%5Bat%28document.type%2C+%22publication%22%29%5D%5D&page=2&pageSize=1'
    ).then(promise => promise.json());
    console.log('seta');
    console.log(response);
    // setPostList([
    //   ...postList,
    //   {
    //     next_page: response.next_page,
    //     results: {
    //       fist_publication_date: new Date(
    //         response.results[0].first_publication_date
    //       ).toLocaleDateString('pt-BR'),
    //       data: {
    //         title: response.results[0].data.title,
    //         subtitle: response.results[0].data.subtitle,
    //         author: response.results[0].data.author,
    //       },
    //     },
    //   },
    // ]);
    console.log(postList);
  };

  return (
    <>
      <main className={styles.container}>
        <Header />

        {postList.results.map(post => (
          <a className={styles.post} key={post.uid}>
            {post.uid}
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

        {postList.next_page && (
          <button onClick={nextPost}>Carregar mais posts</button>
        )}
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
      fist_publication_date: new Date(
        post.first_publication_date
      ).toLocaleDateString('pt-BR'),
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

import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { useEffect, useState } from 'react';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  const [timeReading, setTimeReading] = useState(0);
  // TODO

  useEffect(() => {
    function calcTimeReading() {
      if (document.body.innerText) {
        const numberOfWords = document.body.innerText.split(' ').length;
        const expexctedTime = Math.round(numberOfWords / 200);

        return expexctedTime;
      }

      return 0;
    }

    setTimeReading(calcTimeReading());
  }, []);

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <section className={styles.headerContainer}>
        <Header />
      </section>

      <section className={styles.imageContainer}>
        <img src={post.data.banner.url} alt={post.data.banner.url} />
      </section>

      <main className={styles.mainContainer}>
        <h1>{post.data.title}</h1>
        <div className={styles.postDetails}>
          <time>
            <FiCalendar />
            {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </time>
          <span>
            <FiUser />
            {post.data.author}
          </span>
          <time>
            <FiClock />
            {timeReading} min
          </time>
        </div>
        {post.data.content.map(content => {
          return (
            <div key={content.heading}>
              <div className={styles.heading}>{content.heading}</div>
              <div
                className={styles.body}
                dangerouslySetInnerHTML={{ __html: String(content.body) }}
              ></div>
            </div>
          );
        })}
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'publication')],
    {
      pageSize: 1,
    }
  );

  //   // TODO
  return {
    paths: [
      {
        params: {
          slug: posts.results[0].uid,
        },
      },
    ],
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('publication', String(slug), {});

  // TODO;
  const content = response.data.content.map(item => {
    const body = RichText.asHtml(item.body);

    return {
      heading: item.heading,
      body,
    };
  });

  const body = RichText.asHtml(response.data.content[0].body);

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.image.url,
      },
      author: response.data.author,
      content,
    },
  };

  return {
    props: { post },
  };
};

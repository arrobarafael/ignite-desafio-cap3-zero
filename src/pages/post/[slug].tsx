import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

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
  // TODO
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
            {post.first_publication_date}
          </time>
          <span>
            <FiUser />
            {post.data.author}
          </span>
          <time>
            <FiClock />4 min
          </time>
        </div>
        {post.data.content.map(content => {
          return (
            <div key={content.heading}>
              <div className={styles.heading}>{content.heading}</div>
              <div
                className={styles.body}
                dangerouslySetInnerHTML={{ __html: content.body }}
              ></div>
            </div>
          );
        })}
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  //   const prismic = getPrismicClient();
  //   const posts = await prismic.query(TODO);

  //   // TODO
  return {
    paths: [],
    fallback: 'blocking',
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
    first_publication_date: new Date(
      response.first_publication_date
    ).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
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

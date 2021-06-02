import { GetStaticPaths, GetStaticProps } from 'next';
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

export default function Post() {
  // TODO
  return (
    <>
      <section className={styles.headerContainer}>
        <Header />
      </section>
      imagem
      <main className={styles.mainContainer}>
        <h1>Criando um app CRA do zero</h1>
        <div className={styles.postDetails}>
          <time>
            <FiCalendar />
            15 Mar 2021
          </time>
          <span>
            <FiUser />
            Joseph Oliveira
          </span>
          <time>
            <FiClock />4 min
          </time>
        </div>
        <div className={styles.heading}>bla bla bla</div>
        <div className={styles.body}>
          gjfdkhgkfdjgf fdkj hgdfkg dfkjgh dfkjg
        </div>
      </main>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };

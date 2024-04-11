import { useRouter } from 'next/router';
import {GetStaticProps, NextPage } from 'next';
import Link from 'next/link'
import styles from '../page.module.css';
import {glob} from 'glob'
import fsPromises from 'fs/promises';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type PostProps = {
  pid: string,
  pageData: string
}

const Post: NextPage<PostProps> = (props) => {
  const router = useRouter();
  // console.log(props);
  if (router.isFallback || props.pid == 'notfound') {
    return <main className={styles.main}>そのようなページは存在しないようなんだよね。</main>;
  }
  const pid = props.pid;
  // const postFileName = `./post_${id}.json`;
  const pageData = JSON.parse(props.pageData)
  const xPostUrl = `https://twitter.com/intent/tweet?screen_name=masusu&ref_src=twsrc%5Etfw&text=${pageData.data.title}&url=http://www.masusu.jp/${pid}&hashtags=mssblog`

  // console.log(JSON.stringify(props.pageData));
  return (
    <main className={styles.main}>
      <div className={styles.article}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {pageData.content}
        </ReactMarkdown>
      </div>

      <Link href={xPostUrl} className={"twitter-mention-button"} data-show-count="false">Post to @masusu</Link><script async src="https://platform.twitter.com/widgets.js"></script>

    </main>
  );
};

export const getStaticPaths = async () => {
  const posts : Array<string>= await glob('./src/pages/post/post*.md')
  const paths = await Promise.all(posts.map(async post => {
    const filename = `./${post}`
    const regExp = /.*post_(.*)\.md/
    const matchResult = post.match(regExp)
    let pageAddress = ''
    if (matchResult === null) {
      pageAddress = '404.html'
    } else {
      pageAddress = `${matchResult[1]}`  // Array['targetString', 'matchedString]
    }
    return {params:{pid: pageAddress}}
  }))

  // const paths = [
  //   {
  //     params: {
  //       pid: '1'
  //     }
  //   },
  //   {
  //     params: {
  //       pid: '2'
  //     }
  //   },
  // ];
  return {paths, fallback: false};
}

export const getStaticProps: GetStaticProps = async (context)=>{
  const pid=context.params?.pid;
  const filename = `./src/pages/post/post_${pid}.md`;
  const fileStat = await fsPromises.stat(filename)
  .catch((err) => {
    return false;
  })

  if (fileStat === false) {
    return {props:{pid:'notfound'}}
  } else {
    const pageData = await fsPromises.readFile(filename, { encoding: "utf8" });
    // console.log(matter(pageData));
    return {props:{
      pid: pid,
      pageData: JSON.stringify(matter(pageData))
    }}
  }
}

export default Post;

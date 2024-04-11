import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import { GetStaticProps, GetStaticPropsContext } from 'next'
import {glob} from 'glob'
import fsPromises from 'fs/promises';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { match } from 'assert'

const articleDirectory = '/post/'
interface Article {
  name: string,
  address: string
}

type Articles = Article[]

export default function Home({articles}: {articles: Articles}) {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div>
          <h2>Contents</h2>
          <div>
            <Link href={'./about'}>About this page & Profile</Link>
          </div>
          <div>
            <div>
              <h2>Articles</h2>
              <ul>{articles.map((article) => <Link key={`${article.address}`} href={article.address}><li key={article.name}>{article.name}</li></Link>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


export const getStaticProps = async () => {
  const posts : Array<string>= await glob('./src/pages/post/post*.md')
  const articles : Articles= await Promise.all(posts.map(async post => {
    const filename = `./${post}`
    const regExp = /.*post_(.*)\.md/
    const matchResult = post.match(regExp)
    let pageAddress = ''
    if (matchResult === null) {
      pageAddress = '404.html'
    } else {
      pageAddress = `${articleDirectory}${matchResult[1]}`  // Array['targetString', 'matchedString]
    }
    const pageData = await fsPromises.readFile(filename, { encoding: "utf8" });
    const metaData = matter(pageData)['data']
    const date = metaData['date'].toLocaleDateString()
    const title = metaData['title']
    return {name:`${date}:${title}`, address: pageAddress}
  }))
  return {props: {articles}}

}

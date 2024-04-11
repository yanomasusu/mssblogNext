import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div>
          <h2>About this page & Author Profile</h2>
          <div>
            About:<br/>
            各種CMSを経て、今回はNext.jsを使用したSSGにより構成されたBLOG風サイトです。<br/>
            著者の思うところを一切のとりとめもなく雑多に書き記すサイトを予定。<br/>
          </div>
          <div>
            Author Profile:<br/>
              Name: 矢野雅士 as MSS<br/>
              Age: 48 (2024/4/8現在)<br/>
              Birth: Sapporo Hokkaido<br/>
              Gender: Male<br/>
              Family: My Loving Cute Wife and Pretty Cat<br/>
              Academic history: HIU(Hokkaido Information University online class)<br/>
              Job: Freelance Music Composer, Freelance Software Engineer<br/>
          </div>
        </div>
      </div>
    </main>
  )
}

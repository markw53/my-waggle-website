import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Dog Mating Website</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Our Dog Mating Service</h1>
        <p className={styles.description}>
          Find the perfect match for your dog to ensure healthy offspring.
        </p>
        <div className={styles.grid}>
          <Link href="/dogs">
            <a className={styles.card}>
              <h3>View Dogs &rarr;</h3>
              <p>See all dogs available for mating.</p>
            </a>
          </Link>
          <Link href="/about">
            <a className={styles.card}>
              <h3>About Us &rarr;</h3>
              <p>Learn more about our service.</p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  )
}
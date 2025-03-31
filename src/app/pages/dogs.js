// pages/dogs.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Link from 'next/link';

export async function getStaticProps() {
  const querySnapshot = await getDocs(collection(db, 'dogs'));
  const dogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return {
    props: {
      dogs,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

export default function Dogs({ dogs }) {
  return (
    <div>
      <h1>Available Dogs for Mating</h1>
      <ul>
        {dogs.map(dog => (
          <li key={dog.id}>
            <Link href={`/dogs/${dog.id}`}>
              <a>{dog.name} - {dog.breed}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
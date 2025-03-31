// pages/dogs/[id].js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export async function getStaticPaths() {
  const querySnapshot = await getDocs(collection(db, 'dogs'));
  const paths = querySnapshot.docs.map(doc => ({
    params: { id: doc.id },
  }));

  return {
    paths,
    fallback: 'blocking', // or 'true' if you want to handle loading states
  };
}

export async function getStaticProps({ params }) {
  const docRef = doc(db, 'dogs', params.id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      dog: { id: docSnap.id, ...docSnap.data() },
    },
    revalidate: 10,
  };
}

export default function DogProfile({ dog }) {
  return (
    <div>
      <h1>{dog.name}</h1>
      <p><strong>Breed:</strong> {dog.breed}</p>
      <p><strong>Age:</strong> {dog.age}</p>
      <p><strong>Description:</strong> {dog.description}</p>
    </div>
  );
}
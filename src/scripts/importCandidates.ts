import { rtdb } from '../firebase';
import { ref, set } from 'firebase/database';

interface Candidate {
  order: number;
  name: string;
  slug: string;
  photo: string;
  bio: string;
  status: 'active' | 'hidden' | 'winner';
}

const CANDIDATES: Candidate[] = [
  {
    order: 1,
    name: 'LÉONCIA',
    slug: 'leoncia',
    photo: '',
    bio: 'LÉONCIA est une candidate charismatique qui sait séduire par son sourire et sa détermination.',
    status: 'active',
  },
  {
    order: 2,
    name: 'CELIA',
    slug: 'celia',
    photo: '',
    bio: 'CELIA incarne l\'élégance et la raffinement. Elle est prête à briller sous les projecteurs.',
    status: 'active',
  },
  {
    order: 3,
    name: 'LAÏCA',
    slug: 'laica',
    photo: '',
    bio: 'LAÏCA apporte une touche d\'exotisme et de fraîcheur à la compétition Miss One Light.',
    status: 'active',
  },
  {
    order: 4,
    name: 'SARAH',
    slug: 'sarah',
    photo: '',
    bio: 'SARAH est une candidate forte qui ne craint pas les défis. Son charisme est indéniable.',
    status: 'active',
  },
  {
    order: 5,
    name: 'ANNA',
    slug: 'anna',
    photo: '',
    bio: 'ANNA séduit par sa simplicité et son authenticité. Elle a tout pour plaire.',
    status: 'active',
  },
  {
    order: 6,
    name: 'RÉUSSITE',
    slug: 'reussite',
    photo: '',
    bio: 'RÉUSSITE est la candidate qui porte haut les valeurs de la compétition. Elle est prête à gagner.',
    status: 'active',
  },
  {
    order: 7,
    name: 'JOHANNE',
    slug: 'johanne',
    photo: '',
    bio: 'JOHANNE apporte une énergie unique et une détermination sans faille.',
    status: 'active',
  },
  {
    order: 8,
    name: 'LEÏLA',
    slug: 'leila',
    photo: '',
    bio: 'LEÏLA est une candidate mystérieuse qui garde bien son secret jusqu\'au bout.',
    status: 'active',
  },
  {
    order: 9,
    name: 'DJENIFER',
    slug: 'djenifer',
    photo: '',
    bio: 'DJENIFER est une candidate audacieuse qui ose tout pour atteindre ses objectifs.',
    status: 'active',
  },
  {
    order: 10,
    name: 'RENÉE',
    slug: 'renee',
    photo: '',
    bio: 'RENÉE incarne la classe et le raffinement. Elle est une favorite des jurys.',
    status: 'active',
  },
  {
    order: 11,
    name: 'FANELLA',
    slug: 'fanella',
    photo: '',
    bio: 'FANELLA est une candidate pleine de vie qui sait captiver les foules.',
    status: 'active',
  },
  {
    order: 12,
    name: 'ARIANA',
    slug: 'ariana',
    photo: '',
    bio: 'ARIANA est la candidate la plus jeune mais aussi l\'une des plus prometteuses.',
    status: 'active',
  },
];

export async function importCandidates() {
  console.log('Début de l\'import des candidates...');

  try {
    for (const candidate of CANDIDATES) {
      // Use slug as key for easy querying
      const candidateRef = ref(rtdb, `missOneLight/candidates/${candidate.slug}`);
      await set(candidateRef, {
        order: candidate.order,
        name: candidate.name,
        slug: candidate.slug,
        photo: candidate.photo,
        bio: candidate.bio,
        votes: 0,
        status: candidate.status,
      });
      console.log(`✓ Candidate ajoutée: ${candidate.name} (ordre ${candidate.order})`);
    }

    console.log('\n✅ Import terminé avec succès !');
    console.log(`Total: ${CANDIDATES.length} candidates ajoutées`);
    return { success: true, count: CANDIDATES.length };
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    throw error;
  }
}

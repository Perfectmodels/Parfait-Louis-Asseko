import { Module } from '../types';

export const courseData: Module[] = [
  {
    slug: "module-1-les-fondamentaux-du-mannequinat",
    title: "Module 1: Les Fondamentaux du Mannequinat",
    chapters: [
      { 
        slug: "histoire-et-evolution-du-mannequinat",
        title: "Histoire et évolution du mannequinat", 
        content: `## 🧠 Histoire et Évolution du Mannequinat

### 1. Les Origines du Mannequinat

Avant le XIXᵉ siècle, les créateurs de mode ne faisaient pas porter leurs vêtements par des personnes, mais les présentaient sur des **poupées articulées** appelées *fashion dolls*. Ces miniatures permettaient d'envoyer les modèles dans différentes villes d'Europe pour promouvoir les créations d'une maison.

### 2. L'Invention du Mannequin Vivant

C'est dans les années **1850** que le couturier **Charles Frederick Worth**, considéré comme le **père de la haute couture**, révolutionne cette pratique. Installé à **Paris**, il décide de présenter ses créations sur de **vraies femmes** pour mieux mettre en valeur le tombé et le mouvement des tissus.
Sa femme, **Marie Vernet Worth**, devient la première à défiler pour lui. Elle est donc souvent considérée comme **la première mannequin de l'histoire**.

### 3. La Professionnalisation au Début du XXᵉ Siècle

Vers **1920–1930**, le mannequinat devient un véritable **métier**. L'américain **John Robert Powers** fonde l'une des **premières agences de mannequins** à New York, formant et représentant des femmes pour les défilés, catalogues et publicités.
Dans les années suivantes, des agences comme **Ford Models** (Eileen et Jerry Ford, 1946) institutionnalisent le métier et définissent les premiers standards professionnels.

### 4. L'Âge d'Or des Magazines de Mode

Après la **Seconde Guerre mondiale**, les magazines comme **Vogue**, **Harper's Bazaar** ou **Elle** popularisent les visages des mannequins à travers la **photographie de mode**.
Des icônes comme **Lisa Fonssagrives**, **Dovima**, **Suzy Parker** ou **Jean Shrimpton** deviennent mondialement connues.
Le mannequin cesse alors d'être un simple « porte-manteau » pour devenir une **muse artistique** et un **vecteur de rêve**.

### 5. Les Années 1960 : La Révolution de l'Image

Les **Swinging Sixties** marquent une rupture : les mannequins reflètent désormais les **valeurs de la jeunesse** et de la **liberté**.
Des figures comme **Twiggy**, avec sa silhouette androgyne et son style londonien, incarnent cette nouvelle ère.
Le mannequinat devient une **culture populaire**, liée à la musique, la photographie et la publicité.

### 6. Les Années 1980–1990 : L'Ère des Supermodels

C'est à la fin des années 1980 que naît le phénomène des **supermodels**, des mannequins mondialement célèbres dont les noms dépassent les podiums.
Les plus emblématiques — **Naomi Campbell**, **Cindy Crawford**, **Linda Evangelista**, **Christy Turlington**, **Claudia Schiffer** et **Tatjana Patitz** — forment le groupe surnommé les **"Big Six"**.
Ces mannequins deviennent des **icônes mondiales**, apparaissent dans les clips musicaux, les campagnes publicitaires et les plateaux TV.
Elles imposent une nouvelle forme de **starification du mannequinat**.

### 7. Les Années 2000–2010 : L'Évolution Numérique

Avec l'avènement d'Internet et des réseaux sociaux, le mannequinat s'adapte.
Les agences utilisent désormais les plateformes en ligne pour **découvrir et promouvoir** leurs talents.
De nouveaux profils émergent : des mannequins atypiques, plus diversifiés, qui brisent les standards physiques de l'époque.

### 8. L'Ère Digitale et les Mannequins-Influenceurs

Depuis les années 2010, le mannequinat est profondément transformé par **Instagram**, **TikTok** et les réseaux sociaux.
Les mannequins deviennent aussi des **influenceurs**. Des figures comme **Gigi Hadid**, **Bella Hadid**, **Kendall Jenner** ou **Winnie Harlow** construisent des carrières grâce à leur **image personnelle et leur communauté en ligne**.
Le **personal branding** devient un levier essentiel du succès.

### 9. Le Mannequinat Contemporain

Aujourd'hui, l'industrie met l'accent sur :
* la **diversité ethnique et corporelle**,
* la **représentation des genres**,
* l'**inclusivité** et l'**authenticité**.

Les podiums accueillent désormais des mannequins de toutes origines, tailles, âges et identités.
Le mannequinat moderne ne se résume plus à la beauté physique : il incarne désormais **une expression de soi et un engagement social**.

---

## 📚 Résumé de la leçon

Le mannequinat a évolué :
* Des **poupées d'exposition** aux **modèles vivants**,
* Des **défilés privés** à la **culture mondiale**,
* De la **haute couture** à la **diversité numérique**.

Chaque époque a façonné une nouvelle vision de la beauté, du rôle du mannequin et de son pouvoir d'influence.`,
        quiz: [
          {
            question: "Comment appelait-on les poupées articulées utilisées avant le XIXᵉ siècle pour présenter les créations de mode ?",
            options: ["Fashion dolls", "Model dolls", "Dress dolls", "Couture dolls"],
            correctAnswer: "Fashion dolls"
          },
          {
            question: "Qui est considéré comme le père de la haute couture ?",
            options: ["Christian Dior", "Charles Frederick Worth", "Coco Chanel", "Yves Saint Laurent"],
            correctAnswer: "Charles Frederick Worth"
          },
          {
            question: "Dans quelle ville Charles Frederick Worth était-il installé ?",
            options: ["Londres", "Paris", "New York", "Milan"],
            correctAnswer: "Paris"
          },
          {
            question: "Qui est considérée comme la première mannequin de l'histoire ?",
            options: ["Lisa Fonssagrives", "Marie Vernet Worth", "Twiggy", "Dovima"],
            correctAnswer: "Marie Vernet Worth"
          },
          {
            question: "Vers quelle période le mannequinat devient-il un véritable métier professionnalisé ?",
            options: ["1850–1860", "1920–1930", "1960–1970", "1990–2000"],
            correctAnswer: "1920–1930"
          },
          {
            question: "Qui a fondé l'une des premières agences de mannequins à New York ?",
            options: ["Charles Worth", "John Robert Powers", "Jerry Ford", "Gerald Marie"],
            correctAnswer: "John Robert Powers"
          },
          {
            question: "Quelle agence, fondée en 1946, a institutionnalisé les standards professionnels du mannequinat ?",
            options: ["Elite Model Management", "IMG Models", "Ford Models", "Next Management"],
            correctAnswer: "Ford Models"
          },
          {
            question: "Quel magazine a contribué à populariser les visages des mannequins après la Seconde Guerre mondiale ?",
            options: ["Vogue", "Cosmopolitan", "Marie Claire", "Glamour"],
            correctAnswer: "Vogue"
          },
          {
            question: "Quelle mannequin des années 1960 incarnait les 'Swinging Sixties' avec sa silhouette androgyne ?",
            options: ["Jean Shrimpton", "Twiggy", "Dovima", "Suzy Parker"],
            correctAnswer: "Twiggy"
          },
          {
            question: "Combien de mannequins forment le groupe des 'Big Six' des supermodels des années 1980-1990 ?",
            options: ["Quatre", "Cinq", "Six", "Sept"],
            correctAnswer: "Six"
          },
          {
            question: "Laquelle de ces mannequins fait partie du groupe 'Big Six' ?",
            options: ["Gigi Hadid", "Kendall Jenner", "Tatjana Patitz", "Bella Hadid"],
            correctAnswer: "Tatjana Patitz"
          },
          {
            question: "Quels réseaux sociaux ont profondément transformé le mannequinat depuis les années 2010 ?",
            options: ["Facebook et Twitter", "Instagram et TikTok", "LinkedIn et Pinterest", "Snapchat et Tumblr"],
            correctAnswer: "Instagram et TikTok"
          },
          {
            question: "Quel élément est devenu un levier essentiel du succès pour les mannequins à l'ère digitale ?",
            options: ["La taille", "Le personal branding", "L'âge", "La nationalité"],
            correctAnswer: "Le personal branding"
          },
          {
            question: "Quelle valeur majeure caractérise le mannequinat contemporain ?",
            options: ["L'exclusivité", "La standardisation", "L'inclusivité et la diversité", "La minceur extrême"],
            correctAnswer: "L'inclusivité et la diversité"
          }
        ]
      },
      { 
        slug: "les-differents-types-de-mannequinat",
        title: "Les différents types de mannequinat", 
        content: `Le terme "mannequin" recouvre une grande diversité de spécialisations, chacune avec ses propres exigences et marchés. Il est crucial pour un aspirant mannequin d'identifier le domaine qui correspond le mieux à son profil physique et à sa personnalité.
1.  **Mannequin de Défilé (Runway/Catwalk)** : C'est la facette la plus connue du métier. Ces mannequins présentent les collections des créateurs lors des Fashion Weeks. Les exigences de taille sont strictes (généralement 1m75-1m80 pour les femmes, 1m85-1m90 pour les hommes) et la démarche est une compétence fondamentale. On distingue la Haute Couture (démarche plus lente, théâtrale) du Prêt-à-porter (plus rapide et énergique).
2.  **Mannequin Photo (Print)** : Cette catégorie est très large et se subdivise :
    *   **Éditorial** : Pour les magazines de mode (Vogue, Harper's Bazaar). Le but est de raconter une histoire, de créer une atmosphère artistique. Les poses sont souvent créatives, avant-gardistes, et moins commerciales.
    *   **Commercial** : Pour les publicités, catalogues, sites e-commerce. L'objectif est de vendre un produit. Le mannequin doit avoir une apparence accessible, saine et positive. Le sourire est souvent de mise.
3.  **Mannequin Cabine (Fitting)** : Ce mannequin travaille en coulisses directement avec les créateurs et leurs équipes techniques. Son rôle est d'essayer les prototypes des collections. Il doit avoir des mensurations qui correspondent parfaitement au standard de la marque pour permettre un ajustement parfait des vêtements. C'est un travail technique et peu visible, mais essentiel.
4.  **Mannequin de Détail (Parts Model)** : Ces mannequins sont spécialisés dans une partie de leur corps : mains (bijoux, vernis), pieds (chaussures), jambes (collants), etc. La perfection de la partie du corps en question est le critère principal.
5.  **Mannequin Grande Taille (Plus-size)** : Ce secteur est en pleine expansion et promeut la diversité corporelle. Ces mannequins travaillent dans tous les domaines (défilé, commercial, éditorial) et répondent à une demande croissante pour une représentation plus réaliste de la société.
6.  **Mannequin Beauté (Beauty)** : Spécialisé dans les campagnes pour les cosmétiques, le maquillage, les soins de la peau et les produits capillaires. Un visage symétrique, une peau parfaite et des traits expressifs sont des atouts majeurs.`,
        quiz: [
          {
            question: "Quelle est l'exigence de taille typique pour les mannequins de défilé femmes ?",
            options: ["1m65-1m70", "1m75-1m81", "1m85-1m90", "Aucune exigence"],
            correctAnswer: "1m75-1m81"
          },
          {
            question: "Quelle est la principale différence entre la démarche Haute Couture et Prêt-à-porter ?",
            options: ["La hauteur des talons", "Le style des vêtements", "La vitesse (lente/théâtrale vs rapide/énergique)", "Le nombre de mannequins"],
            correctAnswer: "La vitesse (lente/théâtrale vs rapide/énergique)"
          },
          {
            question: "Quel type de mannequinat vise à raconter une histoire de façon artistique dans les magazines ?",
            options: ["Commercial", "Éditorial", "Cabine", "Beauté"],
            correctAnswer: "Éditorial"
          },
          {
            question: "Pour quel type de magazines travaille principalement le mannequin éditorial ?",
            options: ["Catalogues de vente", "Vogue et Harper's Bazaar", "Sites e-commerce", "Publicités TV"],
            correctAnswer: "Vogue et Harper's Bazaar"
          },
          {
            question: "Quel est le rôle principal du mannequin cabine (fitting) ?",
            options: ["Défiler sur les podiums", "Essayer les prototypes des collections", "Poser pour des publicités", "Faire du mannequinat de détail"],
            correctAnswer: "Essayer les prototypes des collections"
          },
          {
            question: "Qu'est-ce qu'un mannequin de détail (Parts Model) ?",
            options: ["Un mannequin qui travaille dans les magasins", "Un mannequin spécialisé dans une partie du corps", "Un mannequin pour les petits formats", "Un mannequin débutant"],
            correctAnswer: "Un mannequin spécialisé dans une partie du corps"
          },
          {
            question: "Quelles parties du corps peuvent être spécialisées pour un mannequin de détail ?",
            options: ["Uniquement les mains", "Mains, pieds, jambes", "Uniquement le visage", "Tout le corps"],
            correctAnswer: "Mains, pieds, jambes"
          },
          {
            question: "Quel secteur du mannequinat est en pleine expansion et promeut la diversité corporelle ?",
            options: ["Mannequin cabine", "Mannequin grande taille (Plus-size)", "Mannequin de détail", "Mannequin beauté"],
            correctAnswer: "Mannequin grande taille (Plus-size)"
          },
          {
            question: "Pour quel type de produits le mannequin beauté se spécialise-t-il ?",
            options: ["Vêtements de sport", "Cosmétiques et soins de la peau", "Bijoux", "Chaussures"],
            correctAnswer: "Cosmétiques et soins de la peau"
          },
          {
            question: "Quel est l'objectif principal du mannequinat commercial ?",
            options: ["Créer une atmosphère artistique", "Vendre un produit", "Essayer des prototypes", "Défiler en haute couture"],
            correctAnswer: "Vendre un produit"
          },
          {
            question: "Quelle est l'apparence typique recherchée pour le mannequinat commercial ?",
            options: ["Edgy et avant-gardiste", "Accessible, saine et positive", "Très grande taille uniquement", "Traits dramatiques"],
            correctAnswer: "Accessible, saine et positive"
          }
        ]
      },
      { 
        slug: "comprendre-les-agences-et-le-role-de-lagent",
        title: "Comprendre les agences et le rôle de l'agent", 
        content: `Une agence de mannequins est le partenaire indispensable à la construction d'une carrière. Elle agit comme un manager, un conseiller et un intermédiaire entre le mannequin et les clients (marques, magazines, directeurs de casting).
**La structure des agences :**
*   **L'Agence Mère (Mother Agency)** : C'est souvent la première agence qui découvre et signe un mannequin. Son rôle est de développer le talent : formation, création du premier book, définition de l'image. Elle investit dans le mannequin et le guide dans ses premiers pas. Elle perçoit une commission sur tous les contrats du mannequin, même ceux conclus par d'autres agences.
*   **L'Agence de Placement (Placement Agency)** : Une fois qu'un mannequin est prêt pour les marchés internationaux, son agence mère le "place" dans des agences partenaires dans les grandes capitales de la mode (Paris, Milan, New York, etc.). Ces agences locales gèrent les castings et les contrats sur leur marché spécifique.

**Le rôle de l'Agent (ou Booker) :**
L'agent est le contact principal du mannequin au sein de l'agence. Ses missions sont multiples et cruciales :
*   **Gestion de carrière** : Il définit une stratégie à long terme en accord avec le mannequin, choisissant les opportunités qui correspondent à son image et à ses objectifs.
*   **Organisation des castings** : Il reçoit les briefs des clients et envoie les mannequins correspondants en casting ("go-sees").
*   **Négociation des contrats** : C'est une de ses tâches les plus importantes. Il négocie le cachet (la rémunération), mais aussi et surtout les droits d'utilisation de l'image (durée, territoire, supports de diffusion).
*   **Gestion du planning** : Il organise l'emploi du temps très chargé du mannequin entre les castings, les fittings, les shootings et les défilés.
*   **Facturation et paiement** : L'agence s'occupe de facturer le client et de verser sa paie au mannequin, après avoir prélevé sa commission (généralement 20% pour l'agence de placement et 10% supplémentaires pour l'agence mère).

Une bonne relation de confiance et de communication entre le mannequin et son agent est la pierre angulaire d'une carrière réussie.`,
        quiz: [
          {
            question: "Quel rôle joue une agence de mannequins dans la carrière d'un mannequin ?",
            options: ["Uniquement la facturation", "Manager, conseiller et intermédiaire", "Uniquement la formation", "Uniquement les castings"],
            correctAnswer: "Manager, conseiller et intermédiaire"
          },
          {
            question: "Qu'est-ce qu'une agence mère (Mother Agency) ?",
            options: ["L'agence qui gère uniquement les paiements", "La première agence qui découvre et développe le mannequin", "Une agence située dans le pays d'origine du mannequin", "Une agence réservée aux femmes"],
            correctAnswer: "La première agence qui découvre et développe le mannequin"
          },
          {
            question: "Quel est le rôle principal de l'agence mère ?",
            options: ["Uniquement placer le mannequin à l'international", "Développer le talent: formation, book, définition de l'image", "Organiser les défilés", "Créer les vêtements"],
            correctAnswer: "Développer le talent: formation, book, définition de l'image"
          },
          {
            question: "Qu'est-ce qu'une agence de placement (Placement Agency) ?",
            options: ["L'agence qui découvre les mannequins", "L'agence partenaire dans les capitales de la mode", "L'agence qui vend des vêtements", "L'agence de relations publiques"],
            correctAnswer: "L'agence partenaire dans les capitales de la mode"
          },
          {
            question: "Dans quelles villes l'agence mère place-t-elle généralement les mannequins ?",
            options: ["Uniquement à Paris", "Dans les petites villes", "Paris, Milan, New York, etc.", "Uniquement en Amérique"],
            correctAnswer: "Paris, Milan, New York, etc."
          },
          {
            question: "Comment appelle-t-on aussi l'agent dans le milieu du mannequinat ?",
            options: ["Manager", "Booker", "Director", "Producer"],
            correctAnswer: "Booker"
          },
          {
            question: "Quelle est l'une des tâches les plus importantes de l'agent ?",
            options: ["Maquiller les mannequins", "Négocier les contrats et les droits d'image", "Créer les vêtements", "Photographier les mannequins"],
            correctAnswer: "Négocier les contrats et les droits d'image"
          },
          {
            question: "Quelle est la commission typique de l'agence de placement ?",
            options: ["10%", "20%", "30%", "50%"],
            correctAnswer: "20%"
          },
          {
            question: "Quelle commission supplémentaire l'agence mère perçoit-elle généralement ?",
            options: ["5%", "10%", "15%", "20%"],
            correctAnswer: "10%"
          },
          {
            question: "Qu'organise l'agent pour le mannequin avec les clients potentiels ?",
            options: ["Des vacances", "Des go-sees et castings", "Des cours de danse", "Des achats"],
            correctAnswer: "Des go-sees et castings"
          },
          {
            question: "Qu'est-ce qui est essentiel pour une carrière réussie selon ce chapitre ?",
            options: ["Avoir beaucoup d'agences", "Une bonne relation de confiance avec son agent", "Changer souvent d'agence", "Ne jamais parler à son agent"],
            correctAnswer: "Une bonne relation de confiance avec son agent"
          },
          {
            question: "Qui s'occupe de la facturation des clients et du paiement du mannequin ?",
            options: ["Le mannequin lui-même", "L'agence", "Le client directement", "Un avocat"],
            correctAnswer: "L'agence"
          }
        ]
      },
      { 
        slug: "limportance-de-limage-et-du-personal-branding",
        title: "L'importance de l'image et du personal branding", 
        content: `À une époque où des milliers de mannequins sont en compétition, avoir un physique qui correspond aux standards ne suffit plus. Pour se démarquer, il est essentiel de développer une marque personnelle forte, un "personal branding". Votre personal branding, c'est ce qui vous rend unique, mémorable et désirable pour les clients. C'est la somme de votre apparence, de votre personnalité, de vos valeurs et de la manière dont vous communiquez.
**Définir sa marque :**
Posez-vous les bonnes questions : Quelle est ma singularité ? Suis-je le mannequin "edgy" et androgyne, la beauté classique et intemporelle, ou la fille athlétique et naturelle ? Quelle histoire je veux raconter ? Vos réponses vous aideront à construire une image cohérente.

**Cohérence sur tous les supports :**
Votre personal branding doit être visible partout :
*   **Votre book** : Les photos doivent refléter votre identité. Si vous visez le marché de la haute couture, votre book doit contenir des images éditoriales fortes plutôt que des photos commerciales souriantes.
*   **Votre style personnel** : La manière dont vous vous habillez pour les castings ("off-duty style") est scrutée. Elle doit être à la fois tendance et le reflet de votre personnalité.
*   **Vos réseaux sociaux** : Instagram est votre vitrine. Votre feed doit être soigné et professionnel, mélangeant photos de travail et aperçus plus personnels qui renforcent votre marque. C'est un outil puissant pour attirer l'attention des directeurs de casting et des marques.

**Professionnalisme et réputation :**
Votre marque personnelle inclut aussi votre réputation. Être ponctuel, poli, facile à vivre et travailleur fait partie intégrante de votre image. Dans une petite industrie comme la mode, une mauvaise réputation peut se propager très vite et freiner une carrière.

En résumé, le personal branding, c'est le fait de ne plus être un simple visage, mais de devenir une marque. C'est ce qui transforme un mannequin en icône.`,
        quiz: [
          {
            question: "Pourquoi le personal branding est-il essentiel aujourd'hui ?",
            options: ["Avoir un physique standard suffit", "Des milliers de mannequins sont en compétition", "Les agences n'existent plus", "La mode n'est plus importante"],
            correctAnswer: "Des milliers de mannequins sont en compétition"
          },
          {
            question: "Qu'est-ce que le personal branding ?",
            options: ["Un type de vêtement", "Ce qui vous rend unique, mémorable et désirable", "Une agence de mannequins", "Un magazine de mode"],
            correctAnswer: "Ce qui vous rend unique, mémorable et désirable"
          },
          {
            question: "Le personal branding est la somme de quoi ?",
            options: ["Uniquement l'apparence physique", "Apparence, personnalité, valeurs et communication", "Uniquement les photos", "Uniquement les réseaux sociaux"],
            correctAnswer: "Apparence, personnalité, valeurs et communication"
          },
          {
            question: "Quelle question doit-on se poser pour définir sa marque ?",
            options: ["Combien vais-je gagner ?", "Quelle est ma singularité ?", "Où habitent mes concurrents ?", "Quel est mon poids ?"],
            correctAnswer: "Quelle est ma singularité ?"
          },
          {
            question: "Si vous visez la haute couture, que doit contenir votre book ?",
            options: ["Des photos commerciales souriantes", "Des images éditoriales fortes", "Des selfies Instagram", "Des photos de vacances"],
            correctAnswer: "Des images éditoriales fortes"
          },
          {
            question: "Comment appelle-t-on le style vestimentaire pour les castings ?",
            options: ["Casual style", "Off-duty style", "Business style", "Street style"],
            correctAnswer: "Off-duty style"
          },
          {
            question: "Quel réseau social est décrit comme votre vitrine principale ?",
            options: ["Facebook", "Instagram", "Twitter", "LinkedIn"],
            correctAnswer: "Instagram"
          },
          {
            question: "Que doit mélanger votre feed Instagram ?",
            options: ["Photos de travail et aperçus personnels", "Uniquement des publicités", "Uniquement des selfies", "Uniquement des photos de nourriture"],
            correctAnswer: "Photos de travail et aperçus personnels"
          },
          {
            question: "Qu'est-ce qui fait aussi partie de votre marque personnelle ?",
            options: ["Uniquement vos photos", "Votre réputation et votre professionnalisme", "Uniquement votre taille", "Uniquement votre agence"],
            correctAnswer: "Votre réputation et votre professionnalisme"
          },
          {
            question: "Pourquoi une mauvaise réputation est-elle dangereuse dans la mode ?",
            options: ["L'industrie est très grande", "L'industrie est petite et l'information se propage vite", "Personne ne se parle", "Les réseaux sociaux n'existent pas"],
            correctAnswer: "L'industrie est petite et l'information se propage vite"
          },
          {
            question: "Qu'est-ce que le personal branding transforme ?",
            options: ["Un mannequin en photographe", "Un mannequin en designer", "Un simple visage en une marque/icône", "Un mannequin en agent"],
            correctAnswer: "Un simple visage en une marque/icône"
          }
        ]
      },
      { 
        slug: "les-mensurations-et-standards-de-lindustrie",
        title: "Les mensurations et standards de l'industrie", 
        content: `Bien que l'industrie de la mode s'ouvre de plus en plus à la diversité, les mensurations restent un critère technique important, en particulier pour le mannequinat de défilé et de haute couture. Les vêtements des collections sont créés dans une taille unique (taille d'échantillon ou "sample size"), et les mannequins sont choisis pour leur capacité à porter ces vêtements parfaitement.
**Comment prendre ses mensurations ?**
Il est essentiel de connaître ses mensurations exactes et de les mettre à jour régulièrement. Utilisez un mètre-ruban souple.
*   **Pour les femmes :**
    *   **Poitrine (Bust)** : Mesurez au point le plus fort de la poitrine.
    *   **Taille (Waist)** : Mesurez au creux de la taille, la partie la plus fine du torse.
    *   **Hanches (Hips)** : Mesurez à l'endroit le plus large des hanches et des fesses.
    *   **Hauteur (Height)** : Tenez-vous droit, sans chaussures.
*   **Pour les hommes :**
    *   **Poitrine (Chest)** : Mesurez sous les aisselles, au point le plus large de la poitrine.
    *   **Taille (Waist)** : Mesurez au niveau du nombril.
    *   **Hauteur (Height)** : Tenez-vous droit, sans chaussures.
    *   On demande aussi souvent la taille de confection de veste (ex: 40R US / 50 EU) et le tour de cou.

**Les standards actuels (à titre indicatif) :**
*   **Mannequins défilé femmes** : Taille entre 1m75 et 1m81. Tour de poitrine environ 86 cm (34"), tour de taille environ 61 cm (24"), tour de hanches environ 89 cm (35").
*   **Mannequins défilé hommes** : Taille entre 1m83 et 1m90. Poitrine entre 94 et 102 cm (37-40"), taille entre 76 et 81 cm (30-32").

Il est important de noter que ces standards sont des guides et non des règles absolues. Le plus important est la proportionnalité du corps. De plus, les marchés commerciaux et éditoriaux sont beaucoup plus flexibles.
Enfin, la santé doit toujours primer. Maintenir ses mensurations doit se faire par une alimentation saine et une activité physique régulière, jamais par des régimes extrêmes et dangereux.`,
        quiz: [
          {
            question: "Pourquoi les mensurations sont-elles importantes en haute couture ?",
            options: ["Pour la publicité", "Les vêtements sont créés dans une taille unique (sample size)", "Pour les magazines", "Pour les réseaux sociaux"],
            correctAnswer: "Les vêtements sont créés dans une taille unique (sample size)"
          },
          {
            question: "Quel outil doit-on utiliser pour prendre ses mensurations ?",
            options: ["Un mètre rigide", "Un mètre-ruban souple", "Une règle", "Un laser"],
            correctAnswer: "Un mètre-ruban souple"
          },
          {
            question: "Où mesure-t-on la poitrine chez les femmes ?",
            options: ["Sous les aisselles", "Au point le plus fort de la poitrine", "Au niveau du nombril", "Au niveau du cou"],
            correctAnswer: "Au point le plus fort de la poitrine"
          },
          {
            question: "Où mesure-t-on la taille chez les femmes ?",
            options: ["Au niveau des hanches", "Au creux de la taille (partie la plus fine)", "Au niveau du nombril", "Sous la poitrine"],
            correctAnswer: "Au creux de la taille (partie la plus fine)"
          },
          {
            question: "Où mesure-t-on la poitrine chez les hommes ?",
            options: ["Au point le plus fort", "Sous les aisselles, au point le plus large", "Au niveau du nombril", "Au niveau des épaules"],
            correctAnswer: "Sous les aisselles, au point le plus large"
          },
          {
            question: "Quelle est la plage de taille pour les mannequins défilé femmes ?",
            options: ["1m65-1m70", "1m75-1m81", "1m85-1m90", "1m60-1m75"],
            correctAnswer: "1m75-1m81"
          },
          {
            question: "Quel est le tour de taille standard pour les mannequins défilé femmes ?",
            options: ["50 cm", "61 cm (24\")", "70 cm", "80 cm"],
            correctAnswer: "61 cm (24\")"
          },
          {
            question: "Quelle est la plage de taille pour les mannequins défilé hommes ?",
            options: ["1m75-1m80", "1m80-1m85", "1m83-1m90", "1m90-2m00"],
            correctAnswer: "1m83-1m90"
          },
          {
            question: "Les standards de mensurations sont-ils des règles absolues ?",
            options: ["Oui, toujours", "Non, ce sont des guides", "Oui, mais seulement pour les femmes", "Oui, mais seulement pour les hommes"],
            correctAnswer: "Non, ce sont des guides"
          },
          {
            question: "Qu'est-ce qui est le plus important selon le chapitre ?",
            options: ["La taille exacte", "La proportionnalité du corps", "Le poids", "L'âge"],
            correctAnswer: "La proportionnalité du corps"
          },
          {
            question: "Comment doit-on maintenir ses mensurations ?",
            options: ["Par des régimes extrêmes", "Par alimentation saine et activité physique régulière", "En ne mangeant rien", "En prenant des médicaments"],
            correctAnswer: "Par alimentation saine et activité physique régulière"
          },
          {
            question: "Qu'est-ce qui doit toujours primer ?",
            options: ["L'apparence", "La santé", "Le poids", "La taille"],
            correctAnswer: "La santé"
          }
        ]
      },
      { 
        slug: "le-vocabulaire-de-la-mode",
        title: "Le vocabulaire de la mode", 
        content: `Pour naviguer avec aisance dans l'industrie de la mode, il est indispensable de maîtriser son jargon. Comprendre ces termes vous fera paraître plus professionnel et facilitera la communication avec les agents, les photographes et les clients.
*   **Book / Portfolio** : Votre album de photos professionnelles. C'est votre principal outil de promotion.
*   **Composite (Comp Card / Z-Card)** : Votre carte de visite. Un carton format A5 avec votre meilleure photo en grand, quelques autres photos plus petites au dos, et vos informations essentielles (nom, agence, mensurations, contact).
*   **Casting** : Un rendez-vous pour un entretien ou une audition pour un travail spécifique (défilé, shooting, etc.).
*   **Go-See** : Un rendez-vous informel organisé par votre agence pour rencontrer des clients potentiels (photographes, directeurs artistiques) afin qu'ils vous découvrent pour de futurs projets.
*   **Call-back** : Une deuxième audition. Si un client vous convoque pour un call-back, cela signifie que votre profil l'a intéressé lors du premier casting.
*   **Fitting / Essayage** : Séance d'essayage des vêtements avant un défilé ou un shooting pour s'assurer que tout est à la bonne taille et faire les retouches nécessaires.
*   **Lookbook** : Un ensemble de photos présentant la nouvelle collection d'une marque, souvent destiné aux acheteurs professionnels. Les poses sont généralement simples et commerciales.
*   **Éditorial (Edito)** : Une série de photos dans un magazine qui raconte une histoire ou illustre une tendance. Le style est plus artistique et créatif que commercial.
*   **Runway / Catwalk** : Le podium sur lequel les mannequins défilent.
*   **Backstage / Coulisses** : La zone située derrière le podium où se déroulent les préparatifs (maquillage, coiffure, habillage).
*   **Pola / Digitals** : Des photos très simples et naturelles (sans maquillage, sans retouches) prises sur un fond neutre. Elles permettent aux clients de voir le mannequin tel qu'il est réellement.
*   **Booker / Agent** : La personne au sein de l'agence qui gère votre carrière, négocie vos contrats et vous envoie en casting.`,
        quiz: [
          {
            question: "Qu'est-ce qu'un Book ou Portfolio ?",
            options: ["Un magazine", "Votre album de photos professionnelles", "Un contrat", "Une agence"],
            correctAnswer: "Votre album de photos professionnelles"
          },
          {
            question: "Qu'est-ce qu'un Composite (Comp Card) ?",
            options: ["Un livre", "Votre carte de visite avec photos et infos", "Un type de vêtement", "Un rendez-vous"],
            correctAnswer: "Votre carte de visite avec photos et infos"
          },
          {
            question: "Qu'est-ce qu'un Casting ?",
            options: ["Un défilé", "Un rendez-vous/audition pour un travail spécifique", "Une photo", "Un magazine"],
            correctAnswer: "Un rendez-vous/audition pour un travail spécifique"
          },
          {
            question: "Qu'est-ce qu'un Go-See ?",
            options: ["Un type de défilé", "Un rendez-vous informel avec clients potentiels", "Un shooting photo", "Un contrat"],
            correctAnswer: "Un rendez-vous informel avec clients potentiels"
          },
          {
            question: "Que signifie un Call-back ?",
            options: ["Annulation d'un contrat", "Une deuxième audition", "Un appel téléphonique", "Un refus"],
            correctAnswer: "Une deuxième audition"
          },
          {
            question: "Qu'est-ce qu'un Fitting / Essayage ?",
            options: ["Un défilé", "Séance d'essayage des vêtements avant un événement", "Un shooting photo", "Un casting"],
            correctAnswer: "Séance d'essayage des vêtements avant un événement"
          },
          {
            question: "Qu'est-ce qu'un Lookbook ?",
            options: ["Un magazine de mode", "Ensemble de photos présentant une collection", "Un carnet de notes", "Un portefolio personnel"],
            correctAnswer: "Ensemble de photos présentant une collection"
          },
          {
            question: "Qu'est-ce qu'un Éditorial (Edito) ?",
            options: ["Une publicité commerciale", "Série de photos artistiques dans un magazine", "Un catalogue de vente", "Un défilé"],
            correctAnswer: "Série de photos artistiques dans un magazine"
          },
          {
            question: "Qu'est-ce que le Runway ou Catwalk ?",
            options: ["Une salle de maquillage", "Le podium pour défiler", "Un studio photo", "Un bureau d'agence"],
            correctAnswer: "Le podium pour défiler"
          },
          {
            question: "Que signifie Backstage / Coulisses ?",
            options: ["Le public", "Zone derrière le podium où se font les préparatifs", "Le podium", "La salle de conférence"],
            correctAnswer: "Zone derrière le podium où se font les préparatifs"
          },
          {
            question: "Que sont les Pola / Digitals ?",
            options: ["Photos retouchées artistiques", "Photos simples et naturelles sans maquillage", "Photos de mode professionnelles", "Photos de famille"],
            correctAnswer: "Photos simples et naturelles sans maquillage"
          },
          {
            question: "Qu'est-ce qu'un Booker ?",
            options: ["Un photographe", "La personne qui gère votre carrière dans l'agence", "Un directeur artistique", "Un maquilleur"],
            correctAnswer: "La personne qui gère votre carrière dans l'agence"
          }
        ]
      },
      { 
        slug: "hygiene-de-vie-et-nutrition-du-mannequin",
        title: "Hygiène de vie et nutrition du mannequin", 
        content: `Le corps d'un mannequin est son principal instrument de travail. En prendre soin n'est pas une option, c'est une exigence professionnelle fondamentale. Une excellente hygiène de vie est la base d'une carrière longue et saine.
**Nutrition :**
Il ne s'agit pas de se priver, mais de manger intelligemment. L'objectif est d'avoir une peau éclatante, des cheveux forts et l'énergie nécessaire pour tenir durant de longues journées de travail.
*   **Équilibre** : Privilégiez une alimentation riche en fruits, légumes, protéines maigres (poulet, poisson, tofu) et bonnes graisses (avocat, noix, huile d'olive).
*   **Hydratation** : Buvez beaucoup d'eau tout au long de la journée (au moins 1,5 à 2 litres). L'eau est essentielle pour une belle peau et pour l'énergie.
*   **Éviter les excès** : Limitez les aliments transformés, trop sucrés ou trop salés, ainsi que l'alcool, qui peuvent ternir le teint et causer des ballonnements.
*   **Timing** : Mangez des repas réguliers pour maintenir un niveau d'énergie stable. Ne sautez jamais le petit-déjeuner, surtout un jour de shooting.

**Activité physique :**
L'exercice est crucial non seulement pour maintenir des mensurations stables, mais aussi pour la posture, la tonicité et le bien-être mental.
*   **Mix d'activités** : Combinez cardio (course, natation) pour l'endurance, et des exercices de renforcement musculaire (Pilates, yoga, musculation légère) pour sculpter et tonifier le corps.
*   **Régularité** : Visez 3 à 5 séances par semaine. La régularité est plus importante que l'intensité.
*   **Posture** : Le yoga et le Pilates sont particulièrement recommandés car ils renforcent les muscles profonds et améliorent considérablement la posture.

**Soins de la peau et sommeil :**
*   **Routine de soin** : Nettoyez, hydratez et protégez votre peau du soleil tous les jours. Le démaquillage complet et minutieux après chaque shooting est non négociable.
*   **Sommeil** : Visez 7 à 9 heures de sommeil par nuit. C'est pendant le sommeil que la peau se régénère et que le corps récupère. Le manque de sommeil est visible immédiatement sur le visage.`,
        quiz: [
          {
            question: "Quel est le principal instrument de travail d'un mannequin ?",
            options: ["Le book", "Le corps", "Les réseaux sociaux", "L'agence"],
            correctAnswer: "Le corps"
          },
          {
            question: "Quel est l'objectif d'une bonne nutrition pour un mannequin ?",
            options: ["Perdre du poids rapidement", "Avoir une peau éclatante, des cheveux forts et de l'énergie", "Manger le moins possible", "Suivre des régimes extrêmes"],
            correctAnswer: "Avoir une peau éclatante, des cheveux forts et de l'énergie"
          },
          {
            question: "Quels types d'aliments privilégier pour une alimentation équilibrée ?",
            options: ["Aliments transformés et sucrés", "Fruits, légumes, protéines maigres et bonnes graisses", "Fast-food", "Uniquement des suppléments"],
            correctAnswer: "Fruits, légumes, protéines maigres et bonnes graisses"
          },
          {
            question: "Quelle quantité d'eau minimum faut-il boire par jour ?",
            options: ["0,5 litre", "1 litre", "1,5 à 2 litres", "3 litres"],
            correctAnswer: "1,5 à 2 litres"
          },
          {
            question: "Quel repas ne faut-il jamais sauter, surtout un jour de shooting ?",
            options: ["Le dîner", "Le goûter", "Le petit-déjeuner", "Le déjeuner"],
            correctAnswer: "Le petit-déjeuner"
          },
          {
            question: "Combien de séances d'exercice physique faut-il viser par semaine ?",
            options: ["1 séance", "2 séances", "3 à 5 séances", "7 séances"],
            correctAnswer: "3 à 5 séances"
          },
          {
            question: "Quels types d'exercices sont recommandés pour la posture ?",
            options: ["Uniquement la course", "Yoga et Pilates", "Uniquement la musculation", "Uniquement la natation"],
            correctAnswer: "Yoga et Pilates"
          },
          {
            question: "Qu'est-ce qui est plus important : la régularité ou l'intensité de l'exercice ?",
            options: ["L'intensité", "La régularité", "Ni l'un ni l'autre", "Les deux également"],
            correctAnswer: "La régularité"
          },
          {
            question: "Que faut-il faire après chaque shooting concernant la peau ?",
            options: ["Rien de spécial", "Démaquillage complet et minutieux (non négociable)", "Attendre le lendemain", "Juste rincer à l'eau"],
            correctAnswer: "Démaquillage complet et minutieux (non négociable)"
          },
          {
            question: "Combien d'heures de sommeil faut-il viser par nuit ?",
            options: ["4 à 5 heures", "5 à 6 heures", "7 à 9 heures", "10 à 12 heures"],
            correctAnswer: "7 à 9 heures"
          },
          {
            question: "Que se passe-t-il pendant le sommeil ?",
            options: ["Rien d'important", "La peau se régénère et le corps récupère", "On perd des calories uniquement", "On prend du poids"],
            correctAnswer: "La peau se régénère et le corps récupère"
          },
          {
            question: "Où le manque de sommeil est-il visible immédiatement ?",
            options: ["Sur les mains", "Sur le visage", "Sur les pieds", "Sur le dos"],
            correctAnswer: "Sur le visage"
          }
        ]
      },
      { 
        slug: "ethique-et-professionnalisme-dans-le-metier",
        title: "Éthique et professionnalisme dans le métier", 
        content: `Dans l'industrie de la mode, la réputation est primordiale. Un mannequin peut avoir le physique parfait, mais s'il n'est pas professionnel, sa carrière sera de courte durée. Le professionnalisme est un ensemble de comportements et d'attitudes qui inspirent confiance aux clients et aux équipes.
**La Ponctualité :**
C'est la règle d'or. Arriver en retard à un casting, un fitting ou un shooting est un manque de respect pour toute l'équipe et peut vous coûter le contrat. Prévoyez toujours une marge pour les imprévus. Arriver 10-15 minutes en avance est idéal.

**La Préparation :**
Venez toujours préparé. Pour un casting, cela signifie avoir son book et ses composites, porter la tenue demandée ("casting uniform" : simple et près du corps), et s'être renseigné sur le client. Pour un shooting, cela signifie arriver avec une peau propre, des ongles soignés et les sous-vêtements adéquats (couleur chair, sans couture).

**L'Attitude sur le lieu de travail :**
*   **Positive et Énergique** : Les journées de shooting peuvent être longues et fatigantes. Gardez une attitude positive et soyez une source d'énergie pour l'équipe, pas un poids.
*   **Respectueuse** : Soyez poli et respectueux avec absolument tout le monde, du photographe de renom à l'assistant stagiaire. Chaque personne sur le plateau joue un rôle important.
*   **À l'écoute** : Écoutez attentivement les directives du photographe et du directeur artistique. Soyez flexible et disposé à essayer différentes choses.
*   **Pas de plaintes** : Évitez de vous plaindre (du froid, de la faim, de la tenue inconfortable). Faites part de réels problèmes avec calme et professionnalisme à votre agent ou au producteur.

**La Fiabilité :**
Si vous êtes booké pour un travail, vous devez honorer votre engagement. Les annulations de dernière minute sans raison valable (maladie grave) peuvent gravement nuire à votre réputation et à celle de votre agence.

En somme, le mannequin professionnel est celui que les clients aiment booker à nouveau non seulement pour son physique, mais aussi pour sa fiabilité, son attitude et sa capacité à rendre la journée de travail agréable et productive pour tous.`,
        quiz: [
          {
            question: "Qu'est-ce qui est primordial dans l'industrie de la mode ?",
            options: ["L'âge", "La réputation", "La nationalité", "La couleur des cheveux"],
            correctAnswer: "La réputation"
          },
          {
            question: "Quelle est la règle d'or du professionnalisme ?",
            options: ["Être photogénique", "La ponctualité", "Avoir beaucoup de followers", "Connaître tout le monde"],
            correctAnswer: "La ponctualité"
          },
          {
            question: "Combien de minutes en avance est-il idéal d'arriver ?",
            options: ["5 minutes", "10-15 minutes", "30 minutes", "1 heure"],
            correctAnswer: "10-15 minutes"
          },
          {
            question: "Qu'est-ce que le 'casting uniform' ?",
            options: ["Un uniforme de marque", "Une tenue simple et près du corps", "Un costume formel", "Des vêtements de sport"],
            correctAnswer: "Une tenue simple et près du corps"
          },
          {
            question: "Comment doit-on arriver à un shooting ?",
            options: ["Maquillé et coiffé", "Avec une peau propre, des ongles soignés et les sous-vêtements adéquats", "En tenue de soirée", "Comme on veut"],
            correctAnswer: "Avec une peau propre, des ongles soignés et les sous-vêtements adéquats"
          },
          {
            question: "Quelle attitude doit-on avoir sur le lieu de travail ?",
            options: ["Indifférente", "Positive et énergique", "Critique", "Silencieuse"],
            correctAnswer: "Positive et énergique"
          },
          {
            question: "Comment doit-on traiter l'assistant stagiaire ?",
            options: ["L'ignorer", "Avec politesse et respect comme tout le monde", "Lui donner des ordres", "Le critiquer"],
            correctAnswer: "Avec politesse et respect comme tout le monde"
          },
          {
            question: "Comment doit-on réagir aux directives du photographe ?",
            options: ["Les ignorer", "Écouter attentivement et être flexible", "Les critiquer", "Imposer ses propres idées"],
            correctAnswer: "Écouter attentivement et être flexible"
          },
          {
            question: "Que faut-il éviter de faire sur un plateau ?",
            options: ["Écouter", "Se plaindre du froid, de la faim, etc.", "Sourire", "Être flexible"],
            correctAnswer: "Se plaindre du froid, de la faim, etc."
          },
          {
            question: "Que doit-on faire si on a un réel problème sur le plateau ?",
            options: ["Se plaindre à haute voix", "En faire part avec calme et professionnalisme à son agent", "Ne rien dire", "Partir immédiatement"],
            correctAnswer: "En faire part avec calme et professionnalisme à son agent"
          },
          {
            question: "Qu'est-ce qui peut gravement nuire à votre réputation ?",
            options: ["Être à l'heure", "Les annulations de dernière minute sans raison valable", "Être professionnel", "Écouter les directives"],
            correctAnswer: "Les annulations de dernière minute sans raison valable"
          },
          {
            question: "Pour quoi les clients aiment-ils rebooker un mannequin professionnel ?",
            options: ["Uniquement son physique", "Son physique, sa fiabilité, son attitude et sa capacité à rendre la journée agréable", "Sa popularité sur Instagram", "Son agence"],
            correctAnswer: "Son physique, sa fiabilité, son attitude et sa capacité à rendre la journée agréable"
          }
        ]
      }
    ],
    quiz: [
      {
        question: "Quel est le rôle principal d'un 'booker' dans une agence ?",
        options: ["Maquiller les mannequins", "Prendre les photos du book", "Négocier les contrats et gérer le planning", "Choisir les vêtements pour les défilés"],
        correctAnswer: "Négocier les contrats et gérer le planning"
      },
      {
        question: "Qu'est-ce qu'un 'composite' (ou 'comp card') ?",
        options: ["Un contrat de travail", "Une carte de visite avec les meilleures photos et mensurations du mannequin", "Le planning des castings", "Un magazine de mode"],
        correctAnswer: "Une carte de visite avec les meilleures photos et mensurations du mannequin"
      },
      {
        question: "Lequel de ces types de mannequinat est principalement axé sur le travail avec les designers pendant le processus de création de vêtements ?",
        options: ["Mannequin commercial", "Mannequin éditorial", "Mannequin cabine (fitting)", "Mannequin de détail"],
        correctAnswer: "Mannequin cabine (fitting)"
      }
    ]
  },
  {
    slug: "module-2-techniques-de-podium-catwalk",
    title: "Module 2: Techniques de Podium (Catwalk)",
    chapters: [
        { slug: "maitrise-de-la-demarche-et-de-la-posture", title: "Maîtrise de la démarche et de la posture", content: `La démarche sur le podium, ou "catwalk", est la signature d'un mannequin. C'est une compétence qui demande de la pratique et de la technique. La base de tout est une posture impeccable. Tenez-vous droit, comme si un fil invisible tirait le sommet de votre crâne vers le ciel. Les épaules doivent être basses et tirées vers l'arrière, la poitrine ouverte. Engagez vos abdominaux pour gainer votre torse. Cette posture allonge la silhouette et donne une impression de confiance.
La marche elle-même doit être puissante et déterminée. Le mouvement part des hanches, pas des genoux. Balancez vos hanches naturellement. Posez un pied exactement devant l'autre, comme si vous marchiez sur une ligne droite. Le contact avec le sol se fait d'abord avec la plante du pied ou le talon, selon la chaussure et le style de démarche. Les bras doivent se balancer naturellement en opposition aux jambes, sans être ni trop rigides, ni trop relâchés. Le regard est fixe, droit devant, vers un point situé au-dessus de la tête du public.`,
            quiz: [
              {
                question: "Quelle est la base essentielle de toute démarche sur le podium ?",
                options: ["Le sourire", "Une posture impeccable", "Les accessoires", "La vitesse"],
                correctAnswer: "Une posture impeccable"
              },
              {
                question: "Comment décrire la posture idéale d'un mannequin ?",
                options: ["Épaules hautes et tendues", "Tenez-vous droit comme si un fil tirait le sommet de votre crâne vers le ciel", "Dos courbé", "Corps relâché"],
                correctAnswer: "Tenez-vous droit comme si un fil tirait le sommet de votre crâne vers le ciel"
              },
              {
                question: "D'où doit partir le mouvement de la marche ?",
                options: ["Des genoux", "Des hanches", "Des épaules", "Des pieds"],
                correctAnswer: "Des hanches"
              },
              {
                question: "Comment doit-on poser les pieds en marchant sur le podium ?",
                options: ["De manière écartée", "Un pied exactement devant l'autre, comme sur une ligne droite", "En zigzag", "N'importe comment"],
                correctAnswer: "Un pied exactement devant l'autre, comme sur une ligne droite"
              },
              {
                question: "Comment les bras doivent-ils se balancer ?",
                options: ["Rigides et immobiles", "Naturellement en opposition aux jambes", "Très exagérés", "Collés au corps"],
                correctAnswer: "Naturellement en opposition aux jambes"
              },
              {
                question: "Où doit être fixé le regard ?",
                options: ["Sur ses pieds", "Sur le public", "Droit devant, vers un point au-dessus de la tête du public", "Au sol"],
                correctAnswer: "Droit devant, vers un point au-dessus de la tête du public"
              },
              {
                question: "Que faut-il engager pour gainer le torse ?",
                options: ["Les épaules", "Les abdominaux", "Les bras", "Le cou"],
                correctAnswer: "Les abdominaux"
              },
              {
                question: "Comment doivent être les épaules ?",
                options: ["Hautes et tendues", "Basses et tirées vers l'arrière", "En avant", "Asymétriques"],
                correctAnswer: "Basses et tirées vers l'arrière"
              },
              {
                question: "Qu'est-ce que la démarche sur le podium représente ?",
                options: ["Un simple déplacement", "La signature d'un mannequin", "Un exercice physique", "Une danse"],
                correctAnswer: "La signature d'un mannequin"
              },
              {
                question: "Quelle impression doit donner la posture impeccable ?",
                options: ["De timidité", "De confiance", "D'hésitation", "De fatigue"],
                correctAnswer: "De confiance"
              }
            ]
        },
        { slug: "les-differents-types-de-defiles", title: "Les différents types de défilés (Haute Couture, Prêt-à-porter)", content: `Un mannequin professionnel doit savoir adapter sa démarche au vêtement qu'il porte et à l'esprit de la collection. Il n'existe pas une seule "bonne" démarche.
**Défilé Haute Couture** : La démarche est souvent plus lente, plus forte, et plus théâtrale. Chaque passage est une performance. Le mannequin incarne un personnage, une vision artistique. L'expression du visage est intense, presque dramatique. Le rythme est majestueux, chaque pas est posé avec une intention précise.
**Défilé Prêt-à-porter (Ready-to-Wear)** : La démarche est généralement plus rapide, plus naturelle et plus énergique. Elle doit refléter une femme ou un homme moderne, actif. L'attitude est plus décontractée, tout en restant extrêmement professionnelle. Le but est de montrer comment les vêtements bougent et peuvent être portés dans la vie de tous les jours.
Il existe aussi des démarches spécifiques demandées par certains créateurs pour coller à un thème (démarche robotique, nonchalante, etc.). La clé est l'adaptabilité et la capacité à suivre les directives du directeur de casting.` },
        { slug: "gestion-du-rythme-et-synchronisation-avec-la-musique", title: "Gestion du rythme et synchronisation avec la musique", content: `La musique n'est pas un simple fond sonore lors d'un défilé ; elle en est le cœur battant. Elle dicte l'énergie, l'ambiance et le rythme du show. Un mannequin doit être en parfaite symbiose avec elle.
Avant le début du défilé, en backstage, écoutez attentivement la bande-son. Identifiez le BPM (battement par minute). Le premier mannequin qui s'élance donne le tempo pour tous les autres. Votre travail est de maintenir ce rythme et l'espacement avec le mannequin qui vous précède.
Apprenez à sentir la musique. Une basse lourde et lente appellera une démarche puissante et posée. Un rythme électro rapide demandera une marche plus vive et énergique. Votre démarche doit traduire l'émotion de la musique. C'est cette synchronisation entre le son, le vêtement et le mouvement qui crée la magie d'un défilé.` },
        { slug: "les-demi-tours-et-poses-en-bout-de-podium", title: "Les demi-tours (turns) et poses en bout de podium", content: `L'arrivée en bout de podium est un moment crucial. C'est là que se concentre la majorité des photographes (le "pit"). C'est votre opportunité de mettre en valeur la tenue et de créer une image forte.
**La Pause (Pose)** : Marquez un temps d'arrêt net. La pose doit être puissante et en accord avec le vêtement. Elle peut être simple (une main sur la hanche) ou plus complexe. Le plus important est de tenir la pose pendant 2 à 3 secondes, le temps pour les photographes de capturer l'image parfaite. Regardez droit devant, puis balayez brièvement du regard la fosse des photographes.
**Le Demi-Tour (Turn)** : Le demi-tour doit être fluide et maîtrisé. La technique la plus courante consiste à pivoter sur la jambe d'appui tout en faisant passer l'autre jambe derrière. Le mouvement doit être propre, sans déséquilibre. Entraînez-vous à tourner des deux côtés. Il existe de nombreuses variations (tour rapide, tour avec une pause au milieu, etc.) qui dépendent des directives du show.` },
        { slug: "defiler-avec-des-accessoires", title: "Défiler avec des accessoires (sacs, chapeaux, etc.)", content: `Un accessoire n'est pas un objet passif ; il fait partie intégrante de la silhouette et du personnage que vous incarnez. Il doit être intégré à votre démarche de la manière la plus naturelle possible.
*   **Sacs à main** : La façon de le tenir dépend de son style. Un sac porté à la main doit balancer légèrement avec le rythme de la marche. Un sac d'épaule doit rester stable. Le but est de le montrer aux photographes sans casser la fluidité de la démarche.
*   **Chapeaux et Lunettes** : Assurez-vous qu'ils sont bien ajustés. Votre démarche doit rester assurée. Pour les lunettes, votre regard doit rester intense même s'il est caché.
*   **Manteaux et Vestes** : Parfois, il vous sera demandé de porter un manteau sur les épaules. Il faut alors ajuster le balancement de vos bras pour le maintenir en place avec élégance.
La clé est de s'approprier l'accessoire. Il ne doit pas avoir l'air d'un corps étranger. Pratiquez en backstage pour vous sentir à l'aise avec lui avant de monter sur le podium.` },
        { slug: "defiler-avec-des-tenues-complexes", title: "Défiler avec des tenues complexes (robes longues, traînes)", content: `Les robes de soirée, les robes de mariée ou les créations Haute Couture peuvent être de véritables défis techniques pour un mannequin.
**Robes longues et volumineuses** : Le risque est de se prendre les pieds dans le tissu. La solution est de donner de légers coups de pied vers l'avant à chaque pas pour repousser le tissu. Cela doit être subtil et invisible pour le public.
**Les traînes** : Pour tourner avec une traîne, il faut utiliser sa jambe pour la "fouetter" dans la direction du virage juste avant de pivoter. Cela demande de l'entraînement pour que le mouvement soit gracieux et efficace.
**Les chaussures difficiles** : Les talons très hauts ou les chaussures à plateforme exigent une concentration extrême. Le poids du corps doit être sur l'avant du pied, et les abdominaux gainés pour maintenir l'équilibre.
Si vous sentez que vous allez tomber, il est préférable de retirer les chaussures rapidement et de continuer pieds nus avec confiance plutôt que de risquer une chute spectaculaire.` },
        { slug: "expression-et-attitude-sur-le-podium", title: "Expression et attitude sur le podium", content: `Le visage d'un mannequin sur le podium est aussi important que sa démarche. Il doit compléter le vêtement et transmettre l'émotion de la collection. Sauf indication contraire, la règle générale est de ne pas sourire.
L'expression doit être neutre, mais pas vide. Elle doit être intense et pleine de confiance. Le secret réside dans le regard. Fixez un point imaginaire au fond de la salle, au-dessus des têtes. Votre regard doit être fort, presque arrogant, mais jamais agressif. Pensez à un "masque" de concentration.
L'attitude générale doit être en accord avec le thème. Pour une collection rock, l'attitude sera plus rebelle. Pour une collection romantique, elle sera plus douce et éthérée. Vous n'êtes pas seulement un cintre, vous êtes un acteur qui interprète le rôle que le créateur vous a donné pour son défilé.` },
        { slug: "preparation-en-backstage-et-gestion-du-stress", title: "Préparation en backstage et gestion du stress", content: `Les coulisses d'un défilé (backstage) sont un lieu d'effervescence intense, souvent perçu comme chaotique. C'est là que se joue une grande partie du succès du show.
**Le professionnalisme en backstage** : Soyez patient et coopératif. Vous serez entre les mains de nombreux professionnels : habilleurs, coiffeurs, maquilleurs. Respectez leur travail. Restez calme même si l'on vous tire les cheveux ou si l'habillage est brutal.
**Les changements rapides (Quick changes)** : Pour certains défilés, vous devrez changer de tenue en quelques dizaines de secondes. Restez concentré. Préparez-vous mentalement à l'avance, et faites confiance aux habilleurs qui sont là pour vous aider.
**Gestion du stress** : Le trac est normal. Apprenez des techniques de respiration simples pour vous calmer avant de monter sur scène (inspirer profondément par le nez, expirer lentement par la bouche). Visualisez votre passage réussi. Juste avant d'entrer sur le podium, prenez une grande inspiration, mettez-vous dans votre personnage, et lancez-vous. Une fois sur le podium, le stress se transforme souvent en adrénaline.` }
    ],
    quiz: [
        {
            question: "En bout de podium, où se trouve le 'pit' ?",
            options: ["La zone de repos des mannequins", "L'endroit où se trouvent les photographes", "Les coulisses", "Le vestiaire"],
            correctAnswer: "L'endroit où se trouvent les photographes"
        },
        {
            question: "Quelle est la principale différence de démarche entre un défilé Haute Couture et Prêt-à-porter ?",
            options: ["Il n'y en a aucune", "La Haute Couture est plus rapide et décontractée", "La Haute Couture est souvent plus lente, forte et théâtrale", "On doit sourire en Prêt-à-porter"],
            correctAnswer: "La Haute Couture est souvent plus lente, forte et théâtrale"
        }
    ]
  },
  {
    slug: "module-3-photographie-et-expression-corporelle",
    title: "Module 3: Photographie & Expression Corporelle",
    chapters: [
        { slug: "les-bases-de-la-pose-photographique", title: "Les bases de la pose photographique", content: `Poser devant un objectif est un art qui allie technique et instinct. L'objectif d'un mannequin est de créer des formes intéressantes avec son corps pour mettre en valeur le vêtement et créer une image captivante.
*   **Créer des angles** : Évitez de vous tenir "plat" face à l'appareil photo. Tournez légèrement votre corps de trois quarts pour affiner la silhouette. Pliez vos membres (coudes, genoux, poignets) pour créer des angles et des triangles, ce qui rend l'image plus dynamique.
*   **Dissymétrie** : La symétrie est souvent ennuyeuse en photo. Pensez à créer de la dissymétrie : une épaule plus haute que l'autre, une hanche décalée, une main sur la hanche et l'autre relâchée.
*   **Allonger la silhouette** : Pensez toujours à vous grandir. Pointez les pieds, étirez le cou comme si vous étiez une ballerine. Cela crée des lignes longues et élégantes.
*   **Connaissance de son corps** : Entraînez-vous devant un miroir pour comprendre quels sont vos meilleurs angles, votre "meilleur profil". Connaître son corps est fondamental pour être efficace en shooting.` },
        { slug: "maitriser-ses-expressions-faciales-le-smize", title: "Maîtriser ses expressions faciales (le 'smize')", content: `Le visage est le point focal de nombreuses photos. Une expression vide peut ruiner une photo, même avec une pose parfaite.
*   **Le regard** : Le regard est l'élément le plus important. Il doit être intense et connecter avec l'objectif. Entraînez-vous à transmettre des émotions uniquement avec vos yeux. C'est ce que Tyra Banks a popularisé sous le nom de "smize" (smiling with your eyes - sourire avec les yeux). Même avec une bouche neutre, vos yeux peuvent exprimer la joie, la tristesse, la colère ou la confiance.
*   **La bouche** : Évitez une bouche crispée. Laissez-la légèrement entrouverte pour un look plus sensuel et détendu. Entraînez-vous à différentes expressions : bouche neutre, léger sourire, moue boudeuse.
*   **Micro-expressions** : Un bon mannequin maîtrise les micro-mouvements de son visage : un sourcil légèrement levé, une narine qui frémit. Ces détails subtils ajoutent beaucoup de vie et de profondeur à une photo.` },
        { slug: "lart-du-portrait-gros-plan-et-plan-americain", title: "L'art du portrait, du gros plan et du plan américain", content: `Chaque type de cadrage nécessite une approche de pose différente.
*   **Gros Plan (Close-up) / Portrait Beauté** : Toute l'attention est sur votre visage. La peau, le maquillage, les cheveux doivent être parfaits. Votre travail consiste à livrer une palette d'expressions subtiles. Le placement des mains près du visage peut ajouter de l'intérêt, mais attention à ce qu'elles soient gracieuses et ne cachent pas le visage.
*   **Plan Américain (coupé à mi-cuisse)** : Ce cadrage met en valeur le haut du corps. La posture est primordiale. Jouez avec la position de vos épaules, le placement de vos mains (dans les poches, sur les hanches, croisées) et l'inclinaison de votre tête.
*   **Plan Italien (coupé aux genoux)** : Similaire au plan américain, il permet de montrer un peu plus la ligne des jambes et la posture générale.` },
        { slug: "poses-en-pied-et-gestion-de-lespace", title: "Poses en pied et gestion de l'espace", content: `En plan large, votre corps entier devient le sujet. Il faut créer une silhouette intéressante de la tête aux pieds.
*   **Poses debout** : Variez la répartition du poids de votre corps d'une jambe à l'autre (contrapposto) pour créer une ligne de hanche dynamique. Croisez les jambes, jouez avec l'espace négatif (l'espace entre votre corps et vos membres).
*   **Poses assises** : Assis sur une chaise ou au sol, pensez à allonger votre corps. Évitez de vous avachir. Utilisez la chaise comme un accessoire, asseyez-vous sur le bord, à l'envers, etc.
*   **Le mouvement** : Ne restez pas statique ! Un shooting est un flux constant de mouvements. Bougez lentement entre les poses, comme une danse. Un bon photographe saura capturer les moments "entre-deux", qui sont souvent les plus naturels et les plus beaux. Le saut, la marche, la course peuvent créer des images spectaculaires.` },
        { slug: "travailler-avec-la-lumiere-en-studio-et-en-exterieur", title: "Travailler avec la lumière en studio et en extérieur", content: `La photographie, c'est l'art d'écrire avec la lumière. Un mannequin doit comprendre les bases de la lumière pour savoir comment se positionner.
*   **En studio** : Le photographe contrôle entièrement la lumière. Observez où se trouve la source de lumière principale (la "key light"). Tournez votre visage vers elle pour l'illuminer. Une lumière dure créera des ombres fortes et un look dramatique. Une lumière douce (diffusée par une "softbox") est plus flatteuse et efface les imperfections.
*   **En extérieur** : La lumière naturelle est plus imprévisible. La meilleure lumière est souvent celle du début de matinée ou de la fin d'après-midi ("golden hour"), qui est douce et dorée. Évitez la lumière de midi, qui est dure et crée des ombres disgracieuses sous les yeux et le nez. Par temps nuageux, la lumière est douce et idéale pour les portraits. Apprenez à "trouver la lumière", c'est-à-dire à orienter votre visage pour que la lumière naturelle le sculpte de la manière la plus avantageuse.` },
        { slug: "le-mannequinat-editorial-vs-commercial", title: "Le mannequinat éditorial vs commercial", content: `Les attentes en matière de pose et d'expression varient énormément entre ces deux domaines.
*   **Éditorial** : L'objectif est de créer de l'art, de l'émotion, de raconter une histoire. Les poses peuvent être étranges, avant-gardistes, non conventionnelles. L'expression n'a pas besoin d'être "jolie". On recherche de la force, de la vulnérabilité, du mystère. C'est le domaine de l'expérimentation créative.
*   **Commercial** : L'objectif est de vendre un produit (vêtement, parfum, voiture...). Le mannequin doit être accessible, sympathique et inspirer confiance. Les poses sont plus simples, plus claires, et mettent en valeur le produit. Le sourire est fréquent. L'énergie est positive et engageante. Un mannequin polyvalent doit être capable de maîtriser les deux styles.` },
        { slug: "raconter-une-histoire-a-travers-la-pose", title: "Raconter une histoire à travers la pose", content: `Les plus grands mannequins sont d'excellents acteurs silencieux. Une photo devient puissante lorsqu'elle raconte une histoire et évoque une émotion. Avant un shooting, discutez avec le photographe et le directeur artistique du "moodboard" (planche d'inspiration).
Quel est le concept ? Quel est le personnage que vous devez incarner ? Est-ce une femme d'affaires puissante, une âme romantique et perdue, une rebelle rock'n'roll ? Une fois que vous avez compris le personnage, vous pouvez l'incarner dans vos poses, votre regard, votre attitude. Pensez à une situation, à une ligne de dialogue de film. Cela donnera une intention et une profondeur à votre travail, et le transformera d'une simple pose en une véritable performance.` },
        { slug: "creer-et-developper-son-book-photo-professionnel", title: "Créer et développer son book photo professionnel", content: `Votre book (ou portfolio) est votre outil de marketing numéro un. C'est une sélection organisée de vos meilleures photos qui doit convaincre un client de vous embaucher.
*   **Qualité sur quantité** : Mieux vaut un book de 10 photos exceptionnelles qu'un book de 30 photos moyennes. Chaque image doit être parfaite.
*   **Variété** : Votre book doit montrer votre polyvalence. Il doit inclure :
    *   Des "polas/digitals" : des photos récentes, simples et non retouchées qui montrent votre physique actuel.
    *   Un portrait beauté (beauty shot).
    *   Des photos en pied.
    *   Des exemples de photos commerciales (souriantes, accessibles).
    *   Des exemples de photos éditoriales (créatives, fortes).
*   **Première et dernière impression** : La première photo doit être la plus percutante. La dernière doit également être mémorable.
*   **Mise à jour constante** : Un book n'est jamais terminé. Vous devez constamment l'actualiser avec vos nouveaux travaux pour qu'il reste pertinent et reflète votre évolution.
Votre agent est votre meilleur allié pour construire et éditer votre book.` }
    ],
    quiz: [
        {
            question: "En photographie, que recherche principalement un shooting 'éditorial' ?",
            options: ["Des poses simples et souriantes", "Mettre en avant un produit de manière évidente", "Des poses artistiques, créatives et narratives", "Des photos d'identité"],
            correctAnswer: "Des poses artistiques, créatives et narratives"
        },
        {
            question: "Que sont les 'polas' (ou polaroïds) dans un book ?",
            options: ["Des photos très retouchées", "Des photos en noir et blanc", "Des photos naturelles, sans maquillage ni retouche, montrant le mannequin tel qu'il est", "Des photos de défilé"],
            correctAnswer: "Des photos naturelles, sans maquillage ni retouche, montrant le mannequin tel qu'il est"
        }
    ]
  },
  {
    slug: "module-4-industrie-de-la-mode-et-professionnalisme",
    title: "Module 4: Industrie de la Mode & Professionnalisme",
    chapters: [
        { slug: "le-fonctionnement-dun-shooting-et-dun-defile", title: "Le fonctionnement d'un shooting et d'un défilé", content: `Comprendre l'écosystème d'un projet de mode est essentiel pour s'y intégrer harmonieusement. Chaque personne a un rôle précis.
**Sur un shooting photo :**
*   **Le Client / Directeur Artistique** : Il définit la vision créative de la campagne.
*   **Le Photographe** : Il est le chef d'orchestre technique et artistique de l'image.
*   **Le Styliste** : Il sélectionne et prépare les vêtements et accessoires.
*   **Le Maquilleur (MUA) et le Coiffeur (Hairstylist)** : Ils créent le look beauté.
*   **Les Assistants** (photo, stylisme) : Ils aident à la logistique du plateau.
*   **Le Mannequin** : Il est l'interprète qui donne vie à la vision de l'équipe.
**Sur un défilé :**
*   **Le Créateur** : Le visionnaire derrière la collection.
*   **Le Directeur de Casting** : Il sélectionne les mannequins.
*   **Le Régisseur (Show Caller)** : Il dirige tout le déroulement en backstage et donne le "go" à chaque mannequin.
*   **Les Habilleurs** : Ils aident les mannequins à effectuer les changements de tenue rapides.` },
        { slug: "collaborer-avec-les-professionnels", title: "Collaborer avec les stylistes, photographes et maquilleurs", content: `Le mannequinat est un travail d'équipe. Votre capacité à bien collaborer est aussi importante que votre physique.
*   **Avec le photographe** : Établissez une relation de confiance. Écoutez ses directives, mais n'hésitez pas à proposer des idées si l'ambiance le permet. Soyez conscient de sa lumière.
*   **Avec le styliste** : Respectez les vêtements. Ce sont souvent des pièces uniques ou des prototypes de grande valeur. Faites attention en vous habillant. Ne mangez pas et ne buvez pas lorsque vous portez la tenue du shooting.
*   **Avec les maquilleurs et coiffeurs** : Arrivez le visage démaquillé et les cheveux propres (sauf indication contraire). Soyez patient sur la chaise. C'est un moment de préparation où vous pouvez vous concentrer.
Une bonne collaboration repose sur le respect mutuel, la communication et une attitude positive.` },
        { slug: "comprendre-un-contrat-de-mannequin", title: "Comprendre un contrat de mannequin", content: `Un contrat est un document juridique qui protège à la fois le mannequin et le client. Il ne faut jamais travailler sans contrat. Votre agence le négociera pour vous, mais vous devez en comprendre les points clés.
*   **Rémunération (Cachet)** : Le montant brut que vous allez percevoir pour votre prestation.
*   **Droits d'Utilisation (Usage / Buyouts)** : C'est la partie la plus importante et la plus complexe. Elle définit comment, où et pendant combien de temps le client a le droit d'utiliser vos photos. Plus l'utilisation est large (ex: campagne mondiale tous supports pendant 2 ans), plus la rémunération des droits doit être élevée.
*   **Territoire** : La zone géographique où les images peuvent être diffusées (ex: Gabon, Europe, Monde).
*   **Durée** : La période pendant laquelle les images peuvent être utilisées (ex: 6 mois, 1 an).
*   **Supports** : Les médias sur lesquels les images seront diffusées (ex: presse, affichage, digital, TV).
*   **Exclusivité** : Une clause peut vous interdire de travailler pour une marque concurrente pendant une certaine période. Cette exclusivité doit être rémunérée en conséquence.` },
        { slug: "la-gestion-financiere-et-la-facturation", title: "La gestion financière et la facturation", content: `Le mannequinat est une activité professionnelle, souvent exercée en tant qu'indépendant. Une bonne gestion financière est cruciale.
*   **La commission de l'agence** : L'agence prélève une commission sur votre cachet brut. Elle est généralement de 20% sur la prestation et les droits.
*   **Facturation** : C'est l'agence qui envoie la facture au client. Le client paie l'agence, qui vous reverse ensuite votre part.
*   **Délais de paiement** : Les délais peuvent être longs dans l'industrie (30, 60, voire 90 jours). Il est important d'anticiper et d'avoir une épargne de précaution.
*   **Impôts et taxes** : En tant qu'indépendant, vous êtes responsable de déclarer vos revenus et de payer vos impôts. Mettez systématiquement de côté un pourcentage de chaque paie (ex: 20-30%) pour ne pas avoir de mauvaises surprises.
*   **Gérer l'irrégularité** : Les revenus d'un mannequin sont irréguliers. Il y a des périodes très chargées et des périodes creuses. Apprenez à budgétiser et à épargner pendant les bons mois pour couvrir les périodes plus calmes.` },
        { slug: "les-castings-preparation-attitude-et-suivi", title: "Les castings : préparation, attitude et suivi", content: `Le casting est le "job interview" du mannequin. C'est là que tout se joue.
**Préparation** :
*   **Renseignez-vous** : Qui est le client ? Quel est son style ? Regardez ses précédentes campagnes.
*   **La tenue** : Portez des vêtements simples et près du corps qui montrent votre silhouette (jean slim, débardeur). Évitez les logos et les vêtements trop larges. Pour les femmes, ayez toujours une paire de talons dans votre sac.
*   **Le nécessaire** : Venez avec votre book à jour et plusieurs composites.
**Attitude** :
*   **Confiance** : Entrez avec assurance, une bonne posture, un sourire.
*   **Naturel** : Les directeurs de casting veulent voir votre personnalité. Soyez vous-même.
*   **Écoute** : Suivez précisément les instructions. Si on vous demande de marcher, marchez. Si on vous demande de poser, posez.
*   **Professionnalisme** : Soyez bref et efficace. Il y a souvent beaucoup de monde. Ne perdez pas le temps du directeur de casting.
**Le suivi** : Après le casting, informez votre agent de comment cela s'est passé. C'est lui qui assurera le suivi avec le client. Ne contactez jamais le client directement.` },
        { slug: "limportance-des-reseaux-sociaux-pour-un-mannequin", title: "L'importance des réseaux sociaux pour un mannequin", content: `Aujourd'hui, les réseaux sociaux, en particulier Instagram, sont une extension de votre book et un outil de personal branding incontournable. De nombreux clients regardent le profil Instagram d'un mannequin avant de le booker.
*   **Une vitrine professionnelle** : Votre feed doit être soigné. Publiez vos meilleures photos de travail, des polas récents, des vidéos de votre démarche.
*   **Montrez votre personnalité** : Partagez aussi des aperçus de votre vie, de vos passions (voyages, sport, art...). Cela vous rend plus humain et attachant, et peut créer un lien avec des marques qui partagent les mêmes valeurs.
*   **Interagissez** : Répondez aux commentaires, suivez les photographes, stylistes et marques que vous admirez. Le networking se fait aussi en ligne.
*   **Attention à l'image** : Soyez conscient que tout ce que vous publiez est public. Évitez les photos controversées ou peu professionnelles qui pourraient nuire à votre image de marque.
Un compte Instagram bien géré peut directement vous apporter des opportunités de travail.` },
        { slug: "les-capitales-de-la-mode-et-les-marches-internationaux", title: "Les capitales de la mode et les marchés internationaux", content: `Une carrière de mannequin atteint souvent son plein potentiel à l'international. Chaque capitale de la mode a ses propres spécificités.
*   **Paris** : La capitale de la Haute Couture et du luxe. Le marché est très exigeant sur les mensurations et recherche des beautés fortes, uniques et souvent androgynes pour les défilés.
*   **Milan** : Connue pour ses grandes maisons de luxe et son prêt-à-porter glamour et sexy (Versace, Dolce & Gabbana). Le marché apprécie les beautés plus classiques et sensuelles.
*   **New York** : Un marché très commercial et diversifié. C'est la capitale du sportswear et des grandes campagnes publicitaires. Il y a du travail pour une grande variété de profils.
*   **Londres** : Célèbre pour son avant-garde, sa créativité et ses jeunes designers. Le marché est plus "edgy" et recherche des looks originaux et non conventionnels.
Travailler à l'international demande une grande maturité, de l'autonomie et une bonne maîtrise de l'anglais.` },
        { slug: "sadapter-aux-tendances-et-evolutions-de-lindustrie", title: "S'adapter aux tendances et évolutions de l'industrie", content: `L'industrie de la mode n'est pas figée. Pour y faire carrière, il faut être curieux et savoir s'adapter.
*   **Diversité et Inclusivité** : C'est le changement le plus important de ces dernières années. L'industrie s'ouvre enfin à une plus grande diversité de corps, de couleurs de peau, d'âges et d'identités. C'est une opportunité pour des profils autrefois marginalisés.
*   **Mode Durable (Sustainability)** : Les consommateurs et les marques sont de plus en plus soucieux de l'impact écologique et social de la mode. S'intéresser à ces questions et soutenir des marques engagées peut être un atout pour votre image.
*   **La Révolution Digitale** : Des défilés virtuels aux showrooms en 3D et aux vêtements NFT, la technologie transforme la manière dont la mode est créée et présentée. Un mannequin doit être à l'aise avec ces nouveaux outils.
Rester informé en lisant la presse spécialisée (Business of Fashion, Vogue Business) et en suivant les actualités de l'industrie est essentiel pour comprendre ces changements et anticiper les opportunités de demain.` }
    ],
    quiz: [
        {
            question: "Quel est le pourcentage de commission standard qu'une agence mère prend sur les revenus d'un mannequin ?",
            options: ["5%", "10%", "20%", "50%"],
            correctAnswer: "20%"
        },
        {
            question: "Laquelle de ces villes est historiquement la capitale de la Haute Couture ?",
            options: ["New York", "Paris", "Milan", "Londres"],
            correctAnswer: "Paris"
        }
    ]
  },
  {
    slug: "module-5-carriere-et-developpement-personnel",
    title: "Module 5: Carrière & Développement Personnel",
    chapters: [
        { slug: "definir-ses-objectifs-et-son-plan-de-carriere", title: "Définir ses objectifs et son plan de carrière", content: `Une carrière réussie n'est pas le fruit du hasard, mais d'une vision claire et d'une planification stratégique. En collaboration avec votre agent, il est crucial de définir vos objectifs.
Utilisez la méthode SMART pour fixer des objectifs efficaces :
*   **Spécifiques** : "Défiler à la Fashion Week de Paris" est plus puissant que "devenir célèbre".
*   **Mesurables** : "Faire 3 éditoriaux pour des magazines reconnus cette année".
*   **Atteignables** : Vos objectifs doivent être ambitieux mais réalistes par rapport à votre profil et à votre niveau d'expérience.
*   **Réalistes (Relevant)** : Assurez-vous que vos objectifs sont en phase avec la direction que vous voulez donner à votre carrière (commercial, haute couture, etc.).
*   **Temporellement définis** : Fixez des échéances ("dans les 6 prochains mois", "d'ici 2 ans").
Ce plan de carrière doit être réévalué régulièrement. Il vous servira de boussole pour prendre les bonnes décisions et rester motivé.` },
        { slug: "developper-sa-confiance-en-soi-et-son-charisme", title: "Développer sa confiance en soi et son charisme", content: `La confiance en soi est l'atout le plus magnétique d'un mannequin. Elle se voit dans la posture, la démarche, le regard. C'est une qualité qui se travaille.
*   **Connaissez vos forces** : Identifiez ce qui vous rend unique et capitalisez dessus.
*   **La préparation réduit l'anxiété** : Mieux vous êtes préparé pour un casting ou un shooting, moins vous serez nerveux. Répétez vos poses, votre démarche.
*   **"Fake it 'til you make it"** (Fais semblant jusqu'à ce que tu y arrives) : Adoptez le langage corporel d'une personne confiante (se tenir droit, regarder les gens dans les yeux) peut réellement influencer votre état d'esprit.
*   **Sortez de votre zone de confort** : Prenez des cours de théâtre ou d'improvisation. Cela développe la présence scénique et l'aisance.
Le charisme, c'est la capacité à capter l'attention et à créer une connexion. C'est être pleinement présent dans l'instant et authentique dans ses interactions.` },
        { slug: "techniques-de-communication-et-dinterview", title: "Techniques de communication et d'interview", content: `Au fur et à mesure que votre carrière progresse, vous serez amené à interagir avec des clients, des journalistes ou le public. Savoir bien communiquer est une compétence essentielle.
*   **Préparez votre "Elevator Pitch"** : Soyez capable de vous présenter de manière concise et intéressante en quelques phrases.
*   **Pour les interviews** : Préparez des points clés sur votre parcours, vos inspirations, vos projets. Répondez aux questions de manière réfléchie, mais restez naturel et spontané.
*   **Le langage non verbal** : Votre posture, vos gestes, votre contact visuel parlent autant que vos mots. Tenez-vous droit, ayez un langage corporel ouvert.
*   **L'écoute active** : Montrez que vous êtes engagé dans la conversation en écoutant attentivement votre interlocuteur.
Une bonne communication renforce votre professionnalisme et rend les gens désireux de travailler avec vous.` },
        { slug: "gestion-de-limage-publique-et-e-reputation", title: "Gestion de l'image publique et e-réputation", content: `Dans le monde digital d'aujourd'hui, votre réputation en ligne (e-réputation) est aussi importante que votre réputation dans le monde réel.
*   **Googlisez-vous** : Regardez régulièrement ce qui apparaît lorsque vous tapez votre nom sur Google.
*   **Contrôlez votre présence sur les réseaux sociaux** : Votre profil Instagram, Facebook, etc., est votre vitrine publique. Réfléchissez à deux fois avant de publier. Demandez-vous : "Est-ce que cette publication est en accord avec mon image de marque ? Est-ce que je serais à l'aise que des clients potentiels la voient ?".
*   **Gérer la négativité** : Vous ferez face à des critiques ou des commentaires négatifs. La meilleure approche est souvent de les ignorer. Ne vous engagez jamais dans des disputes en ligne. Si le harcèlement devient sérieux, bloquez et signalez.
*   **Cohérence** : Assurez-vous que l'image que vous projetez en ligne est cohérente avec qui vous êtes en personne. L'authenticité est toujours appréciée.` },
        { slug: "le-networking-et-la-construction-de-son-reseau-professionnel", title: "Le networking et la construction de son réseau professionnel", content: `L'adage "ce n'est pas ce que vous savez, mais qui vous connaissez" est particulièrement vrai dans la mode. Construire un réseau solide est un investissement à long terme pour votre carrière.
*   **Chaque travail est une opportunité de networking** : Soyez professionnel et sympathique avec tout le monde sur un plateau de shooting. Le photographe d'aujourd'hui pourrait être le prochain grand nom de la mode demain.
*   **Soyez authentique** : Le networking ne consiste pas à collectionner des cartes de visite. Il s'agit de créer de vraies relations basées sur un respect mutuel. Intéressez-vous sincèrement au travail des autres.
*   **Utilisez les réseaux sociaux** : Suivez et interagissez de manière constructive avec les professionnels de l'industrie que vous admirez.
*   **Entretenez votre réseau** : Prenez des nouvelles des personnes avec qui vous avez bien travaillé. Un simple message peut réactiver une connexion et mener à une nouvelle opportunité.` },
        { slug: "sante-mentale-et-bien-etre-dans-un-milieu-exigeant", title: "Santé mentale et bien-être dans un milieu exigeant", content: `Le mannequinat est un métier qui peut être très éprouvant pour la santé mentale. La pression sur l'apparence, la fréquence des rejets en casting, la solitude lors des voyages et l'irrégularité du travail peuvent être des sources de stress et d'anxiété importantes.
*   **Ne prenez pas le rejet personnellement** : Vous serez rejeté 9 fois sur 10 en casting. Cela ne signifie pas que vous n'êtes pas assez bien. Le plus souvent, vous ne correspondez simplement pas au profil exact que le client recherche pour ce projet précis.
*   **Construisez un système de soutien** : Entourez-vous de personnes de confiance (famille, amis proches, votre agent) à qui vous pouvez parler ouvertement.
*   **Ayez une vie en dehors du mannequinat** : Cultivez des passions et des hobbies qui ne sont pas liés à la mode. Cela vous aidera à garder les pieds sur terre et à maintenir votre estime de soi en dehors de votre apparence.
*   **N'hésitez pas à chercher de l'aide professionnelle** : Parler à un thérapeute ou un psychologue n'est pas un signe de faiblesse, mais un signe de force. C'est un outil précieux pour apprendre à gérer la pression.` },
        { slug: "se-diversifier-comedie-influence-entrepreneuriat", title: "Se diversifier : comédie, influence, entrepreneuriat", content: `Une carrière de mannequin, en particulier pour les défilés, a une durée limitée. Il est intelligent de penser à la suite et d'utiliser sa notoriété et ses compétences pour se diversifier.
*   **Comédie / Cinéma** : De nombreux mannequins ont réussi leur transition vers le cinéma (ex: Cara Delevingne, Charlize Theron). Les cours de théâtre peuvent vous aider à développer de nouvelles compétences expressives.
*   **Influence / Création de contenu** : Si vous avez construit une communauté engagée sur les réseaux sociaux, vous pouvez devenir un créateur de contenu et collaborer avec des marques sur le long terme.
*   **Entrepreneuriat** : Utilisez votre connaissance de l'industrie pour lancer votre propre marque (beauté, vêtements, etc.), comme l'ont fait Gisele Bündchen ou Miranda Kerr.
*   **Photographie, stylisme** : Votre expérience de l'autre côté de l'objectif est un atout précieux si vous souhaitez explorer d'autres métiers de la mode.
La clé est de capitaliser sur la plateforme que le mannequinat vous a offerte pour construire quelque chose de durable.` },
        { slug: "planifier-sa-carriere-sur-le-long-terme-et-sa-reconversion", title: "Planifier sa carrière sur le long terme et sa reconversion", content: `La planification de l'après-carrière de mannequin doit commencer bien avant qu'elle ne se termine.
*   **Gestion financière rigoureuse** : Mettez de l'argent de côté et investissez judicieusement dès le début de votre carrière. Consultez un conseiller financier. L'argent que vous gagnez doit vous permettre de financer votre transition.
*   **Formation continue** : Profitez de votre temps libre entre les contrats pour vous former. Suivez des cours en ligne, reprenez des études, apprenez une nouvelle langue ou une nouvelle compétence (codage, marketing, etc.).
*   **Explorez vos passions** : Qu'est-ce qui vous passionne en dehors de la mode ? C'est souvent là que se trouve la clé de votre deuxième carrière.
*   **Utilisez votre réseau** : Le réseau que vous avez construit pendant vos années de mannequinat est un atout inestimable. N'hésitez pas à le solliciter lorsque vous préparez votre reconversion.
Une carrière de mannequin est un formidable tremplin, mais ce n'est qu'un chapitre de votre vie professionnelle. En planifiant intelligemment, vous pouvez vous assurer que les chapitres suivants seront tout aussi passionnants.` }
    ],
    quiz: [
        {
            question: "Que signifie l'acronyme SMART pour la définition d'objectifs ?",
            options: ["Simple, Mémorable, Ambitieux, Rapide, Testé", "Spécifique, Mesurable, Atteignable, Réaliste, Temporellement défini", "Secret, Malin, Artistique, Rare, Tendance", "Social, Mondial, Authentique, Reconnu, Total"],
            correctAnswer: "Spécifique, Mesurable, Atteignable, Réaliste, Temporellement défini"
        },
        {
            question: "Pourquoi le 'networking' est-il important dans le mannequinat ?",
            options: ["Pour obtenir des vêtements gratuits", "Pour se faire des amis", "Pour construire un réseau de contacts professionnels qui peut ouvrir des portes", "Pour organiser des fêtes"],
            correctAnswer: "Pour construire un réseau de contacts professionnels qui peut ouvrir des portes"
        }
    ]
  },
  {
    slug: "module-6-contrats-droit-image-finance",
    title: "Module 6: Contrats, Droit à l'Image et Gestion Financière",
    chapters: [
      { 
        slug: "decrypter-un-contrat-de-mannequin",
        title: "Décrypter un contrat de mannequin", 
        content: `Le contrat est le document qui régit votre relation professionnelle avec un client. Comprendre ses clauses est essentiel pour protéger vos intérêts. Les points clés à examiner sont : le cachet (votre rémunération pour la journée de travail), les droits d'utilisation ou "buyouts" (qui définissent comment, où et pour combien de temps les photos peuvent être utilisées), la durée et le territoire de diffusion, les supports (presse, digital, affichage), et les clauses d'exclusivité qui peuvent vous empêcher de travailler pour des marques concurrentes. Votre agent est votre meilleur allié pour négocier ces termes, mais il est crucial que vous en compreniez la portée.` 
      },
      { 
        slug: "comprendre-le-droit-a-l-image",
        title: "Comprendre le droit à l'image", 
        content: `Votre image est votre capital le plus précieux. Le droit à l'image est le droit pour toute personne de s'opposer à la reproduction et à la diffusion de son image sans son autorisation expresse. Dans le mannequinat, vous cédez ce droit de manière contrôlée et rémunérée via votre contrat. Il est vital de s'assurer que l'utilisation faite par le client correspond exactement à ce qui a été convenu. Toute utilisation non autorisée (par exemple, une photo de magazine utilisée sur un packaging de produit) constitue une violation de votre droit à l'image et doit donner lieu à une renégociation financière.`
      },
      { 
        slug: "gerer-ses-finances-de-mannequin",
        title: "Gérer ses finances de mannequin", 
        content: `Les revenus d'un mannequin sont souvent irréguliers. Une gestion financière prudente est la clé de la stabilité. Apprenez à établir un budget, en séparant vos dépenses professionnelles (book, composites, déplacements) de vos dépenses personnelles. Mettez systématiquement de l'argent de côté pendant les périodes fastes pour couvrir les mois plus calmes. L'épargne et l'investissement sont vos meilleurs amis pour construire un avenir financier solide au-delà des podiums.` 
      },
      { 
        slug: "impots-taxes-et-statut-juridique",
        title: "Impôts, taxes et statut juridique", 
        content: `En tant que mannequin, vous êtes généralement considéré comme un travailleur indépendant. Cela signifie que vous êtes responsable de la déclaration de vos revenus et du paiement de vos propres impôts et cotisations sociales. Il est fortement recommandé de faire appel à un comptable spécialisé dans les métiers artistiques. Il vous aidera à optimiser votre situation fiscale, à comprendre quelles dépenses sont déductibles et à vous assurer que vous êtes en règle avec l'administration fiscale. Anticipez toujours vos impôts en provisionnant un pourcentage de chaque revenu.` 
      }
    ],
    quiz: [
      {
        question: "Quelle est la partie la plus importante d'un contrat de mannequin en termes de rémunération à long terme ?",
        options: ["Le cachet de la journée", "Les droits d'utilisation (buyouts)", "Les frais de déplacement", "La clause de repas"],
        correctAnswer: "Les droits d'utilisation (buyouts)"
      },
      {
        question: "Que signifie une clause d'exclusivité ?",
        options: ["Vous êtes le seul mannequin sur le shooting", "Vous ne pouvez pas travailler pour des marques concurrentes pendant une période donnée", "Vous ne pouvez travailler qu'avec un seul photographe", "L'agence ne représente que vous"],
        correctAnswer: "Vous ne pouvez pas travailler pour des marques concurrentes pendant une période donnée"
      }
    ]
  },
  {
    slug: "module-7-sante-mentale-et-bien-etre",
    title: "Module 7: Santé Mentale et Bien-être",
    chapters: [
      { 
        slug: "gerer-le-rejet-et-la-critique",
        title: "Gérer le rejet et la critique", 
        content: `Le rejet fait partie intégrante du métier de mannequin. Vous essuierez d'innombrables "non" en casting. La clé est de ne jamais le prendre personnellement. Un refus est rarement une remise en cause de votre valeur ou de votre beauté ; il signifie simplement que votre profil ne correspondait pas à la vision spécifique du client pour ce projet précis. Apprenez à séparer votre identité de votre travail. Célébrez les "oui", et laissez les "non" glisser sur vous.` 
      },
      { 
        slug: "le-syndrome-de-l-imposteur",
        title: "Le syndrome de l'imposteur", 
        content: `Beaucoup de mannequins, même au sommet de leur carrière, souffrent du syndrome de l'imposteur : le sentiment de ne pas être légitime, de ne pas mériter son succès. Reconnaître ce sentiment est la première étape pour le combattre. Tenez un journal de vos réussites, même les plus petites. Parlez-en à d'autres mannequins ou à votre agent ; vous réaliserez que vous n'êtes pas seul. Rappelez-vous que si vous êtes là, c'est que des professionnels ont cru en vous.`
      },
      { 
        slug: "techniques-de-gestion-du-stress",
        title: "Techniques de gestion du stress", 
        content: `L'attente en casting, la pression en backstage, l'incertitude du lendemain... le stress est omniprésent. Développez une boîte à outils de techniques de gestion du stress : la respiration profonde (cohérence cardiaque), la méditation (même 5 minutes par jour via une application), la visualisation positive (imaginez votre passage réussi sur le podium), ou encore l'activité physique pour évacuer les tensions. Trouvez ce qui fonctionne pour vous et pratiquez régulièrement.` 
      },
      { 
        slug: "l-importance-du-reseau-de-soutien",
        title: "L'importance du réseau de soutien", 
        content: `Ne restez jamais isolé. Cultivez des relations solides et saines en dehors de l'industrie de la mode. Votre famille, vos amis d'enfance sont votre ancre dans la réalité. Au sein de l'agence, considérez les autres mannequins comme des collègues et non des rivaux. Partager vos expériences et vos doutes avec des personnes qui comprennent votre réalité est incroyablement précieux. Votre agent est aussi une personne ressource importante pour votre bien-être.` 
      }
    ],
    quiz: [
      {
        question: "Quelle est la meilleure réaction face à un rejet en casting ?",
        options: ["Le prendre personnellement et douter de soi", "Se plaindre à l'agence", "Comprendre que cela ne remet pas en cause sa valeur et passer au suivant", "Arrêter les castings"],
        correctAnswer: "Comprendre que cela ne remet pas en cause sa valeur et passer au suivant"
      },
      {
        question: "Pourquoi est-il important d'avoir des centres d'intérêt en dehors du mannequinat ?",
        options: ["Pour avoir l'air plus intéressant en interview", "Pour maintenir une estime de soi qui ne dépend pas que de son apparence", "Pour se reposer entre deux contrats", "Pour dépenser l'argent gagné"],
        correctAnswer: "Pour maintenir une estime de soi qui ne dépend pas que de son apparence"
      }
    ]
  },
  {
    slug: "module-8-networking-et-branding-avance",
    title: "Module 8: Networking & Personal Branding Avancé",
    chapters: [
      { 
        slug: "strategies-de-networking-efficaces",
        title: "Stratégies de networking efficaces", 
        content: `Le networking ne consiste pas à demander quelque chose, mais à offrir quelque chose : votre professionnalisme, votre énergie, votre intérêt sincère. Sur un shooting, intéressez-vous au travail de chacun. Retenez les noms. Après un travail que vous avez apprécié, envoyez un court message de remerciement. Le but est de laisser une impression positive et mémorable. Les gens auront envie de retravailler avec ceux qu'ils apprécient.`
      },
      { 
        slug: "optimiser-son-profil-instagram",
        title: "Optimiser son profil Instagram", 
        content: `Votre compte Instagram est votre magazine personnel. Votre biographie doit être claire : nom, agence(s), contact pro. Votre feed doit être un mélange équilibré de photos professionnelles (éditos, campagnes), de polas récents, de vidéos de votre démarche, et de contenu plus personnel qui révèle votre personnalité et vos centres d'intérêt. Utilisez les Stories pour montrer les coulisses de votre métier de manière authentique. La qualité des images est primordiale.` 
      },
      { 
        slug: "collaborer-avec-les-marques",
        title: "Collaborer avec les marques", 
        content: `Au-delà des contrats de mannequinat traditionnels, votre image peut vous permettre de devenir ambassadeur de marque. Choisissez des marques qui correspondent à vos valeurs et à votre image. Une collaboration réussie est authentique. Ne faites pas la promotion de produits que vous n'aimez pas. Votre crédibilité auprès de votre communauté est votre plus grand atout.`
      },
      { 
        slug: "gerer-son-e-reputation",
        title: "Gérer son e-réputation", 
        content: `Votre réputation en ligne vous précède. Tout ce que vous postez, commentez ou "likez" peut être vu par des clients potentiels. Évitez les polémiques, les contenus négatifs ou dégradants. En cas de commentaires haineux, la meilleure stratégie est souvent de ne pas répondre, de bloquer et de signaler. Gardez une communication positive et professionnelle. Votre e-réputation est une composante essentielle de votre marque personnelle.` 
      }
    ],
    quiz: [
      {
        question: "Quelle est la règle d'or du networking ?",
        options: ["Collectionner le plus de cartes de visite possible", "Parler uniquement aux personnes les plus célèbres", "Créer des relations authentiques basées sur un intérêt mutuel", "Demander un travail dès la première rencontre"],
        correctAnswer: "Créer des relations authentiques basées sur un intérêt mutuel"
      },
      {
        question: "Pourquoi un profil Instagram soigné est-il crucial pour un mannequin aujourd'hui ?",
        options: ["Pour montrer ses vacances à ses amis", "Car il sert d'extension au book et est consulté par les clients", "Pour obtenir des produits gratuits", "Uniquement pour les mannequins-influenceurs"],
        correctAnswer: "Car il sert d'extension au book et est consulté par les clients"
      }
    ]
  },
  {
    slug: "module-9-specialisations-et-marches-internationaux",
    title: "Module 9: Spécialisations et Marchés Internationaux",
    chapters: [
      { 
        slug: "les-codes-du-mannequinat-commercial",
        title: "Les codes du mannequinat commercial", 
        content: `Le mannequinat commercial vise à vendre un produit à un large public. L'accessibilité est le maître-mot. On recherche des sourires naturels, une énergie positive et une capacité à représenter le "client type". Les poses sont plus simples, plus directes, et l'interaction avec le produit est souvent au centre de l'image. C'est un marché très lucratif qui demande de la polyvalence et des talents d'acteur.`
      },
      { 
        slug: "les-specificites-du-mannequinat-beaute",
        title: "Les spécificités du mannequinat beauté", 
        content: `Le mannequinat beauté se concentre sur le visage. Une peau parfaite, des traits symétriques, des lèvres bien dessinées et des yeux expressifs sont des atouts majeurs. Le travail est minutieux et exige une grande patience, car les shootings peuvent durer des heures pour obtenir le cliché parfait. Une excellente maîtrise des micro-expressions faciales est indispensable.`
      },
      { 
        slug: "introduction-aux-marches-internationaux",
        title: "Introduction aux marchés internationaux", 
        content: `Chaque capitale de la mode a sa propre identité. Paris pour la Haute Couture, Milan pour le glamour, New York pour le commercial et le sportswear, et Londres pour l'avant-garde. Votre agent vous guidera vers le marché le plus adapté à votre profil. Préparer une carrière internationale, c'est aussi maîtriser l'anglais, être autonome et avoir une grande capacité d'adaptation.` 
      },
      { 
        slug: "adapter-son-book-pour-l-international",
        title: "Adapter son book pour l'international", 
        content: `Votre book doit être adapté au marché que vous visez. Pour Paris, privilégiez les éditos forts et les photos en noir et blanc. Pour New York, intégrez des images plus commerciales et souriantes. Votre agence mère travaillera avec vous pour construire un book international puissant, en sélectionnant les meilleures images et en organisant des "tests" (shootings) avec des photographes locaux pour coller à l'esthétique du marché.`
      }
    ],
    quiz: [
      {
        question: "Quelle est la principale caractéristique du mannequinat commercial ?",
        options: ["Looks avant-gardistes et étranges", "Accessibilité, sourire et énergie positive pour vendre un produit", "Démarche lente et théâtrale", "Mensurations très strictes pour la haute couture"],
        correctAnswer: "Accessibilité, sourire et énergie positive pour vendre un produit"
      },
      {
        question: "Quelle ville est considérée comme la capitale de la mode avant-gardiste et des jeunes créateurs ?",
        options: ["Paris", "Milan", "New York", "Londres"],
        correctAnswer: "Londres"
      }
    ]
  },
  {
    slug: "module-10-construire-une-carriere-durable",
    title: "Module 10: Construire une Carrière Durable",
    chapters: [
      { 
        slug: "la-transition-vers-l-international-pratique",
        title: "La transition vers l'international : aspects pratiques", 
        content: `Partir à l'international est une étape majeure. Cela implique des démarches administratives complexes (visas, permis de travail) que votre agence vous aidera à naviguer. Sur place, vous devrez faire preuve d'une grande autonomie : trouver un logement (souvent en "model apartment"), gérer votre budget dans une ville chère, et vous adapter rapidement à un nouveau rythme de castings et à une nouvelle culture.`
      },
      { 
        slug: "se-diversifier-apres-le-mannequinat",
        title: "Se diversifier : penser l'après-mannequinat", 
        content: `Une carrière de mannequin est rarement éternelle. Utilisez-la comme un tremplin. Les compétences que vous acquérez (discipline, communication, connaissance de l'image) sont précieuses. Pensez à des reconversions possibles : la comédie, la photographie, le stylisme, la création de contenu, ou même l'entrepreneuriat en lançant votre propre marque. Commencez à vous former et à explorer vos passions en parallèle de votre carrière.`
      },
      { 
        slug: "le-mannequin-comme-entreprise",
        title: "Le mannequin comme une entreprise : gérer sa marque", 
        content: `Considérez-vous comme "CEO" de votre propre entreprise : "Vous, Inc.". Votre produit, c'est votre image. Votre stratégie marketing, c'est votre personal branding. Vos finances, c'est votre gestion budgétaire. Vos investissements, ce sont vos soins, votre formation continue. Adopter cette mentalité d'entrepreneur vous donnera une vision à long terme et vous responsabilisera dans la gestion de votre carrière.`
      },
      { 
        slug: "ethique-et-engagement-dans-la-mode",
        title: "Éthique et engagement : devenir un mannequin influent", 
        content: `Les mannequins d'aujourd'hui ont une voix et une plateforme. Utilisez-les à bon escient. Vous pouvez devenir un agent de changement en soutenant des causes qui vous tiennent à cœur : la mode durable, la diversité, la santé mentale. Un mannequin engagé est non seulement une source d'inspiration, mais aussi un profil de plus en plus recherché par les marques qui veulent associer leur image à des valeurs fortes.` 
      }
    ],
    quiz: [
      {
        question: "Pourquoi est-il crucial de penser à sa reconversion dès le début de sa carrière ?",
        options: ["Car le métier de mannequin est ennuyeux", "Car une carrière de mannequin a une durée limitée et il faut préparer l'avenir", "Pour gagner plus d'argent tout de suite", "Ce n'est pas important"],
        correctAnswer: "Car une carrière de mannequin a une durée limitée et il faut préparer l'avenir"
      },
      {
        question: "Quel est un exemple de diversification de carrière pour un mannequin ?",
        options: ["Prendre sa retraite à 25 ans", "Devenir acteur/actrice ou lancer sa propre marque", "Critiquer les autres mannequins sur les réseaux sociaux", "Ne rien faire"],
        correctAnswer: "Devenir acteur/actrice ou lancer sa propre marque"
      }
    ]
  }
];

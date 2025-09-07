-- Custom ENUM types for better data integrity

CREATE TYPE GENDER_TYPE AS ENUM ('Homme', 'Femme');
CREATE TYPE CASTING_STATUS AS ENUM ('Nouveau', 'Présélectionné', 'Accepté', 'Refusé');
CREATE TYPE FASHION_DAY_ROLE AS ENUM ('Mannequin', 'Styliste', 'Partenaire', 'Photographe', 'MUA', 'Autre');
CREATE TYPE FASHION_DAY_STATUS AS ENUM ('Nouveau', 'En attente', 'Accepté', 'Refusé');
CREATE TYPE RECOVERY_STATUS AS ENUM ('Nouveau', 'Traité');
CREATE TYPE BOOKING_STATUS AS ENUM ('Nouveau', 'Confirmé', 'Annulé');
CREATE TYPE MESSAGE_STATUS AS ENUM ('Nouveau', 'Lu', 'Archivé');

-- Main Tables

CREATE TABLE models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- Should be hashed
    email TEXT UNIQUE,
    phone TEXT,
    age INTEGER,
    height TEXT,
    gender GENDER_TYPE,
    location TEXT,
    image_url TEXT,
    portfolio_images TEXT[],
    distinctions JSONB, -- Array of ModelDistinction objects
    is_public BOOLEAN DEFAULT true,
    chest TEXT,
    waist TEXT,
    hips TEXT,
    shoe_size TEXT,
    categories TEXT[],
    experience TEXT,
    journey TEXT,
    quiz_scores JSONB -- Map of quizId to score
);

CREATE TABLE beginner_students (
    id TEXT PRIMARY KEY, -- Corresponds to CastingApplication ID
    name TEXT NOT NULL,
    matricule TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- Should be hashed
    quiz_scores JSONB -- Map of chapterSlug to score
);

CREATE TABLE fashion_day_events (
    id SERIAL PRIMARY KEY,
    edition INTEGER NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    theme TEXT NOT NULL,
    location TEXT,
    mc TEXT,
    promoter TEXT,
    stylists JSONB, -- Array of Stylist objects
    featured_models TEXT[], -- Array of model names or IDs
    artists TEXT[],
    partners JSONB, -- Array of partner objects
    description TEXT
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    icon TEXT NOT NULL,
    title TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    is_coming_soon BOOLEAN DEFAULT false
);

CREATE TABLE articles (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    image_url TEXT,
    author TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    content JSONB NOT NULL, -- Array of ArticleContent objects
    tags TEXT[],
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    reactions JSONB -- Reactions object { likes, dislikes }
);

CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    quote TEXT NOT NULL,
    image_url TEXT
);

CREATE TABLE news_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    image_url TEXT,
    excerpt TEXT NOT NULL,
    link TEXT
);

CREATE TABLE casting_applications (
    id TEXT PRIMARY KEY,
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    status CASTING_STATUS DEFAULT 'Nouveau',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birth_date TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    nationality TEXT,
    city TEXT,
    gender GENDER_TYPE,
    height TEXT,
    weight TEXT,
    chest TEXT,
    waist TEXT,
    hips TEXT,
    shoe_size TEXT,
    eye_color TEXT,
    hair_color TEXT,
    experience TEXT,
    instagram TEXT,
    portfolio_link TEXT,
    photo_portrait_url TEXT,
    photo_full_body_url TEXT,
    photo_profile_url TEXT,
    scores JSONB, -- Map of juryId to JuryScore
    passage_number INTEGER
);

CREATE TABLE fashion_day_applications (
    id TEXT PRIMARY KEY,
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    role FASHION_DAY_ROLE NOT NULL,
    message TEXT,
    status FASHION_DAY_STATUS DEFAULT 'Nouveau'
);

CREATE TABLE forum_threads (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author_id TEXT NOT NULL, -- Corresponds to model id
    author_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    initial_post TEXT NOT NULL
);

CREATE TABLE forum_replies (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL, -- FK to forum_threads
    author_id TEXT NOT NULL, -- FK to models
    author_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    content TEXT NOT NULL
);

CREATE TABLE article_comments (
    id TEXT PRIMARY KEY,
    article_slug TEXT NOT NULL, -- FK to articles
    author_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    content TEXT NOT NULL
);

CREATE TABLE recovery_requests (
    id TEXT PRIMARY KEY,
    model_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    status RECOVERY_STATUS DEFAULT 'Nouveau'
);

CREATE TABLE booking_requests (
    id TEXT PRIMARY KEY,
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    status BOOKING_STATUS DEFAULT 'Nouveau',
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_company TEXT,
    requested_models TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    message TEXT NOT NULL
);

CREATE TABLE contact_messages (
    id TEXT PRIMARY KEY,
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    status MESSAGE_STATUS DEFAULT 'Nouveau',
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL
);


-- User/Admin Tables for Authentication & Authorization

CREATE TABLE jury_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL -- Should be hashed
);

CREATE TABLE registration_staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL -- Should be hashed
);

-- Site-wide Settings Table (Single Row)

CREATE TABLE site_settings (
    id INT PRIMARY KEY DEFAULT 1, -- Ensures only one row
    contact_email TEXT,
    contact_phone TEXT,
    contact_address TEXT,
    notification_email TEXT,
    hero_image_url TEXT,
    about_image_url TEXT,
    fashion_day_bg_url TEXT,
    agency_history_image_url TEXT,
    classroom_bg_url TEXT,
    casting_bg_url TEXT,
    resend_api_key TEXT, 
    formspree_endpoint TEXT,
    cloudflare_worker_url TEXT,
    CONSTRAINT single_row_check CHECK (id = 1)
);

-- Static content tables that might not need frequent updates

CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- NOTE: Classroom content (Modules, Chapters, Quizzes) is complex and might be better managed
-- as JSON files in the repo or a dedicated Headless CMS. For this SQL schema, we can represent them with JSONB.

CREATE TABLE course_modules (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    chapters JSONB, -- Array of Chapter objects
    quiz JSONB -- Array of QuizQuestion objects
);

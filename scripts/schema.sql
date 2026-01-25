-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Models Table
CREATE TABLE IF NOT EXISTS models (
    id TEXT PRIMARY KEY, -- Firebase IDs are strings, often UUID-like but not always
    name TEXT NOT NULL,
    username TEXT,
    password TEXT, -- Should be hashed
    email TEXT,
    phone TEXT,
    age INTEGER,
    height TEXT,
    gender TEXT, -- 'Homme' | 'Femme'
    location TEXT,
    image_url TEXT,
    weight TEXT,
    hair_color TEXT,
    eye_color TEXT,
    instagram TEXT,
    portfolio_images JSONB, -- Array of strings
    distinctions JSONB, -- Array of objects
    is_public BOOLEAN DEFAULT true,
    level TEXT, -- 'Pro' | 'Débutant'
    measurements JSONB, -- { chest, waist, hips, shoeSize }
    categories JSONB, -- Array of strings
    experience TEXT,
    journey TEXT,
    quiz_scores JSONB,
    last_login TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    excerpt TEXT,
    image_url TEXT,
    author TEXT,
    date TEXT, -- Keeping as text to match source format (YYYY-MM-DD) or convert to DATE
    content JSONB, -- Array of content blocks
    tags JSONB, -- Array of strings
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    reactions JSONB, -- { likes, dislikes }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fashion Day Events
CREATE TABLE IF NOT EXISTS fashion_day_events (
    id TEXT PRIMARY KEY, -- Generated or edition number as string
    edition INTEGER,
    date TEXT,
    theme TEXT,
    location TEXT,
    mc TEXT,
    promoter TEXT,
    description TEXT,
    stylists JSONB,
    artists JSONB,
    partners JSONB,
    featured_models JSONB,
    image_url TEXT -- Added based on memory/usage
);

-- News Items
CREATE TABLE IF NOT EXISTS news_items (
    id TEXT PRIMARY KEY,
    title TEXT,
    date TEXT,
    image_url TEXT,
    excerpt TEXT,
    link TEXT
);

-- Casting Applications
CREATE TABLE IF NOT EXISTS casting_applications (
    id TEXT PRIMARY KEY,
    submission_date TEXT,
    status TEXT, -- 'Nouveau' | 'Présélectionné' | ...
    first_name TEXT,
    last_name TEXT,
    birth_date TEXT,
    email TEXT,
    phone TEXT,
    nationality TEXT,
    city TEXT,
    gender TEXT,
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
    portfolio_photos JSONB,
    scores JSONB,
    passage_number INTEGER
);

-- Fashion Day Applications
CREATE TABLE IF NOT EXISTS fashion_day_applications (
    id TEXT PRIMARY KEY,
    submission_date TEXT,
    name TEXT,
    email TEXT,
    phone TEXT,
    role TEXT,
    message TEXT,
    status TEXT
);

-- Fashion Day Reservations
CREATE TABLE IF NOT EXISTS fashion_day_reservations (
    id TEXT PRIMARY KEY,
    edition INTEGER,
    name TEXT,
    email TEXT,
    phone TEXT,
    table_type TEXT,
    guest_count INTEGER,
    total_price NUMERIC,
    status TEXT,
    submission_date TEXT,
    notes TEXT
);

-- Forum Threads
CREATE TABLE IF NOT EXISTS forum_threads (
    id TEXT PRIMARY KEY,
    title TEXT,
    author_id TEXT,
    author_name TEXT,
    created_at TEXT,
    initial_post TEXT
);

-- Forum Replies
CREATE TABLE IF NOT EXISTS forum_replies (
    id TEXT PRIMARY KEY,
    thread_id TEXT REFERENCES forum_threads(id),
    author_id TEXT,
    author_name TEXT,
    created_at TEXT,
    content TEXT
);

-- Configuration Tables (Generic Store for singletons like siteConfig)
CREATE TABLE IF NOT EXISTS app_config (
    key TEXT PRIMARY KEY,
    value JSONB
);

-- Nav Links
CREATE TABLE IF NOT EXISTS nav_links (
    id TEXT PRIMARY KEY,
    path TEXT,
    label TEXT,
    in_footer BOOLEAN,
    footer_label TEXT
);

-- Hero Slides
CREATE TABLE IF NOT EXISTS hero_slides (
    id TEXT PRIMARY KEY,
    image TEXT,
    title TEXT,
    subtitle TEXT,
    button_text TEXT,
    button_link TEXT,
    second_button_text TEXT,
    second_button_link TEXT,
    display_order INTEGER -- 'order' is a reserved keyword
);

-- Services
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    slug TEXT,
    icon TEXT,
    title TEXT,
    category TEXT,
    description TEXT,
    details JSONB,
    button_text TEXT,
    button_link TEXT,
    is_coming_soon BOOLEAN
);

-- Partners
CREATE TABLE IF NOT EXISTS partners (
    id TEXT PRIMARY KEY,
    name TEXT,
    logo_url TEXT -- Assuming partner might have logo
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    quote TEXT,
    image_url TEXT
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    submission_date TEXT,
    status TEXT,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    title TEXT,
    category TEXT,
    date TEXT,
    image_url TEXT,
    additional_images JSONB,
    video_url TEXT,
    description TEXT,
    featured BOOLEAN
);

-- Booking Requests
CREATE TABLE IF NOT EXISTS booking_requests (
    id TEXT PRIMARY KEY,
    submission_date TEXT,
    status TEXT,
    client_name TEXT,
    client_email TEXT,
    client_company TEXT,
    requested_models TEXT,
    start_date TEXT,
    end_date TEXT,
    message TEXT
);

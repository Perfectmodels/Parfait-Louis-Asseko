// Service de gestion des contacts et campagnes
export interface Contact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    tags: string[];
    status: 'active' | 'unsubscribed' | 'bounced';
    source: 'import' | 'manual' | 'website';
    createdAt: string;
    lastContact?: string;
}

export interface Campaign {
    id: string;
    name: string;
    subject: string;
    message: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
    recipients: string[];
    sent: number;
    opened: number;
    clicked: number;
    createdAt: string;
    scheduledAt?: string;
}

// Stockage local des contacts et campagnes
const CONTACTS_KEY = 'perfect_models_contacts';
const CAMPAIGNS_KEY = 'perfect_models_campaigns';

export const getContacts = (): Contact[] => {
    try {
        const stored = localStorage.getItem(CONTACTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Erreur lors du chargement des contacts:', error);
        return [];
    }
};

export const saveContacts = (contacts: Contact[]): void => {
    try {
        localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des contacts:', error);
    }
};

export const addContact = (contact: Omit<Contact, 'id' | 'createdAt'>): Contact => {
    const contacts = getContacts();
    const newContact: Contact = {
        ...contact,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    
    contacts.push(newContact);
    saveContacts(contacts);
    return newContact;
};

export const updateContact = (id: string, updates: Partial<Contact>): Contact | null => {
    const contacts = getContacts();
    const index = contacts.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    contacts[index] = { ...contacts[index], ...updates };
    saveContacts(contacts);
    return contacts[index];
};

export const deleteContact = (id: string): boolean => {
    const contacts = getContacts();
    const filtered = contacts.filter(c => c.id !== id);
    
    if (filtered.length === contacts.length) return false;
    
    saveContacts(filtered);
    return true;
};

export const importContacts = (contactsData: Array<{
    name: string;
    email: string;
    phone?: string;
    company?: string;
}>): { success: number; failed: number; errors: string[] } => {
    const existingContacts = getContacts();
    const existingEmails = new Set(existingContacts.map(c => c.email.toLowerCase()));
    
    let success = 0;
    let failed = 0;
    const errors: string[] = [];
    
    contactsData.forEach((contactData, index) => {
        try {
            // Validation de l'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactData.email)) {
                failed++;
                errors.push(`Ligne ${index + 1}: Email invalide`);
                return;
            }
            
            // Vérification des doublons
            if (existingEmails.has(contactData.email.toLowerCase())) {
                failed++;
                errors.push(`Ligne ${index + 1}: Email déjà existant`);
                return;
            }
            
            // Création du contact
            const newContact: Contact = {
                id: Date.now().toString() + index,
                name: contactData.name,
                email: contactData.email,
                phone: contactData.phone,
                company: contactData.company,
                tags: [],
                status: 'active',
                source: 'import',
                createdAt: new Date().toISOString()
            };
            
            existingContacts.push(newContact);
            existingEmails.add(contactData.email.toLowerCase());
            success++;
        } catch (error) {
            failed++;
            errors.push(`Ligne ${index + 1}: Erreur de traitement`);
        }
    });
    
    if (success > 0) {
        saveContacts(existingContacts);
    }
    
    return { success, failed, errors };
};

// Gestion des campagnes
export const getCampaigns = (): Campaign[] => {
    try {
        const stored = localStorage.getItem(CAMPAIGNS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Erreur lors du chargement des campagnes:', error);
        return [];
    }
};

export const saveCampaigns = (campaigns: Campaign[]): void => {
    try {
        localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des campagnes:', error);
    }
};

export const createCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'sent' | 'opened' | 'clicked'>): Campaign => {
    const campaigns = getCampaigns();
    const newCampaign: Campaign = {
        ...campaignData,
        id: Date.now().toString(),
        sent: 0,
        opened: 0,
        clicked: 0,
        createdAt: new Date().toISOString()
    };
    
    campaigns.push(newCampaign);
    saveCampaigns(campaigns);
    return newCampaign;
};

export const updateCampaign = (id: string, updates: Partial<Campaign>): Campaign | null => {
    const campaigns = getCampaigns();
    const index = campaigns.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    campaigns[index] = { ...campaigns[index], ...updates };
    saveCampaigns(campaigns);
    return campaigns[index];
};

export const deleteCampaign = (id: string): boolean => {
    const campaigns = getCampaigns();
    const filtered = campaigns.filter(c => c.id !== id);
    
    if (filtered.length === campaigns.length) return false;
    
    saveCampaigns(filtered);
    return true;
};

// Fashion Day Edition 2 - Configuration
export const fashionDayEdition2 = {
    edition: 2,
    date: "2025-03-15", // À ajuster selon la vraie date
    title: "Perfect Fashion Day - Édition 2",
    description: "La deuxième édition du Perfect Fashion Day avec 9 stylistes exceptionnels",

    // Liste des stylistes participants
    stylists: [
        {
            id: "evo-style-creations",
            name: "Evo Style Creations",
            order: 1
        },
        {
            id: "rabibi",
            name: "Rabibi",
            order: 2
        },
        {
            id: "miguel-fashion-style",
            name: "Miguel Fashion Style",
            order: 3
        },
        {
            id: "rabs-collection",
            name: "Rab's Collection",
            order: 4
        },
        {
            id: "tito-style",
            name: "Tito Style",
            order: 5
        },
        {
            id: "edele-a",
            name: "Edele A",
            description: "Créatrice & Invitée",
            order: 6
        },
        {
            id: "nans-ethnik",
            name: "Nan's Ethnik",
            order: 7
        },
        {
            id: "les-incompris",
            name: "Les Incompris",
            order: 8
        },
        {
            id: "le-pagne-de-paris",
            name: "Le Pagne de Paris",
            order: 9
        }
    ],

    // Options de réservation de tables
    reservationTableOptions: [
        // Tables avec Bières Locales
        {
            id: "table-1-local",
            name: "Table 1",
            category: "Bières Locales",
            capacity: 4,
            price: 50000,
            description: "2 Seaux de Bières Locales + 1 Bouteille de Vin Blanc",
            includes: [
                "2 Seaux de Bières Locales",
                "1 Bouteille de Vin Blanc"
            ]
        },
        {
            id: "table-2-local",
            name: "Table 2",
            category: "Bières Locales",
            capacity: 6,
            price: 70000,
            description: "3 Seaux de Bières Locales + 1 Bouteille de Vin Blanc",
            includes: [
                "3 Seaux de Bières Locales",
                "1 Bouteille de Vin Blanc"
            ]
        },
        {
            id: "table-3-local",
            name: "Table 3",
            category: "Bières Locales",
            capacity: 8,
            price: 100000,
            description: "4 Seaux de Bières Locales + 1 Bouteille de Vin Blanc",
            includes: [
                "4 Seaux de Bières Locales",
                "1 Bouteille de Vin Blanc"
            ]
        },
        // Tables avec Bières Étrangères
        {
            id: "table-4-foreign",
            name: "Table 4",
            category: "Bières Étrangères",
            capacity: 4,
            price: 50000,
            description: "2 Seaux de Bières Étrangères + 1 Bouteille de Vin Blanc",
            includes: [
                "2 Seaux de Bières Étrangères",
                "1 Bouteille de Vin Blanc"
            ]
        },
        {
            id: "table-5-foreign",
            name: "Table 5",
            category: "Bières Étrangères",
            capacity: 6,
            price: 80000,
            description: "3 Seaux de Bières Étrangères + 1 Bouteille de Vin Blanc",
            includes: [
                "3 Seaux de Bières Étrangères",
                "1 Bouteille de Vin Blanc"
            ]
        },
        {
            id: "table-6-foreign",
            name: "Table 6",
            category: "Bières Étrangères",
            capacity: 8,
            price: 110000,
            description: "4 Seaux de Bières Étrangères + 1 Bouteille de Vin Blanc",
            includes: [
                "4 Seaux de Bières Étrangères",
                "1 Bouteille de Vin Blanc"
            ]
        }
    ]
};

// Export des options de réservation pour compatibilité
export const reservationTableOptions = fashionDayEdition2.reservationTableOptions;

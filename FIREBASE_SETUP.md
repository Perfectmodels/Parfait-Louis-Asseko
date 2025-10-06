# Configuration Firebase pour la Messagerie Temps Réel

## 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 2. Configuration Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez les services suivants :
   - **Firestore Database** (mode production)
   - **Storage** (pour les pièces jointes)
   - **Authentication** (optionnel, pour l'auth utilisateur)

## 3. Règles Firestore

Appliquez ces règles dans Firebase Console → Firestore → Rules :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // conversations
    match /conversations/{convId} {
      allow read: if request.auth != null && request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid in resource.data.participants;
      match /messages/{messageId} {
        allow create: if request.auth != null && request.auth.uid == request.resource.data.senderId;
        allow read: if request.auth != null && request.auth.uid in get(/databases/$(database)/documents/conversations/$(convId)).data.participants;
        allow update: if false; // messages are immutable for simplicity
      }
      match /presence/{userId} {
        allow write: if request.auth != null && request.auth.uid == userId;
        allow read: if request.auth != null && request.auth.uid in resource.data.participants;
      }
    }
  }
}
```

## 4. Règles Storage

Appliquez ces règles dans Firebase Console → Storage → Rules :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /conversations/{conversationId}/attachments/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 5. Structure des données

### Conversations
```
conversations/{conversationId}
├── participants: string[]
├── createdAt: timestamp
├── updatedAt: timestamp
├── lastMessage: object
├── unreadMap: { [userId]: number }
└── displayName?: string
```

### Messages
```
conversations/{conversationId}/messages/{messageId}
├── conversationId: string
├── senderId: string
├── senderName: string
├── senderRole: string
├── content?: string
├── attachments?: array
├── timestamp: timestamp
├── isRead: boolean
└── messageType: 'text' | 'file' | 'image'
```

### Presence (typing indicator)
```
conversations/{conversationId}/presence/{userId}
├── typing: boolean
└── updatedAt: timestamp
```

## 6. Fonctionnalités implémentées

✅ **Messagerie temps réel** avec Firestore
✅ **Upload de fichiers** vers Firebase Storage
✅ **Indicateur de saisie** (typing indicator)
✅ **Compteur de messages non lus**
✅ **Notifications navigateur** (optionnel)
✅ **Interface responsive** mobile/desktop
✅ **Recherche de conversations**
✅ **Création automatique de conversations**

## 7. Tests

Pour tester la messagerie :
1. Ouvrez l'application dans deux onglets différents
2. Utilisez des `currentUserId` différents
3. Envoyez des messages et vérifiez la synchronisation temps réel
4. Testez l'upload de fichiers
5. Vérifiez l'indicateur de saisie

## 8. Optimisations futures

- **Notifications push** via Firebase Cloud Messaging
- **Pagination des messages** pour les longues conversations
- **Chiffrement des messages** pour la sécurité
- **Modération automatique** des contenus
- **Statistiques d'engagement** des conversations

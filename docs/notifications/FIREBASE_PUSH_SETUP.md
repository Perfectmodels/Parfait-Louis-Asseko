# Configuration Firebase Push Notifications

## ✅ Ce qui a été fait

### Android
- [x] `google-services.json` copié dans `android/app/`
- [x] Plugin Google Services configuré dans `build.gradle`
- [x] Dépendances Firebase ajoutées (Messaging, Analytics)
- [x] Service `MyFirebaseMessagingService` créé
- [x] Service déclaré dans `AndroidManifest.xml`
- [x] Permission `POST_NOTIFICATIONS` ajoutée
- [x] Canal de notification configuré

### Code
- [x] `nativePush.ts` implémenté
- [x] Intégration dans `App.tsx`
- [x] Demande de permission automatique au démarrage

## 🧪 Tester les Notifications

### 1. Lancer l'app
```bash
npm run mobile:android
```

### 2. Récupérer le token FCM
Ouvre les logs Android Studio (Logcat) et cherche :
```
Push registration success, token: [TON_TOKEN]
```

Ou dans la console du navigateur (si en dev avec live reload).

### 3. Envoyer une notification de test

#### Option A : Firebase Console (le plus simple)
1. Va sur https://console.firebase.google.com/
2. Sélectionne ton projet "perfect-156b5"
3. Cloud Messaging → Send your first message
4. Titre : "Test PMM"
5. Message : "Notification de test"
6. Cible : Sélectionne ton app Android
7. Envoie maintenant

#### Option B : Via API REST
```bash
curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Authorization: key=TON_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "TON_TOKEN_FCM",
    "notification": {
      "title": "Perfect Models Management",
      "body": "Notification de test",
      "icon": "ic_launcher"
    }
  }'
```

Remplace :
- `TON_SERVER_KEY` : Firebase Console → Project Settings → Cloud Messaging → Server key
- `TON_TOKEN_FCM` : Le token récupéré à l'étape 2

#### Option C : Via Node.js (pour intégrer dans ton backend)
```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

const message = {
  notification: {
    title: 'Perfect Models Management',
    body: 'Nouvelle notification'
  },
  token: 'TON_TOKEN_FCM'
};

admin.messaging().send(message)
  .then(response => console.log('Success:', response))
  .catch(error => console.error('Error:', error));
```

### 4. Vérifier la réception
- Si l'app est au premier plan : log dans la console
- Si l'app est en arrière-plan : notification dans la barre de statut
- Clique sur la notification pour ouvrir l'app

## 📱 Tester sur Device Réel

Les notifications push ne fonctionnent PAS sur émulateur sans Google Play Services.

### Prérequis
- Device Android avec Google Play Services
- Connexion Internet

### Étapes
1. Active le mode développeur sur ton téléphone
2. Active le débogage USB
3. Connecte le téléphone
4. Lance l'app : `npm run mobile:android`
5. Sélectionne ton device dans Android Studio
6. Clique sur Run ▶️

## 🔧 Configuration Avancée

### Personnaliser les Notifications

Édite `MyFirebaseMessagingService.java` :

```java
private void sendNotification(String title, String messageBody) {
    // Personnalise l'icône
    .setSmallIcon(R.drawable.ic_notification)
    
    // Personnalise la couleur
    .setColor(0xC9A84C)  // Or PMM
    
    // Ajoute un son
    .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
    
    // Ajoute une vibration
    .setVibrate(new long[]{0, 500, 250, 500})
    
    // Ajoute une LED
    .setLights(0xC9A84C, 1000, 500)
}
```

### Gérer les Data Messages

Pour envoyer des données avec la notification :

```javascript
// Côté serveur
const message = {
  notification: {
    title: 'Nouveau casting',
    body: 'Un nouveau casting est disponible'
  },
  data: {
    type: 'casting',
    castingId: '12345',
    action: 'open_casting'
  },
  token: 'TON_TOKEN_FCM'
};
```

```java
// Dans MyFirebaseMessagingService.java
@Override
public void onMessageReceived(RemoteMessage remoteMessage) {
    // Récupère les données
    if (remoteMessage.getData().size() > 0) {
        String type = remoteMessage.getData().get("type");
        String castingId = remoteMessage.getData().get("castingId");
        
        // Traite selon le type
        if ("casting".equals(type)) {
            // Ouvre la page casting
        }
    }
}
```

### Topics (Notifications de groupe)

Pour envoyer à tous les utilisateurs :

```typescript
// Dans nativePush.ts
import { PushNotifications } from '@capacitor/push-notifications';

// S'abonner à un topic
await PushNotifications.addListener('registration', token => {
  // S'abonner au topic "all_users"
  fetch('https://iid.googleapis.com/iid/v1/' + token.value + '/rel/topics/all_users', {
    method: 'POST',
    headers: {
      'Authorization': 'key=TON_SERVER_KEY'
    }
  });
});
```

```bash
# Envoyer à tous les abonnés du topic
curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Authorization: key=TON_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "/topics/all_users",
    "notification": {
      "title": "Annonce générale",
      "body": "Message pour tous les utilisateurs"
    }
  }'
```

## 🐛 Troubleshooting

### Token non reçu
- Vérifie que `google-services.json` est bien dans `android/app/`
- Vérifie les logs : `adb logcat | grep FCM`
- Vérifie que les permissions sont accordées
- Redémarre l'app

### Notification non reçue
- Vérifie que le token est valide
- Vérifie que l'app a la permission de notifications
- Vérifie que le device a Internet
- Vérifie les logs Firebase Console

### Erreur "MismatchSenderId"
- Le `google-services.json` ne correspond pas au projet Firebase
- Retélécharge le bon fichier depuis Firebase Console

### Notification reçue mais pas affichée
- Vérifie que le canal de notification est créé
- Vérifie les paramètres de notification du device
- Vérifie que l'app n'est pas en mode "Ne pas déranger"

## 📊 Analytics

Firebase Analytics est automatiquement activé. Pour voir les stats :

1. Firebase Console → Analytics
2. Vois les événements automatiques (app_open, screen_view, etc.)
3. Ajoute des événements custom si besoin

## 🔐 Sécurité

### Server Key
- Ne JAMAIS exposer la Server Key côté client
- Utilise-la uniquement côté serveur (Node.js, Vercel functions, etc.)
- Stocke-la dans les variables d'environnement

### Token FCM
- Le token peut changer (désinstall/réinstall, clear data)
- Enregistre le token sur ton serveur
- Mets à jour le token quand `onNewToken` est appelé

## 📚 Ressources

- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Capacitor Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)
- [Android Notifications](https://developer.android.com/develop/ui/views/notifications)

---

🎉 Les notifications push sont maintenant configurées !

Pour tester : Lance l'app, récupère le token, et envoie une notification depuis Firebase Console.

# Nouvelles Fonctionnalités Techniques Firebase

Ce projet intègre désormais plusieurs fonctionnalités avancées de Firebase pour le monitoring et l'engagement utilisateur.

## 1. Analytics & Performance Monitoring

Ces fonctionnalités sont **activées automatiquement** dès que l'application est chargée.

* **Google Analytics** : Suit les pages vues et les événements utilisateurs.
* **Performance Monitoring** : Suit les temps de chargement des pages et les requêtes réseau pour identifier les goulots d'étranglement.

Vous pouvez consulter les tableaux de bord correspondants dans la [Console Firebase](https://console.firebase.google.com/).

---

## 2. Web Push Notifications (FCM)

Le système de notifications push web est en place, alimenté par **Firebase Cloud Messaging (FCM)**.

### 🛠️ Configuration Requise (Clé VAPID)

Pour que les notifications fonctionnent, vous devez générer une clé VAPID (certificat Web Push) et l'ajouter au code.

1. Allez dans la **Console Firebase** > **Project Settings** (roue dentée).
2. Onglet **Cloud Messaging**.
3. Section **Web configuration**.
4. Cliquez sur **Generate key pair** si aucune n'existe.
5. Copiez la "Public Key" générée (une longue chaîne de caractères).
6. Ouvrez le fichier `src/hooks/useNotifications.ts`.
7. Remplacez la valeur placeholder par votre clé publique :

```typescript
// src/hooks/useNotifications.ts
const token = await getToken(messaging, {
  vapidKey: "VOTRE_CLE_VAPID_ICI" // <--- Collez la clé ici
});
```

### 📱 Comment Tester les Notifications

Un composant de test a été ajouté au **Dashboard Admin**.

1. Connectez-vous à l'application et allez sur la page **Admin**.
2. Vous verrez un encart **Notifications Push**.
3. Cliquez sur **"Activer les notifications"**.
4. Autorisez les notifications dans la fenêtre qui s'ouvre.
5. Une fois activé, un **Token FCM** s'affichera. Copiez-le.

### 📨 Envoyer une Notification Test

1. Allez dans la **Console Firebase** > **Messaging** (dans le menu de gauche).
2. Cliquez sur **New campaign** > **Notifications**.
3. Remplissez le titre et le texte de la notification.
4. Cliquez sur **Send test message**.
5. Collez le **Token FCM** que vous avez copié depuis le Dashboard Admin.
6. Cliquez sur **Test**.

// src/utils/pwa.ts
// This file is now mostly empty as VitePWA handles registration automatically or via the virtual module.
// We keep it if other parts of the app import it, but we disable the manual registration logic.

export function registerServiceWorker() {
  // Logic moved to VitePWA plugin and PWAInstaller component.
  console.log('Service Worker registration handled by VitePWA.');
}

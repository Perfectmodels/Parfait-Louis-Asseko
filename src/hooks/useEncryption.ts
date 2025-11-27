import { useState, useCallback } from 'react';

interface EncryptionKey {
  id: string;
  key: string;
  algorithm: string;
  createdAt: number;
}

interface EncryptionResult {
  encrypted: string;
  keyId: string;
  algorithm: string;
}

interface DecryptionResult {
  decrypted: string;
  success: boolean;
  error?: string;
}

export const useEncryption = () => {
  const [keys, setKeys] = useState<Map<string, EncryptionKey>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);

  // Générer une nouvelle clé de chiffrement
  const generateKey = useCallback(async (chatId: string): Promise<EncryptionKey> => {
    setIsGenerating(true);
    
    try {
      // Simuler la génération d'une clé (en production, utiliser Web Crypto API)
      const keyData = Array.from({ length: 32 }, () => 
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join('');
      
      const key: EncryptionKey = {
        id: `key_${chatId}_${Date.now()}`,
        key: keyData,
        algorithm: 'AES-256-GCM',
        createdAt: Date.now()
      };
      
      // Stocker la clé en mémoire (en production, utiliser IndexedDB avec chiffrement)
      setKeys(prev => new Map(prev).set(chatId, key));
      
      return key;
    } catch (error) {
      console.error('Erreur lors de la génération de la clé:', error);
      throw new Error('Impossible de générer la clé de chiffrement');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Chiffrer un message
  const encrypt = useCallback(async (
    text: string, 
    chatId: string, 
    keyId?: string
  ): Promise<EncryptionResult> => {
    try {
      let key = keys.get(chatId);
      
      if (!key || (keyId && key.id !== keyId)) {
        key = await generateKey(chatId);
      }
      
      // Simuler le chiffrement (en production, utiliser Web Crypto API)
      const encrypted = btoa(encodeURIComponent(text));
      
      return {
        encrypted,
        keyId: key.id,
        algorithm: key.algorithm
      };
    } catch (error) {
      console.error('Erreur lors du chiffrement:', error);
      throw new Error('Impossible de chiffrer le message');
    }
  }, [keys, generateKey]);

  // Déchiffrer un message
  const decrypt = useCallback(async (
    encrypted: string, 
    keyId: string, 
    chatId: string
  ): Promise<DecryptionResult> => {
    try {
      const key = keys.get(chatId);
      
      if (!key || key.id !== keyId) {
        return {
          decrypted: '',
          success: false,
          error: 'Clé de déchiffrement introuvable'
        };
      }
      
      // Simuler le déchiffrement (en production, utiliser Web Crypto API)
      const decrypted = decodeURIComponent(atob(encrypted));
      
      return {
        decrypted,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors du déchiffrement:', error);
      return {
        decrypted: '',
        success: false,
        error: 'Impossible de déchiffrer le message'
      };
    }
  }, [keys]);

  // Vérifier si un chat est chiffré
  const isEncrypted = useCallback((chatId: string): boolean => {
    return keys.has(chatId);
  }, [keys]);

  // Obtenir la clé de chiffrement pour un chat
  const getKey = useCallback((chatId: string): EncryptionKey | undefined => {
    return keys.get(chatId);
  }, [keys]);

  // Supprimer une clé de chiffrement
  const deleteKey = useCallback((chatId: string): boolean => {
    const deleted = keys.has(chatId);
    setKeys(prev => {
      const newKeys = new Map(prev);
      newKeys.delete(chatId);
      return newKeys;
    });
    return deleted;
  }, []);

  // Nettoyer toutes les clés
  const clearAllKeys = useCallback((): void => {
    setKeys(new Map());
  }, []);

  // Exporter les clés (pour sauvegarde)
  const exportKeys = useCallback((): string => {
    const keysArray = Array.from(keys.entries()).map(([chatId, key]) => ({
      chatId,
      key
    }));
    return JSON.stringify(keysArray);
  }, [keys]);

  // Importer les clés (pour restauration)
  const importKeys = useCallback((keysData: string): boolean => {
    try {
      const parsedKeys = JSON.parse(keysData);
      const newKeys = new Map<string, EncryptionKey>();
      
      parsedKeys.forEach(({ chatId, key }: { chatId: string; key: EncryptionKey }) => {
        newKeys.set(chatId, key);
      });
      
      setKeys(newKeys);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'importation des clés:', error);
      return false;
    }
  }, []);

  return {
    // État
    keys: Array.from(keys.entries()),
    isGenerating,
    
    // Actions
    generateKey,
    encrypt,
    decrypt,
    isEncrypted,
    getKey,
    deleteKey,
    clearAllKeys,
    exportKeys,
    importKeys
  };
};

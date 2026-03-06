
import { Dropbox } from 'dropbox';

export interface DropboxFile {
    id: string;
    name: string;
    path_display?: string;
    client_modified: string;
    sharing_url?: string;
    thumbnail?: string;
}

class DropboxService {
    private dbx: Dropbox | null = null;
    private appKey: string;
    private accessToken: string | null = null;

    constructor() {
        // @ts-ignore
        this.appKey = (import.meta as any).env.VITE_DROPBOX_APP_KEY || '';

        // Prioritize static token from .env if available, otherwise use localStorage
        // @ts-ignore
        const envToken = (import.meta as any).env.VITE_DROPBOX_ACCESS_TOKEN;
        this.accessToken = envToken || localStorage.getItem('dropbox_access_token');

        if (this.accessToken) {
            this.dbx = new Dropbox({ accessToken: this.accessToken });
        }
    }

    /**
     * Re-initialise le service avec une nouvelle clé (depuis les paramètres)
     */
    updateToken(token: string) {
        if (token && token !== this.accessToken) {
            this.accessToken = token;
            this.dbx = new Dropbox({ accessToken: token });
        }
    }

    /**
     * Génère l'URL d'authentification Dropbox
     */
    getAuthUrl(): string {
        const dbx = new Dropbox({ clientId: this.appKey });
        // @ts-ignore
        const authUrl = dbx.auth.getAuthenticationUrl(
            window.location.origin + '/admin/dropbox-callback',
            undefined,
            'token'
        );
        return authUrl.toString();
    }

    /**
     * Définit l'access token après le callback
     */
    setToken(token: string) {
        this.accessToken = token;
        localStorage.setItem('dropbox_access_token', token);
        this.dbx = new Dropbox({ accessToken: token });
    }

    /**
     * Vérifie si le service est authentifié
     */
    isAuthenticated(): boolean {
        return !!this.accessToken;
    }

    /**
     * Upload un fichier vers Dropbox
     */
    async uploadFile(file: File, path: string = ''): Promise<DropboxFile> {
        if (!this.dbx) throw new Error("Dropbox non authentifié");

        const fullPath = `${path}/${file.name}`.replace(/\/+/g, '/');

        const response = await this.dbx.filesUpload({
            path: fullPath,
            contents: file,
            mode: { '.tag': 'overwrite' }
        });

        const result = response.result;

        // Créer un lien de partage pour avoir une URL publique
        let sharingUrl = '';
        try {
            const sharingResponse = await this.dbx.sharingCreateSharedLinkWithSettings({
                path: result.path_display || fullPath
            });
            sharingUrl = sharingResponse.result.url.replace('?dl=0', '?raw=1');
        } catch (e) {
            // Le lien existe peut-être déjà
            try {
                const links = await this.dbx.sharingListSharedLinks({
                    path: result.path_display || fullPath,
                    direct_only: true
                });
                if (links.result.links.length > 0) {
                    sharingUrl = links.result.links[0].url.replace('?dl=0', '?raw=1');
                }
            } catch (err) {
                console.error("Erreur lien de partage:", err);
            }
        }

        return {
            id: result.id,
            name: result.name,
            path_display: result.path_display,
            // @ts-ignore
            client_modified: result.client_modified,
            sharing_url: sharingUrl
        };
    }

    /**
     * Liste les fichiers récents
     */
    async listFiles(path: string = ''): Promise<DropboxFile[]> {
        if (!this.dbx) throw new Error("Dropbox non authentifié");

        const response = await this.dbx.filesListFolder({
            path,
            limit: 20
        });

        return response.result.entries.filter(e => e['.tag'] === 'file').map(e => ({
            id: e.id,
            name: e.name,
            path_display: (e as any).path_display,
            client_modified: (e as any).client_modified,
        }));
    }

    /**
     * Déconnexion
     */
    logout() {
        this.accessToken = null;
        this.dbx = null;
        localStorage.removeItem('dropbox_access_token');
    }
}

export const dropboxService = new DropboxService();

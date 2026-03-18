// Dropbox service stub — token updated dynamically from admin settings
export const dropboxService = {
  token: '',
  updateToken(token: string) {
    this.token = token;
  },
};

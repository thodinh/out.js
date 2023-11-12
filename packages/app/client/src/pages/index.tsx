import { Application } from '@nocobase/client';
import devDynamicImport from '../.plugins/index';

export const app = new Application({
  apiClient: {
    baseURL: process.env.API_BASE_URL,
  },
  plugins: [],
  ws: true,
  loadRemotePlugins: true,
  devDynamicImport,
});

export default app.getRootComponent();

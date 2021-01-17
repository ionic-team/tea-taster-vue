import {
  IdentityVault,
  PluginOptions,
  IonicNativeAuthPlugin,
} from '@ionic-enterprise/identity-vault';
import { browserVaultService } from './BrowserVaultService';

export class BrowserVaultPlugin implements IonicNativeAuthPlugin {
  getVault(config: PluginOptions): IdentityVault {
    (config as any).onReady(browserVaultService);
    return browserVaultService;
  }
}

export const browserVaultPlugin = new BrowserVaultPlugin();

import {
  IonicIdentityVaultUser,
  IonicNativeAuthPlugin,
  AuthMode,
} from '@ionic-enterprise/identity-vault';
import { isPlatform, modalController } from '@ionic/vue';

import { browserVaultPlugin } from './BrowserVaultPlugin';
import { Session } from '@/models';
import AppPinDialog from '@/components/AppPinDialog.vue';
import router from '@/router';
import store from '@/store';

export class SessionVaultService extends IonicIdentityVaultUser<Session> {
  constructor() {
    super(
      { ready: () => Promise.resolve() },
      {
        unlockOnAccess: true,
        hideScreenOnBackground: true,
        lockAfter: 5000,
        allowSystemPinFallback: true,
        shouldClearVaultAfterTooManyFailedAttempts: false,
      },
    );
  }

  onVaultLocked(): void {
    store.dispatch('clear');
    router.replace('/login');
  }

  async canUnlock(): Promise<boolean> {
    if (!(await this.hasStoredSession())) {
      return false;
    }
    const vault = await this.getVault();
    if (!(await vault.isLocked())) {
      return false;
    }

    const mode = await this.getAuthMode();
    return (
      mode === AuthMode.PasscodeOnly ||
      mode === AuthMode.BiometricAndPasscode ||
      (mode === AuthMode.BiometricOnly && (await this.isBiometricsAvailable()))
    );
  }

  async isLocked(): Promise<boolean> {
    const vault = await this.getVault();
    return vault.isLocked();
  }

  async onPasscodeRequest(isPasscodeSetRequest: boolean): Promise<string> {
    const dlg = await modalController.create({
      backdropDismiss: false,
      component: AppPinDialog,
      componentProps: {
        setPasscodeMode: isPasscodeSetRequest,
      },
    });
    dlg.present();
    const { data } = await dlg.onDidDismiss();
    return Promise.resolve(data || '');
  }

  getPlugin(): IonicNativeAuthPlugin {
    if (isPlatform('hybrid')) {
      return super.getPlugin();
    }
    return browserVaultPlugin;
  }
}

export const sessionVaultService = new SessionVaultService();

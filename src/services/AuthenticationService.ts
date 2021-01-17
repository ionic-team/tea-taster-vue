import { IonicAuth } from '@ionic-enterprise/auth';

import { User } from '@/models';
import { sessionVaultService } from './SessionVaultService';
import { getAuthConfig } from './AuthConnectConfig';

export class AuthenticationService extends IonicAuth {
  constructor() {
    const config = getAuthConfig();
    config.tokenStorageProvider = sessionVaultService;
    super(config);
  }

  async login(): Promise<void> {
    try {
      await super.login();
    } catch (err) {
      // This is to handle the password reset case for Azure AD
      //  This only applicable to Azure AD.
      console.log('login error:', +err);
      const message: string = err.message;
      // This is the error code returned by the Azure AD servers on failure.
      if (message !== undefined && message.startsWith('AADB2C90118')) {
        // The address you pass back is the custom user flow (policy) endpoint
        await super.login(
          'https://vikingsquad.b2clogin.com/vikingsquad.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_password_reset',
        );
      } else {
        throw new Error(err.error);
      }
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const isVaultLocked = await sessionVaultService.isLocked();
    return !isVaultLocked && (await super.isAuthenticated());
  }

  async onLogout(): Promise<void> {
    await sessionVaultService.logout();
  }

  async getUserInfo(): Promise<User | undefined> {
    const idToken = await this.getIdToken();
    if (!idToken) {
      return;
    }

    let email = idToken.email;
    if (idToken.emails instanceof Array) {
      email = idToken.emails[0];
    }

    return {
      id: idToken.sub,
      email: email,
      firstName: idToken.firstName,
      lastName: idToken.lastName,
    };
  }
}

export const authenticationService = new AuthenticationService();

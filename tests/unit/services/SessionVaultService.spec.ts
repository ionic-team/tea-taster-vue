import { sessionVaultService } from '@/services/SessionVaultService';
import { AuthMode } from '@ionic-enterprise/identity-vault';

describe('sessionVaultService', () => {
  it('exists', () => {
    expect(sessionVaultService).toBeTruthy();
  });

  describe('can unlock', () => {
    let vault: any;

    beforeEach(() => {
      vault = {
        isLocked: jest.fn().mockResolvedValue(true),
      };
      sessionVaultService.getAuthMode = jest
        .fn()
        .mockResolvedValue(AuthMode.PasscodeOnly);
      sessionVaultService.hasStoredSession = jest.fn().mockResolvedValue(true);
      sessionVaultService.isBiometricsAvailable = jest
        .fn()
        .mockResolvedValue(true);
      sessionVaultService.getVault = jest.fn().mockResolvedValue(vault);
    });

    it('is false if there is no stored session', async () => {
      (sessionVaultService.hasStoredSession as any).mockResolvedValue(false);
      expect(await sessionVaultService.canUnlock()).toBe(false);
    });

    it('is false if there the vault is not locked', async () => {
      (vault.isLocked as any).mockResolvedValue(false);
      expect(await sessionVaultService.canUnlock()).toBe(false);
    });

    it('is false if the auth mode does not use locking', async () => {
      (sessionVaultService.getAuthMode as any).mockResolvedValue(
        AuthMode.InMemoryOnly,
      );
      expect(await sessionVaultService.canUnlock()).toBe(false);
      (sessionVaultService.getAuthMode as any).mockResolvedValue(
        AuthMode.SecureStorage,
      );
      expect(await sessionVaultService.canUnlock()).toBe(false);
    });

    it('is true for passcode only mode', async () => {
      (sessionVaultService.isBiometricsAvailable as any).mockResolvedValue(
        false,
      );
      (sessionVaultService.getAuthMode as any).mockResolvedValue(
        AuthMode.PasscodeOnly,
      );
      expect(await sessionVaultService.canUnlock()).toBe(true);
      (sessionVaultService.isBiometricsAvailable as any).mockResolvedValue(
        true,
      );
      expect(await sessionVaultService.canUnlock()).toBe(true);
    });

    it('is true for passcode and biometric', async () => {
      (sessionVaultService.isBiometricsAvailable as any).mockResolvedValue(
        false,
      );
      (sessionVaultService.getAuthMode as any).mockResolvedValue(
        AuthMode.BiometricAndPasscode,
      );
      expect(await sessionVaultService.canUnlock()).toBe(true);
      (sessionVaultService.isBiometricsAvailable as any).mockResolvedValue(
        true,
      );
      expect(await sessionVaultService.canUnlock()).toBe(true);
    });

    it('depends on biometric availability for biometric only mode', async () => {
      (sessionVaultService.isBiometricsAvailable as any).mockResolvedValue(
        false,
      );
      (sessionVaultService.getAuthMode as any).mockResolvedValue(
        AuthMode.BiometricOnly,
      );
      expect(await sessionVaultService.canUnlock()).toBe(false);
      (sessionVaultService.isBiometricsAvailable as any).mockResolvedValue(
        true,
      );
      expect(await sessionVaultService.canUnlock()).toBe(true);
    });
  });
});

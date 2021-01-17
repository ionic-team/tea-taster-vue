<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-text-center main-content">
      <div v-if="!canUnlock">
        <ion-list>
          <ion-item>
            <ion-label>Session Locking</ion-label>
            <ion-select v-model="authMode" data-testid="auth-mode-select">
              <ion-select-option
                v-for="authMode of authModes"
                :value="authMode.mode"
                :key="authMode.mode"
                >{{ authMode.label }}</ion-select-option
              >
            </ion-select>
          </ion-item>
        </ion-list>

        <div
          class="unlock-app"
          @click="signinClicked"
          data-testid="signin-button"
        >
          <ion-icon :icon="logInOutline"></ion-icon>
          <div>Sign In</div>
        </div>
      </div>

      <div v-else>
        <div
          class="unlock-app ion-text-center"
          @click="unlock"
          data-testid="unlock-button"
        >
          <ion-icon :icon="lockOpenOutline"></ion-icon>
          <div>Unlock</div>
        </div>

        <div
          class="unlock-app ion-text-center"
          @click="redo"
          data-testid="redo-button"
        >
          <ion-icon :icon="arrowRedoOutline"></ion-icon>
          <div>Redo Sign In</div>
        </div>
      </div>

      <div class="error-message ion-padding" data-testid="message-area">
        <div v-if="errorMessage">{{ errorMessage }}</div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  isPlatform,
} from '@ionic/vue';
import {
  arrowRedoOutline,
  lockOpenOutline,
  logInOutline,
} from 'ionicons/icons';
import { AuthMode } from '@ionic-enterprise/identity-vault';
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { sessionVaultService } from '@/services/SessionVaultService';

export default defineComponent({
  name: 'Login',
  components: {
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
  },
  setup() {
    const authMode = ref<number>();
    const authModes = ref<Array<{ mode: AuthMode; label: string }>>([
      {
        mode: AuthMode.PasscodeOnly,
        label: 'Session PIN Unlock',
      },
      {
        mode: AuthMode.SecureStorage,
        label: 'Never Lock Session',
      },
      {
        mode: AuthMode.InMemoryOnly,
        label: 'Force Login',
      },
    ]);
    sessionVaultService.isBiometricsAvailable().then(available => {
      if (available) {
        authModes.value = [
          {
            mode: AuthMode.BiometricOnly,
            label: 'Biometric Unlock',
          },
          ...authModes.value,
        ];
      }
      authMode.value = authModes.value[0].mode;
    });
    const displayAuthMode = computed(() => isPlatform('hybrid'));

    const errorMessage = ref('');

    const canUnlock = ref(false);
    sessionVaultService.canUnlock().then(x => (canUnlock.value = x));

    const signinButtonText = computed(() =>
      canUnlock.value ? 'Sign In Again' : 'Sign In',
    );

    const router = useRouter();
    const store = useStore();

    async function performSignin() {
      try {
        await store.dispatch('login', {
          authMode: authMode.value,
        });
        router.replace('/');
      } catch (err) {
        errorMessage.value = 'Invalid login. Please try again.';
      }
    }

    function redo() {
      store.dispatch('logout');
    }

    function signinClicked() {
      if (canUnlock.value) {
        canUnlock.value = false;
      } else {
        performSignin();
      }
    }

    async function unlock() {
      if (await store.dispatch('restore')) {
        router.replace('/');
      }
    }

    return {
      authModes,
      canUnlock,
      displayAuthMode,
      errorMessage,
      signinButtonText,

      authMode,

      arrowRedoOutline,
      lockOpenOutline,
      logInOutline,

      redo,
      signinClicked,
      unlock,
    };
  },
});
</script>

<style scoped>
.unlock-app {
  margin-top: 3em;
  font-size: xx-large;
}
</style>

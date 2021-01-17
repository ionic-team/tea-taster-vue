<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="main-content">
      <ion-list v-if="!canUnlock">
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input
            type="email"
            v-model.trim="v.email.$model"
            data-testid="email-input"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input
            type="password"
            v-model.trim="v.password.$model"
            data-testid="password-input"
          ></ion-input>
        </ion-item>

        <ion-item v-if="displayAuthMode">
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
        class="unlock-app ion-text-center"
        v-if="canUnlock"
        @click="unlock"
        data-testid="unlock-button"
      >
        <ion-icon :icon="lockOpenOutline"></ion-icon>
        <div>Unlock</div>
      </div>

      <div class="error-message ion-padding" data-testid="message-area">
        <div v-for="(error, idx) of v.$errors" :key="idx">
          {{ error.$property }}: {{ error.$message }}
        </div>
        <div v-if="errorMessage">{{ errorMessage }}</div>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar color="secondary">
        <ion-button
          expand="full"
          data-testid="signin-button"
          :disabled="!canUnlock && (!password || !email || v.$invalid)"
          @click="signinClicked"
        >
          {{ signinButtonText }}
          <ion-icon slot="end" :icon="logInOutline"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
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
import { lockOpenOutline, logInOutline } from 'ionicons/icons';
import { AuthMode } from '@ionic-enterprise/identity-vault';
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { email as validEmail, required } from '@vuelidate/validators';
import { useStore } from 'vuex';

import { sessionVaultService } from '@/services/SessionVaultService';

export default defineComponent({
  name: 'Login',
  components: {
    IonButton,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonInput,
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

    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const canUnlock = ref(false);
    sessionVaultService.canUnlock().then(x => (canUnlock.value = x));

    const signinButtonText = computed(() =>
      canUnlock.value ? 'Sign In Again' : 'Sign In',
    );

    const rules = {
      email: { validEmail, required },
      password: { required },
    };
    const v = useVuelidate(rules, { email, password });

    const router = useRouter();
    const store = useStore();

    async function performSignin() {
      const result = await store.dispatch('login', {
        email: email.value,
        password: password.value,
        authMode: authMode.value,
      });
      if (!result) {
        password.value = '';
        errorMessage.value = 'Invalid Email or Password. Please try again.';
      } else {
        router.replace('/');
      }
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
      email,
      password,

      lockOpenOutline,
      logInOutline,

      signinClicked,
      unlock,

      v,
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

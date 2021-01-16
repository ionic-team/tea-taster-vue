<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="main-content">
      <ion-list>
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
      </ion-list>

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
          :disabled="!password || !email || v.$invalid"
          @click="signinClicked"
        >
          Sign In
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
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { logInOutline } from 'ionicons/icons';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { email as validEmail, required } from '@vuelidate/validators';
import { useStore } from 'vuex';

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
    IonTitle,
    IonToolbar,
  },
  setup() {
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const rules = {
      email: { validEmail, required },
      password: { required },
    };
    const v = useVuelidate(rules, { email, password });

    const router = useRouter();
    const store = useStore();

    async function signinClicked() {
      const result = await store.dispatch('login', {
        email: email.value,
        password: password.value,
      });
      if (!result) {
        password.value = '';
        errorMessage.value = 'Invalid Email or Password. Please try again.';
      } else {
        router.replace('/');
      }
    }

    return { email, errorMessage, logInOutline, password, signinClicked, v };
  },
});
</script>

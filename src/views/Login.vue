<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
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
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-button
          expand="full"
          data-testid="signin-button"
          :disabled="!password || !email || v.$invalid"
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
import { useVuelidate } from '@vuelidate/core';
import { email as validEmail, required } from '@vuelidate/validators';

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

    const rules = {
      email: { validEmail, required },
      password: { required },
    };
    const v = useVuelidate(rules, { email, password });

    return { email, logInOutline, password, v };
  },
});
</script>

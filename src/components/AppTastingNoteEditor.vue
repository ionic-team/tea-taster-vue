<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
      <ion-buttons slot="primary">
        <ion-button
          id="share-button"
          data-testid="share-button"
          v-if="sharingIsAvailable"
          :disabled="!allowShare"
          @click="share()"
        >
          <ion-icon slot="icon-only" :icon="shareOutline"></ion-icon>
        </ion-button>
        <ion-button
          id="cancel-button"
          data-testid="cancel-button"
          @click="cancel()"
        >
          <ion-icon slot="icon-only" :icon="close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list>
      <ion-item>
        <ion-label position="floating">Brand</ion-label>
        <ion-input
          v-model.trim="v.brand.$model"
          data-testid="brand-input"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Name</ion-label>
        <ion-input
          v-model.trim="v.name.$model"
          data-testid="name-input"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Type</ion-label>
        <ion-select
          data-testid="tea-type-select"
          v-model.number="teaCategoryId"
        >
          <ion-select-option v-for="t of teas" :value="t.id" :key="t.id">{{
            t.name
          }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label>Rating</ion-label>
        <app-rating
          v-model.number="rating"
          data-testid="rating-input"
        ></app-rating>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Notes</ion-label>
        <ion-textarea
          data-testid="notes-textbox"
          v-model="v.notes.$model"
          rows="5"
        ></ion-textarea>
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
        data-testid="submit-button"
        :disabled="!allowSubmit"
        @click="submit"
        >{{ buttonLabel }}</ion-button
      >
    </ion-toolbar>
  </ion-footer>
</template>

<script lang="ts">
import {
  IonButtons,
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  isPlatform,
  modalController,
} from '@ionic/vue';
import { Plugins } from '@capacitor/core';
import { close, shareOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { defineComponent, computed, ref } from 'vue';

import AppRating from './AppRating.vue';

export default defineComponent({
  name: 'AppTastingNoteEditor',
  components: {
    AppRating,
    IonButtons,
    IonButton,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonTitle,
    IonToolbar,
  },
  props: {
    noteId: Number,
  },
  setup(props) {
    const brand = ref('');
    const name = ref('');
    const notes = ref('');
    const rating = ref(0);
    const teaCategoryId = ref<number>();

    const store = useStore();
    const teas = computed(() => store.state.teas.list);

    const buttonLabel = computed(() => (props.noteId ? 'Update' : 'Add'));
    const title = computed(
      () => `${props.noteId ? '' : 'Add New '}Tasting Note`,
    );

    const allowSubmit = computed(
      () =>
        !!(
          brand.value &&
          name.value &&
          notes.value &&
          rating.value &&
          teaCategoryId.value
        ),
    );

    const rules = {
      brand: { required },
      name: { required },
      notes: { required },
    };
    const v = useVuelidate(rules, { brand, name, notes });

    function cancel() {
      modalController.dismiss();
    }

    async function submit() {
      await store.dispatch('tastingNotes/save', {
        id: props.noteId,
        brand: brand.value,
        name: name.value,
        rating: rating.value,
        teaCategoryId: teaCategoryId.value,
        notes: notes.value,
      });
      modalController.dismiss();
    }

    const allowShare = computed(
      () => !!(brand.value && name.value && rating.value),
    );
    const sharingIsAvailable = computed(() => isPlatform('hybrid'));
    async function share() {
      const { Share } = Plugins;
      await Share.share({
        title: `${brand.value}: ${name.value}`,
        text: `I gave ${brand.value}: ${name.value} ${rating.value} stars on the Tea Taster app`,
        dialogTitle: 'Share your tasting note',
        url: 'https://tea-taster-training.web.app',
      });
    }

    if (props.noteId) {
      const note = store.getters['tastingNotes/find'](props.noteId);
      brand.value = note?.brand;
      name.value = note?.name;
      teaCategoryId.value = note?.teaCategoryId;
      rating.value = note?.rating;
      notes.value = note?.notes;
    }

    return {
      brand,
      name,
      notes,
      rating,
      teaCategoryId,
      v,

      teas,
      buttonLabel,
      title,

      allowSubmit,
      cancel,
      submit,

      allowShare,
      sharingIsAvailable,
      share,

      close,
      shareOutline,
    };
  },
});
</script>

<style scoped></style>

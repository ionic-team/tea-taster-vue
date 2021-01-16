<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Tasting Notes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="main-content" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tasting Notes</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list data-testid="notes-list">
        <ion-item-sliding v-for="note of tastingNotes" :key="note.id">
          <ion-item @click="presentNoteEditor($event, note.id)">
            <ion-label>
              <div>{{ note.brand }}</div>
              <div>{{ note.name }}</div>
            </ion-label>
          </ion-item>

          <ion-item-options>
            <ion-item-option color="danger" @click="deleteNote(note)">
              Delete
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="presentNoteEditor">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import { add } from 'ionicons/icons';
import { mapActions, mapState } from 'vuex';
import { defineComponent } from 'vue';

import AppTastingNoteEditor from '@/components/AppTastingNoteEditor.vue';

export default defineComponent({
  name: 'Tasting Notes',
  components: {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  computed: {
    ...mapState('tastingNotes', {
      tastingNotes: 'list',
    }),
  },
  methods: {
    ...mapActions('tastingNotes', { deleteNote: 'delete', load: 'load' }),
    async presentNoteEditor(event: Event, noteId?: number) {
      const modal = await modalController.create({
        component: AppTastingNoteEditor,
        backdropDismiss: false,
        swipeToClose: true,
        componentProps: {
          noteId,
        },
      });
      modal.present();
    },
  },
  ionViewWillEnter() {
    this.load();
  },
  setup() {
    return { add };
  },
});
</script>

<style scoped></style>

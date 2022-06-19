
<template>
  <v-container fluid class="py-0 px-2 fill-height">
    <v-card height="100%" width="100%">
      <!-- Header -->
      <v-card-title class="px-5 headline grey--text text--darken-3">
        Resultados Individuales
      </v-card-title>

      <!-------------------------------------------->
      <!----------------- Results ------------------>
      <!-------------------------------------------->
      <v-card-text>
        <!-- Display message or results here -->
      </v-card-text>
      <!-------------------------------------------->
      <!-------------- Action Buttons -------------->
      <!-------------------------------------------->
      <v-card-actions class="card-actions">
        <v-row wrap row justify="center">
          <v-col cols="12" class="py-4 text-center">
            <v-btn large
              color="success"
              class="mr-3"
              :loading="loadingBtn"
              :disabled="!dataFetched"
              @click="openPdf"
            >
              <v-icon class="mr-3">mdi-file-pdf</v-icon>
              {{ $t('Views.Evaluations.report.download_report') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <x-loading></x-loading>
    <x-alert></x-alert>
  </v-container>
</template>

<style scoped>
  .card-actions {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
</style>

<script src="./results.js"></script>

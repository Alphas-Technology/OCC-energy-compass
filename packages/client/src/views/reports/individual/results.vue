
<template>
  <v-container fluid class="py-0 px-2">
    <v-card>
      <!-- Header -->
      <v-card-title>
        Resultados Individuales
      </v-card-title>

      <!-------------------------------------------->
      <!----------------- Results ------------------>
      <!-------------------------------------------->
      <v-card-text>
        <!-- Here -->
      </v-card-text>
    </v-card>

    <!-------------------------------------------->
    <!-------------- Action Buttons -------------->
    <!-------------------------------------------->
    <v-row wrap row justify="center">
      <v-col cols="12" class="mb-12 mb-sm-0 pt-9 pb-12 pb-sm-6 text-center">
        <!--
        <v-btn large
          color="secondary lighten-3"
          class="mr-3 px-10"
        >
          Button
        </v-btn>
        -->
      </v-col>
    </v-row>

    <x-loading></x-loading>
    <x-alert></x-alert>
  </v-container>
</template>

<script src="./results.js"></script>

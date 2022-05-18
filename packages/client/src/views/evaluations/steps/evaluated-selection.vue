<template>
  <v-card flat>
    <v-row>
      <v-col cols="12" class="pa-3 headline">
        {{ $t('Views.Evaluations.stepEvaluatedSelection.title') }}
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <x-evaluated-table
          :evaluated="evaluation.evaluated"
          :identify-types="identifyTypes"
          @delete="openModal"
        ></x-evaluated-table>
      </v-col>
    </v-row>
    <v-row v-if="!isMassive">
      <v-col cols="12" align="center">
        <v-btn x-large
          outlined
          color="green"
          class="mr"
          @click="addEvaluated"
        >
          <v-icon large class="mr-2">add_circle_outline</v-icon> {{ $t('Views.Evaluations.stepEvaluatedSelection.add_evaluated') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col align="center" justify="center" cols="12">
        <v-switch
          v-model="isMassive"
          :label="$t('Views.Evaluations.stepEvaluatedSelection.want_massive')"
        ></v-switch>
      </v-col>
    </v-row>
    <template v-if="isMassive">
      <ValidationObserver v-slot="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(massiveUpload)">
          <v-row>
            <v-col align="end">
              <x-generate-instructive class="mr-2"/>
              <x-generate-template :emplooyes="evaluation.evaluated" :edit="evaluation.edit"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <x-file-upload
                class="mt-1"
                v-model="file"
                @file-picked="filePicked($event)"
                :label="$t('Views.Evaluations.stepEvaluatedSelection.select_file_to_upload')"
                reff="employees-massive-upload"
                :extensions="extensions"
                name="employees-file"
                :help="{ ...$t('help.enterprise.massive.file_input') }"
                error-messages="error"
                :rules="'ext:csv,xls,xlsx'"
              ></x-file-upload>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn
                color="primary"
                block
                large
                type="submit"
              >{{ $t('Views.Evaluations.stepEvaluatedSelection.input_upload_file') }}</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </ValidationObserver>
    </template>
    <v-row>
      <v-col cols="12" sm="6">
        <v-btn
          block
          large
          @click="changeStep(true)"
        >{{ $t(prevAction) }}</v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn
          color="primary"
          block
          large
          @click="changeStep(false)"
          :disabled="evaluation.evaluated.length < 2"
        >{{ $t(nextAction) }}</v-btn>
      </v-col>
      <v-col cols="12">
        <v-alert type="warning" dense text v-if="evaluation.evaluated.length < 2">
          {{ $t('Views.Evaluations.stepEvaluatedSelection.min_evaluated') }}
        </v-alert>
      </v-col>
    </v-row>
    <x-warnings-dialog
      :errors="evaluatedErrors"
      v-if="modalWarnings"
      @hideModalWarnings="() => this.modalWarnings = false"
    ></x-warnings-dialog>
    <x-add-evaluator-dialog
      v-if="addEvaluator"
      :employees="employees"
      :evaluation="evaluation"
      @closeDialog="addEvaluator = false"
      @pushEvaluator="pushEvaluator"
    ></x-add-evaluator-dialog>
    <x-confirmation-modal
      :show="modalDel.open"
      reversible
      :title="$t('Views.Evaluations.stepEvaluatedSelection.modal_del_title')"
      :action="deleteEvaluated"
      :btn-save="$t('Views.Evaluations.stepEvaluatedSelection.input_trash')"
      color="error"
      @close="modalDel.open = false"
    >
        <template v-slot:question>{{ $t('Views.Evaluations.stepEvaluatedSelection.modal_del_question') }}</template>
    </x-confirmation-modal>
  </v-card>
</template>

<script>
import Vue from 'vue'

import evaluationsService from '../../../services/evaluations'

import XEvaluatedTable from '../components/evaluated-table.vue'
import XWarningsDialog from '../components/warnings-dialog.vue'
import XAddEvaluatorDialog from '../components/add-evaluator-dialog.vue'
import XGenerateInstructive from '../components/generate-instructive.vue'
import XGenerateTemplate from '../components/generate-template.vue'

export default Vue.extend({
  components: {
    XEvaluatedTable,
    XWarningsDialog,
    XGenerateInstructive,
    XGenerateTemplate,
    XAddEvaluatorDialog
  },
  props: {
    evaluation: Object,
    identifyTypes: Object,
    step: String,
    nextAction: String,
    prevAction: String,
    employees: Array
  },
  data () {
    return {
      leadersAvailable: [[]],
      pairsAvailable: [[]],
      dependentsAvailable: [[]],
      file: '',
      extensions: ['.xls', '.xslx', '.csv'],
      baseEmployees: null,
      evaluated: null,
      evaluatedList: null,
      modalWarnings: false,
      modalErrors: false,
      isContinueFill: false,
      addEvaluator: false,
      isMassive: false,
      modalDel: {
        open: false,
        item: null
      },
      evaluatedErrors: {
        evaluatedNotFound: [],
        evaluatedDuplicated: []
      }
    }
  },
  created () {
    this.baseEmployees = this.employees
  },
  watch: {
    evaluatedErrors: {
      handler () {
        if (this.evaluatedErrors.evaluatedNotFound.length || this.evaluatedErrors.evaluatedDuplicated.length) {
          this.modalWarnings = true
        }
      },
      deep: true
    }
  },
  methods: {
    pushEvaluator (evaluated) {
      this.updateListFromFile(evaluated)
      this.addEvaluator = false
    },
    changeStep (isBack = false) {
      if (this.evaluation.reviewMassive && !this.isContinueFill && !isBack) {
        this.$emit('changeStep', this.evaluation, isBack ? +this.step - 1 : +this.step + 1)
      } else {
        this.$emit('changeStep', this.evaluation, isBack ? +this.step - 1 : +this.step + 1)
      }
    },
    continueFill () {
      this.isContinueFill = true
      this.changeStep(false)
    },
    backToMassive () {
      this.evaluation.evaluated = []
      this.evaluation.reviewMassive = false
    },
    deleteEvaluated () {
      const evaluatedLeft = this.evaluation.evaluated.filter((e) => e.id !== this.modalDel.item.id)
      this.evaluation.evaluated = evaluatedLeft
      return Promise.resolve()
    },
    massiveUpload () {
      this.$store.dispatch('loading/show')
      if (!this.file) {
        this.$store.dispatch('alert/error', this.$t('Views.Evaluations.stepEvaluatedSelection.incorrect_file'))
        this.$store.dispatch('loading/hide')
      } else {
        return evaluationsService.massiveUpload(this.file)
          .then((res) => {
            this.evaluatedErrors = res.errors
            this.updateListFromFile(res.evaluated)
            this.$store.dispatch('loading/hide')
            this.isMassive = false
            this.file = ''
          })
      }
    },
    updateListFromFile (resEvaluated) {
      const evaluated = this.evaluation.evaluated
      const exists = []
      resEvaluated.forEach((ev) => {
        const emp = evaluated.find((it) => ev.id === it.id)
        if (!emp) {
          evaluated.push(ev)
        } else {
          this.evaluatedErrors.evaluatedDuplicated.push(ev)
          exists.push(ev)
        }
      })
      if (exists.length) {
        this.$store.dispatch('alert/warning', this.$t('Views.Evaluations.stepEvaluatedSelection.evaluatedExists'))
      }
    },
    addEvaluated () {
      this.addEvaluator = true
    },
    filePicked (e) {
      this.file = e
    },
    openModal (index) {
      this.modalDel.item = index
      this.modalDel.open = true
    }
  }
})
</script>

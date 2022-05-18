
<template>
  <v-container fluid>
    <div>
      <v-card v-if="!completed" style="margin-bottom:10px; overflow-y-auto" id="scrolling-evaluations">
        <v-row justify="center">
          <v-col cols="12" sm="12" md="8">
            <section class="enterprise-logo">
              <img src="/img/20200301_occ_solution_logo.png" v-if="!evaluation.enterprise.logo"/>
              <img v-else :src="evaluation.enterprise.logo" alt="Enterprise Logo"/>
            </section>
          </v-col>
          <v-col cols="12" sm="8" class="text-center">
            <v-card flat>
              <h1 class="display-1">{{ evaluation.displayName || evaluation.name }}</h1>
              <p style="padding: 30px; font-weight: bold;">
                {{ $t('Views.Evaluations.evaluation.information') }}
                <v-spacer/>
                <br/>
                {{ $t('Views.Evaluations.evaluation.information_2') }}
                <br>
                <span v-for="i in 6" :key="i">
                  ({{ i }}) {{ $t(`Views.Evaluations.evaluation.score_label${i}`) }}
                  <span v-if="i !== 6">,</span>
                </span>
                <br/><br/>
                <small>{{ $t('Views.Evaluations.evaluation.information_3') }}</small>
              </p>
            </v-card>
          </v-col>
        </v-row>
        <v-row align="center" justify="center" class="text-center">
            <v-col cols="12" sm="6" v-show="showXsAutoHeader">
              <v-icon x-large color="green lighten-4">mdi-account</v-icon><br/>
              <p>{{ $t('Views.Evaluations.evaluation.columm_auto_info') }}</p>
            </v-col>
            <v-col cols="12" sm="6" v-show="showXsTeamHeader">
              <v-icon x-large color="light-blue lighten-4">mdi-account-group</v-icon><br/>
              <p>{{ $t('Views.Evaluations.evaluation.columm_team_info') }}</p>
            </v-col>
        </v-row>
        <!-- Encuesta -->
        <template v-for="(evaluation, i) in questionEvaluation">
          <v-row :key="`${i}-content`" v-show="showByXsStepD(i)">
            <v-col cols="12">
              <h4 class="text-center display-1"> {{ evaluation.name[lang] }}</h4>
            </v-col>
          </v-row>
          <template v-for="(attributes, j) in evaluation">
            <v-row v-if="answersDimention[i] && answersDimention[i][j]" align="center" justify="center" :key="`attributes-${i}-${j}`">
              <template v-for="(item, k) in attributes">
                <x-col-question v-if="j !== 'name' && k !== 'name' && (answersDimention[i] && answersDimention[i][j] && answersDimention[i][j][k])" :key="`item-${i}-${j}-${k}`"
                  :text="item.autoEvaluation[lang]"
                  :answer="answersDimention[i][j][k].auto"
                  @click="($event) => setAnswers($event, i, j, k, 'auto')"
                  v-show="showByXsStep(i, j, k, 'auto')"
                  color="green lighten-4"
                >
                </x-col-question>
                <x-col-question v-if="j !== 'name' && k !== 'name' && (answersDimention[i] && answersDimention[i][j] && answersDimention[i][j][k])" :key="`item-${i}-${j}-${k}2`"
                  :text="item.generalEvaluation[lang]"
                  :answer="answersDimention[i][j][k].team"
                  @click="($event) => setAnswers($event, i, j, k, 'team')"
                  v-show="showByXsStep(i, j, k, 'team')"
                  color="light-blue lighten-4"
                >
                </x-col-question>
              </template>
            </v-row>
          </template>
        </template>
      </v-card>
      <v-row wrap row class="mt-5" justify="center" v-if="$vuetify.breakpoint.xs">
        <v-col cols="12" class="text-center mt-4">
          <v-btn width="100%" class="mt-4" color="primary" @click="backXsView" v-show="xsStep > 1">
            {{ $t('Views.Evaluations.evaluation.input_back') }}
          </v-btn>
          <v-btn v-show="xsStep < xsMaxStep"
            width="100%"
            class="mt-4"
            color="primary"
            :disabled="xsDisableNextBtn"
            @click="nextXsView"
          >
            {{ $t('Views.Evaluations.evaluation.input_next') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row wrap row class="mt-5" justify="center">
        <v-col cols="12" sm="6" class="text-center mt-4">
          <v-btn :disabled="progress !== 100" width="100%" class="mt-4" @click="showConfirmation = true" large color="primary">{{ $t('Views.Evaluations.evaluation.input_save') }}</v-btn>
        </v-col>
      </v-row>
      <v-col>
        <v-hover v-slot="{ hover }">
          <v-fab-transition style="bottom: 10px;">
            <v-btn
              :color="colorProgress"
              dark fixed bottom right fab x-large
              @click="helpDialog = true"
            >
              <v-icon v-if="hover">mdi-information</v-icon>
              <span v-else>{{ (progress.toFixed(0)) }}%</span>
            </v-btn>
          </v-fab-transition>
        </v-hover>
      </v-col>
    </div>

    <x-wellcome-dialog
      :evaluation="evaluation"
      :start-dialog="startDialog"
      @close="() => this.startDialog = false"
    ></x-wellcome-dialog>
    <x-middle-dialog
      :middle-dialog="middleDialog"
      @close="() => this.middleDialog = false"
    ></x-middle-dialog>
    <x-help-dialog
      :help-dialog="helpDialog"
      :progress="progress"
      :progress-auto="progressAuto"
      :progress-team="progressTeam"
      :team="team"
      @close="() => this.helpDialog = false"
    ></x-help-dialog>
    <x-info-dialog :dialog="outIntervalDialog" :icon="dialogIcon" :text="dialogText"></x-info-dialog>
    <x-confirmation-modal
      :show.sync="showConfirmation"
      :title="$t('Views.Evaluations.evaluation.confirmation_modal_title')"
      :action="savePoll"
      color="success"
      @close="showConfirmation = false"
    >
      <template v-slot:question>{{ $t('Views.Evaluations.evaluation.confirmation_modal_des') }}</template>
    </x-confirmation-modal>
    <x-loading></x-loading>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import evaluationsService from '../../services/evaluations'
// import authService from '../../services/auth'

import XColQuestion from './components/col-question.vue'
import XHelpDialog from './components/help-dialog.vue'
import XMiddleDialog from './components/middle-dialog.vue'
import XWellcomeDialog from './components/wellcome-dialog.vue'

const getShowByStep = () => {
  const showByStepd = {}
  const showByStep = {}
  let step = 1
  let countAll = 0
  for (const d of ['persons', 'organization', 'results']) {
    showByStep[d] = {}
    showByStepd[d] = []
    for (const a of ['attr_1', 'attr_2', 'attr_3']) {
      showByStep[d][a] = {}
      showByStepd[d].push(step)
      showByStepd[d].push(step + 1)
      for (const b of ['behavior_01', 'behavior_02', 'behavior_03', 'behavior_04', 'behavior_05']) {
        showByStep[d][a][b] = {
          auto: step,
          team: step + 1
        }
        countAll += 2
      }
      step = step + 2
    }
  }
  return { showByStep, showByStepd, maxStep: step - 1, questionsByStep: countAll / (step - 1) }
}
const xsShowByStep = getShowByStep()

export default Vue.extend({
  components: {
    XColQuestion,
    XHelpDialog,
    XMiddleDialog,
    XWellcomeDialog
  },
  data () {
    return {
      outIntervalDialog: false,
      dialogIcon: '',
      dialogText: '',
      evaluation: {
        timeZone: '',
        enterprise: {}
      },
      questionEvaluation: {},
      answersDimention: {},
      lang: 0,
      completed: false,
      startDialog: false,
      middleDialog: false,
      helpDialog: false,
      displayedMiddleDialog: false,
      progress: 0,
      progressAuto: 0,
      progressTeam: 0,
      legendColors: ['#BB3E3E', '#B8663D', '#C2B147', '#B6C144', '#44C156', '#1B5E20'],
      showConfirmation: false,
      employeeData: null,
      team: [],
      xsStep: 1,
      xsShowByStep: xsShowByStep.showByStep,
      xsShowByStepd: xsShowByStep.showByStepd,
      xsMaxStep: xsShowByStep.maxStep,
      xsQuestionsByStep: xsShowByStep.questionsByStep,
      xsDisableNextBtn: true
    }
  },
  watch: {
    startDialog (val) {
      document.querySelector('html').style.overflow = val ? 'hidden' : null
    },
    middleDialog (val) {
      document.querySelector('html').style.overflow = val ? 'hidden' : null
    },
    outIntervalDialog (val) {
      document.querySelector('html').style.overflow = val ? 'hidden' : null
    },
    progress () {
      if (this.progress >= 50 && !this.displayedMiddleDialog && !this.startDialog) {
        this.middleDialog = this.displayedMiddleDialog = true
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.session.user
    }),
    colorProgress () {
      if (this.progress >= 0 && this.progress < 20) return '#BB3E3E'
      if (this.progress >= 20 && this.progress < 40) return '#B8663D'
      if (this.progress >= 40 && this.progress < 60) return '#C2B147'
      if (this.progress >= 60 && this.progress < 80) return '#B6C144'
      if (this.progress >= 80 && this.progress < 99) return '#44C156'
      return '#1B5E20'
    },
    showXsAutoHeader () {
      return !this.$vuetify.breakpoint.xs || (this.xsStep % 2 === 1)
    },
    showXsTeamHeader () {
      return !this.$vuetify.breakpoint.xs || (this.xsStep % 2 === 0)
    }
  },
  created () {
    this.lang = this.user ? (this.user.lang || 'es') : 'es'
    this.getEvaluation()
  },
  methods: {
    async setAnswers (scoreValue, dimention, attribute, behavior, scoreKey) {
      if (!this.answersDimention[dimention]) {
        return
      } else if (!this.answersDimention[dimention][attribute]) {
        return
      } else if (!this.answersDimention[dimention][attribute][behavior]) {
        return
      }
      this.$store.dispatch('loading/show')
      await evaluationsService.updateAnswersDimention(
        this.$route.params.tokenId, dimention, attribute, behavior, scoreKey, scoreValue
      )
        .then((res) => {
          if (res.success) {
            this.answersDimention[dimention][attribute][behavior][scoreKey] = scoreValue
            this.setProgress()
          }
        })
        .finally(() => {
          setTimeout(() => this.$store.dispatch('loading/hide'), 400)
        })
    },
    setProgress () {
      let questionCount = 0
      let counterAnsweredQuestionsAuto = 0
      let counterAnsweredQuestionsTeam = 0

      for (const dimention in this.answersDimention) {
        if (Object.prototype.hasOwnProperty.call(this.answersDimention, dimention)) {
          const attributes = this.answersDimention[dimention]
          for (const behaviors in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, behaviors)) {
              const questions = attributes[behaviors]
              for (const question in questions) {
                if (Object.prototype.hasOwnProperty.call(questions, question)) {
                  const element = questions[question]
                  questionCount++
                  if (element.auto >= 1 && element.auto <= 6) counterAnsweredQuestionsAuto++
                  if (element.team >= 1 && element.team <= 6) counterAnsweredQuestionsTeam++
                }
              }
            }
          }
        }
      }

      if (counterAnsweredQuestionsAuto + counterAnsweredQuestionsTeam >= this.xsStep * this.xsQuestionsByStep) {
        this.xsDisableNextBtn = false
      } else {
        this.xsDisableNextBtn = true
      }

      this.progressAuto = (counterAnsweredQuestionsAuto / questionCount) * 100
      this.progressTeam = (counterAnsweredQuestionsTeam / questionCount) * 100
      this.progress = ((counterAnsweredQuestionsAuto + counterAnsweredQuestionsTeam) / (questionCount * 2)) * 100
    },
    getEvaluation () {
      this.$store.dispatch('loading/show')
      return evaluationsService.findByTokenId(this.$route.params.tokenId)
        .then((res) => {
          if (res.executed) {
            if (res.data.status === 'completed') {
              this.completed = true
              this.$store.dispatch('loading/hide')
              this.showDialog('/img/expiracion.png', this.$i18n.t('Views.Evaluations.evaluation.expiration_date'))
            } else {
              this.evaluation = res.data
              const releasedAtParsed = Date.parse(res.data.deliveredAt.split('Z')[0]) / 1000
              const deadLineAtParsed = Date.parse(res.data.validUntil.split('Z')[0]) / 1000
              if (releasedAtParsed > parseInt(Date.now() / 1000)) {
                this.showDialog('/img/reloj.png', this.$i18n.t('Views.Evaluations.evaluation.before_date'))
              } else if (deadLineAtParsed < parseInt(Date.now() / 1000)) {
                this.showDialog('/img/expiracion.png', this.$i18n.t('Views.Evaluations.evaluation.expiration_date'))
              } else if (res.data.status === 'pending') {
                this.showDialog('/img/reloj.png', this.$i18n.t('Views.Evaluations.evaluation.not_available'))
              } else {
                if (res.evaluated.status === 'completed') {
                  this.completed = true
                  this.$store.dispatch('loading/hide')
                  this.showDialog('/img/expiracion.png', this.$i18n.t('Views.Evaluations.evaluation.evaluation_completed'))
                } else {
                  this.team = res.team
                  this.getRelation(res.evaluated)
                  this.startDialog = true
                }
              }
            }
          } else {
            this.$store.dispatch('loading/hide')
            this.showDialog('/img/alerta.png', this.$i18n.t('Views.Evaluations.evaluation.invalid_token'))
          }
        }).catch((err) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
          this.$store.dispatch('loading/hide')
        })
    },
    getRelation (evaluated) {
      this.questionEvaluation = this.evaluation.questionnaire.evaluations
      if (!evaluated.answersDimention) {
        this.initAnswersDimention()
      } else {
        this.answersDimention = evaluated.answersDimention
        this.setProgress()
      }
      this.$store.dispatch('loading/hide')
    },
    initAnswersDimention () {
      const tempAnswersDimention = {}
      for (const dimentions in this.questionEvaluation) {
        tempAnswersDimention[dimentions] = {}
        for (const attr in this.questionEvaluation[dimentions]) {
          if (attr === 'name') {
            continue
          }
          tempAnswersDimention[dimentions][attr] = {}
          for (const behavior in this.questionEvaluation[dimentions][attr]) {
            if (behavior === 'name') {
              continue
            }
            tempAnswersDimention[dimentions][attr][behavior] = { auto: 0, team: 0 }
          }
        }
      }
      this.answersDimention = tempAnswersDimention
      evaluationsService.setAnswersDimention(this.$route.params.tokenId, tempAnswersDimention)
    },
    showDialog (icon, text) {
      this.outIntervalDialog = true
      this.dialogIcon = icon
      this.dialogText = text
    },
    savePoll () {
      return this.progress === 100 ? evaluationsService.updateEvaluator(this.$route.params.tokenId, this.answersDimention)
        .then(() => {
          this.$store.dispatch('loading/hide')
          this.showDialog('/img/actual-culture-img3.png', this.$i18n.t('Views.Evaluations.evaluation.end'))
        }).catch((err) => {
          this.$store.dispatch('loading/hide')
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        }) : Promise.resolve(false)
    },
    backXsView () {
      this.xsStep--
      this.setProgress()
    },
    nextXsView () {
      this.xsStep++
      this.setProgress()
    },
    showByXsStepD (dimention) {
      return !this.$vuetify.breakpoint.xs || (this.xsShowByStepd[dimention].indexOf(this.xsStep) !== -1)
    },
    showByXsStep (dimention, attribute, behavior, scoreKey) {
      return !this.$vuetify.breakpoint.xs || (this.xsStep === this.xsShowByStep[dimention][attribute][behavior][scoreKey])
    }
  }
})
</script>
<style scoped>
  .v-slider__tick--filled {
    background-color: none;
  }
</style>

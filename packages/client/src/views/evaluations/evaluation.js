
import Vue from 'vue'
import { mapState } from 'vuex'

import evaluationsService from '../../services/evaluations'

import XColQuestion from './components/col-question.vue'
import XHelpDialog from './components/help-dialog.vue'
import XMiddleDialog from './components/middle-dialog.vue'
import XWellcomeDialog from './components/wellcome-dialog.vue'

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
      lang: 0,
      completed: false,
      startDialog: false,
      middleDialog: false,
      helpDialog: false,
      displayedMiddleDialog: false,
      progress: 0,
      legendColors: ['#BB3E3E', '#B8663D', '#C2B147', '#B6C144', '#44C156', '#1B5E20'],
      showConfirmation: false
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
    }
  },
  created () {
    this.lang = this.user ? (this.user.lang || 'es') : 'es'
    this.getEvaluation()
  },
  methods: {
    setProgress () {
      //
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
                  this.showDialog('/img/expiracion.png', this.$i18n.t('Views.Evaluations.evaluation.evaluation_completed'))
                } else {
                  if (!res.evaluated.sensitiveDataTreatmentPolicyAccepted || !res.evaluated.sensitiveDataTreatmentPolicyAccepted.accepted) {
                    this.startDialog = true
                  }
                }
                this.$store.dispatch('loading/hide')
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
    showDialog (icon, text) {
      this.outIntervalDialog = true
      this.dialogIcon = icon
      this.dialogText = text
    }
  }
})

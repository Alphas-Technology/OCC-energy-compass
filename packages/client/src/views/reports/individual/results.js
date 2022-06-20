
import evaluationsService from '../../../services/evaluations'
import authService from '../../../services/auth'

import Vue from 'vue'
import is from 'is_js'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'

import initial from './mixins/00-initial'
import cover from './mixins/01-cover'
import index from './mixins/02-index'
import intro from './mixins/03-intro'
import methodology from './mixins/04-methodology'

pdfMake.vfs = pdfFonts.pdfMake.vfs

export default Vue.extend({
  components: {
    //
  },
  mixins: [
    initial,
    cover,
    index,
    intro,
    methodology
  ],
  data () {
    return {
      lang: 'es',
      loadingBtn: false,
      dataFetched: false,
      downloadPdf: true,
      identifyTypes: {},
      evaluation: {},
      evaluated: {}
    }
  },
  watch: {
    //
  },
  computed: {
    //
  },
  created () {
    this.getEvaluation()
  },
  methods: {
    getEvaluation () {
      this.$store.dispatch('loading/show')
      evaluationsService.findByTokenId(this.$route.params.tokenId)
        .then((res) => {
          this.evaluation = res.data
          this.evaluated = res.evaluated
          if (this.evaluated.status !== 'completed') {
            throw new TypeError('demographic_report/004')
          }
          console.log('Questionnaire Answers', this.evaluated.temp.evaluations)
          console.log('Indices Answers', this.evaluated.temp.indices)
          console.log('additionalQuestions Answers', this.evaluated.temp.additional)
          this.getIdentifyTypes()
        })
        .catch((err) => {
          err.message
            ? this.$store.dispatch('alert/error', this.$t(`errors.${err.message}`))
            : this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
        .finally(() => {
          this.$store.dispatch('loading/hide')
        })
    },
    getIdentifyTypes () {
      authService.identifyTypes()
        .then(res => {
          res.items.forEach(et => {
            this.identifyTypes[et.id] = this.getIdentifyTypesInitials(et.translate.label) + ' - '
          })
          this.dataFetched = true
        })
    },
    getIdentifyTypesInitials (text) {
      return text.trim().split(' ').map(t => t.slice(0, 1)).join('').toUpperCase()
    },
    async openPdf () {
      this.$store.dispatch('loading/show')
      this.loadingBtn = true
      await this.renderPdf()
    },
    async renderPdf () {
      const configuration = await this.$getConfiguration()
      if (this.downloadPdf) {
        if (is.edge() || is.ie()) {
          const pdfDocGenerator = pdfMake.createPdf(configuration)
          pdfDocGenerator.getBlob((blob) => {
            window.navigator.msSaveBlob(blob, `${this.evaluation.name}.pdf`)
            this.closeRenderPdf()
          })
        } else {
          pdfMake.createPdf(configuration).download(`${this.evaluation.name}.pdf`, () => {
            this.closeRenderPdf()
          })
        }
      }
    },
    closeRenderPdf () {
      this.$store.dispatch('loading/hide')
      this.loadingBtn = false
    },
    getDateString () {
      const today = new Date()
      const monthName = this.$t(`Views.Evaluations.report.months.${[today.getMonth()]}`)
      return `${monthName} - ${today.getFullYear()}`
    }
  }
})


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
import model from './mixins/05-model'
import highScores from './mixins/highestAndLowerScores'
import bornoutIndex from './mixins/13-burnoutIndex'

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
    methodology,
    model,
    highScores,
    bornoutIndex
  ],
  data () {
    return {
      lang: 'es',
      loadingBtn: false,
      dataFetched: false,
      downloadPdf: true,
      identifyTypes: {},
      evaluation: {},
      evaluated: {},
      highestScores: [],
      lowerScores: [],
      burnoutAverages: {},
      heatMap: [
        '#f85d19',
        '#f99c16',
        '#fcec14',
        '#b7d600',
        '#1bd800'
      ],
      colors: {
        physical: '#51c7af',
        mental: '#7d838d',
        emotional: '#ec604d',
        professional: '#1999da'
      }
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
          this.getHighAndLowerScores()
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
    },
    getHighAndLowerScores () {
      const { questionnaire: { evaluations }, questionsIndex } = this.evaluation
      const { temp: { evaluations: evaluatedEvaluations, indices } } = this.evaluated
      const scores = []
      const burnoutIndexes = {
        individual: [],
        organizational: []
      }
      let dimensionCount = 0
      for (const [dimensionKey, dimensionVar] of Object.entries(evaluations)) {
        let questionCount = 0
        for (const [varKey, varValues] of Object.entries(dimensionVar)) {
          for (const questionKey of Object.keys(varValues)) {
            const score = evaluatedEvaluations[dimensionCount].variable[questionCount].score
            if (varValues[questionKey].index.includes('burnoutIndividual')) {
              burnoutIndexes.individual.push(score)
            }
            scores.push({
              type: 'evaluation',
              dimension: dimensionKey,
              variable: varKey,
              reference: varValues[questionKey].reference[this.lang],
              score
            })
            questionCount++
          }
        }
        dimensionCount++
      }

      questionsIndex.forEach(qi => {
        const item = indices.find(index => index.idx === qi.idx)
        const score = item.answer

        if (qi.index.includes('burnoutIndividual')) {
          burnoutIndexes.individual.push(score)
        }

        if (qi.index.includes('burnoutOrganizational')) {
          burnoutIndexes.organizational.push(score)
        }

        scores.push({
          type: 'index',
          index: qi.index[0],
          ref: qi.reference[this.lang],
          idx: item.idx,
          score
        })
      })

      this.burnoutAverages.individual = burnoutIndexes.individual.reduce((a, b) => a + b, 0) / burnoutIndexes.individual.length
      this.burnoutAverages.organizational = burnoutIndexes.organizational.reduce((a, b) => a + b, 0) / burnoutIndexes.organizational.length

      this.highestScores = scores.sort((a, b) => b.score - a.score).slice(0, 6)
      this.lowerScores = scores.sort((a, b) => a.score - b.score).slice(0, 6)
    },
    getHeatMap (s) {
      if (!s) {
        return '#FFFFFF'
      } else if (s >= 1 && s < 2) {
        return this.heatMap[0]
      } else if (s >= 2 && s < 3) {
        return this.heatMap[1]
      } else if (s >= 3 && s < 4) {
        return this.heatMap[2]
      } else if (s >= 4 && s < 4.5) {
        return this.heatMap[3]
      } else if (s >= 4.5) {
        return this.heatMap[4]
      }
    }
  }
})

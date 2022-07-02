
import pdfUtils from '../../utils/pdf'

import dimResultsBase64 from '../../base64Files/individual/dimension-results'

export default {
  methods: {
    truncateReference (str, limit = 24) {
      return str.length > limit ? str.slice(0, limit) + '...' : str
    },
    $generateDimensionsResults () {
      const rows = []
      const evaluations = this.evaluation.questionnaire.evaluations
      const answers = this.evaluated.temp.evaluations

      let dimCnt = 0
      for (const dimKey of Object.keys(evaluations)) {
        let varCnt = 0
        for (const varKey of Object.keys(evaluations[dimKey])) {
          const questionQty = Object.keys(evaluations[dimKey][varKey]).length
          const varAnswers = answers[dimCnt].variable.slice(varCnt, varCnt + questionQty)
          const sum = varAnswers.reduce((a, b) => a + b.score, 0)
          const score = sum / questionQty

          varCnt += questionQty

          const variable = this.$t(`Views.Questionnaires.edit.v_${varKey}`)

          rows.push([
            {
              text: this.truncateReference(variable),
              margin: [4, 11, 0, 7],
              fontSize: 7,
              color: '#666666',
              characterSpacing: 0.4
            },
            {
              text: ' '
            },
            pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), 1.4),
            // Score Bars
            pdfUtils.generateIndividualScoreBar(score, 11)
          ])
        }
        // Dimension spacer
        rows.push([
          {
            text: '', colSpan: 4, margin: [0, 4]
          }
        ])
        dimCnt++
      }

      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.dimensions_variables_scores')),
        // base64 image
        {
          image: dimResultsBase64,
          fit: [730, 760],
          margin: [0, 30, 0, 0],
          alignment: 'center'
        },
        // Table
        {
          absolutePosition: { x: 244, y: 95 },
          table: {
            widths: ['20%', '0.9%', '6%', '68.2%'],
            body: [
              // Headers
              [
                {
                  text: ' ',
                  margin: [0, 0, 0, -2]
                },
                {
                  text: ' ',
                  margin: [0, 0, 0, -2]
                },
                {
                  text: this.$t('Views.Evaluations.report.current'),
                  margin: [0, 4, 0, -2],
                  fontSize: 7,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: ' ',
                  margin: [0, 0, 0, -2]
                }
              ],
              // Variables rows
              ...rows
            ]
          },
          layout: {
            hLineWidth: () => {
              return 0
            },
            vLineWidth: () => {
              return 0
            }
          }
        }
      ]
    }
  }
}

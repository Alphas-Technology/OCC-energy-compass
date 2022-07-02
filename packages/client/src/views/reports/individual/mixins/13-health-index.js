
import pdfUtils from '../../utils/pdf'

import healthIndexBase64 from '../../base64Files/individual/health-index'

export default {
  methods: {
    $generateHealthIndex () {
      const rows = []
      // const indexAnswers = ?
      const healthIndexQuestions = this.evaluation.questionsIndex.filter(x => {
        return x.index.includes('generalHealth')
      })

      // Add the questionnaire question, belonging to the health index
      healthIndexQuestions.unshift({
        idx: null,
        reference: this.healthIndexQ1
      })

      healthIndexQuestions.forEach(q => {
        let score
        if (q.idx === null) {
          score = this.healthIndexQ1Score
        } else {
          score = this.evaluated.temp.indices.find(x => x.idx === q.idx).answer
        }

        rows.push([
          {
            text: this.truncateReference(q.reference[this.lang]),
            margin: [2, 7.6, 0, -5],
            fontSize: 7,
            color: '#666666',
            characterSpacing: 0.4
          },
          {
            text: ' '
          },
          pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), -4.9),
          // Score Bars
          pdfUtils.generateIndividualScoreBar(score, 7.7)
        ])
      })

      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.health_index')),
        // base64 image
        {
          image: healthIndexBase64,
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
              // rows
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

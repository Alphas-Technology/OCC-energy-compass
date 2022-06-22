
import pdfUtils from '../../utils/pdf'

import ScoreRectBase64 from '../../base64Files/score-rect'

export default {
  methods: {
    $generateGeneralScores () {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.general_scores')),
        // Example
        {
          image: ScoreRectBase64,
          width: 752,
          height: 84,
          margin: [20, 23, -12, 0],
          alignment: 'center'
        },
        {
          absolutePosition: { x: 68, y: 74 },
          table: {
            widths: ['60%', '14%', '13%', '13%'],
            body: [
              [
                {
                  text: '',
                  border: [false]
                },
                {
                  text: this.$t('Views.Evaluations.report.current'),
                  margin: [0, 14, 0, 0],
                  fontSize: 11,
                  alignment: 'center',
                  bold: true,
                  border: [false]
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.prev_score'),
                  margin: [0, 14, 0, 0],
                  fontSize: 11,
                  alignment: 'center',
                  bold: true,
                  border: [false]
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.trend'),
                  margin: [0, 14, 0, 0],
                  fontSize: 11,
                  alignment: 'center',
                  bold: true,
                  border: [false]
                }
              ],
              [
                {
                  text: this.$t('Views.Evaluations.report.gral_score'),
                  margin: [20, 13, 0, -3],
                  fontSize: 18,
                  color: '#666666',
                  characterSpacing: 0.4,
                  border: [false]
                },
                {
                  text: this.round(this.gralScore, 2),
                  margin: [0, 11, 0, -1],
                  fontSize: 21,
                  alignment: 'center',
                  bold: true,
                  color: '#444444',
                  characterSpacing: 0.2,
                  border: [false, false, false, true],
                  borderColor: ['#000000', '#000000', '#000000', this.getHeatMap(this.gralScore)]
                },
                {
                  text: !this.hasPrevious ? '--' : this.round(this.gralPrevScore),
                  margin: [0, 11, 0, -1],
                  fontSize: 21,
                  alignment: 'center',
                  bold: true,
                  color: '#444444',
                  characterSpacing: 0.2,
                  border: [false, false, false, true],
                  borderColor: ['#000000', '#000000', '#000000', this.getHeatMap(this.gralPrevScore)]
                },
                {
                  text: !this.hasPrevious ? '--' : this.round(this.gralScore - this.gralPrevScore),
                  margin: [0, 11, 0, -1],
                  fontSize: 21,
                  alignment: 'center',
                  bold: true,
                  color: '#444444',
                  characterSpacing: 0.2,
                  border: [false]
                }
              ]
            ]
          },
          layout: {
            hLineWidth: (i, node) => {
              return (i === node.table.body.length) ? 9 : 0.1
            }
          }
        }
      ]
    }
  }
}

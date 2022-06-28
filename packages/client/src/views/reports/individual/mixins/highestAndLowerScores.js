
import pdfUtils from '../../utils/pdf'
import ScoreRectBase64 from '../../base64Files/score-rect'

export default {
  methods: {
    getScoresData (scoresData) {
      let count = 1
      return scoresData.map((hc, index) => {
        const data = [
          {
            image: ScoreRectBase64,
            width: 752,
            height: 84,
            margin: [20, index > 0 ? 10 : 23, -12, 0],
            alignment: 'center'
          },
          {
            margin: [25, -92, 4, 0],
            table: {
              widths: ['12%', '*', '10%'],
              body: [
                [
                  {
                    text: hc.type === 'evaluation' ? this.$t(`Views.Questionnaires.edit.d_${hc.dimension}`) : hc.index,
                    margin: [20, 39, 0, -3],
                    fontSize: 12,
                    bold: true,
                    color: this.colors[hc.dimension] || '#51c7af',
                    border: [false]
                  },
                  {
                    text: hc.type === 'evaluation' ? hc.reference : hc.index,
                    margin: [20, 35, 0, -3],
                    fontSize: 18,
                    color: '#666666',
                    characterSpacing: 0.4,
                    border: [false]
                  },
                  {
                    text: hc.score,
                    margin: [0, 33, 0, -1],
                    fontSize: 21,
                    alignment: 'center',
                    bold: true,
                    color: '#444444',
                    characterSpacing: 0.5,
                    lineHeight: 1.20,
                    border: [false, false, false, true],
                    borderColor: ['#000000', '#000000', '#000000', this.getHeatMap(hc.score)]
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
        count++
        return data
      })
    },
    $generateScores (scoresData, title) {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t(`Views.Evaluations.report.toc.${title}`)),
        {
          margin: [40, 10, 10, -35],
          table: {
            widths: ['10%', '*', '10%'],
            body: [
              [
                {
                  text: 'Dimension',
                  bold: true,
                  border: [false],
                  alignment: 'center'
                },
                {
                  text: '',
                  border: [false]
                },
                {
                  text: 'Actual',
                  bold: true,
                  border: [false],
                  alignment: 'center'
                }
              ]
            ]
          }
        },
        ...this.getScoresData(scoresData)
      ]
    }
  }
}

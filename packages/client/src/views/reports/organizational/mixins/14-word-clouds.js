
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    $generateWordClouds () {
      const pages = []

      let cnt = 0
      for (const key of Object.keys(this.wordsCloud)) {
        const foundOpenQ = this.evaluationData.openQuestions.find(x => x.name === key)
        const qText = foundOpenQ.question[this.user.lang]

        pages.push(
          // Page Title
          pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.word_clouds'), !cnt),
          {
            text: qText,
            alignment: 'center',
            margin: [0, 20, 0, 0],
            fontSize: 14
          }
        )
        cnt++
      }

      return pages
    }
  }
}


import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    $generateModelDescription () {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.model')),
        {
          text: ''
        }
      ]
    }
  }
}

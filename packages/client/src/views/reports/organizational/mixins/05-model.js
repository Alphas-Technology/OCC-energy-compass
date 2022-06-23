
import pdfUtils from '../../utils/pdf'

import ModelBase64 from '../../base64Files/model'

export default {
  methods: {
    $generateModelDescription () {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.model')),
        {
          image: ModelBase64,
          fit: [730, 760],
          margin: [0, 40, 0, 0],
          alignment: 'center'
        }
      ]
    }
  }
}

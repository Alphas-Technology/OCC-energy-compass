
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    $generateTableOfContents () {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.index')),
        // Table of Contents
        {
          toc: {
            id: 'mainToc',
            toc: {
              id: 'subToc'
            }
          },
          color: '#6d7a7a',
          fontSize: 13,
          margin: [15, 0, 65, 0],
          maxHeight: 0,
          lineHeight: 0.7
        }
      ]
    }
  }
}

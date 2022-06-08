
<template>
  <div>
    <v-btn large
      :disabled="thread.status !== 'completed'"
      :loading="lockPdfButton"
      color="success"
      class="mt-3"
      @click="openPdf"
    >
      <v-icon class="mr-3">mdi-file-pdf</v-icon>
      <span v-if="thread.status === 'pending'">
        {{ $t('Views.Evaluations.report.generating_report') }}
      </span>
      <span v-else-if="thread.status === 'in_action' || thread.status === 'in_progress'">
        {{`
          ${$t('Views.Evaluations.report.generating_report')}
          ${thread.data.progress}%
        `}}
      </span>
      <span v-else-if="thread.status === 'failed'">
        {{ $t('Views.Evaluations.report.failed_generation') }}
      </span>
      <span v-else>
        {{ $t('Views.Evaluations.report.download_report') }}
      </span>
    </v-btn>

    <!-- Energy Compass page Header Logo -->
    <img
      src="/img/20220531_occ_energy_logo.png"
      style="visibility:hidden;"
      id="occEnergyCover"
      alt="hidden"
      width="0"
      height="0"
    />
    <!-- Empty img container to load Enterprise Logo if any -->
    <img
      v-if="enterpriseLogo"
      :src="enterpriseLogo"
      id="dynamicEnterpriseLogo"
      class="d-none"
    />
  </div>
</template>

<script>

import { mapState } from 'vuex'
import is from 'is_js'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'

// import initial from './mixins/00-initial'
// import cover from './mixins/01-cover'
// import index from './mixins/02-index'
// import scores from './mixins/03-scores'
// import dimResults from './mixins/04-dim-results'
// import varResults from './mixins/05-var-results'

pdfMake.vfs = pdfFonts.pdfMake.vfs

export default {
  name: 'thread-organizational-report-exec',
  mixins: [
    // initial,
    // cover,
    // index,
    // scores,
    // dimResults,
    // varResults,
  ],
  props: {
    pollId: String,
    thread: Object
  },
  data () {
    return {
      downloadPdf: true,
      energyCoverSrc: null,
      enterpriseLogo: null,
      lockPdfButton: false,
      evaluation: {},
      questionnaire: {},
      answersResponsibility: {},
      completedPolls: 0,
      expectedPolls: 0
    }
  },
  mounted () {
    this.energyCoverSrc = document.getElementById('occEnergyCover').src
  },
  watch: {
    energyCoverSrc (val) {
      if (val) {
        this.toDataURL(this.energyCoverSrc, (dataURL) => {
          this.cultureCoverBase64 = dataURL
        })
      }
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  methods: {
    async openPdf () {
      this.$store.dispatch('loading/show')
      this.lockPdfButton = true
      await this.$getInitialData()
      await this.renderPdf()
    },
    async renderPdf () {
      this.$emit('render-pdf')
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
      this.lockPdfButton = false
      this.$emit('pdfRenderedOrg')
    },
    toDataURL (url, callback) {
      const xhr = new XMLHttpRequest()
      xhr.open('get', url)
      xhr.responseType = 'blob'

      xhr.onload = function () {
        const fr = new FileReader()

        fr.onload = function () {
          callback(this.result)
        }

        fr.readAsDataURL(xhr.response)
      }

      xhr.send()
    },
    round (value, decimals) {
      if (isNaN(Number(value))) {
        return '--'
      }
      if ((value * 100) < 1 && (value * 100) > -1) {
        value = 0
      }
      return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals)
    }
  }
}
</script>

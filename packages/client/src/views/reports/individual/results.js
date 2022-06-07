
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  components: {
    //
  },
  data () {
    return {
      //
    }
  },
  watch: {
    //
  },
  computed: {
    ...mapState({
      user: state => state.session.user
    })
  },
  created () {
    //
  },
  methods: {
    //
  }
})


<template>
  <v-app>
    <x-navigation ref="navigation"></x-navigation>

    <v-app-bar
      color="#3899da"
      dark
      style="border-bottom:1px solid rgba(0,0,0,.12) !important;"
      app
      fixed
      clipped-left
      text
    >
      <v-app-bar-nav-icon @click.stop="toggleNavigation" text></v-app-bar-nav-icon>

      <img src="/img/20200301_occ_solution_logo_only.png" style="height: 80%;" class="pl-2" alt="OCC - Solutions logo"/>

      <v-spacer></v-spacer>
      <div class="text-center">
        <v-menu
          :nudge-width="296"
          :nudge-bottom="35"
          :nudge-left="160"
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              text
              v-on="on"
            >
              <v-icon large>mdi-apps</v-icon>
            </v-btn>
          </template>
          <v-card style="max-width: 22.7em">
            <v-row>
              <template v-for="item in products">
                <v-col cols="6" :key="item.name" style="cursor: pointer">
                  <a :href="item.url">
                    <img :src="item.logo || item.defaultLogo"
                      alt="System Logo"
                      style="max-width: 150px"
                    />
                  </a>
                </v-col>
              </template>
            </v-row>
          </v-card>
        </v-menu>

        <v-tooltip left v-if="user.role === 'customer'">
          <template v-slot:activator="{ on }">
            <v-btn href="https://occ-solutions.com/ayuda/" class="elevation-0" text fab  target="_blank" v-on="on">
              <v-icon>mdi-help-circle</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('Views.AppLayout.app_bar_text_manual') }}</span>
        </v-tooltip>
        <!--
        <v-menu offset-y v-if="notifications && notifications.unread_number !== undefined">
          <template v-slot:activator="{ on }">
            <v-badge right color="red">
              <template v-slot:badge v-if="notifications.unread_number > 0">
                <span v-if="notifications.unread_number < 100">{{notifications.unread_number}}</span>
                <span v-else>+99</span>
              </template>
            </v-badge>
            <v-btn class="elevation-0" text fab v-on="on">
              <v-icon>notifications</v-icon>
            </v-btn>
          </template>
          <v-list style="max-width: 28em">
            <v-list-item
              v-for="(notification, index) in notifications.last_notifications"
              :key="index"
              :class="!notification.read ? 'unread' : ''"
            >
              <template v-if="user.role === 'admin'">
                <v-list-item-title @click="readNotification(notification)" v-if="notification.sourceType === 'enterprise_plan'">
                  <router-link
                    :to="notification.action"
                    class="no-decoration"
                    :class="!notification.read ? 'font-unread' : 'read'"
                  >
                    {{ $t(`notifications.${notification.type}`, {enterprise: notification.source.name}) }}
                  </router-link>
                </v-list-item-title>
                <v-list-item-title @click="readNotification(notification)" v-else>
                  <router-link
                    :to="notification.action"
                    class="no-decoration"
                    :class="!notification.read ? 'font-unread' : 'read'"
                  >
                    {{ $t(`notifications.${notification.type}`, {enterprise: notification.source.enterprise.name, poll: notification.source.name}) }}
                  </router-link>
                </v-list-item-title>
              </template>
              <template v-else>
                <v-list-item-title @click="readNotification(notification)">
                  <router-link
                    :to="notification.action"
                    class="no-decoration"
                    :class="!notification.read ? 'font-unread' : 'read'"
                  >
                    {{ $t(`notifications.${notification.type}`) }}
                  </router-link>
                </v-list-item-title>
              </template>
            </v-list-item>
            <v-list-item class="see-more-btn" @click="$router.push('/notifications')">
              <v-list-item-title class="seemore">
                <router-link
                  to="/notifications"
                  class="no-decoration"
                >
                  {{$t('notifications.see_more')}}
                </router-link>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        -->
      </div>

      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="elevation-0" fab color="white">
            <span class="headline primary--text">{{ user.email | initials }}</span>
          </v-btn>
        </template>
        <v-card>
          <v-divider></v-divider>
          <v-list dense>
            <template v-if="user.role !== 'employee'">
              <v-list-item>
                <v-row>
                  <v-col md="3">
                    <div style="background-color: #3899da; width: 52px; height: 52px; padding-left: 2px; padding-top: 2px; border-radius: 50%">
                      <v-avatar color="white" size="48">
                        <span class="headline">{{ user.email | initials }}</span>
                      </v-avatar>
                    </div>
                  </v-col>
                  <v-col md="9">
                    <p>
                      <span class="text-capitalize">
                        {{ user.role === 'customer' ? user.customer.name : $t('Views.AppLayout.app_bar_text_admin') }}
                      </span><br>
                      <span style="font-size: .9em">{{user.email}}</span>
                    </p>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item class="text-center" @click="goProfile" v-if="user.role === 'customer' && user.customer.type === 'commercial'">
                <v-list-item-title>
                  <v-icon small>fa-eye</v-icon>
                  {{ $t('Views.AppLayout.app_bar_action_view_profile') }}
                </v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item @click="confirmLogout = true" class="text-center">
              <v-list-item-title style="color: #3899dac7">
                <v-icon color="#3899dac7" small>mdi-logout-variant</v-icon>
                {{ $t('Views.AppLayout.app_bar_action_logout') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container fluid fill-height :class="{'pa-0': $vuetify.breakpoint.xs}">
        <v-layout :class="{'pa-0': $vuetify.breakpoint.xs}" justify-center>
          <router-view />
        </v-layout>
      </v-container>
    </v-main>

    <v-footer style="border-top:1px solid rgba(0,0,0,.12) !important;" color="white" app inset>
      <span class="black--text">&nbsp;&nbsp;{{ $t('Views.AppLayout.footer_copyright') }}.</span>
    </v-footer>
    <v-dialog v-model="showSnackbarDialog" width="40em">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ $t('Views.AppLayout.session_as_dialog_title') }}
        </v-card-title>
        <v-card-text>{{ $t(`Views.AppLayout.${snackMsg}`) }}</v-card-text>
        <v-divider></v-divider>
        <v-card-actions style="flex-wrap: wrap">
          <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
          <template v-if="doubleOrigin">
            <v-btn color="#eb604c" text :href="`${this.suiteWeb}/wp/cfs/customer`">
              <strong>{{ $t('Views.AppLayout.session_as_dialog_action_close_session_as_customer') }}</strong>
            </v-btn>
            <v-btn class="ml-0" color="#eb604c" text :href="`${this.suiteWeb}/wp/cfs/enterprise`">
              <strong>{{ $t('Views.AppLayout.session_as_dialog_action_close_session_as_enterprise') }}</strong>
            </v-btn>
          </template>
          <v-btn v-else color="#eb604c" text :href="`${this.suiteWeb}/wp/cfs`">
            <strong>{{ $t('Views.AppLayout.session_as_dialog_action_close_session') }}</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      v-if="showSnackbar"
      color="#424242"
      dark fixed bottom right fab
      @click="showSnackbarDialog = true"
      class="mb-10 mr-3"
    >
      <v-icon>mdi-logout</v-icon>
    </v-btn>
    <x-alert></x-alert>
    <x-help-modal></x-help-modal>
    <x-loading></x-loading>
    <!-- Logout Confirmation -->
    <x-confirm-logout
      :show.sync="confirmLogout"
      @close="confirmLogout = false"
    ></x-confirm-logout>
  </v-app>
</template>

<script>

import { mapState } from 'vuex'

import ProductsService from '../services/products'

export default {
  data () {
    return {
      confirmLogout: false,
      menu: false,
      languages: [],
      language: 'es',
      // notifications: this.getNotifications(),
      notifications: [],
      doubleOrigin: false,
      showSnackbar: false,
      snackMsg: 'session_as_dialog_text_logged_as_customer',
      host: null,
      showSnackbarDialog: false,
      suiteWeb: '',
      products: [],
      options: {
        filter: null,
        search: null
      },
      enterprises: null,
      secondMenu: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.session.user
    })
  },
  methods: {
    goProfile () {
      this.$router.push('/commercial-profile')
      this.menu = !this.menu
    },
    toggleNavigation () {
      this.$refs.navigation.toggle()
    },
    closeMenu () {
      this.menu = !this.menu
    },
    getProducts () {
      if (this.user.role === 'admin' && this.user.role === this.user.view) {
        return ProductsService.listActive()
          .then(res => { this.products = res })
      } else if (this.user.role === 'customer' || this.user.view === 'customer') {
        return ProductsService.listByCustomer()
          .then(res => { this.products = res })
      }
      return Promise.resolve([])
    }
  },
  created () {
    this.$store.dispatch('loading/show')
    if (this.user.role === 'customer' && this.user.customer.type === 'commercial') {
      // this.fetchEnterprises()
    }
    if (this.user.origin) {
      this.showSnackbar = true
      this.doubleOrigin = !!this.user.origin.origin
      if (this.user.role === 'customer' && this.user.customer.type === 'commercial' && this.user.enterprise) {
        this.snackMsg = this.doubleOrigin ? 'session_as_dialog_text_logged_as_enterprise_superadmin' : 'session_as_dialog_text_logged_as_enterprise'
      } else {
        this.snackMsg = 'session_as_dialog_text_logged_as_customer'
      }
    }

    this.$store.dispatch('session/getEnergyHost')
      .then(res => {
        this.host = res
        return this.$store.dispatch('session/getSuiteWebHost')
      })
      .then(res => {
        if (res) {
          this.$set(this, 'suiteWeb', res)
        }
        return this.getProducts()
      })
      .then(() => {
        this.products.unshift({
          name: 'OCC SUITE',
          logo: `${this.suiteWeb}/img/20200301_occ_solution_logo.png`,
          url: this.suiteWeb
        })
        if (this.host && this.host.reference) {
          const por = this.products.find(prod => prod.id === this.host.reference)
          if (por) {
            this.products.splice(this.products.indexOf(por), 1)
          }
        }
        this.$store.dispatch('loading/hide')
      })
  },
  mounted () {
    const urlString = window.location.href
    const url = new URL(urlString)
    const updatedAt = url.searchParams.get('updatedAt')
    if (updatedAt) {
      console.log('Updated at 2022-02-12 00:00')
    }
  }
}
</script>

<style scoped>

.styled-select,
.styled-select label[for] {
  max-width: 100px;
  font-size: 10pt;
}

.unread {
  background-color: #3899da47;
}

.unread:hover {
  background-color: white;
}

.seemore {
  text-align: center;
}

.no-decoration {
  text-decoration: none;
}

.font-unread {
  color: midnightblue;
}

.see-more-btn {
  background-color: #e0e0e087;
}

.see-more-btn:hover {
  background-color: aliceblue;
}

.read {
  cursor: auto;
}
</style>

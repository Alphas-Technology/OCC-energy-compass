
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        VUE_APP_SUITE_BASE_API: string;
        VUE_APP_ENERGY_COMPASS_BASE_API: string;
      }
    }
  }
export {}

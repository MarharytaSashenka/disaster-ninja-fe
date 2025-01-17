export interface AppConfig {
  API_GATEWAY: string;
  BOUNDARIES_API: string;
  REPORTS_API: string;
  BIVARIATE_TILES_RELATIVE_URL: string;
  BIVARIATE_TILES_SERVER?: string;
  BIVARIATE_TILES_INDICATORS_CLASS: string;
  REFRESH_INTERVAL_SEC: number;
  MAP_ACCESS_TOKEN: string;
  MAP_BASE_STYLE: string;
  LAYERS_BY_DEFAULT: string[];
  KEYCLOAK_URL: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_ID: string;
  YANDEX_METRICA_ID?: number[];
  AUTOFOCUS_PADDINGS: [number, number, number, number];
  AUTOFOCUS_ZOOM: number;
  INTERCOM_DEFAULT_NAME?: string;
  INTERCOM_APP_ID?: string;
  INTERCOM_SELECTOR?: string;
  FEATURES_BY_DEFAULT: string[];
  DEFAULT_FEED: string;
  DEFAULT_FEED_DESCRIPTION?: string;
}

declare global {
  interface Window {
    konturAppConfig: AppConfig;
  }
}

export default {
  apiGateway: window.konturAppConfig.API_GATEWAY,
  boundariesApi: window.konturAppConfig.BOUNDARIES_API,
  reportsApi: window.konturAppConfig.REPORTS_API,
  bivariateTilesRelativeUrl: window.konturAppConfig.BIVARIATE_TILES_RELATIVE_URL,
  bivariateTilesServer: window.konturAppConfig.BIVARIATE_TILES_SERVER,
  bivariateTilesIndicatorsClass: window.konturAppConfig.BIVARIATE_TILES_INDICATORS_CLASS,
  refreshIntervalSec: window.konturAppConfig.REFRESH_INTERVAL_SEC,
  mapAccessToken: window.konturAppConfig.MAP_ACCESS_TOKEN,
  mapBaseStyle: window.konturAppConfig.MAP_BASE_STYLE,
  layersByDefault: window.konturAppConfig.LAYERS_BY_DEFAULT,
  featuresByDefault: window.konturAppConfig.FEATURES_BY_DEFAULT,
  defaultFeed: window.konturAppConfig.DEFAULT_FEED,
  defaultFeedDescription: window.konturAppConfig.DEFAULT_FEED_DESCRIPTION || '',
  keycloakUrl: window.konturAppConfig.KEYCLOAK_URL,
  keycloakRealm: window.konturAppConfig.KEYCLOAK_REALM,
  keycloakClientId: window.konturAppConfig.KEYCLOAK_CLIENT_ID,
  yandexMetricaId: window.konturAppConfig.YANDEX_METRICA_ID,
  baseUrl: import.meta.env?.VITE_BASE_PATH,
  isDevBuild: import.meta.env?.DEV,
  isProdBuild: import.meta.env?.PROD,
  appVersion: import.meta.env?.PACKAGE_VERSION as string,
  autoFocus: {
    desktopPaddings: {
      top: window.konturAppConfig.AUTOFOCUS_PADDINGS?.[0] ?? 0,
      right: window.konturAppConfig.AUTOFOCUS_PADDINGS?.[1] ?? 0, // Layers list panel
      bottom: window.konturAppConfig.AUTOFOCUS_PADDINGS?.[2] ?? 0,
      left: window.konturAppConfig.AUTOFOCUS_PADDINGS?.[3] ?? 0, // communities/analytics panel + paddings
    },
    maxZoom: window.konturAppConfig.AUTOFOCUS_ZOOM,
  },
  intercom: {
    name: window.konturAppConfig.INTERCOM_DEFAULT_NAME,
    app_id: window.konturAppConfig.INTERCOM_APP_ID,
    custom_launcher_selector: window.konturAppConfig.INTERCOM_SELECTOR,
  },
};

if (import.meta.env?.PROD) {
  console.info(
    `%c Disaster Ninja ${import.meta.env.PACKAGE_VERSION} deployment:
  - Build Time: ${import.meta.env.BUILD_TIME}
  - Git Branch: ${import.meta.env.GIT_BRANCH}
  - Git Commit: #${import.meta.env.GIT_COMMIT_HASH}
  - Git Commit Time: ${import.meta.env.GIT_COMMIT_TIME}
  `,
    'color: #bada55',
  );
}

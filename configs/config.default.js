window.konturAppConfig = {
  API_GATEWAY: 'https://disaster.ninja/active/api',
  FEATURES_API: 'https://apps.kontur.io/userprofile/features',
  GRAPHQL_API: 'https://apps.kontur.io/insights-api/graphql',
  BOUNDARIES_API: 'https://api.kontur.io',
  REPORTS_API: 'https://disaster.ninja/active/reports',
  TILES_API: 'https://disaster.ninja/tiles/stats/',
  REFRESH_INTERVAL_SEC: 300,
  MAP_ACCESS_TOKEN: '',
  MAP_BASE_STYLE: 'https://disaster.ninja/tiles/basemap/style_ninja.json',
  LAYERS_BY_DEFAULT: [
    'BIV__Kontur OpenStreetMap Quantity',
    'activeContributors',
    'eventShape',
    'focused-geometry',
  ],
  AUTOFOCUS_PADDINGS: [16, 300, 16, 336],
  AUTOFOCUS_ZOOM: 13,
  FEATURES_BY_DEFAULT: [
    'events_list',
    'current_event',
    'reports',
    'current_episode',
    'episode_list',
    'osm_edit_link',
    'side_bar',
    'analytics_panel',
    'map_layers_panel',
    'focused_geometry_layer',
    'map_ruler',
    'boundary_selector',
    'draw_tools',
    'geometry_uploader',
    'legend_panel',
    'url_store',
    'feature_settings',
    'layers_in_area',
    'toasts',
    'interactive_map',
    'feed_selector',
    'header',
    'geocoder',
    'communities',
    'tooltip',
  ],
  DEFAULT_FEED: 'kontur-public',
};
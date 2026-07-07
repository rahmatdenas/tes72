'use strict';

// Konstanta dasar untuk API dan Peta
const WDQS_API_URL            = 'https://query.wikidata.org/sparql';
const COMMONS_WIKI_URL_PREF   = 'https://commons.wikimedia.org/wiki/';
const OSM_LAYER_URL           = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_LAYER_ATTRIBUTION   = 'Base map &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';
const CARTO_LAYER_URL         = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png';
const CARTO_LAYER_ATTRIBUTION = 'Base map &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> (data), <a href="https://carto.com/">CARTO</a> (style)';
const TILE_LAYER_MAX_ZOOM     = 19;

// Global variabel untuk aplikasi linimasa
var Map;
var TimelineRecords = [];

// Kueri SPARQL khusus untuk lokasi (P551) dan waktu (P585)
const SPARQL_RESIDENCE_QUERY = `
SELECT ?location ?locationLabel ?pointInTime ?ptPrecision (SAMPLE(?coord_raw) AS ?coord) (SAMPLE(?image_raw) AS ?image) WHERE {
  # Fokus pada butir tokoh Q561682
  wd:Q561682 p:P551 ?residenceStatement .
  ?residenceStatement ps:P551 ?location .
  
  # WAJIB memiliki atribut "pada waktu" (P585)
  ?residenceStatement pqv:P585 ?ptNode .
  ?ptNode wikibase:timeValue ?pointInTime ;
          wikibase:timePrecision ?ptPrecision .
          
  OPTIONAL { ?location wdt:P625 ?coord_raw . }
  OPTIONAL { ?location wdt:P18 ?image_raw . }
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "id,en". }
}
GROUP BY ?location ?locationLabel ?pointInTime ?ptPrecision
ORDER BY ?pointInTime
`;

/* global WebImporter */
export default function process(main) {
  WebImporter.DOMUtils.remove(main, ['.elementor-location-header', '.elementor-location-footer', '.age_gate', '.skip-link']);
}

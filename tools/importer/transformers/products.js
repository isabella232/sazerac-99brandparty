/* global WebImporter */

function createSectionMetadata(document, section, style, anchorButton) {
  // get the relative path of the background image from pattern url('http://host/wpcontent/...png')
  let background = section.style.backgroundImage.split('(')[1].replace("'", '').replace(')', '');
  if (background === 'none') {
    return;
  }
  background = background.substring(background.indexOf('/wp-content'));

  const rows = [];
  let leftCol = document.createElement('div');
  let rightCol = document.createElement('div');
  leftCol.innerHTML = 'background';
  rightCol.innerHTML = `<img src=${background} />`;
  rows.push([leftCol, rightCol]);

  leftCol = document.createElement('div');
  rightCol = document.createElement('div');
  leftCol.innerHTML = 'style';
  rightCol.innerHTML = style;
  rows.push([leftCol, rightCol]);

  if (anchorButton && anchorButton.querySelector('a').href.includes('pairing')) {
    leftCol = document.createElement('div');
    leftCol.innerHTML = 'hard-seltzers-pairing';
    rightCol = document.createElement('div');
    const urlPairing = anchorButton.querySelector('a').href;
    // eslint-disable-next-line prefer-destructuring
    rightCol.innerHTML = urlPairing.split('#')[1];
    rows.push([leftCol, rightCol]);
  }

  const cells = [['Section-metadata'], ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  section.append(table);
}

export default function process(main, document, params, url) {
  if (url.includes('/products/') && !url.includes('/products/?')) {
    // wipe the recipes title
    const recipesTitle = main.querySelectorAll('h2')[1];
    if (recipesTitle) {
      recipesTitle.remove();
    }

    // wipe any smaller titles that are part of the template
    WebImporter.DOMUtils.remove(main, ['h4']);

    // add the metadata for the top section, add the section devider
    const topSection = document.querySelector('h2').parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    createSectionMetadata(document, topSection, 'top left', document.querySelectorAll('.elementor-widget-button')[0]);
    topSection.append(document.createElement('hr'));

    // wipe any buttons as those are part of the template
    WebImporter.DOMUtils.remove(main, ['.elementor-widget-button']);

    // add metadata for the bottom section
    const allSections = document.querySelectorAll('.elementor-section');
    const bottomBackgroundSection = allSections[allSections.length - 1];
    createSectionMetadata(document, bottomBackgroundSection, 'bottom right');
  }
}

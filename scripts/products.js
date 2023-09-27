import {
  getMetadata,
  buildBlock,
} from './lib-franklin.js';

function querySelectorIncludesText(element, selector, text) {
  return Array.from(element.querySelectorAll(selector))
    .find((el) => el.textContent.includes(text));
}

function applyBackgroundImage(elementContainingSectionMetadata, elementToApplyBG) {
  const sectionMetadata = elementContainingSectionMetadata.querySelector(('.section-metadata'));
  if (sectionMetadata) {
    sectionMetadata.remove();
    const backgroundDiv = querySelectorIncludesText(sectionMetadata, 'div>div>div', 'background');
    const styleDiv = querySelectorIncludesText(sectionMetadata, 'div>div>div', 'style');
    const style = styleDiv.nextElementSibling.textContent;

    let url = backgroundDiv.nextElementSibling.querySelector('img').src;
    url = url.substring(0, url.indexOf('?'));
    url += '?width=2000&format=webply&optimize=medium';

    elementToApplyBG.classList.add('product-background');
    elementToApplyBG.style.backgroundPosition = style;
    elementToApplyBG.style.backgroundImage = `url(${url})`;
  }
}

/**
 * Loads the product template and replaces the content when the metadata is set accordingly
 * @param {Element} doc The container element
 * @returns {Promise}
 */
// eslint-disable-next-line import/prefer-default-export
export async function loadProduct(doc) {
  const templatePath = getMetadata('template');
  if (templatePath === '/templates/liquer') {
    // when the metadata define a template, retrieve it
    const resp = await fetch(`${templatePath}.plain.html`, window.location.pathname.endsWith(`${templatePath}`) ? { cache: 'reload' } : {});

    if (resp.ok) {
      // load template content
      const tplText = await resp.text();

      // put current content aside and apply the template content
      const main = doc.querySelector('main');
      const productData = Array.from(main.firstElementChild.children);
      const recipesData = Array.from(main.lastElementChild.children);
      main.innerHTML = tplText;

      // reapply product data and set the background image
      const liquerSection = main.firstElementChild;
      liquerSection.prepend(...productData);

      // if some hard seltzer pairing is set, add the anchor, or remove the button otherwise
      const productMetadata = liquerSection.querySelector(('.section-metadata'));
      if (productMetadata) {
        const link = liquerSection.querySelector("[href='/hard-seltzer-pairings']");
        const pairingDiv = querySelectorIncludesText(productMetadata, 'div>div>div>div', 'hard-seltzers-pairing');
        if (pairingDiv) {
          const pairKey = pairingDiv.nextElementSibling.textContent;
          if (pairKey) {
            link.href = `${link.href}#${pairKey}`;
          } else {
            link.parentElement.remove();
          }
        } else {
          link.parentElement.remove();
        }
      }

      applyBackgroundImage(liquerSection, liquerSection);

      // move the liquer section content into a columns block
      let leftCol = liquerSection.querySelector('p:first-of-type');
      leftCol.remove();
      let rightCol = liquerSection.innerHTML;
      liquerSection.innerHTML = '';
      const columnsTable = buildBlock('columns', [[leftCol, rightCol]]);
      liquerSection.append(columnsTable);
      liquerSection.classList.add('liquer-section');

      // process the recipes information
      const recipesSection = main.lastElementChild;
      recipesSection.classList.add('recipes-section');

      // create dom out of the array for easier query
      const recipesDataDom = document.createElement('div');
      recipesDataDom.append(...recipesData);

      // put the 'made with' information into the right column
      rightCol = recipesSection.querySelector('.columns>div>div:last-of-type');
      rightCol.prepend(recipesDataDom.querySelector('p:last-of-type'));
      rightCol.append(recipesDataDom.querySelector('h3:last-of-type'));

      // put everything that is left over into the left column, such as recipes and images
      leftCol = recipesSection.querySelector('.columns>div>div:first-of-type');
      leftCol.innerHTML = '';
      Array.from(recipesDataDom.children).forEach((e) => leftCol.appendChild(e));

      applyBackgroundImage(leftCol, recipesSection);

      const leftColImageDiv = document.createElement('div');
      const image = leftCol.querySelector('p');
      const imageText = image.nextElementSibling;
      leftColImageDiv.append(image);
      leftColImageDiv.append(imageText);
      leftColImageDiv.classList.add('recipe-left-image');

      const leftColContentDiv = document.createElement('div');
      leftColContentDiv.append(...leftCol.childNodes);
      leftColContentDiv.classList.add('recipes-content');
      leftCol.append(leftColContentDiv);
      leftCol.prepend(leftColImageDiv);

      const rightColImageDiv = document.createElement('div');
      rightColImageDiv.append(rightCol.querySelector('p'));
      rightColImageDiv.classList.add('recipes-made-with-image');

      const rightColContentDiv = document.createElement('div');
      rightColContentDiv.append(...rightCol.childNodes);
      rightColContentDiv.classList.add('recipes-made-with-content');
      rightCol.append(rightColContentDiv);
      rightCol.prepend(rightColImageDiv);
    }
  }
}

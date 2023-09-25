import { getSortedProductsIndex } from '../../scripts/scripts.js';

function createDevider(block, prepend) {
  const deviderDiv = document.createElement('div');
  deviderDiv.innerHTML = '<span class="devider"> </span>';
  if (prepend) {
    block.prepend(deviderDiv);
  } else {
    block.append(deviderDiv);
  }
}

export default async function decorate(block) {
  createDevider(block, true);
  createDevider(block, false);

  const indexedProducts = await getSortedProductsIndex();
  const indexCurrentPage = indexedProducts.findIndex((e) => e.path === document.location.pathname);

  const prevButtonDiv = document.createElement('div');
  prevButtonDiv.classList.add('liquer-navigation-button-container');
  if (indexCurrentPage > 0) {
    prevButtonDiv.innerHTML = `<p class="button-container"><a href="${indexedProducts[indexCurrentPage - 1].path}" title="previous product" class="button primary">Previous</a></p>`;
  }
  block.prepend(prevButtonDiv);

  const nextButtonDiv = document.createElement('div');
  nextButtonDiv.classList.add('liquer-navigation-button-container');
  if (indexCurrentPage < indexedProducts.length - 1) {
    nextButtonDiv.innerHTML = `<p class="button-container"><a href="${indexedProducts[indexCurrentPage + 1].path}" title="next product" class="button primary">Next</a></p>`;
  }
  block.append(nextButtonDiv);
}

import { getSortedProductsIndex } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  if (block.querySelector('p') == null) {
    const indexedProducts = await getSortedProductsIndex();
    block.querySelectorAll('div').forEach((e) => e.remove());
    indexedProducts.forEach((e) => {
      const entry = document.createElement('div');
      entry.innerHTML = `<a href="${e.path}" title="${e.title}"><h3>${e.title}</h3></a><p class="button-container"><a href="${e.path}" title="${e.title}" class="button secondary">More</a></p>`;
      entry.querySelector('a').prepend(createOptimizedPicture(e.image, e.title, false, [{ width: '750' }]));
      block.append(entry);
    });

    // add party packs at the end
    const partypacks = document.createElement('div');
    partypacks.innerHTML = '<a href="/party-packs" title="99 party packs"><h3>99 Party Packs</h3></a><p class="button-container"><a href="/party-packs" title="99 party packs" class="button secondary">More</a></p>';
    partypacks.querySelector('a').prepend(createOptimizedPicture('/media/media_14dee3756c049dd3ca4ccb186e085f0f17ac2a7e7.png', '99 party packs', false, [{ width: '750' }]));
    block.append(partypacks);

    // add spirits at the end
    const spirits = document.createElement('div');
    spirits.innerHTML = '<a href="/spirits" title="99 spirits collection"><h3>99 Spirits Collection</h3></a><p class="button-container"><a href="/spirits" title="99 spirits collection" class="button secondary">More</a></p>';
    spirits.querySelector('a').prepend(createOptimizedPicture('/media/media_1f64794813e03174a26df5b1136ddc19f2ffb717f.png', '99 spirits collection', false, [{ width: '750' }]));
    block.append(spirits);
  }
}

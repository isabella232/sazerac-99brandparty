import { decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.textContent = '';

  // fetch footer content
  const footerPath = '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;

    const secondList = document.createElement('ul');
    footer.querySelectorAll('ul li').forEach((link, index) => {
      if (index > 3) {
        secondList.append(link);
      }
    });
    if (secondList.children.length > 0) {
      footer.querySelector('ul').after(secondList);
    }
    decorateIcons(footer);
    block.append(footer);
  }
}

export default async function decorate(block) {
  const hidden = block.querySelector(':scope > div:nth-of-type(2)');
  hidden.classList.add('hidden');
  block.querySelectorAll(':scope > div > div:nth-of-type(2)').forEach((element) => {
    const wrapper = Object.assign(document.createElement('div'), {
      className: 'wrapper',
    });
    element.parentElement.append(wrapper);
    element.remove();
    wrapper.append(element);
    const links = Object.assign(document.createElement('div'), {
      className: 'links',
    });
    const button = element.querySelector('.button-container');
    button.replaceWith(links);
    links.append(button);
    links.append(...element.querySelectorAll('.button-container'));
  });

  block.querySelectorAll('[href="https://drizly.com/liquor-brands/99-flavored-schnapps/b4323"]').forEach((element) => {
    const link = Object.assign(document.createElement('a'), {
      className: 'shop',
      href: 'https://drizly.com/liquor-brands/99-flavored-schnapps/b4323',
      title: 'Shop Now',
    });
    link.innerText = 'Shop Now';
    element.replaceWith(link);
  });
}

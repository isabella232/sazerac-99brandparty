import { setCookie } from '../../scripts/scripts.js';
/* age verification overlay */

export default async function decorate(block) {
  block.textContent = '';

  const resp = await fetch('/templates/verification.plain.html', window.location.pathname.endsWith('/templates/verification') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();
    block.innerHTML = html;
    const background = block.querySelector('.background');
    const desktop = Array.from(background.querySelectorAll('div')).find((el) => el.textContent === 'desktop');
    const desktopParent = desktop?.parentElement;
    desktopParent?.classList.add('desktop');
    desktop?.remove();

    const mobile = Array.from(background.querySelectorAll('div')).find((el) => el.textContent === 'mobile');
    const mobileParent = mobile?.parentElement;
    mobileParent?.classList.add('mobile');
    mobile?.remove();

    block.querySelector('.ageverification > div').prepend(background);

    const buttons = block.querySelectorAll('.verification a');

    const div = document.createElement('div');
    buttons[0].parentElement.append(div);
    buttons[0].parentElement.append(buttons[1].parentElement);
    div.append(buttons[0]);
    div.parentElement.classList.add('agegate-button-wrap');

    const buttonyes = buttons[0];
    buttonyes.parentElement.classList.add('button-container');
    buttonyes.className = 'button primary';

    buttonyes.onclick = (event) => {
      setCookie('sazAgeOK', 'yes', 63113852000, '/');
      document.querySelector('.ageverification-container').remove();
      event.preventDefault();
    };

    const buttonno = buttons[1];
    buttonno.parentElement.classList.add('button-container');
    buttonno.className = 'button primary';
  }
}

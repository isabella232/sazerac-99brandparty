import { decorateIcons } from '../../scripts/lib-franklin.js';

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

function getModal(modalId, createContent, closeListener) {
  let dialogElement = document.getElementById(modalId);
  if (!dialogElement) {
    dialogElement = document.createElement('dialog');
    dialogElement.id = modalId;

    const contentHTML = createContent?.() || '';

    dialogElement.innerHTML = `
    <div>
        ${contentHTML}
        <div class="embed-navigation">
          <button name="normalscreen" style="display:none;" class="embed-normalscreen" title="Close Fullscreen"><span class="icon icon-normalscreen"/></button>
          <button name="fullscreen" class="embed-fullscreen" title="Fullscreen"><span class="icon icon-fullscreen"/></button>
          <button name="magnify" class="embed-magnify" title="Magnify"><span class="icon icon-magnify"/></button>
          <button name="shrink" style="display:none;" class="embed-shrink" title="Shrink"><span class="icon icon-shrink"/></button>
          <button name="share" class="embed-share" title="Share"><span class="icon icon-share"/></button>
          <button name="close" class="embed-close" title="Close"><span class="icon icon-close"/></button>
        </div>
        <div class="sharing" style="display:none;">
            <a href="https://www.facebook.com/sharer.php?u=${modalId.substring(0, modalId.indexOf('?'))}" target="_blank">
              <img src="/icons/facebook-share.png" width="15px" height="15px"/>
              Share on Facebook
            </a>
            <div>
            <a href="https://twitter.com/intent/tweet?text=${modalId.substring(0, modalId.indexOf('?'))}" target="_blank">
              <img src="/icons/twitter-share.png" width="15px" height="15px"/>
              Share on Twitter
            </a>
            </div>
            <a href="https://www.pinterest.com/pin/create/button/?url=&amp;media=${modalId.substring(0, modalId.indexOf('?'))}" target="_blank">
              <img src="/icons/pin-share.png" width="15px" height="15px"/>
              Pin it
            </a>
            <a href="${modalId.substring(0, modalId.indexOf('?'))}" download="">
              <img src="/icons/download-share.png" width="15px" height="15px"/>
              Download image
            </a>
          </div>
      </div>
      `;

    decorateIcons(dialogElement);
    document.body.appendChild(dialogElement);

    const buttonNormal = dialogElement.querySelector('button[name="normalscreen"]');
    const buttonFull = dialogElement.querySelector('button[name="fullscreen"]');
    const buttonMagnify = dialogElement.querySelector('button[name="magnify"]');
    const buttonShrink = dialogElement.querySelector('button[name="shrink"]');
    const buttonShare = dialogElement.querySelector('button[name="share"]');
    const buttonClose = dialogElement.querySelector('button[name="close"]');

    buttonNormal.addEventListener('click', () => {
      buttonNormal.style.display = 'none';
      buttonFull.style.display = 'block';
      closeFullscreen();
    });
    buttonFull.addEventListener('click', () => {
      buttonNormal.style.display = 'block';
      buttonFull.style.display = 'none';
      openFullscreen(dialogElement.querySelector('div'));
    });
    buttonMagnify.addEventListener('click', () => {
      buttonMagnify.style.display = 'none';
      buttonShrink.style.display = 'block';
      dialogElement.classList.add('scaled');
    });
    buttonShrink.addEventListener('click', () => {
      buttonShrink.style.display = 'none';
      buttonMagnify.style.display = 'block';
      dialogElement.classList.remove('scaled');
    });
    buttonShare.addEventListener('click', () => {
      if (dialogElement.querySelector('.sharing').style.display !== 'none') {
        dialogElement.querySelector('.sharing').style.display = 'none';
      } else {
        dialogElement.querySelector('.sharing').style.display = 'flex';
      }
    });
    buttonClose.addEventListener('click', () => {
      dialogElement.close();
    });

    dialogElement.addEventListener('close', (event) => closeListener(event));
  }
  return dialogElement;
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  const partyPacks = document.querySelector('body.partypacks');

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
        if (partyPacks) {
          const a = document.createElement('a');
          a.href = pic.querySelector('img').src;
          pic.parentElement.append(a);
          a.append(pic);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            getModal(a.href, () => a.innerHTML + picWrapper.querySelector('h2').outerHTML, () => {
              document.getElementById(a.href).remove();
            }).showModal();
          });
        }
      }
    });
  });
}

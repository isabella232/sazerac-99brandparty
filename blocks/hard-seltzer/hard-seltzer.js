export default async function decorate(block) {
  block.classList.add('hard-seltzers');
  [...block.children].forEach((row, index) => {
    row.className = 'hard-seltzer-item';
    row.classList.add(index % 2 === 0 ? 'left' : 'right');
    const link = row.querySelector('a');
    link.classList.add('button');
    const title = link.textContent;
    const anchor = title.startsWith('99 ') ? title.substring(3) : null;
    if (anchor) {
      row.id = anchor.toLowerCase();
    }
    [...row.children].forEach((child, m) => {
      child.classList.add(`hard-seltzer-part-${m}`);
    });
  });
}

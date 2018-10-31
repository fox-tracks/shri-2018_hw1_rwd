// открытие/закрытие главного меню

'use strict';

export function initMenu() {
  const hamburgerBtn: HTMLInputElement | null = document.querySelector<HTMLInputElement>('.hamburger-btn');
  const mainNav: HTMLElement | null = document.querySelector('.header__nav');

  if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', () => {
      mainNav.classList.toggle('header__nav_state_shown');
      hamburgerBtn.classList.toggle('hamburger-btn_action_close')

    });
  }
};
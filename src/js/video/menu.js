// открытие/закрытие главного меню

'use strict';

(function() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mainNav = document.querySelector('.header__nav');

  hamburgerBtn.addEventListener('click', () => {
    mainNav.classList.toggle('header__nav_state_shown');
    hamburgerBtn.classList.toggle('hamburger-btn_action_close')
  });
})();
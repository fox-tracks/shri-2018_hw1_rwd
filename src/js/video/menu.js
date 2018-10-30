// открытие/закрытие главного меню
'use strict';
(function () {
    var hamburgerBtn = document.querySelector('.hamburger-btn');
    var mainNav = document.querySelector('.header__nav');
    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', function () {
            mainNav.classList.toggle('header__nav_state_shown');
            hamburgerBtn.classList.toggle('hamburger-btn_action_close');
        });
    }
})();

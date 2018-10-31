!function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=n(1),r=n(2),a=n(5);i.initMenu(),r.createLayout(),setTimeout(a.initCameraGesture,0)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initMenu=function(){const e=document.querySelector(".hamburger-btn"),t=document.querySelector(".header__nav");e&&t&&e.addEventListener("click",()=>{t.classList.toggle("header__nav_state_shown"),e.classList.toggle("hamburger-btn_action_close")})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=n(3),r=n(4);t.createLayout=function(){const e=i.data,t=document.querySelector("template");if(null===t)throw Error;const n=r.requireSelector(t.content,"article.event-feed__card"),a=document.querySelector(".event-feed__wrapper");function o(e){const t=document.createDocumentFragment();return e.forEach(e=>{const i=function(e,t){const n=e.cloneNode(!0);if(!(n instanceof HTMLElement))throw new Error;const{icon:i}=t,a=r.requireSelector(n,"div.card__extra-content");if(n.classList.add("card_icon_"+i),n.classList.add("card_size_"+t.size),n.classList.add("event-feed__card_size_"+t.size),n.classList.add("card_action_"+t.type),r.requireSelector(n,"h3.card__title").textContent=t.title,r.requireSelector(n,"p.card__source").textContent=t.source,r.requireSelector(n,"p.card__time").textContent=t.time,null!==t.description){let e=document.createElement("div");e.classList.add("card__description"),e.textContent=t.description,a.appendChild(e)}else a.style.display="none";if(t.hasOwnProperty("data")){let e=document.createElement("div");e.classList.add("card__widget"),e.classList.add("widget");const{data:n}=t;switch(i){case"stats":e.innerHTML=function(){const e=["Richdata@1x.png","Richdata@2x.png","Richdata@3x.png"].map(e=>{const t=[];return t.push("img/"+e),t});return`<div class="widget__wrap widget__wrap_graph">\n                <img class="widget__wrap_graph-img" src="${e[0]}" srcset="${e[1]} 2x, ${e[2]} 3x" width="100%" height="100%" alt="Графики">\n            </div>`}();break;case"thermal":e.innerHTML=function(e){const{temperature:t,humidity:n}=e;return`<div class="widget__wrap climate">\n        <div class="climate__temperature">Температура: <span class="climate__temperature-value">${t} С</span></div>\n        <div class="climate__humidity">Влажность : <span class="climate__humidity-value">${n}%</span></div>\n      </div>`}(n);break;case"music":e.innerHTML=function(e){const{albumcover:t,artist:n,volume:i}=e,{name:r,length:a}=e.track;return`<div class="widget__wrap player">\n        <img class="player__album-cover" src="${t}" width="52px" height="53px" alt="Florence & The Machine">\n        <div class="player__track-info">\n            <span class="player__track-name">${n} - ${r}</span>\n        </div>\n        <input class="player__track-bar" type="range" value="31" min="0" max="271">\n        <span class="player__track-length">${a}</span>\n        <button class="player__back-btn"></button>\n        <button class="player__next-btn"></button>\n        <input class="player__volume-bar" type="range" value="${i}" min="0" max="100">\n        <span class="player__volume-value">${i}%</span>\n  </div>`}(n);break;case"fridge":e.innerHTML=function(e){const{buttons:t}=e;return`<div class="widget__wrap dialogue">\n        <button class="dialogue__btn dialogue__btn_agree">${t[0]}</button>\n        <button class="dialogue__btn dialogue__btn_cancel">${t[1]}</button>\n      </div>`}(n);break;case"cam":e.innerHTML='<div class="widget__wrap widget__wrap_cam camera"><div class="camera__scroll"></div></div>\n            <div class="camera__controls"> \n                <p class="camera__zoom">Приближение: <span class="camera__zoom-value">78%</span></p>\n                <p class="camera__brightness">Яркость: <span class="camera__brightness-value">50%</span></p>\n            </div>'}a.appendChild(e)}return n}(n,e);t.appendChild(i)}),t}return function(e){const t=o(e);if(a)return a.appendChild(t),a}(e)}},function(e,t,n){"use strict";var i,r;Object.defineProperty(t,"__esModule",{value:!0}),function(e){e.info="info",e.critical="critical"}(i=t.EventType||(t.EventType={})),function(e){e.s="s",e.m="m",e.l="l"}(r=t.SizeType||(t.SizeType={})),t.data=[{type:i.info,title:"Еженедельный отчет по расходам ресурсов",source:"Сенсоры потребления",time:"19:00, Сегодня",description:"Так держать! За последнюю неделю вы потратили на 10% меньше ресурсов, чем неделей ранее.",icon:"stats",data:{type:"graph",values:[{electricity:[["1536883200",115],["1536969600",117],["1537056000",117.2],["1537142400",118],["1537228800",120],["1537315200",123],["1537401600",129]]},{water:[["1536883200",40],["1536969600",40.2],["1537056000",40.5],["1537142400",41],["1537228800",41.4],["1537315200",41.9],["1537401600",42.6]]},{gas:[["1536883200",13],["1536969600",13.2],["1537056000",13.5],["1537142400",13.7],["1537228800",14],["1537315200",14.2],["1537401600",14.5]]}]},size:r.l},{type:i.info,title:"Дверь открыта",source:"Сенсор входной двери",time:"18:50, Сегодня",description:null,icon:"key",size:r.s},{type:i.info,title:"Уборка закончена",source:"Пылесос",time:"18:45, Сегодня",description:null,icon:"robot-cleaner",size:r.s},{type:i.info,title:"Новый пользователь",source:"Роутер",time:"18:45, Сегодня",description:null,icon:"router",size:r.s},{type:i.info,title:"Изменен климатический режим",source:"Сенсор микроклимата",time:"18:30, Сегодня",description:"Установлен климатический режим «Фиджи»",icon:"thermal",size:r.m,data:{temperature:24,humidity:80}},{type:i.critical,title:"Невозможно включить кондиционер",source:"Кондиционер",time:"18:21, Сегодня",description:"В комнате открыто окно, закройте его и повторите попытку",icon:"ac",size:r.m},{type:i.info,title:"Музыка включена",source:"Яндекс.Станция",time:"18:16, Сегодня",description:"Сейчас проигрывается:",icon:"music",size:r.m,data:{albumcover:"https://avatars.yandex.net/get-music-content/193823/1820a43e.a.5517056-1/m1000x1000",artist:"Florence & The Machine",track:{name:"Big God",length:"4:31"},volume:80}},{type:i.info,title:"Заканчивается молоко",source:"Холодильник",time:"17:23, Сегодня",description:"Кажется, в холодильнике заканчивается молоко. Вы хотите добавить его в список покупок?",icon:"fridge",size:r.m,data:{buttons:["Да","Нет"]}},{type:i.info,title:"Зарядка завершена",source:"Оконный сенсор",time:"16:22, Сегодня",description:"Ура! Устройство «Оконный сенсор» снова в строю!",icon:"battery",size:r.s},{type:i.critical,title:"Пылесос застрял",source:"Сенсор движения",time:"16:17, Сегодня",description:"Робопылесос не смог сменить свое местоположение в течение последних 3 минут. Похоже, ему нужна помощь.",icon:"cam",data:{image:"get_it_from_mocks_:3.jpg"},size:r.l},{type:i.info,title:"Вода вскипела",source:"Чайник",time:"16:20, Сегодня",description:null,icon:"kettle",size:r.s}]},function(e,t,n){"use strict";function i(e,t){const n=e.querySelector(t);if(null===n)throw new Error;return n}Object.defineProperty(t,"__esModule",{value:!0}),t.requireSelector2=i,t.requireSelector=function(e,t){return i(e,t)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initCameraGesture=function(){const e=100,t=135,n=document.querySelector(".camera"),i=document.querySelector(".camera__zoom-value"),r=document.querySelector(".camera__brightness-value"),a=document.querySelector(".camera__scroll"),o=n.getBoundingClientRect().width;let c,s,l,u=50,d=+getComputedStyle(n).getPropertyValue("background-size").slice(0,-1),p=+getComputedStyle(n).getPropertyValue("background-position-x").split("px")[0]||0,_=+getComputedStyle(n).getPropertyValue("background-position-y").split("px")[0]||0,m=[],f=[],y={x:0,y:0};function g(t){for(let e=0;e<f.length;e++)if(f[e].pointerId===t.pointerId){f.splice(e,1);break}!function(e){for(let t=0;t<m.length;t++)if(m[t].id===e.pointerId){m.splice(t,1);break}}(t),m.length<2&&(y.x=0,d=+getComputedStyle(n).getPropertyValue("background-size").slice(0,-1),i.innerHTML=Math.round(d-e)+"%")}n.style.touchAction="none",n.setAttribute("touch-action","none"),n.addEventListener("pointerdown",function(e){n.setPointerCapture(e.pointerId),f.push(e),c={id:e.pointerId,startX:e.x,startY:e.y,startPositionX:p,startPositionY:_},m.push(c),2===m.length&&(y.x=m[1].startX-m[0].startX)}),n.addEventListener("pointermove",function(i){for(let e=0;e<f.length;e++)i.pointerId===f[e].pointerId&&(f[e]=i);if(function(e){if(2!==e.length)return s=void 0,void(l=void 0);const[t,i]=e,a=function(e,t){let n=e.x-t.x,i=e.y-t.y;return Math.atan2(i,n)*(180/Math.PI)}(t,i);if(void 0===s||void 0===l)s=a,l=u;else{const e=a-s,t=l+e,i=function(e,t,n){return e<=t?t:e>=n?n:e}(t,0,200);!function(e){u=e;const t=Math.round(e)+"%";r.innerHTML=t,n.style.filter="brightness("+t+")"}(i)}}(f),2===m.length){for(let e=0;e<m.length;e++)if(i.pointerId===m[e].id){m[e].startX=i.x,m[e].startY=i.y;break}let r,a,c={x:0,y:0};c.x=m[1].startX-m[0].startX,c.y=m[1].startY-m[0].startY,Math.abs(y.x)>0&&(r=(Math.abs(c.x)-Math.abs(y.x))*e/o,a=d+r<t?t:d+r,n.style.backgroundSize=a+"%",y.x=c.x,d=a)}if(m.length<2){if(!c)return;const{startX:t,startPositionX:r}=c,{x:s}=i,l=s-t,u=o*d/e,_=o/(u-o);r+l>=0?(n.style.backgroundPositionX="0px",p=0,a.style.left="0"):r+l<0&&Math.abs(r+l)>=u-o?(n.style.backgroundPositionX="-"+(u-o).toString()+"px",p=-(u-o),a.style.left=o-a.getBoundingClientRect().width+"px"):(n.style.backgroundPositionX=r+l+"px",p=r+l,a.style.left=Math.abs(r+l)*_+"px")}}),n.addEventListener("pointerup",g),n.addEventListener("pointercancel",g),n.addEventListener("pointerout",g),n.addEventListener("pointerleave",g)}}]);
//# sourceMappingURL=index.bundle.js.map
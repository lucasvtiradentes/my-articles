// ==UserScript==
// @name         hide twitch sections
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  edit github navbar links
// @author       Lucas Vieira
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  customizeDependingOnRoute(location.href)
  
  detectUrlChanges((newUrl) => {
    console.log(`URL changed to ${newUrl}!`)
    setTimeout(() => customizeDependingOnRoute(newUrl), 1500)
  });
  
  function customizeDependingOnRoute(curUrl){
    const urlPath = curUrl.toString().replace("https://www.twitch.tv", '')
    hideTwitchSections()
  }
  
  /* --------------------------------------------------------------------- */
  
  function detectUrlChanges(cb){
    let previousUrl = location.href;

    const observer = new MutationObserver(function(mutations) {
      if (previousUrl !== location.href) {
          previousUrl = location.href;
          cb(location.href)
        }
    });

    observer.observe(document, {subtree: true, childList: true});

  }

  function hideTwitchSections(){
    const allGroupds = document.querySelectorAll('div[role="group"]')

    if (Array.from(allGroupds).length === 0){
       setTimeout(() => {
           hideTwitchSections()
       }, 500)
      return
    }

    allGroupds.forEach(el => {
      const divsToHide = ['recomendados', 'também assistem']
      const groupName = el.getAttribute('aria-label')
      const isIgnoredGroup = divsToHide.some(name => groupName.search(name) > -1)

      if (isIgnoredGroup){
        console.log(`hided: ${groupName}`)
        el.setAttribute('style', 'visibility: hidden;')
      }
    })
  }

})();

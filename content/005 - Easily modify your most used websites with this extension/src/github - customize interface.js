// ==UserScript==
// @name         github customization
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==


(function() {
  'use strict';

  const PROFILE_NAME = document.querySelector("img.avatar-user")?.getAttribute('alt')?.replace('@', '')

  customizeDependingOnRoute(location.href)

  detectUrlChanges((newUrl) => {
    console.log(`URL changed to ${newUrl}!`)
    customizeDependingOnRoute(newUrl)
  });

  function customizeDependingOnRoute(curUrl){
    const urlPath = curUrl.toString().replace("https://github.com", '')

    editGithubNavBar(PROFILE_NAME)

    if ( urlPath === "/lucasvtiradentes?tab=repositories"){
      markPrivateRepos()
    } else if ( urlPath === "/settings/profile" ){
      setTimeout(() => editGithubNavBar(PROFILE_NAME), 1500)
    }

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

  function markPrivateRepos(){
    const el = document.querySelectorAll('div#user-repositories-list > ul > li')

    if (Array.from(el).length === 0){
      setTimeout(markPrivateRepos, 500)
      return
    }

    Array.from(el).forEach(el => {
      const repoName = el.querySelector('div > div > h3 > a').innerText
      const repoVisibility = el.querySelector('div > div > h3 > span.Label').innerText
      if (repoVisibility === 'Private'){
        console.log(`marked repo as private: ${repoName}`)
        el.style.backgroundColor = '#161b22'
      }
    })

  }

  function editGithubNavBar(profileName){
    const headerEl = document.querySelector('#global-nav')
    const elItems = headerEl.querySelectorAll('a')

    if ([9].includes(Array.from(elItems).length) === false){
      setTimeout(editGithubNavBar, 500)
      return
    }

    const REMOVE_ITEMS = ["Marketplace", "Explore"]
    const REPLACE_ITEMS = [
      [["Pulls", "Pull requests"], "Profile", `/${profileName}`],
      [["Issues"], "Repositories", `/${profileName}?tab=repositories`],
      [["Codespaces"], "Issues", `/issues`]
    ]

    Array.from(elItems).forEach(item => {

      const curItemName = item.innerText.trim()

      if (REMOVE_ITEMS.includes(curItemName)) {
        item.remove()
      }

      REPLACE_ITEMS.forEach(repItem => {
        const [originalArr, newName, newLink] = repItem

        if (originalArr.includes(curItemName)){
          item.setAttribute('href', newLink)
          item.innerText = newName
        }
      })
    })
  }

})();

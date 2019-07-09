(()=> {
  'use strict';

  let options = document.querySelector('#options');
  let urlList = document.querySelector('[name="urlList"]');
  let isPlaying = document.querySelector('[name="isPlaying"]');

  browser.storage.sync.get('urlList').then(storage => {
    urlList.value = storage.urlList || '';
  }).catch(e => alert(e));

  browser.storage.sync.get('isPlaying').then(storage => {
    isPlaying.checked = storage.isPlaying;
  }).catch(e => alert(e));

  options.addEventListener('submit', function(event) {
    browser.storage.sync.set({
      urlList: urlList.value,
      isPlaying: isPlaying.checked,
    }).catch(e => alert(e));
    
    event.preventDefault();
  });
})();

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({'new': []},function(){
    console.log('add new data');
  });
});

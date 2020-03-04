'use strict';

let searchinput = document.getElementById('searchinput');
let resultDiv = document.getElementById('resultDiv');
let wordlist = document.getElementById('wordlist');



chrome.tabs.executeScript({
        code: "window.getSelection().toString();"
    }, function(selection) {
        searchinput.value = selection[0];
        addData(searchinput.value);
        translate(selection[0]);
        
    }
);

searchinput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addData(searchinput.value);
        translate(searchinput.value);
        
    }
});


//load new word data to panel
//user can click it to remember it again.
function loadData(){
    wordlist.innerHTML="";
    chrome.storage.local.get('new', function(data) {
        for (let item of data.new) {
            let li = document.createElement('li');
            li.innerHTML=item;
            li.addEventListener('dblclick', function(element) {
                searchinput.value=element.target.innerText;
                translate(element.target.innerText);
                removeData(element.target.innerText);
              });
            li.addEventListener('click', function(element) {
                searchinput.value=element.target.innerText;
                translate(element.target.innerText);
                
              });
            wordlist.appendChild(li);
        }

    });
}

//remove it when you click it.
function removeData(word){
    chrome.storage.local.get('new',function(data){
        var k=data.new;
        var filtered = k.filter(function(value,index,arr){return value!=word;});
        chrome.storage.local.set({'new': filtered},function(){
            loadData();
        });
    });
}

//save new word in the localStroage of chrome browser.
//saved in an array with a key name "new".
function addData(word){
    if(word == null || word == "" || word == undefined){
        return;
    }
    chrome.storage.local.get('new',function(data){
        var k=data.new;
        k.push(word.trim());
        chrome.storage.local.set({'new': k},function(){
            loadData();
        });
    })
    
}

function translate(word) {
    if(word == null || word == "" || word == undefined){
        return;
    }      
        var xhr = new XMLHttpRequest();
        xhr.responseType = "document";
        var url = "https://cn.bing.com/dict/search?q="+word;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            //display data fetched from bing.
            resultDiv.innerHTML="";
            resultDiv.append(xhr.response.querySelector("div.qdef ul"));

            let more = document.createElement('a');
            more.innerHTML='see more about '+word;
            more.href=url;
            more.target="_blank"
            let moreli = document.createElement('li');
            moreli.append(more);
            resultDiv.querySelector("ul").append(moreli);
            //resultDiv.appendChild(more);

            searchinput.setSelectionRange(0, searchinput.value.length);

          }
        }
        xhr.send();
}





searchinput.focus();
loadData();
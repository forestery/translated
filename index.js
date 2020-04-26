'use strict';

let searchinput = document.getElementById('searchinput');
let resultDiv = document.getElementById('resultDiv');
let wordlist = document.getElementById('wordlist');
let clearall = document.getElementById('clearall');

let thequote = document.getElementById('thequote');
let theauthor = document.getElementById('theauthor');

let MP3Play = document.getElementById('MP3Play');
let wordMP3 = document.getElementById('wordMP3');


chrome.tabs.executeScript({
        code: "window.getSelection().toString();"
    }, function(selection) {
        searchinput.value = selection[0];
        addData(searchinput.value);
        translate(selection[0]);
        
    }
);


MP3Play.addEventListener("click",function(element){
      let player = document.getElementById("wordMP3");
      player.play();

});

clearall.addEventListener("click",function(element){

        chrome.storage.local.set({'new': []},function(){
            loadData();
        });

});
searchinput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addData(searchinput.value);
        translate(searchinput.value);
        
    }
});


function initData(){
    loadData();
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var url = "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json"
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        //display data fetched from bing.
        //alert(xhr.response);
        thequote.textContent=xhr.response.quoteText;
        theauthor.textContent="--"+xhr.response.quoteAuthor;
      }
    }
    xhr.send();
}

//load new word data to panel
//user can click it to remember it again.
function loadData(){
    wordlist.innerHTML="";
    chrome.storage.local.get('new', function(data) {
      
        chrome.browserAction.setBadgeText({text: data.new.length == 0 ? '':data.new.length.toString()});
        for (let item of data.new) {
            let li = document.createElement('li');
            let li_href=document.createElement('a');
            let li_span = document.createElement('span');
            //li.innerHTML=item;
            li_span.textContent = item;
            li_href.textContent = 'remove';
            li_href.title="remove it when you do memorize it."
            li_href.style.float="right";
            li_href.href="#";
            li.append(li_span);
            li.append(li_href);
            
            li_href.addEventListener('click', function(element) {
                //searchinput.value=element.target.innerText;
                //translate(element.target.innerText);
                //removeData(element.target.innerText);
                removeData(item);
                element.stopPropagation();
              });
              
            li.addEventListener('click', function(element) {
                searchinput.value=item;
                translate(item);
                
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
        var word_low=word.toLowerCase().trim();
        if(k.includes(word_low)){
            return;
        }
        k.push(word_low);
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
        var url_deepl = "https://www.deepl.com/translator#en/zh/"+word;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            //display data fetched from bing.
            resultDiv.innerHTML="";
            var ulfetched=xhr.response.querySelector("div.qdef ul");
            var MP3fetched=xhr.response.querySelector("div.hd_tf a");
            if (MP3fetched!=undefined && ulfetched!=null){
                var k = MP3fetched.getAttribute('onmouseover');
                var k1=k.substr(k.indexOf("https"),k.indexOf("mp3")-k.indexOf("https")+3);
                wordMP3.src=k1;
                
            }
            if(ulfetched==undefined || ulfetched==null){
                ulfetched=document.createElement('ul');
            }
            resultDiv.append(ulfetched);

            let more = document.createElement('a');
            more.innerHTML='see more ...';
            more.href=url;
            more.target="_blank"
            let moreli = document.createElement('li');
            moreli.append(more);
            
            let more_deepl = document.createElement('a');
            more_deepl.innerHTML='more on deepl ...';
            more_deepl.href=url_deepl;
            more_deepl.target="_blank"
            let moreli_deepl = document.createElement('li');
            moreli_deepl.append(more_deepl);

            resultDiv.querySelector("ul").append(moreli);
            resultDiv.querySelector("ul").append(moreli_deepl);
            //resultDiv.appendChild(more);

            searchinput.setSelectionRange(0, searchinput.value.length);

          }
        }
        xhr.send();
}





searchinput.focus();
initData();
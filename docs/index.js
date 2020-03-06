'use strict';

let searchinput = document.getElementById('searchinput');
let resultDiv = document.getElementById('resultDiv');
let wordlist = document.getElementById('wordlist');
let clearall = document.getElementById('clearall');

let thequote = document.getElementById('thequote');
let theauthor = document.getElementById('theauthor');


function localData_set(key , value ){
    // Put the object into storage
    localStorage.setItem(key, JSON.stringify(value));
}

function localData_get(key){
    // Retrieve the object from storage
    return localStorage.getItem(key);
}




clearall.addEventListener("click",function(element){

        localData_set('new',[]);
        loadData();
        

});
searchinput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addData(searchinput.value);
        translate(searchinput.value);
        
    }
});


function initData(){
    if(localData_get('new') == null){
        localData_set('new',[]);
    }
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

    var data = loadData_get('new');


    
      
    
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

    
}

//remove it when you click it.
function removeData(word){
    var data = localData_get('new');

    
        var k=data.new;
        var filtered = k.filter(function(value,index,arr){return value!=word;});
        localData_set('new',filtered);
        loadData();
            
        
    
}

//save new word in the localStroage of chrome browser.
//saved in an array with a key name "new".
function addData(word){
    if(word == null || word == "" || word == undefined){
        return;
    }
    var data = localData_get('new');

    
        var k=data.new;
        var word_low=word.toLowerCase().trim();
        if(k.includes(word_low)){
            return;
        }
        k.push(word_low);
        localData_set('new',k);
        loadData();
        
        
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
            var ulfetched=xhr.response.querySelector("div.qdef ul");
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
            resultDiv.querySelector("ul").append(moreli);
            //resultDiv.appendChild(more);

            searchinput.setSelectionRange(0, searchinput.value.length);

          }
        }
        xhr.send();
}





searchinput.focus();
initData();
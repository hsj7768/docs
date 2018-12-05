var items;

$(document).ready(function () {
  var parsed = getAllUrlParams( window.location.href );
  
  if ( parsed.item ) {
    getCSV(function () {
      var filted = items.filter( function( item ) {
        if ( parsed.item*1 == item.id*1 ) {
          return true;
        }
      });
      detailApp.item = filted[0];
    });  
  }
});

function getAllUrlParams( url ) {
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  var obj = {};
  if (queryString) {
    queryString = queryString.split('#')[0];
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      var a = arr[i].split('=');
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
      if (paramName.match(/\[(\d+)?\]$/)) {
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];
        if (paramName.match(/\[\d+\]$/)) {
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          obj[key].push(paramValue);
        }
      } else {
        if (!obj[paramName]) {
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

function getCSV( callback ) {
  var url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWze7qOfMnYJC-KZBlSmLpmut8hARDX4zS_rAbRraECdgQ7GDVu5wOvqIu7uUrksyZoEzwH3Lt5K2K/pub?gid=562347642&single=true&output=csv"
  $.get( url, function( data, status ) {
    var json = $.csv.toObjects( data );    
    items = json;
    callback();
  });
}

  
function filterById( selected ) {
  if ( items != null && items.length > 0 ) {
    var filted = items.filter( function( item ) {
      for (var i in selected) {
        if ( item.id == selected[i] ) {
          return true;
        }
      }
    });
  }
}; 

function telegram() {
  var url = "https://api.telegram.org/bot572309405:AAFIvvAIGOciZcnkzQHPqUaRoWPNebvULmg/sendMessage?chat_id=59644837&text=" + encodeURI( "[" + detailApp.id + "] [" + detailApp.title + "] \n" + detailApp.errorReportMessage );
  $.get( url, function( data, status ) {
    showalert( '정보 개선에 참여해 주셔서 감사합니다.', 'alert-success')
  });
}

var detailApp = new Vue({
  el: '#detailApp',
  data: {
    item: {
    }
    ,errorReporter: ''
    ,errorReportMessage : ''
  }
});

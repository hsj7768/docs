var items;

$(document).ready(function () {  
  var parsed = getAllUrlParams( window.location.href );
  
  var search = parsed.search;
  if ( search && search != true ) {
    var column = search.split(','); //simple_0,simple_1,simple_2,simple_3
    for ( i in column ) {
      if (isEmpty(column[i]) == false) {
        var key = column[i].split('_');
        searchApp.search[ key[0] ] [ key[1] ].checked = true;
      }
    }
  }
  
  var listed = [];
  if ( parsed.listed != null && parsed.listed.length > 0 ) {
    var column = parsed.listed.split(','); //1,2,3
    for ( i in column ) {
      listed.push( column[i] * 1 );
    }    
  }
  
  var cart = Cookies.get('cart');
  if ( cart ) {
    listApp.carts = JSON.parse( cart );
  }
    
  
  getCSV( function(data) {
    items = data

    if ( listed && listed.length > 0 ) {
      searchApp.listed = listed;
      searchApp.hide = true;
      searchApp.searchDetail();

    } else if ( search ) {
      searchApp.searchDetail();

    } else if ( parsed.cart ) {
      searchApp.listed = listApp.carts;
      listApp.cartmode = true;
      searchApp.hide = true;
      searchApp.searchDetail();

    } else {
      searchApp.searchDetail();
    }
  });

  $(window).scroll(function() {
    var docHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    )
    if( $(window).scrollTop() + $(window).height() > docHeight - listApp.scrollsBefore ) {
      loadMore();
    }
  });
});

function copyLink() {
  var copyText = document.getElementById("linkinput");
  copyText.select();
  document.execCommand("copy");
  createAlert('링크복사','','링크가 복사되었습니다. 공유해보세요','info',false,true,'pageMessages');
}

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


function setItems( filtered ) {
  listApp.scrolls = [];
  listApp.scrollsCurrent = 0;
  listApp.items = filtered;

  loadMore();
}

function loadMore() {
  var current = listApp.scrollsCurrent;
  for ( var i=current; i < current + listApp.scrollsSize; i++ ) {
    var item = listApp.items[i];
    if ( item != null ) {
      listApp.scrolls.push( item );
      listApp.scrollsCurrent++;
    }
  }
}


function radio( e ) {
  var ids = $(e).attr('id').split('_');
  var app = ids[0];
  var group = ids[1];
  var id = ids[2];
  // 형제들 비활성화
  clearSiblings( app, group );
  // 자신 활성화
  checkbox( e );
}

function checkbox( e ) {
  var ids = $(e).attr('id').split('_');
  var app = ids[0];
  var group = ids[1];
  var id = ids[2];

  if ( app == 'search' ) {
    searchApp[ group ][id] = !searchApp[ group ][id];
  } else if ( app == 'result' ) {
    listApp[ group ][id] = !listApp[ group ][id];
  }
}

function checkedbox( e ) {
  var ids = $(e).attr('id').split('_');
  var app = ids[0];
  var group = ids[1];
  var id = ids[2];

  if ( app == 'search' ) {
    searchApp[ group ][id].checked = !searchApp[ group ][id].checked;
  } else if ( app == 'search' ) {
    listApp[ group ][id].checked = !listApp[ group ][id].checked;
  }
}

function clearSiblings( app, group ) {
  var obj = ( app == 'search' ? searchApp[ group ] : app == 'result' ? listApp[ group ] : '' );
  for (var key in obj ) {
    if (obj.hasOwnProperty(key)) {
      obj[key]=false;
    }
  }
}

function getRadio( obj ) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if ( obj[key] ) {
        return key;
      }
    }
  }
  return null;
}

function getCheckbox( obj ) {
  var list = [];
  for ( var key in obj ) {
    if (obj.hasOwnProperty(key)) {
      if ( obj[key].checked ) {
        list.push( obj[key] );
      }
    }
  }
  return list;
}

var listApp = new Vue({
  el: '#listApp',
  data: {
    items: []
    ,carts: []
    ,cartmode: false
    ,scrolls: []
    ,scrollsCurrent: 0
    ,scrollsSize: 10
    ,scrollsBefore: 10
    ,df : 'btn btn-outline-secondary m-2 d-inline-block'
    ,sc : 'btn btn-outline-info m-2 d-inline-block active'
    ,sorttype : {
      price : false
      ,data : false
      ,promotion : false
    }
  }
  ,methods: {
    checkCart( id ) {
      var cookie = Cookies.get('cart');
      if ( cookie != null ) {
        var cart = JSON.parse( cookie );
        return cart.includes ( id*1 );
      }

      return false;
    }
    ,carting( id ) {
      var cookie = Cookies.get('cart');
      var cart = [];
      if ( cookie == null ) {
        cart = [];
      } else {
        cart = JSON.parse( cookie );
      }

      if ( this.checkCart( id ) ) {
        cart.splice( cart.indexOf( id*1 ), 1 );
      } else {
        cart.push (id*1);
      }

      this.carts = cart;
      Cookies.set( 'cart', cart, { expires: 7 } );

      if ( this.cartmode ) {
        var filted = this.items.filter( function( item ) {
          if ( cart.includes( item.id*1 ) ) {
            return true;
          }
        });
        setItems( filted );
      }

      createAlert('장바구니','','장바구니는 7일간 유효합니다','info',false,true,'pageMessages');
    }
    ,sortOption : function( sorttype ) {
      var sorted = this.items;
      if ( sorttype == null ) {
        sorttype = getRadio( this['sorttype'] );
      }

      // 정렬 필드
      if ( sorttype == 'price' ) {
        sorted.sort(function(a, b) {
            return a[sorttype] - b[sorttype];
        });
      } else if ( sorttype == 'data' ) {
        sorted.sort(function(a, b) {
            return b['data_total'] - a['data_total'];
        });
      } else if ( sorttype == 'promotion' ) {
        sorted.sort(function(a, b) {
            return a['promotion_discount'] - b['promotion_discount'];
        });
      }

      setItems( sorted );
    }
  }
});



var searchApp = new Vue({
  el: '#searchApp',
  data: {
    df : 'btn btn-outline-secondary m-2'
    ,sc : 'btn btn-outline-info m-2 active'
    ,hide: false
    ,listed: [
    ]
    ,search: searchOptions
  }
  ,methods: {
    searchChecked( item ) {
      item.checked = !item.checked;
      this.searchDetail();
    }
    ,searchDetail() {
      var filted = items;

      var listed = this.listed;
      if ( listed && listed.length > 0 ) {
        filted = filted.filter( function( item ) {
          if ( listed.includes( item.id*1 ) ) {
            return true;
          }
        });
        setItems( filted );
        return;
      }

      var simples = this.search.simple;

      simples.forEach(function(simple) {
        if (simple.checked == false)
            return;

        if (simple.id = 'infinity') {
            filted = filted.filter( function( item ) {
                if ( item.call_amount < 0 ) return true;
            });

        } else if (simple.id = 'cheap') {
            filted = filted.filter( function( item ) {
                if ( item.price <= 10000 )
                  return true;
            })

        } else if (simple.id = 'event') {
            filted = filted.filter( function( item ) {
                if ( item.promotion )
                  return true;
            })

        } else if (simple.id = 'data') {
            filted = filted.filter( function( item ) {
                if ( item.data_daily_offer )
                  return true;
                else if ( item.data_infinity )
                  return true;
            })

        } else if (simple.id = 'card'   ) {
            filted = filted.filter( function( item ) {
                if ( item.card1 )
                  return true;
                else if ( item.data_infinity )
                  return true;
            })
        }
      })


      var agency = getCheckbox( this.search['agency'] );
      var network = getCheckbox( this.search['network'] );
      var data = getCheckbox( this.search['data'] );
      var datainfinity = getCheckbox( this.search['datainfinity'] );
      var call = getCheckbox( this.search['call'] );

      /*
      // 이름으로 필터링
      filted = filted.filter( function ( item ) {
        return item.title == '이야기 데이터 11GB';
      });
      */

      if ( agency && agency.length > 0 ) {
        filted = filted.filter( function( item ) {
          for ( var i in agency ) {
            return item.agency.toUpperCase() == agency[i].id.toUpperCase();
          }
        });
      }

      if ( network && network.length > 0 ) {
        filted = filted.filter( function( item ) {
          if ( item.network == '3G/LTE' ) {
            return true;
          }
          for ( var i in network ) {
            if ( item.network.toUpperCase() == network[i].id.toUpperCase() ) {
              return true;
            }
          }
        });
      }

      if ( data && data.length > 0 ) {
        filted = filted.filter( function( item ) {
          for (var i in data) {
            if ( item.data_total >= data[i].from && item.data_total <= data[i].to ) {
              return true;
            }
          }
        });
      }

      if ( datainfinity != null && datainfinity.length > 0 ) {
        filted = filted.filter( function( item ) {
          for (var i in datainfinity) {
            var matching = datainfinity[i].matching;
            var field = datainfinity[i].field;
            var targetValue = item[ field ];
            if ( matching.includes( targetValue ) ) {
              return true;
            }
          }
        });
      }

      if ( call && call.length > 0 ) {
        filted = filted.filter( function( item ) {
          for (var i in call) {
            if ( item.call_amount >= call[i].from && item.call_amount <= call[i].to ) {
              return true;
            }
          }
        });
      }
      
      // 검색 조건 url에 저장
      url_params = '?search='
      for (var i = 0; i < simples.length; i++) {
        if (simples[i].checked == true)
            url_params += 'simple_' + i + ','
      }

      for (var i = 0; i < agency.length; i++) {
        if (agency[i].checked == true)
            url_params += 'agency_' + i + ','
      }

      for (var i = 0; i < network.length; i++) {
        if (network[i].checked == true)
            url_params += 'network_' + i + ','
      }

      for (var i = 0; i < data.length; i++) {
        if (data[i].checked == true)
            url_params += 'data_' + i + ','
      }

      for (var i = 0; i < datainfinity.length; i++) {
        if (datainfinity[i].checked == true)
            url_params += 'datainfinity_' + i + ','
      }

      for (var i = 0; i < call.length; i++) {
        if (call[i].checked == true)
            url_params += 'call_' + i + ','
      }

      console.log(url_params)
      window.history.replaceState({}, '', '/result'+url_params)

      setItems( filted );
    }
  }
});


function createAlert(title, summary, details, severity, dismissible, autoDismiss, appendToId) {
  var iconMap = {
    info: "fa fa-info-circle",
    success: "fa fa-thumbs-up",
    warning: "fa fa-exclamation-triangle",
    danger: "fa ffa fa-exclamation-circle"
  };

  var iconAdded = false;

  var alertClasses = ["alert", "animated", "flipInX"];
  alertClasses.push("alert-" + severity.toLowerCase());

  if (dismissible) {
    alertClasses.push("alert-dismissible");
  }

  var msgIcon = $("<i />", {
    "class": iconMap[severity] // you need to quote "class" since it's a reserved keyword
  });

  var msg = $("<div />", {
    "class": alertClasses.join(" ") // you need to quote "class" since it's a reserved keyword
  });

  if (title) {
    var msgTitle = $("<h4 />", {
      html: title
    }).appendTo(msg);

    if(!iconAdded){
      msgTitle.prepend(msgIcon);
      iconAdded = true;
    }
  }

  if (summary) {
    var msgSummary = $("<strong />", {
      html: summary
    }).appendTo(msg);

    if(!iconAdded){
      msgSummary.prepend(msgIcon);
      iconAdded = true;
    }
  }

  if (details) {
    var msgDetails = $("<p />", {
      html: details
    }).appendTo(msg);

    if(!iconAdded){
      msgDetails.prepend(msgIcon);
      iconAdded = true;
    }
  }


  if (dismissible) {
    var msgClose = $("<span />", {
      "class": "close", // you need to quote "class" since it's a reserved keyword
      "data-dismiss": "alert",
      html: "<i class='fa fa-times-circle'></i>"
    }).appendTo(msg);
  }

  $('#' + appendToId).prepend(msg);

  if(autoDismiss){
    setTimeout(function() {
      msg.addClass("flipOutX");
      setTimeout(function(){
        msg.remove();
      },500);
    }, 500);
  }
}

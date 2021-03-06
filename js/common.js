function getCSV( callback ) {
  /*
  var url = "/data"
  $.get( url, function( data, status ) {
    callback(data);
  });
  */
  callback(data)
}



var isEmpty = function(value){ if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){ return true }else{ return false } };



function getCSV_old( callback ) {
  var url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWze7qOfMnYJC-KZBlSmLpmut8hARDX4zS_rAbRraECdgQ7GDVu5wOvqIu7uUrksyZoEzwH3Lt5K2K/pub?gid=562347642&single=true&output=csv"
  $.get( url, function( data, status ) {
    var json = $.csv.toObjects( data );
    items = json;
    callback();
  });
}




var searchOptions = {
  simple : [
    {
      label: '음성 무제한',
      id: 'infinity',
      checked: false,
    },
    {
      label: '1만원 이하',
      id: 'cheap',
      checked: false,
    },
    /*
    {
      label: '프로모션',
      id: 'event',
      checked: false,
    },
    //*/
    {
      label: '데이터 무제한',
      id: 'data',
      checked: false,
    },
    /*
    {
      label: '제휴카드',
      id: 'card',
      checked: false,
    }
    //*/
  ]
  ,agency : [
    {
      label: 'SKT',
      id: 'skt',
      checked: false,
    },
    {
      label: 'KT',
      id: 'kt',
      checked: false,
    },
    {
      label: 'LG U+',
      id: 'lg',
      checked: false,
    }
  ]
  ,network : [
    {
      label: '3G',
      id: '3g',
      checked: false
    },
    {
      label: 'LTE',
      id: 'lte',
      checked: false
    }
  ]
  ,data : [
    {
      id: 'data0',
      label: '데이터 없음',
      field:'data',
      from: 0,
      to: 0,
      checked: false
    },
    {
      id: 'data1',
      label: '300M이하',
      field:'data',
      from: 1,
      to: 300,
      checked: false
    },
    {
      id: 'data2',
      label: '500M이하',
      field:'data',
      from: 301,
      to: 500,
      checked: false
    },
    {
      id: 'data3',
      label: '750M이하',
      field:'data',
      from: 501,
      to: 750,
      checked: false
    },
    {
      id: 'data4',
      label: '1G이하',
      field:'data',
      from: 751,
      to: 1024,
      checked: false
    },
    {
      id: 'data5',
      label: '1.5G이하',
      field:'data',
      from: 1025,
      to: 1536,
      checked: false
    },
    {
      id: 'data6',
      label: '2G이하',
      field:'data',
      from: 1537,
      to: 2048,
      checked: false
    },
    {
      id: 'data7',
      label: '3G이하',
      field:'data',
      from: 2049,
      to: 3072,
      checked: false
    },
    {
      id: 'data8',
      label: '6G이하',
      field:'data',
      from: 3073,
      to: 6144,
      checked: false
    },
    {
      id: 'data9',
      label: '10G이하',
      field:'data',
      from: 6145,
      to: 10240,
      checked: false
    },
    {
      id: 'data10',
      label: '11G이상',
      field:'data',
      from: 10241,
      to: 1024000,
      checked: false
    }
  ]
  ,datainfinity : [
    {
      id: 'datainfinity0',
      label: '매일 제공',
      field:'data_daily_offer',
      matching:['1G', '2G', '5G'],
      checked: false
    },
    {
      id: 'datainfinity1',
      label: '소진 후 2~10Mbps',
      field:'data_infinity',
      matching:['2Mbps', '3Mbps', '5Mbps', '10Mbps'],
      checked: false
    },
    {
      id: 'datainfinity2',
      label: '소진 후 2~400Kbps',
      field:'data_infinity',
      matching:['200Kbps', '400Kbps'],
      checked: false
    }
  ]
  ,call : [
    {
      id: 'call0',
      label: '통화 없음',
      field:'call',
      from: 0,
      to: 0,
      checked: false
    },
    {
      id: 'call1',
      label: '60분이하',
      field:'call',
      from: 1,
      to: 60,
      checked: false
    },
    {
      id: 'call2',
      label: '100분이하',
      field:'call',
      from: 61,
      to: 100,
      checked: false
    },
    {
      id: 'call3',
      label: '180분이하',
      field:'call',
      from: 101,
      to: 180,
      checked: false
    },
    {
      id: 'call4',
      label: '300분이하',
      field:'call',
      from: 181,
      to: 300,
      checked: false
    },
    {
      id: 'call5',
      label: '330분이상',
      field:'call',
      from: 301,
      to: 10000,
      checked: false
    },
    {
      id: 'call6',
      label: '무제한',
      field:'call',
      from: -1,
      to: -1,
      checked: false
    }
  ]
}

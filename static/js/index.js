var searchApp = new Vue({
  delimiters: ['${$', '$}$'],
  el: '#searchApp',
  data: {
    df : 'btn btn-outline-secondary m-2'
    ,sc : 'btn btn-outline-info m-2 active'
    ,display: ''
    ,baseurl: 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query='
    ,search: searchOptions
  }
  ,methods: {
    searchSimple() {
      this.clearAll( 'agency' );
      this.clearAll( 'network' );
      this.clearAll( 'data' );
      this.clearAll( 'datainfinity' );
      this.clearAll( 'call' );      
      window.location.href = '/result?' + this.makeParams();
    }
    ,searchDetail() {
      this.clearAll( 'simple' );      
      window.location.href = '/result?' + this.makeParams();
    }
    ,clearAll( key ) {
      var list = this.search[key];
      for ( i in list ) {
        list[i].checked = false;
      }
    }
    ,makeParams() {
      var params = "search=";      
      for (var search in this.search ) {
        var key = this.search[search];
        for ( i in key ) {
          if ( key[i].checked ) {
            params += search + '_' + i + ',';
          }
        }
      }
      params = params.substring(0, params.length - 1);
      return params;
    }
  }
});

( function( window , fun ){
    
    if ( typeof define === "function" && define.amd ) {

        define( [] , function () {  return fun(); } );

    }else{

        window.ProgressBar = fun();

    }

} )( window , function( undefined ){

    var ProgressBar = function( params ){
        return this.init( params );
    }

    ProgressBar.fn = ProgressBar.prototype = {

        init : function( params ){
            this.params = {
                maxPercent : 100, // 最大百分比
                count : undefined, // 数量
                excursion : 1, // 偏移量
                excursionTimeSpan : 500, //便宜间隔 毫秒
                isExcursion : false, // 是否开启偏移
                callBack : undefined, // 偏移回掉
            }

            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    this.params[ key ] = params[key];                  
                }
            }

            if( !this.params[ "count" ] )
                throw new Error( 'count param is not defined.' );
            if( !this.params[ "excursion" ] )
                throw new Error( 'excursion param is not defined.' );

            this.percent = this.params.maxPercent / this.params.count; // 当前百分比
            this.currentPercent = 0; // 当前进度
            this.currentExcursion = 0; // 当前偏移量

            if( this.params[ "isExcursion" ] )
                this.startExcursion();

        },
        done : function(){
            var resultProgress = Math.round( this.currentPercent += this.percent );
            if( resultProgress >= this.params.maxPercent ){
                this.startExcursionCallBack( this.params.maxPercent );
                this.removeExcursionInterval();
                return this.params.maxPercent;
            }
            return resultProgress;
        },
        moveExcursion : function(){
            var resultExcursion = Math.round( this.currentExcursion += ( this.currentPercent + this.params.excursion ) );
            if( resultExcursion >= this.params.maxPercent ){
                resultExcursion = this.params.maxPercent;
                this.startExcursionCallBack( resultExcursion - 2 );
                this.removeExcursionInterval();
                return resultExcursion;
            }      
            this.startExcursionCallBack( resultExcursion );       
            return resultExcursion;
        },
        startExcursion : function(){
            var that = this;
            this.excursionInterval = setInterval( function(){
                that.moveExcursion();         
            } , this.params.excursionTimeSpan );
        },
        startExcursionCallBack : function( resultExcursion ){
            if( this.params.callBack )
                this.params.callBack.call( this , resultExcursion );   
        },
        removeExcursionInterval : function(){
            clearInterval( this.excursionInterval );
        }

    }

    return ProgressBar;

})
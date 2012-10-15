/* AD ID: %eaid! */

var wpAd = window.wpAd || {};

(function(win, doc, wpAd, $){
  
  'use strict';

  if(!$){
    return false;
  }
  
  //add bind method if browser does not natively support it:
  if(!Function.prototype.bind)Function.prototype.bind=function(oThis){if(typeof this!=="function")throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var aArgs=Array.prototype.slice.call(arguments,1),fToBind=this,FNOP=function(){},fBound=function(){return fToBind.apply(this instanceof FNOP&&oThis?this:oThis,aArgs.concat(Array.prototype.slice.call(arguments)));};FNOP.prototype=this.prototype;fBound.prototype=new FNOP();return fBound;};
  
  function Promo(options){
    for(var key in options){
      if(options.hasOwnProperty(key)){
        this[key] = options[key];
      }
    }
    
    return this.addEvents().detectCreativeType().buildCreative();
  }
  
  Promo.prototype.appendToNav = function(){
    $(doc.createElement('div')).addClass('nav-promo-tile').css({
      display: 'block',
      height: this.height + 'px',
      margin: '5px auto auto -7px',
      overflow: 'hidden',
      width: this.width + 'px'
    }).append(this.creative).appendTo('#main-nav div.subnav');
    return this;
  };

  Promo.prototype.onFirstMouseOver = function(){
    $('#main-nav li.top').unbind('mouseover.PromoTile');
    this.appendToNav().addPixel(this.impressionPixel, 'promo tile impression').addPixel(this.clientPixel, 'promo tile impression');
  };
  
  Promo.prototype.addPixel = function(url){
    if(url){
      $(doc.createElement('img')).attr({
        'width': '1',
        'height': '1',
        'src': url.replace(/\[timestamp\]|\[random\]/gi, Math.floor(Math.random()*1E9)),
        'alt': arguments[1] || 'pixel'
      }).css({
        'border': '0',
        'display': 'none'
      }).appendTo('body');
    }
    return this;
  };

  Promo.prototype.detectCreativeType = function(){
    if(/\.swf$/i.test(this.creativeURL)){
      this.type = 'flash';
    } else if(/\.html$|\.htm$/i.test(this.creativeURL)){
      this.type = 'iframe';
    } else {
      this.type = 'image';
    }
    return this;
  };

  Promo.prototype.buildCreative = function(){
    if(this.type === 'image'){
      this.creative = this.buildImageCreative(this.creativeURL);
    } else if(this.type === 'flash'){
      if(this.getflashver()){
        this.creative = this.buildFlashCreative();
      } else{
        this.creative = this.buildImageCreative(this.backupURL);
      }
    } else if(this.type === 'image'){
      this.creative = this.buildIframeCreative(this.creativeURL);
    }
    return this;
  };

  Promo.prototype.buildImageCreative = function(url){
    var a = doc.createElement('a');      
    a.href = this.clickTag;
    a.target = '_blank';
    
    $(doc.createElement('img')).attr({
      src: url,
      width: this.width,
      height: this.height,
      alt: 'click here for more information'
    }).css({
      border: '0'
    }).appendTo(a);
    
    return a;
  };
  
  Promo.prototype.buildIframeCreative = function(){
    return $(doc.createElement('iframe')).attr({
      src: this.creativeURL,
      frameBorder: '0',
      height: this.height,
      width: this.width,
      scrolling: 'no',
      marginHeight: '0',
      marginWidth: '0'
    }).css({
      height: this.height + 'px',
      width: this.width + 'px',
      border: '0',
      outline: '0'
    })[0];
  };
  
  Promo.prototype.buildFlashCreative = function(){
    return $('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="'+ this.width +'" height="'+ this.height +'" style="outline:none;">' +
      '<param name="movie" value="' + this.creativeURL + '" />' +
      '<param name="quality" value="high" />' +
      '<param name="play" value="true" />' +
      '<param name="wmode" value="transparent" />' +
      '<param name="allowScriptAccess" value="always" />' +
      '<param name="flashvars" value="clickTag=' + encodeURIComponent(this.clickTag) + '" />' +
      '<!--[if !IE]>-->' +
        '<object type="application/x-shockwave-flash" data="' + this.creativeURL + '" width="'+ this.width +'" height="'+ this.height +'" style="outline:none;">' +
          '<param name="movie" value="' + this.creativeURL + '" />' +
          '<param name="quality" value="high" />' +
          '<param name="play" value="true" />' +
          '<param name="wmode" value="transparent" />' +
          '<param name="allowScriptAccess" value="always" />' +
          '<param name="flashvars" value="clickTag=' + encodeURIComponent(this.clickTag) + '" />' +
        '</object>' +
      '<!--<![endif]-->' +
    '</object>')[0];
  };
  
  Promo.prototype.addEvents = function(){
    $('#main-nav li.top').not('li.jobs, li.realestate, li.classifieds').hover(function(){
      $('div.nav-promo-tile', this).css({'visibility': 'visible'});
    }, function(){
      $('div.nav-promo-tile', this).css({'visibility': 'hidden'});
    }).bind('mouseover.PromoTile', this.onFirstMouseOver.bind(this));
    
    return this;
  };
  
  Promo.prototype.getflashver = function(){
    var i,a,o,p,s="Shockwave",f="Flash",t=" 2.0",u=s+" "+f,v=s+f+".",rSW=new RegExp("^"+u+" (\\d+)");
    if((o=navigator.plugins)&&(p=o[u]||o[u+t])&&(a=p.description.match(rSW)))return a[1];
    else if(!!(win.ActiveXObject))for(i=10;i>0;i--)try{if(!!(new win.ActiveXObject(v+v+i)))return i;}catch(e){}
    return 0;
  };
  
  wpAd.promoTile = new Promo({
    creativeURL: '[%Creative%]' || '[%Creative URL%]',
    backupURL: '[%Backup Image%]',
    width: [%Width%],
    height: [%Height%],
    clickTag: '%c%u',
    impressionPixel: '%i/%h/dot.gif',
    clientPixel: '[%Client Impression Pixel%]'
  });
  
})(window, document, wpAd, window.jQuery);
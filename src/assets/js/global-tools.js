! function (window, document) {
  "use strict";
  // window.fuc === undefined ? window.fuc = {} : '';

  function globalTools() {}

  /**
   * [hasClass 校验class是否存在]
   * @param  {[element]} element [元素]
   * @param  {[string]} cName [类名]
   * @return {[boolean]}
   */
  globalTools.prototype.hasClass = function (element, cName) {
    return !!element.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"))
  };

  /**
   * [addClass 添加class]
   * @param  {[element]} element [元素]
   * @param  {[string]} cName [类名]
   */
  globalTools.prototype.addClass = function (element, cName) {
    if (!this.hasClass(element, cName)) {
      element.className += " " + cName;
    }
  };

  /**
   * [removeClass 删除class]
   * @param  {[element]} element [元素]
   * @param  {[string]} cName [类名]
   */
  globalTools.prototype.removeClass = function (element, cName) {
    if (this.hasClass(element, cName)) {
      element.className = element.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), "");
    }
  };

  /**
   * [addListenerEvent 添加事件监听]
   * @param  {[string]} eventName [事件名称]
   * @param  {[element]} element [事件元素]
   * @param  {[function]} func [事件]
   */
  globalTools.prototype.addListenerEvent = function (eventName, element, func) {
    if (window.addEventListener) {
      element.addEventListener(eventName, func, false);
    } else if (window.attachEvent) {
      element.attachEvent('on' + eventName, func);
    } else {
      element['on' + eventName] = func;
    }
  };

  /**
   * [addListenerEvent 移除事件监听]
   * @param  {[string]} eventName [事件名称]
   * @param  {[element]} element [事件元素]
   * @param  {[function]} func [事件]
   */
  globalTools.prototype.removeListenerEvent = function (eventName, element, func) {
    if (window.removeEventListener) {
      element.removeEventListener(eventName, func, false);
    } else if (window.detachEvent) {
      element.detachEvent('on' + eventName, func);
    } else {
      element['on' + eventName] = '';
    }
  };

  /**
   * [getUrlParam 获取url中的参数]
   * @param {[string]} name [参数名]
   * @return {[string or null]}
   */
  globalTools.prototype.getUrlParam = function (name) {
    // 匹配目标参数
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    // 对querystring匹配目标参数
    var result = window.location.search.substr(1).match(reg) ||
      window.location.hash.split('?')[1] && window.location.hash.split('?')[1].match(reg);
    if (result != null) {
      return decodeURIComponent(result[2]);
    } else {
      return null;
    }
  };

  /**
   * [isIE 判断当前浏览器是否IE]
   * @return {[boolean]}
   */
  globalTools.prototype.isIE = function () {
    return window.ActiveXObject || "ActiveXObject" in window ? true : false;
  };

  /**
   * [eventTarget 获取鼠标事件元素]
   * @return {[element]}
   */
  globalTools.prototype.eventTarget = function (e) {
    e = e || window.event;
    return e.target || e.srcElement;
  };

  /**
   * [stopSpreadClick 阻止冒泡]
   */
  globalTools.prototype.stopSpreadClick = function (e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      window.event.cancelBubble = true;
    }
  };

  /**
   * [stopDefault 阻止默认行为]
   */
  globalTools.prototype.stopDefault = function (e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    } else {
      window.event.returnValue = false;
    }
  };

  // 判断浏览器是否支持css某属性
  globalTools.prototype.cssSupport = function (cssName) {
    var htmlStyle = document.documentElement.style;
    if (cssName in htmlStyle) return true;
    return false;
  }

  // 获取元素属性值
  globalTools.prototype.getStyle = function (obj, attr) {
    if (obj.currentStyle) {
      // IE 浏览器
      return obj.currentStyle[attr];
    } else {
      // Firefox、Chrome
      return getComputedStyle(obj, false)[attr];
    }
  }

  /**
   * [getByClassName 以class获取元素 兼容ie7+]
   * oParent：获取元素的父级对象；sClass：要获取的CLASS名（字符串）
   */
  globalTools.prototype.getByClassName = function (parent, cName) {
    //当getElementsByClassName方法可以用时，直接使用这个方法
    if (parent.getElementsByClassName) {
      return parent.getElementsByClassName(cName);
    } else {
      var aEl = parent.getElementsByTagName('*');
      var arr = [];
      for (var i = 0; i < aEl.length; i++) {
        //声明一个临时数组，把每一个元素获取过来的className存起来
        var temp = undefined;
        if (aEl[i].className.indexOf(' ')) {
          temp = aEl[i].className.split(' ');
          //在temp中找class里包括red的元素，如果存在则true。
          if (findInArr(cName, temp)) {
            arr.push(aEl[i]);
          }
        } else {
          aEl[i].className === cName ? arr.push(aEl[i]) : '';
        }
      }
      return arr;
    }
  }

  /**
   * 函数：查找item在arr中存不存在
   */
  globalTools.prototype.findInArr = function (item, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === item) {
        return true;
      }
    }
    return false;
  }

  /**
   * [getClassParent 以class查找父元素]
   * @param  {[element]} element [当前元素]
   * @param  {[string]} element [需查找的class]
   */
  globalTools.prototype.getClassParent = function (element, pClass) {
    while (!hasClass(element, pClass)) {
      if (element.parentElement === document.body || element.parentElement.nodeType !== 1) {
        return false;
      }
      if (hasClass(element.parentElement, pClass)) {
        return element.parentElement;
      } else {
        element = element.parentElement;
      }
    }
    return false;
  }

  /**
   * [requestAnimationFrame 对原requestAnimationFrame兼容封装]
   */
  window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  /**
   * [window.cancelAnimationFrame 清除requestAnimationFrame兼容封装]
   */
  window.cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msRequestAnimationFrame || function (callbackId) {
      window.clearTimeout(callbackId);
    }
  })();

  window.globalTools = new globalTools();

}(window, window.document);

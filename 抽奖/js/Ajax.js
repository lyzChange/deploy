//JavaScript Document

/**
 *    Ajax操作
 */
var __ajaxObj__ = {};
var __ajaxId__ = 1;
function Ajax() {
    this.name = 'Ajax';
    this.httpReq = false;//ajax初始化对象
    this.syn = true;//是否采用异步请求，默认true
    this.url = '';//提交异步请求的url地址
    this.callback = '';//异步请求完成后的回滚函数
    this.readystate = -1;//ajax的请求状态
    this.state = -1;//http请求响应代码
    this.owner = '';//调用主体
    this.data = '';//发送的数据
    this.header = null;
    //this.count = 0;
}

Ajax.prototype.get = function (url, callback, owner) {
    this.init();
    this.setUrl(url);
    this.setCallback(callback);//alert('send');this.callback('return');return;
    if (owner) {
        this.setOwner(owner);
    }
    this.send('get');
    this.onReadyStateChange();
    this.callbackState();
}

Ajax.prototype.post = function (url, data, callback, owner) {
    this.init();
    this.setUrl(url);
    this.setData(data);
    this.setCallback(callback);
    if (owner) {
        this.setOwner(owner);
    }

    this.send('post');
    this.onReadyStateChange();
    this.callbackState();
}

/**
 *    xml解析,创建dom
 */
Ajax.prototype.creatDom = function (xmlString, ecrypt) {
    var __xmldoc = new DOMParser();
    __xmldoc.async = "false";
    try {
        __xmldoc = __xmldoc.parseFromString(xmlString, "text/xml");
    } catch (e) {
        console.log('creatDomError:' + e);
    }
    return __xmldoc;
}

Ajax.prototype.xml2json = function (xmlString) {
    var __xmldoc = this.creatDom(xmlString);
    var __root = __xmldoc.documentElement;
    var __json = null;
    this.clearText(__root);
    if (__root.hasChildNodes()) {
        __json = this.getDomString(__root);
    }
    return __json;
}

Ajax.prototype.clearText = function (node) {
    if (node.hasChildNodes()) {
        var __data = node.childNodes;
        for (var i = 0; i < __data.length; i++) {
            if (__data[i].nodeName == '#text') {
                node.removeChild(__data[i]);
            }
        }
        __data = node.childNodes;
        for (var i = 0; i < __data.length; i++) {
            this.clearText(__data[i]);
        }
    }
}

Ajax.prototype.getDomString = function (node) {
    var __str = '';
    if (node.attributes.length != 0) {
        var __data = node.attributes;
        __str += '{"' + node.nodeName + '":' + '{"attr":{';
        for (var i = 0; i < __data.length; i++) {
            if (i == 0) {
                __str += '"' + __data[i].nodeName + '":"' + __data[i].nodeValue + '"';
            } else {
                __str += ',"' + __data[i].nodeName + '":"' + __data[i].nodeValue + '"';
            }
        }
        __str += '},';
        if (node.hasChildNodes()) {
            __data = node.childNodes;
            if (__data.length > 1 && __data[0].nodeName == __data[1].nodeName) {
                __str += '"' + __data[1].nodeName + 's":[';
                for (var i = 0; i < __data.length; i++) {
                    if (i == 0) {
                        if (__data[i].childNodes.length > 1) {
                            __str += this.getDomString(__data[i]);
                        } else {
                            __str += '"' + __data[i].nodeName + '":"' + __data[i].textContent + '"';
                        }
                    } else {
                        if (__data[i].childNodes.length > 1) {
                            __str += ',' + this.getDomString(__data[i]);
                        } else {
                            __str += ',"' + __data[i].nodeName + '":"' + __data[i].textContent + '"';
                        }
                    }
                }
                __str += ']}}';
            } else {
                for (var i = 0; i < __data.length; i++) {
                    if (i == 0) {
                        if (__data[i].childNodes.length > 1) {
                            __str += this.getDomString(__data[i]);
                        } else {
                            __str += '"' + __data[i].nodeName + '":"' + __data[i].textContent + '"';
                        }
                    } else {
                        if (__data[i].childNodes.length > 1) {
                            __str += ',' + this.getDomString(__data[i]);
                        } else {
                            __str += ',"' + __data[i].nodeName + '":"' + __data[i].textContent + '"';
                        }
                    }
                }
                __str += '}}';
            }
        } else {
            __str += '{"' + node.nodeName + '":"' + node.textContent + '"}';
        }
    } else {
        if (node.hasChildNodes()) {
            __data = node.childNodes;
            if (__data.length > 1 && __data[0].nodeName == __data[1].nodeName) {
                __str += '{"' + __data[1].nodeName + 's":[';
                for (var i = 0; i < __data.length; i++) {
                    if (i == 0) {
                        if (__data[i].childNodes.length > 1) {
                            __str += this.getDomString(__data[i]);
                        } else {
                            __str += '"' + __data[i].nodeName + '":"' + __data[i].textContent + '"';
                        }
                    } else {
                        if (__data[i].childNodes.length > 1) {
                            __str += ',' + this.getDomString(__data[i]);
                        } else {
                            __str += ',"' + __data[i].nodeName + '":"' + __data[i].textContent + '"';
                        }
                    }
                }
                __str += ']}';
            } else {
                __str += '{"' + node.nodeName + '":' + '{';
                for (var i = 0; i < __data.length; i++) {
                    if (i == 0) {
                        if (__data[i].childNodes.length > 1) {
                            __str += this.getDomString(__data[i]);
                        } else {
                            __str += '"' + __data[i].nodeName + '":"' + __data[i].textContent + '"';
                        }
                    } else {
                        if (__data[i].childNodes.length > 1) {
                            __str += ',' + this.getDomString(__data[i]);
                        } else {
                            __str += ',"' + __data[i].nodeName + '":"' + __data[i].textContent + '"';
                        }
                    }
                }
                __str += '}}';
            }
        } else {
            __str += '{"' + node.nodeName + '":"' + node.textContent + '"}';
        }
    }
    return __str;
}

/**
 *    字符串特殊字符过滤
 */
Ajax.prototype.stringFilter = function (string) {
    var __result = string;
    __result = __result.replace(/\"/g, '&quot;');
    __result = __result.replace(/\r\n|\n/g, '');
    return __result;
}

//初始化ajax对象
Ajax.prototype.init = function () {
    if (window.XMLHttpRequest) {
        this.httpReq = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            this.httpReq = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                this.httpReq = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                console.log('ajax init faild');
            }
        }
    }
    try{
        //
        if (this.httpReq){
            this.count = __ajaxId__;
            __ajaxObj__[__ajaxId__++] = this.httpReq;
        }
    }catch (e){
        console.log('ajax init error:' + e);
    }
}

//设置http请求头部信息
Ajax.prototype.setHeader = function (opt) {
    /*
     * opt={key1:value1,key2:value2}
     * */
    this.header = opt;
}

//发送一个http请求
Ajax.prototype.send = function (type) {
    this.httpReq.open(type, this.url, this.syn);
    if (type == 'post') {
        this.httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //强制禁用缓存
        this.httpReq.setRequestHeader('Cache-Control', 'no-cache');
        this.httpReq.setRequestHeader('If-Modified-Since', '0');
        for (var item in this.header) {
            this.httpReq.setRequestHeader(item, this.header[item]);
        }
        this.httpReq.send(this.data);
    } else {
        this.httpReq.send();
    }
}

Ajax.prototype.callbackState = function () {
    switch (this.httpReq.readyState) {
        case 4:
            this.readystate = 4;
            try{
                //
                delete __ajaxObj__[this.count];
            }catch(e){console.log(e)}
            switch (this.httpReq.status) {
                case 200:
                    if (this.owner) {
                        this.callback.call(this.owner, this.httpReq.responseText);
                    } else {
                        this.callback(this.httpReq.responseText);
                    }
                    break;
                default:
                    console.log(this.httpReq.status)
                    this.status("返回数据失败," + this.httpReq.status);
                    break;
            }
            break;
        default:
            this.readystate = 0;
            break;
    }
}

Ajax.prototype.onReadyStateChange = function () {
    var __owner = this;
    this.httpReq.onreadystatechange = function () {
        __owner.callbackState.call(__owner);
    }
}

//设置提交异步请求的url地址
Ajax.prototype.setUrl = function (url) {
    this.url = url;
}

//设置回滚函数
Ajax.prototype.setCallback = function (func) {
    this.callback = func;
}

//设置是否异步
Ajax.prototype.setSyn = function (syn) {
    this.syn = syn;
}

//设置发送数据
Ajax.prototype.setData = function (data) {
    this.data = data;
}

Ajax.prototype.setOwner = function (owner) {
    this.owner = owner;
}

//调用window.status的方法
Ajax.prototype.status = function (msg) {
    window.status = msg;
}

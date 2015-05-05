/*
 * Copyright (c) 2014,egret.com
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the egret.com nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret {

    /**
     * @class egret.Texture
     * @classdesc 纹理类是对不同平台不同的图片资源的封装
     * 在HTML5中，资源是一个HTMLElement对象
     * 在OpenGL / WebGL中，资源是一个提交GPU后获取的纹理id
     * Texture类封装了这些底层实现的细节，开发者只需要关心接口即可
     * @link
        * http://docs.egret-labs.org/post/manual/bitmap/textures.html 纹理集的使用
     * http://docs.egret-labs.org/post/manual/loader/getres.html 获取资源的几种方式
     */
    export class Texture extends HashObject {

        /**
         * 创建一个 egret.Texture 对象
         */
        public constructor() {
            super();
        }

        /**
         * 表示这个纹理在 bitmapData 上的 x 起始位置
         */
        public _bitmapX:number = 0;
        /**
         * 表示这个纹理在 bitmapData 上的 y 起始位置
         */
        public _bitmapY:number = 0;
        /**
         * 表示这个纹理在 bitmapData 上的宽度
         */
        public _bitmapWidth:number = 0;
        /**
         * 表示这个纹理在 bitmapData 上的高度
         */
        public _bitmapHeight:number = 0;

        /**
         * 表示这个纹理显示了之后在 x 方向的渲染偏移量
         */
        public _offsetX = 0;
        /**
         * 表示这个纹理显示了之后在 y 方向的渲染偏移量
         */
        public _offsetY = 0;

        /**
         * 纹理宽度
         */
        public _textureWidth:number = 0;

        /**
         * 纹理宽度
         * @member {number} egret.Texture#textureWidth
         */
        public get textureWidth():number {
            return this._textureWidth;
        }

        /**
         * 纹理高度
         */
        public _textureHeight:number = 0;

        /**
         * 纹理高度
         * @member {number} egret.Texture#textureHeight
         */
        public get textureHeight():number {
            return this._textureHeight;
        }

        /**
         * 表示bitmapData.width
         */
        public _sourceWidth:number = 0;
        /**
         * 表示bitmapData.height
         */
        public _sourceHeight:number = 0;

        public _bitmapData:any = null;

        public _setBitmapData(value:any) {
            var scale = egret.MainContext.instance.rendererContext._texture_scale_factor;
            this._bitmapData = value;
            this._sourceWidth = value.width;
            this._sourceHeight = value.height;
            this._textureWidth = this._sourceWidth * scale;
            this._textureHeight = this._sourceHeight * scale;
            this._bitmapWidth = this._textureWidth;
            this._bitmapHeight = this._textureHeight;
            this._offsetX = this._offsetY = this._bitmapX = this._bitmapY = 0;
        }

        /**
         * 获取某一点像素的颜色值
         * @method egret.Texture#getPixel32
         * @param x {number} 像素点的X轴坐标
         * @param y {number} 像素点的Y轴坐标
         * @returns {number} 指定像素点的颜色值
         */
        public getPixel32(x:number, y:number):number[] {
            var result:any = this._bitmapData.getContext("2d").getImageData(x, y, 1, 1);
            return result.data;
        }

        public dispose():void {
            var bitmapData = this._bitmapData;
            if (bitmapData.dispose) {
                bitmapData.dispose();
            }
        }

        public _clone():Texture {
            var texture = new Texture();
            texture._bitmapData = this._bitmapData;
            return texture;
        }

        public draw(context:any, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, renderType) {

        }

        public _drawForCanvas(context:CanvasRenderingContext2D, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, renderType) {

            var bitmapData = this._bitmapData;
            if (!bitmapData["avaliable"]) {
                return;
            }
            if (renderType != undefined) {
                this._drawRepeatImageForCanvas(context, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, renderType)
            }
            else {
                context.drawImage(bitmapData, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            }
        }

        public _drawForNative(context:any, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, renderType) {
            var bitmapData = this._bitmapData;
            if (!bitmapData["avaliable"]) {
                return;
            }
            if (renderType !== undefined) {
                this._drawRepeatImageForNative(context, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, renderType);
            }
            else {
                context.drawImage(bitmapData, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            }
        }

        public _drawRepeatImageForNative(context:any, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat) {
            var texture_scale_factor = egret.MainContext.instance.rendererContext._texture_scale_factor;
            sourceWidth = sourceWidth * texture_scale_factor;
            sourceHeight = sourceHeight * texture_scale_factor;
            for (var x:number = destX; x < destWidth; x += sourceWidth) {
                for (var y:number = destY; y < destHeight; y += sourceHeight) {
                    var destW:number = Math.min(sourceWidth, destWidth - x);
                    var destH:number = Math.min(sourceHeight, destHeight - y);
                    this._drawForNative(context, sourceX, sourceY, destW / texture_scale_factor, destH / texture_scale_factor, x, y, destW, destH, undefined);
                }
            }
        }

        public _drawRepeatImageForCanvas(context:CanvasRenderingContext2D, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat) {
            if (this['pattern'] === undefined) {
                var texture_scale_factor = egret.MainContext.instance.rendererContext._texture_scale_factor;
                var image = this._bitmapData;
                var tempImage:HTMLElement = image;
                if (image.width != sourceWidth || image.height != sourceHeight || texture_scale_factor != 1) {
                    var tempCanvas = document.createElement("canvas");
                    tempCanvas.width = sourceWidth * texture_scale_factor;
                    tempCanvas.height = sourceHeight * texture_scale_factor;
                    tempCanvas.getContext("2d").drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth * texture_scale_factor, sourceHeight * texture_scale_factor);
                    tempImage = tempCanvas;
                }
                var pat = context.createPattern(tempImage, repeat);
                this['pattern'] = pat;
            }
            var pattern = this['pattern'];
            context.fillStyle = pattern;
            context.translate(destX, destY);
            context.fillRect(0, 0, destWidth, destHeight);
            context.translate(-destX, -destY);
        }

        public _disposeForCanvas():void {
            Texture.deleteWebGLTexture(this);
            var bitmapData = this._bitmapData;
            bitmapData.onload = null;
            bitmapData.onerror = null;
            bitmapData.src = null;
            bitmapData["avaliable"] = false;
            console.log("_disposeForCanvas");
        }

        public _disposeForNative():void {
            var bitmapData = this._bitmapData;
            bitmapData.dispose();
            bitmapData["avaliable"] = false;
            console.log("_disposeForNative");
        }

        public static deleteWebGLTexture(texture:Texture):void {
            var context = egret.MainContext.instance.rendererContext;
            var gl:WebGLRenderingContext = context["gl"];
            var bitmapData = texture._bitmapData;
            if (bitmapData) {
                var webGLTexture = bitmapData.webGLTexture;
                if (webGLTexture && gl) {
                    for (var key in webGLTexture) {
                        var glTexture = webGLTexture[key];
                        gl.deleteTexture(glTexture);
                    }
                }
                bitmapData.webGLTexture = null;
            }
        }

        public static createBitmapData(url:string, callback:(code:number, bitmapData:any)=>void):void {

        }

        public static _createBitmapDataForCanvasAndWebGl(url:string, callback:(code:number, bitmapData:any)=>void):void {
            var bitmapData:HTMLImageElement = Texture._bitmapDataFactory[url];
            if (!bitmapData) {
                bitmapData = document.createElement("img");
                bitmapData.setAttribute("bitmapSrc", url);
                Texture._bitmapDataFactory[url] = bitmapData;
            }
            if (bitmapData["avaliable"]) {//已经加载完成
                callback(0, bitmapData);
                return;
            }
            var winURL = window["URL"] || window["webkitURL"];
            if (Texture._bitmapCallbackMap[url] == null) {//非正在加载中
                Texture._addToCallbackList(url, callback);
                if (url.indexOf("http:") != 0 && url.indexOf("https:") != 0 && Browser.getInstance().isIOS() && winURL) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("get", url, true);
                    xhr.responseType = "blob";
                    xhr.onload = function () {
                        if (this.status == 200) {
                            var blob = this.response;

                            bitmapData.onload = function () {
                                winURL.revokeObjectURL(bitmapData.src); // 清除释放
                                Texture._onLoad(url, bitmapData);
                            };
                            bitmapData.onerror = function () {
                                Texture._onError(url, bitmapData);
                            };
                            bitmapData.src = winURL.createObjectURL(blob);
                        }
                        else {
                            callback(1, null);
                        }
                    };
                    xhr.send();
                }
                else {
                    bitmapData.onload = function () {
                        Texture._onLoad(url, bitmapData);
                    };
                    bitmapData.onerror = function () {
                        Texture._onError(url, bitmapData);
                    };
                    bitmapData.src = url;
                }
            }
            else {
                Texture._addToCallbackList(url, callback);
            }
        }

        public static _onLoad(url, bitmapData):void {
            bitmapData["avaliable"] = true;
            if(bitmapData.onload){
                bitmapData.onload = null;
            }
            if(bitmapData.onerror){
                bitmapData.onerror = null;
            }
            var list = Texture._bitmapCallbackMap[url];
            if (list && list.length) {
                var l = list.length;
                for (var i:number = 0; i < l; i++) {
                    var callback = list[i];
                    callback(0, bitmapData);
                }
                delete Texture._bitmapCallbackMap[url];
            }
        }

        public static _onError(url, bitmapData):void {
            var list = Texture._bitmapCallbackMap[url];
            if (list && list.length) {
                var l = list.length;
                for (var i:number = 0; i < l; i++) {
                    var callback = list[i];
                    callback(1, bitmapData);
                }
                delete Texture._bitmapCallbackMap[url];
            }
        }

        public static _createBitmapDataForNative(url:string, callback:(code:number, bitmapData:any)=>void):void {
            console.log("_createBitmapDataForNative:" + url);
            var bitmapData:any = Texture._bitmapDataFactory[url];
            if (!bitmapData) {
                if (egret["NativeNetContext"].__use_asyn) {//异步的
                    if (Texture._bitmapCallbackMap[url]) {
                        Texture._addToCallbackList(url, callback);
                    }
                    else {
                        Texture._addToCallbackList(url, callback);
                        var promise = new egret.PromiseObject();
                        promise.onSuccessFunc = function (bitmapData) {
                            Texture._bitmapDataFactory[url] = bitmapData;
                            Texture._onLoad(url, bitmapData);
                        };
                        promise.onErrorFunc = function () {
                            Texture._onError(url, null);
                        };
                        console.log("addTextureAsyn");
                        egret_native.Texture.addTextureAsyn(url, promise);
                    }
                }
                else {
                    console.log("addTexture");
                    bitmapData = egret_native.Texture.addTexture(url);
                    Texture._bitmapDataFactory[url] = bitmapData;
                    bitmapData["avaliable"] = true;
                    callback(0, bitmapData);
                }
            }
            else if (bitmapData["avaliable"]) {
                callback(0, bitmapData);
            }
            else {
                console.log("reload");
                bitmapData.reload();
                bitmapData["avaliable"] = true;
                callback(0, bitmapData);
            }
        }

        private static _addToCallbackList(url, callback) {
            var list = Texture._bitmapCallbackMap[url];
            if (!list) {
                list = [];
            }
            list.push(callback);
            Texture._bitmapCallbackMap[url] = list;
        }

        private static _bitmapDataFactory:any = {};
        private static _bitmapCallbackMap:any = {};
    }
}


declare module egret_native {


    module Texture {

        function addTexture(filePath:string):any;
        function addTextureAsyn(filePath:string, promise:any):any;
        function addTextureUnsyn(filePath:string, promise:any):any;

        function removeTexture(filePath:string):void;
    }
}
(function(){
    var root = this;
    var PIXI = PIXI || {};
    PIXI.blendModes = {
        NORMAL:0,
        ADD:1,
        MULTIPLY:2,
        SCREEN:3,
        OVERLAY:4,
        DARKEN:5,
        LIGHTEN:6,
        COLOR_DODGE:7,
        COLOR_BURN:8,
        HARD_LIGHT:9,
        SOFT_LIGHT:10,
        DIFFERENCE:11,
        EXCLUSION:12,
        HUE:13,
        SATURATION:14,
        COLOR:15,
        LUMINOSITY:16
    };
    PIXI.scaleModes = {
        DEFAULT:0,
        LINEAR:0,
        NEAREST:1
    };
    PIXI._UID = 0;
    if(typeof(Float32Array) != 'undefined') {
        PIXI.Float32Array = Float32Array;
        PIXI.Uint16Array = Uint16Array;
        PIXI.Uint32Array = Uint32Array;
        PIXI.ArrayBuffer = ArrayBuffer;
    } else {
        PIXI.Float32Array = Array;
        PIXI.Uint16Array = Array;
    }
    PIXI.INTERACTION_FREQUENCY = 30;
    PIXI.AUTO_PREVENT_DEFAULT = true;
    PIXI.PI_2 = Math.PI * 2;
    PIXI.RETINA_PREFIX = "@2x";
    PIXI.defaultRenderOptions = {
        view:null,
        transparent:false,
        antialias:false,
        preserveDrawingBuffer:false,
        resolution:1,
        clearBeforeRender:true,
        autoResize:false
    };
    PIXI.Point = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };
    PIXI.Point.prototype.clone = function() {
        return new PIXI.Point(this.x, this.y);
    };
    PIXI.Point.prototype.set = function(x, y) {
        this.x = x || 0;
        this.y = y || ( (y !== 0) ? this.x : 0 ) ;
    };
    PIXI.Point.prototype.constructor = PIXI.Point;
    PIXI.Rectangle = function(x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    };
    PIXI.Rectangle.prototype.clone = function() {
        return new PIXI.Rectangle(this.x, this.y, this.width, this.height);
    };
    PIXI.Rectangle.prototype.contains = function(x, y) {
        if(this.width <= 0 || this.height <= 0)
            return false;
        var x1 = this.x;
        if(x >= x1 && x <= x1 + this.width) {
            var y1 = this.y;
            if(y >= y1 && y <= y1 + this.height) {
                return true;
            }
        }
        return false;
    };
    PIXI.Rectangle.prototype.constructor = PIXI.Rectangle;
    PIXI.Matrix = function() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;
    };
    PIXI.Matrix.prototype.applyInverse = function(pos, newPos) {
        newPos = newPos || new PIXI.Point();
        var id = 1 / (this.a * this.d + this.c * -this.b);
        newPos.x = this.d * id * pos.x + -this.c * id * pos.y + (this.ty * this.c - this.tx * this.d) * id;
        newPos.y = this.a * id * pos.y + -this.b * id * pos.x + (-this.ty * this.a + this.tx * this.b) * id;
        return newPos;
    };
    PIXI.DisplayObject = function() {
        this.position = new PIXI.Point();
        this.scale = new PIXI.Point(1,1);//{x:1, y:1};
        this.pivot = new PIXI.Point(0,0);
        this.rotation = 0;
        this.alpha = 1;
        this.visible = true;
        this.hitArea = null;
        this.buttonMode = false;
        this.renderable = false;
        this.parent = null;
        this.stage = null;
        this.worldAlpha = 1;
        this._interactive = false;
        this.defaultCursor = 'pointer';
        this.worldTransform = new PIXI.Matrix();
        this._sr = 0;
        this._cr = 1;
        this.filterArea = null;
        this._bounds = new PIXI.Rectangle(0, 0, 1, 1);
        this._currentBounds = null;
        this._mask = null;
        this._cacheAsBitmap = false;
        this._cacheIsDirty = false;
    };
    PIXI.DisplayObject.prototype.constructor = PIXI.DisplayObject;
    PIXI.DisplayObject.prototype.updateTransform = function() {
        var pt = this.parent.worldTransform;
        var wt = this.worldTransform;
        var a, b, c, d, tx, ty;
        if(this.rotation % PIXI.PI_2) {
            if(this.rotation !== this.rotationCache) {
                this.rotationCache = this.rotation;
                this._sr = Math.sin(this.rotation);
                this._cr = Math.cos(this.rotation);
            }
            a  =  this._cr * this.scale.x;
            b  =  this._sr * this.scale.x;
            c  = -this._sr * this.scale.y;
            d  =  this._cr * this.scale.y;
            tx =  this.position.x;
            ty =  this.position.y;
            if(this.pivot.x || this.pivot.y) {
                tx -= this.pivot.x * a + this.pivot.y * c;
                ty -= this.pivot.x * b + this.pivot.y * d;
            }
            wt.a  = a  * pt.a + b  * pt.c;
            wt.b  = a  * pt.b + b  * pt.d;
            wt.c  = c  * pt.a + d  * pt.c;
            wt.d  = c  * pt.b + d  * pt.d;
            wt.tx = tx * pt.a + ty * pt.c + pt.tx;
            wt.ty = tx * pt.b + ty * pt.d + pt.ty;
        } else {
            a  = this.scale.x;
            d  = this.scale.y;
            tx = this.position.x - this.pivot.x * a;
            ty = this.position.y - this.pivot.y * d;
            wt.a  = a  * pt.a;
            wt.b  = a  * pt.b;
            wt.c  = d  * pt.c;
            wt.d  = d  * pt.d;
            wt.tx = tx * pt.a + ty * pt.c + pt.tx;
            wt.ty = tx * pt.b + ty * pt.d + pt.ty;
        }
        this.worldAlpha = this.alpha * this.parent.worldAlpha;
    };
    PIXI.DisplayObject.prototype.displayObjectUpdateTransform = PIXI.DisplayObject.prototype.updateTransform;
    PIXI.DisplayObjectContainer = function() {
        PIXI.DisplayObject.call( this );
        this.children = [];
    };
    PIXI.DisplayObjectContainer.prototype = Object.create( PIXI.DisplayObject.prototype );
    PIXI.DisplayObjectContainer.prototype.constructor = PIXI.DisplayObjectContainer;
    PIXI.DisplayObjectContainer.prototype.addChild = function(child) {
        return this.addChildAt(child, this.children.length);
    };
    PIXI.DisplayObjectContainer.prototype.addChildAt = function(child, index) {
        if(index >= 0 && index <= this.children.length) {
            if(child.parent) {
                child.parent.removeChild(child);
            }
            child.parent = this;
            this.children.splice(index, 0, child);
            if(this.stage)child.setStageReference(this.stage);
            return child;
        } else {
            throw new Error(child + 'addChildAt: The index '+ index +' supplied is out of bounds ' + this.children.length);
        }
    };
    PIXI.DisplayObjectContainer.prototype.updateTransform = function() {
        if(!this.visible)return;
        this.displayObjectUpdateTransform();
        if(this._cacheAsBitmap)return;
        for(var i=0,j=this.children.length; i<j; i++) {
            this.children[i].updateTransform();
        }
    };
    PIXI.DisplayObjectContainer.prototype.displayObjectContainerUpdateTransform = PIXI.DisplayObjectContainer.prototype.updateTransform;
    PIXI.DisplayObjectContainer.prototype.setStageReference = function(stage) {
        this.stage = stage;
        if(this._interactive)this.stage.dirty = true;
        for(var i=0,j=this.children.length; i<j; i++) {
            var child = this.children[i];
            child.setStageReference(stage);
        }
    };
    PIXI.DisplayObjectContainer.prototype._renderWebGL = function(renderSession) {
        if(!this.visible || this.alpha <= 0)return;
        if(this._cacheAsBitmap) {
            this._renderCachedSprite(renderSession);
            return;
        }
        var i,j;
        if(this._mask || this._filters) {
            if(this._filters) {
                renderSession.spriteBatch.flush();
                renderSession.filterManager.pushFilter(this._filterBlock);
            }
            if(this._mask) {
                renderSession.spriteBatch.stop();
                renderSession.maskManager.pushMask(this.mask, renderSession);
                renderSession.spriteBatch.start();
            }
            for(i=0,j=this.children.length; i<j; i++) {
                this.children[i]._renderWebGL(renderSession);
            }
            renderSession.spriteBatch.stop();
            if(this._mask)renderSession.maskManager.popMask(this._mask, renderSession);
            if(this._filters)renderSession.filterManager.popFilter();
            renderSession.spriteBatch.start();
        } else {
            for(i=0,j=this.children.length; i<j; i++) {
                this.children[i]._renderWebGL(renderSession);
            }
        }
    };
    PIXI.Sprite = function(texture) {
        PIXI.DisplayObjectContainer.call( this );
        this.anchor = new PIXI.Point();
        this.texture = texture || PIXI.Texture.emptyTexture;
        this._width = 0;
        this._height = 0;
        this.tint = 0xFFFFFF;
        this.blendMode = PIXI.blendModes.NORMAL;
        this.shader = null;
        if(this.texture.baseTexture.hasLoaded) {
            this.onTextureUpdate();
        } else {
            this.texture.on( 'update', this.onTextureUpdate.bind(this) );
        }
        this.renderable = true;
    };
    PIXI.Sprite.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
    PIXI.Sprite.prototype.constructor = PIXI.Sprite;
    PIXI.Sprite.prototype.onTextureUpdate = function() {
        if(this._width)this.scale.x = this._width / this.texture.frame.width;
        if(this._height)this.scale.y = this._height / this.texture.frame.height;
    };
    PIXI.Sprite.prototype._renderWebGL = function(renderSession) {
        if(!this.visible || this.alpha <= 0)return;
        var i,j;
        if(this._mask || this._filters) {
            var spriteBatch =  renderSession.spriteBatch;
            if(this._filters) {
                spriteBatch.flush();
                renderSession.filterManager.pushFilter(this._filterBlock);
            }
            if(this._mask) {
                spriteBatch.stop();
                renderSession.maskManager.pushMask(this.mask, renderSession);
                spriteBatch.start();
            }
            spriteBatch.render(this);
            for(i=0,j=this.children.length; i<j; i++) {
                this.children[i]._renderWebGL(renderSession);
            }
            spriteBatch.stop();
            if(this._mask)renderSession.maskManager.popMask(this._mask, renderSession);
            if(this._filters)renderSession.filterManager.popFilter();
            spriteBatch.start();
        } else {
            renderSession.spriteBatch.render(this);
            for(i=0,j=this.children.length; i<j; i++) {
                this.children[i]._renderWebGL(renderSession);
            }
        }
    };
    PIXI.SpriteBatch = function(texture) {
        PIXI.DisplayObjectContainer.call( this);
        this.textureThing = texture;
        this.ready = false;
    };
    PIXI.SpriteBatch.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    PIXI.SpriteBatch.prototype.constructor = PIXI.SpriteBatch;
    PIXI.SpriteBatch.prototype.updateTransform = function() {
        this.displayObjectUpdateTransform();
    };
    PIXI.SpriteBatch.prototype._renderWebGL = function(renderSession) {
        if(!this.visible || this.alpha <= 0 || !this.children.length)return;
        if(!this.ready)this.initWebGL( renderSession.gl );
        if(this.fastSpriteBatch.gl !== renderSession.gl) this.fastSpriteBatch.setContext(renderSession.gl);
        renderSession.spriteBatch.stop();
        renderSession.shaderManager.setShader(renderSession.shaderManager.fastShader);
        this.fastSpriteBatch.begin(this, renderSession);
        this.fastSpriteBatch.render(this);
        renderSession.spriteBatch.start();
    };
    PIXI.InteractionData = function() {
        this.global = new PIXI.Point();
        this.target = null;
        this.originalEvent = null;
    };
    PIXI.InteractionData.prototype.constructor = PIXI.InteractionData;
    PIXI.InteractionManager = function(stage) {
        this.stage = stage;
        this.mouse = new PIXI.InteractionData();
        this.touches = {};
        this.tempPoint = new PIXI.Point();
        this.mouseoverEnabled = true;
        this.pool = [];
        this.interactiveItems = [];
        this.interactionDOMElement = null;
        this.onMouseMove = this.onMouseMove.bind( this );
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchCancel = this.onTouchCancel.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.last = 0;
        this.currentCursorStyle = 'inherit';
        this.mouseOut = false;
        this.resolution = 1;
        this._tempPoint = new PIXI.Point();
    };
    PIXI.InteractionManager.prototype.constructor = PIXI.InteractionManager;
    PIXI.InteractionManager.prototype.removeEvents = function() {
        if (!this.interactionDOMElement) return;
        this.interactionDOMElement.style['-ms-content-zooming'] = '';
        this.interactionDOMElement.style['-ms-touch-action'] = '';
        this.interactionDOMElement.removeEventListener('mousemove',  this.onMouseMove, true);
        this.interactionDOMElement.removeEventListener('mousedown',  this.onMouseDown, true);
        this.interactionDOMElement.removeEventListener('mouseout',   this.onMouseOut, true);
        this.interactionDOMElement.removeEventListener('touchstart', this.onTouchStart, true);
        this.interactionDOMElement.removeEventListener('touchend', this.onTouchEnd, true);
        this.interactionDOMElement.removeEventListener('touchleave', this.onTouchCancel, true);
        this.interactionDOMElement.removeEventListener('touchcancel', this.onTouchCancel, true);
        this.interactionDOMElement.removeEventListener('touchmove', this.onTouchMove, true);
        this.interactionDOMElement = null;
        window.removeEventListener('mouseup',  this.onMouseUp, true);
    };
    PIXI.InteractionManager.prototype.update = function() {
        if (!this.target) return;
        var now = Date.now();
        var diff = now - this.last;
        diff = (diff * PIXI.INTERACTION_FREQUENCY ) / 1000;
        if (diff < 1) return;
        this.last = now;
        var i = 0;
        if (this.dirty) {
            this.rebuildInteractiveGraph();
        }
        var length = this.interactiveItems.length;
        var cursor = 'inherit';
        var over = false;
        for (i = 0; i < length; i++) {
            var item = this.interactiveItems[i];
            item.__hit = this.hitTest(item, this.mouse);
            this.mouse.target = item;
            if (item.__hit && !over) {
                if (item.buttonMode) cursor = item.defaultCursor;
                if (!item.interactiveChildren) {
                    over = true;
                }
                if (!item.__isOver) {
                    if (item.mouseover) {
                        item.mouseover (this.mouse);
                    }
                    item.__isOver = true;
                }
            } else {
                if (item.__isOver) {
                    if (item.mouseout) {
                        item.mouseout (this.mouse);
                    }
                    item.__isOver = false;
                }
            }
        }
        if (this.currentCursorStyle !== cursor) {
            this.currentCursorStyle = cursor;
            this.interactionDOMElement.style.cursor = cursor;
        }
    };
    PIXI.InteractionManager.prototype.onMouseMove = function(event) {
        if (this.dirty) {
            this.rebuildInteractiveGraph();
        }
        this.mouse.originalEvent = event;
        var rect = this.interactionDOMElement.getBoundingClientRect();
        this.mouse.global.x = (event.clientX - rect.left) * (this.target.width / rect.width) / this.resolution;
        this.mouse.global.y = (event.clientY - rect.top) * ( this.target.height / rect.height) / this.resolution;
        var length = this.interactiveItems.length;
        for (var i = 0; i < length; i++) {
            var item = this.interactiveItems[i];
            if (item.mousemove) {
                item.mousemove(this.mouse);
            }
        }
    };
    PIXI.InteractionManager.prototype.onMouseDown = function(event) {
        if (this.dirty) {
            this.rebuildInteractiveGraph();
        }
        this.mouse.originalEvent = event;
        if (PIXI.AUTO_PREVENT_DEFAULT) {
            this.mouse.originalEvent.preventDefault();
        }
        var length = this.interactiveItems.length;
        var e = this.mouse.originalEvent;
        var isRightButton = e.button === 2 || e.which === 3;
        var downFunction = isRightButton ? 'rightdown' : 'mousedown';
        var clickFunction = isRightButton ? 'rightclick' : 'click';
        var buttonIsDown = isRightButton ? '__rightIsDown' : '__mouseIsDown';
        var isDown = isRightButton ? '__isRightDown' : '__isDown';
        for (var i = 0; i < length; i++) {
            var item = this.interactiveItems[i];
            if (item[downFunction] || item[clickFunction]) {
                item[buttonIsDown] = true;
                item.__hit = this.hitTest(item, this.mouse);
                if (item.__hit) {
                    if (item[downFunction]) {
                        item[downFunction](this.mouse);
                    }
                    item[isDown] = true;
                    if (!item.interactiveChildren) break;
                }
            }
        }
    };
    PIXI.InteractionManager.prototype.onMouseOut = function(event) {
        if (this.dirty) {
            this.rebuildInteractiveGraph();
        }
        this.mouse.originalEvent = event;
        var length = this.interactiveItems.length;
        this.interactionDOMElement.style.cursor = 'inherit';
        for (var i = 0; i < length; i++) {
            var item = this.interactiveItems[i];
            if (item.__isOver) {
                this.mouse.target = item;
                if (item.mouseout) {
                    item.mouseout(this.mouse);
                }
                item.__isOver = false;
            }
        }
        this.mouseOut = true;
        this.mouse.global.x = -10000;
        this.mouse.global.y = -10000;
    };
    PIXI.InteractionManager.prototype.onMouseUp = function(event) {
        if (this.dirty) {
            this.rebuildInteractiveGraph();
        }
        this.mouse.originalEvent = event;
        var length = this.interactiveItems.length;
        var up = false;
        var e = this.mouse.originalEvent;
        var isRightButton = e.button === 2 || e.which === 3;
        var upFunction = isRightButton ? 'rightup' : 'mouseup';
        var clickFunction = isRightButton ? 'rightclick' : 'click';
        var upOutsideFunction = isRightButton ? 'rightupoutside' : 'mouseupoutside';
        var isDown = isRightButton ? '__isRightDown' : '__isDown';
        for (var i = 0; i < length; i++) {
            var item = this.interactiveItems[i];
            if (item[clickFunction] || item[upFunction] || item[upOutsideFunction]) {
                item.__hit = this.hitTest(item, this.mouse);
                if (item.__hit && !up) {
                    if (item[upFunction]) {
                        item[upFunction](this.mouse);
                    }
                    if (item[isDown]) {
                        if (item[clickFunction]) {
                            item[clickFunction](this.mouse);
                        }
                    }

                    if (!item.interactiveChildren) {
                        up = true;
                    }
                } else {
                    if (item[isDown]) {
                        if (item[upOutsideFunction]) item[upOutsideFunction](this.mouse);
                    }
                }
                item[isDown] = false;
            }
        }
    };
    PIXI.InteractionManager.prototype.onTouchMove = function(event) {
        if (this.dirty) {
            this.rebuildInteractiveGraph();
        }

        var rect = this.interactionDOMElement.getBoundingClientRect();
        var changedTouches = event.changedTouches;
        var touchData;
        var cLength = changedTouches.length;
        var wCalc = (this.target.width / rect.width);
        var hCalc = (this.target.height / rect.height);
        var isSupportCocoonJS = navigator.isCocoonJS && !rect.left && !rect.top && !event.target.style.width && !event.target.style.height;
        var touchEvent;

        for (var c = 0; c < cLength; c++) {
            touchEvent = changedTouches[c];
            if(!isSupportCocoonJS) {
                touchEvent.globalX = ( (touchEvent.clientX - rect.left) * wCalc ) / this.resolution;
                touchEvent.globalY = ( (touchEvent.clientY - rect.top)  * hCalc )  / this.resolution;
            } else {
                touchEvent.globalX = touchEvent.clientX;
                touchEvent.globalY = touchEvent.clientY;
            }
        }

        for (var i = 0; i < cLength; i++) {
            touchEvent = changedTouches[i];
            touchData = this.touches[touchEvent.identifier];
            touchData.originalEvent = event;
            if (!isSupportCocoonJS) {
                touchEvent.globalX = touchData.global.x = ( (touchEvent.clientX - rect.left) * wCalc ) / this.resolution;
                touchEvent.globalY = touchData.global.y = ( (touchEvent.clientY - rect.top)  * hCalc ) / this.resolution;
            } else {
                touchData.global.x = touchEvent.clientX;
                touchData.global.y = touchEvent.clientY;
            }
            for (var j = 0; j < this.interactiveItems.length; j++) {
                var item = this.interactiveItems[j];
                if (item.touchmove && item.__touchData && item.__touchData[touchEvent.identifier]) {
                    item.touchmove(touchData);
                }
            }
        }
    };
    PIXI.InteractionManager.prototype.onTouchStart = function(event) {
        if (this.dirty) {
            this.rebuildInteractiveGraph();
        }
        var rect = this.interactionDOMElement.getBoundingClientRect();
        if (PIXI.AUTO_PREVENT_DEFAULT) {
            event.preventDefault();
        }
        var changedTouches = event.changedTouches;
        var cLength = changedTouches.length;
        var wCalc = (this.target.width / rect.width);
        var hCalc = (this.target.height / rect.height);
        var isSupportCocoonJS = navigator.isCocoonJS && !rect.left && !rect.top && !event.target.style.width && !event.target.style.height;
        var touchEvent;
        for (var c = 0; c < cLength; c++) {
            touchEvent = changedTouches[c];
            if(!isSupportCocoonJS) {
                touchEvent.globalX = ( (touchEvent.clientX - rect.left) * wCalc ) / this.resolution;
                touchEvent.globalY = ( (touchEvent.clientY - rect.top)  * hCalc )  / this.resolution;
            } else {
                touchEvent.globalX = touchEvent.clientX;
                touchEvent.globalY = touchEvent.clientY;
            }
        }
        for (var i=0; i < cLength; i++) {
            touchEvent = changedTouches[i];
            var touchData = this.pool.pop();
            if (!touchData) {
                touchData = new PIXI.InteractionData();
            }
            touchData.originalEvent = event;
            this.touches[touchEvent.identifier] = touchData;
            if (!isSupportCocoonJS) {
                touchData.global.x = ( (touchEvent.clientX - rect.left) * wCalc ) / this.resolution;
                touchData.global.y = ( (touchEvent.clientY - rect.top)  * hCalc ) / this.resolution;
            } else {
                touchData.global.x = touchEvent.clientX;
                touchData.global.y = touchEvent.clientY;
            }
            var length = this.interactiveItems.length;
            for (var j = 0; j < length; j++) {
                var item = this.interactiveItems[j];
                if (item.touchstart || item.tap) {
                    item.__hit = this.hitTest(item, touchData);
                    if (item.__hit) {
                        if (item.touchstart) item.touchstart(touchData);
                        item.__isDown = true;
                        item.__touchData = item.__touchData || {};
                        item.__touchData[touchEvent.identifier] = touchData;
                        if (!item.interactiveChildren) break;
                    }
                }
            }
        }
    };
    PIXI.InteractionManager.prototype.onTouchEnd = function(event) {
        if (this.dirty) {
            this.rebuildInteractiveGraph();
        }

        var rect = this.interactionDOMElement.getBoundingClientRect();
        var changedTouches = event.changedTouches;
        var cLength = changedTouches.length;
        var wCalc = (this.target.width / rect.width);
        var hCalc = (this.target.height / rect.height);
        var isSupportCocoonJS = navigator.isCocoonJS && !rect.left && !rect.top && !event.target.style.width && !event.target.style.height;
        var touchEvent;

        for (var c = 0; c < cLength; c++) {
            touchEvent = changedTouches[c];
            if(!isSupportCocoonJS) {
                touchEvent.globalX = ( (touchEvent.clientX - rect.left) * wCalc ) / this.resolution;
                touchEvent.globalY = ( (touchEvent.clientY - rect.top)  * hCalc )  / this.resolution;
            } else {
                touchEvent.globalX = touchEvent.clientX;
                touchEvent.globalY = touchEvent.clientY;
            }
        }

        for (var i=0; i < cLength; i++) {
            touchEvent = changedTouches[i];
            var touchData = this.touches[touchEvent.identifier];
            var up = false;
            if (!isSupportCocoonJS) {
                touchData.global.x = ( (touchEvent.clientX - rect.left) * wCalc ) / this.resolution;
                touchData.global.y = ( (touchEvent.clientY - rect.top)  * hCalc ) / this.resolution;
            } else {
                touchData.global.x = touchEvent.clientX;
                touchData.global.y = touchEvent.clientY;
            }
            var length = this.interactiveItems.length;
            for (var j = 0; j < length; j++) {
                var item = this.interactiveItems[j];
                if (item.__touchData && item.__touchData[touchEvent.identifier]) {
                    item.__hit = this.hitTest(item, item.__touchData[touchEvent.identifier]);
                    touchData.originalEvent = event;
                    if (item.touchend || item.tap) {
                        if (item.__hit && !up) {
                            if (item.touchend) {
                                item.touchend(touchData);
                            }
                            if (item.__isDown && item.tap) {
                                item.tap(touchData);
                            }
                            if (!item.interactiveChildren) {
                                up = true;
                            }
                        } else {
                            if (item.__isDown && item.touchendoutside) {
                                item.touchendoutside(touchData);
                            }
                        }
                        item.__isDown = false;
                    }
                    item.__touchData[touchEvent.identifier] = null;
                }
            }
            this.pool.push(touchData);
            this.touches[touchEvent.identifier] = null;
        }
    };
    PIXI.InteractionManager.prototype.onTouchCancel = function(event) {
        if (this.dirty) {
            this.rebuildInteractiveGraph();
        }
        var rect = this.interactionDOMElement.getBoundingClientRect();
        var changedTouches = event.changedTouches;
        var cLength = changedTouches.length;
        var wCalc = (this.target.width / rect.width);
        var hCalc = (this.target.height / rect.height);
        var isSupportCocoonJS = navigator.isCocoonJS && !rect.left && !rect.top && !event.target.style.width && !event.target.style.height;
        var touchEvent;
        for (var c = 0; c < cLength; c++) {
            touchEvent = changedTouches[c];
            if(!isSupportCocoonJS) {
                touchEvent.globalX = ( (touchEvent.clientX - rect.left) * wCalc ) / this.resolution;
                touchEvent.globalY = ( (touchEvent.clientY - rect.top)  * hCalc )  / this.resolution;
            } else {
                touchEvent.globalX = touchEvent.clientX;
                touchEvent.globalY = touchEvent.clientY;
            }
        }
        for (var i=0; i < cLength; i++) {
            touchEvent = changedTouches[i];
            var touchData = this.touches[touchEvent.identifier];
            var up = false;
            if (!isSupportCocoonJS) {
                touchData.global.x = ( (touchEvent.clientX - rect.left) * wCalc ) / this.resolution;
                touchData.global.y = ( (touchEvent.clientY - rect.top)  * hCalc ) / this.resolution;
            } else {
                touchData.global.x = touchEvent.clientX;
                touchData.global.y = touchEvent.clientY;
            }
            var length = this.interactiveItems.length;
            for (var j = 0; j < length; j++) {
                var item = this.interactiveItems[j];
                if (item.__touchData && item.__touchData[touchEvent.identifier]) {
                    item.__hit = this.hitTest(item, item.__touchData[touchEvent.identifier]);
                    touchData.originalEvent = event;
                    if (item.touchcancel && !up) {
                        item.touchcancel(touchData);
                        if (!item.interactiveChildren) {
                            up = true;
                        }
                    }
                    item.__isDown = false;
                    item.__touchData[touchEvent.identifier] = null;
                }
            }
            this.pool.push(touchData);
            this.touches[touchEvent.identifier] = null;
        }
    };
    PIXI.Stage = function(backgroundColor) {
        PIXI.DisplayObjectContainer.call( this );
        this.worldTransform = new PIXI.Matrix();
        this.interactive = true;
        this.interactionManager = new PIXI.InteractionManager(this);
        this.dirty = true;
        this.stage = this;
        this.stage.hitArea = new PIXI.Rectangle(0, 0, 100000, 100000);
        this.setBackgroundColor(backgroundColor);
    };
    PIXI.Stage.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
    PIXI.Stage.prototype.constructor = PIXI.Stage;
    PIXI.Stage.prototype.updateTransform = function() {
        this.worldAlpha = 1;
        for(var i=0,j=this.children.length; i<j; i++) {
            this.children[i].updateTransform();
        }
        if(this.dirty) {
            this.dirty = false;
            this.interactionManager.dirty = true;
        }
        if(this.interactive)this.interactionManager.update();
    };
    PIXI.Stage.prototype.setBackgroundColor = function(backgroundColor) {
        this.backgroundColor = backgroundColor || 0x000000;
        this.backgroundColorSplit = PIXI.hex2rgb(this.backgroundColor);
        var hex = this.backgroundColor.toString(16);
        hex = '000000'.substr(0, 6 - hex.length) + hex;
        this.backgroundColorString = '#' + hex;
    };
    (function(window) {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
        window.requestAnimFrame = window.requestAnimationFrame;
    })(this);
    PIXI.hex2rgb = function(hex) {
        return [(hex >> 16 & 0xFF) / 255, ( hex >> 8 & 0xFF) / 255, (hex & 0xFF)/ 255];
    };
    PIXI.rgb2hex = function(rgb) {
        return ((rgb[0]*255 << 16) + (rgb[1]*255 << 8) + rgb[2]*255);
    };
    if (typeof Function.prototype.bind !== 'function') {
        Function.prototype.bind = (function () {
            return function (thisArg) {
                var target = this, i = arguments.length - 1, boundArgs = [];
                if (i > 0) {
                    boundArgs.length = i;
                    while (i--) boundArgs[i] = arguments[i + 1];
                }
                if (typeof target !== 'function') throw new TypeError();
                function bound() {
                    var i = arguments.length, args = new Array(i);
                    while (i--) args[i] = arguments[i];
                    args = boundArgs.concat(args);
                    return target.apply(this instanceof bound ? this : thisArg, args);
                }

                bound.prototype = (function F(proto) {
                    if (proto) F.prototype = proto;
                    if (!(this instanceof F)) return new F();
                })(target.prototype);
                return bound;
            };
        })();
    }
    PIXI.EventTarget = {
        call: function callCompat(obj) {
            if(obj) {
                obj = obj.prototype || obj;
                PIXI.EventTarget.mixin(obj);
            }
        },
        mixin: function mixin(obj) {
            obj.listeners = function listeners(eventName) {
                this._listeners = this._listeners || {};

                return this._listeners[eventName] ? this._listeners[eventName].slice() : [];
            };
            obj.emit = obj.dispatchEvent = function emit(eventName, data) {
                this._listeners = this._listeners || {};
                if(typeof eventName === 'object') {
                    data = eventName;
                    eventName = eventName.type;
                }
                if(!data || data.__isEventObject !== true) {
                    data = new PIXI.Event(this, eventName, data);
                }
                if(this._listeners && this._listeners[eventName]) {
                    var listeners = this._listeners[eventName].slice(0), length = listeners.length, fn = listeners[0], i;
                    for(i = 0; i < length; fn = listeners[++i]) {
                        fn.call(this, data);
                        if(data.stoppedImmediate) {
                            return this;
                        }
                    }
                    if(data.stopped) {
                        return this;
                    }
                }
                if(this.parent && this.parent.emit) {
                    this.parent.emit.call(this.parent, eventName, data);
                }

                return this;
            };
            obj.on = obj.addEventListener = function on(eventName, fn) {
                this._listeners = this._listeners || {};
                (this._listeners[eventName] = this._listeners[eventName] || []).push(fn);
                return this;
            };
            obj.once = function once(eventName, fn) {
                this._listeners = this._listeners || {};
                var self = this;
                function onceHandlerWrapper() {
                    fn.apply(self.off(eventName, onceHandlerWrapper), arguments);
                }
                onceHandlerWrapper._originalHandler = fn;
                return this.on(eventName, onceHandlerWrapper);
            };
            obj.off = obj.removeEventListener = function off(eventName, fn) {
                this._listeners = this._listeners || {};
                if(!this._listeners[eventName])
                    return this;
                var list = this._listeners[eventName],
                    i = fn ? list.length : 0;
                while(i-- > 0) {
                    if(list[i] === fn || list[i]._originalHandler === fn) {
                        list.splice(i, 1);
                    }
                }
                if(list.length === 0) {
                    delete this._listeners[eventName];
                }
                return this;
            };
            obj.removeAllListeners = function removeAllListeners(eventName) {
                this._listeners = this._listeners || {};
                if(!this._listeners[eventName])
                    return this;
                delete this._listeners[eventName];
                return this;
            };
        }
    };
    PIXI.Event = function(target, name, data) {
        this.__isEventObject = true;
        this.stopped = false;
        this.stoppedImmediate = false;
        this.target = target;
        this.type = name;
        this.data = data;
        this.content = data;
        this.timeStamp = Date.now();
    };
    PIXI.autoDetectRenderer = function(width, height, options) {
        if(!width)width = 800;
        if(!height)height = 600;
        var webgl = ( function () { try {
            var canvas = document.createElement( 'canvas' );
            return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
        } catch( e ) {
            return false;
        }
        } )();

        if( webgl ) {
            return new PIXI.WebGLRenderer(width, height, options);
        }
        return  new PIXI.CanvasRenderer(width, height, options);
    };
    PIXI.CompileVertexShader = function(gl, shaderSrc) {
        return PIXI._CompileShader(gl, shaderSrc, gl.VERTEX_SHADER);
    };
    PIXI.CompileFragmentShader = function(gl, shaderSrc) {
        return PIXI._CompileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
    };
    PIXI._CompileShader = function(gl, shaderSrc, shaderType) {
        var src = shaderSrc.join("\n");
        var shader = gl.createShader(shaderType);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            window.console.log(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    };
    PIXI.compileProgram = function(gl, vertexSrc, fragmentSrc) {
        var fragmentShader = PIXI.CompileFragmentShader(gl, fragmentSrc);
        var vertexShader = PIXI.CompileVertexShader(gl, vertexSrc);
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            window.console.log("Could not initialise shaders");
        }
        return shaderProgram;
    };
    PIXI.PixiShader = function(gl) {
        this._UID = PIXI._UID++;
        this.gl = gl;
        this.program = null;
        this.fragmentSrc = [
            'precision lowp float;',
            'varying vec2 vTextureCoord;',
            'varying vec4 vColor;',
            'uniform sampler2D uSampler;',
            'void main(void) {',
            '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
            '}'
        ];
        this.textureCount = 0;
        this.firstRun = true;
        this.dirty = true;
        this.attributes = [];
        this.init();
    };
    PIXI.PixiShader.prototype.constructor = PIXI.PixiShader;
    PIXI.PixiShader.prototype.init = function() {
        var gl = this.gl;
        var program = PIXI.compileProgram(gl, this.vertexSrc || PIXI.PixiShader.defaultVertexSrc, this.fragmentSrc);
        gl.useProgram(program);
        this.uSampler = gl.getUniformLocation(program, 'uSampler');
        this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
        this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
        this.dimensions = gl.getUniformLocation(program, 'dimensions');
        this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
        this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
        this.colorAttribute = gl.getAttribLocation(program, 'aColor');
        if(this.colorAttribute === -1) {
            this.colorAttribute = 2;
        }
        this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute];
        for (var key in this.uniforms) {
            this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);
        }
        this.initUniforms();
        this.program = program;
    };
    PIXI.PixiShader.prototype.initUniforms = function() {
        this.textureCount = 1;
        var gl = this.gl;
        var uniform;
        for (var key in this.uniforms) {
            uniform = this.uniforms[key];
            var type = uniform.type;
            if (type === 'sampler2D') {
                uniform._init = false;
                if (uniform.value !== null) {
                    this.initSampler2D(uniform);
                }
            } else if (type === 'mat2' || type === 'mat3' || type === 'mat4') {
                uniform.glMatrix = true;
                uniform.glValueLength = 1;
                if (type === 'mat2') {
                    uniform.glFunc = gl.uniformMatrix2fv;
                } else if (type === 'mat3') {
                    uniform.glFunc = gl.uniformMatrix3fv;
                } else if (type === 'mat4') {
                    uniform.glFunc = gl.uniformMatrix4fv;
                }
            } else {
                uniform.glFunc = gl['uniform' + type];
                if (type === '2f' || type === '2i') {
                    uniform.glValueLength = 2;
                } else if (type === '3f' || type === '3i') {
                    uniform.glValueLength = 3;
                } else if (type === '4f' || type === '4i') {
                    uniform.glValueLength = 4;
                } else {
                    uniform.glValueLength = 1;
                }
            }
        }
    };
    PIXI.PixiShader.prototype.initSampler2D = function(uniform) {
        if (!uniform.value || !uniform.value.baseTexture || !uniform.value.baseTexture.hasLoaded) {
            return;
        }
        var gl = this.gl;
        gl.activeTexture(gl['TEXTURE' + this.textureCount]);
        gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id]);
        if (uniform.textureData) {
            var data = uniform.textureData;
            var magFilter = (data.magFilter) ? data.magFilter : gl.LINEAR;
            var minFilter = (data.minFilter) ? data.minFilter : gl.LINEAR;
            var wrapS = (data.wrapS) ? data.wrapS : gl.CLAMP_TO_EDGE;
            var wrapT = (data.wrapT) ? data.wrapT : gl.CLAMP_TO_EDGE;
            var format = (data.luminance) ? gl.LUMINANCE : gl.RGBA;
            if (data.repeat) {
                wrapS = gl.REPEAT;
                wrapT = gl.REPEAT;
            }
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !!data.flipY);
            if (data.width) {
                var width = (data.width) ? data.width : 512;
                var height = (data.height) ? data.height : 2;
                var border = (data.border) ? data.border : 0;
                gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, border, format, gl.UNSIGNED_BYTE, null);
            } else {
                gl.texImage2D(gl.TEXTURE_2D, 0, format, gl.RGBA, gl.UNSIGNED_BYTE, uniform.value.baseTexture.source);
            }

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        }
        gl.uniform1i(uniform.uniformLocation, this.textureCount);
        uniform._init = true;
        this.textureCount++;
    };
    PIXI.PixiShader.prototype.syncUniforms = function() {
        this.textureCount = 1;
        var uniform;
        var gl = this.gl;
        for (var key in this.uniforms) {
            uniform = this.uniforms[key];
            if (uniform.glValueLength === 1) {
                if (uniform.glMatrix === true) {
                    uniform.glFunc.call(gl, uniform.uniformLocation, uniform.transpose, uniform.value);
                } else {
                    uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value);
                }
            } else if (uniform.glValueLength === 2) {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y);
            } else if (uniform.glValueLength === 3) {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z);
            } else if (uniform.glValueLength === 4) {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w);
            } else if (uniform.type === 'sampler2D') {
                if (uniform._init) {
                    gl.activeTexture(gl['TEXTURE' + this.textureCount]);
                    if(uniform.value.baseTexture._dirty[gl.id]) {
                        PIXI.instances[gl.id].updateTexture(uniform.value.baseTexture);
                    } else {
                        gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id]);
                    }
                    gl.uniform1i(uniform.uniformLocation, this.textureCount);
                    this.textureCount++;
                } else {
                    this.initSampler2D(uniform);
                }
            }
        }
    };
    PIXI.PixiShader.defaultVertexSrc = [
        'attribute vec2 aVertexPosition;',
        'attribute vec2 aTextureCoord;',
        'attribute vec4 aColor;',

        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',

        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',

        'const vec2 center = vec2(-1.0, 1.0);',

        'void main(void) {',
        '   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;',
        '   vColor = vec4(aColor.rgb * aColor.a, aColor.a);',
        '}'
    ];
    PIXI.PixiFastShader = function(gl) {
        this._UID = PIXI._UID++;
        this.gl = gl;
        this.program = null;
        this.fragmentSrc = [
            'precision lowp float;',
            'varying vec2 vTextureCoord;',
            'varying float vColor;',
            'uniform sampler2D uSampler;',
            'void main(void) {',
            '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
            '}'
        ];
        this.vertexSrc = [
            'attribute vec2 aVertexPosition;',
            'attribute vec2 aPositionCoord;',
            'attribute vec2 aScale;',
            'attribute float aRotation;',
            'attribute vec2 aTextureCoord;',
            'attribute float aColor;',

            'uniform vec2 projectionVector;',
            'uniform vec2 offsetVector;',
            'uniform mat3 uMatrix;',

            'varying vec2 vTextureCoord;',
            'varying float vColor;',

            'const vec2 center = vec2(-1.0, 1.0);',

            'void main(void) {',
            '   vec2 v;',
            '   vec2 sv = aVertexPosition * aScale;',
            '   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);',
            '   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);',
            '   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;',
            '   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);',
            '   vTextureCoord = aTextureCoord;',
            '   vColor = aColor;',
            '}'
        ];
        this.textureCount = 0;
        this.init();
    };
    PIXI.PixiFastShader.prototype.constructor = PIXI.PixiFastShader;
    PIXI.PixiFastShader.prototype.init = function() {
        var gl = this.gl;
        var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
        gl.useProgram(program);
        this.uSampler = gl.getUniformLocation(program, 'uSampler');
        this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
        this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
        this.dimensions = gl.getUniformLocation(program, 'dimensions');
        this.uMatrix = gl.getUniformLocation(program, 'uMatrix');
        this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
        this.aPositionCoord = gl.getAttribLocation(program, 'aPositionCoord');
        this.aScale = gl.getAttribLocation(program, 'aScale');
        this.aRotation = gl.getAttribLocation(program, 'aRotation');
        this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
        this.colorAttribute = gl.getAttribLocation(program, 'aColor');
        if(this.colorAttribute === -1) {
            this.colorAttribute = 2;
        }
        this.attributes = [this.aVertexPosition, this.aPositionCoord,  this.aScale, this.aRotation, this.aTextureCoord, this.colorAttribute];
        this.program = program;
    };
    PIXI.StripShader = function(gl) {
        this._UID = PIXI._UID++;
        this.gl = gl;
        this.program = null;
        this.fragmentSrc = [
            'precision mediump float;',
            'varying vec2 vTextureCoord;',
            'uniform float alpha;',
            'uniform sampler2D uSampler;',

            'void main(void) {',
            '   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * alpha;',
            '}'
        ];
        this.vertexSrc  = [
            'attribute vec2 aVertexPosition;',
            'attribute vec2 aTextureCoord;',
            'uniform mat3 translationMatrix;',
            'uniform vec2 projectionVector;',
            'uniform vec2 offsetVector;',
            'varying vec2 vTextureCoord;',

            'void main(void) {',
            '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
            '   v -= offsetVector.xyx;',
            '   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);',
            '   vTextureCoord = aTextureCoord;',
            '}'
        ];
        this.init();
    };
    PIXI.StripShader.prototype.constructor = PIXI.StripShader;
    PIXI.StripShader.prototype.init = function() {
        var gl = this.gl;
        var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
        gl.useProgram(program);
        this.uSampler = gl.getUniformLocation(program, 'uSampler');
        this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
        this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
        this.colorAttribute = gl.getAttribLocation(program, 'aColor');
        this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
        this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
        this.attributes = [this.aVertexPosition, this.aTextureCoord];
        this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
        this.alpha = gl.getUniformLocation(program, 'alpha');
        this.program = program;
    };
    PIXI.PrimitiveShader = function(gl) {
        this._UID = PIXI._UID++;
        this.gl = gl;
        this.program = null;
        this.fragmentSrc = [
            'precision mediump float;',
            'varying vec4 vColor;',

            'void main(void) {',
            '   gl_FragColor = vColor;',
            '}'
        ];
        this.vertexSrc  = [
            'attribute vec2 aVertexPosition;',
            'attribute vec4 aColor;',
            'uniform mat3 translationMatrix;',
            'uniform vec2 projectionVector;',
            'uniform vec2 offsetVector;',
            'uniform float alpha;',
            'uniform float flipY;',
            'uniform vec3 tint;',
            'varying vec4 vColor;',
            'void main(void) {',
            '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
            '   v -= offsetVector.xyx;',
            '   gl_Position = vec4( v.x / projectionVector.x -1.0, (v.y / projectionVector.y * -flipY) + flipY , 0.0, 1.0);',
            '   vColor = aColor * vec4(tint * alpha, alpha);',
            '}'
        ];
        this.init();
    };
    PIXI.PrimitiveShader.prototype.constructor = PIXI.PrimitiveShader;
    PIXI.PrimitiveShader.prototype.init = function() {
        var gl = this.gl;
        var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
        gl.useProgram(program);
        this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
        this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
        this.tintColor = gl.getUniformLocation(program, 'tint');
        this.flipY = gl.getUniformLocation(program, 'flipY');
        this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
        this.colorAttribute = gl.getAttribLocation(program, 'aColor');
        this.attributes = [this.aVertexPosition, this.colorAttribute];
        this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
        this.alpha = gl.getUniformLocation(program, 'alpha');
        this.program = program;
    };
    PIXI.ComplexPrimitiveShader = function(gl) {
        this._UID = PIXI._UID++;
        this.gl = gl;
        this.program = null;
        this.fragmentSrc = [
            'precision mediump float;',
            'varying vec4 vColor;',
            'void main(void) {',
            '   gl_FragColor = vColor;',
            '}'
        ];
        this.vertexSrc  = [
            'attribute vec2 aVertexPosition;',
            'uniform mat3 translationMatrix;',
            'uniform vec2 projectionVector;',
            'uniform vec2 offsetVector;',

            'uniform vec3 tint;',
            'uniform float alpha;',
            'uniform vec3 color;',
            'uniform float flipY;',
            'varying vec4 vColor;',

            'void main(void) {',
            '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
            '   v -= offsetVector.xyx;',
            '   gl_Position = vec4( v.x / projectionVector.x -1.0, (v.y / projectionVector.y * -flipY) + flipY , 0.0, 1.0);',
            '   vColor = vec4(color * alpha * tint, alpha);',//" * vec4(tint * alpha, alpha);',
            '}'
        ];
        this.init();
    };
    PIXI.ComplexPrimitiveShader.prototype.constructor = PIXI.ComplexPrimitiveShader;
    PIXI.ComplexPrimitiveShader.prototype.init = function() {
        var gl = this.gl;
        var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
        gl.useProgram(program);
        this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
        this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
        this.tintColor = gl.getUniformLocation(program, 'tint');
        this.color = gl.getUniformLocation(program, 'color');
        this.flipY = gl.getUniformLocation(program, 'flipY');
        this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
        this.attributes = [this.aVertexPosition, this.colorAttribute];
        this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
        this.alpha = gl.getUniformLocation(program, 'alpha');
        this.program = program;
    };
    PIXI.glContexts = [];
    PIXI.instances = [];
    PIXI.WebGLRenderer = function(width, height, options) {
        if(options) {
            for (var i in PIXI.defaultRenderOptions) {
                if (typeof options[i] === 'undefined') options[i] = PIXI.defaultRenderOptions[i];
            }
        } else {
            options = PIXI.defaultRenderOptions;
        }
        if(!PIXI.defaultRenderer) {
            //PIXI.sayHello('webGL');
            PIXI.defaultRenderer = this;
        }
        this.type = PIXI.WEBGL_RENDERER;
        this.resolution = options.resolution;
        this.transparent = options.transparent;
        this.autoResize = options.autoResize || false;
        this.preserveDrawingBuffer = options.preserveDrawingBuffer;
        this.clearBeforeRender = options.clearBeforeRender;
        this.width = width || 800;
        this.height = height || 600;
        this.view = options.view || document.createElement( 'canvas' );
        this.contextLostBound = this.handleContextLost.bind(this);
        this.contextRestoredBound = this.handleContextRestored.bind(this);
        this.view.addEventListener('webglcontextlost', this.contextLostBound, false);
        this.view.addEventListener('webglcontextrestored', this.contextRestoredBound, false);
        this._contextOptions = {
            alpha: this.transparent,
            antialias: options.antialias, // SPEED UP??
            premultipliedAlpha:this.transparent && this.transparent !== 'notMultiplied',
            stencil:true,
            preserveDrawingBuffer: options.preserveDrawingBuffer
        };
        this.projection = new PIXI.Point();
        this.offset = new PIXI.Point(0, 0);
        this.shaderManager = new PIXI.WebGLShaderManager();
        this.spriteBatch = new PIXI.WebGLSpriteBatch();
        this.maskManager = new PIXI.WebGLMaskManager();
        this.filterManager = new PIXI.WebGLFilterManager();
        this.stencilManager = new PIXI.WebGLStencilManager();
        this.blendModeManager = new PIXI.WebGLBlendModeManager();
        this.renderSession = {};
        this.renderSession.gl = this.gl;
        this.renderSession.drawCount = 0;
        this.renderSession.shaderManager = this.shaderManager;
        this.renderSession.maskManager = this.maskManager;
        this.renderSession.filterManager = this.filterManager;
        this.renderSession.blendModeManager = this.blendModeManager;
        this.renderSession.spriteBatch = this.spriteBatch;
        this.renderSession.stencilManager = this.stencilManager;
        this.renderSession.renderer = this;
        this.renderSession.resolution = this.resolution;
        this.initContext();
        this.mapBlendModes();
    };
    PIXI.WebGLRenderer.prototype.constructor = PIXI.WebGLRenderer;
    PIXI.WebGLRenderer.prototype.initContext = function() {
        var gl = this.view.getContext('webgl', this._contextOptions) || this.view.getContext('experimental-webgl', this._contextOptions);
        this.gl = gl;
        if (!gl) {
            throw new Error('This browser does not support webGL. Try using the canvas renderer');
        }
        this.glContextId = gl.id = PIXI.WebGLRenderer.glContextId ++;
        PIXI.glContexts[this.glContextId] = gl;
        PIXI.instances[this.glContextId] = this;
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        this.shaderManager.setContext(gl);
        this.spriteBatch.setContext(gl);
        this.maskManager.setContext(gl);
        this.filterManager.setContext(gl);
        this.blendModeManager.setContext(gl);
        this.stencilManager.setContext(gl);
        this.renderSession.gl = this.gl;
        this.resize(this.width, this.height);
    };
    PIXI.WebGLRenderer.prototype.render = function(stage) {
        if(this.contextLost)return;
        if(this.__stage !== stage) {
            if(stage.interactive)stage.interactionManager.removeEvents();
            this.__stage = stage;
        }
        stage.updateTransform();
        var gl = this.gl;
        if(stage._interactive) {
            if(!stage._interactiveEventsAdded) {
                stage._interactiveEventsAdded = true;
                stage.interactionManager.setTarget(this);
            }
        } else {
            if(stage._interactiveEventsAdded) {
                stage._interactiveEventsAdded = false;
                stage.interactionManager.setTarget(this);
            }
        }
        gl.viewport(0, 0, this.width, this.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        if (this.clearBeforeRender) {
            if(this.transparent) {
                gl.clearColor(0, 0, 0, 0);
            } else {
                gl.clearColor(stage.backgroundColorSplit[0],stage.backgroundColorSplit[1],stage.backgroundColorSplit[2], 1);
            }
            gl.clear (gl.COLOR_BUFFER_BIT);
        }
        this.renderDisplayObject( stage, this.projection );
    };
    PIXI.WebGLRenderer.prototype.renderDisplayObject = function(displayObject, projection, buffer) {
        this.renderSession.blendModeManager.setBlendMode(PIXI.blendModes.NORMAL);
        this.renderSession.drawCount = 0;
        this.renderSession.flipY = buffer ? -1 : 1;
        this.renderSession.projection = projection;
        this.renderSession.offset = this.offset;
        this.spriteBatch.begin(this.renderSession);
        this.filterManager.begin(this.renderSession, buffer);
        displayObject._renderWebGL(this.renderSession);
        this.spriteBatch.end();
    };
    PIXI.WebGLRenderer.prototype.resize = function(width, height) {
        this.width = width * this.resolution;
        this.height = height * this.resolution;

        this.view.width = this.width;
        this.view.height = this.height;
        if (this.autoResize) {
            this.view.style.width = this.width / this.resolution + 'px';
            this.view.style.height = this.height / this.resolution + 'px';
        }
        this.gl.viewport(0, 0, this.width, this.height);
        this.projection.x =  this.width / 2 / this.resolution;
        this.projection.y =  -this.height / 2 / this.resolution;
    };
    PIXI.WebGLRenderer.prototype.updateTexture = function(texture) {
        if(!texture.hasLoaded )return;
        var gl = this.gl;
        if(!texture._glTextures[gl.id])texture._glTextures[gl.id] = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultipliedAlpha);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
        if(texture.mipmap && PIXI.isPowerOfTwo(texture.width, texture.height)) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
        }
        if(!texture._powerOf2) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }
        texture._dirty[gl.id] = false;
        return  texture._glTextures[gl.id];
    };
    PIXI.WebGLRenderer.prototype.handleContextLost = function(event) {
        event.preventDefault();
        this.contextLost = true;
    };
    PIXI.WebGLRenderer.prototype.handleContextRestored = function() {
        this.initContext();
        for(var key in PIXI.TextureCache) {
            var texture = PIXI.TextureCache[key].baseTexture;
            texture._glTextures = [];
        }
        this.contextLost = false;
    };
    PIXI.WebGLRenderer.prototype.mapBlendModes = function() {
        var gl = this.gl;
        if(!PIXI.blendModesWebGL) {
            PIXI.blendModesWebGL = [];
            PIXI.blendModesWebGL[PIXI.blendModes.NORMAL]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.ADD]           = [gl.SRC_ALPHA, gl.DST_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.MULTIPLY]      = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.SCREEN]        = [gl.SRC_ALPHA, gl.ONE];
            PIXI.blendModesWebGL[PIXI.blendModes.OVERLAY]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.DARKEN]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.LIGHTEN]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.COLOR_DODGE]   = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.COLOR_BURN]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.HARD_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.SOFT_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.DIFFERENCE]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.EXCLUSION]     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.HUE]           = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.SATURATION]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.COLOR]         = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            PIXI.blendModesWebGL[PIXI.blendModes.LUMINOSITY]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        }
    };
    PIXI.WebGLRenderer.glContextId = 0;
    PIXI.WebGLBlendModeManager = function() {
        this.currentBlendMode = 99999;
    };
    PIXI.WebGLBlendModeManager.prototype.constructor = PIXI.WebGLBlendModeManager;
    PIXI.WebGLBlendModeManager.prototype.setContext = function(gl) {
        this.gl = gl;
    };
    PIXI.WebGLBlendModeManager.prototype.setBlendMode = function(blendMode) {
        if(this.currentBlendMode === blendMode)return false;
        this.currentBlendMode = blendMode;
        var blendModeWebGL = PIXI.blendModesWebGL[this.currentBlendMode];
        this.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
        return true;
    };
    PIXI.WebGLMaskManager = function() {};
    PIXI.WebGLMaskManager.prototype.constructor = PIXI.WebGLMaskManager;
    PIXI.WebGLMaskManager.prototype.setContext = function(gl) {
        this.gl = gl;
    };
    PIXI.WebGLStencilManager = function() {
        this.stencilStack = [];
        this.reverse = true;
        this.count = 0;
    };
    PIXI.WebGLStencilManager.prototype.setContext = function(gl) {
        this.gl = gl;
    };
    PIXI.WebGLShaderManager = function() {
        this.maxAttibs = 10;
        this.attribState = [];
        this.tempAttribState = [];
        for (var i = 0; i < this.maxAttibs; i++) {
            this.attribState[i] = false;
        }
        this.stack = [];
    };
    PIXI.WebGLShaderManager.prototype.constructor = PIXI.WebGLShaderManager;
    PIXI.WebGLShaderManager.prototype.setContext = function(gl) {
        this.gl = gl;
        this.primitiveShader = new PIXI.PrimitiveShader(gl);
        this.complexPrimitiveShader = new PIXI.ComplexPrimitiveShader(gl);
        this.defaultShader = new PIXI.PixiShader(gl);
        this.fastShader = new PIXI.PixiFastShader(gl);
        this.stripShader = new PIXI.StripShader(gl);
        this.setShader(this.defaultShader);
    };
    PIXI.WebGLShaderManager.prototype.setAttribs = function(attribs) {
        var i;
        for (i = 0; i < this.tempAttribState.length; i++) {
            this.tempAttribState[i] = false;
        }
        for (i = 0; i < attribs.length; i++) {
            var attribId = attribs[i];
            this.tempAttribState[attribId] = true;
        }
        var gl = this.gl;
        for (i = 0; i < this.attribState.length; i++) {
            if(this.attribState[i] !== this.tempAttribState[i]) {
                this.attribState[i] = this.tempAttribState[i];
                if(this.tempAttribState[i]) {
                    gl.enableVertexAttribArray(i);
                } else {
                    gl.disableVertexAttribArray(i);
                }
            }
        }
    };
    PIXI.WebGLShaderManager.prototype.setShader = function(shader) {
        if(this._currentId === shader._UID)return false;
        this._currentId = shader._UID;
        this.currentShader = shader;
        this.gl.useProgram(shader.program);
        this.setAttribs(shader.attributes);
        return true;
    };
    PIXI.WebGLSpriteBatch = function() {
        this.vertSize = 5;
        this.size = 2000;
        var numVerts = this.size * 4 * 4 * this.vertSize;
        var numIndices = this.size * 6;
        this.vertices = new PIXI.ArrayBuffer(numVerts);
        this.positions = new PIXI.Float32Array(this.vertices);
        this.colors = new PIXI.Uint32Array(this.vertices);
        this.indices = new PIXI.Uint16Array(numIndices);
        this.lastIndexCount = 0;
        for (var i=0, j=0; i < numIndices; i += 6, j += 4) {
            this.indices[i + 0] = j + 0;
            this.indices[i + 1] = j + 1;
            this.indices[i + 2] = j + 2;
            this.indices[i + 3] = j + 0;
            this.indices[i + 4] = j + 2;
            this.indices[i + 5] = j + 3;
        }
        this.drawing = false;
        this.currentBatchSize = 0;
        this.currentBaseTexture = null;
        this.dirty = true;
        this.textures = [];
        this.blendModes = [];
        this.shaders = [];
        this.sprites = [];
        this.defaultShader = new PIXI.AbstractFilter([
            'precision lowp float;',
            'varying vec2 vTextureCoord;',
            'varying vec4 vColor;',
            'uniform sampler2D uSampler;',
            'void main(void) {',
            '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
            '}'
        ]);
    };
    PIXI.WebGLSpriteBatch.prototype.setContext = function(gl) {
        this.gl = gl;
        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        this.currentBlendMode = 99999;
        var shader = new PIXI.PixiShader(gl);
        shader.fragmentSrc = this.defaultShader.fragmentSrc;
        shader.uniforms = {};
        shader.init();
        this.defaultShader.shaders[gl.id] = shader;
    };
    PIXI.WebGLSpriteBatch.prototype.begin = function(renderSession) {
        this.renderSession = renderSession;
        this.shader = this.renderSession.shaderManager.defaultShader;
        this.start();
    };
    PIXI.WebGLSpriteBatch.prototype.end = function() {
        this.flush();
    };
    PIXI.WebGLSpriteBatch.prototype.render = function(sprite) {
        var texture = sprite.texture;
        if(this.currentBatchSize >= this.size) {
            this.flush();
            this.currentBaseTexture = texture.baseTexture;
        }
        var uvs = texture._uvs;
        if(!uvs)return;
        var aX = sprite.anchor.x;
        var aY = sprite.anchor.y;
        var w0, w1, h0, h1;
        if (texture.trim) {
            var trim = texture.trim;
            w1 = trim.x - aX * trim.width;
            w0 = w1 + texture.crop.width;
            h1 = trim.y - aY * trim.height;
            h0 = h1 + texture.crop.height;
        } else {
            w0 = (texture.frame.width ) * (1-aX);
            w1 = (texture.frame.width ) * -aX;
            h0 = texture.frame.height * (1-aY);
            h1 = texture.frame.height * -aY;
        }
        var index = this.currentBatchSize * 4 * this.vertSize;
        var resolution = texture.baseTexture.resolution;
        var worldTransform = sprite.worldTransform;
        var a = worldTransform.a / resolution;
        var b = worldTransform.b / resolution;
        var c = worldTransform.c / resolution;
        var d = worldTransform.d / resolution;
        var tx = worldTransform.tx;
        var ty = worldTransform.ty;
        var colors = this.colors;
        var positions = this.positions;
        if(this.renderSession.roundPixels) {
            positions[index] = a * w1 + c * h1 + tx | 0;
            positions[index+1] = d * h1 + b * w1 + ty | 0;
            positions[index+5] = a * w0 + c * h1 + tx | 0;
            positions[index+6] = d * h1 + b * w0 + ty | 0;
            positions[index+10] = a * w0 + c * h0 + tx | 0;
            positions[index+11] = d * h0 + b * w0 + ty | 0;
            positions[index+15] = a * w1 + c * h0 + tx | 0;
            positions[index+16] = d * h0 + b * w1 + ty | 0;
        } else {
            positions[index] = a * w1 + c * h1 + tx;
            positions[index+1] = d * h1 + b * w1 + ty;
            positions[index+5] = a * w0 + c * h1 + tx;
            positions[index+6] = d * h1 + b * w0 + ty;
            positions[index+10] = a * w0 + c * h0 + tx;
            positions[index+11] = d * h0 + b * w0 + ty;
            positions[index+15] = a * w1 + c * h0 + tx;
            positions[index+16] = d * h0 + b * w1 + ty;
        }
        positions[index+2] = uvs.x0;
        positions[index+3] = uvs.y0;
        positions[index+7] = uvs.x1;
        positions[index+8] = uvs.y1;
        positions[index+12] = uvs.x2;
        positions[index+13] = uvs.y2;
        positions[index+17] = uvs.x3;
        positions[index+18] = uvs.y3;
        var tint = sprite.tint;
        colors[index+4] = colors[index+9] = colors[index+14] = colors[index+19] = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16) + (sprite.worldAlpha * 255 << 24);
        this.sprites[this.currentBatchSize++] = sprite;
    };
    PIXI.WebGLSpriteBatch.prototype.flush = function() {
        if (this.currentBatchSize===0)return;
        var gl = this.gl;
        var shader;
        if(this.dirty) {
            this.dirty = false;
            gl.activeTexture(gl.TEXTURE0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            shader =  this.defaultShader.shaders[gl.id];
            var stride =  this.vertSize * 4;
            gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
            gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);
            gl.vertexAttribPointer(shader.colorAttribute, 4, gl.UNSIGNED_BYTE, true, stride, 4 * 4);
        }
        if(this.currentBatchSize > ( this.size * 0.5 ) ) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        } else {
            var view = this.positions.subarray(0, this.currentBatchSize * 4 * this.vertSize);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
        }
        var nextTexture, nextBlendMode, nextShader;
        var batchSize = 0;
        var start = 0;
        var currentBaseTexture = null;
        var currentBlendMode = this.renderSession.blendModeManager.currentBlendMode;
        var currentShader = null;
        var blendSwap = false;
        var shaderSwap = false;
        var sprite;
        for (var i = 0, j = this.currentBatchSize; i < j; i++) {
            sprite = this.sprites[i];
            nextTexture = sprite.texture.baseTexture;
            nextBlendMode = sprite.blendMode;
            nextShader = sprite.shader || this.defaultShader;
            blendSwap = currentBlendMode !== nextBlendMode;
            shaderSwap = currentShader !== nextShader; // should I use _UIDS???
            if(currentBaseTexture !== nextTexture || blendSwap || shaderSwap) {
                this.renderBatch(currentBaseTexture, batchSize, start);
                start = i;
                batchSize = 0;
                currentBaseTexture = nextTexture;

                if( blendSwap ) {
                    currentBlendMode = nextBlendMode;
                    this.renderSession.blendModeManager.setBlendMode( currentBlendMode );
                }
                if( shaderSwap ) {
                    currentShader = nextShader;
                    shader = currentShader.shaders[gl.id];
                    if(!shader) {
                        shader = new PIXI.PixiShader(gl);
                        shader.fragmentSrc =currentShader.fragmentSrc;
                        shader.uniforms =currentShader.uniforms;
                        shader.init();
                        currentShader.shaders[gl.id] = shader;
                    }
                    this.renderSession.shaderManager.setShader(shader);
                    if(shader.dirty)shader.syncUniforms();
                    var projection = this.renderSession.projection;
                    gl.uniform2f(shader.projectionVector, projection.x, projection.y);
                    var offsetVector = this.renderSession.offset;
                    gl.uniform2f(shader.offsetVector, offsetVector.x, offsetVector.y);
                }
            }
            batchSize++;
        }
        this.renderBatch(currentBaseTexture, batchSize, start);
        this.currentBatchSize = 0;
    };
    PIXI.WebGLSpriteBatch.prototype.renderBatch = function(texture, size, startIndex) {
        if(size === 0)return;
        var gl = this.gl;
        if(texture._dirty[gl.id]) {
            this.renderSession.renderer.updateTexture(texture);
        } else {
            gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);
        }
        gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, startIndex * 6 * 2);
        this.renderSession.drawCount++;
    };
    PIXI.WebGLSpriteBatch.prototype.start = function() {
        this.dirty = true;
    };
    PIXI.WebGLFilterManager = function() {
        this.filterStack = [];
        this.offsetX = 0;
        this.offsetY = 0;
    };
    PIXI.WebGLFilterManager.prototype.constructor = PIXI.WebGLFilterManager;
    PIXI.WebGLFilterManager.prototype.setContext = function(gl) {
        this.gl = gl;
        this.texturePool = [];

        this.initShaderBuffers();
    };
    PIXI.WebGLFilterManager.prototype.begin = function(renderSession, buffer) {
        this.renderSession = renderSession;
        this.defaultShader = renderSession.shaderManager.defaultShader;
        var projection = this.renderSession.projection;
        this.width = projection.x * 2;
        this.height = -projection.y * 2;
        this.buffer = buffer;
    };
    PIXI.WebGLFilterManager.prototype.initShaderBuffers = function() {
        var gl = this.gl;
        this.vertexBuffer = gl.createBuffer();
        this.uvBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.vertexArray = new PIXI.Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray, gl.STATIC_DRAW);
        this.uvArray = new PIXI.Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvArray, gl.STATIC_DRAW);
        this.colorArray = new PIXI.Float32Array([1.0, 0xFFFFFF, 1.0, 0xFFFFFF, 1.0, 0xFFFFFF, 1.0, 0xFFFFFF]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colorArray, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 1, 3, 2]), gl.STATIC_DRAW);
    };
    var spine = {
        radDeg: 180 / Math.PI,
        degRad: Math.PI / 180,
        temp: [],
        Float32Array: (typeof(Float32Array) === 'undefined') ? Array : Float32Array,
        Uint16Array: (typeof(Uint16Array) === 'undefined') ? Array : Uint16Array
    };
    spine.BoneData = function (name, parent) {
        this.name = name;
        this.parent = parent;
    };
    spine.BoneData.prototype = {
        length: 0,
        x: 0, y: 0,
        rotation: 0,
        scaleX: 1, scaleY: 1,
        inheritScale: true,
        inheritRotation: true,
        flipX: false, flipY: false
    };
    spine.SlotData = function (name, boneData) {
        this.name = name;
        this.boneData = boneData;
    };
    spine.SlotData.prototype = {
        r: 1, g: 1, b: 1, a: 1,
        attachmentName: null,
        additiveBlending: false
    };
    spine.IkConstraintData = function (name) {
        this.name = name;
        this.bones = [];
    };
    spine.IkConstraintData.prototype = {
        target: null,
        bendDirection: 1,
        mix: 1
    };
    spine.Bone = function (boneData, skeleton, parent) {
        this.data = boneData;
        this.skeleton = skeleton;
        this.parent = parent;
        this.setToSetupPose();
    };
    spine.Bone.yDown = false;
    spine.Bone.prototype = {
        x: 0, y: 0,
        rotation: 0, rotationIK: 0,
        scaleX: 1, scaleY: 1,
        flipX: false, flipY: false,
        m00: 0, m01: 0, worldX: 0, // a b x
        m10: 0, m11: 0, worldY: 0, // c d y
        worldRotation: 0,
        worldScaleX: 1, worldScaleY: 1,
        worldFlipX: false, worldFlipY: false,
        updateWorldTransform: function () {
            var parent = this.parent;
            if (parent) {
                this.worldX = this.x * parent.m00 + this.y * parent.m01 + parent.worldX;
                this.worldY = this.x * parent.m10 + this.y * parent.m11 + parent.worldY;
                if (this.data.inheritScale) {
                    this.worldScaleX = parent.worldScaleX * this.scaleX;
                    this.worldScaleY = parent.worldScaleY * this.scaleY;
                } else {
                    this.worldScaleX = this.scaleX;
                    this.worldScaleY = this.scaleY;
                }
                this.worldRotation = this.data.inheritRotation ? (parent.worldRotation + this.rotationIK) : this.rotationIK;
                this.worldFlipX = parent.worldFlipX != this.flipX;
                this.worldFlipY = parent.worldFlipY != this.flipY;
            } else {
                var skeletonFlipX = this.skeleton.flipX, skeletonFlipY = this.skeleton.flipY;
                this.worldX = skeletonFlipX ? -this.x : this.x;
                this.worldY = (skeletonFlipY != spine.Bone.yDown) ? -this.y : this.y;
                this.worldScaleX = this.scaleX;
                this.worldScaleY = this.scaleY;
                this.worldRotation = this.rotationIK;
                this.worldFlipX = skeletonFlipX != this.flipX;
                this.worldFlipY = skeletonFlipY != this.flipY;
            }
            var radians = this.worldRotation * spine.degRad;
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);
            if (this.worldFlipX) {
                this.m00 = -cos * this.worldScaleX;
                this.m01 = sin * this.worldScaleY;
            } else {
                this.m00 = cos * this.worldScaleX;
                this.m01 = -sin * this.worldScaleY;
            }
            if (this.worldFlipY != spine.Bone.yDown) {
                this.m10 = -sin * this.worldScaleX;
                this.m11 = -cos * this.worldScaleY;
            } else {
                this.m10 = sin * this.worldScaleX;
                this.m11 = cos * this.worldScaleY;
            }
        },
        setToSetupPose: function () {
            var data = this.data;
            this.x = data.x;
            this.y = data.y;
            this.rotation = data.rotation;
            this.rotationIK = this.rotation;
            this.scaleX = data.scaleX;
            this.scaleY = data.scaleY;
            this.flipX = data.flipX;
            this.flipY = data.flipY;
        },
        worldToLocal: function (world) {
            var dx = world[0] - this.worldX, dy = world[1] - this.worldY;
            var m00 = this.m00, m10 = this.m10, m01 = this.m01, m11 = this.m11;
            if (this.worldFlipX != (this.worldFlipY != spine.Bone.yDown)) {
                m00 = -m00;
                m11 = -m11;
            }
            var invDet = 1 / (m00 * m11 - m01 * m10);
            world[0] = dx * m00 * invDet - dy * m01 * invDet;
            world[1] = dy * m11 * invDet - dx * m10 * invDet;
        },
        localToWorld: function (local) {
            var localX = local[0], localY = local[1];
            local[0] = localX * this.m00 + localY * this.m01 + this.worldX;
            local[1] = localX * this.m10 + localY * this.m11 + this.worldY;
        }
    };
    spine.Slot = function (slotData, bone) {
        this.data = slotData;
        this.bone = bone;
        this.setToSetupPose();
    };
    spine.Slot.prototype = {
        r: 1, g: 1, b: 1, a: 1,
        _attachmentTime: 0,
        attachment: null,
        attachmentVertices: [],
        setAttachment: function (attachment) {
            this.attachment = attachment;
            this._attachmentTime = this.bone.skeleton.time;
            this.attachmentVertices.length = 0;
        },
        setAttachmentTime: function (time) {
            this._attachmentTime = this.bone.skeleton.time - time;
        },
        getAttachmentTime: function () {
            return this.bone.skeleton.time - this._attachmentTime;
        },
        setToSetupPose: function () {
            var data = this.data;
            this.r = data.r;
            this.g = data.g;
            this.b = data.b;
            this.a = data.a;

            var slotDatas = this.bone.skeleton.data.slots;
            for (var i = 0, n = slotDatas.length; i < n; i++) {
                if (slotDatas[i] == data) {
                    this.setAttachment(!data.attachmentName ? null : this.bone.skeleton.getAttachmentBySlotIndex(i, data.attachmentName));
                    break;
                }
            }
        }
    };
    spine.IkConstraint = function (data, skeleton) {
        this.data = data;
        this.mix = data.mix;
        this.bendDirection = data.bendDirection;

        this.bones = [];
        for (var i = 0, n = data.bones.length; i < n; i++)
            this.bones.push(skeleton.findBone(data.bones[i].name));
        this.target = skeleton.findBone(data.target.name);
    };
    spine.IkConstraint.prototype = {
        apply: function () {
            var target = this.target;
            var bones = this.bones;
            switch (bones.length) {
                case 1:
                    spine.IkConstraint.apply1(bones[0], target.worldX, target.worldY, this.mix);
                    break;
                case 2:
                    spine.IkConstraint.apply2(bones[0], bones[1], target.worldX, target.worldY, this.bendDirection, this.mix);
                    break;
            }
        }
    };
    spine.IkConstraint.apply1 = function (bone, targetX, targetY, alpha) {
        var parentRotation = (!bone.data.inheritRotation || !bone.parent) ? 0 : bone.parent.worldRotation;
        var rotation = bone.rotation;
        var rotationIK = Math.atan2(targetY - bone.worldY, targetX - bone.worldX) * spine.radDeg - parentRotation;
        bone.rotationIK = rotation + (rotationIK - rotation) * alpha;
    };
    spine.IkConstraint.apply2 = function (parent, child, targetX, targetY, bendDirection, alpha) {
        var childRotation = child.rotation, parentRotation = parent.rotation;
        if (!alpha) {
            child.rotationIK = childRotation;
            parent.rotationIK = parentRotation;
            return;
        }
        var positionX, positionY, tempPosition = spine.temp;
        var parentParent = parent.parent;
        if (parentParent) {
            tempPosition[0] = targetX;
            tempPosition[1] = targetY;
            parentParent.worldToLocal(tempPosition);
            targetX = (tempPosition[0] - parent.x) * parentParent.worldScaleX;
            targetY = (tempPosition[1] - parent.y) * parentParent.worldScaleY;
        } else {
            targetX -= parent.x;
            targetY -= parent.y;
        }
        if (child.parent == parent) {
            positionX = child.x;
            positionY = child.y;
        } else {
            tempPosition[0] = child.x;
            tempPosition[1] = child.y;
            child.parent.localToWorld(tempPosition);
            parent.worldToLocal(tempPosition);
            positionX = tempPosition[0];
            positionY = tempPosition[1];
        }
        var childX = positionX * parent.worldScaleX, childY = positionY * parent.worldScaleY;
        var offset = Math.atan2(childY, childX);
        var len1 = Math.sqrt(childX * childX + childY * childY), len2 = child.data.length * child.worldScaleX;
        // Based on code by Ryan Juckett with permission: Copyright (c) 2008-2009 Ryan Juckett, http://www.ryanjuckett.com/
        var cosDenom = 2 * len1 * len2;
        if (cosDenom < 0.0001) {
            child.rotationIK = childRotation + (Math.atan2(targetY, targetX) * spine.radDeg - parentRotation - childRotation) * alpha;
            return;
        }
        var cos = (targetX * targetX + targetY * targetY - len1 * len1 - len2 * len2) / cosDenom;
        if (cos < -1)
            cos = -1;
        else if (cos > 1)
            cos = 1;
        var childAngle = Math.acos(cos) * bendDirection;
        var adjacent = len1 + len2 * cos, opposite = len2 * Math.sin(childAngle);
        var parentAngle = Math.atan2(targetY * adjacent - targetX * opposite, targetX * adjacent + targetY * opposite);
        var rotation = (parentAngle - offset) * spine.radDeg - parentRotation;
        if (rotation > 180)
            rotation -= 360;
        else if (rotation < -180) //
            rotation += 360;
        parent.rotationIK = parentRotation + rotation * alpha;
        rotation = (childAngle + offset) * spine.radDeg - childRotation;
        if (rotation > 180)
            rotation -= 360;
        else if (rotation < -180) //
            rotation += 360;
        child.rotationIK = childRotation + (rotation + parent.worldRotation - child.parent.worldRotation) * alpha;
    };
    spine.Skin = function (name) {
        this.name = name;
        this.attachments = {};
    };
    spine.Skin.prototype = {
        addAttachment: function (slotIndex, name, attachment) {
            this.attachments[slotIndex + ":" + name] = attachment;
        },
        getAttachment: function (slotIndex, name) {
            return this.attachments[slotIndex + ":" + name];
        },
        _attachAll: function (skeleton, oldSkin) {
            for (var key in oldSkin.attachments) {
                var colon = key.indexOf(":");
                var slotIndex = parseInt(key.substring(0, colon));
                var name = key.substring(colon + 1);
                var slot = skeleton.slots[slotIndex];
                if (slot.attachment && slot.attachment.name == name) {
                    var attachment = this.getAttachment(slotIndex, name);
                    if (attachment) slot.setAttachment(attachment);
                }
            }
        }
    };
    spine.Animation = function (name, timelines, duration) {
        this.name = name;
        this.timelines = timelines;
        this.duration = duration;
    };
    spine.Animation.prototype = {
        apply: function (skeleton, lastTime, time, loop, events) {
            if (loop && this.duration != 0) {
                time %= this.duration;
                lastTime %= this.duration;
            }
            var timelines = this.timelines;
            for (var i = 0, n = timelines.length; i < n; i++)
                timelines[i].apply(skeleton, lastTime, time, events, 1);
        },
        mix: function (skeleton, lastTime, time, loop, events, alpha) {
            if (loop && this.duration != 0) {
                time %= this.duration;
                lastTime %= this.duration;
            }
            var timelines = this.timelines;
            for (var i = 0, n = timelines.length; i < n; i++)
                timelines[i].apply(skeleton, lastTime, time, events, alpha);
        }
    };
    spine.Animation.binarySearch = function (values, target, step) {
        var low = 0;
        var high = Math.floor(values.length / step) - 2;
        if (!high) return step;
        var current = high >>> 1;
        while (true) {
            if (values[(current + 1) * step] <= target)
                low = current + 1;
            else
                high = current;
            if (low == high) return (low + 1) * step;
            current = (low + high) >>> 1;
        }
    };
    spine.Animation.binarySearch1 = function (values, target) {
        var low = 0;
        var high = values.length - 2;
        if (!high) return 1;
        var current = high >>> 1;
        while (true) {
            if (values[current + 1] <= target)
                low = current + 1;
            else
                high = current;
            if (low == high) return low + 1;
            current = (low + high) >>> 1;
        }
    };
    spine.Animation.linearSearch = function (values, target, step) {
        for (var i = 0, last = values.length - step; i <= last; i += step)
            if (values[i] > target) return i;
        return -1;
    };
    spine.Curves = function (frameCount) {
        this.curves = [];
    };
    spine.Curves.prototype = {
        setLinear: function (frameIndex) {
            this.curves[frameIndex * 19/*BEZIER_SIZE*/] = 0/*LINEAR*/;
        },
        setStepped: function (frameIndex) {
            this.curves[frameIndex * 19/*BEZIER_SIZE*/] = 1/*STEPPED*/;
        },
        setCurve: function (frameIndex, cx1, cy1, cx2, cy2) {
            var subdiv1 = 1 / 10/*BEZIER_SEGMENTS*/, subdiv2 = subdiv1 * subdiv1, subdiv3 = subdiv2 * subdiv1;
            var pre1 = 3 * subdiv1, pre2 = 3 * subdiv2, pre4 = 6 * subdiv2, pre5 = 6 * subdiv3;
            var tmp1x = -cx1 * 2 + cx2, tmp1y = -cy1 * 2 + cy2, tmp2x = (cx1 - cx2) * 3 + 1, tmp2y = (cy1 - cy2) * 3 + 1;
            var dfx = cx1 * pre1 + tmp1x * pre2 + tmp2x * subdiv3, dfy = cy1 * pre1 + tmp1y * pre2 + tmp2y * subdiv3;
            var ddfx = tmp1x * pre4 + tmp2x * pre5, ddfy = tmp1y * pre4 + tmp2y * pre5;
            var dddfx = tmp2x * pre5, dddfy = tmp2y * pre5;

            var i = frameIndex * 19/*BEZIER_SIZE*/;
            var curves = this.curves;
            curves[i++] = 2/*BEZIER*/;

            var x = dfx, y = dfy;
            for (var n = i + 19/*BEZIER_SIZE*/ - 1; i < n; i += 2) {
                curves[i] = x;
                curves[i + 1] = y;
                dfx += ddfx;
                dfy += ddfy;
                ddfx += dddfx;
                ddfy += dddfy;
                x += dfx;
                y += dfy;
            }
        },
        getCurvePercent: function (frameIndex, percent) {
            percent = percent < 0 ? 0 : (percent > 1 ? 1 : percent);
            var curves = this.curves;
            var i = frameIndex * 19/*BEZIER_SIZE*/;
            var type = curves[i];
            if (type === 0/*LINEAR*/) return percent;
            if (type == 1/*STEPPED*/) return 0;
            i++;
            var x = 0;
            for (var start = i, n = i + 19/*BEZIER_SIZE*/ - 1; i < n; i += 2) {
                x = curves[i];
                if (x >= percent) {
                    var prevX, prevY;
                    if (i == start) {
                        prevX = 0;
                        prevY = 0;
                    } else {
                        prevX = curves[i - 2];
                        prevY = curves[i - 1];
                    }
                    return prevY + (curves[i + 1] - prevY) * (percent - prevX) / (x - prevX);
                }
            }
            var y = curves[i - 1];
            return y + (1 - y) * (percent - x) / (1 - x); // Last point is 1,1.
        }
    };
    spine.RotateTimeline = function (frameCount) {
        this.curves = new spine.Curves(frameCount);
        this.frames = []; // time, angle, ...
        this.frames.length = frameCount * 2;
    };
    spine.RotateTimeline.prototype = {
        boneIndex: 0,
        getFrameCount: function () {
            return this.frames.length / 2;
        },
        setFrame: function (frameIndex, time, angle) {
            frameIndex *= 2;
            this.frames[frameIndex] = time;
            this.frames[frameIndex + 1] = angle;
        },
        apply: function (skeleton, lastTime, time, firedEvents, alpha) {
            var frames = this.frames;
            if (time < frames[0]) return; // Time is before first frame.

            var bone = skeleton.bones[this.boneIndex];

            if (time >= frames[frames.length - 2]) { // Time is after last frame.
                var amount = bone.data.rotation + frames[frames.length - 1] - bone.rotation;
                while (amount > 180)
                    amount -= 360;
                while (amount < -180)
                    amount += 360;
                bone.rotation += amount * alpha;
                return;
            }

            // Interpolate between the previous frame and the current frame.
            var frameIndex = spine.Animation.binarySearch(frames, time, 2);
            var prevFrameValue = frames[frameIndex - 1];
            var frameTime = frames[frameIndex];
            var percent = 1 - (time - frameTime) / (frames[frameIndex - 2/*PREV_FRAME_TIME*/] - frameTime);
            percent = this.curves.getCurvePercent(frameIndex / 2 - 1, percent);

            var amount = frames[frameIndex + 1/*FRAME_VALUE*/] - prevFrameValue;
            while (amount > 180)
                amount -= 360;
            while (amount < -180)
                amount += 360;
            amount = bone.data.rotation + (prevFrameValue + amount * percent) - bone.rotation;
            while (amount > 180)
                amount -= 360;
            while (amount < -180)
                amount += 360;
            bone.rotation += amount * alpha;
        }
    };
    spine.TranslateTimeline = function (frameCount) {
        this.curves = new spine.Curves(frameCount);
        this.frames = []; // time, x, y, ...
        this.frames.length = frameCount * 3;
    };
    spine.TranslateTimeline.prototype = {
        boneIndex: 0,
        getFrameCount: function () {
            return this.frames.length / 3;
        },
        setFrame: function (frameIndex, time, x, y) {
            frameIndex *= 3;
            this.frames[frameIndex] = time;
            this.frames[frameIndex + 1] = x;
            this.frames[frameIndex + 2] = y;
        },
        apply: function (skeleton, lastTime, time, firedEvents, alpha) {
            var frames = this.frames;
            if (time < frames[0]) return; // Time is before first frame.

            var bone = skeleton.bones[this.boneIndex];

            if (time >= frames[frames.length - 3]) { // Time is after last frame.
                bone.x += (bone.data.x + frames[frames.length - 2] - bone.x) * alpha;
                bone.y += (bone.data.y + frames[frames.length - 1] - bone.y) * alpha;
                return;
            }

            // Interpolate between the previous frame and the current frame.
            var frameIndex = spine.Animation.binarySearch(frames, time, 3);
            var prevFrameX = frames[frameIndex - 2];
            var prevFrameY = frames[frameIndex - 1];
            var frameTime = frames[frameIndex];
            var percent = 1 - (time - frameTime) / (frames[frameIndex + -3/*PREV_FRAME_TIME*/] - frameTime);
            percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);

            bone.x += (bone.data.x + prevFrameX + (frames[frameIndex + 1/*FRAME_X*/] - prevFrameX) * percent - bone.x) * alpha;
            bone.y += (bone.data.y + prevFrameY + (frames[frameIndex + 2/*FRAME_Y*/] - prevFrameY) * percent - bone.y) * alpha;
        }
    };
    spine.ScaleTimeline = function (frameCount) {
        this.curves = new spine.Curves(frameCount);
        this.frames = []; // time, x, y, ...
        this.frames.length = frameCount * 3;
    };
    spine.ScaleTimeline.prototype = {
        boneIndex: 0,
        getFrameCount: function () {
            return this.frames.length / 3;
        },
        setFrame: function (frameIndex, time, x, y) {
            frameIndex *= 3;
            this.frames[frameIndex] = time;
            this.frames[frameIndex + 1] = x;
            this.frames[frameIndex + 2] = y;
        },
        apply: function (skeleton, lastTime, time, firedEvents, alpha) {
            var frames = this.frames;
            if (time < frames[0]) return; // Time is before first frame.

            var bone = skeleton.bones[this.boneIndex];

            if (time >= frames[frames.length - 3]) { // Time is after last frame.
                bone.scaleX += (bone.data.scaleX * frames[frames.length - 2] - bone.scaleX) * alpha;
                bone.scaleY += (bone.data.scaleY * frames[frames.length - 1] - bone.scaleY) * alpha;
                return;
            }

            // Interpolate between the previous frame and the current frame.
            var frameIndex = spine.Animation.binarySearch(frames, time, 3);
            var prevFrameX = frames[frameIndex - 2];
            var prevFrameY = frames[frameIndex - 1];
            var frameTime = frames[frameIndex];
            var percent = 1 - (time - frameTime) / (frames[frameIndex + -3/*PREV_FRAME_TIME*/] - frameTime);
            percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);

            bone.scaleX += (bone.data.scaleX * (prevFrameX + (frames[frameIndex + 1/*FRAME_X*/] - prevFrameX) * percent) - bone.scaleX) * alpha;
            bone.scaleY += (bone.data.scaleY * (prevFrameY + (frames[frameIndex + 2/*FRAME_Y*/] - prevFrameY) * percent) - bone.scaleY) * alpha;
        }
    };
    spine.ColorTimeline = function (frameCount) {
        this.curves = new spine.Curves(frameCount);
        this.frames = []; // time, r, g, b, a, ...
        this.frames.length = frameCount * 5;
    };
    spine.ColorTimeline.prototype = {
        slotIndex: 0,
        getFrameCount: function () {
            return this.frames.length / 5;
        },
        setFrame: function (frameIndex, time, r, g, b, a) {
            frameIndex *= 5;
            this.frames[frameIndex] = time;
            this.frames[frameIndex + 1] = r;
            this.frames[frameIndex + 2] = g;
            this.frames[frameIndex + 3] = b;
            this.frames[frameIndex + 4] = a;
        },
        apply: function (skeleton, lastTime, time, firedEvents, alpha) {
            var frames = this.frames;
            if (time < frames[0]) return; // Time is before first frame.

            var r, g, b, a;
            if (time >= frames[frames.length - 5]) {
                // Time is after last frame.
                var i = frames.length - 1;
                r = frames[i - 3];
                g = frames[i - 2];
                b = frames[i - 1];
                a = frames[i];
            } else {
                // Interpolate between the previous frame and the current frame.
                var frameIndex = spine.Animation.binarySearch(frames, time, 5);
                var prevFrameR = frames[frameIndex - 4];
                var prevFrameG = frames[frameIndex - 3];
                var prevFrameB = frames[frameIndex - 2];
                var prevFrameA = frames[frameIndex - 1];
                var frameTime = frames[frameIndex];
                var percent = 1 - (time - frameTime) / (frames[frameIndex - 5/*PREV_FRAME_TIME*/] - frameTime);
                percent = this.curves.getCurvePercent(frameIndex / 5 - 1, percent);

                r = prevFrameR + (frames[frameIndex + 1/*FRAME_R*/] - prevFrameR) * percent;
                g = prevFrameG + (frames[frameIndex + 2/*FRAME_G*/] - prevFrameG) * percent;
                b = prevFrameB + (frames[frameIndex + 3/*FRAME_B*/] - prevFrameB) * percent;
                a = prevFrameA + (frames[frameIndex + 4/*FRAME_A*/] - prevFrameA) * percent;
            }
            var slot = skeleton.slots[this.slotIndex];
            if (alpha < 1) {
                slot.r += (r - slot.r) * alpha;
                slot.g += (g - slot.g) * alpha;
                slot.b += (b - slot.b) * alpha;
                slot.a += (a - slot.a) * alpha;
            } else {
                slot.r = r;
                slot.g = g;
                slot.b = b;
                slot.a = a;
            }
        }
    };
    spine.AttachmentTimeline = function (frameCount) {
        this.curves = new spine.Curves(frameCount);
        this.frames = []; // time, ...
        this.frames.length = frameCount;
        this.attachmentNames = [];
        this.attachmentNames.length = frameCount;
    };
    spine.AttachmentTimeline.prototype = {
        slotIndex: 0,
        getFrameCount: function () {
            return this.frames.length;
        },
        setFrame: function (frameIndex, time, attachmentName) {
            this.frames[frameIndex] = time;
            this.attachmentNames[frameIndex] = attachmentName;
        },
        apply: function (skeleton, lastTime, time, firedEvents, alpha) {
            var frames = this.frames;
            if (time < frames[0]) {
                if (lastTime > time) this.apply(skeleton, lastTime, Number.MAX_VALUE, null, 0);
                return;
            } else if (lastTime > time) //
                lastTime = -1;

            var frameIndex = time >= frames[frames.length - 1] ? frames.length - 1 : spine.Animation.binarySearch1(frames, time) - 1;
            if (frames[frameIndex] < lastTime) return;

            var attachmentName = this.attachmentNames[frameIndex];
            skeleton.slots[this.slotIndex].setAttachment(
                !attachmentName ? null : skeleton.getAttachmentBySlotIndex(this.slotIndex, attachmentName));
        }
    };
    spine.EventTimeline = function (frameCount) {
        this.frames = []; // time, ...
        this.frames.length = frameCount;
        this.events = [];
        this.events.length = frameCount;
    };
    spine.EventTimeline.prototype = {
        getFrameCount: function () {
            return this.frames.length;
        },
        setFrame: function (frameIndex, time, event) {
            this.frames[frameIndex] = time;
            this.events[frameIndex] = event;
        },
        /** Fires events for frames > lastTime and <= time. */
        apply: function (skeleton, lastTime, time, firedEvents, alpha) {
            if (!firedEvents) return;

            var frames = this.frames;
            var frameCount = frames.length;

            if (lastTime > time) { // Fire events after last time for looped animations.
                this.apply(skeleton, lastTime, Number.MAX_VALUE, firedEvents, alpha);
                lastTime = -1;
            } else if (lastTime >= frames[frameCount - 1]) // Last time is after last frame.
                return;
            if (time < frames[0]) return; // Time is before first frame.

            var frameIndex;
            if (lastTime < frames[0])
                frameIndex = 0;
            else {
                frameIndex = spine.Animation.binarySearch1(frames, lastTime);
                var frame = frames[frameIndex];
                while (frameIndex > 0) { // Fire multiple events with the same frame.
                    if (frames[frameIndex - 1] != frame) break;
                    frameIndex--;
                }
            }
            var events = this.events;
            for (; frameIndex < frameCount && time >= frames[frameIndex]; frameIndex++)
                firedEvents.push(events[frameIndex]);
        }
    };
    spine.DrawOrderTimeline = function (frameCount) {
        this.frames = []; // time, ...
        this.frames.length = frameCount;
        this.drawOrders = [];
        this.drawOrders.length = frameCount;
    };
    spine.DrawOrderTimeline.prototype = {
        getFrameCount: function () {
            return this.frames.length;
        },
        setFrame: function (frameIndex, time, drawOrder) {
            this.frames[frameIndex] = time;
            this.drawOrders[frameIndex] = drawOrder;
        },
        apply: function (skeleton, lastTime, time, firedEvents, alpha) {
            var frames = this.frames;
            if (time < frames[0]) return; // Time is before first frame.

            var frameIndex;
            if (time >= frames[frames.length - 1]) // Time is after last frame.
                frameIndex = frames.length - 1;
            else
                frameIndex = spine.Animation.binarySearch1(frames, time) - 1;

            var drawOrder = skeleton.drawOrder;
            var slots = skeleton.slots;
            var drawOrderToSetupIndex = this.drawOrders[frameIndex];
            if (drawOrderToSetupIndex) {
                for (var i = 0, n = drawOrderToSetupIndex.length; i < n; i++)
                    drawOrder[i] = drawOrderToSetupIndex[i];
            }

        }
    };
    spine.FfdTimeline = function (frameCount) {
        this.curves = new spine.Curves(frameCount);
        this.frames = [];
        this.frames.length = frameCount;
        this.frameVertices = [];
        this.frameVertices.length = frameCount;
    };
    spine.FfdTimeline.prototype = {
        slotIndex: 0,
        attachment: 0,
        getFrameCount: function () {
            return this.frames.length;
        },
        setFrame: function (frameIndex, time, vertices) {
            this.frames[frameIndex] = time;
            this.frameVertices[frameIndex] = vertices;
        },
        apply: function (skeleton, lastTime, time, firedEvents, alpha) {
            var slot = skeleton.slots[this.slotIndex];
            if (slot.attachment != this.attachment) return;

            var frames = this.frames;
            if (time < frames[0]) return; // Time is before first frame.

            var frameVertices = this.frameVertices;
            var vertexCount = frameVertices[0].length;

            var vertices = slot.attachmentVertices;
            if (vertices.length != vertexCount) alpha = 1;
            vertices.length = vertexCount;

            if (time >= frames[frames.length - 1]) { // Time is after last frame.
                var lastVertices = frameVertices[frames.length - 1];
                if (alpha < 1) {
                    for (var i = 0; i < vertexCount; i++)
                        vertices[i] += (lastVertices[i] - vertices[i]) * alpha;
                } else {
                    for (var i = 0; i < vertexCount; i++)
                        vertices[i] = lastVertices[i];
                }
                return;
            }

            // Interpolate between the previous frame and the current frame.
            var frameIndex = spine.Animation.binarySearch1(frames, time);
            var frameTime = frames[frameIndex];
            var percent = 1 - (time - frameTime) / (frames[frameIndex - 1] - frameTime);
            percent = this.curves.getCurvePercent(frameIndex - 1, percent < 0 ? 0 : (percent > 1 ? 1 : percent));

            var prevVertices = frameVertices[frameIndex - 1];
            var nextVertices = frameVertices[frameIndex];

            if (alpha < 1) {
                for (var i = 0; i < vertexCount; i++) {
                    var prev = prevVertices[i];
                    vertices[i] += (prev + (nextVertices[i] - prev) * percent - vertices[i]) * alpha;
                }
            } else {
                for (var i = 0; i < vertexCount; i++) {
                    var prev = prevVertices[i];
                    vertices[i] = prev + (nextVertices[i] - prev) * percent;
                }
            }
        }
    };
    spine.IkConstraintTimeline = function (frameCount) {
        this.curves = new spine.Curves(frameCount);
        this.frames = []; // time, mix, bendDirection, ...
        this.frames.length = frameCount * 3;
    };
    spine.IkConstraintTimeline.prototype = {
        ikConstraintIndex: 0,
        getFrameCount: function () {
            return this.frames.length / 3;
        },
        setFrame: function (frameIndex, time, mix, bendDirection) {
            frameIndex *= 3;
            this.frames[frameIndex] = time;
            this.frames[frameIndex + 1] = mix;
            this.frames[frameIndex + 2] = bendDirection;
        },
        apply: function (skeleton, lastTime, time, firedEvents, alpha) {
            var frames = this.frames;
            if (time < frames[0]) return; // Time is before first frame.

            var ikConstraint = skeleton.ikConstraints[this.ikConstraintIndex];

            if (time >= frames[frames.length - 3]) { // Time is after last frame.
                ikConstraint.mix += (frames[frames.length - 2] - ikConstraint.mix) * alpha;
                ikConstraint.bendDirection = frames[frames.length - 1];
                return;
            }

            // Interpolate between the previous frame and the current frame.
            var frameIndex = spine.Animation.binarySearch(frames, time, 3);
            var prevFrameMix = frames[frameIndex + -2/*PREV_FRAME_MIX*/];
            var frameTime = frames[frameIndex];
            var percent = 1 - (time - frameTime) / (frames[frameIndex + -3/*PREV_FRAME_TIME*/] - frameTime);
            percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);

            var mix = prevFrameMix + (frames[frameIndex + 1/*FRAME_MIX*/] - prevFrameMix) * percent;
            ikConstraint.mix += (mix - ikConstraint.mix) * alpha;
            ikConstraint.bendDirection = frames[frameIndex + -1/*PREV_FRAME_BEND_DIRECTION*/];
        }
    };
    spine.FlipXTimeline = function (frameCount) {
        this.curves = new spine.Curves(frameCount);
        this.frames = []; // time, flip, ...
        this.frames.length = frameCount * 2;
    };
    spine.FlipXTimeline.prototype = {
        boneIndex: 0,
        getFrameCount: function () {
            return this.frames.length / 2;
        },
        setFrame: function (frameIndex, time, flip) {
            frameIndex *= 2;
            this.frames[frameIndex] = time;
            this.frames[frameIndex + 1] = flip ? 1 : 0;
        },
        apply: function (skeleton, lastTime, time, firedEvents, alpha) {
            var frames = this.frames;
            if (time < frames[0]) {
                if (lastTime > time) this.apply(skeleton, lastTime, Number.MAX_VALUE, null, 0);
                return;
            } else if (lastTime > time) //
                lastTime = -1;
            var frameIndex = (time >= frames[frames.length - 2] ? frames.length : spine.Animation.binarySearch(frames, time, 2)) - 2;
            if (frames[frameIndex] < lastTime) return;
            skeleton.bones[boneIndex].flipX = frames[frameIndex + 1] != 0;
        }
    };
    spine.FlipYTimeline = function (frameCount) {
        this.curves = new spine.Curves(frameCount);
        this.frames = []; // time, flip, ...
        this.frames.length = frameCount * 2;
    };
    spine.FlipYTimeline.prototype = {
        boneIndex: 0,
        getFrameCount: function () {
            return this.frames.length / 2;
        },
        setFrame: function (frameIndex, time, flip) {
            frameIndex *= 2;
            this.frames[frameIndex] = time;
            this.frames[frameIndex + 1] = flip ? 1 : 0;
        },
        apply: function (skeleton, lastTime, time, firedEvents, alpha) {
            var frames = this.frames;
            if (time < frames[0]) {
                if (lastTime > time) this.apply(skeleton, lastTime, Number.MAX_VALUE, null, 0);
                return;
            } else if (lastTime > time) //
                lastTime = -1;
            var frameIndex = (time >= frames[frames.length - 2] ? frames.length : spine.Animation.binarySearch(frames, time, 2)) - 2;
            if (frames[frameIndex] < lastTime) return;
            skeleton.bones[boneIndex].flipY = frames[frameIndex + 1] != 0;
        }
    };
    spine.SkeletonData = function () {
        this.bones = [];
        this.slots = [];
        this.skins = [];
        this.events = [];
        this.animations = [];
        this.ikConstraints = [];
    };
    spine.SkeletonData.prototype = {
        name: null,
        defaultSkin: null,
        width: 0, height: 0,
        version: null, hash: null,
        findBone: function (boneName) {
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++)
                if (bones[i].name == boneName) return bones[i];
            return null;
        },
        findBoneIndex: function (boneName) {
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++)
                if (bones[i].name == boneName) return i;
            return -1;
        },
        findSlot: function (slotName) {
            var slots = this.slots;
            for (var i = 0, n = slots.length; i < n; i++) {
                if (slots[i].name == slotName) return slot[i];
            }
            return null;
        },
        findSlotIndex: function (slotName) {
            var slots = this.slots;
            for (var i = 0, n = slots.length; i < n; i++)
                if (slots[i].name == slotName) return i;
            return -1;
        },
        findSkin: function (skinName) {
            var skins = this.skins;
            for (var i = 0, n = skins.length; i < n; i++)
                if (skins[i].name == skinName) return skins[i];
            return null;
        },
        findEvent: function (eventName) {
            var events = this.events;
            for (var i = 0, n = events.length; i < n; i++)
                if (events[i].name == eventName) return events[i];
            return null;
        },
        findAnimation: function (animationName) {
            var animations = this.animations;
            for (var i = 0, n = animations.length; i < n; i++)
                if (animations[i].name == animationName) return animations[i];
            return null;
        },
        findIkConstraint: function (ikConstraintName) {
            var ikConstraints = this.ikConstraints;
            for (var i = 0, n = ikConstraints.length; i < n; i++)
                if (ikConstraints[i].name == ikConstraintName) return ikConstraints[i];
            return null;
        }
    };
    spine.Skeleton = function (skeletonData) {
        this.data = skeletonData;

        this.bones = [];
        for (var i = 0, n = skeletonData.bones.length; i < n; i++) {
            var boneData = skeletonData.bones[i];
            var parent = !boneData.parent ? null : this.bones[skeletonData.bones.indexOf(boneData.parent)];
            this.bones.push(new spine.Bone(boneData, this, parent));
        }

        this.slots = [];
        this.drawOrder = [];
        for (var i = 0, n = skeletonData.slots.length; i < n; i++) {
            var slotData = skeletonData.slots[i];
            var bone = this.bones[skeletonData.bones.indexOf(slotData.boneData)];
            var slot = new spine.Slot(slotData, bone);
            this.slots.push(slot);
            this.drawOrder.push(i);
        }

        this.ikConstraints = [];
        for (var i = 0, n = skeletonData.ikConstraints.length; i < n; i++)
            this.ikConstraints.push(new spine.IkConstraint(skeletonData.ikConstraints[i], this));

        this.boneCache = [];
        this.updateCache();
    };
    spine.Skeleton.prototype = {
        x: 0, y: 0,
        skin: null,
        r: 1, g: 1, b: 1, a: 1,
        time: 0,
        flipX: false, flipY: false,
        updateCache: function () {
            var ikConstraints = this.ikConstraints;
            var ikConstraintsCount = ikConstraints.length;

            var arrayCount = ikConstraintsCount + 1;
            var boneCache = this.boneCache;
            if (boneCache.length > arrayCount) boneCache.length = arrayCount;
            for (var i = 0, n = boneCache.length; i < n; i++)
                boneCache[i].length = 0;
            while (boneCache.length < arrayCount)
                boneCache[boneCache.length] = [];

            var nonIkBones = boneCache[0];
            var bones = this.bones;

            outer:
                for (var i = 0, n = bones.length; i < n; i++) {
                    var bone = bones[i];
                    var current = bone;
                    do {
                        for (var ii = 0; ii < ikConstraintsCount; ii++) {
                            var ikConstraint = ikConstraints[ii];
                            var parent = ikConstraint.bones[0];
                            var child= ikConstraint.bones[ikConstraint.bones.length - 1];
                            while (true) {
                                if (current == child) {
                                    boneCache[ii].push(bone);
                                    boneCache[ii + 1].push(bone);
                                    continue outer;
                                }
                                if (child == parent) break;
                                child = child.parent;
                            }
                        }
                        current = current.parent;
                    } while (current);
                    nonIkBones[nonIkBones.length] = bone;
                }
        },
        updateWorldTransform: function () {
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++) {
                var bone = bones[i];
                bone.rotationIK = bone.rotation;
            }
            var i = 0, last = this.boneCache.length - 1;
            while (true) {
                var cacheBones = this.boneCache[i];
                for (var ii = 0, nn = cacheBones.length; ii < nn; ii++)
                    cacheBones[ii].updateWorldTransform();
                if (i == last) break;
                this.ikConstraints[i].apply();
                i++;
            }
        },
        setToSetupPose: function () {
            this.setBonesToSetupPose();
            this.setSlotsToSetupPose();
        },
        setBonesToSetupPose: function () {
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++)
                bones[i].setToSetupPose();

            var ikConstraints = this.ikConstraints;
            for (var i = 0, n = ikConstraints.length; i < n; i++) {
                var ikConstraint = ikConstraints[i];
                ikConstraint.bendDirection = ikConstraint.data.bendDirection;
                ikConstraint.mix = ikConstraint.data.mix;
            }
        },
        setSlotsToSetupPose: function () {
            var slots = this.slots;
            for (var i = 0, n = slots.length; i < n; i++) {
                slots[i].setToSetupPose(i);
            }
            this.resetDrawOrder();
        },
        getRootBone: function () {
            return this.bones.length ? this.bones[0] : null;
        },
        findBone: function (boneName) {
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++)
                if (bones[i].data.name == boneName) return bones[i];
            return null;
        },
        findBoneIndex: function (boneName) {
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++)
                if (bones[i].data.name == boneName) return i;
            return -1;
        },
        findSlot: function (slotName) {
            var slots = this.slots;
            for (var i = 0, n = slots.length; i < n; i++)
                if (slots[i].data.name == slotName) return slots[i];
            return null;
        },
        findSlotIndex: function (slotName) {
            var slots = this.slots;
            for (var i = 0, n = slots.length; i < n; i++)
                if (slots[i].data.name == slotName) return i;
            return -1;
        },
        setSkinByName: function (skinName) {
            var skin = this.data.findSkin(skinName);
            if (!skin) throw "Skin not found: " + skinName;
            this.setSkin(skin);
        },
        setSkin: function (newSkin) {
            if (newSkin) {
                if (this.skin)
                    newSkin._attachAll(this, this.skin);
                else {
                    var slots = this.slots;
                    for (var i = 0, n = slots.length; i < n; i++) {
                        var slot = slots[i];
                        var name = slot.data.attachmentName;
                        if (name) {
                            var attachment = newSkin.getAttachment(i, name);
                            if (attachment) slot.setAttachment(attachment);
                        }
                    }
                }
            }
            this.skin = newSkin;
        },
        getAttachmentBySlotName: function (slotName, attachmentName) {
            return this.getAttachmentBySlotIndex(this.data.findSlotIndex(slotName), attachmentName);
        },
        getAttachmentBySlotIndex: function (slotIndex, attachmentName) {
            if (this.skin) {
                var attachment = this.skin.getAttachment(slotIndex, attachmentName);
                if (attachment) return attachment;
            }
            if (this.data.defaultSkin) return this.data.defaultSkin.getAttachment(slotIndex, attachmentName);
            return null;
        },
        setAttachment: function (slotName, attachmentName) {
            var slots = this.slots;
            for (var i = 0, n = slots.length; i < n; i++) {
                var slot = slots[i];
                if (slot.data.name == slotName) {
                    var attachment = null;
                    if (attachmentName) {
                        attachment = this.getAttachmentBySlotIndex(i, attachmentName);
                        if (!attachment) throw "Attachment not found: " + attachmentName + ", for slot: " + slotName;
                    }
                    slot.setAttachment(attachment);
                    return;
                }
            }
            throw "Slot not found: " + slotName;
        },
        findIkConstraint: function (ikConstraintName) {
            var ikConstraints = this.ikConstraints;
            for (var i = 0, n = ikConstraints.length; i < n; i++)
                if (ikConstraints[i].data.name == ikConstraintName) return ikConstraints[i];
            return null;
        },
        update: function (delta) {
            this.time += delta;
        },
        resetDrawOrder: function() {
            for (var i = 0, n = this.drawOrder.length; i < n; i++)
                this.drawOrder[i] = i;
        }
    };
    spine.EventData = function (name) {
        this.name = name;
    };
    spine.EventData.prototype = {
        intValue: 0,
        floatValue: 0,
        stringValue: null
    };
    spine.Event = function (data) {
        this.data = data;
    };
    spine.Event.prototype = {
        intValue: 0,
        floatValue: 0,
        stringValue: null
    };
    spine.AttachmentType = {
        region: 0,
        boundingbox: 1,
        mesh: 2,
        skinnedmesh: 3
    };
    spine.RegionAttachment = function (name) {
        this.name = name;
        this.offset = [];
        this.offset.length = 8;
        this.uvs = [];
        this.uvs.length = 8;
    };
    spine.RegionAttachment.prototype = {
        type: spine.AttachmentType.region,
        x: 0, y: 0,
        rotation: 0,
        scaleX: 1, scaleY: 1,
        width: 0, height: 0,
        r: 1, g: 1, b: 1, a: 1,
        path: null,
        rendererObject: null,
        regionOffsetX: 0, regionOffsetY: 0,
        regionWidth: 0, regionHeight: 0,
        regionOriginalWidth: 0, regionOriginalHeight: 0,
        setUVs: function (u, v, u2, v2, rotate) {
            var uvs = this.uvs;
            if (rotate) {
                uvs[2/*X2*/] = u;
                uvs[3/*Y2*/] = v2;
                uvs[4/*X3*/] = u;
                uvs[5/*Y3*/] = v;
                uvs[6/*X4*/] = u2;
                uvs[7/*Y4*/] = v;
                uvs[0/*X1*/] = u2;
                uvs[1/*Y1*/] = v2;
            } else {
                uvs[0/*X1*/] = u;
                uvs[1/*Y1*/] = v2;
                uvs[2/*X2*/] = u;
                uvs[3/*Y2*/] = v;
                uvs[4/*X3*/] = u2;
                uvs[5/*Y3*/] = v;
                uvs[6/*X4*/] = u2;
                uvs[7/*Y4*/] = v2;
            }
        },
        updateOffset: function () {
            var regionScaleX = this.width / this.regionOriginalWidth * this.scaleX;
            var regionScaleY = this.height / this.regionOriginalHeight * this.scaleY;
            var localX = -this.width / 2 * this.scaleX + this.regionOffsetX * regionScaleX;
            var localY = -this.height / 2 * this.scaleY + this.regionOffsetY * regionScaleY;
            var localX2 = localX + this.regionWidth * regionScaleX;
            var localY2 = localY + this.regionHeight * regionScaleY;
            var radians = this.rotation * spine.degRad;
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);
            var localXCos = localX * cos + this.x;
            var localXSin = localX * sin;
            var localYCos = localY * cos + this.y;
            var localYSin = localY * sin;
            var localX2Cos = localX2 * cos + this.x;
            var localX2Sin = localX2 * sin;
            var localY2Cos = localY2 * cos + this.y;
            var localY2Sin = localY2 * sin;
            var offset = this.offset;
            offset[0/*X1*/] = localXCos - localYSin;
            offset[1/*Y1*/] = localYCos + localXSin;
            offset[2/*X2*/] = localXCos - localY2Sin;
            offset[3/*Y2*/] = localY2Cos + localXSin;
            offset[4/*X3*/] = localX2Cos - localY2Sin;
            offset[5/*Y3*/] = localY2Cos + localX2Sin;
            offset[6/*X4*/] = localX2Cos - localYSin;
            offset[7/*Y4*/] = localYCos + localX2Sin;
        },
        computeVertices: function (x, y, bone, vertices) {
            x += bone.worldX;
            y += bone.worldY;
            var m00 = bone.m00, m01 = bone.m01, m10 = bone.m10, m11 = bone.m11;
            var offset = this.offset;
            vertices[0/*X1*/] = offset[0/*X1*/] * m00 + offset[1/*Y1*/] * m01 + x;
            vertices[1/*Y1*/] = offset[0/*X1*/] * m10 + offset[1/*Y1*/] * m11 + y;
            vertices[2/*X2*/] = offset[2/*X2*/] * m00 + offset[3/*Y2*/] * m01 + x;
            vertices[3/*Y2*/] = offset[2/*X2*/] * m10 + offset[3/*Y2*/] * m11 + y;
            vertices[4/*X3*/] = offset[4/*X3*/] * m00 + offset[5/*X3*/] * m01 + x;
            vertices[5/*X3*/] = offset[4/*X3*/] * m10 + offset[5/*X3*/] * m11 + y;
            vertices[6/*X4*/] = offset[6/*X4*/] * m00 + offset[7/*Y4*/] * m01 + x;
            vertices[7/*Y4*/] = offset[6/*X4*/] * m10 + offset[7/*Y4*/] * m11 + y;
        }
    };
    spine.MeshAttachment = function (name) {
        this.name = name;
    };
    spine.MeshAttachment.prototype = {
        type: spine.AttachmentType.mesh,
        vertices: null,
        uvs: null,
        regionUVs: null,
        triangles: null,
        hullLength: 0,
        r: 1, g: 1, b: 1, a: 1,
        path: null,
        rendererObject: null,
        regionU: 0, regionV: 0, regionU2: 0, regionV2: 0, regionRotate: false,
        regionOffsetX: 0, regionOffsetY: 0,
        regionWidth: 0, regionHeight: 0,
        regionOriginalWidth: 0, regionOriginalHeight: 0,
        edges: null,
        width: 0, height: 0,
        updateUVs: function () {
            var width = this.regionU2 - this.regionU, height = this.regionV2 - this.regionV;
            var n = this.regionUVs.length;
            if (!this.uvs || this.uvs.length != n) {
                this.uvs = new spine.Float32Array(n);
            }
            if (this.regionRotate) {
                for (var i = 0; i < n; i += 2) {
                    this.uvs[i] = this.regionU + this.regionUVs[i + 1] * width;
                    this.uvs[i + 1] = this.regionV + height - this.regionUVs[i] * height;
                }
            } else {
                for (var i = 0; i < n; i += 2) {
                    this.uvs[i] = this.regionU + this.regionUVs[i] * width;
                    this.uvs[i + 1] = this.regionV + this.regionUVs[i + 1] * height;
                }
            }
        },
        computeWorldVertices: function (x, y, slot, worldVertices) {
            var bone = slot.bone;
            x += bone.worldX;
            y += bone.worldY;
            var m00 = bone.m00, m01 = bone.m01, m10 = bone.m10, m11 = bone.m11;
            var vertices = this.vertices;
            var verticesCount = vertices.length;
            if (slot.attachmentVertices.length == verticesCount) vertices = slot.attachmentVertices;
            for (var i = 0; i < verticesCount; i += 2) {
                var vx = vertices[i];
                var vy = vertices[i + 1];
                worldVertices[i] = vx * m00 + vy * m01 + x;
                worldVertices[i + 1] = vx * m10 + vy * m11 + y;
            }
        }
    };
    spine.SkinnedMeshAttachment = function (name) {
        this.name = name;
    };
    spine.SkinnedMeshAttachment.prototype = {
        type: spine.AttachmentType.skinnedmesh,
        bones: null,
        weights: null,
        uvs: null,
        regionUVs: null,
        triangles: null,
        hullLength: 0,
        r: 1, g: 1, b: 1, a: 1,
        path: null,
        rendererObject: null,
        regionU: 0, regionV: 0, regionU2: 0, regionV2: 0, regionRotate: false,
        regionOffsetX: 0, regionOffsetY: 0,
        regionWidth: 0, regionHeight: 0,
        regionOriginalWidth: 0, regionOriginalHeight: 0,
        edges: null,
        width: 0, height: 0,
        updateUVs: function (u, v, u2, v2, rotate) {
            var width = this.regionU2 - this.regionU, height = this.regionV2 - this.regionV;
            var n = this.regionUVs.length;
            if (!this.uvs || this.uvs.length != n) {
                this.uvs = new spine.Float32Array(n);
            }
            if (this.regionRotate) {
                for (var i = 0; i < n; i += 2) {
                    this.uvs[i] = this.regionU + this.regionUVs[i + 1] * width;
                    this.uvs[i + 1] = this.regionV + height - this.regionUVs[i] * height;
                }
            } else {
                for (var i = 0; i < n; i += 2) {
                    this.uvs[i] = this.regionU + this.regionUVs[i] * width;
                    this.uvs[i + 1] = this.regionV + this.regionUVs[i + 1] * height;
                }
            }
        },
        computeWorldVertices: function (x, y, slot, worldVertices) {
            var skeletonBones = slot.bone.skeleton.bones;
            var weights = this.weights;
            var bones = this.bones;

            var w = 0, v = 0, b = 0, f = 0, n = bones.length, nn;
            var wx, wy, bone, vx, vy, weight;
            if (!slot.attachmentVertices.length) {
                for (; v < n; w += 2) {
                    wx = 0;
                    wy = 0;
                    nn = bones[v++] + v;
                    for (; v < nn; v++, b += 3) {
                        bone = skeletonBones[bones[v]];
                        vx = weights[b];
                        vy = weights[b + 1];
                        weight = weights[b + 2];
                        wx += (vx * bone.m00 + vy * bone.m01 + bone.worldX) * weight;
                        wy += (vx * bone.m10 + vy * bone.m11 + bone.worldY) * weight;
                    }
                    worldVertices[w] = wx + x;
                    worldVertices[w + 1] = wy + y;
                }
            } else {
                var ffd = slot.attachmentVertices;
                for (; v < n; w += 2) {
                    wx = 0;
                    wy = 0;
                    nn = bones[v++] + v;
                    for (; v < nn; v++, b += 3, f += 2) {
                        bone = skeletonBones[bones[v]];
                        vx = weights[b] + ffd[f];
                        vy = weights[b + 1] + ffd[f + 1];
                        weight = weights[b + 2];
                        wx += (vx * bone.m00 + vy * bone.m01 + bone.worldX) * weight;
                        wy += (vx * bone.m10 + vy * bone.m11 + bone.worldY) * weight;
                    }
                    worldVertices[w] = wx + x;
                    worldVertices[w + 1] = wy + y;
                }
            }
        }
    };
    spine.BoundingBoxAttachment = function (name) {
        this.name = name;
        this.vertices = [];
    };
    spine.BoundingBoxAttachment.prototype = {
        type: spine.AttachmentType.boundingbox,
        computeWorldVertices: function (x, y, bone, worldVertices) {
            x += bone.worldX;
            y += bone.worldY;
            var m00 = bone.m00, m01 = bone.m01, m10 = bone.m10, m11 = bone.m11;
            var vertices = this.vertices;
            for (var i = 0, n = vertices.length; i < n; i += 2) {
                var px = vertices[i];
                var py = vertices[i + 1];
                worldVertices[i] = px * m00 + py * m01 + x;
                worldVertices[i + 1] = px * m10 + py * m11 + y;
            }
        }
    };
    spine.AnimationStateData = function (skeletonData) {
        this.skeletonData = skeletonData;
        this.animationToMixTime = {};
    };
    spine.AnimationStateData.prototype = {
        defaultMix: 0,
        setMixByName: function (fromName, toName, duration) {
            var from = this.skeletonData.findAnimation(fromName);
            if (!from) throw "Animation not found: " + fromName;
            var to = this.skeletonData.findAnimation(toName);
            if (!to) throw "Animation not found: " + toName;
            this.setMix(from, to, duration);
        },
        setMix: function (from, to, duration) {
            this.animationToMixTime[from.name + ":" + to.name] = duration;
        },
        getMix: function (from, to) {
            var key = from.name + ":" + to.name;
            return this.animationToMixTime.hasOwnProperty(key) ? this.animationToMixTime[key] : this.defaultMix;
        }
    };
    spine.TrackEntry = function () {};
    spine.TrackEntry.prototype = {
        next: null, previous: null,
        animation: null,
        loop: false,
        delay: 0, time: 0, lastTime: -1, endTime: 0,
        timeScale: 1,
        mixTime: 0, mixDuration: 0, mix: 1,
        onStart: null, onEnd: null, onComplete: null, onEvent: null
    };
    spine.AnimationState = function (stateData) {
        this.data = stateData;
        this.tracks = [];
        this.events = [];
    };
    spine.AnimationState.prototype = {
        onStart: null,
        onEnd: null,
        onComplete: null,
        onEvent: null,
        timeScale: 1,
        update: function (delta) {
            delta *= this.timeScale;
            for (var i = 0; i < this.tracks.length; i++) {
                var current = this.tracks[i];
                if (!current) continue;

                current.time += delta * current.timeScale;
                if (current.previous) {
                    var previousDelta = delta * current.previous.timeScale;
                    current.previous.time += previousDelta;
                    current.mixTime += previousDelta;
                }

                var next = current.next;
                if (next) {
                    next.time = current.lastTime - next.delay;
                    if (next.time >= 0) this.setCurrent(i, next);
                } else {
                    // End non-looping animation when it reaches its end time and there is no next entry.
                    if (!current.loop && current.lastTime >= current.endTime) this.clearTrack(i);
                }
            }
        },
        apply: function (skeleton) {
            skeleton.resetDrawOrder();
            for (var i = 0; i < this.tracks.length; i++) {
                var current = this.tracks[i];
                if (!current) continue;

                this.events.length = 0;

                var time = current.time;
                var lastTime = current.lastTime;
                var endTime = current.endTime;
                var loop = current.loop;
                if (!loop && time > endTime) time = endTime;

                var previous = current.previous;
                if (!previous) {
                    if (current.mix == 1)
                        current.animation.apply(skeleton, current.lastTime, time, loop, this.events);
                    else
                        current.animation.mix(skeleton, current.lastTime, time, loop, this.events, current.mix);
                } else {
                    var previousTime = previous.time;
                    if (!previous.loop && previousTime > previous.endTime) previousTime = previous.endTime;
                    previous.animation.apply(skeleton, previousTime, previousTime, previous.loop, null);

                    var alpha = current.mixTime / current.mixDuration * current.mix;
                    if (alpha >= 1) {
                        alpha = 1;
                        current.previous = null;
                    }
                    current.animation.mix(skeleton, current.lastTime, time, loop, this.events, alpha);
                }
                for (var ii = 0, nn = this.events.length; ii < nn; ii++) {
                    var event = this.events[ii];
                    if (current.onEvent) current.onEvent(i, event);
                    if (this.onEvent) this.onEvent(i, event);
                }
                // Check if completed the animation or a loop iteration.
                if (loop ? (lastTime % endTime > time % endTime) : (lastTime < endTime && time >= endTime)) {
                    var count = Math.floor(time / endTime);
                    if (current.onComplete) current.onComplete(i, count);
                    if (this.onComplete) this.onComplete(i, count);
                }
                current.lastTime = current.time;
            }
        },
        clearTracks: function () {
            for (var i = 0, n = this.tracks.length; i < n; i++)
                this.clearTrack(i);
            this.tracks.length = 0;
        },
        clearTrack: function (trackIndex) {
            if (trackIndex >= this.tracks.length) return;
            var current = this.tracks[trackIndex];
            if (!current) return;

            if (current.onEnd) current.onEnd(trackIndex);
            if (this.onEnd) this.onEnd(trackIndex);

            this.tracks[trackIndex] = null;
        },
        _expandToIndex: function (index) {
            if (index < this.tracks.length) return this.tracks[index];
            while (index >= this.tracks.length)
                this.tracks.push(null);
            return null;
        },
        setCurrent: function (index, entry) {
            var current = this._expandToIndex(index);
            if (current) {
                var previous = current.previous;
                current.previous = null;

                if (current.onEnd) current.onEnd(index);
                if (this.onEnd) this.onEnd(index);

                entry.mixDuration = this.data.getMix(current.animation, entry.animation);
                if (entry.mixDuration > 0) {
                    entry.mixTime = 0;
                    // If a mix is in progress, mix from the closest animation.
                    if (previous && current.mixTime / current.mixDuration < 0.5)
                        entry.previous = previous;
                    else
                        entry.previous = current;
                }
            }
            this.tracks[index] = entry;

            if (entry.onStart) entry.onStart(index);
            if (this.onStart) this.onStart(index);
        },
        setAnimationByName: function (trackIndex, animationName, loop) {
            var animation = this.data.skeletonData.findAnimation(animationName);
            if (!animation) throw "Animation not found: " + animationName;
            return this.setAnimation(trackIndex, animation, loop);
        },
        setAnimation: function (trackIndex, animation, loop) {
            var entry = new spine.TrackEntry();
            entry.animation = animation;
            entry.loop = loop;
            entry.endTime = animation.duration;
            this.setCurrent(trackIndex, entry);
            return entry;
        },
        addAnimationByName: function (trackIndex, animationName, loop, delay) {
            var animation = this.data.skeletonData.findAnimation(animationName);
            if (!animation) throw "Animation not found: " + animationName;
            return this.addAnimation(trackIndex, animation, loop, delay);
        },
        addAnimation: function (trackIndex, animation, loop, delay) {
            var entry = new spine.TrackEntry();
            entry.animation = animation;
            entry.loop = loop;
            entry.endTime = animation.duration;

            var last = this._expandToIndex(trackIndex);
            if (last) {
                while (last.next)
                    last = last.next;
                last.next = entry;
            } else
                this.tracks[trackIndex] = entry;

            if (delay <= 0) {
                if (last)
                    delay += last.endTime - this.data.getMix(last.animation, animation);
                else
                    delay = 0;
            }
            entry.delay = delay;

            return entry;
        },
        getCurrent: function (trackIndex) {
            if (trackIndex >= this.tracks.length) return null;
            return this.tracks[trackIndex];
        }
    };
    spine.SkeletonJson = function (attachmentLoader) {
        this.attachmentLoader = attachmentLoader;
    };
    spine.SkeletonJson.prototype = {
        scale: 1,
        readSkeletonData: function (root, name) {
            var skeletonData = new spine.SkeletonData();
            skeletonData.name = name;

            // Skeleton.
            var skeletonMap = root["skeleton"];
            if (skeletonMap) {
                skeletonData.hash = skeletonMap["hash"];
                skeletonData.version = skeletonMap["spine"];
                skeletonData.width = skeletonMap["width"] || 0;
                skeletonData.height = skeletonMap["height"] || 0;
            }

            // Bones.
            var bones = root["bones"];
            for (var i = 0, n = bones.length; i < n; i++) {
                var boneMap = bones[i];
                var parent = null;
                if (boneMap["parent"]) {
                    parent = skeletonData.findBone(boneMap["parent"]);
                    if (!parent) throw "Parent bone not found: " + boneMap["parent"];
                }
                var boneData = new spine.BoneData(boneMap["name"], parent);
                boneData.length = (boneMap["length"] || 0) * this.scale;
                boneData.x = (boneMap["x"] || 0) * this.scale;
                boneData.y = (boneMap["y"] || 0) * this.scale;
                boneData.rotation = (boneMap["rotation"] || 0);
                boneData.scaleX = boneMap.hasOwnProperty("scaleX") ? boneMap["scaleX"] : 1;
                boneData.scaleY = boneMap.hasOwnProperty("scaleY") ? boneMap["scaleY"] : 1;
                boneData.inheritScale = boneMap.hasOwnProperty("inheritScale") ? boneMap["inheritScale"] : true;
                boneData.inheritRotation = boneMap.hasOwnProperty("inheritRotation") ? boneMap["inheritRotation"] : true;
                skeletonData.bones.push(boneData);
            }

            // IK constraints.
            var ik = root["ik"];
            if (ik) {
                for (var i = 0, n = ik.length; i < n; i++) {
                    var ikMap = ik[i];
                    var ikConstraintData = new spine.IkConstraintData(ikMap["name"]);

                    var bones = ikMap["bones"];
                    for (var ii = 0, nn = bones.length; ii < nn; ii++) {
                        var bone = skeletonData.findBone(bones[ii]);
                        if (!bone) throw "IK bone not found: " + bones[ii];
                        ikConstraintData.bones.push(bone);
                    }

                    ikConstraintData.target = skeletonData.findBone(ikMap["target"]);
                    if (!ikConstraintData.target) throw "Target bone not found: " + ikMap["target"];

                    ikConstraintData.bendDirection = (!ikMap.hasOwnProperty("bendPositive") || ikMap["bendPositive"]) ? 1 : -1;
                    ikConstraintData.mix = ikMap.hasOwnProperty("mix") ? ikMap["mix"] : 1;

                    skeletonData.ikConstraints.push(ikConstraintData);
                }
            }

            // Slots.
            var slots = root["slots"];
            for (var i = 0, n = slots.length; i < n; i++) {
                var slotMap = slots[i];
                var boneData = skeletonData.findBone(slotMap["bone"]);
                if (!boneData) throw "Slot bone not found: " + slotMap["bone"];
                var slotData = new spine.SlotData(slotMap["name"], boneData);

                var color = slotMap["color"];
                if (color) {
                    slotData.r = this.toColor(color, 0);
                    slotData.g = this.toColor(color, 1);
                    slotData.b = this.toColor(color, 2);
                    slotData.a = this.toColor(color, 3);
                }

                slotData.attachmentName = slotMap["attachment"];
                slotData.additiveBlending = slotMap["additive"] && slotMap["additive"] == "true";

                skeletonData.slots.push(slotData);
            }

            // Skins.
            var skins = root["skins"];
            for (var skinName in skins) {
                if (!skins.hasOwnProperty(skinName)) continue;
                var skinMap = skins[skinName];
                var skin = new spine.Skin(skinName);
                for (var slotName in skinMap) {
                    if (!skinMap.hasOwnProperty(slotName)) continue;
                    var slotIndex = skeletonData.findSlotIndex(slotName);
                    var slotEntry = skinMap[slotName];
                    for (var attachmentName in slotEntry) {
                        if (!slotEntry.hasOwnProperty(attachmentName)) continue;
                        var attachment = this.readAttachment(skin, attachmentName, slotEntry[attachmentName]);
                        if (attachment) skin.addAttachment(slotIndex, attachmentName, attachment);
                    }
                }
                skeletonData.skins.push(skin);
                if (skin.name == "default") skeletonData.defaultSkin = skin;
            }

            // Events.
            var events = root["events"];
            for (var eventName in events) {
                if (!events.hasOwnProperty(eventName)) continue;
                var eventMap = events[eventName];
                var eventData = new spine.EventData(eventName);
                eventData.intValue = eventMap["int"] || 0;
                eventData.floatValue = eventMap["float"] || 0;
                eventData.stringValue = eventMap["string"] || null;
                skeletonData.events.push(eventData);
            }

            // Animations.
            var animations = root["animations"];
            for (var animationName in animations) {
                if (!animations.hasOwnProperty(animationName)) continue;
                this.readAnimation(animationName, animations[animationName], skeletonData);
            }

            return skeletonData;
        },
        readAttachment: function (skin, name, map) {
            name = map["name"] || name;

            var type = spine.AttachmentType[map["type"] || "region"];
            var path = map["path"] || name;

            var scale = this.scale;
            if (type == spine.AttachmentType.region) {
                var region = this.attachmentLoader.newRegionAttachment(skin, name, path);
                if (!region) return null;
                region.path = path;
                region.x = (map["x"] || 0) * scale;
                region.y = (map["y"] || 0) * scale;
                region.scaleX = map.hasOwnProperty("scaleX") ? map["scaleX"] : 1;
                region.scaleY = map.hasOwnProperty("scaleY") ? map["scaleY"] : 1;
                region.rotation = map["rotation"] || 0;
                region.width = (map["width"] || 0) * scale;
                region.height = (map["height"] || 0) * scale;

                var color = map["color"];
                if (color) {
                    region.r = this.toColor(color, 0);
                    region.g = this.toColor(color, 1);
                    region.b = this.toColor(color, 2);
                    region.a = this.toColor(color, 3);
                }

                region.updateOffset();
                return region;
            } else if (type == spine.AttachmentType.mesh) {
                var mesh = this.attachmentLoader.newMeshAttachment(skin, name, path);
                if (!mesh) return null;
                mesh.path = path;
                mesh.vertices = this.getFloatArray(map, "vertices", scale);
                mesh.triangles = this.getIntArray(map, "triangles");
                mesh.regionUVs = this.getFloatArray(map, "uvs", 1);
                mesh.updateUVs();

                color = map["color"];
                if (color) {
                    mesh.r = this.toColor(color, 0);
                    mesh.g = this.toColor(color, 1);
                    mesh.b = this.toColor(color, 2);
                    mesh.a = this.toColor(color, 3);
                }

                mesh.hullLength = (map["hull"] || 0) * 2;
                if (map["edges"]) mesh.edges = this.getIntArray(map, "edges");
                mesh.width = (map["width"] || 0) * scale;
                mesh.height = (map["height"] || 0) * scale;
                return mesh;
            } else if (type == spine.AttachmentType.skinnedmesh) {
                var mesh = this.attachmentLoader.newSkinnedMeshAttachment(skin, name, path);
                if (!mesh) return null;
                mesh.path = path;

                var uvs = this.getFloatArray(map, "uvs", 1);
                var vertices = this.getFloatArray(map, "vertices", 1);
                var weights = [];
                var bones = [];
                for (var i = 0, n = vertices.length; i < n; ) {
                    var boneCount = vertices[i++] | 0;
                    bones[bones.length] = boneCount;
                    for (var nn = i + boneCount * 4; i < nn; ) {
                        bones[bones.length] = vertices[i];
                        weights[weights.length] = vertices[i + 1] * scale;
                        weights[weights.length] = vertices[i + 2] * scale;
                        weights[weights.length] = vertices[i + 3];
                        i += 4;
                    }
                }
                mesh.bones = bones;
                mesh.weights = weights;
                mesh.triangles = this.getIntArray(map, "triangles");
                mesh.regionUVs = uvs;
                mesh.updateUVs();

                color = map["color"];
                if (color) {
                    mesh.r = this.toColor(color, 0);
                    mesh.g = this.toColor(color, 1);
                    mesh.b = this.toColor(color, 2);
                    mesh.a = this.toColor(color, 3);
                }

                mesh.hullLength = (map["hull"] || 0) * 2;
                if (map["edges"]) mesh.edges = this.getIntArray(map, "edges");
                mesh.width = (map["width"] || 0) * scale;
                mesh.height = (map["height"] || 0) * scale;
                return mesh;
            } else if (type == spine.AttachmentType.boundingbox) {
                var attachment = this.attachmentLoader.newBoundingBoxAttachment(skin, name);
                var vertices = map["vertices"];
                for (var i = 0, n = vertices.length; i < n; i++)
                    attachment.vertices.push(vertices[i] * scale);
                return attachment;
            }
            throw "Unknown attachment type: " + type;
        },
        readAnimation: function (name, map, skeletonData) {
            var timelines = [];
            var duration = 0;

            var slots = map["slots"];
            for (var slotName in slots) {
                if (!slots.hasOwnProperty(slotName)) continue;
                var slotMap = slots[slotName];
                var slotIndex = skeletonData.findSlotIndex(slotName);

                for (var timelineName in slotMap) {
                    if (!slotMap.hasOwnProperty(timelineName)) continue;
                    var values = slotMap[timelineName];
                    if (timelineName == "color") {
                        var timeline = new spine.ColorTimeline(values.length);
                        timeline.slotIndex = slotIndex;

                        var frameIndex = 0;
                        for (var i = 0, n = values.length; i < n; i++) {
                            var valueMap = values[i];
                            var color = valueMap["color"];
                            var r = this.toColor(color, 0);
                            var g = this.toColor(color, 1);
                            var b = this.toColor(color, 2);
                            var a = this.toColor(color, 3);
                            timeline.setFrame(frameIndex, valueMap["time"], r, g, b, a);
                            this.readCurve(timeline, frameIndex, valueMap);
                            frameIndex++;
                        }
                        timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 5 - 5]);

                    } else if (timelineName == "attachment") {
                        var timeline = new spine.AttachmentTimeline(values.length);
                        timeline.slotIndex = slotIndex;

                        var frameIndex = 0;
                        for (var i = 0, n = values.length; i < n; i++) {
                            var valueMap = values[i];
                            timeline.setFrame(frameIndex++, valueMap["time"], valueMap["name"]);
                        }
                        timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);

                    } else
                        throw "Invalid timeline type for a slot: " + timelineName + " (" + slotName + ")";
                }
            }

            var bones = map["bones"];
            for (var boneName in bones) {
                if (!bones.hasOwnProperty(boneName)) continue;
                var boneIndex = skeletonData.findBoneIndex(boneName);
                if (boneIndex == -1) throw "Bone not found: " + boneName;
                var boneMap = bones[boneName];

                for (var timelineName in boneMap) {
                    if (!boneMap.hasOwnProperty(timelineName)) continue;
                    var values = boneMap[timelineName];
                    if (timelineName == "rotate") {
                        var timeline = new spine.RotateTimeline(values.length);
                        timeline.boneIndex = boneIndex;

                        var frameIndex = 0;
                        for (var i = 0, n = values.length; i < n; i++) {
                            var valueMap = values[i];
                            timeline.setFrame(frameIndex, valueMap["time"], valueMap["angle"]);
                            this.readCurve(timeline, frameIndex, valueMap);
                            frameIndex++;
                        }
                        timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 2 - 2]);

                    } else if (timelineName == "translate" || timelineName == "scale") {
                        var timeline;
                        var timelineScale = 1;
                        if (timelineName == "scale")
                            timeline = new spine.ScaleTimeline(values.length);
                        else {
                            timeline = new spine.TranslateTimeline(values.length);
                            timelineScale = this.scale;
                        }
                        timeline.boneIndex = boneIndex;

                        var frameIndex = 0;
                        for (var i = 0, n = values.length; i < n; i++) {
                            var valueMap = values[i];
                            var x = (valueMap["x"] || 0) * timelineScale;
                            var y = (valueMap["y"] || 0) * timelineScale;
                            timeline.setFrame(frameIndex, valueMap["time"], x, y);
                            this.readCurve(timeline, frameIndex, valueMap);
                            frameIndex++;
                        }
                        timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 3 - 3]);

                    } else if (timelineName == "flipX" || timelineName == "flipY") {
                        var x = timelineName == "flipX";
                        var timeline = x ? new spine.FlipXTimeline(values.length) : new spine.FlipYTimeline(values.length);
                        timeline.boneIndex = boneIndex;

                        var field = x ? "x" : "y";
                        var frameIndex = 0;
                        for (var i = 0, n = values.length; i < n; i++) {
                            var valueMap = values[i];
                            timeline.setFrame(frameIndex, valueMap["time"], valueMap[field] || false);
                            frameIndex++;
                        }
                        timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 2 - 2]);
                    } else
                        throw "Invalid timeline type for a bone: " + timelineName + " (" + boneName + ")";
                }
            }

            var ikMap = map["ik"];
            for (var ikConstraintName in ikMap) {
                if (!ikMap.hasOwnProperty(ikConstraintName)) continue;
                var ikConstraint = skeletonData.findIkConstraint(ikConstraintName);
                var values = ikMap[ikConstraintName];
                var timeline = new spine.IkConstraintTimeline(values.length);
                timeline.ikConstraintIndex = skeletonData.ikConstraints.indexOf(ikConstraint);
                var frameIndex = 0;
                for (var i = 0, n = values.length; i < n; i++) {
                    var valueMap = values[i];
                    var mix = valueMap.hasOwnProperty("mix") ? valueMap["mix"] : 1;
                    var bendDirection = (!valueMap.hasOwnProperty("bendPositive") || valueMap["bendPositive"]) ? 1 : -1;
                    timeline.setFrame(frameIndex, valueMap["time"], mix, bendDirection);
                    this.readCurve(timeline, frameIndex, valueMap);
                    frameIndex++;
                }
                timelines.push(timeline);
                duration = Math.max(duration, timeline.frames[timeline.frameCount * 3 - 3]);
            }

            var ffd = map["ffd"];
            for (var skinName in ffd) {
                var skin = skeletonData.findSkin(skinName);
                var slotMap = ffd[skinName];
                for (slotName in slotMap) {
                    var slotIndex = skeletonData.findSlotIndex(slotName);
                    var meshMap = slotMap[slotName];
                    for (var meshName in meshMap) {
                        var values = meshMap[meshName];
                        var timeline = new spine.FfdTimeline(values.length);
                        var attachment = skin.getAttachment(slotIndex, meshName);
                        if (!attachment) throw "FFD attachment not found: " + meshName;
                        timeline.slotIndex = slotIndex;
                        timeline.attachment = attachment;

                        var isMesh = attachment.type == spine.AttachmentType.mesh;
                        var vertexCount;
                        if (isMesh)
                            vertexCount = attachment.vertices.length;
                        else
                            vertexCount = attachment.weights.length / 3 * 2;

                        var frameIndex = 0;
                        for (var i = 0, n = values.length; i < n; i++) {
                            var valueMap = values[i];
                            var vertices;
                            if (!valueMap["vertices"]) {
                                if (isMesh)
                                    vertices = attachment.vertices;
                                else {
                                    vertices = [];
                                    vertices.length = vertexCount;
                                }
                            } else {
                                var verticesValue = valueMap["vertices"];
                                var vertices = [];
                                vertices.length = vertexCount;
                                var start = valueMap["offset"] || 0;
                                var nn = verticesValue.length;
                                if (this.scale == 1) {
                                    for (var ii = 0; ii < nn; ii++)
                                        vertices[ii + start] = verticesValue[ii];
                                } else {
                                    for (var ii = 0; ii < nn; ii++)
                                        vertices[ii + start] = verticesValue[ii] * this.scale;
                                }
                                if (isMesh) {
                                    var meshVertices = attachment.vertices;
                                    for (var ii = 0, nn = vertices.length; ii < nn; ii++)
                                        vertices[ii] += meshVertices[ii];
                                }
                            }

                            timeline.setFrame(frameIndex, valueMap["time"], vertices);
                            this.readCurve(timeline, frameIndex, valueMap);
                            frameIndex++;
                        }
                        timelines[timelines.length] = timeline;
                        duration = Math.max(duration, timeline.frames[timeline.frameCount - 1]);
                    }
                }
            }

            var drawOrderValues = map["drawOrder"];
            if (!drawOrderValues) drawOrderValues = map["draworder"];
            if (drawOrderValues) {
                var timeline = new spine.DrawOrderTimeline(drawOrderValues.length);
                var slotCount = skeletonData.slots.length;
                var frameIndex = 0;
                for (var i = 0, n = drawOrderValues.length; i < n; i++) {
                    var drawOrderMap = drawOrderValues[i];
                    var drawOrder = null;
                    if (drawOrderMap["offsets"]) {
                        drawOrder = [];
                        drawOrder.length = slotCount;
                        for (var ii = slotCount - 1; ii >= 0; ii--)
                            drawOrder[ii] = -1;
                        var offsets = drawOrderMap["offsets"];
                        var unchanged = [];
                        unchanged.length = slotCount - offsets.length;
                        var originalIndex = 0, unchangedIndex = 0;
                        for (var ii = 0, nn = offsets.length; ii < nn; ii++) {
                            var offsetMap = offsets[ii];
                            var slotIndex = skeletonData.findSlotIndex(offsetMap["slot"]);
                            if (slotIndex == -1) throw "Slot not found: " + offsetMap["slot"];
                            // Collect unchanged items.
                            while (originalIndex != slotIndex)
                                unchanged[unchangedIndex++] = originalIndex++;
                            // Set changed items.
                            drawOrder[originalIndex + offsetMap["offset"]] = originalIndex++;
                        }
                        // Collect remaining unchanged items.
                        while (originalIndex < slotCount)
                            unchanged[unchangedIndex++] = originalIndex++;
                        // Fill in unchanged items.
                        for (var ii = slotCount - 1; ii >= 0; ii--)
                            if (drawOrder[ii] == -1) drawOrder[ii] = unchanged[--unchangedIndex];
                    }
                    timeline.setFrame(frameIndex++, drawOrderMap["time"], drawOrder);
                }
                timelines.push(timeline);
                duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
            }

            var events = map["events"];
            if (events) {
                var timeline = new spine.EventTimeline(events.length);
                var frameIndex = 0;
                for (var i = 0, n = events.length; i < n; i++) {
                    var eventMap = events[i];
                    var eventData = skeletonData.findEvent(eventMap["name"]);
                    if (!eventData) throw "Event not found: " + eventMap["name"];
                    var event = new spine.Event(eventData);
                    event.intValue = eventMap.hasOwnProperty("int") ? eventMap["int"] : eventData.intValue;
                    event.floatValue = eventMap.hasOwnProperty("float") ? eventMap["float"] : eventData.floatValue;
                    event.stringValue = eventMap.hasOwnProperty("string") ? eventMap["string"] : eventData.stringValue;
                    timeline.setFrame(frameIndex++, eventMap["time"], event);
                }
                timelines.push(timeline);
                duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
            }

            skeletonData.animations.push(new spine.Animation(name, timelines, duration));
        },
        readCurve: function (timeline, frameIndex, valueMap) {
            var curve = valueMap["curve"];
            if (!curve)
                timeline.curves.setLinear(frameIndex);
            else if (curve == "stepped")
                timeline.curves.setStepped(frameIndex);
            else if (curve instanceof Array)
                timeline.curves.setCurve(frameIndex, curve[0], curve[1], curve[2], curve[3]);
        },
        toColor: function (hexString, colorIndex) {
            if (hexString.length != 8) throw "Color hexidecimal length must be 8, recieved: " + hexString;
            return parseInt(hexString.substring(colorIndex * 2, (colorIndex * 2) + 2), 16) / 255;
        },
        getFloatArray: function (map, name, scale) {
            var list = map[name];
            var values = new spine.Float32Array(list.length);
            var i = 0, n = list.length;
            if (scale == 1) {
                for (; i < n; i++)
                    values[i] = list[i];
            } else {
                for (; i < n; i++)
                    values[i] = list[i] * scale;
            }
            return values;
        },
        getIntArray: function (map, name) {
            var list = map[name];
            var values = new spine.Uint16Array(list.length);
            for (var i = 0, n = list.length; i < n; i++)
                values[i] = list[i] | 0;
            return values;
        }
    };
    spine.Atlas = function (atlasText, textureLoader) {
        this.textureLoader = textureLoader;
        this.pages = [];
        this.regions = [];

        var reader = new spine.AtlasReader(atlasText);
        var tuple = [];
        tuple.length = 4;
        var page = null;
        while (true) {
            var line = reader.readLine();
            if (line === null) break;
            line = reader.trim(line);
            if (!line.length)
                page = null;
            else if (!page) {
                page = new spine.AtlasPage();
                page.name = line;

                if (reader.readTuple(tuple) == 2) { // size is only optional for an atlas packed with an old TexturePacker.
                    page.width = parseInt(tuple[0]);
                    page.height = parseInt(tuple[1]);
                    reader.readTuple(tuple);
                }
                page.format = spine.Atlas.Format[tuple[0]];

                reader.readTuple(tuple);
                page.minFilter = spine.Atlas.TextureFilter[tuple[0]];
                page.magFilter = spine.Atlas.TextureFilter[tuple[1]];

                var direction = reader.readValue();
                page.uWrap = spine.Atlas.TextureWrap.clampToEdge;
                page.vWrap = spine.Atlas.TextureWrap.clampToEdge;
                if (direction == "x")
                    page.uWrap = spine.Atlas.TextureWrap.repeat;
                else if (direction == "y")
                    page.vWrap = spine.Atlas.TextureWrap.repeat;
                else if (direction == "xy")
                    page.uWrap = page.vWrap = spine.Atlas.TextureWrap.repeat;

                textureLoader.load(page, line, this);

                this.pages.push(page);

            } else {
                var region = new spine.AtlasRegion();
                region.name = line;
                region.page = page;

                region.rotate = reader.readValue() == "true";

                reader.readTuple(tuple);
                var x = parseInt(tuple[0]);
                var y = parseInt(tuple[1]);

                reader.readTuple(tuple);
                var width = parseInt(tuple[0]);
                var height = parseInt(tuple[1]);

                region.u = x / page.width;
                region.v = y / page.height;
                if (region.rotate) {
                    region.u2 = (x + height) / page.width;
                    region.v2 = (y + width) / page.height;
                } else {
                    region.u2 = (x + width) / page.width;
                    region.v2 = (y + height) / page.height;
                }
                region.x = x;
                region.y = y;
                region.width = Math.abs(width);
                region.height = Math.abs(height);

                if (reader.readTuple(tuple) == 4) { // split is optional
                    region.splits = [parseInt(tuple[0]), parseInt(tuple[1]), parseInt(tuple[2]), parseInt(tuple[3])];

                    if (reader.readTuple(tuple) == 4) { // pad is optional, but only present with splits
                        region.pads = [parseInt(tuple[0]), parseInt(tuple[1]), parseInt(tuple[2]), parseInt(tuple[3])];

                        reader.readTuple(tuple);
                    }
                }

                region.originalWidth = parseInt(tuple[0]);
                region.originalHeight = parseInt(tuple[1]);

                reader.readTuple(tuple);
                region.offsetX = parseInt(tuple[0]);
                region.offsetY = parseInt(tuple[1]);

                region.index = parseInt(reader.readValue());

                this.regions.push(region);
            }
        }
    };
    spine.Atlas.prototype = {
        findRegion: function (name) {
            var regions = this.regions;
            for (var i = 0, n = regions.length; i < n; i++)
                if (regions[i].name == name) return regions[i];
            return null;
        },
        dispose: function () {
            var pages = this.pages;
            for (var i = 0, n = pages.length; i < n; i++)
                this.textureLoader.unload(pages[i].rendererObject);
        },
        updateUVs: function (page) {
            var regions = this.regions;
            for (var i = 0, n = regions.length; i < n; i++) {
                var region = regions[i];
                if (region.page != page) continue;
                region.u = region.x / page.width;
                region.v = region.y / page.height;
                if (region.rotate) {
                    region.u2 = (region.x + region.height) / page.width;
                    region.v2 = (region.y + region.width) / page.height;
                } else {
                    region.u2 = (region.x + region.width) / page.width;
                    region.v2 = (region.y + region.height) / page.height;
                }
            }
        }
    };
    spine.Atlas.Format = {
        alpha: 0,
        intensity: 1,
        luminanceAlpha: 2,
        rgb565: 3,
        rgba4444: 4,
        rgb888: 5,
        rgba8888: 6
    };
    spine.Atlas.TextureFilter = {
        nearest: 0,
        linear: 1,
        mipMap: 2,
        mipMapNearestNearest: 3,
        mipMapLinearNearest: 4,
        mipMapNearestLinear: 5,
        mipMapLinearLinear: 6
    };
    spine.Atlas.TextureWrap = {
        mirroredRepeat: 0,
        clampToEdge: 1,
        repeat: 2
    };
    spine.AtlasPage = function () {};
    spine.AtlasPage.prototype = {
        name: null,
        format: null,
        minFilter: null,
        magFilter: null,
        uWrap: null,
        vWrap: null,
        rendererObject: null,
        width: 0,
        height: 0
    };
    spine.AtlasRegion = function () {};
    spine.AtlasRegion.prototype = {
        page: null,
        name: null,
        x: 0, y: 0,
        width: 0, height: 0,
        u: 0, v: 0, u2: 0, v2: 0,
        offsetX: 0, offsetY: 0,
        originalWidth: 0, originalHeight: 0,
        index: 0,
        rotate: false,
        splits: null,
        pads: null
    };
    spine.AtlasReader = function (text) {
        this.lines = text.split(/\r\n|\r|\n/);
    };
    spine.AtlasReader.prototype = {
        index: 0,
        trim: function (value) {
            return value.replace(/^\s+|\s+$/g, "");
        },
        readLine: function () {
            if (this.index >= this.lines.length) return null;
            return this.lines[this.index++];
        },
        readValue: function () {
            var line = this.readLine();
            var colon = line.indexOf(":");
            if (colon == -1) throw "Invalid line: " + line;
            return this.trim(line.substring(colon + 1));
        },
        readTuple: function (tuple) {
            var line = this.readLine();
            var colon = line.indexOf(":");
            if (colon == -1) throw "Invalid line: " + line;
            var i = 0, lastMatch = colon + 1;
            for (; i < 3; i++) {
                var comma = line.indexOf(",", lastMatch);
                if (comma == -1) break;
                tuple[i] = this.trim(line.substr(lastMatch, comma - lastMatch));
                lastMatch = comma + 1;
            }
            tuple[i] = this.trim(line.substring(lastMatch));
            return i + 1;
        }
    };
    spine.AtlasAttachmentLoader = function (atlas) {
        this.atlas = atlas;
    };
    spine.AtlasAttachmentLoader.prototype = {
        newRegionAttachment: function (skin, name, path) {
            var region = this.atlas.findRegion(path);
            if (!region) throw "Region not found in atlas: " + path + " (region attachment: " + name + ")";
            var attachment = new spine.RegionAttachment(name);
            attachment.rendererObject = region;
            attachment.setUVs(region.u, region.v, region.u2, region.v2, region.rotate);
            attachment.regionOffsetX = region.offsetX;
            attachment.regionOffsetY = region.offsetY;
            attachment.regionWidth = region.width;
            attachment.regionHeight = region.height;
            attachment.regionOriginalWidth = region.originalWidth;
            attachment.regionOriginalHeight = region.originalHeight;
            return attachment;
        },
        newMeshAttachment: function (skin, name, path) {
            var region = this.atlas.findRegion(path);
            if (!region) throw "Region not found in atlas: " + path + " (mesh attachment: " + name + ")";
            var attachment = new spine.MeshAttachment(name);
            attachment.rendererObject = region;
            attachment.regionU = region.u;
            attachment.regionV = region.v;
            attachment.regionU2 = region.u2;
            attachment.regionV2 = region.v2;
            attachment.regionRotate = region.rotate;
            attachment.regionOffsetX = region.offsetX;
            attachment.regionOffsetY = region.offsetY;
            attachment.regionWidth = region.width;
            attachment.regionHeight = region.height;
            attachment.regionOriginalWidth = region.originalWidth;
            attachment.regionOriginalHeight = region.originalHeight;
            return attachment;
        },
        newSkinnedMeshAttachment: function (skin, name, path) {
            var region = this.atlas.findRegion(path);
            if (!region) throw "Region not found in atlas: " + path + " (skinned mesh attachment: " + name + ")";
            var attachment = new spine.SkinnedMeshAttachment(name);
            attachment.rendererObject = region;
            attachment.regionU = region.u;
            attachment.regionV = region.v;
            attachment.regionU2 = region.u2;
            attachment.regionV2 = region.v2;
            attachment.regionRotate = region.rotate;
            attachment.regionOffsetX = region.offsetX;
            attachment.regionOffsetY = region.offsetY;
            attachment.regionWidth = region.width;
            attachment.regionHeight = region.height;
            attachment.regionOriginalWidth = region.originalWidth;
            attachment.regionOriginalHeight = region.originalHeight;
            return attachment;
        },
        newBoundingBoxAttachment: function (skin, name) {
            return new spine.BoundingBoxAttachment(name);
        }
    };
    spine.SkeletonBounds = function () {
        this.polygonPool = [];
        this.polygons = [];
        this.boundingBoxes = [];
    };
    spine.SkeletonBounds.prototype = {
        minX: 0, minY: 0, maxX: 0, maxY: 0,
        update: function (skeleton, updateAabb) {
            var slots = skeleton.slots;
            var slotCount = slots.length;
            var x = skeleton.x, y = skeleton.y;
            var boundingBoxes = this.boundingBoxes;
            var polygonPool = this.polygonPool;
            var polygons = this.polygons;

            boundingBoxes.length = 0;
            for (var i = 0, n = polygons.length; i < n; i++)
                polygonPool.push(polygons[i]);
            polygons.length = 0;

            for (var i = 0; i < slotCount; i++) {
                var slot = slots[i];
                var boundingBox = slot.attachment;
                if (boundingBox.type != spine.AttachmentType.boundingbox) continue;
                boundingBoxes.push(boundingBox);

                var poolCount = polygonPool.length, polygon;
                if (poolCount > 0) {
                    polygon = polygonPool[poolCount - 1];
                    polygonPool.splice(poolCount - 1, 1);
                } else
                    polygon = [];
                polygons.push(polygon);

                polygon.length = boundingBox.vertices.length;
                boundingBox.computeWorldVertices(x, y, slot.bone, polygon);
            }

            if (updateAabb) this.aabbCompute();
        },
        aabbCompute: function () {
            var polygons = this.polygons;
            var minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
            for (var i = 0, n = polygons.length; i < n; i++) {
                var vertices = polygons[i];
                for (var ii = 0, nn = vertices.length; ii < nn; ii += 2) {
                    var x = vertices[ii];
                    var y = vertices[ii + 1];
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
            this.minX = minX;
            this.minY = minY;
            this.maxX = maxX;
            this.maxY = maxY;
        },
        aabbContainsPoint: function (x, y) {
            return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
        },
        aabbIntersectsSegment: function (x1, y1, x2, y2) {
            var minX = this.minX, minY = this.minY, maxX = this.maxX, maxY = this.maxY;
            if ((x1 <= minX && x2 <= minX) || (y1 <= minY && y2 <= minY) || (x1 >= maxX && x2 >= maxX) || (y1 >= maxY && y2 >= maxY))
                return false;
            var m = (y2 - y1) / (x2 - x1);
            var y = m * (minX - x1) + y1;
            if (y > minY && y < maxY) return true;
            y = m * (maxX - x1) + y1;
            if (y > minY && y < maxY) return true;
            var x = (minY - y1) / m + x1;
            if (x > minX && x < maxX) return true;
            x = (maxY - y1) / m + x1;
            if (x > minX && x < maxX) return true;
            return false;
        },
        aabbIntersectsSkeleton: function (bounds) {
            return this.minX < bounds.maxX && this.maxX > bounds.minX && this.minY < bounds.maxY && this.maxY > bounds.minY;
        },
        containsPoint: function (x, y) {
            var polygons = this.polygons;
            for (var i = 0, n = polygons.length; i < n; i++)
                if (this.polygonContainsPoint(polygons[i], x, y)) return this.boundingBoxes[i];
            return null;
        },
        intersectsSegment: function (x1, y1, x2, y2) {
            var polygons = this.polygons;
            for (var i = 0, n = polygons.length; i < n; i++)
                if (polygons[i].intersectsSegment(x1, y1, x2, y2)) return this.boundingBoxes[i];
            return null;
        },
        polygonContainsPoint: function (polygon, x, y) {
            var nn = polygon.length;
            var prevIndex = nn - 2;
            var inside = false;
            for (var ii = 0; ii < nn; ii += 2) {
                var vertexY = polygon[ii + 1];
                var prevY = polygon[prevIndex + 1];
                if ((vertexY < y && prevY >= y) || (prevY < y && vertexY >= y)) {
                    var vertexX = polygon[ii];
                    if (vertexX + (y - vertexY) / (prevY - vertexY) * (polygon[prevIndex] - vertexX) < x) inside = !inside;
                }
                prevIndex = ii;
            }
            return inside;
        },
        polygonIntersectsSegment: function (polygon, x1, y1, x2, y2) {
            var nn = polygon.length;
            var width12 = x1 - x2, height12 = y1 - y2;
            var det1 = x1 * y2 - y1 * x2;
            var x3 = polygon[nn - 2], y3 = polygon[nn - 1];
            for (var ii = 0; ii < nn; ii += 2) {
                var x4 = polygon[ii], y4 = polygon[ii + 1];
                var det2 = x3 * y4 - y3 * x4;
                var width34 = x3 - x4, height34 = y3 - y4;
                var det3 = width12 * height34 - height12 * width34;
                var x = (det1 * width34 - width12 * det2) / det3;
                if (((x >= x3 && x <= x4) || (x >= x4 && x <= x3)) && ((x >= x1 && x <= x2) || (x >= x2 && x <= x1))) {
                    var y = (det1 * height34 - height12 * det2) / det3;
                    if (((y >= y3 && y <= y4) || (y >= y4 && y <= y3)) && ((y >= y1 && y <= y2) || (y >= y2 && y <= y1))) return true;
                }
                x3 = x4;
                y3 = y4;
            }
            return false;
        },
        getPolygon: function (attachment) {
            var index = this.boundingBoxes.indexOf(attachment);
            return index == -1 ? null : this.polygons[index];
        },
        getWidth: function () {
            return this.maxX - this.minX;
        },
        getHeight: function () {
            return this.maxY - this.minY;
        }
    };
    spine.Bone.yDown = true;
    PIXI.AnimCache = {};
    PIXI.SpineTextureLoader = function(basePath, crossorigin) {
        PIXI.EventTarget.call(this);

        this.basePath = basePath;
        this.crossorigin = crossorigin;
        this.loadingCount = 0;
    };
    PIXI.SpineTextureLoader.prototype = PIXI.SpineTextureLoader;
    PIXI.SpineTextureLoader.prototype.load = function(page, file) {
        page.rendererObject = PIXI.BaseTexture.fromImage(this.basePath + '/' + file, this.crossorigin);
        if (!page.rendererObject.hasLoaded) {
            var scope = this;
            ++scope.loadingCount;
            page.rendererObject.addEventListener('loaded', function(){
                --scope.loadingCount;
                scope.dispatchEvent({
                    type: 'loadedBaseTexture',
                    content: scope
                });
            });
        }
    };
    PIXI.Spine = function (url) {
        PIXI.DisplayObjectContainer.call(this);
        this.spineData = PIXI.AnimCache[url];
        if (!this.spineData) {
            throw new Error('Spine data must be preloaded using PIXI.SpineLoader or PIXI.AssetLoader: ' + url);
        }

        this.skeleton = new spine.Skeleton(this.spineData);
        this.skeleton.updateWorldTransform();

        this.stateData = new spine.AnimationStateData(this.spineData);
        this.state = new spine.AnimationState(this.stateData);

        this.slotContainers = [];

        for (var i = 0, n = this.skeleton.slots.length; i < n; i++) {
            var slot = this.skeleton.slots[i];
            var attachment = slot.attachment;
            var slotContainer = new PIXI.DisplayObjectContainer();
            this.slotContainers.push(slotContainer);
            this.addChild(slotContainer);

            if (attachment instanceof spine.RegionAttachment) {
                var spriteName = attachment.rendererObject.name;
                var sprite = this.createSprite(slot, attachment);
                slot.currentSprite = sprite;
                slot.currentSpriteName = spriteName;
                slotContainer.addChild(sprite);
            } else if (attachment instanceof spine.MeshAttachment) {
                var mesh = this.createMesh(slot, attachment);
                slot.currentMesh = mesh;
                slot.currentMeshName = attachment.name;
                slotContainer.addChild(mesh);
            } else {
                continue;
            }

        }
        this.autoUpdate = true;
    };
    PIXI.Spine.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    PIXI.Spine.prototype.constructor = PIXI.Spine;
    Object.defineProperty(PIXI.Spine.prototype, 'autoUpdate', {
        get: function() {
            return (this.updateTransform === PIXI.Spine.prototype.autoUpdateTransform);
        },

        set: function(value) {
            this.updateTransform = value ? PIXI.Spine.prototype.autoUpdateTransform : PIXI.DisplayObjectContainer.prototype.updateTransform;
        }
    });
    PIXI.Spine.prototype.update = function(dt) {
        this.state.update(dt);
        this.state.apply(this.skeleton);
        this.skeleton.updateWorldTransform();

        var drawOrder = this.skeleton.drawOrder;
        var slots = this.skeleton.slots;
        for (var i = 0, n = drawOrder.length; i < n; i++)
            this.children[i] = this.slotContainers[drawOrder[i]];
        for (i = 0, n = slots.length; i < n; i++) {
            var slot = slots[i];
            var attachment = slot.attachment;
            var slotContainer = this.slotContainers[i];

            if (!attachment) {
                slotContainer.visible = false;
                continue;
            }
            var type = attachment.type;
            if (type === spine.AttachmentType.region) {
                if (attachment.rendererObject) {
                    if (!slot.currentSpriteName || slot.currentSpriteName !== attachment.name) {
                        var spriteName = attachment.rendererObject.name;
                        if (slot.currentSprite !== undefined) {
                            slot.currentSprite.visible = false;
                        }
                        slot.sprites = slot.sprites || {};
                        if (slot.sprites[spriteName] !== undefined) {
                            slot.sprites[spriteName].visible = true;
                        } else {
                            var sprite = this.createSprite(slot, attachment);
                            slotContainer.addChild(sprite);
                        }
                        slot.currentSprite = slot.sprites[spriteName];
                        slot.currentSpriteName = spriteName;
                    }
                }
                var bone = slot.bone;
                slotContainer.position.x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;
                slotContainer.position.y = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11;
                slotContainer.scale.x = bone.worldScaleX;
                slotContainer.scale.y = bone.worldScaleY;
                slotContainer.rotation = -(slot.bone.worldRotation * spine.degRad);
                slot.currentSprite.tint = PIXI.rgb2hex([slot.r,slot.g,slot.b]);
            } else if (type === spine.AttachmentType.skinnedmesh) {
                if (!slot.currentMeshName || slot.currentMeshName !== attachment.name) {
                    var meshName = attachment.name;
                    if (slot.currentMesh !== undefined) {
                        slot.currentMesh.visible = false;
                    }
                    slot.meshes = slot.meshes || {};
                    if (slot.meshes[meshName] !== undefined) {
                        slot.meshes[meshName].visible = true;
                    } else {
                        var mesh = this.createMesh(slot, attachment);
                        slotContainer.addChild(mesh);
                    }
                    slot.currentMesh = slot.meshes[meshName];
                    slot.currentMeshName = meshName;
                }
                attachment.computeWorldVertices(slot.bone.skeleton.x, slot.bone.skeleton.y, slot, slot.currentMesh.vertices);

            } else {
                slotContainer.visible = false;
                continue;
            }
            slotContainer.visible = true;
            slotContainer.alpha = slot.a;
        }
    };
    PIXI.Spine.prototype.autoUpdateTransform = function () {
        this.lastTime = this.lastTime || Date.now();
        var timeDelta = (Date.now() - this.lastTime) * 0.001;
        this.lastTime = Date.now();

        this.update(timeDelta);

        PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
    };
    PIXI.Spine.prototype.createSprite = function (slot, attachment) {
        var descriptor = attachment.rendererObject;
        var baseTexture = descriptor.page.rendererObject;
        var spriteRect = new PIXI.Rectangle(descriptor.x,
            descriptor.y,
            descriptor.rotate ? descriptor.height : descriptor.width,
            descriptor.rotate ? descriptor.width : descriptor.height);
        var spriteTexture = new PIXI.Texture(baseTexture, spriteRect);
        var sprite = new PIXI.Sprite(spriteTexture);

        var baseRotation = descriptor.rotate ? Math.PI * 0.5 : 0.0;
        sprite.scale.set(descriptor.width / descriptor.originalWidth, descriptor.height / descriptor.originalHeight);
        sprite.rotation = baseRotation - (attachment.rotation * spine.degRad);
        sprite.anchor.x = sprite.anchor.y = 0.5;

        slot.sprites = slot.sprites || {};
        slot.sprites[descriptor.name] = sprite;
        return sprite;
    };
    PIXI.BaseTextureCache = {};
    PIXI.BaseTextureCacheIdGenerator = 0;
    PIXI.BaseTexture = function(source, scaleMode) {
        this.resolution = 1;
        this.width = 100;
        this.height = 100;
        this.scaleMode = scaleMode || PIXI.scaleModes.DEFAULT;
        this.hasLoaded = false;
        this.source = source;
        this._UID = PIXI._UID++;
        this.premultipliedAlpha = true;
        this._glTextures = [];
        this.mipmap = false;
        // TODO - this needs to be addressed
        this._dirty = [true, true, true, true];
        if(!source)return;
        if((this.source.complete || this.source.getContext) && this.source.width && this.source.height) {
            this.hasLoaded = true;
            this.width = this.source.naturalWidth || this.source.width;
            this.height = this.source.naturalHeight || this.source.height;
            this.dirty();
        } else {
            var scope = this;
            this.source.onload = function() {
                scope.hasLoaded = true;
                scope.width = scope.source.naturalWidth || scope.source.width;
                scope.height = scope.source.naturalHeight || scope.source.height;
                scope.dirty();
                scope.dispatchEvent( { type: 'loaded', content: scope } );
            };
            this.source.onerror = function() {
                scope.dispatchEvent( { type: 'error', content: scope } );
            };
        }
        this.imageUrl = null;
        this._powerOf2 = false;
    };
    PIXI.BaseTexture.prototype.constructor = PIXI.BaseTexture;
    PIXI.EventTarget.mixin(PIXI.BaseTexture.prototype);
    PIXI.BaseTexture.prototype.dirty = function() {
        for (var i = 0; i < this._glTextures.length; i++) {
            this._dirty[i] = true;
        }
    };
    PIXI.BaseTexture.fromImage = function(imageUrl, crossorigin, scaleMode) {
        var baseTexture = PIXI.BaseTextureCache[imageUrl];
        if(crossorigin === undefined && imageUrl.indexOf('data:') === -1) crossorigin = true;
        if(!baseTexture) {
            var image = new Image();//document.createElement('img');
            if (crossorigin) {
                image.crossOrigin = '';
            }
            image.src = imageUrl;
            baseTexture = new PIXI.BaseTexture(image, scaleMode);
            baseTexture.imageUrl = imageUrl;
            PIXI.BaseTextureCache[imageUrl] = baseTexture;
            // if there is an @2x at the end of the url we are going to assume its a highres image
            if( imageUrl.indexOf(PIXI.RETINA_PREFIX + '.') !== -1) {
                baseTexture.resolution = 2;
            }
        }

        return baseTexture;
    };
    PIXI.Texture = function(baseTexture, frame, crop, trim) {
        this.noFrame = false;

        if (!frame) {
            this.noFrame = true;
            frame = new PIXI.Rectangle(0,0,1,1);
        }

        if (baseTexture instanceof PIXI.Texture) {
            baseTexture = baseTexture.baseTexture;
        }
        this.baseTexture = baseTexture;
        this.frame = frame;
        this.trim = trim;
        this.valid = false;
        this.requiresUpdate = false;
        this._uvs = null;
        this.width = 0;
        this.height = 0;
        this.crop = crop || new PIXI.Rectangle(0, 0, 1, 1);

        if (baseTexture.hasLoaded) {
            if (this.noFrame) frame = new PIXI.Rectangle(0, 0, baseTexture.width, baseTexture.height);
            this.setFrame(frame);
        } else {
            baseTexture.addEventListener('loaded', this.onBaseTextureLoaded.bind(this));
        }
    };
    PIXI.Texture.prototype.constructor = PIXI.Texture;
    PIXI.Texture.prototype.setFrame = function(frame) {
        this.noFrame = false;

        this.frame = frame;
        this.width = frame.width;
        this.height = frame.height;

        this.crop.x = frame.x;
        this.crop.y = frame.y;
        this.crop.width = frame.width;
        this.crop.height = frame.height;

        if (!this.trim && (frame.x + frame.width > this.baseTexture.width || frame.y + frame.height > this.baseTexture.height)) {
            throw new Error('Texture Error: frame does not fit inside the base Texture dimensions ' + this);
        }
        this.valid = frame && frame.width && frame.height && this.baseTexture.source && this.baseTexture.hasLoaded;
        if (this.trim) {
            this.width = this.trim.width;
            this.height = this.trim.height;
            this.frame.width = this.trim.width;
            this.frame.height = this.trim.height;
        }
        if (this.valid) this._updateUvs();
    };
    PIXI.Texture.prototype._updateUvs = function() {
        if(!this._uvs)this._uvs = new PIXI.TextureUvs();

        var frame = this.crop;
        var tw = this.baseTexture.width;
        var th = this.baseTexture.height;

        this._uvs.x0 = frame.x / tw;
        this._uvs.y0 = frame.y / th;

        this._uvs.x1 = (frame.x + frame.width) / tw;
        this._uvs.y1 = frame.y / th;

        this._uvs.x2 = (frame.x + frame.width) / tw;
        this._uvs.y2 = (frame.y + frame.height) / th;

        this._uvs.x3 = frame.x / tw;
        this._uvs.y3 = (frame.y + frame.height) / th;
    };
    PIXI.TextureUvs = function() {
        this.x0 = 0;
        this.y0 = 0;

        this.x1 = 0;
        this.y1 = 0;

        this.x2 = 0;
        this.y2 = 0;

        this.x3 = 0;
        this.y3 = 0;
    };
    PIXI.AssetLoader = function(assetURLs, crossorigin) {
        this.assetURLs = assetURLs;
        this.crossorigin = crossorigin;
        this.loadersByType = {
            'jpg':  PIXI.ImageLoader,
            'jpeg': PIXI.ImageLoader,
            'png':  PIXI.ImageLoader,
            'gif':  PIXI.ImageLoader,
            'webp': PIXI.ImageLoader,
            'json': PIXI.JsonLoader,
            'atlas': PIXI.AtlasLoader,
            'anim': PIXI.SpineLoader,
            'xml':  PIXI.BitmapFontLoader,
            'fnt':  PIXI.BitmapFontLoader
        };
    };
    PIXI.EventTarget.mixin(PIXI.AssetLoader.prototype);
    PIXI.AssetLoader.prototype.constructor = PIXI.AssetLoader;
    PIXI.AssetLoader.prototype._getDataType = function(str) {
        var test = 'data:';
        var start = str.slice(0, test.length).toLowerCase();
        if (start === test) {
            var data = str.slice(test.length);

            var sepIdx = data.indexOf(',');
            if (sepIdx === -1) return null;
            var info = data.slice(0, sepIdx).split(';')[0];
            if (!info || info.toLowerCase() === 'text/plain') return 'txt';
            return info.split('/').pop().toLowerCase();
        }
        return null;
    };
    PIXI.AssetLoader.prototype.load = function() {
        var scope = this;
        function onLoad(evt) {
            scope.onAssetLoaded(evt.data.content);
        }
        this.loadCount = this.assetURLs.length;
        for (var i=0; i < this.assetURLs.length; i++) {
            var fileName = this.assetURLs[i];
            //first see if we have a data URI scheme..
            var fileType = this._getDataType(fileName);
            //if not, assume it's a file URI
            if (!fileType)
                fileType = fileName.split('?').shift().split('.').pop().toLowerCase();
            var Constructor = this.loadersByType[fileType];
            if(!Constructor)
                throw new Error(fileType + ' is an unsupported file type');
            var loader = new Constructor(fileName, this.crossorigin);
            loader.on('loaded', onLoad);
            loader.load();
        }
    };
    PIXI.AssetLoader.prototype.onAssetLoaded = function(loader) {
        this.loadCount--;
        this.emit('onProgress', {
            content: this,
            loader: loader,
            loaded: this.assetURLs.length - this.loadCount,
            total: this.assetURLs.length
        });

        if (this.onProgress) this.onProgress(loader);

        if (!this.loadCount) {
            this.emit('onComplete', { content: this });
            if(this.onComplete) this.onComplete();
        }
    };
    PIXI.JsonLoader = function (url, crossorigin) {
        this.url = url;
        this.crossorigin = crossorigin;
        this.baseUrl = url.replace(/[^\/]*$/, '');
        this.loaded = false;
    };
    PIXI.JsonLoader.prototype.constructor = PIXI.JsonLoader;
    PIXI.EventTarget.mixin(PIXI.JsonLoader.prototype);
    PIXI.JsonLoader.prototype.load = function () {

        if(window.XDomainRequest && this.crossorigin) {
            this.ajaxRequest = new window.XDomainRequest();
            this.ajaxRequest.timeout = 3000;
            this.ajaxRequest.onerror = this.onError.bind(this);
            this.ajaxRequest.ontimeout = this.onError.bind(this);
            this.ajaxRequest.onprogress = function() {};
            this.ajaxRequest.onload = this.onJSONLoaded.bind(this);
        } else {
            if (window.XMLHttpRequest) {
                this.ajaxRequest = new window.XMLHttpRequest();
            } else {
                this.ajaxRequest = new window.ActiveXObject('Microsoft.XMLHTTP');
            }
            this.ajaxRequest.onreadystatechange = this.onReadyStateChanged.bind(this);
        }
        this.ajaxRequest.open('GET',this.url,true);
        this.ajaxRequest.send();
    };
    PIXI.JsonLoader.prototype.onReadyStateChanged = function () {
        if (this.ajaxRequest.readyState === 4 && (this.ajaxRequest.status === 200 || window.location.href.indexOf('http') === -1)) {
            this.onJSONLoaded();
        }
    };
    PIXI.JsonLoader.prototype.onJSONLoaded = function () {

        if(!this.ajaxRequest.responseText ) {
            this.onError();
            return;
        }
        this.json = JSON.parse(this.ajaxRequest.responseText);
        if(this.json.frames && this.json.meta && this.json.meta.image) {
            // sprite sheet
            var textureUrl = this.json.meta.image;
            if (textureUrl.indexOf('data:') === -1) {
                textureUrl = this.baseUrl + textureUrl;
            }
            var image = new PIXI.ImageLoader(textureUrl, this.crossorigin);

            var frameData = this.json.frames;

            this.texture = image.texture.baseTexture;
            image.addEventListener('loaded', this.onLoaded.bind(this));

            for (var i in frameData) {
                var rect = frameData[i].frame;

                if (rect) {
                    var textureSize = new PIXI.Rectangle(rect.x, rect.y, rect.w, rect.h);
                    var crop = textureSize.clone();
                    var trim = null;

                    //  Check to see if the sprite is trimmed
                    if (frameData[i].trimmed) {
                        var actualSize = frameData[i].sourceSize;
                        var realSize = frameData[i].spriteSourceSize;
                        trim = new PIXI.Rectangle(realSize.x, realSize.y, actualSize.w, actualSize.h);
                    }
                    PIXI.TextureCache[i] = new PIXI.Texture(this.texture, textureSize, crop, trim);
                }
            }

            image.load();

        } else if(this.json.bones) {
            if (PIXI.AnimCache[this.url]) {
                this.onLoaded();
            } else {
                var atlasPath = this.url.substr(0, this.url.lastIndexOf('.')) + '.atlas';
                var atlasLoader = new PIXI.JsonLoader(atlasPath, this.crossorigin);
                // save a copy of the current object for future reference //
                var originalLoader = this;
                // before loading the file, replace the "onJSONLoaded" function for our own //
                atlasLoader.onJSONLoaded = function() {
                    // at this point "this" points at the atlasLoader (JsonLoader) instance //
                    if(!this.ajaxRequest.responseText) {
                        this.onError(); // FIXME: hmm, this is funny because we are not responding to errors yet
                        return;
                    }
                    // create a new instance of a spine texture loader for this spine object //
                    var textureLoader = new PIXI.SpineTextureLoader(this.url.substring(0, this.url.lastIndexOf('/')));
                    // create a spine atlas using the loaded text and a spine texture loader instance //
                    var spineAtlas = new spine.Atlas(this.ajaxRequest.responseText, textureLoader);
                    // now we use an atlas attachment loader //
                    var attachmentLoader = new spine.AtlasAttachmentLoader(spineAtlas);
                    // spine animation
                    var spineJsonParser = new spine.SkeletonJson(attachmentLoader);
                    var skeletonData = spineJsonParser.readSkeletonData(originalLoader.json);
                    PIXI.AnimCache[originalLoader.url] = skeletonData;
                    originalLoader.spine = skeletonData;
                    originalLoader.spineAtlas = spineAtlas;
                    originalLoader.spineAtlasLoader = atlasLoader;
                    // wait for textures to finish loading if needed
                    if (textureLoader.loadingCount > 0)
                    {
                        textureLoader.addEventListener('loadedBaseTexture', function(evt){
                            if (evt.content.content.loadingCount <= 0)
                            {
                                originalLoader.onLoaded();
                            }
                        });
                    } else {
                        originalLoader.onLoaded();
                    }
                };
                atlasLoader.load();
            }
        } else {
            this.onLoaded();
        }
    };
    PIXI.JsonLoader.prototype.onLoaded = function () {
        this.loaded = true;
        this.dispatchEvent({
            type: 'loaded',
            content: this
        });
    };
    PIXI.JsonLoader.prototype.onError = function () {
        this.dispatchEvent({
            type: 'error',
            content: this
        });
    };
    PIXI.AbstractFilter = function(fragmentSrc, uniforms) {
        this.passes = [this];
        this.shaders = [];
        this.dirty = true;
        this.padding = 0;
        this.uniforms = uniforms || {};
        this.fragmentSrc = fragmentSrc || [];
    };
    PIXI.AbstractFilter.prototype.constructor = PIXI.AbstractFilter;
    PIXI.AbstractFilter.prototype.syncUniforms = function() {
        for(var i=0,j=this.shaders.length; i<j; i++) {
            this.shaders[i].dirty = true;
        }
    };
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PIXI;
        }
        exports.PIXI = PIXI;
    } else if (typeof define !== 'undefined' && define.amd) {
        define(PIXI);
    } else {
        root.PIXI = PIXI;
    }
}).call(this);
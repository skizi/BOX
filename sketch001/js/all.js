var DomManager;
(function (DomManager) {
    DomManager.debug;
    DomManager.title;
    var titleClickFlag = false;
    var titleBgPos = { x: 0, y: 0 };
    var titleOverFlag = false;
    DomManager.restartBtn;
    DomManager.qualitySelecter;
    var qualitySelectFunc;
    var qualitySelectFadeInComp;
    DomManager.textView;
    DomManager.mouseNavi;
    DomManager.hitPointContainer;
    function init(callBack, _qualitySelectFadeInCompFunc) {
        qualitySelectFunc = callBack;
        qualitySelectFadeInComp = _qualitySelectFadeInCompFunc;
        DomManager.debug = $('#debug');
        DomManager.debug.css({ cursor: 'pointer' });
        DomManager.debug.click(debugClickHandler);
        DomManager.title = $('#title');
        DomManager.title.find('.loading-container .img').css({ backgroundImage: 'url(img/clickortouch.gif)' });
        DomManager.title.find('.loading-container .img').addClass('blink-animation');
        var y = (Vars.stageHeight - 370) * .5;
        DomManager.title.css({ top: y + 'px' });
        setTimeout(titleInitComp.bind(this), 500);
        Vars.setAnimateFunc(animate.bind(this));
    }
    DomManager.init = init;
    function titleInitComp() {
        DomManager.title.removeClass('easing0');
        DomManager.title.on('mouseenter', titleOverHandler.bind(this));
        DomManager.title.on('mouseleave', titleOutHandler.bind(this));
        DomManager.title.on('click', titleClickHandler.bind(this));
        $(window).on('resize', resize.bind(this));
    }
    function titleOverHandler(e) {
        titleOverFlag = true;
        SoundManager.play(3, false);
    }
    function titleOutHandler(e) {
        titleOverFlag = false;
    }
    function titleClickHandler() {
        if (titleClickFlag)
            return;
        titleClickFlag = true;
        titleOverFlag = false;
        SoundManager.play(2, false);
        DomManager.title.off('mouseover', titleOverHandler);
        DomManager.title.off('click', titleClickHandler);
        var y = (Vars.stageHeight - 370) * .5;
        DomManager.title.animate({ opacity: 0, top: y - 60 + 'px' }, { duration: 300, complete: titleComp.bind(this) });
        $('#footer').fadeOut(500);
        $(window).off('resize', resize.bind(this));
    }
    function titleComp() {
        DomManager.title.remove();
        DomManager.restartBtn = new RestartBtn();
        TextManager.init();
        DomManager.qualitySelecter = new QualitySelecter(qualitySelectFunc, qualitySelectFadeInComp);
        DomManager.mouseNavi = new MouseNavi();
        DomManager.hitPointContainer = new HitPointContainer();
        $(document.body).append(DomManager.debug);
    }
    function debugClickHandler() {
        DomManager.hitPointContainer.add();
    }
    function resize() {
        if (titleClickFlag)
            return;
        var y = (Vars.stageHeight - 370) * .5;
        DomManager.title.css({ top: y + 'px' });
    }
    function animate() {
        if (!titleOverFlag)
            return;
        titleBgPos.x += Vars.fpsStep;
        titleBgPos.y += Vars.fpsStep;
        DomManager.title.css({
            backgroundPositionX: titleBgPos.x,
            backgroundPositionY: titleBgPos.y
        });
    }
})(DomManager || (DomManager = {}));
var HitPointContainer = (function () {
    function HitPointContainer() {
        this.visibleFlag = false;
        this.hitPoint = 3;
        this.maxLength = 3;
        this.hearts = [];
        this.removeLastTime = 0;
        this.element = $('#hit-point-container');
        this.hitPointTxt = $(this.element.find('img')[0]);
        this.hitPointTxt.css({ visibility: 'hidden' });
        for (var i = 0; i < this.maxLength; i++) {
            var element = $(this.element.find('img')[i + 1]);
            element.css({ visibility: 'hidden' });
            this.hearts.push(element);
        }
    }
    HitPointContainer.prototype.fadeIn = function () {
        this.visibleFlag = true;
        if (this.element.css('display') == 'none')
            this.element.css({ display: 'block' });
        if (this.hitPointTxt.css('visibility') != 'visible') {
            this.hitPointTxt.css({ visibility: 'visible' });
            this.hitPointTxt.addClass('fade-in0');
        }
        for (var i = 0; i < this.maxLength; i++) {
            this.hearts[i].removeClass();
            this.hearts[i].css({ visibility: 'hidden' });
            setTimeout(function () {
                arguments[0].css({ visibility: 'visible' });
                arguments[0].addClass('fade-in0');
            }.bind(this), (i + 1) * 500, this.hearts[i]);
        }
        setTimeout(function () {
            for (var i = 0; i < this.maxLength; i++) {
                var flag = this.heartActiveCheck(i);
                if (flag)
                    this.hearts[i].removeClass();
                setTimeout(function () {
                    var i = arguments[0];
                    var flag = this.heartActiveCheck(i);
                    if (flag)
                        this.hearts[i].addClass('heart-beat0');
                }.bind(this), i * 500, i);
            }
        }.bind(this), 2500);
    };
    HitPointContainer.prototype.heartActiveCheck = function (i) {
        var flag = true;
        if (i == 0) {
            if (this.hitPoint < 1)
                flag = false;
        }
        else if (i == 1) {
            if (this.hitPoint < 2)
                flag = false;
        }
        else if (i == 2) {
            if (this.hitPoint < 3)
                flag = false;
        }
        return flag;
    };
    HitPointContainer.prototype.remove = function () {
        if (this.hitPoint == 0)
            return;
        if (Vars.elapsedTime - this.removeLastTime < .5)
            return;
        this.removeLastTime = Vars.elapsedTime;
        this.hitPoint--;
        this.hearts[this.hitPoint].removeClass();
        this.hearts[this.hitPoint].addClass('fade-out0');
        if (this.hitPoint == 0) {
            this.visibleFlag = false;
            StageManager.gameOver();
        }
    };
    HitPointContainer.prototype.add = function () {
        if (this.hitPoint >= this.maxLength)
            return;
        this.hearts[this.hitPoint].removeClass();
        this.hearts[this.hitPoint].addClass('fade-in0');
        setTimeout(function () {
            var heart = arguments[0];
            heart.removeClass();
            heart.addClass('heart-beat0');
        }.bind(this), 1000, this.hearts[this.hitPoint]);
        this.hitPoint++;
    };
    HitPointContainer.prototype.reset = function () {
        this.hitPoint = 3;
    };
    return HitPointContainer;
})();
var MouseNavi = (function () {
    function MouseNavi() {
        this.template = '<p></p>';
        this.showFlag = false;
        var element = document.createElement('div');
        element.className = 'throw-navi';
        element.innerHTML = this.template;
        document.body.appendChild(element);
        this.element = $(element);
        this.element.css({ display: 'none' });
        this.TF = $(this.element.find('p')[0]);
        this.TF.html('右クリックで投げる');
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    MouseNavi.prototype.show = function () {
        if (!this.showFlag) {
            this.element.removeClass('fade-out1');
            this.showFlag = true;
            this.element.stop().fadeIn(600);
            this.element.addClass('fade-in1');
            SoundManager.play(6, false);
        }
    };
    MouseNavi.prototype.hide = function () {
        this.element.removeClass('fade-in1');
        this.showFlag = false;
        this.element.stop().fadeOut(300);
        this.element.addClass('fade-out1');
    };
    MouseNavi.prototype.animate = function () {
        if (!this.showFlag)
            return;
        this.element.css({ left: Vars.mouseX + 10 + 'px', top: Vars.mouseY + 10 + 'px' });
    };
    return MouseNavi;
})();
var QualitySelecter = (function () {
    function QualitySelecter(qualitySelectFunc, _fadeinCompFunc) {
        if (_fadeinCompFunc === void 0) { _fadeinCompFunc = null; }
        this.selectName = 'middle';
        this.nowOverTarget = -1;
        this.bgPosObjs = [{}, {}, {}];
        this.selectCompFlag = false;
        this.qualitySelectFunc = qualitySelectFunc;
        this.fadeInCompFunc = _fadeinCompFunc;
        this.element = $('#quality-selecter');
        this.element.css({ opacity: 0, display: 'block' });
        this.element.animate({ opacity: 1 }, { duration: 1000 });
        $(document.body).append(this.element);
        this.menuContainer = $(this.element.find('.menu-container')[0]);
        this.menuContainer.addClass('scaleY0');
        setTimeout(function () {
            this.menuContainer.removeClass('scaleY0').addClass('fade-in2');
        }.bind(this), 800);
        this.menu = $(this.element.find('.menu')[0]);
        if (platform == 'sp') {
            this.menu.css({
                width: '90%',
                margin: '0px 0px 0px 5%'
            });
        }
        this.btns = this.menu.find('a');
        this.btns.on('mouseover', this.overHandler.bind(this));
        this.btns.on('mouseout', this.outHandler.bind(this));
        this.btns.on('click', this.clickHandler.bind(this));
        this.lists = this.menu.find('li');
        for (var i = 0; i < 3; i++) {
            this.bgPosObjs[i].posX = 0;
            this.bgPosObjs[i].posY = 0;
            $(this.lists[i]).css({ marginTop: '-100px', opacity: 0 });
            var obj = { duration: 200 };
            if (i == 2)
                obj = { duration: 200, complete: this.btnFadeInComp.bind(this) };
            $(this.lists[i]).stop().delay(300 * i + 1500).animate({ marginTop: '0px', opacity: 1 }, obj);
        }
        Vars.setAnimateFunc(this.animate.bind(this));
        this.resize();
        Vars.pushResizeFunc(this.resize.bind(this));
    }
    QualitySelecter.prototype.btnFadeInComp = function () {
        if (this.fadeInCompFunc)
            this.fadeInCompFunc();
    };
    QualitySelecter.prototype.overHandler = function (e) {
        switch (e.target.className) {
            case 'low':
                this.nowOverTarget = 0;
                break;
            case 'middle':
                this.nowOverTarget = 1;
                break;
            case 'high':
                this.nowOverTarget = 2;
                break;
        }
        SoundManager.play(3, false);
    };
    QualitySelecter.prototype.outHandler = function (e) {
        this.nowOverTarget = -1;
    };
    QualitySelecter.prototype.clickHandler = function (e) {
        if (this.selectCompFlag)
            return;
        this.selectCompFlag = true;
        this.selectName = e.target.className;
        $(this.lists[0]).stop().animate({ marginTop: '-100px', opacity: 0 }, { duration: 200 });
        $(this.lists[1]).stop().delay(300).animate({ marginTop: '-100px', opacity: 0 }, { duration: 200 });
        $(this.lists[2]).stop().delay(600).animate({ marginTop: '-100px', opacity: 0 }, { duration: 200 });
        setTimeout(function () {
            this.menuContainer.removeClass('fade-in2').addClass('fade-out2');
        }.bind(this), 1000);
        this.element.delay(1600).fadeOut(1000, this.fadeOutComp.bind(this));
        SoundManager.play(2, false);
    };
    QualitySelecter.prototype.fadeOutComp = function () {
        this.qualitySelectFunc(this.selectName);
    };
    QualitySelecter.prototype.animate = function () {
        if (this.selectCompFlag)
            return;
        var index = this.nowOverTarget;
        if (index == -1)
            return;
        this.bgPosObjs[index].posX += Vars.fpsStep;
        this.bgPosObjs[index].posY += Vars.fpsStep;
        $(this.btns[index]).css({
            backgroundPositionX: this.bgPosObjs[index].posX,
            backgroundPositionY: this.bgPosObjs[index].posY
        });
    };
    QualitySelecter.prototype.resize = function () {
        if (this.selectCompFlag)
            return;
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.element.css({
            height: h + 'px'
        });
        this.menuContainer.css({
            marginTop: (h - 456) * .5 + 'px'
        });
    };
    return QualitySelecter;
})();
var RestartBtn = (function () {
    function RestartBtn() {
        this.pluseY = 130;
        this.restartBtnOverFlag = false;
        this.restartBtnClickFlag = false;
        this.bgPosObj = { posX: 0, posY: 0 };
        this.template = '<a href="javascript:void(0);" id="restart-btn">restart!</a>';
        this.element = $('<a>');
        this.element.html('restart!');
        this.element.attr({ href: "javascript:void(0);", id: 'restart-btn' });
        this.element.on('mouseover', this.overHandler.bind(this));
        this.element.on('mouseout', this.outHandler.bind(this));
        this.element.on('click', this.clickHandler.bind(this));
        this.element.css({ visibility: 'hidden' });
        $(document.body).append(this.element);
        Vars.setAnimateFunc(this.animate.bind(this));
        this.resize();
        Vars.pushResizeFunc(this.resize.bind(this));
        this.hide();
    }
    RestartBtn.prototype.overHandler = function () {
        SoundManager.play(3, false);
        this.restartBtnOverFlag = true;
    };
    RestartBtn.prototype.outHandler = function () {
        this.restartBtnOverFlag = false;
    };
    RestartBtn.prototype.clickHandler = function () {
        if (this.restartBtnClickFlag)
            return;
        this.restartBtnClickFlag = true;
        this.hide();
        StageManager.restart();
        SoundManager.play(2, false);
    };
    RestartBtn.prototype.show = function () {
        this.element.css({ display: 'block' });
        this.restartBtnClickFlag = false;
        var y = (Vars.stageHeight - this.element.height()) * .5 + this.pluseY;
        this.element.css({ visibility: 'visible', opactiy: '0', top: y - 20 + 'px' });
        this.element.stop().delay(1000).animate({ opacity: '1', top: y + 'px' }, { duration: 200 });
    };
    RestartBtn.prototype.hide = function (callBack) {
        if (callBack === void 0) { callBack = null; }
        this.hideCallBack = callBack;
        var y = (Vars.stageHeight - this.element.height()) * .5 + this.pluseY;
        this.element.stop().delay(1000).animate({ opacity: '0', top: y - 20 + 'px' }, { duration: 200, complete: this.hideComp.bind(this) });
    };
    RestartBtn.prototype.hideComp = function () {
        this.restartBtnClickFlag = false;
        this.element.css({ display: 'none' });
        if (this.hideCallBack)
            this.hideCallBack();
    };
    RestartBtn.prototype.animate = function () {
        if (!this.restartBtnOverFlag)
            return;
        this.bgPosObj.posX++;
        this.bgPosObj.posY++;
        this.element.css({
            backgroundPositionX: this.bgPosObj.posX,
            backgroundPositionY: this.bgPosObj.posY
        });
    };
    RestartBtn.prototype.resize = function () {
        var x = (Vars.stageWidth - this.element.width()) * .5;
        var y = (Vars.stageHeight - this.element.height()) * .5 + this.pluseY;
        this.element.css({ left: x + 'px', top: y + 'px' });
    };
    return RestartBtn;
})();
var TextManager;
(function (TextManager) {
    var textView;
    function init() {
        textView = new TextView();
        Vars.setEnterDownFunc(nextText.bind(this));
    }
    TextManager.init = init;
    function setText(text, autoFadeOutFlag) {
        if (autoFadeOutFlag === void 0) { autoFadeOutFlag = false; }
        textView.setText(text, autoFadeOutFlag);
    }
    TextManager.setText = setText;
    function nextText() {
        textView.nextText();
    }
    TextManager.nextText = nextText;
    function refresh() {
        textView.refresh();
    }
    TextManager.refresh = refresh;
})(TextManager || (TextManager = {}));
var TextView = (function () {
    function TextView() {
        this.textAreaViewFlag = false;
        this.textAreaStr = "";
        this.nowTextAreaStr = "";
        this.textAreaStrArray = [];
        this.textAnimationCompFlag = false;
        this.textAnimeTimer = 0;
        this.TEXT_ANIME_INTERVAL = .05;
        this.kaigyoTiming = 21;
        this.template = '<p></p>';
        this.defaultY = Vars.stageHeight - 164;
        this.visibleFlag = false;
        this.textView = document.createElement('div');
        this.textView.className = 'text-view back';
        this.textView.innerHTML = this.template;
        this.textView.onclick = this.nextText.bind(this);
        document.body.appendChild(this.textView);
        this.TF = this.textView.getElementsByTagName('p')[0];
        var targetY = this.defaultY;
        $(this.textView).css({ top: targetY - 45 + 'px', opacity: 0 });
        Vars.setAnimateFunc(this.animate.bind(this));
        if (platform != 'pc')
            this.defaultY = Vars.stageHeight - 200;
        this.resize();
        Vars.pushResizeFunc(this.resize.bind(this));
    }
    TextView.prototype.animate = function () {
        if (!this.visibleFlag)
            return;
        this.textAnimeTimer -= Vars.delta;
        if (this.textAnimeTimer <= 0) {
            if (this.textAreaStrArray.length > 0)
                this.textWrite();
            this.textAnimeTimer = this.TEXT_ANIME_INTERVAL;
        }
    };
    TextView.prototype.textWrite = function () {
        if (!this.textAnimationCompFlag) {
            var index = this.textAreaStr.length;
            var str = this.textAreaStrArray[0];
            if (index < str.length) {
                this.textAreaStr += str.substr(index, 1);
                this.TF.innerHTML = this.textAreaStr;
            }
            if (index >= str.length) {
                this.textAnimationCompFlag = true;
            }
        }
    };
    TextView.prototype.setText = function (str, autoFadeOutFlag) {
        if (!this.textAreaViewFlag) {
            this.textAreaShow();
            this.textAnimationCompFlag = false;
        }
        this.textAreaStrArray.push(str);
        if (autoFadeOutFlag) {
            setTimeout(function () {
                this.refresh();
            }.bind(this), 3000);
        }
    };
    TextView.prototype.nextText = function () {
        if (this.textAreaStrArray.length <= 0)
            return;
        if (this.textAnimationCompFlag) {
            this.textAreaStr = '';
            this.textAreaStrArray.shift();
            if (this.textAreaStrArray.length == 0) {
                this.textAreaHide();
            }
            else {
                this.textAnimationCompFlag = false;
            }
        }
        else {
            this.textAnimationCompFlag = true;
            this.textAreaStr = this.textAreaStrArray[0];
        }
        this.TF.innerHTML = this.textAreaStr;
    };
    TextView.prototype.refresh = function () {
        this.textAreaStr = '';
        this.textAreaStrArray = [];
        this.textAreaHide();
        this.textAnimationCompFlag = true;
    };
    TextView.prototype.textAreaShow = function () {
        this.textAreaViewFlag = true;
        this.textView.style.display = 'block';
        this.textView.className = 'text-view';
        var targetY = this.defaultY;
        $(this.textView).css({ top: targetY - 40 + 'px', opacity: 0 });
        $(this.textView).stop().animate({ top: targetY, opacity: 1 }, { duration: 700, easing: 'easeOutBack' });
        this.visibleFlag = true;
    };
    TextView.prototype.textAreaHide = function (easing) {
        if (easing === void 0) { easing = true; }
        this.textAreaViewFlag = false;
        var targetY = this.defaultY - 20;
        $(this.textView).stop().animate({ top: targetY, opacity: 0 }, { duration: 200, easing: 'easeOutCubic', complete: this.textAreaHideComp.bind(this) });
    };
    TextView.prototype.textAreaHideComp = function () {
        this.textView.style.display = 'none';
        this.visibleFlag = false;
    };
    TextView.prototype.resize = function () {
        this.defaultY = Vars.stageHeight - 164;
        if (platform != 'pc')
            this.defaultY = Vars.stageHeight - 200;
        if (this.textAreaViewFlag) {
            $(this.textView).css({ top: this.defaultY + 'px' });
        }
    };
    return TextView;
})();
var Functions;
(function (Functions) {
    function objectCheck(obj) {
        var properties = '';
        for (var prop in obj) {
            properties += prop + "=" + obj[prop] + "\n";
        }
        alert(properties);
    }
    Functions.objectCheck = objectCheck;
    function easing(now, target, easing) {
        now += -(now - target) / easing;
        return now;
    }
    Functions.easing = easing;
    var fliction = .9;
    var spring = .3;
    function easing2(now, target, cache) {
        cache += -(now - target) / 2 * spring;
        cache *= fliction;
        now += cache;
        return { now: now, cache: cache };
    }
    Functions.easing2 = easing2;
})(Functions || (Functions = {}));
var Input;
(function (Input) {
    Input.x = 0;
    Input.y = 0;
    Input.z = 0;
    Input.alt = false;
    Input.run = false;
})(Input || (Input = {}));
var SceneManager;
(function (SceneManager) {
    SceneManager.scene;
    SceneManager.layer0;
    function init() {
        SceneManager.scene = new Scene();
        SceneManager.layer0 = new Layer();
    }
    SceneManager.init = init;
    function initObjects() {
        SceneManager.scene.initObjects();
    }
    SceneManager.initObjects = initObjects;
})(SceneManager || (SceneManager = {}));
var ParticleManager;
(function (ParticleManager) {
    ParticleManager.particles = {};
    function setParticle(particle, name) {
        ParticleManager.particles[name] = (particle);
    }
    ParticleManager.setParticle = setParticle;
    function on(name) {
        if (name.indexOf('starParticle') != -1 || name == 'hitEffectParticle0') {
            ParticleManager.particles[name].on();
        }
        else {
            ParticleManager.particles[name].visible = true;
        }
    }
    ParticleManager.on = on;
    function off(name) {
        if (name.indexOf('starParticle') != -1 || name == 'hitEffectParticle0') {
            ParticleManager.particles[name].off();
        }
        else {
            ParticleManager.particles[name].visible = false;
        }
    }
    ParticleManager.off = off;
})(ParticleManager || (ParticleManager = {}));
var AmmoManager;
(function (AmmoManager) {
    var physicsWorker;
    var ab = new Float32Array(1);
    var SUPPORT_TRANSFERABLE = false;
    var catchMessageFlag = false;
    var physicsCheckTime = 0;
    var maxPhysicsCheckTime = .5;
    var meshs = [];
    var meshsLength = 0;
    var jointIndex = 0;
    var activeMessage = 'messages1';
    var messagesLength = 1576;
    var messages1 = new Float32Array(messagesLength);
    var messages2 = new Float32Array(messagesLength);
    var messagesIndex = 1;
    var postMessageFps = 0;
    var postMessageLastTime = 0;
    var postMessageDelta = 0;
    var postMessageCacheTime = 0;
    var renderFlag = false;
    function init(callBackFunc) {
        initMessages(messages1);
        initMessages(messages2);
        if (!physicsWorker)
            physicsWorker = new Worker('js/ammoWorker.js');
        physicsWorker.transferableMessage = physicsWorker.webkitPostMessage || physicsWorker.postMessage;
        ab[0] = -1;
        physicsWorker.transferableMessage(ab, [ab.buffer]);
        if (ab.length === 0) {
            SUPPORT_TRANSFERABLE = true;
        }
        physicsWorker.onmessage = function (event) {
            catchMessageFlag = true;
            var data = event.data;
            if (data.type) {
                switch (data.type) {
                    case 'workerScriptLoadComp':
                        var _browser = 0;
                        if (browser == 'safari')
                            _browser = 1;
                        if (browser == 'ie')
                            _browser = 2;
                        var supportFlag = 0;
                        if (SUPPORT_TRANSFERABLE)
                            supportFlag = 1;
                        physicsWorker.transferableMessage({
                            type: 'init',
                            browser: _browser,
                            supportTransFerable: supportFlag,
                            platform: platform
                        });
                        break;
                    case 'initComp':
                        post(null);
                        callBackFunc();
                        animate();
                        break;
                }
            }
            else {
                var workerData = data.worker;
                for (var i = 1; i < workerData[0]; i += 8) {
                    if (meshs[workerData[i]]) {
                        meshs[workerData[i]].position.set(workerData[i + 1], workerData[i + 2], workerData[i + 3]);
                        meshs[workerData[i]].quaternion.set(workerData[i + 4], workerData[i + 5], workerData[i + 6], workerData[i + 7]);
                    }
                }
                post(data);
            }
        };
    }
    AmmoManager.init = init;
    function post(data) {
        if (data) {
            var returnMessage = data.message;
            var workerMessage = data.worker;
        }
        if (activeMessage == 'messages1') {
            activeMessage = 'messages2';
            if (returnMessage) {
                messages2 = returnMessage;
                initMessages(messages2);
            }
            var sendMessage = messages1;
        }
        else {
            activeMessage = 'messages1';
            if (returnMessage) {
                messages1 = returnMessage;
                initMessages(messages1);
            }
            sendMessage = messages2;
        }
        if (SUPPORT_TRANSFERABLE) {
            if (workerMessage && workerMessage.buffer) {
                var data = { message: sendMessage, worker: workerMessage };
                physicsWorker.transferableMessage(data, [data.message.buffer, data.worker.buffer]);
            }
            else {
                data = { message: sendMessage };
                physicsWorker.transferableMessage(data, [data.message.buffer]);
            }
        }
        else {
            physicsWorker.transferableMessage(data);
        }
    }
    function initMessages(messages) {
        messages[0] = 0;
        messagesIndex = 1;
    }
    function setMessages(array) {
        if (activeMessage == 'messages1') {
            var messages = messages1;
        }
        else {
            messages = messages2;
        }
        var max = messagesIndex + array[0] - 1;
        var count = 1;
        for (var i = messagesIndex; i < max; i++) {
            messages[i] = array[count];
            count++;
        }
        messagesIndex += 21;
        messages[0] = messagesIndex - 1;
    }
    function setTargetPosition(index, pos) {
        setMessages([6, 2, index, pos.x, pos.y, pos.z]);
    }
    AmmoManager.setTargetPosition = setTargetPosition;
    function setReverseFlag(reverseFlag) {
        var flag = 1;
        if (!reverseFlag)
            flag = 0;
        setMessages([3, 3, flag]);
    }
    AmmoManager.setReverseFlag = setReverseFlag;
    function setSpeed(index, speed) {
        setMessages([4, 4, index, speed]);
    }
    AmmoManager.setSpeed = setSpeed;
    function setRigidBodyManyShape(rigidMeshs, moveObject, bodyName, mass) {
        var index = meshsLength;
        var length = rigidMeshs.length;
        for (var i = 0; i < length; i++) {
            var mesh = rigidMeshs[i];
            var array = [22, 5, index];
            setPosArray(moveObject, array);
            setSizeArray(mesh, array);
            setQuaternionArray(moveObject, array);
            setPosArray(mesh, array);
            setQuaternionArray(mesh, array);
            array.push(length);
            array.push(mass);
            setMessages(array);
        }
        meshs.push(moveObject);
        meshsLength = meshs.length;
        return index;
    }
    AmmoManager.setRigidBodyManyShape = setRigidBodyManyShape;
    function setRigidBody(rigidMesh, moveObject, bodyName, shapeType, groupNo, mass) {
        var shapeId = 0;
        switch (shapeType) {
            case 'sphere':
                shapeId = 0;
                break;
            case 'box':
                shapeId = 1;
                break;
            case 'cylinder':
                shapeId = 2;
                break;
            case 'plane':
                shapeId = 3;
                break;
        }
        var index = meshsLength;
        var array = [17, 6, index];
        setPosArray(moveObject, array);
        setSizeArray(rigidMesh, array);
        setQuaternionArray(moveObject, array);
        array.push(shapeId);
        array.push(groupNo);
        array.push(mass);
        if (bodyName == 'player') {
            array.push(1);
        }
        else {
            array.push(0);
        }
        setMessages(array);
        meshs.push(moveObject);
        meshsLength = meshs.length;
        return index;
    }
    AmmoManager.setRigidBody = setRigidBody;
    function setKinematic(index) {
        setMessages([3, 7, index]);
    }
    AmmoManager.setKinematic = setKinematic;
    function setCollision(rigidMeshs) {
        var length = rigidMeshs.length;
        for (var i = 0; i < length; i++) {
            var mesh = rigidMeshs[i];
            var array = [14, 8, i];
            setPosArray(mesh, array);
            setSizeArray(mesh, array);
            setQuaternionArray(mesh, array);
            array.push(length);
            setMessages(array);
        }
    }
    AmmoManager.setCollision = setCollision;
    function objectCatch(index) {
        setMessages([3, 9, index]);
    }
    AmmoManager.objectCatch = objectCatch;
    function objectRelease() {
        setMessages([2, 10]);
    }
    AmmoManager.objectRelease = objectRelease;
    function objectThrows() {
        setMessages([2, 11]);
    }
    AmmoManager.objectThrows = objectThrows;
    function setPosition(index, pos) {
        setMessages([
            6,
            12,
            index,
            pos.x,
            pos.y,
            pos.z
        ]);
    }
    AmmoManager.setPosition = setPosition;
    function setQuaternion(index, q) {
        setMessages([
            7,
            13,
            index,
            q.x,
            q.y,
            q.z,
            q.w
        ]);
    }
    AmmoManager.setQuaternion = setQuaternion;
    function setScale(index, scale) {
        setMessages([
            4,
            14,
            index,
            scale
        ]);
    }
    AmmoManager.setScale = setScale;
    function setJointToBody(index1, index2, pos1, pos2) {
        jointIndex++;
        setMessages([
            11,
            15,
            jointIndex,
            index1,
            index2,
            pos1.x,
            pos1.y,
            pos1.z,
            pos2.x,
            pos2.y,
            pos2.z
        ]);
        return jointIndex;
    }
    AmmoManager.setJointToBody = setJointToBody;
    function setHingeJoint(index, pos, vec) {
        jointIndex++;
        setMessages([
            10,
            16,
            index,
            jointIndex,
            pos.x,
            pos.y,
            pos.z,
            vec.x,
            vec.y,
            vec.z
        ]);
        return jointIndex;
    }
    AmmoManager.setHingeJoint = setHingeJoint;
    function jointDelete(jointIndex) {
        setMessages([
            3,
            17,
            jointIndex
        ]);
    }
    AmmoManager.jointDelete = jointDelete;
    function setForceFlag(index, _flag) {
        var flag = 0;
        if (_flag)
            flag = 1;
        setMessages([
            4,
            18,
            index,
            flag
        ]);
    }
    AmmoManager.setForceFlag = setForceFlag;
    function setRotationLimit(index, vec) {
        setMessages([
            6,
            19,
            index,
            vec.x,
            vec.y,
            vec.z
        ]);
    }
    AmmoManager.setRotationLimit = setRotationLimit;
    function setMassProps(index, mass) {
        setMessages([
            4,
            20,
            index,
            mass
        ]);
    }
    AmmoManager.setMassProps = setMassProps;
    function removeRigidBody(moveTarget) {
        if (moveTarget.rigidBodyIndex == -1)
            return;
        var index = moveTarget.rigidBodyIndex;
        meshs[moveTarget.rigidBodyIndex] = null;
        moveTarget.rigidBodyIndex = -1;
        moveTarget.rigidFlag = false;
        setMessages([3, 21, index]);
    }
    AmmoManager.removeRigidBody = removeRigidBody;
    function removeRigidBodies() {
        setMessages([2, 22]);
        var length = meshs.length;
        for (var i = 0; i < length; i++) {
            meshs[0].rigidBodyIndex = -1;
            meshs[0].rigidFlag = false;
            meshs.splice(0, 1);
        }
        meshs = [];
    }
    AmmoManager.removeRigidBodies = removeRigidBodies;
    function setLinearVelocity(index, targetPos, speed) {
        if (!renderFlag)
            return;
        setMessages([7, 24, index, targetPos.x, targetPos.y, targetPos.z, speed]);
    }
    AmmoManager.setLinearVelocity = setLinearVelocity;
    function applyImpulse(index, pos, targetPos, strength) {
        setMessages([
            10,
            25,
            index,
            pos.x,
            pos.y,
            pos.z,
            targetPos.x,
            targetPos.y,
            targetPos.z,
            strength
        ]);
    }
    AmmoManager.applyImpulse = applyImpulse;
    function resetVelocity(index) {
        setMessages([
            3,
            26,
            index
        ]);
    }
    AmmoManager.resetVelocity = resetVelocity;
    function stop() {
        renderFlag = false;
        setMessages([2, 27]);
    }
    AmmoManager.stop = stop;
    function start() {
        renderFlag = true;
        setMessages([2, 28]);
    }
    AmmoManager.start = start;
    function setSizeArray(mesh, array) {
        var size = MeshManager.getSize(mesh);
        array.push(size.x);
        array.push(size.y);
        array.push(size.z);
    }
    function setPosArray(mesh, array) {
        var pos = mesh.position.clone();
        array.push(pos.x);
        array.push(pos.y);
        array.push(pos.z);
    }
    function setQuaternionArray(mesh, array) {
        var q = mesh.quaternion;
        array.push(q.x);
        array.push(q.y);
        array.push(q.z);
        array.push(q.w);
    }
    function animate() {
        if (Vars.jointCatchFlag) {
        }
    }
})(AmmoManager || (AmmoManager = {}));
var CannonManager;
(function (CannonManager) {
    var physicsWorker;
    var ab = new Float32Array(1);
    var SUPPORT_TRANSFERABLE = false;
    var catchMessageFlag = false;
    var physicsCheckTime = 0;
    var maxPhysicsCheckTime = .5;
    var meshs = [];
    var meshsLength = 0;
    var jointIndex = 0;
    var activeMessage = 'messages1';
    var messagesLength = 1576;
    var messages1 = new Float32Array(messagesLength);
    var messages2 = new Float32Array(messagesLength);
    var messagesIndex = 1;
    var messagesIndexMax = 0;
    var postMessageFps = 0;
    var postMessageLastTime = 0;
    var postMessageDelta = 0;
    var postMessageCacheTime = 0;
    var renderFlag = false;
    function init(callBackFunc) {
        initMessages(messages1);
        initMessages(messages2);
        if (!physicsWorker)
            physicsWorker = new Worker('js/cannonWorker.js');
        physicsWorker.transferableMessage = physicsWorker.webkitPostMessage || physicsWorker.postMessage;
        ab[0] = -1;
        physicsWorker.transferableMessage(ab, [ab.buffer]);
        if (ab.length === 0) {
            SUPPORT_TRANSFERABLE = true;
        }
        physicsWorker.onmessage = function (event) {
            catchMessageFlag = true;
            var data = event.data;
            if (data.type) {
                switch (data.type) {
                    case 'workerScriptLoadComp':
                        var _browser = 0;
                        var supportFlag = 0;
                        if (SUPPORT_TRANSFERABLE)
                            supportFlag = 1;
                        physicsWorker.transferableMessage({
                            type: 'init',
                            browser: _browser,
                            supportTransFerable: supportFlag,
                            platform: platform
                        });
                        break;
                    case 'initComp':
                        post(null);
                        callBackFunc();
                        animate();
                        break;
                }
            }
            else {
                var workerData = data.worker;
                for (var i = 1; i < workerData[0]; i += 8) {
                    if (meshs[workerData[i]]) {
                        meshs[workerData[i]].position.set(workerData[i + 1], workerData[i + 2], workerData[i + 3]);
                        meshs[workerData[i]].quaternion.set(workerData[i + 4], workerData[i + 5], workerData[i + 6], workerData[i + 7]);
                    }
                }
                post(data);
            }
        };
    }
    CannonManager.init = init;
    function post(data) {
        if (data) {
            var returnMessage = data.message;
            var workerMessage = data.worker;
        }
        if (activeMessage == 'messages1') {
            activeMessage = 'messages2';
            if (returnMessage) {
                messages2 = returnMessage;
                initMessages(messages2);
            }
            var sendMessage = messages1;
        }
        else {
            activeMessage = 'messages1';
            if (returnMessage) {
                messages1 = returnMessage;
                initMessages(messages1);
            }
            sendMessage = messages2;
        }
        if (SUPPORT_TRANSFERABLE) {
            if (workerMessage && workerMessage.buffer) {
                var data = { message: sendMessage, worker: workerMessage };
                physicsWorker.transferableMessage(data, [data.message.buffer, data.worker.buffer]);
            }
            else {
                data = { message: sendMessage };
                physicsWorker.transferableMessage(data, [data.message.buffer]);
            }
        }
        else {
            physicsWorker.transferableMessage(data);
        }
    }
    function initMessages(messages) {
        messages[0] = 0;
        messagesIndex = 1;
    }
    function setMessages(array) {
        if (activeMessage == 'messages1') {
            var messages = messages1;
        }
        else {
            messages = messages2;
        }
        var max = messagesIndex + array[0] - 1;
        var count = 1;
        for (var i = messagesIndex; i < max; i++) {
            messages[i] = array[count];
            count++;
        }
        messagesIndex += 21;
        messages[0] = messagesIndex - 1;
    }
    function setTargetPosition(index, pos) {
        setMessages([6, 2, index, pos.x, pos.y, pos.z]);
    }
    CannonManager.setTargetPosition = setTargetPosition;
    function setReverseFlag(reverseFlag) {
        var flag = 1;
        if (!reverseFlag)
            flag = 0;
        setMessages([3, 3, flag]);
    }
    CannonManager.setReverseFlag = setReverseFlag;
    function setSpeed(index, speed) {
        setMessages([4, 4, index, speed]);
    }
    CannonManager.setSpeed = setSpeed;
    function setRigidBodyManyShape(rigidMeshs, moveObject, bodyName, mass) {
        var index = meshsLength;
        var length = rigidMeshs.length;
        for (var i = 0; i < length; i++) {
            var mesh = rigidMeshs[i];
            var array = [22, 5, index];
            setPosArray(moveObject, array);
            setSizeArray(mesh, array);
            setQuaternionArray(moveObject, array);
            setPosArray(mesh, array);
            setQuaternionArray(mesh, array);
            array.push(length);
            array.push(mass);
            setMessages(array);
        }
        meshs.push(moveObject);
        meshsLength = meshs.length;
        return index;
    }
    CannonManager.setRigidBodyManyShape = setRigidBodyManyShape;
    function setRigidBody(rigidMesh, moveObject, bodyName, shapeType, groupNo, mass, noRotateFlag) {
        var shapeId = 0;
        switch (shapeType) {
            case 'sphere':
                shapeId = 0;
                break;
            case 'box':
                shapeId = 1;
                break;
            case 'cylinder':
                shapeId = 2;
                break;
            case 'plane':
                shapeId = 3;
                break;
        }
        var index = meshsLength;
        var array = [18, 6, index];
        setPosArray(moveObject, array);
        setSizeArray(rigidMesh, array);
        setQuaternionArray(moveObject, array);
        array.push(shapeId);
        array.push(groupNo);
        array.push(mass);
        if (bodyName == 'player') {
            array.push(1);
        }
        else {
            if (bodyName == 'box00') {
                array.push(-1);
            }
            else {
                array.push(0);
            }
        }
        if (noRotateFlag) {
            array.push(1);
        }
        else {
            array.push(0);
        }
        setMessages(array);
        meshs.push(moveObject);
        meshsLength = meshs.length;
        return index;
    }
    CannonManager.setRigidBody = setRigidBody;
    function setKinematic(index) {
        setMessages([3, 7, index]);
    }
    CannonManager.setKinematic = setKinematic;
    function setCollision(rigidMeshs) {
        var length = rigidMeshs.length;
        for (var i = 0; i < length; i++) {
            var mesh = rigidMeshs[i];
            var array = [14, 8, i];
            setPosArray(mesh, array);
            setSizeArray(mesh, array);
            setQuaternionArray(mesh, array);
            array.push(length);
            setMessages(array);
        }
    }
    CannonManager.setCollision = setCollision;
    function objectCatch(index) {
        setMessages([3, 9, index]);
    }
    CannonManager.objectCatch = objectCatch;
    function objectRelease() {
        setMessages([2, 10]);
    }
    CannonManager.objectRelease = objectRelease;
    function objectThrows() {
        setMessages([2, 11]);
    }
    CannonManager.objectThrows = objectThrows;
    function setPosition(index, pos) {
        setMessages([
            6,
            12,
            index,
            pos.x,
            pos.y,
            pos.z
        ]);
    }
    CannonManager.setPosition = setPosition;
    function setQuaternion(index, q) {
        setMessages([
            7,
            13,
            index,
            q.x,
            q.y,
            q.z,
            q.w
        ]);
    }
    CannonManager.setQuaternion = setQuaternion;
    function setScale(index, scale) {
        if (!meshs[index].rigidMesh)
            return;
        var sizes = [];
        setSizeArray(meshs[index].rigidMesh, sizes);
        setMessages([
            7,
            14,
            index,
            sizes[0] * scale,
            sizes[1] * scale,
            sizes[2] * scale
        ]);
    }
    CannonManager.setScale = setScale;
    function setJointToBody(index1, index2, pos1, pos2) {
        jointIndex++;
        setMessages([
            8,
            15,
            jointIndex,
            index1,
            index2,
            pos1.x,
            pos1.y,
            pos1.z
        ]);
        return jointIndex;
    }
    CannonManager.setJointToBody = setJointToBody;
    function setHingeJoint(index1, index2, pos, vec) {
        jointIndex++;
        setMessages([
            4,
            16,
            index1,
            index2,
            jointIndex
        ]);
        return jointIndex;
    }
    CannonManager.setHingeJoint = setHingeJoint;
    function jointDelete(jointIndex) {
        setMessages([
            3,
            17,
            jointIndex
        ]);
    }
    CannonManager.jointDelete = jointDelete;
    function setForceFlag(index, _flag) {
        var flag = 0;
        if (_flag)
            flag = 1;
        setMessages([
            4,
            18,
            index,
            flag
        ]);
    }
    CannonManager.setForceFlag = setForceFlag;
    function setRotationLimit(index, vec) {
        setMessages([
            6,
            19,
            index,
            vec.x,
            vec.y,
            vec.z
        ]);
    }
    CannonManager.setRotationLimit = setRotationLimit;
    function setMassProps(index, mass) {
        setMessages([
            4,
            20,
            index,
            mass
        ]);
    }
    CannonManager.setMassProps = setMassProps;
    function removeRigidBody(moveTarget) {
        if (moveTarget.rigidBodyIndex == -1)
            return;
        var index = moveTarget.rigidBodyIndex;
        meshs[moveTarget.rigidBodyIndex] = null;
        moveTarget.rigidBodyIndex = -1;
        moveTarget.rigidFlag = false;
        setMessages([3, 21, index]);
    }
    CannonManager.removeRigidBody = removeRigidBody;
    function removeRigidBodies() {
        setMessages([2, 22]);
        var length = meshs.length;
        for (var i = 0; i < length; i++) {
            meshs[0].rigidBodyIndex = -1;
            meshs[0].rigidFlag = false;
            meshs.splice(0, 1);
        }
        meshs = [];
    }
    CannonManager.removeRigidBodies = removeRigidBodies;
    function setLinearVelocity(index, targetPos, speed) {
        if (!renderFlag)
            return;
        setMessages([7, 24, index, targetPos.x, targetPos.y, targetPos.z, speed]);
    }
    CannonManager.setLinearVelocity = setLinearVelocity;
    function applyImpulse(index, pos, targetPos, strength) {
        setMessages([
            10,
            25,
            index,
            pos.x,
            pos.y,
            pos.z,
            targetPos.x,
            targetPos.y,
            targetPos.z,
            strength
        ]);
    }
    CannonManager.applyImpulse = applyImpulse;
    function resetVelocity(index) {
        setMessages([
            3,
            26,
            index
        ]);
    }
    CannonManager.resetVelocity = resetVelocity;
    function stop() {
        renderFlag = false;
        setMessages([2, 27]);
    }
    CannonManager.stop = stop;
    function start() {
        renderFlag = true;
        setMessages([2, 28]);
    }
    CannonManager.start = start;
    function setSizeArray(mesh, array) {
        var size = MeshManager.getSize(mesh);
        array.push(size.x);
        array.push(size.y);
        array.push(size.z);
    }
    function setPosArray(mesh, array) {
        var pos = mesh.position.clone();
        array.push(pos.x);
        array.push(pos.y);
        array.push(pos.z);
    }
    function setQuaternionArray(mesh, array) {
        var q = mesh.quaternion;
        array.push(q.x);
        array.push(q.y);
        array.push(q.z);
        array.push(q.w);
    }
    function animate() {
        if (Vars.jointCatchFlag) {
        }
    }
})(CannonManager || (CannonManager = {}));
var PhysicsManager;
var Main = (function () {
    function Main() {
        this.setStageProperty();
        if (Detector.webgl && Worker) {
            PixiManager.assetsLoad();
            this.setPhysicsManager();
            PhysicsManager.init(this.physicsInitComp.bind(this));
            AssetManager.init();
            Vars.setAnimateFunc(this.animate.bind(this));
            window.onresize = this.resize.bind(this);
        }
        else {
            $('#title .loading-container').fadeOut(500);
            $('#title p').html('この環境ではプレイできません。<br>WebGLとWebWorkerが必要です。<br><br>It cannot play in this environment.<br>WebGL and WebWorker are required. ');
        }
    }
    Main.prototype.setPhysicsManager = function () {
        switch (browser) {
            case 'ie':
                PhysicsManager = AmmoManager;
                break;
            case 'chrome':
                PhysicsManager = CannonManager;
                break;
            case 'safari':
                PhysicsManager = CannonManager;
                break;
            case 'firefox':
                PhysicsManager = AmmoManager;
                break;
            case 'opera':
                PhysicsManager = AmmoManager;
                break;
        }
    };
    Main.prototype.physicsInitComp = function () {
        Vars.init();
        this.pixiAssetLoadCompCheck();
    };
    Main.prototype.pixiAssetLoadCompCheck = function () {
        if (!PixiManager.assetsLoadCompFlag) {
            setTimeout(function () {
                this.pixiAssetLoadCompCheck();
            }.bind(this), 500);
            return;
        }
        DomManager.init(this.qualitySelectComp.bind(this), PixiManager.init);
        SoundManager.init();
    };
    Main.prototype.qualitySelectComp = function (quality) {
        Vars.quality = quality;
        this.assetLoadCheck();
    };
    Main.prototype.assetLoadCheck = function () {
        setTimeout(function () {
            if (AssetManager.loadCompFlag) {
                this.assetLoadComp();
            }
            else {
                this.assetLoadCheck();
            }
        }.bind(this), 500);
    };
    Main.prototype.assetLoadComp = function () {
        this.threeView = new ThreeView();
        if (platform == 'pc') {
            document.onmousemove = this.mouseMoveHandler.bind(this);
            document.onmousedown = this.mouseDownHandler.bind(this);
            document.onmouseup = this.mouseUpHandler.bind(this);
            document.oncontextmenu = this.rightClickHandler.bind(this);
        }
        else {
            document.addEventListener('touchstart', this.touchStartHandler, false);
            document.addEventListener('touchmove', this.touchMoveHandler, false);
            document.addEventListener('touchend', this.touchEndHandler, false);
        }
        window.onkeydown = this.keyDown.bind(this);
        window.onkeyup = this.keyUp.bind(this);
        window.onbeforeunload = this.reload.bind(this);
        window.onblur = this.blur.bind(this);
        window.onfocus = this.focus.bind(this);
    };
    Main.prototype.mouseMoveHandler = function (e) {
        Vars.mouseMove(e);
    };
    Main.prototype.mouseDownHandler = function (e) {
        Vars.mouseDown();
    };
    Main.prototype.mouseUpHandler = function (e) {
        Vars.mouseUp();
    };
    Main.prototype.rightClickHandler = function (e) {
        e.preventDefault();
        Vars.rightClick();
    };
    Main.prototype.touchStartHandler = function (e) {
        if (e.touches.length == 2) {
            Vars.rightClick(e);
        }
        else {
            Vars.mouseDown(e);
        }
    };
    Main.prototype.touchEndHandler = function (e) {
        Vars.mouseUp();
    };
    Main.prototype.touchMoveHandler = function (e) {
        e.preventDefault();
        Vars.mouseMove(e);
    };
    Main.prototype.keyDown = function (e) {
        e.preventDefault();
        if (e.keyCode === 37 || e.keyCode === 65) {
            Input.x = -1;
        }
        if (e.keyCode === 38 || e.keyCode === 87) {
            Input.z = 1;
        }
        if (e.keyCode === 39 || e.keyCode === 68) {
            Input.x = 1;
        }
        if (e.keyCode === 40 || e.keyCode === 83) {
            Input.z = -1;
        }
        if (e.keyCode === 32) {
            Input.y = 1;
        }
        if (e.keyCode === 16) {
            Input.run = true;
        }
        if (e.keyCode === 18) {
            Input.alt = true;
        }
        if (e.keyCode === 13) {
            Vars.enterDown();
        }
    };
    Main.prototype.keyUp = function (e) {
        e.preventDefault();
        if (e.keyCode === 37 || e.keyCode === 65) {
            Input.x = 0;
        }
        if (e.keyCode === 38 || e.keyCode === 87) {
            Input.z = 0;
        }
        if (e.keyCode === 39 || e.keyCode === 68) {
            Input.x = 0;
        }
        if (e.keyCode === 40 || e.keyCode === 83) {
            Input.z = 0;
        }
        if (e.keyCode === 32) {
            Input.y = 0;
        }
        if (e.keyCode === 16) {
            Input.run = false;
        }
        if (e.keyCode === 18) {
            Input.alt = false;
        }
    };
    Main.prototype.animate = function () {
        TWEEN.update();
    };
    Main.prototype.resize = function () {
        this.setStageProperty();
        Vars.resize();
    };
    Main.prototype.setStageProperty = function () {
        Vars.stageWidth = window.innerWidth;
        Vars.stageHeight = window.innerHeight;
        Vars.windowHalfX = Vars.stageWidth / 2;
        Vars.windowHalfY = Vars.stageHeight / 2;
    };
    Main.prototype.reload = function (e) {
        var e = e || window.event;
        if (this.threeView)
            this.threeView.reload();
    };
    Main.prototype.blur = function () {
        if (!Vars.inGameFlag)
            return;
        SoundManager.tweenVolume(0, 1000);
        Vars.renderFlag = false;
        MaterialManager.animateFlag = false;
        PhysicsManager.stop();
        PixiManager.stop();
    };
    Main.prototype.focus = function () {
        if (!Vars.inGameFlag)
            return;
        SoundManager.tweenVolume(1, 1000);
        Vars.renderFlag = true;
        MaterialManager.animateFlag = true;
        PhysicsManager.start();
        PixiManager.start();
    };
    return Main;
})();
var ua = navigator.userAgent.toLowerCase();
var browser = 'ie';
if (ua.indexOf('chrome') != -1) {
    browser = 'chrome';
}
else if (ua.indexOf('safari') != -1) {
    browser = 'safari';
}
else if (ua.indexOf('firefox') != -1) {
    browser = 'firefox';
}
else if (ua.indexOf('opera') != -1) {
    browser = 'opera';
}
ua = navigator.userAgent;
var twitterFlag = false;
if (ua.search(/Twitter/) != -1)
    twitterFlag = true;
var platform = 'pc';
if (ua.search(/iPhone/) != -1) {
    platform = "sp";
    document.write('<meta name="viewport" content="width=640,user-scalable=no,initial-scale=.5" />');
}
else if ((ua.search(/Android/) != -1) && (ua.search(/Mobile/) != -1)) {
    platform = "sp";
    document.write('<meta name="viewport" content="width=640,user-scalable=no,initial-scale=.5" />');
}
else if ((ua.search(/iPad/) != -1) || (ua.search(/Android/) != -1)) {
    platform = "ipad";
    document.write('<meta name="viewport" content="width=1040, user-scalable=no,initial-scale=.7" />');
}
window.onload = function () {
    var main = new Main();
};
$(window).ready(function () {
});
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EyeCatch = (function (_super) {
    __extends(EyeCatch, _super);
    function EyeCatch() {
        _super.call(this);
        this.tileContainerDefaultWidth = Vars.stageWidth;
        var bgTexture = PIXI.Texture.fromFrame('bg10');
        this.bg = new PIXI.Sprite(bgTexture);
        this.bg.width = Vars.stageWidth;
        this.bg.height = Vars.stageHeight;
        this.addChild(this.bg);
        this.titleBg = new PIXI.DisplayObjectContainer();
        this.titleBg.position.x = Vars.stageWidth * .5;
        this.titleBg.position.y = Vars.stageHeight * .5;
        this.titleBg.scale.y = 0;
        this.addChild(this.titleBg);
        var graphics = new PIXI.Graphics();
        graphics.position.x = -Vars.stageWidth * .5;
        graphics.position.y = -150;
        graphics.beginFill(0xffffff);
        graphics.drawRect(0, 0, Vars.stageWidth, 300);
        graphics.lineStyle(5, 0xfb7e73, 1);
        graphics.moveTo(0, 0);
        graphics.lineTo(Vars.stageWidth, 0);
        graphics.moveTo(0, 300);
        graphics.lineTo(Vars.stageWidth, 300);
        graphics.endFill();
        this.titleBg.addChild(graphics);
        this.title = new PIXI.Text('stage2', {
            font: '50px arista',
            fill: '#fc9188'
        });
        this.title.alpha = 0;
        this.addChild(this.title);
        this.resize();
        Vars.pushResizeFunc(this.resize.bind(this));
    }
    EyeCatch.prototype.show = function (stageNo) {
        this.visible = true;
        this.bg.alpha = 0;
        TweenManager.addTweenObj(this.bg, { alpha: 1 }, 1000, TWEEN.Easing.Linear.None, 0, this.showComp.bind(this));
        TweenManager.addTweenObj(this.titleBg.scale, { y: 1 }, 200, TWEEN.Easing.Linear.None, 800);
        this.title.setText('stage ' + stageNo);
        this.title.alpha = 0;
        TweenManager.addTweenObj(this.title, { alpha: 1 }, 200, TWEEN.Easing.Linear.None, 800);
    };
    EyeCatch.prototype.showComp = function () {
        setTimeout(function () {
            this.callBack('showComp');
        }.bind(this), 200);
    };
    EyeCatch.prototype.hide = function () {
        TweenManager.addTweenObj(this.titleBg.scale, { y: 0 }, 200, TWEEN.Easing.Linear.None);
        TweenManager.addTweenObj(this.title, { alpha: 0 }, 200, TWEEN.Easing.Linear.None);
        TweenManager.addTweenObj(this.bg, { alpha: 0 }, 1000, TWEEN.Easing.Linear.None, 500, this.hideComp.bind(this));
    };
    EyeCatch.prototype.hideComp = function () {
        this.visible = false;
        this.callBack('hideComp');
    };
    EyeCatch.prototype.resize = function () {
        var w = Vars.stageWidth;
        var h = Vars.stageHeight;
        this.bg.width = w;
        this.bg.height = h;
        this.titleBg.position.x = w * .5;
        this.titleBg.position.y = h * .5;
        this.titleBg.scale.x = w / this.tileContainerDefaultWidth;
        this.title.position.x = (w - this.title.width) * .5;
        this.title.position.y = (h - this.title.height) * .5;
    };
    return EyeCatch;
})(PIXI.DisplayObjectContainer);
var GameOverText = (function (_super) {
    __extends(GameOverText, _super);
    function GameOverText() {
        _super.call(this);
        this.texts = [];
        var gTexture = PIXI.Texture.fromFrame('font1' + 2);
        this.texts[0] = new PIXI.Sprite(gTexture);
        this.texts[0].width *= .5;
        this.texts[0].height *= .5;
        this.addChild(this.texts[0]);
        var aTexture = PIXI.Texture.fromFrame('font1' + 0);
        this.texts[1] = new PIXI.Sprite(aTexture);
        this.texts[1].position.x = 109;
        this.texts[1].width *= .5;
        this.texts[1].height *= .5;
        this.addChild(this.texts[1]);
        var mTexture = PIXI.Texture.fromFrame('font1' + 3);
        this.texts[2] = new PIXI.Sprite(mTexture);
        this.texts[2].position.x = 217;
        this.texts[2].width *= .5;
        this.texts[2].height *= .5;
        this.addChild(this.texts[2]);
        var eTexture = PIXI.Texture.fromFrame('font1' + 1);
        this.texts[3] = new PIXI.Sprite(eTexture);
        this.texts[3].position.x = 357;
        this.texts[3].width *= .5;
        this.texts[3].height *= .5;
        this.addChild(this.texts[3]);
        var oTexture = PIXI.Texture.fromFrame('font1' + 4);
        this.texts[4] = new PIXI.Sprite(oTexture);
        this.texts[4].position.x = 470;
        this.texts[4].width *= .5;
        this.texts[4].height *= .5;
        this.addChild(this.texts[4]);
        var vTexture = PIXI.Texture.fromFrame('font1' + 9);
        this.texts[5] = new PIXI.Sprite(vTexture);
        this.texts[5].position.x = 582;
        this.texts[5].width *= .5;
        this.texts[5].height *= .5;
        this.addChild(this.texts[5]);
        var eTexture2 = PIXI.Texture.fromFrame('font1' + 1);
        this.texts[6] = new PIXI.Sprite(eTexture2);
        this.texts[6].position.x = 695;
        this.texts[6].width *= .5;
        this.texts[6].height *= .5;
        this.addChild(this.texts[6]);
        var rTexture = PIXI.Texture.fromFrame('font1' + 6);
        this.texts[7] = new PIXI.Sprite(rTexture);
        this.texts[7].position.x = 773;
        this.texts[7].width *= .5;
        this.texts[7].height *= .5;
        this.addChild(this.texts[7]);
    }
    GameOverText.prototype.show = function () {
        this.visible = true;
        var length = this.texts.length;
        for (var i = 0; i < length; i++) {
            this.texts[i].alpha = 0;
            TweenManager.addTweenObj(this.texts[i], { alpha: 1 }, 500, TWEEN.Easing.Linear.None, i * 100);
        }
    };
    GameOverText.prototype.hide = function (callBack) {
        if (callBack === void 0) { callBack = null; }
        this.hideCallBack = callBack;
        var length = this.texts.length;
        for (var i = 0; i < length; i++) {
            TweenManager.addTweenObj(this.texts[i], { alpha: 0 }, 200, TWEEN.Easing.Linear.None, i * 50);
        }
        setTimeout(this.hideComp.bind(this), 900);
    };
    GameOverText.prototype.hideComp = function () {
        this.visible = false;
        if (this.hideCallBack)
            this.hideCallBack();
    };
    return GameOverText;
})(PIXI.SpriteBatch);
var Loading = (function (_super) {
    __extends(Loading, _super);
    function Loading() {
        _super.call(this);
        this.bgDefaultWidth = Vars.stageWidth;
        this.bgDefaultHeight = Vars.stageHeight;
        this.alpha = 1;
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000);
        this.bg.drawRect(0, 0, Vars.stageWidth, Vars.stageHeight);
        this.bg.endFill();
        this.addChild(this.bg);
        var spriteSheet = [];
        for (var i = 0; i < 24; i += Vars.fpsStep) {
            var texture = PIXI.Texture.fromFrame("loading1" + i);
            spriteSheet.push(texture);
        }
        ;
        this.circle = new PIXI.MovieClip(spriteSheet);
        this.circle.position.x = Vars.stageWidth * .5 - 12;
        this.circle.position.y = Vars.stageHeight * .5 - 12;
        this.circle.play();
        this.addChild(this.circle);
        this.resize();
        Vars.pushResizeFunc(this.resize.bind(this));
    }
    Loading.prototype.hide = function (easingFlag) {
        if (easingFlag === void 0) { easingFlag = false; }
        if (easingFlag) {
            TweenManager.addTweenObj(this, { alpha: 0 }, 1000, TWEEN.Easing.Linear.None, 0, this.hideComp.bind(this));
        }
        else {
            this.visible = false;
        }
    };
    Loading.prototype.hideComp = function () {
        this.visible = false;
    };
    Loading.prototype.resize = function () {
        if (!this.visible)
            return;
        this.circle.position.x = Vars.stageWidth * .5 - 12;
        this.circle.position.y = Vars.stageHeight * .5 - 12;
        this.bg.scale.x = Vars.stageWidth / this.bgDefaultWidth;
        this.bg.scale.y = Vars.stageHeight / this.bgDefaultHeight;
    };
    return Loading;
})(PIXI.DisplayObjectContainer);
var PauseCover = (function (_super) {
    __extends(PauseCover, _super);
    function PauseCover() {
        _super.call(this);
        this.defaultWidth = 0;
        this.defaultHeight = 0;
        this.visibleFlag = false;
        this.alpha = 0;
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000);
        this.bg.drawRect(0, 0, Vars.stageWidth, Vars.stageHeight);
        this.bg.endFill();
        this.bg.alpha = .5;
        this.addChild(this.bg);
        this.defaultWidth = Vars.stageWidth;
        this.defaultHeight = Vars.stageHeight;
        this.text = new PauseText();
        this.text.visible = false;
        this.addChild(this.text);
        this.resize();
        Vars.pushResizeFunc(this.resize.bind(this));
    }
    PauseCover.prototype.show = function () {
        if (!this.visibleFlag) {
            this.visibleFlag = true;
            this.visible = true;
            TweenManager.addTweenObj(this, { alpha: 1 }, 500, TWEEN.Easing.Linear.None);
            if (!Vars.gameOverFlag)
                this.text.show();
        }
    };
    PauseCover.prototype.hide = function () {
        if (this.visibleFlag) {
            this.visibleFlag = false;
            if (!Vars.gameOverFlag)
                this.text.hide();
            TweenManager.addTweenObj(this, { alpha: 0 }, 200, TWEEN.Easing.Linear.None, 600, this.hideComp.bind(this));
        }
    };
    PauseCover.prototype.hideComp = function () {
        this.visible = false;
    };
    PauseCover.prototype.resize = function () {
        this.bg.scale.x = Vars.stageWidth / this.defaultWidth;
        this.bg.scale.y = Vars.stageHeight / this.defaultHeight;
        this.text.position.x = (Vars.stageWidth - 425) * .5;
        this.text.position.y = (Vars.stageHeight - 130) * .5;
    };
    return PauseCover;
})(PIXI.DisplayObjectContainer);
var PauseText = (function (_super) {
    __extends(PauseText, _super);
    function PauseText() {
        _super.call(this);
        this.texts = [];
        var spriteSheet = [];
        var pTexture = PIXI.Texture.fromFrame('font1' + 5);
        var p = new PIXI.Sprite(pTexture);
        p.width *= .5;
        p.height *= .5;
        this.texts.push(p);
        this.addChild(p);
        var aTexture = PIXI.Texture.fromImage('font1' + 0);
        var a = new PIXI.Sprite(aTexture);
        a.position.x = 60;
        a.width *= .5;
        a.height *= .5;
        this.texts.push(a);
        this.addChild(a);
        var uTexture = PIXI.Texture.fromFrame('font1' + 8);
        var u = new PIXI.Sprite(uTexture);
        u.position.x = 170;
        u.width *= .5;
        u.height *= .5;
        this.texts.push(u);
        this.addChild(u);
        var sTexture = PIXI.Texture.fromFrame('font1' + 7);
        var s = new PIXI.Sprite(sTexture);
        s.position.x = 270;
        s.width *= .5;
        s.height *= .5;
        this.texts.push(s);
        this.addChild(s);
        var eTexture = PIXI.Texture.fromFrame('font1' + 1);
        var e = new PIXI.Sprite(eTexture);
        e.position.x = 370;
        e.width *= .5;
        e.height *= .5;
        this.texts.push(e);
        this.addChild(e);
    }
    PauseText.prototype.show = function () {
        this.visible = true;
        var length = this.texts.length;
        for (var i = 0; i < length; i++) {
            this.texts[i].alpha = 0;
            TweenManager.addTweenObj(this.texts[i], { alpha: 1 }, 500, TWEEN.Easing.Linear.None, i * 100);
        }
    };
    PauseText.prototype.hide = function (callBack) {
        if (callBack === void 0) { callBack = null; }
        this.hideCallBack = callBack;
        var length = this.texts.length;
        for (var i = 0; i < length; i++) {
            TweenManager.addTweenObj(this.texts[i], { alpha: 0 }, 200, TWEEN.Easing.Linear.None, i * 50);
        }
        if (this.hideCallBack)
            setTimeout(this.hideCallBack.bind(this), 900);
    };
    PauseText.prototype.hideComp = function () {
        this.visible = false;
        if (this.hideCallBack)
            this.hideCallBack();
    };
    return PauseText;
})(PIXI.SpriteBatch);
var PixiAssetManager;
(function (PixiAssetManager) {
    var callBack;
    function init(_callBack) {
        callBack = _callBack;
        var assetsToLoader = ['assets/pixi/pixi_assets.json'];
        var loader = new PIXI.AssetLoader(assetsToLoader, false);
        loader.onComplete = onAssetsLoaded.bind(this);
        loader.load();
    }
    PixiAssetManager.init = init;
    function onAssetsLoaded() {
        callBack();
    }
})(PixiAssetManager || (PixiAssetManager = {}));
var PixiManager;
(function (PixiManager) {
    var stage = new PIXI.Stage(0x000000);
    var renderer;
    PixiManager.assetsLoadCompFlag = false;
    PixiManager.loading;
    PixiManager.eyeCatch;
    PixiManager.time;
    PixiManager.pauseCover;
    PixiManager.pixiParticle2;
    PixiManager.gameOverText;
    PixiManager.stageClearText;
    PixiManager.stageStartText;
    function assetsLoad() {
        PixiAssetManager.init(assetsLoadComp.bind(this));
    }
    PixiManager.assetsLoad = assetsLoad;
    function assetsLoadComp() {
        PixiManager.assetsLoadCompFlag = true;
    }
    function init() {
        if (!PixiManager.assetsLoadCompFlag) {
            setTimeout(init.bind(this), 1000);
            return;
        }
        renderer = PIXI.autoDetectRenderer(800, 600, null, true, true);
        $('#container').after(renderer.view);
        PixiManager.time = new Time();
        PixiManager.time.position.x = Vars.stageWidth * .5;
        PixiManager.time.position.y = 20;
        if (platform != 'pc')
            PixiManager.time.position.y = 10;
        PixiManager.time.visible = false;
        stage.addChild(PixiManager.time);
        PixiManager.pauseCover = new PauseCover();
        PixiManager.pauseCover.visible = false;
        stage.addChild(PixiManager.pauseCover);
        PixiManager.pixiParticle2 = new PixiParticle2();
        stage.addChild(PixiManager.pixiParticle2);
        PixiManager.gameOverText = new GameOverText();
        PixiManager.gameOverText.visible = false;
        stage.addChild(PixiManager.gameOverText);
        PixiManager.stageClearText = new StageClearText();
        PixiManager.stageClearText.visible = false;
        stage.addChild(PixiManager.stageClearText);
        PixiManager.stageStartText = new StageStartText();
        PixiManager.stageStartText.visible = false;
        stage.addChild(PixiManager.stageStartText);
        PixiManager.loading = new Loading();
        stage.addChild(PixiManager.loading);
        PixiManager.eyeCatch = new EyeCatch();
        stage.addChild(PixiManager.eyeCatch);
        PixiManager.eyeCatch.visible = false;
        Vars.setAnimateFunc(animate.bind(this));
        resize();
        Vars.pushResizeFunc(resize.bind(this));
    }
    PixiManager.init = init;
    function animate() {
        renderer.render(stage);
    }
    function resize() {
        PixiManager.time.position.x = (Vars.stageWidth - 62) * .5;
        if (platform != 'pc' && Vars.stageWidth < Vars.stageHeight) {
            PixiManager.time.position.x = Vars.stageWidth - 100;
        }
        PixiManager.gameOverText.position.x = (Vars.stageWidth - 840) * .5;
        PixiManager.gameOverText.position.y = (Vars.stageHeight - 130) * .5;
        PixiManager.stageClearText.position.x = (Vars.stageWidth - 792) * .5;
        PixiManager.stageClearText.position.y = (Vars.stageHeight - 280) * .5;
        PixiManager.stageStartText.position.x = (Vars.stageWidth - 792) * .5;
        PixiManager.stageStartText.position.y = (Vars.stageHeight - 280) * .5;
        renderer.resize(Vars.stageWidth, Vars.stageHeight);
    }
    function stop() {
        PixiManager.pauseCover.show();
        PixiManager.time.stop();
    }
    PixiManager.stop = stop;
    function start() {
        PixiManager.pauseCover.hide();
        PixiManager.time.start();
    }
    PixiManager.start = start;
})(PixiManager || (PixiManager = {}));
var PixiParticle1 = (function (_super) {
    __extends(PixiParticle1, _super);
    function PixiParticle1() {
        _super.call(this);
        this.particles = [];
        this.speed = 24;
        var spriteSheet = [];
        for (var i = 0; i < 20; i++) {
            var texture = PIXI.Texture.fromFrame("particle1" + i);
            spriteSheet.push(texture);
        }
        ;
        for (var i = 0; i < 100; i++) {
            var particle = new PixiParticleBaseMovie(spriteSheet);
            particle.position.x = Vars.stageWidth * .5;
            particle.position.y = Vars.stageHeight * .5;
            particle.scale.x = particle.scale.y = 3 * Math.random();
            particle.speed = new THREE.Vector2((this.speed * Math.random() - this.speed * .5) * Vars.fpsStep, (this.speed * Math.random() - this.speed * .5) * Vars.fpsStep);
            particle.blendMode = PIXI.blendModes.SCREEN;
            particle.play();
            this.particles.push(particle);
            this.addChild(particle);
        }
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    PixiParticle1.prototype.show = function () {
        this.visible = true;
        this.alpha = 0;
        TweenManager.addTweenObj(this, { alpha: 1 }, 500, TWEEN.Easing.Linear.None);
    };
    PixiParticle1.prototype.hide = function (callBack) {
        if (callBack === void 0) { callBack = null; }
        this.hideCallBack = callBack;
        TweenManager.addTweenObj(this, { alpha: 0 }, 500, TWEEN.Easing.Linear.None, 0, this.hideComp.bind(this));
    };
    PixiParticle1.prototype.hideComp = function () {
        this.visible = false;
        if (this.hideCallBack)
            this.hideCallBack();
    };
    PixiParticle1.prototype.animate = function () {
        if (!this.visible)
            return;
        for (var i = 0; i < 100; i++) {
            this.particles[i].position.x += this.particles[i].speed.x;
            if (this.particles[i].position.x > Vars.stageWidth)
                this.particles[i].position.x = Vars.stageWidth * .5;
            if (this.particles[i].position.x < -100)
                this.particles[i].position.x = Vars.stageWidth * .5;
            this.particles[i].position.y += this.particles[i].speed.y;
            if (this.particles[i].position.y > Vars.stageHeight)
                this.particles[i].position.y = Vars.stageHeight * .5;
            if (this.particles[i].position.y < -100)
                this.particles[i].position.y = Vars.stageHeight * .5;
        }
    };
    return PixiParticle1;
})(PIXI.DisplayObjectContainer);
var PixiParticle2 = (function (_super) {
    __extends(PixiParticle2, _super);
    function PixiParticle2() {
        _super.call(this);
        this.particles = [];
        this.speed = 24;
        for (var i = 0; i < 100; i++) {
            var texture = PIXI.Texture.fromFrame("star1" + Math.floor(3.9 * Math.random()));
            var particle = new PixiParticleBaseSprite(texture);
            particle.position.x = Vars.stageWidth * .5 - 100;
            particle.position.y = Vars.stageHeight * .5 - 100;
            particle.scale.x = particle.scale.y = 1.5 * Math.random();
            particle.w = particle.width;
            particle.h = particle.height;
            particle.speed = new THREE.Vector2((this.speed * Math.random() - this.speed * .5) * Vars.fpsStep, (this.speed * Math.random() - this.speed * .5) * Vars.fpsStep);
            particle.blendMode = PIXI.blendModes.SCREEN;
            this.particles.push(particle);
            this.addChild(particle);
        }
        Vars.setAnimateFunc(this.animate.bind(this));
        setTimeout(function () {
            this.visible = false;
        }.bind(this), 500);
    }
    PixiParticle2.prototype.show = function () {
        this.visible = true;
        this.alpha = 0;
        TweenManager.addTweenObj(this, { alpha: 1 }, 500, TWEEN.Easing.Linear.None);
    };
    PixiParticle2.prototype.hide = function (callBack) {
        if (callBack === void 0) { callBack = null; }
        this.hideCallBack = callBack;
        TweenManager.addTweenObj(this, { alpha: 0 }, 500, TWEEN.Easing.Linear.None, 0, this.hideComp.bind(this));
    };
    PixiParticle2.prototype.hideComp = function () {
        this.visible = false;
        if (this.hideCallBack)
            this.hideCallBack();
    };
    PixiParticle2.prototype.animate = function () {
        if (!this.visible)
            return;
        for (var i = 0; i < 100; i++) {
            this.particles[i].position.x += this.particles[i].speed.x;
            if (this.particles[i].position.x > Vars.stageWidth)
                this.particles[i].position.x = Vars.stageWidth * .5 - 100;
            if (this.particles[i].position.x < -this.particles[i].w)
                this.particles[i].position.x = Vars.stageWidth * .5 - 100;
            this.particles[i].position.y += this.particles[i].speed.y;
            if (this.particles[i].position.y > Vars.stageHeight)
                this.particles[i].position.y = Vars.stageHeight * .5 - 100;
            if (this.particles[i].position.y < -this.particles[i].h)
                this.particles[i].position.y = Vars.stageHeight * .5 - 100;
        }
    };
    return PixiParticle2;
})(PIXI.DisplayObjectContainer);
var PixiParticleBaseMovie = (function (_super) {
    __extends(PixiParticleBaseMovie, _super);
    function PixiParticleBaseMovie(textures) {
        _super.call(this, textures);
        this.speed = new THREE.Vector2();
    }
    return PixiParticleBaseMovie;
})(PIXI.MovieClip);
var PixiParticleBaseSprite = (function (_super) {
    __extends(PixiParticleBaseSprite, _super);
    function PixiParticleBaseSprite(texture) {
        _super.call(this, texture);
        this.speed = new THREE.Vector2();
        this.w = 0;
        this.h = 0;
    }
    return PixiParticleBaseSprite;
})(PIXI.Sprite);
var StageClearText = (function (_super) {
    __extends(StageClearText, _super);
    function StageClearText() {
        _super.call(this);
        this.texts = [];
        var sTexture = PIXI.Texture.fromFrame('font2' + 0);
        var s = new PIXI.Sprite(sTexture);
        this.texts.push(s);
        this.addChild(s);
        var tTexture = PIXI.Texture.fromImage('font2' + 1);
        var t = new PIXI.Sprite(tTexture);
        t.position.x = 70;
        this.texts.push(t);
        this.addChild(t);
        var aTexture = PIXI.Texture.fromFrame('font2' + 2);
        var a = new PIXI.Sprite(aTexture);
        a.position.x = 137;
        this.texts.push(a);
        this.addChild(a);
        var gTexture = PIXI.Texture.fromFrame('font2' + 3);
        var g = new PIXI.Sprite(gTexture);
        g.position.x = 213;
        this.texts.push(g);
        this.addChild(g);
        var eTexture = PIXI.Texture.fromFrame('font2' + 4);
        var e = new PIXI.Sprite(eTexture);
        e.position.x = 289;
        this.texts.push(e);
        this.addChild(e);
        var cTexture = PIXI.Texture.fromFrame('font2' + 5);
        var c = new PIXI.Sprite(cTexture);
        c.position.x = 408;
        this.texts.push(c);
        this.addChild(c);
        var lTexture = PIXI.Texture.fromImage('font2' + 6);
        var l = new PIXI.Sprite(lTexture);
        l.position.x = 477;
        this.texts.push(l);
        this.addChild(l);
        var e = new PIXI.Sprite(eTexture);
        e.position.x = 546;
        this.texts.push(e);
        this.addChild(e);
        var a = new PIXI.Sprite(aTexture);
        a.position.x = 619;
        this.texts.push(a);
        this.addChild(a);
        var rTexture = PIXI.Texture.fromFrame('font2' + 7);
        var r = new PIXI.Sprite(rTexture);
        r.position.x = 696;
        this.texts.push(r);
        this.addChild(r);
        var bikkuriTexture = PIXI.Texture.fromFrame('font2' + 8);
        var bikkuri = new PIXI.Sprite(bikkuriTexture);
        bikkuri.position.x = 770;
        this.texts.push(bikkuri);
        this.addChild(bikkuri);
    }
    StageClearText.prototype.show = function () {
        this.visible = true;
        var length = this.texts.length;
        for (var i = 0; i < length; i++) {
            this.texts[i].alpha = 0;
            this.texts[i].y = -Vars.stageHeight * .5;
            TweenManager.addTweenObj(this.texts[i], { alpha: 1 }, 200, TWEEN.Easing.Back.Out, i * 50);
            TweenManager.addTweenObj(this.texts[i].position, { y: 0 }, 200, TWEEN.Easing.Linear.None, i * 50);
        }
    };
    StageClearText.prototype.hide = function (callBack) {
        if (callBack === void 0) { callBack = null; }
        this.hideCallBack = callBack;
        var length = this.texts.length;
        for (var i = 0; i < length; i++) {
            TweenManager.addTweenObj(this.texts[i], { alpha: 0 }, 200, TWEEN.Easing.Linear.None, i * 50);
            TweenManager.addTweenObj(this.texts[i].position, { y: Vars.stageHeight * 5 }, 600, TWEEN.Easing.Linear.None, i * 50);
        }
        if (this.hideCallBack)
            setTimeout(this.hideCallBack.bind(this), 900);
    };
    StageClearText.prototype.hideComp = function () {
        this.visible = false;
        if (this.hideCallBack)
            this.hideCallBack();
    };
    return StageClearText;
})(PIXI.SpriteBatch);
var StageStartText = (function (_super) {
    __extends(StageStartText, _super);
    function StageStartText() {
        _super.call(this);
        this.texts = [];
        var sTexture = PIXI.Texture.fromFrame('font2' + 0);
        var s = new PIXI.Sprite(sTexture);
        this.texts.push(s);
        this.addChild(s);
        var tTexture = PIXI.Texture.fromImage('font2' + 1);
        var t = new PIXI.Sprite(tTexture);
        t.position.x = 70;
        this.texts.push(t);
        this.addChild(t);
        var aTexture = PIXI.Texture.fromFrame('font2' + 2);
        var a = new PIXI.Sprite(aTexture);
        a.position.x = 137;
        this.texts.push(a);
        this.addChild(a);
        var gTexture = PIXI.Texture.fromFrame('font2' + 3);
        var g = new PIXI.Sprite(gTexture);
        g.position.x = 213;
        this.texts.push(g);
        this.addChild(g);
        var eTexture = PIXI.Texture.fromFrame('font2' + 4);
        var e = new PIXI.Sprite(eTexture);
        e.position.x = 289;
        this.texts.push(e);
        this.addChild(e);
        var s = new PIXI.Sprite(sTexture);
        s.position.x = 408;
        this.texts.push(s);
        this.addChild(s);
        var t = new PIXI.Sprite(tTexture);
        t.position.x = 477;
        this.texts.push(t);
        this.addChild(t);
        var a = new PIXI.Sprite(aTexture);
        a.position.x = 546;
        this.texts.push(a);
        this.addChild(a);
        var rTexture = PIXI.Texture.fromFrame('font2' + 7);
        var r = new PIXI.Sprite(rTexture);
        r.position.x = 619;
        this.texts.push(r);
        this.addChild(r);
        var t = new PIXI.Sprite(tTexture);
        t.position.x = 696;
        this.texts.push(t);
        this.addChild(t);
        var bikkuriTexture = PIXI.Texture.fromFrame('font2' + 8);
        var bikkuri = new PIXI.Sprite(bikkuriTexture);
        bikkuri.position.x = 770;
        this.texts.push(bikkuri);
        this.addChild(bikkuri);
    }
    StageStartText.prototype.show = function () {
        this.visible = true;
        var length = this.texts.length;
        for (var i = 0; i < length; i++) {
            this.texts[i].alpha = 0;
            this.texts[i].y = -Vars.stageHeight * .5;
            TweenManager.addTweenObj(this.texts[i], { alpha: 1 }, 200, TWEEN.Easing.Back.Out, i * 50);
            TweenManager.addTweenObj(this.texts[i].position, { y: 0 }, 200, TWEEN.Easing.Linear.None, i * 50);
        }
    };
    StageStartText.prototype.hide = function (callBack) {
        if (callBack === void 0) { callBack = null; }
        this.hideCallBack = callBack;
        var length = this.texts.length;
        for (var i = 0; i < length; i++) {
            TweenManager.addTweenObj(this.texts[i], { alpha: 0 }, 200, TWEEN.Easing.Linear.None, i * 50);
            TweenManager.addTweenObj(this.texts[i].position, { y: Vars.stageHeight * 5 }, 600, TWEEN.Easing.Linear.None, i * 50);
        }
        if (this.hideCallBack)
            setTimeout(this.hideCallBack.bind(this), 900);
    };
    StageStartText.prototype.hideComp = function () {
        this.visible = false;
        if (this.hideCallBack)
            this.hideCallBack();
    };
    return StageStartText;
})(PIXI.SpriteBatch);
var Time = (function (_super) {
    __extends(Time, _super);
    function Time() {
        _super.call(this);
        this.time = 99;
        this.pauseFlag = false;
        var bgTexture = PIXI.Texture.fromFrame('timeBg10');
        this.bg = new PIXI.Sprite(bgTexture);
        this.bg.position.x = -6;
        this.bg.position.y = 60;
        if (platform != 'pc')
            this.bg.position.y = 70;
        this.bg.width = 76;
        this.bg.height = 7;
        this.addChild(this.bg);
        this.text = new PIXI.Text('99', {
            font: '70px arbonnie',
            fill: '#ffffff'
        });
        this.addChild(this.text);
        setInterval(this.timer.bind(this), 1000);
        this.stop();
    }
    Time.prototype.start = function (resetFlag) {
        if (resetFlag === void 0) { resetFlag = false; }
        if (resetFlag) {
            this.time = 99;
            this.text.setText(99 + '');
        }
        this.pauseFlag = false;
    };
    Time.prototype.stop = function () {
        this.pauseFlag = true;
    };
    Time.prototype.pause = function () {
        if (this.pauseFlag) {
            this.pauseFlag = false;
        }
        else {
            this.pauseFlag = true;
        }
    };
    Time.prototype.timer = function () {
        if (this.pauseFlag || this.time == 0)
            return;
        this.time--;
        if (this.time < 1) {
            this.time = 0;
            this.pauseFlag = true;
            StageManager.gameOver();
        }
        var str = this.time + '';
        if (this.time < 10)
            str = '0' + this.time;
        this.text.setText(str);
    };
    return Time;
})(PIXI.DisplayObjectContainer);
var SoundManager;
(function (SoundManager) {
    var assetsPath = "assets/sound/";
    var manifest = [];
    var preload;
    var instanceHash = {};
    var volumeObj = { volume: 1 };
    var tweenTargetVolume = 0;
    var pauseFlag = false;
    SoundManager.mainMusicId = -1;
    SoundManager.mainMusicVolume = .7;
    function init() {
        manifest = [
            { src: "main.mp3", type: "sound", id: 1, data: 1, successFlag: true },
            { src: "button_ok_019.mp3", type: "sound", id: 2, data: 1, successFlag: true },
            { src: "button_select_015.mp3", type: "sound", id: 3, data: 1, successFlag: true },
            { src: "Powerup30.mp3", type: "sound", id: 4, data: 1, successFlag: true },
            { src: "Powerup39.mp3", type: "sound", id: 5, data: 1, successFlag: true },
            { src: "button_016.mp3", type: "sound", id: 6, data: 1, successFlag: true },
            { src: "Pickup_Coin23.mp3", type: "sound", id: 7, data: 1, successFlag: true },
            { src: "SE_07.mp3", type: "sound", id: 8, data: 1, successFlag: true },
            { src: "run.mp3", type: "sound", id: 9, data: 1, successFlag: true }
        ];
        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.addEventListener("fileload", createjs.proxy(soundLoaded, this));
        createjs.Sound.registerManifest(manifest, assetsPath);
    }
    SoundManager.init = init;
    function soundLoaded(event) {
        console.log("sound load comp");
    }
    function stop() {
        if (preload != null) {
            preload.close();
        }
        createjs.Sound.stop();
    }
    SoundManager.stop = stop;
    function play(id, loopFlag, volume, offset) {
        if (volume === void 0) { volume = 1; }
        if (offset === void 0) { offset = 0; }
        var loop = 0;
        if (loopFlag)
            loop = -1;
        var instance = createjs.Sound.createInstance(id + '');
        if (!instance || instance.playState == createjs.Sound.PLAY_FAILED) {
            console.log("sound play failed");
            return;
        }
        else {
            instance.play(createjs.Sound.INTERRUPT_NONE, 0, offset, loop);
            instanceHash[instance.uniqueId] = {};
            instanceHash[instance.uniqueId].instance = instance;
            instanceHash[instance.uniqueId].loopFlag = loopFlag;
            instanceHash[instance.uniqueId].id = id;
            instance.addEventListener("succeeded", createjs.proxy(playSuccess, instance));
            instance.addEventListener("interrupted", createjs.proxy(playFailed, instance));
            instance.addEventListener("failed", createjs.proxy(playFailed, instance));
            instance.addEventListener("complete", createjs.proxy(soundComplete, instance));
        }
        return instance.uniqueId;
    }
    SoundManager.play = play;
    function playSuccess(e) {
        var instance = e.target;
    }
    function playFailed(e) {
        var instance = e.target;
        instance.removeAllEventListeners();
        delete (instanceHash[instance.uniqueId].instance);
    }
    function soundComplete(e) {
        var instance = e.target;
        instance.removeAllEventListeners();
    }
    function setInstanceVolume(id, volume) {
        if (instanceHash[id].instance.getVolume() == volume)
            return;
        instanceHash[id].instance.setVolume(volume);
    }
    SoundManager.setInstanceVolume = setInstanceVolume;
    function pause(id) {
        if (instanceHash[id].instance)
            instanceHash[id].instance.pause();
    }
    SoundManager.pause = pause;
    function resume(id) {
        if (instanceHash[id].instance)
            instanceHash[id].instance.resume();
    }
    SoundManager.resume = resume;
    function allPause() {
        pauseFlag = true;
        for (var id in instanceHash) {
            if (instanceHash[id].instance)
                instanceHash[id].instance.pause();
        }
    }
    SoundManager.allPause = allPause;
    function allResume() {
        pauseFlag = false;
        for (var id in instanceHash) {
            if (instanceHash[id].instance)
                instanceHash[id].instance.resume();
        }
    }
    SoundManager.allResume = allResume;
    function setVolume(volume) {
        createjs.Sound.setVolume(volume);
    }
    SoundManager.setVolume = setVolume;
    function tweenVolume(volume, time) {
        tweenTargetVolume = volume;
        if (volume != 0)
            allResume();
        new TWEEN.Tween(volumeObj).to({ volume: volume }, time).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(function () {
            createjs.Sound.setVolume(volumeObj.volume);
        }.bind(this)).onComplete(function (self) {
            if (tweenTargetVolume == 0) {
                allPause();
            }
        }.bind(this)).start();
    }
    SoundManager.tweenVolume = tweenVolume;
    function tweenInstanceVolume(id, volume, time) {
        if (!instanceHash[id].instance)
            return;
        volumeObj.volume = instanceHash[id].instance.getVolume();
        new TWEEN.Tween(volumeObj).to({ volume: volume }, time).easing(TWEEN.Easing.Linear.None).onUpdate((function (instance, volumeObj) {
            return function () {
                instance.setVolume(volumeObj.volume);
            };
        }.bind(this))(instanceHash[id].instance, volumeObj)).start();
    }
    SoundManager.tweenInstanceVolume = tweenInstanceVolume;
})(SoundManager || (SoundManager = {}));
var Action;
(function (Action) {
    var catcher;
    (function (catcher) {
        catcher.objects = {};
        function add(go, targets, catchDist) {
            var name = go.name;
            if (!catcher.objects[name])
                catcher.objects[name] = {};
            catcher.objects[name].go = go;
            catcher.objects[name].targets = targets;
            catcher.objects[name].targetsLength = targets.length;
            catcher.objects[name].catchDist = catchDist;
        }
        catcher.add = add;
        function search(name) {
            for (var i = 0; i < catcher.objects[name].targetsLength; i++) {
                if (!catcher.objects[name].go.catchingFlag && !catcher.objects[name].targets[i].catchFlag && !catcher.objects[name].go.deadFlag && !catcher.objects[name].targets[i].deadFlag) {
                    var dist = catcher.objects[name].go.position.clone().distanceTo(catcher.objects[name].targets[i].position.clone());
                    if (dist < catcher.objects[name].catchDist) {
                        catcher.objects[name].targets[i].setCatchCircle(true);
                        if (catcher.objects[name].targets[i].catchStandbyFlag) {
                            catcher.objects[name].targets[i].catchStandbyFlag = false;
                            catcher.objects[name].go.catchingFlag = true;
                            catcher.objects[name].targets[i].catchFlag = true;
                            catcher.objects[name].catchTarget = catcher.objects[name].targets[i];
                            catcher.objects[name].go.catcher(catcher.objects[name].targets[i]);
                        }
                    }
                    else {
                        catcher.objects[name].targets[i].setCatchCircle(false);
                    }
                }
            }
        }
        catcher.search = search;
        function release(name) {
            catcher.objects[name].go.catchingFlag = false;
            for (var i = 0; i < catcher.objects[name].targetsLength; i++)
                catcher.objects[name].targets[i].catchFlag = false;
            if (catcher.objects[name].go.catchTarget) {
                catcher.objects[name].go.catchTarget.catchFlag = false;
                catcher.objects[name].go.catchTarget = null;
            }
        }
        catcher.release = release;
    })(catcher = Action.catcher || (Action.catcher = {}));
})(Action || (Action = {}));
var AssetManager;
(function (AssetManager) {
    AssetManager.loadCompFlag = false;
    AssetManager.assets;
    AssetManager.playerGeometry;
    AssetManager.zakoGeometry;
    function init() {
        var url = 'assets/models/scene_test4.js';
        new LoadManager(url, 'scene', sceneLoadCompHandler.bind(this));
    }
    AssetManager.init = init;
    function sceneLoadCompHandler(result) {
        AssetManager.assets = result;
        for (var name in AssetManager.assets.objects) {
            if (AssetManager.assets.objects[name] instanceof THREE.Mesh && name.indexOf('Collision') == -1) {
                MeshManager.yUp(AssetManager.assets.objects[name]);
            }
        }
        var url = 'assets/models/player/player4.js';
        new LoadManager(url, 'json', playerModelLoadCompHandler.bind(this));
    }
    function playerModelLoadCompHandler(result) {
        AssetManager.playerGeometry = result.geometry;
        var url = 'assets/models/zako.js';
        new LoadManager(url, 'json', zakoModelLoadCompHandler.bind(this));
    }
    function zakoModelLoadCompHandler(result) {
        AssetManager.zakoGeometry = result.geometry;
        AssetManager.loadCompFlag = true;
    }
    function searchAssetsByName(_name) {
        var rigidMeshs = [];
        for (var name in AssetManager.assets.objects) {
            if (name.indexOf(_name) != -1) {
                rigidMeshs.push(MeshManager.duplicate(AssetManager.assets.objects[name]));
            }
        }
        return rigidMeshs;
    }
    AssetManager.searchAssetsByName = searchAssetsByName;
})(AssetManager || (AssetManager = {}));
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera(fov, aspect, near, far) {
        _super.call(this, fov, aspect, near, far);
        this.type = 'rotate';
        this.y = 4;
        this.radius = 5;
        this.cameraRot = 0;
        this.cameraTarget = new THREE.Object3D();
        this.cameraTargetDefault = new THREE.Object3D();
        this.speed = 10;
        this.loopTime = 60;
        this.position.set(0, this.y, -this.radius);
        this.lookAt(this.cameraTarget.position);
    }
    Camera.prototype.animate = function () {
        if (this.type == 'rotate') {
            this.cameraRot += .1;
            var radian = this.cameraRot * Vars.toRad;
            var x = Math.cos(radian) * this.radius;
            var z = Math.sin(radian) * this.radius;
            this.position.set(x, this.y, z);
            this.lookAt(this.cameraTarget.position);
        }
        else if ('spline') {
            CameraMove.spline.render();
        }
        else if ('standard') {
            this.position.z += .1;
        }
    };
    Camera.prototype.addMovePoints = function (_cameraMovePoints) {
        CameraMove.spline.init(_cameraMovePoints, this.loopTime);
    };
    return Camera;
})(THREE.PerspectiveCamera);
var CameraManager;
(function (CameraManager) {
    CameraManager.camera;
    CameraManager.initFlag = false;
    function init() {
        var fov = 45;
        var aspect = Vars.stageWidth / Vars.stageHeight;
        CameraManager.camera = new NekoCamera(fov, aspect, .1, 500);
        CameraManager.initFlag = true;
    }
    CameraManager.init = init;
    function animate() {
        CameraManager.camera.animate();
    }
    CameraManager.animate = animate;
    function addCameraMovePoints(_cameraMovePoints) {
        CameraManager.camera.addMovePoints(_cameraMovePoints);
    }
    CameraManager.addCameraMovePoints = addCameraMovePoints;
    function flip(type) {
        CameraManager.camera.flip(type);
    }
    CameraManager.flip = flip;
    function stageClear(callBack) {
        CameraManager.camera.stopFlag = true;
        var player = SceneManager.scene.getObjectByName('player', false);
        var pos = player.position.clone();
        pos.y += 3;
        var direction = new THREE.Vector3(0, .5, 1).normalize();
        pos.add(direction.clone().multiplyScalar(5));
        CameraManager.camera.position.copy(pos);
        var upDate = function () {
            CameraManager.camera.lookAt(player.position);
        };
        var targetPos = pos.clone().add(direction.clone().multiplyScalar(10));
        TweenManager.addTweenPosition(CameraManager.camera, targetPos, 3000, TWEEN.Easing.Cubic.Out, 0, callBack, upDate.bind(this));
    }
    CameraManager.stageClear = stageClear;
    function stageStart(callBack) {
        CameraManager.camera.stopFlag = true;
        var player = SceneManager.scene.getObjectByName('player', false);
        var pos = player.position.clone();
        pos.y += 1;
        var forward = ThreeManager.getForward(player.mesh).negate();
        var direction = forward.clone().add(new THREE.Vector3(0, .3, 0)).normalize();
        pos.add(direction.clone().multiplyScalar(4));
        CameraManager.camera.position.copy(pos);
        var upDate = function () {
            CameraManager.camera.lookAt(player.position);
        };
        var targetPos = pos.clone().add(direction.clone().multiplyScalar(5));
        TweenManager.addTweenPosition(CameraManager.camera, targetPos, 1000, TWEEN.Easing.Cubic.Out, 0, callBack, upDate.bind(this));
    }
    CameraManager.stageStart = stageStart;
})(CameraManager || (CameraManager = {}));
var CameraMove;
(function (CameraMove) {
    var autoRotate;
    (function (autoRotate) {
        var x = 0;
        autoRotate.y = 30;
        var z = 0;
        autoRotate.targetY = 30;
        autoRotate.rot = 90;
        autoRotate.targetRot = 90;
        autoRotate.radius = 11;
        autoRotate.targetRadius = 11;
        autoRotate.cameraTarget;
        autoRotate.defaultCameraTarget = new THREE.Object3D();
        autoRotate.speed = 50;
        autoRotate.loopFlag = false;
        var compFlag = false;
        var lastPos = new THREE.Vector3();
        var callBack;
        function init(_callBack) {
            if (_callBack === void 0) { _callBack = null; }
            callBack = _callBack;
            compFlag = false;
            autoRotate.rot = autoRotate.targetRot = 0;
            autoRotate.cameraTarget = autoRotate.defaultCameraTarget;
        }
        autoRotate.init = init;
        function distMove() {
            autoRotate.y += -(autoRotate.y - autoRotate.targetY) / 10;
            autoRotate.radius += -(autoRotate.radius - autoRotate.targetRadius) / 10;
        }
        function cameraRotate() {
            autoRotate.rot += -(autoRotate.rot - autoRotate.targetRot) / 10;
            var radian = autoRotate.rot * Vars.toRad;
            x = Math.cos(radian) * autoRotate.radius + autoRotate.cameraTarget.position.x;
            z = Math.sin(radian) * autoRotate.radius + autoRotate.cameraTarget.position.z;
        }
        function render() {
            if (compFlag) {
                return lastPos;
            }
            autoRotate.targetRot += autoRotate.speed * Vars.delta;
            if (autoRotate.targetRot > 360 && !autoRotate.loopFlag) {
                compFlag = true;
                if (callBack)
                    callBack();
                return lastPos;
            }
            distMove();
            cameraRotate();
            lastPos.set(x, autoRotate.y, z);
            return new THREE.Vector3(x, autoRotate.y, z);
        }
        autoRotate.render = render;
        function refresh() {
            autoRotate.y = autoRotate.targetY;
            autoRotate.radius = autoRotate.targetRadius;
            autoRotate.rot = autoRotate.targetRot;
            var radian = autoRotate.rot * Vars.toRad;
            x = Math.cos(radian) * autoRotate.radius + autoRotate.cameraTarget.position.x;
            z = Math.sin(radian) * autoRotate.radius + autoRotate.cameraTarget.position.z;
        }
        autoRotate.refresh = refresh;
    })(autoRotate = CameraMove.autoRotate || (CameraMove.autoRotate = {}));
})(CameraMove || (CameraMove = {}));
var CameraMove;
(function (CameraMove) {
    var closeUp;
    (function (closeUp) {
        var y = 7;
        var targetY = 7;
        var radius = 0;
        var targetRadius = 8;
        closeUp.cameraTarget = new THREE.Object3D();
        function distMove() {
            y += -(y - targetY) / 10;
            radius += -(radius - targetRadius) / 10;
        }
        function render(camera) {
            distMove();
            var direction = closeUp.cameraTarget.position.clone().sub(camera.position.clone()).normalize().negate();
            var pos = closeUp.cameraTarget.position.clone().add(direction.multiplyScalar(radius));
            pos.y = y;
            return pos;
        }
        closeUp.render = render;
    })(closeUp = CameraMove.closeUp || (CameraMove.closeUp = {}));
})(CameraMove || (CameraMove = {}));
var CameraMove;
(function (CameraMove) {
    var rotate;
    (function (rotate) {
        var x = 0;
        var y = 9;
        var z = 0;
        rotate.targetY = 9;
        var rot = 90;
        var targetRot = 90;
        var lastRot = 0;
        var radius = 11;
        rotate.targetRadius = 11;
        var direction = 1;
        rotate.cameraTarget;
        rotate.defaultCameraTarget = new THREE.Object3D();
        var radiusPluseFlag = false;
        function init() {
            rotate.cameraTarget = rotate.defaultCameraTarget;
            if (platform == 'pc') {
                Vars.pushMouseDownFunc(mouseDown.bind(this));
            }
            else {
                Vars.pushRightClickFunc(mouseDown.bind(this));
            }
            Vars.pushMouseUpFunc(mouseUp.bind(this));
            Vars.pushMouseMoveFunc(mouseMove.bind(this));
            cameraRotate();
        }
        rotate.init = init;
        function mouseDown() {
            lastRot = targetRot;
        }
        function mouseUp() {
        }
        function mouseMove() {
            if (platform != 'pc' && !Vars.multiTouchFlag)
                return;
            if (RaycastManager.downTarget) {
                var name = RaycastManager.downTarget.name;
                if (name.indexOf('ground') == -1)
                    return;
            }
            if (Vars.downFlag) {
                targetRot = lastRot + Vars.mouseDragOffsetX * 8 * Vars.delta;
            }
        }
        function distMove() {
            y += -(y - rotate.targetY) / 10;
            radius += -(radius - rotate.targetRadius) / 10;
        }
        function cameraRotate() {
            rot += -(rot - targetRot) / 10;
            var radian = rot * Vars.toRad;
            x = Math.cos(radian) * radius + rotate.cameraTarget.position.x;
            z = Math.sin(radian) * radius + rotate.cameraTarget.position.z;
        }
        function render() {
            if (Vars.mousePosition.distanceTo(Vars.lastMousePosition) != 0) {
                distMove();
                cameraRotate();
            }
            LightManager.setTargetPos(rotate.cameraTarget.position);
            return new THREE.Vector3(x, y, z);
        }
        rotate.render = render;
        function setTweenCameraTargetPos(targetPos) {
            rotate.cameraTarget = rotate.defaultCameraTarget;
            var upDate = function () {
                cameraRotate();
                distMove();
            };
            TweenManager.addTweenPosition(rotate.cameraTarget, targetPos, 500, TWEEN.Easing.Cubic.Out, 0, null, upDate.bind(this));
        }
        rotate.setTweenCameraTargetPos = setTweenCameraTargetPos;
        function setCameraTarget(target) {
            rotate.cameraTarget = target;
        }
        rotate.setCameraTarget = setCameraTarget;
        function pluseRadius(pluse) {
            if (rotate.targetRadius > 50)
                return;
            radiusPluseFlag = true;
            rotate.targetY += pluse;
            rotate.targetRadius += pluse;
            setTimeout(function () {
                radiusPluseFlag = false;
            }.bind(this), 1000);
        }
        rotate.pluseRadius = pluseRadius;
        function refresh() {
            y = rotate.targetY;
            radius = rotate.targetRadius;
            rot = targetRot;
            var radian = rot * Vars.toRad;
            x = Math.cos(radian) * radius + rotate.cameraTarget.position.x;
            z = Math.sin(radian) * radius + rotate.cameraTarget.position.z;
        }
        rotate.refresh = refresh;
    })(rotate = CameraMove.rotate || (CameraMove.rotate = {}));
})(CameraMove || (CameraMove = {}));
var CameraMove;
(function (CameraMove) {
    var spline;
    (function (spline) {
        var moveSpline;
        spline.startTime = 0;
        var loopTime;
        var loopFlag = false;
        var callBack;
        spline.compFlag = false;
        var lastPos = new THREE.Vector3();
        spline.cameraTarget = new THREE.Object3D();
        function init(movePoints, _loopTime, _loopFlag, _callBack) {
            if (_loopFlag === void 0) { _loopFlag = true; }
            if (_callBack === void 0) { _callBack = null; }
            moveSpline = new THREE.SplineCurve3(movePoints);
            loopTime = _loopTime;
            loopFlag = _loopFlag;
            callBack = _callBack;
            spline.startTime = Vars.elapsedTime;
            spline.compFlag = false;
        }
        spline.init = init;
        function render() {
            if (!moveSpline || spline.compFlag)
                return lastPos;
            var time = (Vars.elapsedTime - spline.startTime) * 1000;
            var t = (time % loopTime) / loopTime;
            if (time > loopTime && !loopFlag) {
                spline.compFlag = true;
                if (callBack)
                    callBack();
                return lastPos;
            }
            var pos = moveSpline.getPointAt(t);
            lastPos.copy(pos);
            return pos;
        }
        spline.render = render;
        function reset() {
            spline.compFlag = false;
            spline.startTime = Vars.elapsedTime;
        }
        spline.reset = reset;
    })(spline = CameraMove.spline || (CameraMove.spline = {}));
})(CameraMove || (CameraMove = {}));
var GlowCameraManager;
(function (GlowCameraManager) {
    GlowCameraManager.camera;
    function init() {
        var fov = 45;
        var aspect = Vars.stageWidth / Vars.stageHeight;
        GlowCameraManager.camera = new THREE.PerspectiveCamera(fov, aspect, 1, 200);
        GlowCameraManager.camera.position.set(0, 4, -7);
        GlowCameraManager.camera.lookAt(new THREE.Vector3());
        Vars.setAnimateFunc(animate.bind(this));
    }
    GlowCameraManager.init = init;
    function animate() {
        GlowCameraManager.camera.position.copy(CameraManager.camera.position);
        GlowCameraManager.camera.rotation = CameraManager.camera.rotation;
        GlowCameraManager.camera.lookAt(CameraManager.camera.cameraTarget.position);
    }
})(GlowCameraManager || (GlowCameraManager = {}));
var NekoCamera = (function (_super) {
    __extends(NekoCamera, _super);
    function NekoCamera(fov, aspect, near, far) {
        _super.call(this, fov, aspect, near, far);
        this.tweenFlag = false;
        this.stopFlag = true;
        CameraMove.rotate.init();
    }
    NekoCamera.prototype.opInit = function () {
        this.type = 'autoRotate';
        this.stopFlag = true;
        var length = StageManager.grounds.length;
        var minX = new THREE.Vector3();
        var maxX = new THREE.Vector3();
        var minZ = new THREE.Vector3();
        var maxZ = new THREE.Vector3();
        for (var i = 0; i < length; i++) {
            if (StageManager.grounds[i].addFlag) {
                var pos = StageManager.grounds[i].position.clone();
                if (minX.x > pos.x)
                    minX.copy(pos);
                if (maxX.x < pos.x)
                    maxX.copy(pos);
                if (minZ.z > pos.z)
                    minZ.copy(pos);
                if (maxZ.z < pos.z)
                    maxZ.copy(pos);
            }
        }
        var radiusX = Math.abs((maxX.x - minX.x) * .5);
        var radiusZ = Math.abs((maxZ.z - minZ.z) * .5);
        var radius = radiusX;
        if (radiusX < radiusZ)
            radius = radiusZ;
        radius += 30;
        CameraMove.autoRotate.init();
        CameraMove.autoRotate.speed = 50;
        CameraMove.autoRotate.loopFlag = false;
        CameraMove.autoRotate.y = CameraMove.autoRotate.targetY = 40;
        CameraMove.autoRotate.radius = CameraMove.autoRotate.targetRadius = radius;
        CameraMove.autoRotate.cameraTarget.position.set(minX.x + (maxX.x - minX.x) * .5, 0, minZ.z + (maxZ.z - minZ.z) * .5);
        this.cameraTarget.position.copy(CameraMove.autoRotate.cameraTarget.position);
        this.position.copy(CameraMove.autoRotate.render());
        this.lookAt(CameraMove.autoRotate.cameraTarget.position);
    };
    NekoCamera.prototype.opStart = function () {
        this.stopFlag = false;
        CameraMove.autoRotate.init(this.opCompStep1.bind(this));
    };
    NekoCamera.prototype.opCompStep1 = function () {
        CoverManager.fadeOut('white', this.opCompStep2.bind(this));
    };
    NekoCamera.prototype.opCompStep2 = function () {
        CoverManager.fadeIn('white');
        var player = SceneManager.scene.getObjectByName('player', false);
        player.start();
        PixiManager.stageStartText.show();
        setTimeout(function () {
            PixiManager.stageStartText.hide();
        }.bind(this), 2000);
        CameraManager.stageStart(this.opCompStep3.bind(this));
    };
    NekoCamera.prototype.opCompStep3 = function () {
        this.stopFlag = false;
        this.lastMover = CameraMove.rotate;
        this.typeChenge({ type: 'rotate', easingFlag: true });
        var player = SceneManager.scene.getObjectByName('player', false);
        this.setCameraTarget(player);
        StageManager.opComp();
    };
    NekoCamera.prototype.flip = function (type) {
        if (type == 'start') {
            this.typeChenge({ type: 'rotate', easingFlag: true });
        }
        else if (type == 'end') {
        }
    };
    NekoCamera.prototype.oneRotation = function () {
        CameraMove.rotate.pluseRadius(5);
    };
    NekoCamera.prototype.typeChenge = function (obj) {
        this.type = obj.type;
        if (obj.easingFlag) {
            var tweenCameraTarget = new THREE.Object3D();
            tweenCameraTarget.position.copy(this.lastMover.cameraTarget.position);
        }
        switch (this.type) {
            case 'rotate':
                var pos = CameraMove.rotate.render();
                var cameraTarget = CameraMove.rotate.cameraTarget;
                this.lastMover = CameraMove.rotate;
                break;
            case 'autoRotate':
                var pos = CameraMove.autoRotate.render();
                var cameraTarget = CameraMove.autoRotate.cameraTarget;
                this.lastMover = CameraMove.autoRotate;
                break;
            case 'closeUp':
                CameraMove.closeUp.cameraTarget = obj.target;
                var pos = CameraMove.closeUp.render(this);
                cameraTarget = CameraMove.closeUp.cameraTarget;
                this.lastMover = CameraMove.closeUp;
                break;
            case 'spline':
                var pos = CameraMove.spline.render();
                var cameraTarget = CameraMove.spline.cameraTarget;
                this.lastMover = CameraMove.spline;
                CameraMove.spline.startTime = 0;
                break;
            case 'debug':
                var pos = new THREE.Vector3(0, 1, 20);
                var cameraTarget = new THREE.Object3D();
                cameraTarget.position.copy(new THREE.Vector3(0, 1, 0));
                break;
        }
        if (obj.easingFlag) {
            this.tweenFlag = true;
            var upDate = function () {
                var pos = ThreeManager.easingVector3(tweenCameraTarget.position, cameraTarget.position, 2);
                tweenCameraTarget.position.copy(pos);
                this.lookAt(tweenCameraTarget.position);
            };
            TweenManager.addTweenPosition(this, pos, 1000, TWEEN.Easing.Cubic.Out, 0, this.tweenComp.bind(this), upDate.bind(this));
        }
    };
    NekoCamera.prototype.tweenComp = function () {
        this.tweenFlag = false;
    };
    NekoCamera.prototype.animate = function () {
        if (this.tweenFlag || !Vars.initCompFlag || this.stopFlag || !Vars.renderFlag)
            return;
        switch (this.type) {
            case 'autoRotate':
                this.position.copy(CameraMove.autoRotate.render());
                this.lookAt(CameraMove.autoRotate.cameraTarget.position);
                break;
            case 'rotate':
                this.position.copy(CameraMove.rotate.render());
                this.lookAt(CameraMove.rotate.cameraTarget.position);
                break;
            case 'closeUp':
                this.position.copy(CameraMove.closeUp.render(this));
                this.lookAt(this.cameraTarget.position);
                this.lookAt(CameraMove.closeUp.cameraTarget.position);
                break;
            case 'spline':
                this.position.copy(CameraMove.spline.render());
                this.lookAt(CameraMove.spline.cameraTarget.position);
                break;
        }
    };
    NekoCamera.prototype.setTweenCameraTargetPos = function (targetPos) {
        if (this.type != 'rotate')
            return;
        CameraMove.rotate.setTweenCameraTargetPos(targetPos);
    };
    NekoCamera.prototype.setCameraTarget = function (target) {
        CameraMove.rotate.setCameraTarget(target);
    };
    NekoCamera.prototype.positionRefresh = function () {
        if (this.type == 'rotate') {
            CameraMove.rotate.refresh();
        }
    };
    NekoCamera.prototype.gameOver = function () {
        this.type = 'autoRotate';
        CameraMove.autoRotate.init();
        CameraMove.autoRotate.speed = 10;
        CameraMove.autoRotate.loopFlag = true;
        CameraMove.autoRotate.y = CameraMove.autoRotate.targetY = CameraMove.rotate.targetY;
        CameraMove.autoRotate.radius = CameraMove.autoRotate.targetRadius = CameraMove.rotate.targetRadius;
        CameraMove.autoRotate.rot = CameraMove.autoRotate.targetRot = Math.atan2(this.position.z, this.position.x) * 180 / Math.PI;
        CameraMove.autoRotate.cameraTarget.position.copy(CameraMove.rotate.cameraTarget.position);
        this.cameraTarget.position.copy(CameraMove.rotate.cameraTarget.position);
        this.position.copy(CameraMove.autoRotate.render());
        this.lookAt(CameraMove.autoRotate.cameraTarget.position);
    };
    return NekoCamera;
})(Camera);
var CoverManager;
(function (CoverManager) {
    var plane;
    var material;
    var count = 0;
    function init() {
        material = new THREE.MeshBasicMaterial({ transparent: true, color: 0xffffff, blending: THREE.AdditiveBlending });
        plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 1, 1), material);
        plane.visible = false;
        SceneManager.scene.add(plane);
        Vars.setAnimateFunc(animate.bind(this));
    }
    CoverManager.init = init;
    function animate() {
        var pos = CameraManager.camera.position.clone();
        var forward = ThreeManager.getForward(CameraManager.camera);
        pos.add(forward.multiplyScalar(2));
        plane.position.copy(pos);
        plane.lookAt(CameraManager.camera.position);
    }
    function flash(type) {
        switch (type) {
            case 'blue':
                material.color = new THREE.Color(0x51e3fe);
                break;
        }
        material.opacity = 0;
        material.blending = THREE.AdditiveBlending;
        plane.material = material;
        plane.material.needsUpdate = true;
        count = 0;
        plane.visible = true;
        TweenManager.addTweenAlpha(plane, .7, 250, TWEEN.Easing.Linear.None, 0, tweenCompStep1.bind(this));
    }
    CoverManager.flash = flash;
    function tweenCompStep1() {
        var duration = 100;
        if (count == 1)
            duration = 50;
        TweenManager.addTweenAlpha(plane, 0, duration, TWEEN.Easing.Linear.None, 0, tweenCompStep2.bind(this));
    }
    function tweenCompStep2() {
        count++;
        if (count == 1) {
            TweenManager.addTweenAlpha(plane, .5, 150, TWEEN.Easing.Linear.None, 200, tweenCompStep1.bind(this));
            return;
        }
        plane.visible = false;
    }
    function fadeOut(color, callBack) {
        if (callBack === void 0) { callBack = null; }
        switch (color) {
            case 'black':
                material.color = new THREE.Color(0x000000);
                material.blending = THREE.NormalBlending;
                break;
            case 'white':
                material.color = new THREE.Color(0xffffff);
                material.blending = THREE.AdditiveBlending;
                break;
        }
        material.opacity = 0;
        plane.material = material;
        plane.material.needsUpdate = true;
        plane.visible = true;
        TweenManager.addTweenAlpha(plane, 1, 500, TWEEN.Easing.Linear.None, 0, callBack);
    }
    CoverManager.fadeOut = fadeOut;
    var fadeInCallBack;
    function fadeIn(color, callBack) {
        if (callBack === void 0) { callBack = null; }
        fadeInCallBack = callBack;
        switch (color) {
            case 'black':
                material.color = new THREE.Color(0x000000);
                material.blending = THREE.NormalBlending;
                break;
            case 'white':
                material.color = new THREE.Color(0xffffff);
                material.blending = THREE.AdditiveBlending;
                break;
        }
        material.opacity = 1;
        plane.material = material;
        plane.material.needsUpdate = true;
        plane.visible = true;
        TweenManager.addTweenAlpha(plane, 0, 500, TWEEN.Easing.Linear.None, 0, fadeInComp.bind(this));
    }
    CoverManager.fadeIn = fadeIn;
    function fadeInComp() {
        plane.visible = false;
        if (fadeInCallBack)
            fadeInCallBack();
    }
})(CoverManager || (CoverManager = {}));
var DeallocateManager;
(function (DeallocateManager) {
    var _gl;
    function init() {
        _gl = RendererManager.renderer.context;
    }
    DeallocateManager.init = init;
    var deleteBuffers = function (geometry) {
        if (geometry.__webglVertexBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglVertexBuffer);
        if (geometry.__webglNormalBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglNormalBuffer);
        if (geometry.__webglTangentBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglTangentBuffer);
        if (geometry.__webglColorBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglColorBuffer);
        if (geometry.__webglUVBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglUVBuffer);
        if (geometry.__webglUV2Buffer !== undefined)
            _gl.deleteBuffer(geometry.__webglUV2Buffer);
        if (geometry.__webglSkinIndicesBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglSkinIndicesBuffer);
        if (geometry.__webglSkinWeightsBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglSkinWeightsBuffer);
        if (geometry.__webglFaceBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglFaceBuffer);
        if (geometry.__webglLineBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglLineBuffer);
        if (geometry.__webglLineDistanceBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglLineDistanceBuffer);
        if (geometry.__webglCustomAttributesList !== undefined) {
            for (var id in geometry.__webglCustomAttributesList) {
                _gl.deleteBuffer(geometry.__webglCustomAttributesList[id].buffer);
            }
        }
        RendererManager.renderer.info.memory.geometries--;
    };
    DeallocateManager.deallocateGeometry = function (geometry) {
        geometry.__webglInit = undefined;
        if (geometry instanceof THREE.BufferGeometry) {
            var attributes = geometry.attributes;
            for (var key in attributes) {
                if (attributes[key].buffer !== undefined) {
                    _gl.deleteBuffer(attributes[key].buffer);
                }
            }
            RendererManager.renderer.info.memory.geometries--;
        }
        else {
            if (geometry.geometryGroups !== undefined) {
                for (var i = 0, l = geometry.geometryGroupsList.length; i < l; i++) {
                    var geometryGroup = geometry.geometryGroupsList[i];
                    if (geometryGroup.numMorphTargets !== undefined) {
                        for (var m = 0, ml = geometryGroup.numMorphTargets; m < ml; m++) {
                            _gl.deleteBuffer(geometryGroup.__webglMorphTargetsBuffers[m]);
                        }
                    }
                    if (geometryGroup.numMorphNormals !== undefined) {
                        for (var m = 0, ml = geometryGroup.numMorphNormals; m < ml; m++) {
                            _gl.deleteBuffer(geometryGroup.__webglMorphNormalsBuffers[m]);
                        }
                    }
                    deleteBuffers(geometryGroup);
                }
            }
            else {
                deleteBuffers(geometry);
            }
        }
    };
    DeallocateManager.deallocateTexture = function (texture) {
        if (texture.image && texture.image.__webglTextureCube) {
            _gl.deleteTexture(texture.image.__webglTextureCube);
        }
        else {
            if (!texture.__webglInit)
                return;
            texture.__webglInit = false;
            _gl.deleteTexture(texture.__webglTexture);
        }
    };
})(DeallocateManager || (DeallocateManager = {}));
var DoorAnimationManager = (function () {
    function DoorAnimationManager(mesh, length) {
        this.meshArray = [];
    }
    return DoorAnimationManager;
})();
var GameObject = (function (_super) {
    __extends(GameObject, _super);
    function GameObject(defaultPosition) {
        if (defaultPosition === void 0) { defaultPosition = null; }
        _super.call(this);
        this.meshForwardNegateFlag = false;
        this.defaultScale = 1;
        this.size = new THREE.Vector3();
        this.defaultSize = new THREE.Vector3();
        this.nowScale = 1;
        this.debugFlag = false;
        this.lastPosition = new THREE.Vector3();
        this.assetName = '';
        this.mouseEnabledFlag = false;
        this.catchStandbyFlag = false;
        this.rigidBodyManyShapeFlag = false;
        this.rigidFlag = false;
        this.rigidName = '';
        this.rigidMeshs = [];
        this.rigidData = {};
        this.rigidBodyIndex = -1;
        this.catherEnabledFlag = true;
        this.catchFlag = false;
        this.catchingFlag = false;
        this.throwingFlag = false;
        this.catchCircleRelativeY = 0;
        this.catchTargetPosition = new THREE.Vector3(0, 1, 1);
        this.releaseTargets = [];
        this.releaseTargetsLength = 0;
        this.moveFlag = true;
        this.mover = {};
        this.oldPosition = new THREE.Vector3();
        this.speed = 0;
        this.flipIndex = -1;
        this.shadowTargetNames = [];
        this.shadowTargetNamesLength = 0;
        this.raycastCheckCount = 0;
        this.maxRaycastCheckCount = 10;
        this.animationType = 'bone';
        this.animationFps = 30;
        this.animationNames = [];
        this.animationLength = 0;
        this.nowAnimation = '';
        this.animationStep = 1;
        this.animations = {};
        this.caughtFlag = false;
        this.lastCaughtTime = 0;
        this.caughtJointIndex = -1;
        this.hitTargets = [];
        this.hitTargetsLength = 0;
        this.hitCheckTime = 0;
        this.maxHitCheckTime = .5;
        this.hitRadius = 3;
        this.groundHitTargetNames = [];
        this.groundHitTargetNamesLength = 0;
        this.maxGroundHitRayCheckTime = .5;
        this.groundHitRayCheckTime = 0;
        this.deadFlag = false;
        this.hitPoint = 3;
        if (defaultPosition)
            this.position.copy(defaultPosition);
        Vars.setAnimateFunc(this.goAnimate.bind(this));
    }
    GameObject.prototype.setCatchMouseEvents = function () {
        this.mouseClick = this.catchMouseClick;
        this.mouseOver = this.catchMouseOver;
        this.mouseOut = this.catchMouseOut;
    };
    GameObject.prototype.catchMouseClick = function () {
        if (this.catchFlag || !this.mouseEnabledFlag || this.player.nowScale == this.player.minScale || !this.catchCircle.visible)
            return;
        this.catchStandbyFlag = true;
        if (platform == 'pc') {
            DomManager.mouseNavi.TF.html('右クリックで投げる');
        }
        else {
            DomManager.mouseNavi.TF.html('ダブルタップで投げる');
        }
        DomManager.mouseNavi.show();
    };
    GameObject.prototype.catchMouseOver = function () {
        if (this.catchFlag || this.catchStandbyFlag || !this.catchCircle.visible)
            return;
        if (platform == 'pc') {
            var text = '左クリックで拾う';
        }
        else {
            text = 'タップで拾う';
        }
        if (this.player.nowScale == this.player.minScale)
            text = '体が小さくて持てない！';
        DomManager.mouseNavi.TF.html(text);
        DomManager.mouseNavi.show();
    };
    GameObject.prototype.catchMouseOut = function () {
        if (!this.catchFlag) {
            DomManager.mouseNavi.hide();
        }
    };
    GameObject.prototype.mouseOver = function () {
    };
    GameObject.prototype.mouseOut = function () {
    };
    GameObject.prototype.mouseClick = function () {
        if (!this.catchFlag && this.mouseEnabledFlag)
            this.catchStandbyFlag = true;
    };
    GameObject.prototype.mouseDown = function () {
    };
    GameObject.prototype.mouseMove = function () {
    };
    GameObject.prototype.mouseUp = function () {
    };
    GameObject.prototype.drag = function () {
    };
    GameObject.prototype.setMoveType = function (option) {
        this.moveType = option.type;
        if (option.speed) {
            this.speed = option.speed;
        }
        else {
            this.speed = 1;
        }
        if (this.mover[this.moveType])
            return;
        switch (this.moveType) {
            case 'mouse':
                Move.mouse.add(this, this.speed, option.speedChangeRange, option.maxSpeed);
                this.mover[this.moveType] = Move.mouse;
                PhysicsManager.setSpeed(this.rigidBodyIndex, this.speed);
                break;
            case 'stalker':
                Move.stalker.add(this, option.target, this.speed, option.range);
                this.mover[this.moveType] = Move.stalker;
                PhysicsManager.setSpeed(this.rigidBodyIndex, this.speed);
                break;
            case 'turn':
                Move.turn.add(this);
                this.mover[this.moveType] = Move.turn;
                PhysicsManager.setSpeed(this.rigidBodyIndex, this.speed);
                break;
            case 'rotation':
                Move.rotation.add(this.name, this.speed);
                this.mover[this.moveType] = Move.rotation;
                PhysicsManager.setSpeed(this.rigidBodyIndex, this.speed);
                break;
            case 'flip':
                Move.flip.init(option.target, option.callBack);
                break;
        }
    };
    GameObject.prototype.goMovement = function () {
        if (!this.mover[this.moveType] || this.throwingFlag || !this.moveFlag || !Vars.renderFlag)
            return;
        this.mover[this.moveType].render(this.name);
        this.oldPosition.copy(this.position);
    };
    GameObject.prototype.getMoveProp = function () {
        return this.mover[this.moveType].objects[this.name];
    };
    GameObject.prototype.getMover = function () {
        return this.mover[this.moveType];
    };
    GameObject.prototype.createMesh = function (geometryType, geometrySize) {
        var geometry = this.getGeometry(geometryType, geometrySize);
        var material = new THREE.MeshBasicMaterial();
        this.mesh = new THREE.Mesh(geometry, material);
        this.add(this.mesh);
    };
    GameObject.prototype.getGeometry = function (type, size) {
        var geometry;
        switch (type) {
            case 'plane':
                geometry = new THREE.PlaneGeometry(size.x, size.y, 1, 1);
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(size.radius, size.radius, size.height, 6, 1, false);
                break;
            case 'box':
                geometry = new THREE.BoxGeometry(size.x, size.y, size.z, 1, 1);
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(size, 6, 6);
                break;
        }
        return geometry;
    };
    GameObject.prototype.setMesh = function (mesh, materialName, receiveShadow, mouseEnabled) {
        if (mesh === void 0) { mesh = null; }
        if (materialName === void 0) { materialName = ''; }
        if (receiveShadow === void 0) { receiveShadow = false; }
        if (mouseEnabled === void 0) { mouseEnabled = false; }
        if (mesh) {
            this.mesh = mesh;
        }
        else {
            this.mesh = MeshManager.duplicate(AssetManager.assets.objects[this.assetName]);
        }
        if (materialName != '')
            MaterialManager.setMaterial(this.mesh, materialName);
        this.mesh.name = this.name;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = receiveShadow;
        this.mesh.position.set(0, 0, 0);
        if (mouseEnabled) {
            this.setMouseEnabled(this.mesh, true);
        }
        this.add(this.mesh);
    };
    GameObject.prototype.createSprite = function (texUrl) {
        var map = THREE.ImageUtils.loadTexture(texUrl);
        var material = new THREE.SpriteMaterial({ map: map });
        this.sprite = new THREE.Sprite(material);
        this.add(this.sprite);
    };
    GameObject.prototype.setMouseEnabled = function (targetMesh, flag) {
        if (this.mouseEnabledFlag)
            return;
        this.raycastTarget = targetMesh;
        this.mouseEnabledFlag = true;
        RaycastManager.add(targetMesh, flag);
    };
    GameObject.prototype.setVisible = function (flag) {
        if (this.catchCircle)
            this.setCatchCircle(false);
        if (this.mesh)
            this.mesh.visible = flag;
        if (this.shadowMesh)
            this.shadowMesh.visible = flag;
        this.visible = flag;
    };
    GameObject.prototype.setScale = function (scale) {
        this.nowScale = scale;
        if (this.rigidFlag) {
            PhysicsManager.setScale(this.rigidBodyIndex, scale);
            this.size.copy(this.defaultSize.clone().multiplyScalar(scale));
        }
        if (this.mesh) {
            this.mesh.scale.set(scale, scale, scale);
            this.mesh.updateMatrix();
            this.mesh.position.copy(this.getCollisionOrigin());
        }
    };
    GameObject.prototype.setDefaultScale = function (scale) {
        this.setScale(scale);
        this.defaultScale = scale;
    };
    GameObject.prototype.setRigidBody = function () {
        if (this.rigidFlag)
            return;
        this.rigidFlag = true;
        this.setCollisionSize();
        var origin = this.getCollisionOrigin();
        if (this.mesh)
            this.mesh.position.copy(origin);
        if (!this.rigidMesh) {
            this.rigidMesh = this.getRigidMesh();
            if (this.debugFlag) {
                this.rigidMesh.material = new THREE.MeshBasicMaterial({ wireframe: true });
                this.rigidMesh.material.needsUpdate = true;
                this.add(this.rigidMesh);
            }
        }
        if (!this.rigidData.mass && this.rigidData.mass != 0)
            this.rigidData.mass = 1;
        this.rigidBodyIndex = PhysicsManager.setRigidBody(this.rigidMesh, this, this.name, this.rigidData.shapeType, 1, this.rigidData.mass, this.rigidData.noRotFlag);
        PhysicsManager.setScale(this.rigidBodyIndex, this.defaultScale);
        return this.rigidBodyIndex;
    };
    GameObject.prototype.setCollisionSize = function () {
        if (!this.rigidData.size) {
            if (AssetManager.assets.objects[this.rigidName]) {
                var mesh = AssetManager.assets.objects[this.rigidName];
                var collisionSize = MeshManager.getSize(mesh);
                collisionSize = new THREE.Vector3(collisionSize.x, collisionSize.z, collisionSize.y);
            }
            else {
                var collisionSize = MeshManager.getSize(this.mesh);
                collisionSize = new THREE.Vector3(collisionSize.x, collisionSize.z, collisionSize.y);
            }
            switch (this.rigidData.shapeType) {
                case 'sphere':
                    this.rigidData.size = collisionSize.x * .5;
                    break;
                case 'box':
                    this.rigidData.size = collisionSize;
                    break;
                case 'cylinder':
                    this.rigidData.size = {
                        radius: collisionSize.x * .5,
                        height: collisionSize.y
                    };
                    break;
                case 'plane':
                    this.rigidData.size = {
                        x: collisionSize.x,
                        y: collisionSize.y
                    };
                    break;
            }
        }
        switch (this.rigidData.shapeType) {
            case 'plane':
                this.size.x = this.rigidData.size.x;
                this.size.y = this.rigidData.size.y;
                this.size.z = 0;
                break;
            case 'cylinder':
                this.size.x = this.rigidData.size.radius * 2;
                this.size.y = this.rigidData.size.height;
                this.size.z = this.size.x;
                break;
            case 'box':
                this.size.x = this.rigidData.size.x;
                this.size.y = this.rigidData.size.y;
                this.size.z = this.rigidData.size.z;
                break;
            case 'sphere':
                this.size.x = this.rigidData.size * 2;
                this.size.y = this.size.x;
                this.size.z = this.size.x;
                break;
        }
        this.defaultSize.copy(this.size);
    };
    GameObject.prototype.getCollisionOrigin = function () {
        if (!this.rigidData.origin)
            this.rigidData.origin = new THREE.Vector3();
        var origin = this.size.clone().multiplyScalar(.5).multiply(this.rigidData.origin.clone());
        return origin;
    };
    GameObject.prototype.getRigidMesh = function () {
        var geometry = this.getGeometry(this.rigidData.shapeType, this.rigidData.size);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ wireframe: true }));
        mesh.name = this.name;
        return mesh;
    };
    GameObject.prototype.setMass = function (mass) {
        if (mass == 0)
            PhysicsManager.setPosition(this.rigidBodyIndex, new THREE.Vector3(0, 100, 0));
        setTimeout(function () {
            PhysicsManager.setMassProps(this.rigidBodyIndex, mass);
        }.bind(this), 10);
    };
    GameObject.prototype.setRigidBodyManyShape = function (meshs) {
        if (meshs === void 0) { meshs = []; }
        if (this.rigidFlag)
            return;
        this.rigidFlag = true;
        this.rigidMeshs = this.createRigidMeshs(meshs);
        this.rigidBodyIndex = PhysicsManager.setRigidBodyManyShape(this.rigidMeshs, this, this.name, 0);
        return this.rigidBodyIndex;
    };
    GameObject.prototype.createRigidMeshs = function (meshs) {
        if (meshs === void 0) { meshs = []; }
        this.rigidBodyManyShapeFlag = true;
        if (!this.rigidMeshs.length) {
            if (!meshs.length) {
                meshs = AssetManager.searchAssetsByName(this.rigidName);
            }
            var length = meshs.length;
            var origin = AssetManager.assets.objects[this.assetName].position.clone();
            for (var i = 0; i < length; i++) {
                meshs[i].position.sub(origin.clone());
                if (this.debugFlag) {
                    meshs[i].material = new THREE.MeshBasicMaterial({ wireframe: true });
                    meshs[i].material.needsUpdate = true;
                    this.add(meshs[i]);
                }
            }
            this.rigidMeshs = meshs;
        }
        return this.rigidMeshs;
    };
    GameObject.prototype.setShadow = function (shadowTargetNames) {
        this.shadowTargetNames = shadowTargetNames;
        this.shadowTargetNamesLength = this.shadowTargetNames.length;
        var geometry = new THREE.PlaneGeometry(1.5, 1.5, 1, 1);
        this.shadowMesh = new THREE.Mesh(geometry, MaterialManager.shadowMaterial);
        this.shadowMesh.rotation.x = -90 * Vars.toRad;
        SceneManager.scene.add(this.shadowMesh);
        var pos = this.position.clone();
        pos.y += 1;
        this.shadowRay = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0));
    };
    GameObject.prototype.shadowMove = function () {
        if (this.shadowMesh) {
            if (this.position.x == this.lastPosition.x && this.position.y == this.lastPosition.y && this.position.z == this.lastPosition.z)
                return;
            var pos = this.position.clone();
            this.shadowMesh.position.x = pos.x;
            this.shadowMesh.position.z = pos.z;
            this.raycastCheckCount++;
            if (this.maxRaycastCheckCount > this.raycastCheckCount)
                return;
            this.raycastCheckCount = 0;
            this.shadowRay.ray.origin = pos;
            this.shadowMesh.position.y = -999;
            var obj = RaycastManager.hitCheck(this.shadowRay, 10);
            if (obj.hitFlag) {
                for (var i = 0; i < this.shadowTargetNamesLength; i++) {
                    var point = RaycastManager.getFirstPointByName(obj.intersections, this.shadowTargetNames[i]);
                    if (point)
                        this.shadowMesh.position.y = point.y + .03;
                }
            }
            this.shadowMesh.lookAt(this.shadowMesh.position.clone().add(Vars.groundUp));
        }
    };
    GameObject.prototype.setGroundHitRay = function (groundHitTargetNames) {
        this.groundHitTargetNames = groundHitTargetNames;
        this.groundHitTargetNamesLength = this.groundHitTargetNames.length;
        if (!this.groundHitRay) {
            var pos = this.position.clone();
            this.groundHitRay = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0));
        }
    };
    GameObject.prototype.groundHitCheck = function () {
        if (!this.groundHitTargetNamesLength)
            return;
        this.groundHitRayCheckTime += Vars.delta;
        if (this.maxGroundHitRayCheckTime > this.groundHitRayCheckTime)
            return;
        this.groundHitRayCheckTime = 0;
        this.groundHitRay.ray.origin.copy(this.position);
        var obj = RaycastManager.hitCheck(this.groundHitRay, 10);
        if (obj.hitFlag) {
            for (var i = 0; i < this.groundHitTargetNamesLength; i++) {
                var object = RaycastManager.getFirstObjectByName(obj.intersections, this.groundHitTargetNames[i]);
                if (object)
                    this.groundHit(object);
            }
        }
    };
    GameObject.prototype.groundHit = function (object) {
    };
    GameObject.prototype.setMorphAnimationKey = function (name, start, end) {
        if (!this.mesh) {
            alert('mesh is null');
            return;
        }
        this.animationType = 'morph';
        this.mesh.setAnimationLabel(name, start, end);
        this.animationNames.push(name);
        this.animationLength++;
        this.nowAnimation = name;
    };
    GameObject.prototype.setBoneAnimations = function (geometry) {
        if (!this.mesh) {
            alert('mesh is null');
            return;
        }
        this.animationType = 'bone';
        this.animationLength = geometry.animations.length;
        for (var i = 0; i < this.animationLength; i++) {
            var animName = geometry.animations[i].name;
            this.animationNames.push(animName);
            this.animations[animName] = new THREE.Animation(this.mesh, geometry.animations[i]);
        }
    };
    GameObject.prototype.playAnimation = function (name) {
        if (this.nowAnimation == name || !this.mesh)
            return;
        this.nowAnimation = name;
        if (this.animationType == 'morph') {
            this.mesh.playAnimation(name, this.animationFps);
        }
        else {
            this.animations[name].play();
        }
    };
    GameObject.prototype.animationRender = function () {
        if (this.nowAnimation != '') {
            if (this.animationType == 'morph') {
                this.mesh.updateAnimation(1000 * Vars.delta);
            }
            else {
                this.animations[this.nowAnimation].update(Vars.delta);
            }
        }
    };
    GameObject.prototype.setHitTarget = function (object) {
        this.hitTargets.push(object);
        this.hitTargetsLength = this.hitTargets.length;
    };
    GameObject.prototype.clearHitTargets = function () {
        this.hitTargets = [];
        this.hitTargetsLength = 0;
    };
    GameObject.prototype.hitCheck = function () {
        this.hitCheckTime += Vars.delta;
        if (this.maxHitCheckTime > this.hitCheckTime)
            return;
        this.hitCheckTime = 0;
        for (var i = 0; i < this.hitTargetsLength; i++) {
            var pos1 = this.parent.localToWorld(this.position.clone());
            var target = this.hitTargets[i];
            if (!target.parent) {
                this.hitTargets.splice(i, 1);
                this.hitTargetsLength--;
                break;
            }
            var pos2 = target.parent.localToWorld(target.position.clone());
            if (pos1.clone().distanceTo(pos2.clone()) < target.hitRadius) {
                this.hitTargets[i].hit(this);
            }
        }
    };
    GameObject.prototype.hit = function (hitTarget) {
    };
    GameObject.prototype.catchCheck = function () {
        if (this.catherEnabledFlag) {
            if (Action.catcher.objects[this.name])
                Action.catcher.search(this.name);
            if (this.catchCircle) {
                this.catchCircle.position.copy(this.position);
                this.catchCircle.position.y += this.catchCircleRelativeY;
            }
        }
    };
    GameObject.prototype.setCatcher = function (targets) {
        this.setMouseEnabled(this.mesh, true);
        Action.catcher.add(this, targets, 4);
    };
    GameObject.prototype.catcher = function (target, continueFlag) {
        if (continueFlag === void 0) { continueFlag = false; }
        if (continueFlag)
            clearTimeout(this.setCatchTargetNullTimeoutId);
        this.catchingFlag = true;
        this.catchTarget = target;
        this.catchTargetParent = target.parent;
        this.catchTarget.wasCaught();
        this.catchTarget.setCatchCircle(false);
        PhysicsManager.removeRigidBody(this.catchTarget);
        this.catchTarget.position.copy(this.catchTargetPosition);
        this.catchTargetParent.remove(target);
        this.add(this.catchTarget);
        this.catching();
    };
    GameObject.prototype.catching = function () {
    };
    GameObject.prototype.wasCaught = function () {
    };
    GameObject.prototype.setReleaseTargets = function (target) {
        this.releaseTargets.push(target);
        this.releaseTargetsLength = this.releaseTargets.length;
    };
    GameObject.prototype.clearReleaseTargets = function (target) {
        this.releaseTargets = [];
        this.releaseTargetsLength = 0;
    };
    GameObject.prototype.release = function () {
        if (!this.catchingFlag)
            return;
        this.catchingFlag = false;
        this.remove(this.catchTarget);
        this.catchTargetParent.add(this.catchTarget);
        if (this.meshForwardNegateFlag) {
            var forward = SceneManager.scene.localToWorld(ThreeManager.getForward(this.mesh).clone()).negate();
        }
        else {
            forward = SceneManager.scene.localToWorld(ThreeManager.getForward(this.mesh).clone());
        }
        var startPos = forward.clone().multiplyScalar(this.catchTargetPosition.z);
        startPos.y = this.catchTargetPosition.y;
        this.catchTarget.position.copy(this.position.clone().add(startPos.clone()));
        if (this.catchTarget.rigidBodyManyShapeFlag) {
            this.catchTarget.setRigidBodyManyShape();
        }
        else {
            this.catchTarget.setRigidBody();
        }
        PhysicsManager.resetVelocity(this.catchTarget.rigidBodyIndex);
        var targetPos = this.getReleaseTargetPos(forward);
        this.catchTarget.bulletStart();
        PhysicsManager.applyImpulse(this.catchTarget.rigidBodyIndex, this.catchTarget.position.clone(), targetPos.clone(), 20);
        this.catchTarget.maxHitCheckTime = 0;
        this.setCatchTargetNullTimeoutId = setTimeout(this.setCatchTargetNull.bind(this), 1000);
    };
    GameObject.prototype.getReleaseTargetPos = function (forward) {
        var targetPos = this.position.clone().add(forward.clone().multiplyScalar(20));
        targetPos.y = this.catchTargetPosition.y;
        if (this.releaseTargetsLength) {
            var target = this.getReleaseTarget();
            if (target) {
                var a = target.position.clone();
                a.y = 0;
                var b = this.position.clone();
                b.y = 0;
                var direction = a.sub(b).normalize();
                if (forward.dot(direction) > .5)
                    targetPos = target.position.clone();
            }
        }
        return targetPos;
    };
    GameObject.prototype.getReleaseTarget = function () {
        if (!this.catchTarget)
            return null;
        var minDist = 9999;
        var target;
        for (var i = 0; i < this.releaseTargetsLength; i++) {
            var dist = this.position.distanceTo(this.releaseTargets[i].position.clone());
            if (minDist > dist && this.catchTarget.assetName != this.releaseTargets[i].assetName && !this.releaseTargets[i].deadFlag) {
                target = this.releaseTargets[i];
            }
        }
        return target;
    };
    GameObject.prototype.setCatchTargetNull = function () {
        if (this.catchTarget) {
            this.catchTarget.maxHitCheckTime = .5;
            this.catchTarget.bulletEnd();
        }
        Action.catcher.release(this.name);
    };
    GameObject.prototype.bulletStart = function () {
    };
    GameObject.prototype.bulletEnd = function () {
    };
    GameObject.prototype.catcherClear = function () {
        this.remove(this.catchTarget);
        this.catchTargetParent.add(this.catchTarget);
        if (this.rigidBodyManyShapeFlag) {
            this.setRigidBodyManyShape();
        }
        else {
            this.catchTarget.setRigidBody();
        }
        this.catchTarget.catchStandbyFlag = false;
        this.catchTarget.maxHitCheckTime = .5;
        Action.catcher.release(this.name);
    };
    GameObject.prototype.setCatchCircle = function (visible) {
        if (!this.visible)
            return;
        if (!this.catchCircle) {
            var radius = this.size.x * .5 + 2;
            this.catchCircle = new THREE.Mesh(new THREE.PlaneGeometry(radius, radius, 1, 1), MaterialManager.circleMaterial);
            if (this.rigidData.origin.y >= 0) {
                this.catchCircleRelativeY = (this.size.y * .5) * (-this.rigidData.origin.y - 1);
            }
            else {
                this.catchCircleRelativeY = (this.size.y * .5) * -(1 + this.rigidData.origin.y);
            }
            this.catchCircleRelativeY += .2;
            this.catchCircle.rotation.x = 270 * Vars.toRad;
            this.catchCircle.position.copy(this.position);
            this.catchCircle.position.y += this.catchCircleRelativeY;
            SceneManager.scene.add(this.catchCircle);
        }
        if (visible != this.catchCircle.visible)
            this.catchCircle.visible = visible;
    };
    GameObject.prototype.destroy = function () {
        if (this.mouseEnabledFlag) {
            RaycastManager.remove(this.raycastTarget);
        }
    };
    GameObject.prototype.goAnimate = function () {
        if (this.deadFlag)
            return;
        this.goMovement();
        this.animationRender();
        this.shadowMove();
        this.hitCheck();
        this.groundHitCheck();
        this.catchCheck();
        this.lastPosition.copy(this.position);
    };
    return GameObject;
})(THREE.Object3D);
var StageData;
(function (StageData) {
    function init() {
        for (var stageIndex = 0; stageIndex < StageData.stages.length; stageIndex++) {
            var stageObj = StageData.stages[stageIndex];
            for (var type in stageObj) {
                for (var i = 0; i < stageObj[type].length; i++) {
                    var object = new THREE.Object3D();
                    object.rotation.set(stageObj[type][i].rotation[0], stageObj[type][i].rotation[1], stageObj[type][i].rotation[2]);
                    object.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0).normalize(), -90 * Vars.toRad);
                    var posX = stageObj[type][i].position[0];
                    var posY = stageObj[type][i].position[1];
                    var posZ = stageObj[type][i].position[2];
                    stageObj[type][i].position[0] = posX;
                    stageObj[type][i].position[1] = posZ;
                    stageObj[type][i].position[2] = -posY;
                    var rotX = stageObj[type][i].rotation[0];
                    var rotY = stageObj[type][i].rotation[1];
                    var rotZ = stageObj[type][i].rotation[2];
                    stageObj[type][i].rotation[0] = rotX;
                    stageObj[type][i].rotation[1] = rotZ;
                    stageObj[type][i].rotation[2] = rotY;
                }
            }
        }
    }
    StageData.init = init;
    StageData.stage1 = {
        "grounds": [
            {
                "name": "ground9",
                "geometry": "geo_grass.108",
                "groups": [],
                "material": "",
                "position": [37.0454, 14.02, 8.96895],
                "rotation": [2.68718e-07, -4.71963e-13, 3.14159],
                "quaternion": [-1.17991e-13, -1.34359e-07, 1, 8.78176e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false,
                "groundY": 0
            },
            {
                "name": "ground6",
                "geometry": "geo_grass.105",
                "groups": [],
                "material": "",
                "position": [30.7006, -10.9887, -5.85407],
                "rotation": [2.02416e-13, 2.68718e-07, -1.5708],
                "quaternion": [-9.50061e-08, 9.50062e-08, -0.707107, 0.707107],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false,
                "groundY": 0
            },
            {
                "name": "ground1",
                "geometry": "geo_grass.094",
                "groups": [],
                "material": "",
                "position": [51.9367, 0.135266, -7.28644],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false,
                "groundY": 0
            },
            {
                "name": "ground1",
                "geometry": "geo_grass.001",
                "groups": [],
                "material": "",
                "position": [15.4331, -25.7784, -40.0258],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": false,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground0",
                "geometry": "geo_grass.000",
                "groups": [],
                "material": "",
                "position": [0, 0, -2.28684],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false,
                "groundY": 0
            },
            {
                "name": "ground0",
                "geometry": "geo_grass.002",
                "groups": [],
                "material": "",
                "position": [30.3347, 20.1653, -28.9829],
                "rotation": [3.14159, -5.55257e-14, 1.34359e-07],
                "quaternion": [1, -6.71794e-08, 3.12325e-14, 8.78176e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": false,
                "receiveShadow": false,
                "doubleSided": false
            },
        ],
        "trees": [
            {
                "name": "tree0",
                "geometry": "geo_grass.009",
                "groups": [],
                "material": "",
                "position": [52.8166, 4.62284, -0.196955],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "tree0",
                "geometry": "geo_grass.003",
                "groups": [],
                "material": "",
                "position": [-6.97611, -9.1663, 1.13542],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "tsuribashis": [
            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.001",
                "groups": [],
                "material": "",
                "position": [12.1444, 0.273357, -0.00792827],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707107, 0.707107],
                "scale": [1, 1, 1],
                "visible": false,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.000",
                "groups": [],
                "material": "",
                "position": [5.51851, 11.8959, -0.00792827],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "warps": [
            {
                "name": "warp",
                "geometry": "geo_Cube.023",
                "groups": [],
                "material": "",
                "position": [55.8415, -3.33417e-07, 0.0686563],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707107, 0.707107],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "boxs": [
            {
                "name": "box0",
                "geometry": "geo_grass.098",
                "groups": [],
                "material": "ground.001",
                "position": [7.0193, 3.91321, 1.01136],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "box0",
                "geometry": "geo_grass.005",
                "groups": [],
                "material": "ground.001",
                "position": [-3.65269, 2.78635, 1.01136],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "box0",
                "geometry": "geo_grass.004",
                "groups": [],
                "material": "ground.001",
                "position": [4.83187, -4.10736, 1.01136],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false
            },
        ],
        "bikkuriButtons": [
            {
                "name": "bikkuriButton0",
                "geometry": "geo_Cube",
                "groups": [],
                "material": "Material",
                "position": [5.51959, 42.779, 1.73439],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false,
                "type": 'bridge',
                "hitCallBack": function () {
                    var tsuribashi0 = SceneManager.scene.getObjectByName('tsuribashi0', false);
                    if (!tsuribashi0.visible) {
                        tsuribashi0.setVisible(true);
                        tsuribashi0.setRigidBodyManyShape();
                        TextManager.refresh();
                        TextManager.setText('遠くで橋の架かる音がした。', true);
                    }
                }
            }
        ],
        "spikes": [
            {
                "name": "spike",
                "geometry": "geo_Plane.002",
                "groups": [],
                "material": "",
                "position": [0.0665164, -15.816, -1.34409],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707107, 0.707106],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "zakos": [
            {
                "name": "zako",
                "geometry": "geo_Plane.002",
                "groups": [],
                "material": "",
                "position": [5, 5, 1],
                "rotation": [0, 0, 0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "block0s": [
            {
                "name": "block0",
                "geometry": "geo_Cube.006",
                "groups": [],
                "material": "block0",
                "position": [-2, -1.00922, 0.995717],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false
            }
        ]
    };
    var stage2 = {
        "grounds": [
            {
                "name": "ground9",
                "geometry": "geo_grass.000",
                "groups": [],
                "material": "",
                "position": [20.9557, 14.02, 0.777409],
                "rotation": [2.68718e-07, -4.71963e-13, 3.14159],
                "quaternion": [-1.17991e-13, -1.34359e-07, 1, 8.78176e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground9",
                "geometry": "geo_grass.004",
                "groups": [],
                "material": "",
                "position": [48.7606, 2.93058, 2.08359],
                "rotation": [-7.66917e-13, -2.68718e-07, 1.57079],
                "quaternion": [-9.50062e-08, -9.5006e-08, 0.707106, 0.707108],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground9",
                "geometry": "geo_grass.002",
                "groups": [],
                "material": "",
                "position": [48.7606, -2.45852, 2.08359],
                "rotation": [2.68718e-07, -4.71963e-13, 3.14159],
                "quaternion": [-1.17991e-13, -1.34359e-07, 1, 8.78176e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground6",
                "geometry": "geo_grass.105",
                "groups": [],
                "material": "",
                "position": [22.9006, -10.9887, -7.43438],
                "rotation": [2.02416e-13, 2.68718e-07, -1.5708],
                "quaternion": [-9.50061e-08, 9.50062e-08, -0.707107, 0.707107],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground1",
                "geometry": "geo_grass.094",
                "groups": [],
                "material": "",
                "position": [44.1367, 0.135266, -7.19335],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground7",
                "geometry": "geo_grass.106",
                "groups": [],
                "material": "",
                "position": [0.0574427, 2.94749e-07, -4.87956],
                "rotation": [-7.66917e-13, -2.68718e-07, 1.57079],
                "quaternion": [-9.50062e-08, -9.5006e-08, 0.707106, 0.707108],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground7",
                "geometry": "geo_grass.001",
                "groups": [],
                "material": "",
                "position": [88.3042, 2.94749e-07, -4.87956],
                "rotation": [-7.66917e-13, -2.68718e-07, 1.57079],
                "quaternion": [-9.50062e-08, -9.5006e-08, 0.707106, 0.707108],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },
        ],
        "trees": [
            {
                "name": "tree0",
                "geometry": "geo_grass.009",
                "groups": [],
                "material": "",
                "position": [40.5663, 4.62284, -0.103865],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "tree0",
                "geometry": "geo_grass.003",
                "groups": [],
                "material": "",
                "position": [-3.82883, -3.62397, -0.103865],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "tsuribashis": [
            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.001",
                "groups": [],
                "material": "",
                "position": [4.34445, 0.273357, 0.0851619],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707108, 0.707105],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.000",
                "groups": [],
                "material": "",
                "position": [50.9245, 0.273357, 0.0851619],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707108, 0.707105],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "warps": [
            {
                "name": "warp",
                "geometry": "geo_Cube.023",
                "groups": [],
                "material": "",
                "position": [88.5657, -3.86672e-08, 0.161747],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707107, 0.707106],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "boxs": [
            {
                "name": "box0",
                "geometry": "geo_grass.098",
                "groups": [],
                "material": "ground.001",
                "position": [1.76303, 0.281603, 1.01136],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "bikkuriButtons": [
            {
                "name": "bikkuriButton0",
                "geometry": "geo_Cube",
                "groups": [],
                "material": "Material",
                "position": [38.1073, -6.18126, 1.73439],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false,
                "type": 'small',
                "hitCallBack": function () {
                    var player = SceneManager.scene.getObjectByName('player', false);
                    if (player.nowScale == player.defaultScale) {
                        if (player.catchingFlag) {
                            player.release();
                            DomManager.mouseNavi.hide();
                        }
                        player.setScale(player.minScale);
                        var text = '体が小さくなった！';
                    }
                    else {
                        player.setScale(player.defaultScale);
                        text = '体がもとの大きさに戻った！';
                    }
                    TextManager.refresh();
                    TextManager.setText(text, true);
                }
            }
        ],
        "zakos": [
            {
                "name": "zako",
                "geometry": "geo_Plane.002",
                "groups": [],
                "material": "",
                "position": [44.1367, 0.135266, 2],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ]
    };
    var stage3 = {
        "bikkuriButtons": [
            {
                "name": "bikkuriButton0",
                "geometry": "geo_Cube.002",
                "groups": [],
                "material": "Material",
                "position": [0.0561388, 46.45, 1.51853],
                "rotation": [-0, 0, 1.5708],
                "quaternion": [0, 0, 0.707107, 0.707107],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false,
                "type": 'bridge',
                "hitCallBack": function () {
                }
            },
            {
                "name": "bikkuriButton0",
                "geometry": "geo_Cube.001",
                "groups": [],
                "material": "Material",
                "position": [46.5166, 8.70662, 1.51853],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false,
                "type": 'bridge',
                "hitCallBack": function () {
                }
            },
            {
                "name": "bikkuriButton0",
                "geometry": "geo_Cube",
                "groups": [],
                "material": "Material",
                "position": [46.5166, 0.039588, 1.51853],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false,
                "type": 'bridge',
                "hitCallBack": function () {
                }
            }
        ],
        "tsuribashis": [
            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.004",
                "groups": [],
                "material": "",
                "position": [-44.7935, 5.2735, 0],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707108, 0.707106],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.003",
                "groups": [],
                "material": "",
                "position": [12.1153, 8.65456, 0],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707108, 0.707106],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.002",
                "groups": [],
                "material": "",
                "position": [0.0352571, 12.0487, -1.49012e-08],
                "rotation": [0, 0, -2.55903e-06],
                "quaternion": [0, 0, -1.27952e-06, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.001",
                "groups": [],
                "material": "",
                "position": [12.1153, -0.00320211, 0],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707108, 0.707106],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "grounds": [
            {
                "name": "ground8",
                "geometry": "geo_grass.007",
                "groups": [],
                "material": "",
                "position": [0.0557726, 46.3882, -1.97389],
                "rotation": [2.68718e-07, -5.36031e-13, 3.14159],
                "quaternion": [-1.34008e-13, -1.34359e-07, 1, 9.97386e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground8",
                "geometry": "geo_grass.006",
                "groups": [],
                "material": "",
                "position": [46.4548, 8.61392, -1.97389],
                "rotation": [-6.48721e-13, -2.68718e-07, 1.57079],
                "quaternion": [-9.50062e-08, -9.5006e-08, 0.707106, 0.707108],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground0",
                "geometry": "geo_grass.005",
                "groups": [],
                "material": "",
                "position": [0, 0, -2.24749],
                "rotation": [-3.14159, 1.27952e-06, 1.57079],
                "quaternion": [0.707107, -0.707106, 4.52377e-07, -4.52378e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground8",
                "geometry": "geo_grass.107",
                "groups": [],
                "material": "",
                "position": [46.4548, -0.0823044, -1.97389],
                "rotation": [-6.48721e-13, -2.68718e-07, 1.57079],
                "quaternion": [-9.50062e-08, -9.5006e-08, 0.707106, 0.707108],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground7",
                "geometry": "geo_grass.010",
                "groups": [],
                "material": "",
                "position": [-49.1664, 5.3547, -4.97079],
                "rotation": [-7.66917e-13, -2.68718e-07, 1.57079],
                "quaternion": [-9.50062e-08, -9.5006e-08, 0.707106, 0.707108],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "trees": [
            {
                "name": "tree1",
                "geometry": "geo_grass.009",
                "groups": [],
                "material": "",
                "position": [-8.29068, -9.73668, -0.13458],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "warps": [
            {
                "name": "warp",
                "geometry": "geo_Cube.023",
                "groups": [],
                "material": "",
                "position": [-49.1045, 5.34328, 0.0063829],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707107, 0.707106],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "boxs": [
            {
                "name": "box0",
                "geometry": "geo_grass.098",
                "groups": [],
                "material": "ground.002",
                "position": [1.76303, 0.281603, 1.01136],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "block1s": [
            {
                "name": "block1",
                "geometry": "geo_Cube.008",
                "groups": [],
                "material": "block0.001",
                "position": [2.19053, -7.22261, 0.995904],
                "rotation": [-1.19209e-07, 1.00898e-13, 3.14159],
                "quaternion": [5.2108e-15, 5.96046e-08, 1, 7.58967e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "block2s": [
            {
                "name": "block2",
                "geometry": "geo_Cube.008",
                "groups": [],
                "material": "block0.001",
                "position": [2.18426, -0.705824, 1.07121],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],
        "zakos": [
            {
                "name": "zako",
                "geometry": "geo_Plane.002",
                "groups": [],
                "material": "",
                "position": [3.85657, -3.96296, 1.01831],
                "rotation": [-0, 0, 0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ]
    };
    StageData.stages = [StageData.stage1, stage2, stage3];
})(StageData || (StageData = {}));
var BikkuriButton = (function (_super) {
    __extends(BikkuriButton, _super);
    function BikkuriButton(stageIndex, index, particleIndex) {
        _super.call(this);
        this.particleIndex = 0;
        this.lastHitTime = 0;
        this.hitInterval = 3;
        this.hitRadius = 2;
        this.particleIndex = particleIndex;
        this.starParticle2 = new StarParticle2();
        ParticleManager.setParticle(this.starParticle2, 'starParticle2BikkuriButton' + particleIndex);
        this.add(this.starParticle2);
        this.rigidData = {
            shapeType: 'box',
            size: { x: 2, y: 2, z: 2 },
            mass: 0
        };
        this.reset(stageIndex, index);
    }
    BikkuriButton.prototype.reset = function (stageIndex, index) {
        this.data = StageData.stages[stageIndex]['bikkuriButtons'][index];
        this.name = 'bikkuriButton0' + index;
        this.assetName = 'bikkuriButton0';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        if (!this.mesh)
            this.setMesh(null, 'bikkuriButton1', false, false);
        switch (this.data.type) {
            case 'bridge':
                MaterialManager.setMaterial(this.mesh, 'bikkuriButton1');
                break;
            case 'small':
                MaterialManager.setMaterial(this.mesh, 'bikkuriButton2');
                break;
        }
        this.setVisible(true);
        this.setRigidBody();
    };
    BikkuriButton.prototype.hit = function (target) {
        if (Vars.elapsedTime - this.lastHitTime < this.hitInterval)
            return;
        this.lastHitTime = Vars.elapsedTime;
        ParticleManager.on('starParticle2BikkuriButton' + this.particleIndex);
        setTimeout(function () {
            ParticleManager.off('starParticle2BikkuriButton' + this.particleIndex);
        }.bind(this), 50);
        this.data.hitCallBack();
        TweenManager.addTweenScale(this.mesh, new THREE.Vector3(1.5, 1.5, 1.5), 200, TWEEN.Easing.Cubic.Out, 0, this.hitTweenCompStep1.bind(this));
        SoundManager.play(5, false);
    };
    BikkuriButton.prototype.hitTweenCompStep1 = function () {
        TweenManager.addTweenScale(this.mesh, new THREE.Vector3(1, 1, 1), 500, TWEEN.Easing.Bounce.Out);
    };
    return BikkuriButton;
})(GameObject);
var Block0 = (function (_super) {
    __extends(Block0, _super);
    function Block0(stageIndex, index) {
        _super.call(this);
        this.mesh = MeshManager.duplicate(AssetManager.assets.objects['block0']);
        this.mesh.position.set(0, 0, 0);
        MaterialManager.setMaterial(this.mesh, 'block0');
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);
        this.rigidData = {
            shapeType: 'box',
            mass: 0
        };
        this.reset(stageIndex, index);
    }
    Block0.prototype.reset = function (stageIndex, index) {
        this.data = StageData.stages[stageIndex]['block0s'][index];
        this.name = 'block0' + index;
        this.assetName = 'block0';
        this.rigidName = 'block0Collision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        this.setVisible(true);
        var index = this.setRigidBody();
    };
    return Block0;
})(GameObject);
var Block1 = (function (_super) {
    __extends(Block1, _super);
    function Block1(stageIndex, index) {
        _super.call(this);
        this.mesh = MeshManager.duplicate(AssetManager.assets.objects['block1']);
        this.mesh.position.set(0, 0, 0);
        MaterialManager.setMaterial(this.mesh, 'block0');
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);
        this.rigidData = {
            shapeType: 'box',
            mass: 0
        };
        this.reset(stageIndex, index);
    }
    Block1.prototype.reset = function (stageIndex, index) {
        this.data = StageData.stages[stageIndex]['block1s'][index];
        this.name = 'block1' + index;
        this.assetName = 'block1';
        this.rigidName = 'block1Collision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        this.setVisible(true);
        var index = this.setRigidBodyManyShape();
    };
    return Block1;
})(GameObject);
var Block2 = (function (_super) {
    __extends(Block2, _super);
    function Block2(stageIndex, index) {
        _super.call(this);
        this.mesh = MeshManager.duplicate(AssetManager.assets.objects['block2']);
        this.mesh.position.set(0, 0, 0);
        MaterialManager.setMaterial(this.mesh, 'ground');
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);
        this.rigidData = {
            shapeType: 'box',
            mass: 100
        };
        this.reset(stageIndex, index);
    }
    Block2.prototype.reset = function (stageIndex, index) {
        this.data = StageData.stages[stageIndex]['block2s'][index];
        this.name = 'block2' + index;
        this.assetName = 'block2';
        this.rigidName = 'block2Collision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        this.setVisible(true);
        var index = this.setRigidBody();
    };
    return Block2;
})(GameObject);
var TweenManager;
(function (TweenManager) {
    function addTweenPosition(object, targetPosition, duration, easing, delay, callBack, upDate) {
        if (delay === void 0) { delay = 0; }
        if (callBack === void 0) { callBack = null; }
        if (upDate === void 0) { upDate = null; }
        new TWEEN.Tween(object.position).to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration).easing(easing).onComplete(callBack).delay(delay).onUpdate(upDate).start();
    }
    TweenManager.addTweenPosition = addTweenPosition;
    function addTweenRigidBodyPosition(object, targetPosition, duration, easing, delay, callBack, upDate) {
        if (delay === void 0) { delay = 0; }
        if (callBack === void 0) { callBack = null; }
        if (upDate === void 0) { upDate = null; }
        var pos = object.position.clone();
        new TWEEN.Tween(pos).to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration).easing(easing).onUpdate((function (rigidBodyIndex, pos) {
            return function () {
                PhysicsManager.setPosition(rigidBodyIndex, pos);
                if (upDate)
                    upDate();
            };
        }.bind(this))(object.rigidBodyIndex, pos)).onComplete(callBack).delay(delay).start();
    }
    TweenManager.addTweenRigidBodyPosition = addTweenRigidBodyPosition;
    function addTweenQuaternion(object, targetQuaternion, duration, easing, delay, callBack) {
        if (delay === void 0) { delay = 0; }
        if (callBack === void 0) { callBack = null; }
        new TWEEN.Tween(object.quaternion).to({ x: targetQuaternion.x, y: targetQuaternion.y, z: targetQuaternion.z, w: targetQuaternion.w }, duration).easing(easing).onComplete(callBack).delay(delay).start();
    }
    TweenManager.addTweenQuaternion = addTweenQuaternion;
    function addTweenRigidBodyQuaternion(object, targetQuaternion, duration, easing, delay, callBack) {
        if (delay === void 0) { delay = 0; }
        if (callBack === void 0) { callBack = null; }
        var q = object.quaternion.clone();
        new TWEEN.Tween(q).to({ x: targetQuaternion.x, y: targetQuaternion.y, z: targetQuaternion.z, w: targetQuaternion.w }, duration).easing(easing).onUpdate((function (rigidBodyIndex, q) {
            return function () {
                PhysicsManager.setQuaternion(rigidBodyIndex, q);
            };
        }.bind(this))(object.rigidBodyIndex, q)).onComplete(callBack).delay(delay).start();
    }
    TweenManager.addTweenRigidBodyQuaternion = addTweenRigidBodyQuaternion;
    function addTweenScale(object, targetScale, duration, easing, delay, callBack) {
        if (delay === void 0) { delay = 0; }
        if (callBack === void 0) { callBack = null; }
        return new TWEEN.Tween(object.scale).to({ x: targetScale.x, y: targetScale.y, z: targetScale.z }, duration).easing(easing).onUpdate((function (object) {
            return function () {
                object.updateMatrix();
            };
        }.bind(this))(object)).onComplete(callBack).delay(delay).start();
    }
    TweenManager.addTweenScale = addTweenScale;
    function addTweenRigidBodyScale(object, targetScale, duration, easing, delay, callBack) {
        if (delay === void 0) { delay = 0; }
        if (callBack === void 0) { callBack = null; }
        new TWEEN.Tween(object.scale).to({ x: targetScale.x, y: targetScale.y, z: targetScale.z }, duration).easing(easing).onUpdate((function (object, rigidBodyIndex, scale) {
            return function () {
                object.updateMatrix();
                PhysicsManager.setScale(rigidBodyIndex, scale);
            };
        }.bind(this))(object, object.rigidBodyIndex, object.scale.x)).onComplete(callBack).delay(delay).start();
    }
    TweenManager.addTweenRigidBodyScale = addTweenRigidBodyScale;
    function addTweenAlpha(object, targetAlpha, duration, easing, delay, callBack) {
        if (delay === void 0) { delay = 0; }
        if (callBack === void 0) { callBack = null; }
        new TWEEN.Tween(object.material).to({ opacity: targetAlpha }, duration).easing(easing).onComplete(callBack).onUpdate(function (self) {
            object.material.needsUpdate = true;
        }.bind(this)).delay(delay).start();
    }
    TweenManager.addTweenAlpha = addTweenAlpha;
    function addTweenObj(object, property, duration, easing, delay, callBack) {
        if (delay === void 0) { delay = 0; }
        if (callBack === void 0) { callBack = null; }
        new TWEEN.Tween(object).to(property, duration).easing(easing).onComplete(callBack).delay(delay).start();
    }
    TweenManager.addTweenObj = addTweenObj;
})(TweenManager || (TweenManager = {}));
var NekoGameObject = (function (_super) {
    __extends(NekoGameObject, _super);
    function NekoGameObject(defaultPosition) {
        if (defaultPosition === void 0) { defaultPosition = null; }
        _super.call(this, defaultPosition);
        this.revivePosition = new THREE.Vector3(0, 2, 0);
        Vars.setAnimateFunc(this.nekoGOAnimate.bind(this));
    }
    NekoGameObject.prototype.show = function (duration, delay) {
        if (!this.mesh)
            return;
        if (!this.nowTween) {
            this.mesh.scale.copy(new THREE.Vector3(.01, .01, .01));
            this.mesh.updateMatrix();
            this.nowTween = TweenManager.addTweenScale(this.mesh, new THREE.Vector3(this.nowScale, this.nowScale, this.nowScale), duration, TWEEN.Easing.Elastic.Out, delay, function () {
                this.nowTween = null;
            }.bind(this));
        }
    };
    NekoGameObject.prototype.resetRevivePosition = function (groundPos, reviveY, reviveXZ) {
        this.revivePosition.set(reviveXZ.x, reviveY, reviveXZ.z).add(groundPos.clone());
        if (this.position.distanceTo(this.revivePosition) < 5) {
            PhysicsManager.resetVelocity(this.rigidBodyIndex);
        }
        else {
            if (!this.mesh) {
                PhysicsManager.resetVelocity(this.rigidBodyIndex);
                PhysicsManager.setPosition(this.rigidBodyIndex, this.revivePosition);
                return;
            }
            TweenManager.addTweenScale(this.mesh, new THREE.Vector3(.01, .01, .01), 500, TWEEN.Easing.Elastic.Out, 0, this.fadeOutComp.bind(this));
        }
    };
    NekoGameObject.prototype.fadeOutComp = function () {
        PhysicsManager.resetVelocity(this.rigidBodyIndex);
        PhysicsManager.setPosition(this.rigidBodyIndex, this.revivePosition);
        TweenManager.addTweenScale(this.mesh, new THREE.Vector3(this.defaultScale, this.defaultScale, this.defaultScale), 500, TWEEN.Easing.Elastic.Out);
    };
    NekoGameObject.prototype.nekoGOAnimate = function () {
        if (this.position.y < -10 && this.rigidFlag && !this.deadFlag) {
            PhysicsManager.resetVelocity(this.rigidBodyIndex);
            PhysicsManager.setPosition(this.rigidBodyIndex, this.revivePosition);
            this.show(1000, 1000 * Math.random());
        }
    };
    return NekoGameObject;
})(GameObject);
var Box = (function (_super) {
    __extends(Box, _super);
    function Box(stageIndex, index) {
        _super.call(this);
        this.bulletFlag = false;
        this.hitFlag = false;
        this.returnPlayerFlag = false;
        this.continueReleaseMissFlag = false;
        this.player = SceneManager.scene.getObjectByName('player', false);
        this.rigidData = {
            shapeType: 'box',
            mass: 1
        };
        this.reset(stageIndex, index);
        this.setCatchMouseEvents();
        Vars.pushRightClickFunc(this.rightClickHandler.bind(this));
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    Box.prototype.reset = function (stageIndex, index) {
        this.data = StageData.stages[stageIndex]['boxs'][index];
        this.name = 'box0' + index;
        this.assetName = 'box0';
        this.rigidName = 'box0Collision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        if (!this.mesh)
            this.setMesh(null, 'box', false, true);
        this.show(500, 1000 * Math.random());
        this.setVisible(true);
        var index = this.setRigidBody();
    };
    Box.prototype.rightClickHandler = function () {
        if (!this.bulletFlag && this.continueReleaseMissFlag)
            return;
        if (this.hitFlag) {
            this.continueRelease();
        }
        else {
            this.continueReleaseMissFlag = true;
            setTimeout(function () {
                this.continueReleaseMissFlag = false;
            }.bind(this), 2000);
        }
    };
    Box.prototype.animate = function () {
    };
    Box.prototype.bulletStart = function () {
        this.maxHitCheckTime = .1;
        this.bulletFlag = true;
    };
    Box.prototype.bulletEnd = function () {
        this.maxHitCheckTime = .5;
        this.bulletFlag = false;
    };
    Box.prototype.continueRelease = function () {
        if (this.returnPlayerFlag)
            return;
        this.returnPlayerFlag = true;
        var direction = this.player.position.clone().sub(this.position.clone()).normalize();
        var dist = this.position.clone().distanceTo(this.player.position.clone());
        var targetPos = direction.multiplyScalar(dist * .5).add(this.position.clone());
        targetPos.y += 2;
        TweenManager.addTweenRigidBodyPosition(this, targetPos, 200, TWEEN.Easing.Linear.None, 0, this.continueReleaseStep1Comp.bind(this));
    };
    Box.prototype.continueReleaseStep1Comp = function () {
        var targetPos = this.player.position.clone();
        TweenManager.addTweenRigidBodyPosition(this, targetPos, 200, TWEEN.Easing.Linear.None, 0, this.continueReleaseComp.bind(this));
    };
    Box.prototype.continueReleaseComp = function () {
        setTimeout(function () {
            this.returnPlayerFlag = false;
        }.bind(this), 1000);
        var releaseTarget = this.player.getReleaseTarget();
        if (!releaseTarget)
            return;
        var direction = releaseTarget.position.clone().sub(this.player.position.clone()).normalize();
        this.player.setLookAt(direction);
        this.player.catcher(this, true);
        this.player.releaseAction();
    };
    return Box;
})(NekoGameObject);
var Cloud = (function (_super) {
    __extends(Cloud, _super);
    function Cloud() {
        _super.call(this);
        this.name = 'cloud';
        this.position.y = 10;
        var cloudParticle = new CloudParticle1();
        this.add(cloudParticle);
        var rainParticle = new RainParticle1();
        this.add(rainParticle);
        this.createMesh('box', new THREE.Vector3(3, 1, 3));
        this.mesh.name = 'cloud';
        this.setMouseEnabled(this.mesh, true);
        this.mesh.material.wireframe = true;
        this.mesh.material.visible = false;
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    Cloud.prototype.drag = function () {
        this.position.x += -(this.position.x - Vars.mousePosition.x) / 5;
        this.position.z += -(this.position.z - Vars.mousePosition.z) / 5;
    };
    Cloud.prototype.animate = function () {
    };
    return Cloud;
})(GameObject);
var CollisionObject = (function (_super) {
    __extends(CollisionObject, _super);
    function CollisionObject(callBack) {
        _super.call(this);
        this.radius = 2;
        this.callBack = callBack;
    }
    CollisionObject.prototype.hit = function (hitTarget) {
        this.callBack('addItem', { position: this.position.clone() });
    };
    return CollisionObject;
})(THREE.Object3D);
var GameObjectManager;
(function (GameObjectManager) {
    function merge(gameObjects) {
        var meshs = [];
        var materials = [];
        var length = gameObjects.length;
        for (var i = 0; i < length; i++) {
            gameObjects[i].mesh.position.copy(gameObjects[i].position);
            gameObjects[i].mesh.rotation.copy(gameObjects[i].rotation);
            meshs.push(gameObjects[i].mesh);
        }
        var geometry = GeometryManager.mergeMultiUV(meshs, length);
        var mesh = new THREE.Mesh(geometry, gameObjects[0].mesh.material);
        for (var i = 0; i < length; i++) {
            gameObjects[i].mesh.position.set(0, 0, 0);
            gameObjects[i].mesh.rotation.set(0, 0, 0);
        }
        return mesh;
    }
    GameObjectManager.merge = merge;
})(GameObjectManager || (GameObjectManager = {}));
var Ground = (function (_super) {
    __extends(Ground, _super);
    function Ground(stageIndex, index) {
        _super.call(this);
        this.addFlag = false;
        this.treeLength = 10;
        this.trees = [];
        this.treeTweenCompCount = 0;
        this.reset(stageIndex, index);
        var size = MeshManager.getSize(AssetManager.assets.objects[this.rigidName]);
        this.data.size = new THREE.Vector3(size.x, size.z, size.y);
        this.size.copy(this.data.size);
        this.data.groundY = this.position.y + this.data.size.y * .5;
    }
    Ground.prototype.setObjects = function () {
        var house2 = new House2(new THREE.Vector3(0, this.data.size.y * .5, 0));
        this.add(house2);
        var floorMesh = MeshManager.duplicate(AssetManager.assets.objects['houseInnerFloor']);
        floorMesh.position.copy(house2.position);
        floorMesh.position.y += .2;
        MaterialManager.setMaterial(floorMesh, 'houseInner');
        this.add(floorMesh);
    };
    Ground.prototype.addTree = function () {
        for (var i = 0; i < this.treeLength; i++) {
            var tree = new TreeMesh(i, this.size, this.treeTweenComp.bind(this));
            this.trees.push(tree);
            this.add(tree);
        }
    };
    Ground.prototype.treeTweenComp = function () {
        this.treeTweenCompCount++;
        if (this.treeTweenCompCount != this.treeLength)
            return;
        var geometry = GeometryManager.mergeMultiUV(this.trees);
        this.tree = new THREE.Mesh(geometry, MaterialManager.groundGrassMaterial);
        this.tree.castShadow = true;
        MaterialManager.setMaterial(this.tree, 'grassDepth');
        this.add(this.tree);
        for (var i = 0; i < this.treeLength; i++) {
            this.remove(this.trees[0]);
            this.trees.splice(0, 1);
        }
        this.trees = null;
        delete this.trees;
    };
    Ground.prototype.mouseClick = function () {
    };
    Ground.prototype.mouseDown = function () {
    };
    Ground.prototype.mouseUp = function () {
    };
    Ground.prototype.reset = function (stageIndex, index) {
        this.addFlag = true;
        this.data = StageData.stages[stageIndex]['grounds'][index];
        this.name = this.data.name + index;
        this.assetName = this.data.name;
        this.rigidName = this.data.name + 'Collision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        this.setVisible(true);
        if (this.mesh) {
            this.mesh.name = this.name;
        }
        else {
            this.setMesh(null, 'groundGrass', true, false);
        }
        var direction = Math.round(Math.random());
        if (direction == 0)
            direction = -1;
        if (this.data.rigidBody) {
            var index = this.setRigidBodyManyShape();
        }
    };
    return Ground;
})(GameObject);
var House = (function (_super) {
    __extends(House, _super);
    function House(name) {
        _super.call(this);
        this.name = name;
        this.mesh = MeshManager.duplicate(AssetManager.assets.objects['house0']);
        this.mesh.position.set(0, 0, 0);
        MaterialManager.setMaterial(this.mesh, 'groundGrass');
        this.defaultScale = 1;
        this.mesh.scale.multiplyScalar(this.defaultScale);
        this.mesh.updateMatrix();
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);
        this.rigidData = {
            shapeType: 'box',
            mass: 1,
            mouseEnabled: true,
            origin: new THREE.Vector3(0, -1, 0)
        };
        this.setRigidBody();
    }
    return House;
})(NekoGameObject);
var House2 = (function (_super) {
    __extends(House2, _super);
    function House2(pos) {
        _super.call(this);
        this.defaultPos = new THREE.Vector3(0, 2.5, 0);
        this.bone1DefaultPos = new THREE.Vector3();
        this.bone2DefaultPos = new THREE.Vector3();
        this.maxRubberDist = 10;
        this.dragTime = 0;
        this.maxDragTime = 5;
        this.hasFlag = false;
        this.cachePos = new THREE.Vector3();
        this.bone2CachePos = new THREE.Vector3();
        this.bone1CachePos = new THREE.Vector3();
        this.releaseVec = new THREE.Vector3();
        this.releaseFlag = false;
        this.name = 'house2';
        this.defaultPos.copy(pos);
        this.position.copy(this.defaultPos);
        var url = 'assets/models/house.js';
        new LoadManager(url, "json", this.modelLoadCompHandler.bind(this));
    }
    House2.prototype.modelLoadCompHandler = function (result) {
        this.initMesh(result);
        this.setMouseEnabled(this.mesh, true);
        Vars.setAnimateFunc(this.animate.bind(this));
    };
    House2.prototype.initMesh = function (result) {
        var material = MaterialManager.groundGrassMaterial.clone();
        for (var i = 0; i < material.materials.length; i++) {
            var m = (material.materials[i]);
            m.skinning = true;
            m.side = THREE.DoubleSide;
            m.transparent = true;
        }
        this.mesh = new THREE.SkinnedMesh(result.geometry, material);
        this.mesh.name = 'house2';
        this.mesh.castShadow = true;
        this.add(this.mesh);
        this.setBoneAnimations(result.geometry);
        this.bone0 = this.mesh.getObjectByName('Bone', false);
        this.bone1 = this.bone0.getObjectByName('Bone.1', false);
        this.bone1DefaultPos.copy(this.bone1.position);
        this.bone2 = this.bone1.getObjectByName('Bone.001', false);
        this.bone2DefaultPos.copy(this.bone2.position);
        for (var i = 0; i < this.mesh.children.length; i++) {
        }
        this.inner = new HouseInner();
    };
    House2.prototype.mouseOver = function () {
    };
    House2.prototype.mouseOut = function () {
    };
    House2.prototype.drag = function () {
        if (this.hasFlag) {
            this.has();
        }
        else {
            this.pull();
        }
    };
    House2.prototype.pull = function () {
        if (this.bone2) {
            this.dragTime += Vars.delta;
            if (this.dragTime > this.maxDragTime) {
                this.hasFlag = true;
            }
            var mousePos = Vars.mousePosition.clone();
            mousePos.y -= 5;
            var parentLocalMousePos = this.parent.worldToLocal(mousePos.clone());
            if (parentLocalMousePos.distanceTo(this.position) < this.maxRubberDist) {
                var bone2TargetPos = this.bone1.worldToLocal(mousePos.clone());
                var bone1TargetPos = bone2TargetPos.clone().multiplyScalar(.5);
            }
            else {
                bone2TargetPos = this.bone2DefaultPos.clone();
                bone1TargetPos = this.bone1DefaultPos.clone();
            }
            this.setMove(this.bone2.position, bone2TargetPos.clone(), this.bone2CachePos, this.bone2);
            this.setMove(this.bone1.position, bone1TargetPos.clone(), this.bone1CachePos, this.bone1);
            this.bone2.lookAt(bone2TargetPos.clone().negate());
            this.bone1.lookAt(bone1TargetPos.clone().negate());
        }
    };
    House2.prototype.has = function () {
        var mousePos = this.parent.worldToLocal(Vars.mousePosition.clone());
        mousePos.y -= 5;
        this.setMove(this.position, mousePos.clone(), this.cachePos, this);
        this.hasStep2();
    };
    House2.prototype.hasStep2 = function () {
        var thisWorldPosition = this.parent.localToWorld(this.position.clone());
        var bone2TargetPos = this.bone1.worldToLocal(thisWorldPosition.clone());
        bone2TargetPos.z = this.bone2DefaultPos.z;
        this.setMove(this.bone2.position, bone2TargetPos, this.bone2CachePos, this.bone2);
        var bone1TargetPos = bone2TargetPos.clone().multiplyScalar(.5);
        this.setMove(this.bone1.position, bone1TargetPos, this.bone1CachePos, this.bone1);
        this.bone2.lookAt(bone2TargetPos.clone().negate());
        this.bone1.lookAt(bone1TargetPos.clone().negate());
    };
    House2.prototype.setMove = function (pos, targetPos, cachePos, object) {
        var obj = ThreeManager.easingVector3Bane(pos, targetPos, cachePos);
        object.position.copy(obj.pos);
        cachePos.copy(obj.cache);
    };
    House2.prototype.mouseUp = function () {
        if (this.hasFlag) {
            this.releaseFlag = true;
            var mousePos = this.parent.worldToLocal(Vars.mousePosition.clone());
            var lastMousePos = this.parent.worldToLocal(Vars.lastMousePosition.clone());
            this.releaseVec.copy(mousePos.sub(lastMousePos));
            this.releaseVec.y += -1;
        }
        else {
            this.reset();
        }
    };
    House2.prototype.reset = function () {
        TweenManager.addTweenPosition(this.bone2, this.bone2DefaultPos, 500, TWEEN.Easing.Elastic.Out);
        TweenManager.addTweenQuaternion(this.bone2, new THREE.Quaternion(0, 0, 0, 1), 500, TWEEN.Easing.Elastic.Out);
        TweenManager.addTweenPosition(this.bone1, this.bone1DefaultPos, 500, TWEEN.Easing.Elastic.Out);
        TweenManager.addTweenQuaternion(this.bone1, new THREE.Quaternion(0, 0, 0, 1), 500, TWEEN.Easing.Elastic.Out);
    };
    House2.prototype.animate = function () {
        if (this.releaseFlag) {
            this.hasStep2();
            this.releaseVec.y += -.1;
            this.position.add(this.releaseVec.clone());
            if (this.position.length() > 200) {
                this.hasFlag = false;
                this.releaseFlag = false;
                this.dragTime = 0;
                this.position.copy(this.defaultPos);
                this.reset();
            }
        }
    };
    return House2;
})(GameObject);
var HouseInner = (function (_super) {
    __extends(HouseInner, _super);
    function HouseInner() {
        _super.call(this);
        this.wallMesh = MeshManager.duplicate(AssetManager.assets.objects['houseInnerWall']);
        this.wallMesh.position.set(0, 0, 0);
        MaterialManager.setMaterial(this.wallMesh, 'houseInner');
        this.add(this.wallMesh);
    }
    return HouseInner;
})(GameObject);
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(name, url, maxLifeTime) {
        _super.call(this);
        this.maxLifeTime = 10;
        this.startLifeTime = 0;
        this.fadeFlag = false;
        this.fadeTime = 1000;
        this.name = name;
        this.maxLifeTime = maxLifeTime;
        this.startLifeTime = Vars.elapsedTime;
        this.createSprite(url);
        this.rigidData.bodyName = this.name;
        this.rigidData.shapeType = 'sphere';
        this.rigidData.size = .5;
        this.setRigidBody();
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    Item.prototype.lifeTimeCheck = function () {
        if (this.fadeFlag == true)
            return;
        if (Vars.elapsedTime - this.startLifeTime > this.maxLifeTime) {
            this.fadeFlag = true;
            new TWEEN.Tween(this.sprite.material).to({ opacity: 0 }, this.fadeTime).easing(TWEEN.Easing.Linear.None).onUpdate(function (self) {
                this.sprite.material.needsUpdate = true;
            }.bind(this)).onComplete(function (self) {
                this.dead();
            }.bind(this)).start();
        }
    };
    Item.prototype.dead = function () {
        this.deadFlag = true;
        this.visible = false;
        PhysicsManager.setPosition(this.rigidBodyIndex, new THREE.Vector3(0, 100, 0));
        setTimeout(function () {
            PhysicsManager.setMassProps(this.rigidBodyIndex, 0);
        }.bind(this), 10);
    };
    Item.prototype.revive = function (pos) {
        if (!this.deadFlag)
            return;
        this.fadeFlag = false;
        this.deadFlag = false;
        this.visible = true;
        this.startLifeTime = Vars.elapsedTime;
        this.sprite.material.opacity = 1;
        this.sprite.material.needsUpdate = true;
        PhysicsManager.setMassProps(this.rigidBodyIndex, 1);
        PhysicsManager.setPosition(this.rigidBodyIndex, pos);
    };
    Item.prototype.movement = function () {
        if (this.position.y < -10 && !this.deadFlag) {
            PhysicsManager.setPosition(this.rigidBodyIndex, new THREE.Vector3(0, 5, 0));
        }
    };
    Item.prototype.animate = function () {
        this.lifeTimeCheck();
        this.movement();
    };
    return Item;
})(GameObject);
var ItemScakuranbo = (function (_super) {
    __extends(ItemScakuranbo, _super);
    function ItemScakuranbo(name) {
        _super.call(this, name, 'img/item_sakuranbo.png', 10);
        var uvs = [];
        uvs[0] = new THREE.Vector2(0, 0);
        uvs[1] = new THREE.Vector2(.5, .5);
        uvs[2] = new THREE.Vector2(0, .5);
        var index = Math.random() * 3;
        index = Math.floor(index);
        this.sprite.material.map.repeat.set(.5, .5);
        this.sprite.material.map.offset.copy(uvs[index]);
    }
    return ItemScakuranbo;
})(Item);
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        _super.call(this, new THREE.Vector3(0, .1, 0));
        this.materials = [];
        this.textures = [];
        this.height = 2;
        this.lastDirection = new THREE.Vector3();
        this.walkSpeed = 3;
        this.runSpeed = 6;
        this.forceFlag = false;
        this.fallFlag = false;
        this.moveTargetOPointsLength = 0;
        this.moveTargetUPointsLength = 0;
        this.runSoundId = -1;
        this.runSoundVolume = .5;
        this.minScale = 1;
        this.stageClearFlag = false;
        this.name = 'player';
        this.mesh = MeshManager.getAnimationMesh(AssetManager.playerGeometry, MaterialManager.playerMaterials);
        this.mesh.castShadow = true;
        this.add(this.mesh);
        this.setProperty();
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    Player.prototype.setProperty = function () {
        this.moveFlag = false;
        this.animationStep = 4;
        this.animationFps = 40 / this.animationStep;
        this.setMorphAnimationKey('walk', 0, 10);
        this.setMorphAnimationKey('run', 11, 15);
        this.setMorphAnimationKey('default', 16, 20);
        this.setMorphAnimationKey('caught', 21, 22);
        this.setMorphAnimationKey('defaultCatch', 23, 27);
        this.setMorphAnimationKey('walkCatch', 28, 37);
        this.setMorphAnimationKey('runCatch', 38, 42);
        this.setMorphAnimationKey('throw', 43, 55);
        this.setMorphAnimationKey('jump', 55, 61);
        this.playAnimation('walk');
        this.meshForwardNegateFlag = true;
        this.rigidData = {
            shapeType: 'sphere',
            size: .5,
            mass: 40,
            mouseEnabled: true,
            origin: new THREE.Vector3(0, -1, 0),
            noRotFlag: true
        };
        this.setRigidBody();
        PhysicsManager.setRotationLimit(this.rigidBodyIndex, new THREE.Vector3(0, 0, 0));
        this.hitRadius = 1.6;
        this.setMoveType({ type: 'mouse', speed: this.walkSpeed, speedChangeRange: 3, maxSpeed: this.runSpeed });
        this.minScale = 1;
        this.setDefaultScale(2);
        TweenManager.addTweenScale(this.mesh, new THREE.Vector3(this.defaultScale, this.defaultScale, this.defaultScale), 1000, TWEEN.Easing.Elastic.Out);
        if (Vars.quality != 'low')
            this.runSmorkParticle = new RunSmorkParticle(this);
        this.runSoundId = SoundManager.play(9, true, 0);
        SoundManager.setInstanceVolume(this.runSoundId, 0);
        Vars.pushRightClickFunc(this.rightClickHandler.bind(this));
        setTimeout(function () {
            this.visible = false;
        }.bind(this), 100);
    };
    Player.prototype.start = function () {
        this.visible = true;
        this.mesh.scale.copy(new THREE.Vector3(.01, .01, .01));
        this.mesh.updateMatrix();
        this.nowTween = TweenManager.addTweenScale(this.mesh, new THREE.Vector3(this.nowScale, this.nowScale, this.nowScale), 500, TWEEN.Easing.Elastic.Out, 0, this.startComp.bind(this));
    };
    Player.prototype.startComp = function () {
        this.playAnimation('jump');
        SceneManager.scene.starParticle1.position.set(0, 0, 0);
        ParticleManager.on('starParticle1');
        setTimeout(function () {
            ParticleManager.off('starParticle1');
        }.bind(this), 1000);
        setTimeout(function () {
            this.moveFlag = true;
        }.bind(this), 1000);
    };
    Player.prototype.animate = function () {
        if (this.moveFlag || this.stageClearFlag) {
            this.catchTargetMove();
            this.setState();
        }
    };
    Player.prototype.setState = function () {
        if (this.throwingFlag || this.deadFlag)
            return;
        if (this.stageClearFlag) {
            this.playAnimation('jump');
            if (Vars.quality != 'low')
                this.runSmorkParticle.off();
            SoundManager.setInstanceVolume(this.runSoundId, 0);
            var direction = Vars.mousePosition.clone().sub(this.position.clone()).normalize();
            this.lastDirection.copy(direction);
            this.setLookAt(direction);
            return;
        }
        if (Vars.downDirection.x != 0) {
            var rot = Vars.groundRot.z - Vars.targetRotDefault.z;
        }
        else {
            rot = Vars.groundRot.x - Vars.targetRotDefault.x;
        }
        rot = Math.abs(rot);
        if (rot > 10) {
            direction = Vars.downDirection.clone();
            if (Vars.mouseDragOffsetY > 0) {
                direction.multiplyScalar(-1);
            }
            if (this.catchingFlag) {
                this.playAnimation('runCatch');
            }
            else {
                this.playAnimation('run');
            }
            if (Vars.quality != 'low')
                this.runSmorkParticle.on();
            SoundManager.setInstanceVolume(this.runSoundId, this.runSoundVolume);
            if (!this.forceFlag) {
                this.forceFlag = true;
                PhysicsManager.setForceFlag(this.rigidBodyIndex, this.forceFlag);
            }
        }
        else {
            if (this.speed > 0) {
                direction = this.getMoveProp().targetPosition.clone().sub(this.position.clone()).normalize();
                if (this.speed == this.runSpeed) {
                    if (this.catchingFlag) {
                        this.playAnimation('runCatch');
                    }
                    else {
                        this.playAnimation('run');
                    }
                    if (Vars.quality != 'low')
                        this.runSmorkParticle.on();
                    SoundManager.setInstanceVolume(this.runSoundId, this.runSoundVolume);
                }
                else {
                    if (this.catchingFlag) {
                        this.playAnimation('walkCatch');
                    }
                    else {
                        this.playAnimation('walk');
                    }
                    if (Vars.quality != 'low')
                        this.runSmorkParticle.off();
                    SoundManager.setInstanceVolume(this.runSoundId, 0);
                }
            }
            else {
                if (this.catchingFlag) {
                    this.playAnimation('defaultCatch');
                }
                else {
                    this.playAnimation('default');
                }
                if (Vars.quality != 'low')
                    this.runSmorkParticle.off();
                SoundManager.setInstanceVolume(this.runSoundId, 0);
                direction = this.lastDirection;
            }
            if (this.forceFlag) {
                this.forceFlag = false;
                PhysicsManager.setForceFlag(this.rigidBodyIndex, this.forceFlag);
            }
        }
        this.lastDirection.copy(direction);
        this.setLookAt(direction);
    };
    Player.prototype.setLookAt = function (direction) {
        direction.y = 0;
        this.mesh.lookAt(this.mesh.position.clone().add(direction));
    };
    Player.prototype.catchTargetMove = function () {
        if (!this.catchingFlag)
            return;
        this.catchTarget.rotation.copy(this.mesh.rotation);
        var forward = ThreeManager.getForward(this.mesh).negate();
        var catchTargetPos = forward.multiplyScalar(this.catchTargetPosition.z);
        catchTargetPos.y = this.catchTargetPosition.y;
        this.catchTarget.position.copy(catchTargetPos);
    };
    Player.prototype.nekoGOAnimate = function () {
        if (this.position.y < -10 && this.rigidFlag && !this.deadFlag) {
            PhysicsManager.resetVelocity(this.rigidBodyIndex);
            PhysicsManager.setPosition(this.rigidBodyIndex, this.revivePosition);
            this.show(1000, 1000 * Math.random());
            if (this.moveFlag)
                DomManager.hitPointContainer.remove();
        }
    };
    Player.prototype.catching = function () {
        SoundManager.play(7, false);
    };
    Player.prototype.rightClickHandler = function () {
        this.releaseAction();
    };
    Player.prototype.releaseAction = function () {
        if (!this.throwingFlag && this.catchingFlag) {
            this.setThrowingAnimation();
            setTimeout(function () {
                this.release();
                DomManager.mouseNavi.hide();
                SoundManager.play(4, false);
            }.bind(this), 600);
        }
    };
    Player.prototype.setThrowingAnimation = function () {
        this.throwingFlag = true;
        this.playAnimation('throw');
        setTimeout(function () {
            this.throwingFlag = false;
        }.bind(this), 1000);
    };
    Player.prototype.setPlayerMoveTargets = function (type) {
        if (!this.moveTargetOPointsLength || !this.moveTargetOPointsLength)
            return;
        if (type == 'reset')
            this.getMover().clearMoveTargets('player');
        if (Vars.reverseFlag) {
            var targets = this.getMoveTargets('ura');
        }
        else {
            targets = this.getMoveTargets('omote');
        }
        if (type == 'update')
            this.getMover().updateMoveTargets('player', targets);
        if (type == 'reset')
            this.getMover().setMoveTargets('player', targets);
    };
    Player.prototype.getMoveTargets = function (type) {
        var targets = [];
        var length = this.moveTargetOPointsLength;
        if (type == 'ura')
            length = this.moveTargetUPointsLength;
        for (var i = 0; i < length; i++) {
            if (type == 'omote') {
                var pos = this.ground.moveTargetOPoints[i].position.clone();
            }
            else {
                pos = this.ground.moveTargetUPoints[i].position.clone();
            }
            pos = this.ground.localToWorld(pos);
            targets.push(pos);
        }
        return targets;
    };
    Player.prototype.hit = function (hitTarget) {
        if (hitTarget.assetName == 'zako') {
            if (Vars.inGameFlag)
                DomManager.hitPointContainer.remove();
        }
    };
    Player.prototype.groundHit = function (object) {
        var name = object.name;
        if (this.deadFlag)
            return;
        if (DomManager.hitPointContainer.hitPoint > 1) {
            PhysicsManager.resetVelocity(this.rigidBodyIndex);
            PhysicsManager.setPosition(this.rigidBodyIndex, this.revivePosition);
            this.show(1000, 1000 * Math.random());
        }
        else {
            TweenManager.addTweenScale(this.mesh, new THREE.Vector3(.01, .01, .01), 700, TWEEN.Easing.Elastic.Out);
            SceneManager.scene.starParticle1.position.copy(this.position);
            ParticleManager.on('starParticle1');
            setTimeout(function () {
                ParticleManager.off('starParticle1');
            }.bind(this), 500);
        }
        DomManager.hitPointContainer.remove();
    };
    Player.prototype.restart = function () {
        this.deadFlag = false;
        this.playAnimation('default');
        if (Vars.quality != 'low')
            this.runSmorkParticle.off();
        this.mesh.scale.set(.01, .01, .01);
        this.mesh.updateMatrix();
    };
    return Player;
})(NekoGameObject);
var Spike = (function (_super) {
    __extends(Spike, _super);
    function Spike(stageIndex, index) {
        _super.call(this);
        this.hitArea = {};
        this.rigidData = {
            shapeType: 'box',
            mass: 0
        };
        this.reset(stageIndex, index);
    }
    Spike.prototype.reset = function (stageIndex, index) {
        this.data = StageData.stages[stageIndex]['spikes'][index];
        this.name = 'spike' + index;
        this.assetName = 'spike';
        this.rigidName = 'spikeCollision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        if (!this.mesh)
            this.setMesh(null, 'spike', false, false);
        this.setVisible(true);
        this.setRigidBody();
        RaycastManager.add(this.mesh, false);
    };
    return Spike;
})(GameObject);
var Tree = (function (_super) {
    __extends(Tree, _super);
    function Tree(stageIndex, index) {
        _super.call(this);
        this.reset(stageIndex, index);
        this.mesh = MeshManager.duplicate(AssetManager.assets.objects['tree0']);
        this.mesh.position.set(0, 0, 0);
        MaterialManager.setMaterial(this.mesh, 'groundGrass');
        MaterialManager.setMaterial(this.mesh, 'grassDepth');
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.rigidData = {
            shapeType: 'cylinder',
            mass: 1,
            mouseEnabled: true,
            origin: new THREE.Vector3(0, -1, 0)
        };
    }
    Tree.prototype.reset = function (stageIndex, index) {
        this.data = StageData.stages[stageIndex]['trees'][index];
        this.name = this.data.name + index;
        this.assetName = this.data.name;
        this.rigidName = 'tree0Collision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        this.setVisible(true);
    };
    return Tree;
})(NekoGameObject);
var TreeMesh = (function (_super) {
    __extends(TreeMesh, _super);
    function TreeMesh(index, groundSize, callBack) {
        _super.call(this, AssetManager.assets.objects['tree0'].geometry, AssetManager.assets.objects['tree0'].material);
        this.defaultPos = new THREE.Vector3();
        this.defaultScale = 1;
        MaterialManager.setMaterial(this, 'groundGrass');
        MaterialManager.setMaterial(this, 'grassDepth');
        this.castShadow = true;
        var y = Math.round(Math.random()) * 1;
        if (y == 0)
            y = -1;
        this.position.x = Math.random() * groundSize.x - groundSize.x / 2;
        this.position.y = y * (groundSize.y / 2);
        this.position.z = Math.random() * groundSize.z - groundSize.z / 2;
        this.defaultPos.copy(this.position);
        this.rotation.set(-90 * Vars.toRad, 0, 0);
        if (y == -1) {
            this.rotation.x += 180 * Vars.toRad;
        }
        var s = .5 + .5 * Math.random();
        this.defaultScale = s;
        this.scale.set(.01, .01, .01);
        this.updateMatrix();
        TweenManager.addTweenScale(this, new THREE.Vector3(this.defaultScale, this.defaultScale, this.defaultScale), 800, TWEEN.Easing.Elastic.Out, 100 * index, callBack);
    }
    return TreeMesh;
})(THREE.Mesh);
var Tsuribashi = (function (_super) {
    __extends(Tsuribashi, _super);
    function Tsuribashi(stageIndex, index) {
        _super.call(this);
        this.reset(stageIndex, index);
        this.size.copy(MeshManager.getSize(this.mesh));
        this.size.set(this.size.x, this.size.z, this.size.y);
    }
    Tsuribashi.prototype.reset = function (stageIndex, index) {
        this.data = StageData.stages[stageIndex]['tsuribashis'][index];
        this.name = 'tsuribashi' + index;
        this.assetName = 'tsuribashi';
        this.rigidName = 'tsuribashiCollision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        if (!this.mesh)
            this.setMesh(null, 'groundGrass', true, false);
        setTimeout(function () {
            this.setVisible(false);
        }.bind(this), 1000);
        if (this.data.visible) {
            var index = this.setRigidBodyManyShape();
        }
    };
    return Tsuribashi;
})(GameObject);
var Ufo = (function (_super) {
    __extends(Ufo, _super);
    function Ufo() {
        _super.call(this);
        this.vacuumFlag = false;
        this.name = 'ufo';
        this.position.y = 10;
        this.mesh = MeshManager.duplicate(AssetManager.assets.objects['ufo']);
        this.mesh.name = 'ufo';
        this.mesh.position.set(0, 0, 0);
        this.setMouseEnabled(this.mesh, true);
        this.add(this.mesh);
        this.ufoRayMesh = MeshManager.duplicate(AssetManager.assets.objects['ufoRay']);
        this.ufoRayMesh.position.set(0, 0, 0);
        MaterialManager.setMaterial(this.ufoRayMesh, 'ufoRay');
        this.add(this.ufoRayMesh);
        setInterval(this.setTargetObject.bind(this), 2000);
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    Ufo.prototype.setTargetObject = function () {
        if (this.targetObject || this.vacuumFlag || !this.visible)
            return;
        for (var i = 0; i < Vars.objectsLength; i++) {
            if (Vars.objects[i].visible)
                this.targetObject = Vars.objects[i];
        }
        if (!this.targetObject)
            this.hide();
    };
    Ufo.prototype.vacuumTargetObject = function () {
        this.vacuumFlag = true;
        TweenManager.addTweenRigidBodyPosition(this.targetObject, this.position, 500, TWEEN.Easing.Linear.None, 0, this.vacuumAnimeComp.bind(this));
        TweenManager.addTweenScale(this.targetObject.mesh, new THREE.Vector3(.1, .1, .1), 500, TWEEN.Easing.Linear.None);
    };
    Ufo.prototype.vacuumAnimeComp = function () {
        this.vacuumFlag = false;
        this.targetObject.setVisible(false);
        this.targetObject.mesh.scale.multiplyScalar(10);
        this.targetObject.mesh.updateMatrix();
        this.targetObject = null;
    };
    Ufo.prototype.hide = function () {
        var pos = this.position.clone().add(new THREE.Vector3(0, 5, 0));
        TweenManager.addTweenPosition(this, pos, 500, TWEEN.Easing.Linear.None);
        TweenManager.addTweenScale(this, new THREE.Vector3(.1, .1, .1), 500, TWEEN.Easing.Linear.None, 0, this.fadeComp.bind(this));
    };
    Ufo.prototype.fadeComp = function () {
        this.setVisible(false);
        this.scale.multiplyScalar(10);
        this.updateMatrix();
    };
    Ufo.prototype.animate = function () {
        if (!this.visible)
            return;
        if (this.targetObject && !this.vacuumFlag) {
            this.position.x += -(this.position.x - this.targetObject.position.x) / 10;
            var targetY = this.targetObject.position.y + 10;
            this.position.y += -(this.position.y - targetY) / 10;
            this.position.z += -(this.position.z - this.targetObject.position.z) / 10;
            var pos = this.position.clone();
            pos.y = 0;
            var targetPos = this.targetObject.position.clone();
            targetPos.y = 0;
            if (pos.distanceTo(targetPos) < 1 && !this.vacuumFlag) {
                this.vacuumTargetObject();
            }
        }
    };
    return Ufo;
})(GameObject);
var Warp = (function (_super) {
    __extends(Warp, _super);
    function Warp(stageIndex, index) {
        _super.call(this);
        this.hitFlag = false;
        this.reset(stageIndex, index);
        this.setMesh(null, 'warp', false, false);
        if (Vars.quality != 'low') {
            var particle = new WarpParticle1();
            ParticleManager.setParticle(particle, 'warpParticle1');
            this.add(particle);
        }
    }
    Warp.prototype.hit = function (player) {
        if (this.hitFlag || !this.visible)
            return;
        this.hitFlag = true;
        StageManager.stageClear();
    };
    Warp.prototype.reset = function (stageIndex, index) {
        this.data = StageData.stages[stageIndex]['warps'][index];
        this.name = this.data.name + index;
        this.assetName = this.data.name;
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        this.hitFlag = false;
        this.setVisible(true);
    };
    return Warp;
})(GameObject);
var Zako = (function (_super) {
    __extends(Zako, _super);
    function Zako(stageIndex, index) {
        _super.call(this);
        this.data = {};
        this.lastHitTime = 0;
        this.player = SceneManager.scene.getObjectByName('player', false);
        this.maxHitCheckTime = .1;
        this.mesh = MeshManager.getAnimationMesh(AssetManager.zakoGeometry, [MaterialManager.zakoMaterial]);
        this.mesh.castShadow = true;
        this.add(this.mesh);
        this.setDefaultScale(2);
        this.setMouseEnabled(this.mesh, true);
        this.setCatchMouseEvents();
        this.animationStep = 1;
        this.animationFps = 40 / this.animationStep;
        this.setMorphAnimationKey('walk', 0, 29);
        this.setMorphAnimationKey('tame', 30, 35);
        this.playAnimation('walk');
        this.reset(stageIndex, index);
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    Zako.prototype.animate = function () {
        if (this.moveType && this.moveType != '')
            this.setState();
    };
    Zako.prototype.setState = function () {
        if (this.moveType == 'attack' || this.catchFlag)
            return;
        if (this.position.distanceTo(this.player.position.clone()) < 3) {
            this.moveType = 'attack';
            this.playAnimation('tame');
            setTimeout(function () {
                this.attack();
            }.bind(this), 500);
        }
        switch (this.moveType) {
            case 'stalker':
                this.lookAtPlayer();
                break;
        }
    };
    Zako.prototype.lookAtPlayer = function () {
        var targetPos = this.player.position.clone();
        var direction = targetPos.sub(this.position.clone()).normalize();
        direction.y = 0;
        this.mesh.lookAt(this.mesh.position.clone().add(direction));
    };
    Zako.prototype.attack = function () {
        if (this.catchFlag)
            return;
        this.setHitTarget(this.player);
        this.lookAtPlayer();
        MaterialManager.zakoMaterial.uniforms.color.value = new THREE.Vector4(1, 0, 0, 1);
        this.mesh.material = MaterialManager.zakoMaterial;
        this.mesh.material.needsUpdate = true;
        if (this.meshForwardNegateFlag) {
            var forward = SceneManager.scene.localToWorld(ThreeManager.getForward(this.mesh).clone()).negate();
        }
        else {
            forward = SceneManager.scene.localToWorld(ThreeManager.getForward(this.mesh).clone());
        }
        var targetPos = this.player.position.clone();
        PhysicsManager.applyImpulse(this.rigidBodyIndex, this.position.clone(), targetPos.clone(), 3);
        setTimeout(function () {
            this.setMoveType({ type: 'stalker', target: this.player, speed: 4, range: 5 });
            this.playAnimation('walk');
            this.clearHitTargets();
        }.bind(this), 1000);
    };
    Zako.prototype.reset = function (stageIndex, index) {
        this.data = StageData.stages[stageIndex]['zakos'][index];
        this.name = this.data.name + index;
        this.assetName = this.data.name;
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        this.setVisible(true);
        this.hitPoint = 3;
        this.deadFlag = false;
        this.rigidData = {
            shapeType: 'sphere',
            size: .3,
            mass: 1,
            mouseEnabled: false,
            origin: new THREE.Vector3(0, -1, 0),
            noRotFlag: true
        };
        this.setRigidBody();
        this.rigidBodyCheck();
        PhysicsManager.setRotationLimit(this.rigidBodyIndex, new THREE.Vector3(0, 0, 0));
    };
    Zako.prototype.rigidBodyCheck = function () {
        if (this.rigidBodyIndex == -1) {
            setTimeout(this.rigidBodyCheck.bind(this), 500);
            return;
        }
        this.setMoveType({ type: 'stalker', target: this.player, speed: 4, range: 5 });
    };
    Zako.prototype.hit = function (hitTarget) {
        if (this.deadFlag)
            return;
        if (hitTarget.assetName == 'box0') {
            if (hitTarget.bulletFlag && Vars.elapsedTime - this.lastHitTime > .5) {
                this.lastHitTime = Vars.elapsedTime;
                this.hitPoint--;
                if (this.hitPoint < 1)
                    this.dead();
                var pos = this.position.clone();
                pos.y += 1;
                SceneManager.scene.hitEffectParticle0.position.copy(pos);
                ParticleManager.on('hitEffectParticle0');
                setTimeout(function () {
                    ParticleManager.off('hitEffectParticle0');
                }.bind(this), 500);
                hitTarget.hitFlag = true;
                setTimeout(function () {
                    hitTarget.hitFlag = false;
                }, 500);
            }
        }
    };
    Zako.prototype.dead = function () {
        this.deadFlag = true;
        console.log('dead zako!');
        this.setVisible(false);
        SceneManager.scene.starParticle1.position.copy(this.position);
        ParticleManager.on('starParticle1');
        setTimeout(function () {
            ParticleManager.off('starParticle1');
        }.bind(this), 500);
    };
    Zako.prototype.wasCaught = function () {
        this.moveType = '';
    };
    Zako.prototype.bulletEnd = function () {
        PhysicsManager.setQuaternion(this.rigidBodyIndex, new THREE.Quaternion());
        this.setMoveType({ type: 'stalker', target: this.player, speed: 4, range: 5 });
    };
    return Zako;
})(NekoGameObject);
var GeometryManager;
(function (GeometryManager) {
    function mergeSingleUV(meshs, length) {
        if (length === void 0) { length = null; }
        if (!length)
            var length = meshs.length;
        var geometry = new THREE.Geometry();
        for (var i = 0; i < length; i++) {
            meshs[i].updateMatrix();
            geometry.merge(meshs[i].geometry, meshs[i].matrix, i);
        }
        return geometry;
    }
    GeometryManager.mergeSingleUV = mergeSingleUV;
    function mergeMultiUV(meshs, length) {
        if (length === void 0) { length = null; }
        if (!length)
            var length = meshs.length;
        var geometry = new THREE.Geometry();
        for (var i = 0; i < length; i++) {
            meshs[i].updateMatrix();
            geometry.merge(meshs[i].geometry, meshs[i].matrix, 0);
        }
        return geometry;
    }
    GeometryManager.mergeMultiUV = mergeMultiUV;
})(GeometryManager || (GeometryManager = {}));
var GlowObject = (function () {
    function GlowObject(_original, _copy) {
        this.original = _original;
        this.copy = _copy;
    }
    return GlowObject;
})();
var GlowScene = (function (_super) {
    __extends(GlowScene, _super);
    function GlowScene() {
        _super.call(this);
        GlowCameraManager.init();
        this.initLight();
    }
    GlowScene.prototype.initLight = function () {
        var light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(300, 1000, -100);
        this.add(light);
    };
    return GlowScene;
})(THREE.Scene);
var GroundManager;
(function (GroundManager) {
    var initFlag = false;
    var positions = [];
    GroundManager.groundSize = new THREE.Vector3(100, 100, 100);
    GroundManager.grounds = [];
    var oldCameraPos = new THREE.Vector3();
    function init() {
        for (var i = 0; i < 3; i++) {
            positions[i] = [];
            for (var j = 0; j < 3; j++) {
                positions[i].push(new THREE.Vector3());
            }
        }
    }
    GroundManager.init = init;
    function initGround(meshs) {
        var index = 0;
        var length = meshs.length;
        for (var i = 0; i < 9; i++) {
            var mesh = MeshManager.duplicate(meshs[index]);
            GroundManager.grounds.push(mesh);
            index++;
            if (index == length)
                index = 0;
        }
        setPositions();
        setGroundPosition();
        initFlag = true;
        return GroundManager.grounds;
    }
    GroundManager.initGround = initGround;
    function setPositions() {
        var cameraPos = getCameraPos();
        if (cameraPos.x != oldCameraPos.x || cameraPos.z != oldCameraPos.z)
            scrollGround(cameraPos);
        var pluseX = -1;
        var pluseZ = -1;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var x = cameraPos.x + pluseX;
                var z = cameraPos.z + pluseZ;
                positions[i][j] = new THREE.Vector3(x, 0, z);
                pluseZ++;
            }
            pluseZ = -1;
            pluseX++;
        }
        oldCameraPos = cameraPos.clone();
    }
    function getCameraPos() {
        var pos = CameraManager.camera.position.clone();
        var x = Math.round(pos.x / GroundManager.groundSize.x);
        var y = Math.round(pos.y / GroundManager.groundSize.y);
        var z = Math.round(pos.z / GroundManager.groundSize.z);
        return new THREE.Vector3(x, y, z);
    }
    function setGroundPosition() {
        var index = 0;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var x = positions[i][j].x * GroundManager.groundSize.x;
                var z = positions[i][j].z * GroundManager.groundSize.z;
                GroundManager.grounds[index].position.set(x, 0, z);
                index++;
            }
        }
        return GroundManager.grounds;
    }
    function update() {
        if (initFlag) {
            setPositions();
            setGroundPosition();
        }
    }
    GroundManager.update = update;
    function scrollGround(cameraPos) {
        var index = 0;
        var g = [];
        for (var i = 0; i < 3; i++) {
            g[i] = [];
            for (var j = 0; j < 3; j++) {
                g[i].push(GroundManager.grounds[index]);
                index++;
            }
        }
        var x = cameraPos.x - oldCameraPos.x;
        var z = cameraPos.z - oldCameraPos.z;
        if (x > 0) {
            var xg = g.shift();
            g.push(xg);
        }
        else if (x < 0) {
            xg = g.pop();
            g.unshift(xg);
        }
        if (z > 0) {
            for (i = 0; i < 3; i++) {
                zg = g[i].shift();
                g[i].push(zg);
            }
        }
        else if (z < 0) {
            for (i = 0; i < 3; i++) {
                var zg = g[i].pop();
                g[i].unshift(zg);
            }
        }
        var index = 0;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                GroundManager.grounds[index] = g[i][j];
                index++;
            }
        }
    }
})(GroundManager || (GroundManager = {}));
var Layer = (function (_super) {
    __extends(Layer, _super);
    function Layer() {
        _super.call(this);
        var w = Vars.stageWidth * .5;
        var h = Vars.stageHeight * .5;
        var fov = 45;
        var aspect = Vars.stageWidth / Vars.stageHeight;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, .1, 1000);
        this.camera.position.z = -10;
        var geometry = new THREE.CylinderGeometry(50, 50, 1000, 40, 40, true);
        this.tunnelMesh = new THREE.Mesh(geometry, MaterialManager.tunnelMaterial);
        this.tunnelMesh.castShadow = true;
        this.add(this.tunnelMesh);
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    Layer.prototype.animate = function () {
        if (!RendererManager.layerFlag)
            return;
        var pos = this.camera.position.clone();
        var forward = ThreeManager.getForward(this.camera);
        pos.add(forward.multiplyScalar(50));
        this.tunnelMesh.position.copy(pos);
        this.tunnelMesh.lookAt(this.camera.position);
        this.tunnelMesh.rotation.x += 90 * Math.PI / 180;
    };
    return Layer;
})(THREE.Scene);
var LightManager;
(function (LightManager) {
    LightManager.light;
    var lightDefaultPos = new THREE.Vector3(10, 30, -1);
    var SHADOW_MAP_WIDTH = 512;
    var SHADOW_MAP_HEIGHT = 512;
    var targetPos = new THREE.Vector3();
    var raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0));
    function init() {
        LightManager.light = new THREE.DirectionalLight(0xffffff, 1);
        LightManager.light.position.copy(lightDefaultPos);
        if (Vars.quality == 'low')
            return;
        LightManager.light.onlyShadow = true;
        LightManager.light.castShadow = true;
        LightManager.light.shadowCameraNear = 10;
        LightManager.light.shadowCameraFar = 50;
        var radius = 30;
        LightManager.light.shadowCameraLeft = -radius;
        LightManager.light.shadowCameraRight = radius;
        LightManager.light.shadowCameraTop = radius;
        LightManager.light.shadowCameraBottom = -radius;
        LightManager.light.shadowBias = 0.0001;
        LightManager.light.shadowDarkness = 0.5;
        if (Vars.quality == 'high') {
            LightManager.light.shadowMapWidth = SHADOW_MAP_WIDTH * 2;
            LightManager.light.shadowMapHeight = SHADOW_MAP_HEIGHT * 2;
        }
        else {
            LightManager.light.shadowMapWidth = SHADOW_MAP_WIDTH;
            LightManager.light.shadowMapHeight = SHADOW_MAP_HEIGHT;
        }
    }
    LightManager.init = init;
    function add() {
        if (Vars.quality == 'low')
            return;
        SceneManager.scene.add(LightManager.light);
    }
    LightManager.add = add;
    function shadowClippingPositionSet() {
        LightManager.light.target.position.copy(targetPos.clone());
        var pos = targetPos.clone().add(lightDefaultPos);
        LightManager.light.position.copy(pos);
    }
    LightManager.shadowClippingPositionSet = shadowClippingPositionSet;
    function setTargetPos(_targetPos) {
        if (Vars.quality == 'low')
            return;
        targetPos.copy(_targetPos);
        shadowClippingPositionSet();
    }
    LightManager.setTargetPos = setTargetPos;
})(LightManager || (LightManager = {}));
var LoadManager = (function () {
    function LoadManager(url, type, _callbackFunc) {
        this.jsonLoader = new THREE.JSONLoader();
        this.sceneLoader = new THREE.SceneLoader();
        this.callbackFunc = _callbackFunc;
        switch (type) {
            case "scene":
                this.sceneLoader.load(url, this.sceneLoadCompHandler.bind(this));
                break;
            case "json":
                this.jsonLoader.load(url, this.jsonLoadCompHandler.bind(this));
                break;
        }
    }
    LoadManager.prototype.sceneLoadCompHandler = function (result) {
        this.callbackFunc(result);
    };
    LoadManager.prototype.jsonLoadCompHandler = function (geometry, materials) {
        this.callbackFunc({ geometry: geometry });
    };
    LoadManager.prototype.setNormalMesh = function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.Mesh(geometry, material);
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        return mesh;
    };
    return LoadManager;
})();
var MaterialManager;
(function (MaterialManager) {
    MaterialManager.animateFlag = false;
    MaterialManager.callBack;
    var textures;
    var playerDiffuseMaterial;
    var playerOutlineMaterial;
    MaterialManager.playerMaterials;
    MaterialManager.playerMaterial;
    MaterialManager.shadowMaterial;
    var groundMaterial;
    var grassMaterial;
    var grassDepthMaterial;
    MaterialManager.groundGrassMaterial;
    var boxMaterial;
    var houseInnerMap;
    var houseInnerMaterial;
    var ufoRayMaterial;
    var warpMaterial;
    var warpBaseMaterial;
    var warpLightMaterial;
    var warpWaterMaterial;
    MaterialManager.circleMaterial;
    var bikkuriButtonMaterial1;
    var bikkuriButtonMaterial2;
    var spikeMaterial;
    MaterialManager.skyBoxMaterial;
    MaterialManager.tunnelMaterial;
    MaterialManager.zakoMaterial;
    MaterialManager.hitEffectMaterial0;
    MaterialManager.materials = {};
    function init() {
        var url = 'assets/models/player/diffuse.jpg';
        if (Vars.quality == 'low')
            url = 'assets/models/player/diffuse_low.jpg';
        var playerMap = THREE.ImageUtils.loadTexture(url);
        var playerDiffuseMaterial = new THREE.MeshBasicMaterial({
            map: playerMap,
            morphTargets: true
        });
        var playerOutlineMaterial = new THREE.MeshBasicMaterial({
            color: 0x2d1d5f,
            morphTargets: true
        });
        var playerTransparentMaterial = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/models/transparent2.png'),
            transparent: true,
            alphaTest: .5,
            side: THREE.DoubleSide,
            morphTargets: true
        });
        MaterialManager.playerMaterials = [playerDiffuseMaterial, playerOutlineMaterial, playerTransparentMaterial];
        MaterialManager.shadowMaterial = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/round_shadow.png'),
            transparent: true,
            alphaTest: .01,
            side: THREE.DoubleSide
        });
        url = 'assets/models/ground.jpg';
        if (Vars.quality == 'low')
            url = 'assets/models/ground_low.jpg';
        var groundTex = THREE.ImageUtils.loadTexture(url);
        groundMaterial = new THREE.MeshBasicMaterial({
            map: groundTex
        });
        MaterialManager.materials['ground'] = groundMaterial;
        url = 'assets/models/transparent1.png';
        if (Vars.quality == 'low')
            url = 'assets/models/transparent1_low.png';
        var grassTex = THREE.ImageUtils.loadTexture(url);
        grassMaterial = new THREE.MeshBasicMaterial({
            map: grassTex,
            alphaTest: .5,
            side: THREE.DoubleSide
        });
        MaterialManager.materials['grass'] = grassMaterial;
        var uniforms = { texture: { type: "t", value: grassTex } };
        var vertexShader = "        varying vec2 vUV;        void main() {            vUV = 0.75 * uv;            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );            gl_Position = projectionMatrix * mvPosition;        }";
        var fragmentShader = "uniform sampler2D texture;varying vec2 vUV;vec4 pack_depth( const in float depth ) {    const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );    const vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );    vec4 res = fract( depth * bit_shift );    res -= res.xxyz * bit_mask;    return res;}void main() {    vec4 pixel = texture2D( texture, vUV );    if ( pixel.a < 0.5 ) discard;    gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );}";
        grassDepthMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
        MaterialManager.materials['grassDepth'] = grassDepthMaterial;
        var ms = [groundMaterial, grassMaterial];
        MaterialManager.groundGrassMaterial = new THREE.MeshFaceMaterial(ms);
        MaterialManager.materials['groundGrass'] = MaterialManager.groundGrassMaterial;
        boxMaterial = new THREE.MeshBasicMaterial({
            map: groundTex
        });
        MaterialManager.materials['box'] = boxMaterial;
        houseInnerMap = THREE.ImageUtils.loadTexture('assets/models/house_inner.jpg');
        houseInnerMaterial = new THREE.MeshBasicMaterial({
            map: houseInnerMap,
            transparent: true
        });
        MaterialManager.materials['houseInner'] = houseInnerMaterial;
        var warpMaterials = [];
        var warpTex = THREE.ImageUtils.loadTexture('img/warp.png');
        warpBaseMaterial = new THREE.MeshBasicMaterial({
            map: warpTex,
        });
        warpMaterials.push(warpBaseMaterial);
        var waterTex = THREE.ImageUtils.loadTexture('img/warpWater.jpg');
        var overrayTex = THREE.ImageUtils.loadTexture('img/specular_map.jpg');
        overrayTex.wrapS = overrayTex.wrapT = THREE.RepeatWrapping;
        warpWaterMaterial = new THREE.ShaderMaterial({
            vertexShader: "        varying vec2 vUv;        void main(void) {            vec3 pos = position;            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);            vUv = uv;        }",
            fragmentShader: "        uniform sampler2D texture;        uniform sampler2D overlayTexture;        uniform float time;        varying vec2 vUv;        void main(void) {            vec4 tex1 = texture2D( texture, vec2( vUv.x, vUv.y ) );            vec4 tex2 = texture2D( overlayTexture, vec2( vUv.x + time, vUv.y ) );            vec4 c = tex1 + tex2 * .3;            gl_FragColor = c;        }",
            uniforms: {
                texture: {
                    type: 't',
                    value: waterTex
                },
                overlayTexture: {
                    type: 't',
                    value: overrayTex
                },
                lightDirection: {
                    type: 'v3',
                    value: LightManager.light.position.clone().normalize()
                },
                time: {
                    type: 'f',
                    value: 0.0
                }
            },
            blending: THREE.NoBlending,
        });
        warpMaterials.push(warpWaterMaterial);
        var lightTex = THREE.ImageUtils.loadTexture('img/warp_light2.png');
        lightTex.wrapS = lightTex.wrapT = THREE.RepeatWrapping;
        warpLightMaterial = new THREE.ShaderMaterial({
            vertexShader: "        varying vec2 vUv;        void main(void) {            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);            vUv = uv;        }",
            fragmentShader: "        uniform sampler2D texture;        uniform float time;        varying vec2 vUv;        void main(void) {            vec4 tex1 = texture2D( texture, vec2( vUv.x + time, vUv.y ) );            tex1.a *= .7;            gl_FragColor = tex1;        }",
            uniforms: {
                texture: {
                    type: 't',
                    value: lightTex
                },
                time: {
                    type: 'f',
                    value: 0.0
                }
            },
            blending: THREE.AdditiveBlending,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            depthTest: false
        });
        warpMaterials.push(warpLightMaterial);
        warpMaterial = new THREE.MeshFaceMaterial(warpMaterials);
        MaterialManager.materials['warp'] = warpMaterial;
        MaterialManager.circleMaterial = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/circle.png'),
            transparent: true,
            alphaTest: .5,
            side: THREE.DoubleSide
        });
        bikkuriButtonMaterial1 = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/bikkuri_button.jpg')
        });
        MaterialManager.materials['bikkuriButton1'] = bikkuriButtonMaterial1;
        bikkuriButtonMaterial2 = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/bikkuri_button2.jpg')
        });
        MaterialManager.materials['bikkuriButton2'] = bikkuriButtonMaterial2;
        var spikeMaterial1 = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0x2D0683
        });
        if (Vars.quality == 'low') {
            var spikeMaterial2 = new THREE.MeshBasicMaterial({
                color: 0xFF6962
            });
        }
        else {
            var c = new THREE.Color(0xFF6962);
            var spikeMaterial2 = new THREE.ShaderMaterial({
                vertexShader: "        uniform vec3 lightPos;        varying float diffuse;        void main(void) {            vec3 normal2 = normalize(normalMatrix * normal);            vec4 vLightPos = viewMatrix * vec4( lightPos, 1.0 );            vec4 mvPos = modelViewMatrix * vec4( position, 1.0 );            vec3 s = normalize( vLightPos.xyz - mvPos.xyz );            diffuse = max( dot( normal2, s ), 0.0 );            float specular = 2.7 * max( pow( diffuse, 5.5 ), 0.0 );            diffuse = diffuse + .3 + specular;            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);        }",
                fragmentShader: "        varying float diffuse;        uniform vec3 color;        void main(void) {            vec3 c = color * vec3(diffuse);            gl_FragColor = vec4(c, 1.0);        }",
                uniforms: {
                    lightPos: {
                        type: 'v3',
                        value: LightManager.light.position.clone()
                    },
                    color: {
                        type: 'v3',
                        value: new THREE.Vector3(c.r, c.g, c.b)
                    }
                },
                shading: THREE.FlatShading
            });
        }
        spikeMaterial = new THREE.MeshFaceMaterial([spikeMaterial1, spikeMaterial2]);
        MaterialManager.materials['spike'] = spikeMaterial;
        var blockMaterial1 = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0x2D0683
        });
        if (Vars.quality == 'low') {
            var block0Material2 = new THREE.MeshBasicMaterial({
                color: 0xBCE7E4
            });
        }
        else {
            var c = new THREE.Color(0xBCE7E4);
            var block0Material2 = new THREE.ShaderMaterial({
                vertexShader: "        uniform vec3 lightPos;        varying float diffuse;        void main(void) {            vec3 normal2 = normalize(normalMatrix * normal);            vec4 vLightPos = viewMatrix * vec4( lightPos, 1.0 );            vec4 mvPos = modelViewMatrix * vec4( position, 1.0 );            vec3 s = normalize( vLightPos.xyz - mvPos.xyz );            diffuse = max( dot( normal2, s ), 0.0 );            float specular = 2.7 * max( pow( diffuse, 5.5 ), 0.0 );            diffuse = diffuse + .3 + specular;            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);        }",
                fragmentShader: "        varying float diffuse;        uniform vec3 color;        void main(void) {            vec3 c = color * vec3(diffuse);            gl_FragColor = vec4(c, 1.0);        }",
                uniforms: {
                    lightPos: {
                        type: 'v3',
                        value: LightManager.light.position.clone()
                    },
                    color: {
                        type: 'v3',
                        value: new THREE.Vector3(c.r, c.g, c.b)
                    }
                },
                shading: THREE.FlatShading
            });
        }
        var block0Material = new THREE.MeshFaceMaterial([block0Material2, blockMaterial1]);
        MaterialManager.materials['block0'] = block0Material;
        var skyBoxTex = THREE.ImageUtils.loadTexture('img/skybox/skybox.jpg');
        var skyBoxPlaneTex = THREE.ImageUtils.loadTexture('img/bg0.jpg');
        skyBoxPlaneTex.wrapS = skyBoxPlaneTex.wrapT = THREE.RepeatWrapping;
        var graTex = THREE.ImageUtils.loadTexture('img/gra0.jpg');
        RendererManager.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat });
        var size = 200.0;
        if (platform == 'sp' || platform == 'ipad')
            size = 500.0;
        var stageSize = new THREE.Vector2(Vars.stageWidth, Vars.stageHeight);
        if (platform == 'sp' || platform == 'ipad') {
            stageSize = new THREE.Vector2(Vars.stageWidth * (window.devicePixelRatio / Vars.resolution), Vars.stageHeight * (window.devicePixelRatio / Vars.resolution));
        }
        var qualityLowFlag = 0.0;
        if (Vars.quality == 'low')
            qualityLowFlag = 1.0;
        MaterialManager.skyBoxMaterial = new THREE.ShaderMaterial({
            vertexShader: "        varying vec2 vUv;        void main(void) {            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);            vUv = uv;        }",
            fragmentShader: "uniform sampler2D texture;        uniform sampler2D overlayTexture;        uniform sampler2D graTex;        uniform sampler2D tunnelTex;        uniform float tunnelAlpha;        uniform float time;        uniform float size;        uniform vec2 stageSize;        uniform bool qualityLowFlag;        varying vec2 vUv;        vec4 getScrollBg(){            vec4 tex1 = texture2D( texture, vUv );            vec4 tex2 = texture2D( overlayTexture, vec2( gl_FragCoord.x, gl_FragCoord.y ) / vec2(size) + vec2(time)  );            if(qualityLowFlag){                return tex1 + tex2;            }else{                vec4 tex3 = texture2D( graTex, vec2( gl_FragCoord.x, gl_FragCoord.y ) / stageSize );                tex3.a = tex3.x;                tex3.xyz *= normalize(vec3(252, 95, 252));                return tex1 + tex2 + tex3;            }                    }        vec4 getTunnelBg(){                    vec4 c = texture2D( tunnelTex, vec2( gl_FragCoord.x, gl_FragCoord.y ) / stageSize );                        return vec4(c.xyz, tunnelAlpha);        }        vec3 alphaBlend( vec4 c1, vec4 c2 ){            vec3 c = c1.a * c1.xyz + ( 1.0 - c1.a ) * c2.xyz;            return c;        }        void main(void) {                        vec4 c;            if(tunnelAlpha == 0.0){                c = getScrollBg();            }else if(tunnelAlpha == 1.0){                c = getTunnelBg();            }else{                vec4 a = getScrollBg();                vec4 b = getTunnelBg();                c = vec4( alphaBlend( b, a ), 1.0);            }            gl_FragColor = c;        }",
            uniforms: {
                texture: {
                    type: 't',
                    value: skyBoxTex
                },
                overlayTexture: {
                    type: 't',
                    value: skyBoxPlaneTex
                },
                graTex: {
                    type: 't',
                    value: graTex
                },
                tunnelTex: {
                    type: 't',
                    value: RendererManager.renderTarget
                },
                tunnelAlpha: {
                    type: 'f',
                    value: 0.0
                },
                time: {
                    type: 'f',
                    value: 0.0
                },
                size: {
                    type: 'f',
                    value: size
                },
                stageSize: {
                    type: 'v2',
                    value: stageSize
                },
                qualityLowFlag: {
                    type: 'f',
                    value: qualityLowFlag
                }
            }
        });
        MaterialManager.materials['skyBox'] = MaterialManager.skyBoxMaterial;
        var rasterTexture = THREE.ImageUtils.loadTexture('img/raster.jpg');
        rasterTexture.wrapS = rasterTexture.wrapT = THREE.RepeatWrapping;
        var noiseTexture = THREE.ImageUtils.loadTexture('img/water1.jpg');
        noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
        var patternTexture = THREE.ImageUtils.loadTexture('img/bg1.jpg');
        patternTexture.wrapS = patternTexture.wrapT = THREE.RepeatWrapping;
        MaterialManager.tunnelMaterial = new THREE.ShaderMaterial({
            vertexShader: "uniform sampler2D texture;        uniform sampler2D rasterTex;        uniform float time;        varying vec2 vUv;        varying vec4 mPos;        void main(){        vec3 tex = texture2D( rasterTex,  vec2(uv.x, uv.y + .2) ).xyz;        float rot = fract(time * .03);        rot *= 360.0;        float radius = tex.x * 60.0;        vec3 p = vec3(position.x + radius * cos(rot), position.y, position.z + radius * sin(rot) );        gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );        vUv = uv;        mPos = modelMatrix * vec4(position, 1.0);        }",
            fragmentShader: "uniform sampler2D rasterTex;        uniform sampler2D texture;        uniform sampler2D patternTexture;        uniform float time;        varying vec2 vUv;        varying vec4 mPos;        void main(void){        vec4 tex = texture2D( texture,  vec2( vUv.x, vUv.y - time * 2.0 ) );        vec4 tex2 = texture2D( patternTexture,  vec2( vUv.x, vUv.y - time * 3.0 ) * vec2(2, 6) );        float z = ( -mPos.z * .001 ) * 3.0;         gl_FragColor = ( tex + vec4(z, 0, z, 1) ) + vec4(tex2.x);        }",
            uniforms: {
                texture: {
                    type: 't',
                    value: noiseTexture
                },
                patternTexture: {
                    type: 't',
                    value: patternTexture
                },
                rasterTex: {
                    type: 't',
                    value: rasterTexture
                },
                time: {
                    type: 'f',
                    value: 0.0
                }
            },
            side: THREE.DoubleSide
        });
        MaterialManager.zakoMaterial = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('zako-vshader').textContent,
            fragmentShader: document.getElementById('zako-fshader').textContent,
            uniforms: {
                texture: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture('assets/models/zako.png')
                },
                color: {
                    type: 'v4',
                    value: new THREE.Vector4(1, 1, 1, 1)
                }
            }
        });
        MaterialManager.materials['zako'] = MaterialManager.zakoMaterial;
        Vars.setAnimateFunc(animate.bind(this));
        Vars.pushResizeFunc(resize.bind(this));
    }
    MaterialManager.init = init;
    function initHitEffect(length) {
        var indexs = [];
        var directions = [];
        var durations = [];
        var sizes = [];
        var rotationSpeeds = [];
        var radius = new THREE.Vector3(4, 2, 4);
        for (var i = 0; i < length; i++) {
            indexs.push(i);
            directions.push(new THREE.Vector3(radius.x * .5 - radius.x * Math.random(), radius.y * .5 - radius.y * Math.random(), radius.z * .5 - radius.z * Math.random()).normalize());
            durations.push(.5 + .1 * Math.random());
            sizes.push(50 + 50 * Math.random());
            rotationSpeeds.push(2 - 4 * Math.random());
        }
        var c = new THREE.Color(0xff7c1d);
        MaterialManager.hitEffectMaterial0 = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('hit-effect0-vshader').textContent,
            fragmentShader: document.getElementById('hit-effect0-fshader').textContent,
            uniforms: {
                texture1: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture('img/flare3.png')
                },
                texture2: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture('img/star2.png')
                },
                texture3: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture('img/flare1.png')
                },
                time: {
                    type: 'f',
                    value: 0.0
                },
                color: {
                    type: 'v4',
                    value: new THREE.Vector4(c.r, c.g, c.b, 1)
                },
                opacity: {
                    type: 'f',
                    value: 1.0
                }
            },
            attributes: {
                index: {
                    type: 'f',
                    value: indexs
                },
                direction: {
                    type: 'v3',
                    value: directions
                },
                duration: {
                    type: 'f',
                    value: durations
                },
                size: {
                    type: 'f',
                    value: sizes
                },
                rotationSpeed: {
                    type: 'f',
                    value: rotationSpeeds
                }
            },
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true
        });
        MaterialManager.materials['hitEffect0'] = MaterialManager.hitEffectMaterial0;
    }
    MaterialManager.initHitEffect = initHitEffect;
    function setMaterial(mesh, name) {
        if (name == 'grassDepth') {
            mesh.customDepthMaterial = MaterialManager.materials[name];
        }
        else {
            mesh.material = MaterialManager.materials[name];
            mesh.material.needsUpdate = true;
        }
    }
    MaterialManager.setMaterial = setMaterial;
    var time = 0;
    function animate() {
        if (!MaterialManager.animateFlag)
            return;
        time += Vars.delta;
        if (MaterialManager.hitEffectMaterial0)
            MaterialManager.hitEffectMaterial0.uniforms.time.value = time;
        var time1 = time * .2;
        warpLightMaterial.uniforms.time.value = time1;
        warpWaterMaterial.uniforms.time.value = time1;
        var c = MaterialManager.zakoMaterial.uniforms.color.value.clone();
        if (c.w > 0) {
            c.w -= .02;
            MaterialManager.zakoMaterial.uniforms.color.value = c;
        }
        var time2 = time * .1;
        MaterialManager.skyBoxMaterial.uniforms.time.value = time2;
        MaterialManager.tunnelMaterial.uniforms.time.value = time2;
    }
    function resize() {
        var stageSize = new THREE.Vector2(Vars.stageWidth, Vars.stageHeight);
        if (platform == 'sp' || platform == 'ipad') {
            stageSize = new THREE.Vector2(Vars.stageWidth * (window.devicePixelRatio / Vars.resolution), Vars.stageHeight * (window.devicePixelRatio / Vars.resolution));
        }
        MaterialManager.skyBoxMaterial.uniforms.stageSize.value = stageSize;
    }
})(MaterialManager || (MaterialManager = {}));
var MeshManager;
(function (MeshManager) {
    function yUp(mesh) {
        var matrix = new THREE.Matrix4();
        matrix.set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);
        mesh.geometry.applyMatrix(matrix);
        mesh.rotation.set(0, 0, 0);
        mesh.updateMatrix();
    }
    MeshManager.yUp = yUp;
    function duplicate(_mesh) {
        var mesh = new THREE.Mesh(_mesh.geometry.clone(), _mesh.material.clone());
        mesh.position.copy(_mesh.position);
        mesh.rotation.x = _mesh.rotation.x;
        mesh.rotation.y = _mesh.rotation.y;
        mesh.rotation.z = _mesh.rotation.z;
        mesh.scale.x = _mesh.scale.x;
        mesh.scale.y = _mesh.scale.y;
        mesh.scale.z = _mesh.scale.z;
        return mesh;
    }
    MeshManager.duplicate = duplicate;
    function duplicates(mesh, length) {
        var scale = mesh.scale.x;
        var meshs = [];
        for (var i = 0; i < length; i++) {
            var cloneMesh = new THREE.Mesh(mesh.geometry, mesh.material);
            cloneMesh.scale.multiplyScalar(scale);
            meshs.push(cloneMesh);
        }
        return meshs;
    }
    MeshManager.duplicates = duplicates;
    function getSize(mesh) {
        var min = mesh.geometry.vertices[0].clone();
        var max = min.clone();
        var length = mesh.geometry.vertices.length;
        for (var i = 0; i < length; i++) {
            var vertex = mesh.geometry.vertices[i];
            if (min.x > vertex.x)
                min.x = vertex.x;
            if (min.y > vertex.y)
                min.y = vertex.y;
            if (min.z > vertex.z)
                min.z = vertex.z;
            if (max.x < vertex.x)
                max.x = vertex.x;
            if (max.y < vertex.y)
                max.y = vertex.y;
            if (max.z < vertex.z)
                max.z = vertex.z;
        }
        var x = max.x - min.x;
        var y = max.y - min.y;
        var z = max.z - min.z;
        return new THREE.Vector3(x, y, z);
    }
    MeshManager.getSize = getSize;
    function getAnimationMesh(geometry, materials) {
        for (var i = 0; i < materials.length; i++)
            materials[i].morphTargets = true;
        var material = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.MorphAnimMesh(geometry, material);
        geometry.dispose();
        mesh.parseAnimations();
        mesh.baseDuration = mesh.duration;
        return mesh;
    }
    MeshManager.getAnimationMesh = getAnimationMesh;
    function getSkeletalAnimationMesh(geometry, materials) {
        for (var i = 0; i < materials.length; i++)
            materials[i].skinning = true;
        var material = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.SkinnedMesh(geometry, material);
        return mesh;
    }
    MeshManager.getSkeletalAnimationMesh = getSkeletalAnimationMesh;
    function setOpacity(mesh, opacity) {
        if (mesh.material) {
            if (mesh.material.materials) {
                var length = mesh.material.materials.length;
                for (var i = 0; i < length; i++) {
                    mesh.material.materials[i].opacity = opacity;
                }
            }
            else {
                mesh.material.opacity = opacity;
            }
        }
    }
    MeshManager.setOpacity = setOpacity;
    function readGeometry(mesh) {
        var vertices = mesh.geometry.vertices;
        var verticesLength = vertices.length;
        var faces = mesh.geometry.faces;
        var facesLength = faces.length;
        var length = 2 + verticesLength * 3 + facesLength * 6;
        var messages = new Float32Array(length);
        messages[0] = verticesLength;
        messages[1] = facesLength;
        var count = 0;
        var index = 0;
        for (var i = 0; i < verticesLength; i++) {
            var a = 2 + i * 3;
            messages[a] = vertices[i].x;
            messages[a + 1] = vertices[i].y;
            messages[a + 2] = vertices[i].z;
        }
        var vIndex = verticesLength * 3;
        var index = 0;
        var count = 0;
        for (var i = 0; i < facesLength; i++) {
            var a = 2 + vIndex + i * 6;
            messages[a] = faces[i].a;
            messages[a + 1] = faces[i].b;
            messages[a + 2] = faces[i].c;
            messages[a + 3] = faces[i].normal.x;
            messages[a + 4] = faces[i].normal.y;
            messages[a + 5] = faces[i].normal.z;
        }
        return messages;
    }
    MeshManager.readGeometry = readGeometry;
    function writeGeometry(messages) {
        var geometry = new THREE.Geometry();
        var count = 0;
        var index = 0;
        var length = messages[0];
        for (var i = 0; i < length; i++) {
            var a = 2 + i * 3;
            var vec = new THREE.Vector3(messages[a], messages[a + 1], messages[a + 2]);
            geometry.vertices.push(vec);
        }
        var vLength = messages[0] * 3;
        var count = 0;
        var index = 0;
        var length = messages[1];
        for (var i = 0; i < length; i++) {
            var n = 2 + vLength + i * 6;
            var a = messages[n];
            var b = messages[n + 1];
            var c = messages[n + 2];
            var normal = new THREE.Vector3(messages[n + 3], messages[n + 4], messages[n + 5]);
            var face = new THREE.Face3(a, b, c, normal);
            geometry.faces.push(face);
        }
        geometry.computeFaceNormals();
        return geometry;
    }
})(MeshManager || (MeshManager = {}));
var CaughtManager;
(function (CaughtManager) {
    var object;
    var target;
    CaughtManager.height = 2;
    var caughtRay;
    var caughtRayCount = 0;
    var maxCaughtRayCount = 4;
    var adjustCaughtTime = 3;
    function init() {
        caughtRay = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0));
    }
    CaughtManager.init = init;
    function caughtRayReder(_object, _target) {
        object = _object;
        target = _target;
        if (Vars.elapsedTime - object.lastCaughtTime < adjustCaughtTime)
            return;
        if (!object.caughtFlag) {
            caughtRayCount++;
            if (maxCaughtRayCount > caughtRayCount)
                return;
            caughtRayCount = 0;
            caughtRay.ray.origin = object.position;
            var obj = RaycastManager.hitCheck(caughtRay, 10);
            if (obj.hitFlag) {
                var name = 'caughtCollisionO';
                if (Vars.reverseFlag)
                    name = 'caughtCollisionU';
                var point = RaycastManager.getFirstPointByName(obj.intersections, name);
                if (!point)
                    return;
                point.x = object.position.x;
                point.z = object.position.z;
                var distance = object.position.distanceTo(point);
                if (distance < .5) {
                    caught(point);
                }
            }
        }
    }
    CaughtManager.caughtRayReder = caughtRayReder;
    function caught(point) {
        PhysicsManager.setForceFlag(object.rigidBodyIndex, true);
        object.caughtFlag = true;
        object.lastCaughtTime = Vars.elapsedTime;
        var ground = SceneManager.scene.getObjectByName('ground', false);
        var direction = ThreeManager.getXZDirection(object.position).negate();
        object.lookAt(object.position.clone().add(direction));
        object.mesh.quaternion.copy(object.quaternion);
        var y = CaughtManager.height / 2;
        var radius = .5;
        var adjust = direction.multiplyScalar(radius);
        var pos = new THREE.Vector3(adjust.x, y, adjust.z);
        var targetPos = point.clone().sub(adjust.clone().negate());
        targetPos = ground.worldToLocal(targetPos);
        object.caughtJointIndex = PhysicsManager.setJointToBody(target.rigidBodyIndex, object.rigidBodyIndex, targetPos, pos);
        var vec = ThreeManager.getXZDirection(object.position);
        vec = new THREE.Vector3(Math.abs(vec.z), 0, Math.abs(-vec.x));
        PhysicsManager.setRotationLimit(object.rigidBodyIndex, vec);
    }
    function releaseCaught(_object) {
        if (!_object.caughtFlag)
            return;
        PhysicsManager.setForceFlag(_object.rigidBodyIndex, false);
        _object.caughtFlag = false;
        _object.mesh.rotation.set(0, 0, 0);
        var vec = new THREE.Vector3(1, 1, 1);
        PhysicsManager.setRotationLimit(_object.rigidBodyIndex, vec);
        PhysicsManager.jointDelete(_object.caughtJointIndex);
        _object.lastCaughtTime = Vars.elapsedTime;
    }
    CaughtManager.releaseCaught = releaseCaught;
})(CaughtManager || (CaughtManager = {}));
var Move;
(function (Move) {
    var flip;
    (function (flip) {
        var downFlag = false;
        var index = -1;
        var flipCheckObjDefaultPos = new THREE.Vector3(0, 0, 15);
        var flipDist = 40;
        flip.objects = [];
        var objectsLength = 0;
        var initFlag = false;
        function init(target, callBack) {
            var flipCheckObj = new THREE.Mesh(new THREE.SphereGeometry(.5, 3, 3), new THREE.MeshBasicMaterial({ wireframe: true, visible: false }));
            flipCheckObj.position.copy(flipCheckObjDefaultPos.clone());
            target.add(flipCheckObj);
            var name = target.name;
            flip.objects[objectsLength] = {};
            flip.objects[objectsLength].name = name;
            flip.objects[objectsLength].target = target;
            flip.objects[objectsLength].flipCheckObj = flipCheckObj;
            flip.objects[objectsLength].rotateDir = new THREE.Vector3();
            flip.objects[objectsLength].lastRotY = 0;
            flip.objects[objectsLength].groundRot = new THREE.Vector3();
            flip.objects[objectsLength].targetRot = new THREE.Vector3();
            flip.objects[objectsLength].targetRotDefault = new THREE.Vector3();
            flip.objects[objectsLength].callBack = callBack;
            target.flipIndex = objectsLength;
            objectsLength = flip.objects.length;
            if (!initFlag) {
                initFlag = true;
                Vars.setAnimateFunc(flipAnimate.bind(this));
            }
        }
        flip.init = init;
        function mouseDown(_index) {
            if (_index == -1)
                return;
            index = _index;
            downFlag = true;
            var pos = Vars.mousePosition.clone().sub(flip.objects[index].target.position.clone());
            Vars.downDirection = ThreeManager.getXZDirection(pos);
            flip.objects[index].rotateDir = new THREE.Vector3(Vars.downDirection.z, 0, -Vars.downDirection.x);
            flip.objects[index].lastRotY = flip.objects[index].targetRot.y;
        }
        flip.mouseDown = mouseDown;
        function mouseUp() {
            downFlag = false;
        }
        flip.mouseUp = mouseUp;
        function flipAnimate() {
            if (index == -1)
                return;
            var nowObject = flip.objects[index];
            if (!nowObject)
                return;
            if (nowObject.reverseAnimationFlag) {
                reverseAnimation(nowObject);
            }
            else {
                if (downFlag) {
                    if (Vars.mouseDragDistX < Vars.mouseDragDistY) {
                        dragRotXZ(nowObject);
                    }
                    else {
                    }
                }
                else {
                    returnDefaultRot(nowObject);
                }
            }
            Vars.groundUp = nowObject.target.localToWorld(new THREE.Vector3(0, 1, 0));
            Vars.groundRot.copy(nowObject.groundRot);
        }
        function dragRotXZ(nowObject) {
            var rot = Vars.mouseDragOffsetY;
            if (Vars.mouseDragDistY > flipDist) {
                reverse(nowObject, rot);
            }
            else {
                var absX = Math.abs(nowObject.rotateDir.x);
                var absZ = Math.abs(nowObject.rotateDir.z);
                if (absX) {
                    nowObject.targetRot.x = rot * nowObject.rotateDir.x * Vars.delta * 40 + nowObject.targetRotDefault.x;
                }
                else if (absZ) {
                    var adjust = flipCheck(nowObject);
                    nowObject.targetRot.z = rot * adjust * nowObject.rotateDir.z * Vars.delta * 40 + nowObject.targetRotDefault.z;
                }
                rotate(nowObject, 10);
            }
        }
        function dragRotY(nowObject) {
            nowObject.targetRot.y = nowObject.lastRotY + Vars.mouseDragOffsetX * Vars.delta;
            rotate(nowObject, 10);
        }
        function returnDefaultRot(nowObject) {
            if (nowObject.groundRot.distanceTo(nowObject.targetRotDefault) > .1) {
                nowObject.targetRot.x = nowObject.targetRotDefault.x;
                nowObject.targetRot.z = nowObject.targetRotDefault.z;
                rotate(nowObject, 5);
            }
            else {
                nowObject.groundRot.x = nowObject.targetRotDefault.x;
                nowObject.groundRot.z = nowObject.targetRotDefault.z;
                var euler = new THREE.Euler(nowObject.groundRot.x * Vars.toRad, nowObject.groundRot.y * Vars.toRad, nowObject.groundRot.z * Vars.toRad);
                PhysicsManager.setQuaternion(nowObject.rigidBodyIndex, new THREE.Quaternion().setFromEuler(euler));
            }
        }
        function flipCheck(nowObject) {
            var adjust = 1;
            var pos = new THREE.Vector3();
            pos.setFromMatrixPosition(nowObject.flipCheckObj.matrixWorld);
            pos.sub(nowObject.target.position.clone());
            if (pos.distanceTo(flipCheckObjDefaultPos.clone()) > 1)
                adjust *= -1;
            return adjust;
        }
        function rotate(nowObject, easing) {
            nowObject.groundRot.x += -(nowObject.groundRot.x - nowObject.targetRot.x) / easing;
            nowObject.groundRot.y += -(nowObject.groundRot.y - nowObject.targetRot.y) / easing;
            nowObject.groundRot.z += -(nowObject.groundRot.z - nowObject.targetRot.z) / easing;
            var euler = new THREE.Euler(nowObject.groundRot.x * Vars.toRad, nowObject.groundRot.y * Vars.toRad, nowObject.groundRot.z * Vars.toRad);
            PhysicsManager.setQuaternion(nowObject.rigidBodyIndex, new THREE.Quaternion().setFromEuler(euler));
        }
        function reverse(nowObject, rot) {
            downFlag = false;
            var absX = Math.abs(nowObject.rotateDir.x);
            var absZ = Math.abs(nowObject.rotateDir.z);
            if (absX) {
                if (rot > 0) {
                    if (nowObject.rotateDir.x > 0) {
                        nowObject.targetRotDefault.x += 180;
                    }
                    else {
                        nowObject.targetRotDefault.x -= 180;
                    }
                }
                else {
                    if (nowObject.rotateDir.x < 0) {
                        nowObject.targetRotDefault.x += 180;
                    }
                    else {
                        nowObject.targetRotDefault.x -= 180;
                    }
                }
            }
            else {
                var adjust = flipCheck(nowObject) * -1;
                if (rot > 0) {
                    if (nowObject.rotateDir.z > 0) {
                        nowObject.targetRotDefault.z -= 180 * adjust;
                    }
                    else {
                        nowObject.targetRotDefault.z += 180 * adjust;
                    }
                }
                else {
                    if (nowObject.rotateDir.z < 0) {
                        nowObject.targetRotDefault.z -= 180 * adjust;
                    }
                    else {
                        nowObject.targetRotDefault.z += 180 * adjust;
                    }
                }
            }
            if (Vars.reverseFlag) {
                Vars.reverseFlag = false;
            }
            else {
                Vars.reverseFlag = true;
            }
            Vars.targetRotDefault.copy(nowObject.targetRotDefault);
            nowObject.reverseAnimationFlag = true;
            if (nowObject.callBack)
                nowObject.callBack('flipStart');
        }
        function reverseAnimation(nowObject) {
            if (nowObject.groundRot.distanceTo(nowObject.targetRotDefault) > .01) {
                nowObject.targetRot.x = nowObject.targetRotDefault.x;
                nowObject.targetRot.z = nowObject.targetRotDefault.z;
                rotate(nowObject, 5);
            }
            else {
                reverseAnimationComp(nowObject);
            }
        }
        function reverseAnimationComp(nowObject) {
            nowObject.reverseAnimationFlag = false;
            if (nowObject.callBack)
                nowObject.callBack('flipEnd');
            flipEnd();
        }
        function flipEnd() {
        }
        flip.flipEnd = flipEnd;
    })(flip = Move.flip || (Move.flip = {}));
})(Move || (Move = {}));
var Move;
(function (Move) {
    var mouse;
    (function (mouse) {
        mouse.objects = {};
        function add(target, speed, speedChageRange, maxSpeed) {
            if (speedChageRange === void 0) { speedChageRange = null; }
            if (maxSpeed === void 0) { maxSpeed = 1; }
            var name = target.name;
            mouse.objects[name] = {};
            mouse.objects[name].target = target;
            mouse.objects[name].name = name;
            mouse.objects[name].targetPosition = new THREE.Vector3();
            mouse.objects[name].speed = speed;
            mouse.objects[name].speedChageRange = speedChageRange;
            mouse.objects[name].maxSpeed = maxSpeed;
            mouse.objects[name].ammoId = -1;
        }
        mouse.add = add;
        function render(name) {
            mouse.objects[name].targetPosition.copy(Vars.mousePosition);
            var a = mouse.objects[name].targetPosition.clone();
            a.y = 0;
            var b = mouse.objects[name].target.position.clone();
            b.y = 0;
            var distance = a.distanceTo(b);
            if (distance < 1) {
                mouse.objects[name].target.speed = 0;
                return;
            }
            var speed = mouse.objects[name].speed;
            if (mouse.objects[name].speedChageRange && distance > mouse.objects[name].speedChageRange)
                speed = mouse.objects[name].maxSpeed;
            mouse.objects[name].target.speed = speed;
            var rigidBodyIndex = mouse.objects[name].target.rigidBodyIndex;
            PhysicsManager.setLinearVelocity(rigidBodyIndex, mouse.objects[name].targetPosition, speed);
        }
        mouse.render = render;
    })(mouse = Move.mouse || (Move.mouse = {}));
})(Move || (Move = {}));
var MoveTargetsManager;
(function (MoveTargetsManager) {
    function setMoveTargets(objects, name, targets) {
        objects[name].moveTargetsLength = targets.length;
        for (var i = 0; i < objects[name].moveTargetsLength; i++) {
            var pos = new THREE.Vector3().copy(targets[i]);
            pos.y = 0;
            objects[name].moveTargets.push(pos);
            if (i == 0) {
                objects[name].targetPosition.copy(objects[name].moveTargets[i]);
                PhysicsManager.setTargetPosition(objects[name].rigidBodyIndex, objects[name].targetPosition);
            }
        }
        return objects;
    }
    MoveTargetsManager.setMoveTargets = setMoveTargets;
    function updateMoveTargets(objects, name, targets) {
        for (var i = 0; i < objects[name].moveTargetsLength; i++) {
            var pos = new THREE.Vector3().copy(targets[i]);
            pos.y = 0;
            objects[name].moveTargets[i] = new THREE.Vector3(pos.x, 0, pos.z);
        }
        objects[name].targetPosition.copy(objects[name].moveTargets[objects[name].moveTargetsIdex]);
        PhysicsManager.setTargetPosition(objects[name].rigidBodyIndex, objects[name].targetPosition);
        return objects;
    }
    MoveTargetsManager.updateMoveTargets = updateMoveTargets;
    function clearMoveTargets(objects, name) {
        for (var i = 0; i < objects[name].moveTargetsLength; i++) {
            objects[name].moveTargets[0] = null;
            objects[name].moveTargets.splice(0, 1);
        }
        objects[name].moveTargetsLength = 0;
        objects[name].moveTargetsIdex = 0;
        objects[name].lastMoveTargetsIdex = -1;
        objects[name].targetPosition = new THREE.Vector3();
        return objects;
    }
    MoveTargetsManager.clearMoveTargets = clearMoveTargets;
})(MoveTargetsManager || (MoveTargetsManager = {}));
var RollDown = (function () {
    function RollDown(_objects, _time) {
        this.objects = [];
        this.length = 0;
        this.time = 0;
        this.standby = true;
        this.objects = _objects;
        this.length = _objects.length;
        this.time = _time;
    }
    RollDown.prototype.start = function () {
        var x = 1000 * Math.random() - 500;
        var z = CameraManager.camera.position.z + 1000;
        for (var i = 0; i < this.length; i++) {
            this.objects[i].position.set(x, 1000, z);
            new TWEEN.Tween(this.objects[i].position).to({ y: 0 }, this.time).delay(i * 200).easing(TWEEN.Easing.Quadratic.InOut).onComplete(function (self) {
                this.standby = true;
            }.bind(this)).start();
        }
    };
    return RollDown;
})();
var RollDownManager = (function () {
    function RollDownManager(_objects, time) {
        this.rollDowns = [];
        this.length = 5;
        for (var i = 0; i < this.length; i++) {
            var rollDown = new RollDown(_objects, time);
            this.rollDowns.push(rollDown);
        }
        this.interval = setInterval(this.add.bind(this), 5000);
    }
    RollDownManager.prototype.add = function () {
        var addFlag = false;
        var length = this.rollDowns.length;
        for (var i = 0; i < length; i++) {
            if (this.rollDowns[i].standby && !addFlag) {
                this.rollDowns[i].standby = false;
                this.rollDowns[i].start();
                addFlag = true;
            }
        }
    };
    RollDownManager.prototype.remove = function () {
        clearInterval(this.interval);
    };
    return RollDownManager;
})();
var Move;
(function (Move) {
    var rotation;
    (function (rotation) {
        rotation.objects = {};
        function add(name, speed) {
            rotation.objects[name] = {};
            rotation.objects[name].name = name;
            rotation.objects[name].targetPosition = new THREE.Vector3();
            rotation.objects[name].moveTargets = [];
            rotation.objects[name].moveTargetsLength = 0;
            rotation.objects[name].moveTargetsIdex = 0;
            rotation.objects[name].lastMoveTargetsIdex = -1;
            rotation.objects[name].rot = 0;
            rotation.objects[name].speed = speed;
            rotation.objects[name].interVal = setInterval(interVal.bind(this), 6000, name);
        }
        rotation.add = add;
        function interVal(name) {
            rotation.objects[name].moveTargetsIdex++;
            if (rotation.objects[name].moveTargetsIdex > rotation.objects[name].moveTargetsLength - 1)
                rotation.objects[name].moveTargetsIdex = 0;
        }
        function setMoveTargets(name, targets) {
            rotation.objects = MoveTargetsManager.setMoveTargets(rotation.objects, name, targets);
        }
        rotation.setMoveTargets = setMoveTargets;
        function updateMoveTargets(name, targets) {
            rotation.objects = MoveTargetsManager.updateMoveTargets(rotation.objects, name, targets);
        }
        rotation.updateMoveTargets = updateMoveTargets;
        function clearMoveTargets(name) {
            rotation.objects = MoveTargetsManager.clearMoveTargets(rotation.objects, name);
        }
        rotation.clearMoveTargets = clearMoveTargets;
        function render(name) {
            if (!rotation.objects[name].moveTargetsLength)
                return;
            rotation.objects[name].rot += rotation.objects[name].speed * Vars.delta * 20;
            if (rotation.objects[name].rot > 360)
                rotation.objects[name].rot = 0;
            var radian = rotation.objects[name].rot * Vars.toRad;
            var x = 5 * Math.cos(radian);
            var z = 5 * Math.sin(radian);
            var i = rotation.objects[name].moveTargetsIdex;
            rotation.objects[name].targetPosition.x = rotation.objects[name].moveTargets[i].x + x;
            rotation.objects[name].targetPosition.z = rotation.objects[name].moveTargets[i].z + z;
            PhysicsManager.setTargetPosition(rotation.objects[name].rigidBodyIndex, rotation.objects[name].targetPosition);
        }
        rotation.render = render;
    })(rotation = Move.rotation || (Move.rotation = {}));
})(Move || (Move = {}));
var Snake = (function () {
    function Snake(meshArray) {
        this.meshLength = 0;
        this.vecArray = [];
        this.interval = 10;
        this.dist = 0;
        this.oldIndex = 0;
        this.targetPos = new THREE.Vector3();
        this.speed = 20;
        this.meshArray = meshArray;
        this.meshLength = meshArray.length;
        this.dist = this.interval * this.meshLength;
        for (var i = 0; i < this.dist; i++) {
            this.vecArray.push(new THREE.Vector3());
        }
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    Snake.prototype.animate = function () {
        var obj = ThreeManager.getMouseTo(this.meshArray[0]);
        this.targetPos = Vars.mousePosition;
        var index = this.oldIndex;
        for (var i = 0; i < this.meshLength; i++) {
            index = (index - this.interval + this.dist) % this.dist;
            this.meshArray[i].position.copy(this.vecArray[index]);
        }
        this.vecArray[this.oldIndex] = this.targetPos.clone();
        this.oldIndex = (this.oldIndex + 1) % this.dist;
    };
    return Snake;
})();
var Move;
(function (Move) {
    var stalker;
    (function (stalker) {
        stalker.objects = {};
        function add(object, target, speed, distance) {
            if (distance === void 0) { distance = 5; }
            var name = object.name;
            stalker.objects[name] = {};
            stalker.objects[name].object = object;
            stalker.objects[name].target = target;
            stalker.objects[name].speed = speed;
            stalker.objects[name].distance = distance;
        }
        stalker.add = add;
        function render(name) {
            var a = stalker.objects[name].object.position.clone();
            a.y = 0;
            var b = stalker.objects[name].target.position.clone();
            b.y = 0;
            var distance = a.distanceTo(b);
            if (distance > stalker.objects[name].distance) {
                return;
            }
            var speed = stalker.objects[name].speed;
            var rigidBodyIndex = stalker.objects[name].object.rigidBodyIndex;
            PhysicsManager.setLinearVelocity(rigidBodyIndex, b, speed);
        }
        stalker.render = render;
    })(stalker = Move.stalker || (Move.stalker = {}));
})(Move || (Move = {}));
var Move;
(function (Move) {
    var turn;
    (function (turn) {
        turn.objects = {};
        function add(target) {
            var name = target.name;
            turn.objects[name] = {};
            turn.objects[name].target = target;
            turn.objects[name].name = name;
            turn.objects[name].targetPosition = new THREE.Vector3();
            turn.objects[name].moveTargets = [];
            turn.objects[name].moveTargetsLength = 0;
            turn.objects[name].moveTargetsIdex = 0;
            turn.objects[name].lastMoveTargetsIdex = -1;
            turn.objects[name].moveTargetChangeDist = 1.5;
        }
        turn.add = add;
        function setMoveTargets(name, targets) {
            turn.objects = MoveTargetsManager.setMoveTargets(turn.objects, name, targets);
        }
        turn.setMoveTargets = setMoveTargets;
        function updateMoveTargets(name, targets) {
            turn.objects = MoveTargetsManager.updateMoveTargets(turn.objects, name, targets);
        }
        turn.updateMoveTargets = updateMoveTargets;
        function clearMoveTargets(name) {
            turn.objects = MoveTargetsManager.clearMoveTargets(turn.objects, name);
        }
        turn.clearMoveTargets = clearMoveTargets;
        function render(name) {
            if (!turn.objects[name].moveTargetsLength)
                return;
            var pos = new THREE.Vector3().copy(turn.objects[name].target.position);
            pos.y = 0;
            var dist = pos.distanceTo(turn.objects[name].targetPosition);
            var range = turn.objects[name].moveTargetChangeDist;
            if (dist < range) {
                turn.objects[name].lastMoveTargetsIdex = turn.objects[name].moveTargetsIdex;
                turn.objects[name].moveTargetsIdex++;
                if (turn.objects[name].moveTargetsIdex > turn.objects[name].moveTargetsLength - 1)
                    turn.objects[name].moveTargetsIdex = 0;
                turn.objects[name].targetPosition.copy(turn.objects[name].moveTargets[turn.objects[name].moveTargetsIdex]);
                PhysicsManager.setTargetPosition(turn.objects[name].rigidBodyIndex, turn.objects[name].targetPosition);
            }
        }
        turn.render = render;
    })(turn = Move.turn || (Move.turn = {}));
})(Move || (Move = {}));
var MoveSpline = (function () {
    function MoveSpline(_object, movePoints, _loopTime) {
        this.object = _object;
        this.moveSpline = new THREE.SplineCurve3(movePoints);
        this.loopTime = _loopTime;
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    MoveSpline.prototype.animate = function () {
        var time = Date.now();
        var looptime = this.loopTime * 1000;
        var t = (time % looptime) / looptime;
        var pos = this.moveSpline.getPointAt(t);
        this.object.position = pos;
    };
    return MoveSpline;
})();
var CloudParticle1 = (function (_super) {
    __extends(CloudParticle1, _super);
    function CloudParticle1() {
        _super.call(this);
        var particleScale = 3;
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('img/cloud.png'),
            maxAge: 5,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.NormalBlending
        });
        var Untitled1Emitter = new SPE.Emitter({
            type: 'sphere',
            particleCount: 20,
            position: new THREE.Vector3(0, 0, 0),
            positionSpread: new THREE.Vector3(2, 2, 2),
            radius: 0.6,
            radiusSpread: 0,
            radiusSpreadClamp: 0,
            radiusScale: new THREE.Vector3(1, .2, 1),
            speed: 0.5,
            speedSpread: 0,
            sizeStart: 4 * particleScale,
            sizeStartSpread: 0,
            sizeMiddle: 10 * particleScale,
            sizeMiddleSpread: 0,
            sizeEnd: 1 * particleScale,
            sizeEndSpread: 0,
            angleStart: 0,
            angleStartSpread: 0,
            angleMiddle: 0,
            angleMiddleSpread: 0,
            angleEnd: 0,
            angleEndSpread: 0,
            angleAlignVelocity: false,
            colorStart: new THREE.Color(0xffffff),
            colorStartSpread: new THREE.Vector3(0, 0, 0),
            colorMiddle: new THREE.Color(0xffffff),
            colorMiddleSpread: new THREE.Vector3(0, 0, 0),
            colorEnd: new THREE.Color(0xffffff),
            colorEndSpread: new THREE.Vector3(0, 0, 0),
            opacityStart: 0.01,
            opacityStartSpread: 0,
            opacityMiddle: 0.4,
            opacityMiddleSpread: 0,
            opacityEnd: 0,
            opacityEndSpread: 0,
            duration: null,
            alive: 1,
            isStatic: 0
        });
        this.particleGroup.addEmitter(Untitled1Emitter);
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    CloudParticle1.prototype.animate = function () {
        if (!this.visible)
            return;
        var delta = Vars.delta;
        this.particleGroup.tick(delta);
    };
    return CloudParticle1;
})(THREE.Object3D);
var FireParticle1 = (function (_super) {
    __extends(FireParticle1, _super);
    function FireParticle1() {
        _super.call(this);
        var particleScale = 3;
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture("data:image/png;base64,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"),
            maxAge: 5,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.AdditiveBlending
        });
        var Untitled1Emitter = new SPE.Emitter({
            type: 'cube',
            particleCount: 100,
            position: new THREE.Vector3(0, 0, 0),
            positionSpread: new THREE.Vector3(0, 0, 0),
            acceleration: new THREE.Vector3(0, 0, 0),
            accelerationSpread: new THREE.Vector3(0, 0, 0),
            velocity: new THREE.Vector3(0, .8, 0),
            velocitySpread: new THREE.Vector3(1, 0.888888888888889, 1),
            sizeStart: 1 * particleScale,
            sizeStartSpread: 0,
            sizeMiddle: 4.5 * particleScale,
            sizeMiddleSpread: 0,
            sizeEnd: 1 * particleScale,
            sizeEndSpread: 0,
            angleStart: 0,
            angleStartSpread: 0,
            angleMiddle: 0,
            angleMiddleSpread: 0,
            angleEnd: 0,
            angleEndSpread: 0,
            angleAlignVelocity: false,
            colorStart: new THREE.Color(0xb88f00),
            colorStartSpread: new THREE.Vector3(0, 0, 0),
            colorMiddle: new THREE.Color(0xb21800),
            colorMiddleSpread: new THREE.Vector3(0, 0, 0),
            colorEnd: new THREE.Color(0xfff7fc),
            colorEndSpread: new THREE.Vector3(0, 0, 0),
            opacityStart: 1,
            opacityStartSpread: 0,
            opacityMiddle: 0.5,
            opacityMiddleSpread: 0,
            opacityEnd: 0,
            opacityEndSpread: 0,
            duration: null,
            alive: 1,
            isStatic: 0
        });
        this.particleGroup.addEmitter(Untitled1Emitter);
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    FireParticle1.prototype.animate = function () {
        if (!this.visible)
            return;
        this.particleGroup.tick(Vars.delta);
    };
    return FireParticle1;
})(THREE.Object3D);
var FlareParticle1 = (function (_super) {
    __extends(FlareParticle1, _super);
    function FlareParticle1() {
        _super.call(this);
        this.alive = 1;
        this.flag = true;
        var particleScale = 6;
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('img/flare3.png'),
            maxAge: 5,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.AdditiveBlending
        });
        var Untitled1Emitter = new SPE.Emitter({
            type: 'sphere',
            particleCount: 50,
            position: new THREE.Vector3(0, 0, 0),
            positionSpread: new THREE.Vector3(0, 0, 0),
            radius: 10,
            radiusSpread: 0,
            radiusSpreadClamp: 0,
            radiusScale: new THREE.Vector3(0, 0, 0),
            sizeStart: 0 * particleScale,
            sizeStartSpread: 8,
            sizeMiddle: 2.5 * particleScale,
            sizeMiddleSpread: 8,
            sizeEnd: 1 * particleScale,
            sizeEndSpread: 8,
            angleStartSpread: 6,
            angleMiddleSpread: 6,
            angleEndSpread: 6,
            angleAlignVelocity: false,
            colorStart: new THREE.Color(0xffffff),
            colorMiddle: new THREE.Color(0xff7c1d),
            colorEnd: new THREE.Color(0xe3e900),
        });
        this.particleGroup.addEmitter(Untitled1Emitter);
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;
        Vars.setAnimateFunc(this.animate.bind(this));
        setTimeout(function () {
            this.visible = false;
        }.bind(this), 1000);
    }
    FlareParticle1.prototype.animate = function () {
        if (!this.visible)
            return;
        this.particleGroup.tick(Vars.delta);
    };
    FlareParticle1.prototype.on = function () {
        this.visible = true;
    };
    FlareParticle1.prototype.off = function () {
        this.visible = false;
    };
    return FlareParticle1;
})(THREE.Object3D);
var HitEffectParticle0 = (function (_super) {
    __extends(HitEffectParticle0, _super);
    function HitEffectParticle0() {
        _super.call(this);
        this.alive = 1;
        this.flag = true;
        var particleScale = 6;
        var geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4);
        MaterialManager.initHitEffect(geometry.vertices.length);
        this.mesh = new THREE.PointCloud(geometry, MaterialManager.hitEffectMaterial0);
        this.add(this.mesh);
        Vars.setAnimateFunc(this.animate.bind(this));
        setTimeout(function () {
            this.visible = false;
        }.bind(this), 1000);
    }
    HitEffectParticle0.prototype.animate = function () {
        if (!this.visible)
            return;
    };
    HitEffectParticle0.prototype.on = function () {
        this.visible = true;
        this.mesh.material.uniforms.opacity.value = 0.0;
        TweenManager.addTweenObj(this.mesh.material.uniforms.opacity, { value: 1.0 }, 200, TWEEN.Easing.Linear.None);
    };
    HitEffectParticle0.prototype.off = function () {
        TweenManager.addTweenObj(this.mesh.material.uniforms.opacity, { value: 0.0 }, 500, TWEEN.Easing.Linear.None, 0, this.offComp.bind(this));
    };
    HitEffectParticle0.prototype.offComp = function () {
        this.visible = false;
    };
    return HitEffectParticle0;
})(THREE.Object3D);
var HotalParticle1 = (function (_super) {
    __extends(HotalParticle1, _super);
    function HotalParticle1() {
        _super.call(this);
        this.position.y = 5;
        var particleScale = 1.5;
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture("data:image/png;base64,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"),
            maxAge: 5,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.AdditiveBlending
        });
        var Untitled1Emitter = new SPE.Emitter({
            type: 'cube',
            particleCount: 200,
            positionSpread: new THREE.Vector3(80, 5, 80),
            velocity: new THREE.Vector3(0, 1.5, 0),
            velocitySpread: new THREE.Vector3(0.5, 0, 0.5),
            sizeStart: 1.5 * particleScale,
            sizeStartSpread: .5,
            sizeMiddle: 1 * particleScale,
            sizeEnd: .3 * particleScale,
            angleAlignVelocity: false,
            colorStart: new THREE.Color(0xffee79),
            colorStartSpread: new THREE.Vector3(0.1, 0.1, 0.1),
            colorMiddle: new THREE.Color(0xe40031),
            colorMiddleSpread: new THREE.Vector3(0.15, 0.15, 0.15),
            colorEnd: new THREE.Color(0xcd006e),
            colorEndSpread: new THREE.Vector3(0.15, 0.15, 0.15)
        });
        this.particleGroup.addEmitter(Untitled1Emitter);
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    HotalParticle1.prototype.animate = function () {
        if (!this.visible)
            return;
        this.particleGroup.tick(Vars.delta);
    };
    return HotalParticle1;
})(THREE.Object3D);
var LeafParticle1 = (function (_super) {
    __extends(LeafParticle1, _super);
    function LeafParticle1() {
        _super.call(this);
        this.position.y = 10;
        var scale = 3;
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture("data:image/png;base64,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"),
            maxAge: 5,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.NormalBlending
        });
        var Untitled1Emitter = new SPE.Emitter({
            type: 'cube',
            particleCount: 200,
            positionSpread: new THREE.Vector3(80, 0, 80),
            velocity: new THREE.Vector3(-1, -2, 0),
            velocitySpread: new THREE.Vector3(6, 3, 4),
            sizeStart: 1 * scale,
            sizeMiddle: 1 * scale,
            sizeEnd: 1 * scale,
            angleStartSpread: 2,
            angleMiddle: 1,
            angleMiddleSpread: 3,
            angleEnd: 2,
            angleEndSpread: 5,
            opacityMiddle: 1
        });
        this.particleGroup.addEmitter(Untitled1Emitter);
        this.particleGroup.mesh.scale.multiplyScalar(1);
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    LeafParticle1.prototype.animate = function () {
        if (!this.visible)
            return;
        this.particleGroup.tick(Vars.delta);
    };
    return LeafParticle1;
})(THREE.Object3D);
var ParticleBase = (function (_super) {
    __extends(ParticleBase, _super);
    function ParticleBase() {
        _super.call(this);
        this.test = 1;
    }
    return ParticleBase;
})(THREE.Object3D);
var RainParticle1 = (function (_super) {
    __extends(RainParticle1, _super);
    function RainParticle1() {
        _super.call(this);
        var particleScale = 8;
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture("data:image/png;base64,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"),
            maxAge: 1,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.NormalBlending
        });
        var Untitled1Emitter = new SPE.Emitter({
            type: 'cube',
            particleCount: 57,
            position: new THREE.Vector3(0, 0, 0),
            positionSpread: new THREE.Vector3(3, 0, 3),
            acceleration: new THREE.Vector3(0, 0, 0),
            accelerationSpread: new THREE.Vector3(0, 0, 0),
            velocity: new THREE.Vector3(0, -6, 0),
            velocitySpread: new THREE.Vector3(0, 0, 0),
            sizeStart: 0.3 * particleScale,
            sizeStartSpread: 0,
            sizeMiddle: 0.15 * particleScale,
            sizeMiddleSpread: 0,
            sizeEnd: 0.15 * particleScale,
            sizeEndSpread: 0,
            angleStart: 0,
            angleStartSpread: 0,
            angleMiddle: 0,
            angleMiddleSpread: 0,
            angleEnd: 0,
            angleEndSpread: 0,
            angleAlignVelocity: false,
            colorStart: new THREE.Color(0x9afff9),
            colorStartSpread: new THREE.Vector3(0, 0, 0),
            colorMiddle: new THREE.Color(0x94ffed),
            colorMiddleSpread: new THREE.Vector3(0, 0, 0),
            colorEnd: new THREE.Color(0xb5fdff),
            colorEndSpread: new THREE.Vector3(0, 0, 0),
            opacityStart: 1,
            opacityStartSpread: 0,
            opacityMiddle: 0.5,
            opacityMiddleSpread: 0,
            opacityEnd: 0,
            opacityEndSpread: 0,
            duration: null,
            alive: 1,
            isStatic: 0
        });
        this.particleGroup.addEmitter(Untitled1Emitter);
        this.add(this.particleGroup.mesh);
        this.particleGroup.addEmitter(Untitled1Emitter);
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    RainParticle1.prototype.animate = function () {
        if (!this.visible)
            return;
        var delta = Vars.delta;
        this.particleGroup.tick(delta);
    };
    return RainParticle1;
})(THREE.Object3D);
var RunSmorkParticle = (function (_super) {
    __extends(RunSmorkParticle, _super);
    function RunSmorkParticle(target) {
        _super.call(this);
        this.alive = 0;
        this.flag = false;
        this.time = 0;
        this.interval = .1;
        this.target = target;
        this.visible = false;
        var particleScale = 3;
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('img/smork0.png'),
            maxAge: 1.2,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.NormalBlending
        });
        this.Untitled1Emitter = new SPE.Emitter({
            type: 'cube',
            particleCount: 10,
            position: new THREE.Vector3(0, 0, 0),
            positionSpread: new THREE.Vector3(.3, .3, .3),
            velocity: new THREE.Vector3(0, 0, 0),
            velocitySpread: new THREE.Vector3(0, 0, 0),
            acceleration: new THREE.Vector3(0, 0, 0),
            accelerationSpread: new THREE.Vector3(0, 0, 0),
            sizeStart: 1,
            sizeMiddle: 6 * particleScale,
            sizeEnd: 5 * particleScale,
            opacityStart: 0.8,
            opacityMiddle: 0.1,
            alive: 0.5,
            colorStart: new THREE.Color(0xffdba5),
            colorMiddle: new THREE.Color(0xffdfa1),
            colorEnd: new THREE.Color(0xffffff)
        });
        this.particleGroup.addEmitter(this.Untitled1Emitter);
        this.mesh = this.particleGroup.mesh;
        this.mesh.frustumCulled = false;
        SceneManager.scene.add(this.mesh);
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    RunSmorkParticle.prototype.animate = function () {
        if (!this.visible)
            return;
        this.setAlive();
        this.Untitled1Emitter.position.copy(this.target.position);
        this.particleGroup.tick(Vars.delta);
    };
    RunSmorkParticle.prototype.setAlive = function () {
        if (!this.flag && this.alive == 0 || this.flag && this.alive == 1)
            return;
        this.time += Vars.delta;
        if (this.time > this.interval) {
            if (this.flag) {
                this.alive = 1;
            }
            else {
                this.alive -= .2;
                if (this.alive < 0) {
                    this.alive = 0;
                    setTimeout(function () {
                        this.visible = false;
                    }.bind(this), 2000);
                    return;
                }
            }
            this.Untitled1Emitter.alive = this.alive;
            this.time = 0;
        }
    };
    RunSmorkParticle.prototype.on = function () {
        this.visible = true;
        this.flag = true;
    };
    RunSmorkParticle.prototype.off = function () {
        this.flag = false;
    };
    return RunSmorkParticle;
})(THREE.Object3D);
var StarParticle1 = (function (_super) {
    __extends(StarParticle1, _super);
    function StarParticle1() {
        _super.call(this);
        this.alive = 1;
        this.flag = false;
        this.time = 0;
        this.interval = .1;
        var particleScale = 6;
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('img/star1.png'),
            maxAge: 1,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.NormalBlending
        });
        this.Untitled1Emitter = new SPE.Emitter({
            type: 'cube',
            alive: this.alive,
            particleCount: 10,
            acceleration: new THREE.Vector3(0, -40, 0),
            velocity: new THREE.Vector3(0, 20, 0),
            velocitySpread: new THREE.Vector3(30, 0, 30),
            sizeStart: .1 * particleScale,
            sizeMiddle: 1.5 * particleScale,
            sizeEnd: .1 * particleScale,
            opacityEnd: 0
        });
        this.particleGroup.addEmitter(this.Untitled1Emitter);
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    StarParticle1.prototype.animate = function () {
        if (!this.visible)
            return;
        this.setAlive();
        this.particleGroup.tick(Vars.delta);
    };
    StarParticle1.prototype.setAlive = function () {
        if (!this.flag && this.alive == 0 || this.flag && this.alive == 1)
            return;
        this.time += Vars.delta;
        if (this.time > this.interval) {
            if (this.flag) {
                this.alive = 1;
            }
            else {
                this.alive -= .2;
                if (this.alive < 0) {
                    this.alive = 0;
                    setTimeout(function () {
                        this.visible = false;
                    }.bind(this), 2000);
                    return;
                }
            }
            this.Untitled1Emitter.alive = this.alive;
            this.time = 0;
        }
    };
    StarParticle1.prototype.on = function () {
        this.visible = true;
        this.flag = true;
    };
    StarParticle1.prototype.off = function () {
        this.flag = false;
    };
    return StarParticle1;
})(THREE.Object3D);
var StarParticle2 = (function (_super) {
    __extends(StarParticle2, _super);
    function StarParticle2() {
        _super.call(this);
        this.alive = 1;
        this.flag = false;
        this.time = 0;
        this.interval = .1;
        var particleScale = 6;
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('img/star1.png'),
            maxAge: 1,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.NormalBlending
        });
        this.Untitled1Emitter = new SPE.Emitter({
            type: 'cube',
            alive: this.alive,
            particleCount: 10,
            acceleration: new THREE.Vector3(0, -40, 0),
            velocity: new THREE.Vector3(0, 20, 0),
            velocitySpread: new THREE.Vector3(30, 0, 30),
            sizeStart: .1 * particleScale,
            sizeMiddle: 1.5 * particleScale,
            sizeEnd: .1 * particleScale,
            opacityEnd: 0
        });
        this.particleGroup.addEmitter(this.Untitled1Emitter);
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    StarParticle2.prototype.animate = function () {
        if (!this.visible)
            return;
        this.setAlive();
        this.particleGroup.tick(Vars.delta);
    };
    StarParticle2.prototype.setAlive = function () {
        if (!this.flag && this.alive == 0 || this.flag && this.alive == 1)
            return;
        this.time += Vars.delta;
        if (this.time > this.interval) {
            if (this.flag) {
                this.alive = 1;
            }
            else {
                this.alive -= .2;
                if (this.alive < 0) {
                    this.alive = 0;
                    setTimeout(function () {
                        this.visible = false;
                    }.bind(this), 2000);
                    return;
                }
            }
            this.Untitled1Emitter.alive = this.alive;
            this.time = 0;
        }
    };
    StarParticle2.prototype.on = function () {
        this.visible = true;
        this.flag = true;
    };
    StarParticle2.prototype.off = function () {
        this.flag = false;
    };
    return StarParticle2;
})(THREE.Object3D);
var WarpParticle1 = (function (_super) {
    __extends(WarpParticle1, _super);
    function WarpParticle1() {
        _super.call(this);
        var size = 2;
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('img/particle3.png'),
            maxAge: 5,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.AdditiveBlending
        });
        var Untitled1Emitter = new SPE.Emitter({
            type: 'cube',
            particleCount: 57,
            positionSpread: new THREE.Vector3(2, 0, 2),
            velocity: new THREE.Vector3(0, 0.6666666666666679, 0),
            velocitySpread: new THREE.Vector3(0, 1.5555555555555556, 0),
            sizeMiddle: 0.5555555555555556 * size,
            sizeMiddleSpread: 0.5555555555555556,
            sizeEnd: 0.2777777777777778 * size,
            colorStart: new THREE.Color(0x9ecfff),
            colorMiddle: new THREE.Color(0xceedff),
            colorMiddleSpread: new THREE.Vector3(0.2, 0.2, 0.2)
        });
        this.add(this.particleGroup.mesh);
        this.particleGroup.addEmitter(Untitled1Emitter);
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;
        Vars.setAnimateFunc(this.animate.bind(this));
    }
    WarpParticle1.prototype.animate = function () {
        if (!this.visible)
            return;
        var delta = Vars.delta;
        this.particleGroup.tick(delta);
    };
    return WarpParticle1;
})(THREE.Object3D);
var PostprocessManager1;
(function (PostprocessManager1) {
    PostprocessManager1.scene;
    PostprocessManager1.glowScene;
    var blurComposer;
    var layer2Composer;
    var layer1Composer;
    var glows = [];
    var glowsLength = 0;
    var toScreen;
    function init(_scene) {
        PostprocessManager1.scene = _scene;
        layer1Composer = new THREE.EffectComposer(RendererManager.renderer);
        var renderPass = new THREE.RenderPass(PostprocessManager1.scene, CameraManager.camera);
        layer1Composer.addPass(renderPass);
        toScreen = new THREE.ShaderPass(THREE.CopyShader);
        toScreen.renderToScreen = true;
        layer1Composer.addPass(toScreen);
        Vars.setAnimateFunc(animate.bind(this));
    }
    PostprocessManager1.init = init;
    function addEffect(type) {
        var w = Vars.stageWidth;
        var h = Vars.stageHeight;
        toScreen.renderToScreen = false;
        layer1Composer.addPass(toScreen);
        switch (type) {
            case "bloom1":
                RendererManager.renderer.autoClear = false;
                layer1Composer.addPass(new THREE.BloomPass(1, 13));
                break;
            case "bloom2":
                var renderTarget = new THREE.WebGLRenderTarget(w, h);
                blurComposer = new THREE.EffectComposer(RendererManager.renderer, renderTarget);
                var renderPass = new THREE.RenderPass(PostprocessManager1.glowScene, GlowCameraManager.camera, null, null, 0);
                blurComposer.addPass(renderPass);
                var hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
                var vblur = new THREE.ShaderPass(THREE.VerticalBlurShader);
                var bluriness = 3;
                hblur.uniforms["h"].value = bluriness * 2 / w;
                vblur.uniforms["v"].value = bluriness / h;
                blurComposer.addPass(hblur);
                blurComposer.addPass(vblur);
                var shader = {
                    uniforms: {
                        tDiffuse: { type: "t", value: null },
                        tBlur: { type: "t", value: blurComposer.renderTarget2 }
                    },
                    vertexShader: document.getElementById('vshader').textContent,
                    fragmentShader: document.getElementById('fshader').textContent
                };
                var shaderPass = new THREE.ShaderPass(shader);
                shaderPass.needsSwap = true;
                layer1Composer.addPass(shaderPass);
                break;
            case "dof":
                var hblur = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
                var vblur = new THREE.ShaderPass(THREE.VerticalTiltShiftShader);
                var bluriness = 3;
                hblur.uniforms['h'].value = bluriness / Vars.stageWidth;
                vblur.uniforms['v'].value = bluriness / Vars.stageHeight;
                hblur.uniforms['r'].value = vblur.uniforms['r'].value = 0.5;
                layer1Composer.addPass(hblur);
                layer1Composer.addPass(vblur);
                break;
            case "rgb":
                var rgbEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
                rgbEffect.uniforms['amount'].value = 0.003;
                rgbEffect.uniforms['angle'].value = 0;
                layer1Composer.addPass(rgbEffect);
                break;
            case "dot":
                var dotEffect = new THREE.ShaderPass(THREE.DotScreenShader);
                dotEffect.uniforms['angle'].value = 0;
                dotEffect.uniforms['scale'].value = 500;
                layer1Composer.addPass(dotEffect);
                break;
        }
        toScreen.renderToScreen = true;
        layer1Composer.addPass(toScreen);
    }
    PostprocessManager1.addEffect = addEffect;
    function animate() {
        positionMerge();
        if (blurComposer)
            blurComposer.render(0.1);
        layer1Composer.render(0.1);
    }
    function positionMerge() {
        for (var i = 0; i < glowsLength; i++) {
            glows[i].copy.position.copy(glows[i].original.position);
            glows[i].copy.rotation = glows[i].original.rotation;
        }
    }
    function add(object) {
        PostprocessManager1.scene.add(object);
        var copyObject = MeshManager.duplicate(object);
        if (!PostprocessManager1.glowScene)
            PostprocessManager1.glowScene = new GlowScene();
        PostprocessManager1.glowScene.add(copyObject);
        glows.push(new GlowObject(object, copyObject));
        glowsLength = glows.length;
    }
    PostprocessManager1.add = add;
})(PostprocessManager1 || (PostprocessManager1 = {}));
var PostprocessManager2;
(function (PostprocessManager2) {
    var layerFlag = false;
    var effectPassNames = [];
    var layer0RenderPass;
    var layer1RenderPass;
    var noneLayerRenderPass;
    var compositShaderPass;
    var flashShaderPass;
    var bloomPass;
    var hblurPass;
    var vblurPass;
    var blurBluriness = 5;
    var rgbPass;
    var dotPass;
    var fxaaPass;
    var dpr = 1;
    var copyShaderPass;
    var layer0Composer;
    var layer1Composer;
    function init() {
        initComposer();
        initPass();
        Vars.pushResizeFunc(resize.bind(this));
    }
    PostprocessManager2.init = init;
    function initComposer() {
        var w = Vars.stageWidth;
        var h = Vars.stageHeight;
        layer0Composer = new THREE.EffectComposer(RendererManager.renderer);
    }
    function initPass() {
        noneLayerRenderPass = new THREE.RenderPass(SceneManager.scene, CameraManager.camera);
        bloomPass = new THREE.BloomPass(.6, 25);
        hblurPass = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
        vblurPass = new THREE.ShaderPass(THREE.VerticalTiltShiftShader);
        hblurPass.uniforms['h'].value = blurBluriness / Vars.stageWidth;
        vblurPass.uniforms['v'].value = blurBluriness / Vars.stageHeight;
        hblurPass.uniforms['r'].value = vblurPass.uniforms['r'].value = 0.6;
        rgbPass = new THREE.ShaderPass(THREE.RGBShiftShader);
        rgbPass.uniforms['amount'].value = 0.001;
        rgbPass.uniforms['angle'].value = 0;
        dotPass = new THREE.ShaderPass(THREE.DotScreenShader);
        dotPass.uniforms['angle'].value = 0;
        dotPass.uniforms['scale'].value = 500;
        if (window.devicePixelRatio) {
            dpr = window.devicePixelRatio;
        }
        fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
        fxaaPass.uniforms['resolution'].value = new THREE.Vector2(1 / (Vars.stageWidth), 1 / (Vars.stageHeight));
        copyShaderPass = new THREE.ShaderPass(THREE.CopyShader);
        copyShaderPass.renderToScreen = true;
    }
    function addPass(_effectPassNames) {
        effectPassNames = _effectPassNames;
        resetPass();
    }
    PostprocessManager2.addPass = addPass;
    function resetPass() {
        layer0Composer.passes.length = 0;
        layer0Composer.addPass(noneLayerRenderPass);
        var length = effectPassNames.length;
        for (var i = 0; i < length; i++) {
            if (effectPassNames[i] == 'bloom') {
                layer0Composer.addPass(bloomPass);
            }
            else if (effectPassNames[i] == 'dof') {
                layer0Composer.addPass(hblurPass);
                layer0Composer.addPass(vblurPass);
            }
            else if (effectPassNames[i] == 'rgb') {
                layer0Composer.addPass(rgbPass);
            }
            else if (effectPassNames[i] == 'dot') {
                layer0Composer.addPass(dotPass);
            }
        }
        layer0Composer.addPass(copyShaderPass);
    }
    PostprocessManager2.resetPass = resetPass;
    function render() {
        if (layerFlag != RendererManager.layerFlag) {
            layerFlag = RendererManager.layerFlag;
            resetPass();
        }
        layer0Composer.render(0.1);
    }
    PostprocessManager2.render = render;
    function resize() {
        hblurPass.uniforms['h'].value = blurBluriness / Vars.stageWidth;
        vblurPass.uniforms['v'].value = blurBluriness / Vars.stageHeight;
        fxaaPass.uniforms['resolution'].value.set(1 / (Vars.stageWidth * dpr), 1 / (Vars.stageHeight * dpr));
        layer0Composer.setSize(Vars.stageWidth * dpr, Vars.stageHeight * dpr);
    }
})(PostprocessManager2 || (PostprocessManager2 = {}));
var PropertyManager;
(function (PropertyManager) {
    function rotations(meshs, dist) {
        var positions = [];
        var length = meshs.length;
        var rot = 0;
        var radius = 0;
        var radiusPlus = 200;
        for (var i = 0; i < length; i++) {
            meshs[i].position.z = i * dist;
            rot += 1;
            var radian = rot * Vars.toRad;
            radius += radiusPlus;
            if (radius > 1000 || radius < 100)
                radiusPlus = radiusPlus * -1;
            meshs[i].position.x = Math.cos(radian) * radius;
            meshs[i].position.y = Math.sin(radian) * radius + 500;
            positions.push(meshs[i].position.clone());
        }
        return { meshs: meshs, positions: positions };
    }
    PropertyManager.rotations = rotations;
    function sizes(meshs, scale) {
        var length = meshs.length;
        for (var i = 0; i < length; i++) {
            meshs[i].scale.multiplyScalar(scale);
        }
        return meshs;
    }
    PropertyManager.sizes = sizes;
    function randomSizes(meshs, min, max) {
        var length = meshs.length;
        for (var i = 0; i < length; i++) {
            var size = (max - min) * Math.random() + min;
            meshs[i].scale.multiplyScalar(size);
        }
        return meshs;
    }
    PropertyManager.randomSizes = randomSizes;
    function positions(meshs, position) {
        var length = meshs.length;
        for (var i = 0; i < length; i++) {
            meshs[i].position = position;
        }
        return meshs;
    }
    PropertyManager.positions = positions;
})(PropertyManager || (PropertyManager = {}));
var RaycastManager;
(function (RaycastManager) {
    RaycastManager.raycastType = 'normal';
    RaycastManager.mouseMesh;
    RaycastManager.mouseMeshY = .1;
    RaycastManager.mouseTopMesh;
    RaycastManager.mouseTopMeshY = 10;
    var octree = new THREE.Octree({
        undeferred: false,
        depthMax: Infinity,
        objectsThreshold: 8,
        overlapPct: 0.15
    });
    var intersected;
    var baseColor = 0x333333;
    var intersectColor = 0x00D66B;
    var raycastTargets = [];
    var cursorChangeTargets = [];
    var cursorChangeTargetsLength = 0;
    RaycastManager.mouseOverTarget;
    RaycastManager.downTarget;
    function init() {
        var geometry = new THREE.PlaneGeometry(300, 300, 10, 10);
        var material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true, visible: false });
        RaycastManager.mouseMesh = new THREE.Mesh(geometry, material);
        RaycastManager.mouseMesh.rotation.x = 270 * Vars.toRad;
        RaycastManager.mouseMesh.name = 'mouseMesh';
        SceneManager.scene.add(RaycastManager.mouseMesh);
        add(RaycastManager.mouseMesh);
        RaycastManager.mouseTopMesh = new THREE.Mesh(geometry, material);
        RaycastManager.mouseTopMesh.rotation.x = 270 * Vars.toRad;
        RaycastManager.mouseTopMesh.name = 'mouseTopMesh';
        SceneManager.scene.add(RaycastManager.mouseTopMesh);
        add(RaycastManager.mouseTopMesh);
        Vars.pushMouseDownFunc(mouseDown.bind(this));
        Vars.pushMouseMoveFunc(mouseMove.bind(this));
        Vars.pushMouseUpFunc(mouseUp.bind(this));
        Vars.setAnimateFunc(animate.bind(this));
    }
    RaycastManager.init = init;
    function raycast(raycaster) {
        var intersections = raycaster.intersectObjects(raycastTargets, true);
        return intersections;
    }
    function octreeRaycast(raycaster) {
        var numFaces = 0;
        var octreeObjects = octree.search(raycaster.ray.origin, raycaster.far, true, raycaster.ray.direction);
        var intersections = raycaster.intersectOctreeObjects(octreeObjects);
        var numObjects = octreeObjects.length;
        for (var i = 0, il = numObjects; i < il; i++) {
            numFaces += octreeObjects[i].faces.length;
        }
        octree.update();
        return intersections;
    }
    function add(object, mouseOverTargetFlag) {
        if (mouseOverTargetFlag === void 0) { mouseOverTargetFlag = false; }
        octree.add(object, { useFaces: false });
        raycastTargets.push(object);
        if (mouseOverTargetFlag) {
            cursorChangeTargets.push(object);
            cursorChangeTargetsLength = cursorChangeTargets.length;
        }
    }
    RaycastManager.add = add;
    function remove(object) {
        var name = object.name;
        octree.remove(object);
        var index = -1;
        for (var i = 0; i < raycastTargets.length; i++) {
            if (raycastTargets[i].name == name)
                index = i;
        }
        if (index != -1)
            raycastTargets.splice(index, 1);
        index = -1;
        for (i = 0; i < cursorChangeTargetsLength; i++) {
            if (name == cursorChangeTargets[i].name)
                index = i;
        }
        if (index != -1)
            cursorChangeTargets.splice(index, 1);
        cursorChangeTargetsLength = cursorChangeTargets.length;
    }
    RaycastManager.remove = remove;
    function hitCheck(raycaster, dist, type) {
        if (type === void 0) { type = ''; }
        var obj = {};
        var hitFlag = false;
        var _mouseOverFlag = false;
        var mouseOutFlag = false;
        var oldMouseOverTarget;
        if (RaycastManager.mouseOverTarget)
            oldMouseOverTarget = RaycastManager.mouseOverTarget;
        if (RaycastManager.raycastType == 'octree') {
            var intersections = octreeRaycast(raycaster);
        }
        else {
            intersections = raycast(raycaster);
        }
        var intersectionsLength = intersections.length;
        if (intersectionsLength > 0) {
            if (intersected != intersections[0].object) {
                intersected = intersections[0].object;
            }
            var distance = intersections[0].distance;
            if (distance > 0 && distance < dist) {
                hitFlag = true;
                obj.intersections = intersections;
                if (type == 'mouse') {
                    for (var i = 0; i < intersectionsLength; i++) {
                        for (var j = 0; j < cursorChangeTargetsLength; j++) {
                            if (intersections[i].object.name == cursorChangeTargets[j].name && intersections[i].object.visible) {
                                if (!_mouseOverFlag)
                                    RaycastManager.mouseOverTarget = intersections[i].object;
                                _mouseOverFlag = true;
                            }
                        }
                    }
                }
            }
        }
        else if (intersected) {
            intersected = null;
        }
        if (type == 'mouse') {
            if (_mouseOverFlag) {
                document.body.style.cursor = 'pointer';
                RaycastManager.mouseOverTarget.parent.mouseOver();
            }
            else {
                RaycastManager.mouseOverTarget = null;
            }
            if (RaycastManager.mouseOverTarget != oldMouseOverTarget) {
                document.body.style.cursor = 'auto';
                if (oldMouseOverTarget)
                    oldMouseOverTarget.parent.mouseOut();
            }
        }
        obj.hitFlag = hitFlag;
        return obj;
    }
    RaycastManager.hitCheck = hitCheck;
    function getFirstPointByName(intersections, name) {
        var length = intersections.length;
        var point;
        for (var i = 0; i < length; i++) {
            if (intersections[i].object.name == name && !point) {
                point = new THREE.Vector3().copy(intersections[i].point);
            }
        }
        return point;
    }
    RaycastManager.getFirstPointByName = getFirstPointByName;
    function getFirstObjectByName(intersections, name) {
        var length = intersections.length;
        var object;
        for (var i = 0; i < length; i++) {
            if (intersections[i].object.name == name && !object) {
                object = intersections[i];
            }
        }
        return object;
    }
    RaycastManager.getFirstObjectByName = getFirstObjectByName;
    var downFlag = false;
    function mouseDown() {
        if (RaycastManager.mouseOverTarget) {
            RaycastManager.mouseOverTarget.parent.mouseClick();
            downFlag = true;
            var downX = Vars.mouseX;
            var downY = Vars.mouseY;
            setTimeout(function () {
                if (!Vars.downFlag || downX != Vars.mouseX || downY != Vars.mouseY || !RaycastManager.mouseOverTarget)
                    return;
                RaycastManager.downTarget = RaycastManager.mouseOverTarget;
                RaycastManager.downTarget.parent.mouseDown();
            }.bind(this), 100);
        }
    }
    function mouseMove() {
        if (RaycastManager.mouseOverTarget) {
            RaycastManager.mouseOverTarget.parent.mouseMove();
        }
    }
    function mouseUp() {
        if (downFlag) {
            if (RaycastManager.downTarget) {
                RaycastManager.downTarget.parent.mouseUp();
                RaycastManager.downTarget = null;
            }
            else {
                if (Vars.mouseDragDistX == 0 && Vars.mouseDragDistY == 0 && RaycastManager.mouseOverTarget) {
                }
            }
        }
        downFlag = false;
    }
    function animate() {
        if (CameraManager.camera) {
            RaycastManager.mouseMesh.position.copy(CameraManager.camera.position);
            RaycastManager.mouseMesh.position.y = RaycastManager.mouseMeshY;
            RaycastManager.mouseTopMesh.position.copy(RaycastManager.mouseMesh.position);
            RaycastManager.mouseTopMesh.position.y = RaycastManager.mouseMesh.position.y + RaycastManager.mouseTopMeshY;
        }
        if (RaycastManager.downTarget) {
            RaycastManager.downTarget.parent.drag();
        }
    }
})(RaycastManager || (RaycastManager = {}));
var RendererManager;
(function (RendererManager) {
    RendererManager.renderer;
    RendererManager.layerFlag = false;
    var postEffectFlag = false;
    RendererManager.renderTarget;
    function init() {
        var antialiasFlag = true;
        if (Vars.quality != 'middle')
            antialiasFlag = false;
        RendererManager.renderer = new THREE.WebGLRenderer({ antialias: antialiasFlag });
        RendererManager.renderer.setClearColor(0xffa7ff, 1);
        RendererManager.renderer.shadowMapEnabled = true;
        if (Vars.quality != 'low')
            PostprocessManager2.init();
        if (Vars.quality == 'high') {
            PostprocessManager2.addPass(['dof']);
            postEffectFlag = true;
        }
        Vars.setAnimateFunc(animate.bind(this));
        resize();
        Vars.pushResizeFunc(resize.bind(this));
    }
    RendererManager.init = init;
    function animate() {
        if (!Vars.renderFlag)
            return;
        if (postEffectFlag) {
            if (RendererManager.layerFlag) {
                RendererManager.renderer.render(SceneManager.layer0, SceneManager.layer0.camera, RendererManager.renderTarget);
            }
            PostprocessManager2.render();
        }
        else {
            if (RendererManager.layerFlag) {
                RendererManager.renderer.render(SceneManager.layer0, SceneManager.layer0.camera, RendererManager.renderTarget);
                RendererManager.renderer.render(SceneManager.scene, CameraManager.camera);
            }
            else {
                RendererManager.renderer.render(SceneManager.scene, CameraManager.camera);
            }
        }
    }
    function resize() {
        var h = Vars.stageHeight;
        var w = Vars.stageWidth;
        RendererManager.renderer.setSize(w / Vars.resolution, h / Vars.resolution);
        RendererManager.renderer.domElement.style.width = w + "px";
        RendererManager.renderer.domElement.style.height = h + "px";
        RendererManager.renderTarget.width = w;
        RendererManager.renderTarget.height = h;
    }
})(RendererManager || (RendererManager = {}));
var Vars;
(function (Vars) {
    Vars.resolution = 1;
    if (platform != 'pc')
        Vars.resolution = 2;
    Vars.quality = 'middle';
    Vars.fpsStep = 2;
    Vars.renderFlag = true;
    Vars.initCompFlag = false;
    Vars.gameOverFlag = false;
    Vars.inGameFlag = false;
    Vars.toRad = Math.PI / 180;
    Vars.toRot = 180 / Math.PI;
    Vars.stageWidth = 0;
    Vars.stageHeight = 600;
    Vars.windowHalfX = 0;
    Vars.windowHalfY = 0;
    Vars.mouseX = 0;
    Vars.mouseY = 0;
    Vars.mouseLastX = 0;
    Vars.mouseLastY = 0;
    Vars.mousePosition = new THREE.Vector3();
    Vars.lastMousePosition = new THREE.Vector3();
    Vars.mouseDragDistX = 0;
    Vars.mouseDragDistY = 0;
    Vars.mouseDragOffsetX = 0;
    Vars.mouseDragOffsetY = 0;
    Vars.mouseOffsetX = 0;
    Vars.mouseOffsetY = 0;
    Vars.mouseLastDownX = 0;
    Vars.mouseLastDownY = 0;
    Vars.downFlag = false;
    Vars.mouseDownFuncs = [];
    var mouseDownFuncsLength = 0;
    Vars.mouseUpFuncs = [];
    var mouseUpFuncsLength = 0;
    Vars.mouseMoveFuncs = [];
    var mouseMoveFuncsLength = 0;
    Vars.rightClickFuncs = [];
    var rightClickFuncsLength = 0;
    Vars.multiTouchFlag = false;
    var animateFuncs = [];
    var animateFuncsLength = 0;
    var animateCount = 0;
    Vars.resizeFuncs = [];
    var resizeFuncsLength = 0;
    Vars.enterDownFuncs = [];
    var enterDownFuncsLength = 0;
    Vars.objects = [];
    Vars.objectsLength = 0;
    Vars.groundUp = new THREE.Vector3();
    Vars.downDirection = new THREE.Vector3();
    Vars.groundRot = new THREE.Vector3();
    Vars.targetRotDefault = new THREE.Vector3();
    Vars.reverseFlag = false;
    var raycaster;
    var rayCheckLastTime = 0;
    var rayCheckTime = .3;
    Vars.jointCatchFlag = false;
    var debugFlag = true;
    var mouseDummyObject;
    Vars.clock = new THREE.Clock();
    Vars.delta = 0;
    Vars.elapsedTime = 0;
    Vars.fps = 0;
    Vars.yieldFunc;
    Vars.maxYieldCount = 1;
    var yieldCount = 0;
    function init() {
        raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0));
        setAnimateFunc(render.bind(this));
        animate();
        setInterval(function () {
            Vars.fps = Math.floor(1 / Vars.delta);
        }.bind(this), 1000);
    }
    Vars.init = init;
    function mouseDown(e) {
        if (e === void 0) { e = null; }
        Vars.downFlag = true;
        if (!Vars.jointCatchFlag && platform != 'pc') {
            if (e.touches.length) {
                Vars.mouseX = e.touches[0].pageX;
                Vars.mouseY = e.touches[0].pageY;
            }
            mouseRaycast(0);
        }
        Vars.mouseLastDownX = Vars.mouseX;
        Vars.mouseLastDownY = Vars.mouseY;
        for (var i = 0; i < mouseDownFuncsLength; i++)
            Vars.mouseDownFuncs[i]();
    }
    Vars.mouseDown = mouseDown;
    function pushMouseDownFunc(func) {
        Vars.mouseDownFuncs.push(func);
        mouseDownFuncsLength = Vars.mouseDownFuncs.length;
    }
    Vars.pushMouseDownFunc = pushMouseDownFunc;
    function mouseUp() {
        Vars.downFlag = false;
        Vars.multiTouchFlag = false;
        Vars.mouseDragOffsetX = 0;
        Vars.mouseDragOffsetY = 0;
        Vars.mouseDragDistX = 0;
        Vars.mouseDragDistY = 0;
        for (var i = 0; i < mouseUpFuncsLength; i++)
            Vars.mouseUpFuncs[i]();
    }
    Vars.mouseUp = mouseUp;
    function pushMouseUpFunc(func) {
        Vars.mouseUpFuncs.push(func);
        mouseUpFuncsLength = Vars.mouseUpFuncs.length;
    }
    Vars.pushMouseUpFunc = pushMouseUpFunc;
    function mouseMove(e) {
        Vars.mouseLastX = Vars.mouseX;
        Vars.mouseLastY = Vars.mouseY;
        if (platform == 'pc') {
            Vars.mouseX = e.clientX;
            Vars.mouseY = e.clientY;
        }
        else {
            if (e.touches.length) {
                Vars.mouseX = e.touches[0].pageX;
                Vars.mouseY = e.touches[0].pageY;
            }
        }
        Vars.mouseOffsetX = Vars.mouseX - Vars.mouseLastX;
        Vars.mouseOffsetY = Vars.mouseY - Vars.mouseLastY;
        if (Vars.downFlag) {
            if (platform == 'pc') {
                setDragProperty();
            }
            else {
                if (e.touches.length == 2) {
                    setDragProperty();
                }
            }
        }
        for (var i = 0; i < mouseMoveFuncsLength; i++)
            Vars.mouseMoveFuncs[i]();
    }
    Vars.mouseMove = mouseMove;
    function setDragProperty() {
        Vars.mouseDragOffsetX = Vars.mouseX - Vars.mouseLastDownX;
        Vars.mouseDragOffsetY = Vars.mouseY - Vars.mouseLastDownY;
        Vars.mouseDragDistX = Math.abs(Vars.mouseDragOffsetX);
        Vars.mouseDragDistY = Math.abs(Vars.mouseDragOffsetY);
    }
    function pushMouseMoveFunc(func) {
        Vars.mouseMoveFuncs.push(func);
        mouseMoveFuncsLength = Vars.mouseMoveFuncs.length;
    }
    Vars.pushMouseMoveFunc = pushMouseMoveFunc;
    function rightClick(e) {
        if (e === void 0) { e = null; }
        if (!Vars.jointCatchFlag && platform != 'pc') {
            Vars.downFlag = true;
            Vars.multiTouchFlag = true;
            if (e.touches.length) {
                Vars.mouseX = e.touches[0].pageX;
                Vars.mouseY = e.touches[0].pageY;
            }
            Vars.mouseLastDownX = Vars.mouseX;
            Vars.mouseLastDownY = Vars.mouseY;
        }
        for (var i = 0; i < rightClickFuncsLength; i++)
            Vars.rightClickFuncs[i]();
    }
    Vars.rightClick = rightClick;
    function pushRightClickFunc(func) {
        Vars.rightClickFuncs.push(func);
        rightClickFuncsLength = Vars.rightClickFuncs.length;
    }
    Vars.pushRightClickFunc = pushRightClickFunc;
    function resize() {
        for (var i = 0; i < resizeFuncsLength; i++)
            Vars.resizeFuncs[i]();
    }
    Vars.resize = resize;
    function pushResizeFunc(func) {
        Vars.resizeFuncs.push(func);
        resizeFuncsLength = Vars.resizeFuncs.length;
    }
    Vars.pushResizeFunc = pushResizeFunc;
    function mouseRaycast(_rayCheckTime) {
        rayCheckTime = _rayCheckTime;
        if (rayCheckTime < Vars.elapsedTime - rayCheckLastTime) {
            rayCheckLastTime = Vars.elapsedTime;
            Vars.lastMousePosition.copy(Vars.mousePosition.clone());
            var vector = ThreeManager.screen2world();
            vector.sub(CameraManager.camera.position.clone()).normalize();
            raycaster.set(CameraManager.camera.position.clone(), vector);
            var obj = RaycastManager.hitCheck(raycaster, 200, 'mouse');
            if (obj.hitFlag) {
                if (Vars.jointCatchFlag) {
                    var pos = RaycastManager.getFirstPointByName(obj.intersections, 'mouseTopMesh');
                }
                else {
                    pos = RaycastManager.getFirstPointByName(obj.intersections, 'mouseMesh');
                }
                if (pos)
                    Vars.mousePosition.copy(pos);
            }
            else {
                Vars.mousePosition = new THREE.Vector3();
            }
            if (debugFlag) {
                if (!mouseDummyObject) {
                    mouseDummyObject = new THREE.Mesh(new THREE.SphereGeometry(.5, 2, 2), new THREE.MeshBasicMaterial({ wireframe: true }));
                    SceneManager.scene.add(mouseDummyObject);
                    mouseDummyObject.visible = false;
                }
                mouseDummyObject.position.copy(Vars.mousePosition);
            }
        }
    }
    function setEnterDownFunc(func) {
        Vars.enterDownFuncs.push(func);
        enterDownFuncsLength = Vars.enterDownFuncs.length;
    }
    Vars.setEnterDownFunc = setEnterDownFunc;
    function enterDown() {
        for (var i = 0; i < enterDownFuncsLength; i++)
            Vars.enterDownFuncs[i]();
    }
    Vars.enterDown = enterDown;
    function animate() {
        requestAnimationFrame(function () { return animate(); });
        animateCount++;
        if (animateCount % Vars.fpsStep)
            for (var i = 0; i < animateFuncsLength; i++)
                animateFuncs[i]();
    }
    function setAnimateFunc(func) {
        animateFuncs.push(func);
        animateFuncsLength = animateFuncs.length;
    }
    Vars.setAnimateFunc = setAnimateFunc;
    function render() {
        Vars.delta = Vars.clock.getDelta();
        Vars.elapsedTime = Vars.clock.getElapsedTime();
        if (CameraManager.initFlag && !Vars.multiTouchFlag) {
            if (Vars.jointCatchFlag) {
                mouseRaycast(.03);
            }
            else {
                if (platform == 'pc') {
                    mouseRaycast(.1);
                }
                else {
                    if (Vars.downFlag)
                        mouseRaycast(.1);
                }
            }
        }
        if (CameraManager.initFlag)
            CameraManager.animate();
        if (Vars.yieldFunc) {
            if (yieldCount >= Vars.maxYieldCount) {
                Vars.yieldFunc();
                Vars.yieldFunc = null;
                yieldCount = 0;
            }
            yieldCount++;
        }
    }
    function setObject(object) {
        Vars.objects.push(object);
        Vars.objectsLength = Vars.objects.length;
    }
    Vars.setObject = setObject;
})(Vars || (Vars = {}));
var RollMesh = (function (_super) {
    __extends(RollMesh, _super);
    function RollMesh(g, m) {
        _super.call(this, g, m);
        this.defaultPosition = new THREE.Vector3();
        this.rot = 0;
        this.radius = 200;
        this.speed = 10;
        this.speed = this.speed * Math.random();
        this.animate();
    }
    RollMesh.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.animate(); });
        this.rot += this.speed;
        var radian = this.rot * Vars.toRad;
        var x = Math.cos(radian) * this.radius;
        var z = Math.sin(radian) * this.radius;
        this.position = this.defaultPosition.clone().add(new THREE.Vector3(x, 0, z));
    };
    return RollMesh;
})(THREE.Mesh);
var Scene = (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        _super.call(this);
        this.groundLength = StageData.stages.length;
        this.start = Date.now();
        this.itemAddInterval = .2;
        this.lastAddItemTime = 0;
        this.items = [];
        this.itemsLength = 0;
        this.maxItemLength = 10;
        this.houses = [];
        this.houseLength = 10;
        this.rigidBodys = {};
        CameraManager.init();
    }
    Scene.prototype.initObjects = function () {
        CoverManager.init();
        this.initMesh();
        setTimeout(function () {
            Vars.initCompFlag = true;
            StageManager.nextStage();
            SoundManager.mainMusicId = SoundManager.play(1, true, 0);
            SoundManager.tweenInstanceVolume(SoundManager.mainMusicId, 1, 1000);
        }.bind(this), 1000);
        this.animate();
    };
    Scene.prototype.initMesh = function () {
        this.skyBox = new SkyBox();
        this.add(this.skyBox);
        if (Vars.quality != 'low') {
            this.leafParticle1 = new LeafParticle1();
            ParticleManager.setParticle(this.leafParticle1, 'leafParticle1');
            this.add(this.leafParticle1);
        }
        this.starParticle1 = new StarParticle1();
        ParticleManager.setParticle(this.starParticle1, 'starParticle1');
        this.add(this.starParticle1);
        this.flareParticle1 = new FlareParticle1();
        this.flareParticle1.position.y = 4;
        ParticleManager.setParticle(this.flareParticle1, 'flareParticle1');
        this.add(this.flareParticle1);
        this.hitEffectParticle0 = new HitEffectParticle0();
        this.hitEffectParticle0.position.y = 4;
        ParticleManager.setParticle(this.hitEffectParticle0, 'hitEffectParticle0');
        this.add(this.hitEffectParticle0);
        this.player = new Player();
        this.add(this.player);
        StageData.init();
        StageManager.player = this.player;
    };
    Scene.prototype.groudCallBack = function (type, result) {
        switch (type) {
            case 'addItem':
                break;
            case 'flipStart':
                this.flipStart();
                break;
            case 'flipEnd':
                this.flipEnd();
                break;
            case 'addGround':
                CameraManager.camera.oneRotation();
                break;
        }
    };
    Scene.prototype.addItem = function (pos) {
        var time = Vars.elapsedTime;
        if (time - this.lastAddItemTime < this.itemAddInterval)
            return;
        this.lastAddItemTime = time;
        this.ground.localToWorld(pos);
        if (this.itemsLength >= this.maxItemLength) {
            for (var i = 0; i < this.itemsLength; i++) {
                if (this.items[i].deadFlag) {
                    var name = this.items[i].name;
                    this.items[i].revive(pos);
                    return;
                }
            }
        }
        else {
            var item = new ItemScakuranbo(name);
            PhysicsManager.setPosition(item.rigidBodyIndex, pos);
            this.items.push(item);
            this.add(item);
            this.itemsLength = this.items.length;
        }
    };
    Scene.prototype.flipStart = function () {
        if (Vars.reverseFlag) {
            ParticleManager.off('leafParticle1');
        }
        else {
            ParticleManager.on('leafParticle1');
        }
        CameraManager.flip('start');
    };
    Scene.prototype.flipEnd = function () {
        this.player.setPlayerMoveTargets('reset');
        CameraManager.flip('end');
    };
    Scene.prototype.boxCallBack = function (targetPos) {
        var index = Math.floor(2 * Math.random());
        switch (index) {
            case 0:
                this.setBoxTower(targetPos);
                break;
            case 1:
                this.setPyramid(targetPos);
                break;
        }
    };
    Scene.prototype.setBoxTower = function (targetPos) {
        var y = targetPos.y;
        var length = StageManager.boxs.length;
        for (var i = 0; i < length; i++) {
            targetPos.y = y + i * 1.5;
            this.addBoxTween(targetPos, i);
        }
    };
    Scene.prototype.setPyramid = function (targetPos) {
        var y = targetPos.y;
        var count1 = 0;
        var count2 = 0;
        var distY = 1.5;
        var distZ = 1.2;
        var maxArray = [4, 3, 2, 1];
        var length = StageManager.boxs.length;
        for (var i = 0; i < length; i++) {
            targetPos.z = count2 * distZ + count1 * .6 - distZ * 2;
            targetPos.y = y + count1 * distY;
            this.addBoxTween(targetPos, i);
            count2++;
            if (count2 > maxArray[count1] - 1) {
                count1++;
                count2 = 0;
            }
        }
    };
    Scene.prototype.addBoxTween = function (targetPos, i) {
        var q = new THREE.Quaternion();
        var box = SceneManager.scene.getObjectByName(name, false);
        var index = box.rigidBodyIndex;
        var pos = new THREE.Vector3().copy(box.position);
        new TWEEN.Tween(pos).to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 500).easing(TWEEN.Easing.Cubic.Out).onUpdate((function (index, pos) {
            return function () {
                PhysicsManager.setPosition(index, pos);
                PhysicsManager.setQuaternion(index, q);
            };
        }.bind(this))(index, pos)).start();
    };
    Scene.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.animate(); });
        this.skyBox.position.copy(CameraManager.camera.position);
        this.skyBox.position.y = 0;
    };
    return Scene;
})(THREE.Scene);
var ShaderLoader = (function () {
    function ShaderLoader(name, url, callback) {
        this.name = '';
        this.name = name;
        this.callback = callback;
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    this.loadComp(request.responseText);
                }
                else {
                    this.loadError();
                }
            }
        }.bind(this);
        request.send(null);
    }
    ShaderLoader.prototype.loadComp = function (shaderText) {
        this.callback(shaderText, this.name);
    };
    ShaderLoader.prototype.loadError = function () {
        this.callback("shaderLoader :: Load Faild");
    };
    return ShaderLoader;
})();
var ShaderLoadManager;
(function (ShaderLoadManager) {
    ShaderLoadManager.shaders = {};
    var shaderLoaders;
    var urls = [
        'fragmentShaderDepth',
        'vertexShaderDepth'
    ];
    function init() {
        var length = urls.length;
        for (var i = 0; i < length; i++) {
            var url = 'assets/shader/' + urls[i] + '.glsl';
            shaderLoaders[i] = new ShaderLoader(urls[i], url, loadComp.bind(this));
        }
    }
    ShaderLoadManager.init = init;
    function loadComp(shader, name) {
        ShaderLoadManager.shaders[name] = shader;
        var strArray = shader.split(/\r\n|\r|\n/);
        var str = '"';
        var length = strArray.length;
        for (var i = 0; i < length; i++) {
            if (strArray[i] != '') {
                str += strArray[i];
            }
        }
        str += '"';
        alert(str);
    }
})(ShaderLoadManager || (ShaderLoadManager = {}));
var SkyBox = (function (_super) {
    __extends(SkyBox, _super);
    function SkyBox() {
        _super.call(this);
        this.materials1 = [];
        this.materials2 = [];
        this.fadeTime = 1000;
        this.mesh1 = MeshManager.duplicate(AssetManager.assets.objects['skyBox']);
        MaterialManager.setMaterial(this.mesh1, 'skyBox');
        this.mesh1.position.set(0, 0, 0);
        this.mesh1.scale.multiplyScalar(2.5);
        this.mesh1.updateMatrix();
        this.add(this.mesh1);
        this.animate();
    }
    SkyBox.prototype.fadeOut = function () {
        TweenManager.addTweenObj(MaterialManager.skyBoxMaterial.uniforms.tunnelAlpha, { value: 1.0 }, 1000, TWEEN.Easing.Linear.None);
    };
    SkyBox.prototype.setVisible = function (flag) {
        if (flag) {
            MaterialManager.skyBoxMaterial.uniforms.tunnelAlpha.value = 0.0;
        }
        else {
            MaterialManager.skyBoxMaterial.uniforms.tunnelAlpha.value = 1.0;
        }
    };
    SkyBox.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.animate(); });
    };
    return SkyBox;
})(THREE.Object3D);
var StageManager;
(function (StageManager) {
    var groundMergeMesh;
    StageManager.grounds = [];
    var trees = [];
    var tsuribashis = [];
    var warps = [];
    StageManager.boxs = [];
    var bikkuriButtons = [];
    var spikes = [];
    StageManager.zakos = [];
    var block0s = [];
    var block1s = [];
    var block2s = [];
    var index = -1;
    StageManager.player;
    function add(stageIndex) {
        index = stageIndex;
        var groundMergeGOs = [];
        var stageObj = StageData.stages[stageIndex];
        for (var type in stageObj) {
            for (var i = 0; i < stageObj[type].length; i++) {
                switch (type) {
                    case "grounds":
                        var newFlag = true;
                        var length = StageManager.grounds.length;
                        if (length) {
                            var assetName = stageObj[type][i].name;
                            for (var j = 0; j < length; j++) {
                                if (StageManager.grounds[j].assetName == assetName && !StageManager.grounds[j].addFlag) {
                                    StageManager.grounds[j].reset(stageIndex, i);
                                    groundMergeGOs.push(StageManager.grounds[j]);
                                    newFlag = false;
                                    break;
                                }
                            }
                        }
                        if (newFlag) {
                            var ground = new Ground(stageIndex, i);
                            StageManager.grounds.push(ground);
                            groundMergeGOs.push(ground);
                        }
                        break;
                    case "trees":
                        if (trees[i]) {
                            trees[i].reset(stageIndex, i);
                            groundMergeGOs.push(trees[i]);
                        }
                        else {
                            var tree = new Tree(stageIndex, i);
                            trees.push(tree);
                            groundMergeGOs.push(tree);
                        }
                        break;
                    case "tsuribashis":
                        if (tsuribashis[i]) {
                            var tsuribashi = tsuribashis[i];
                            tsuribashi.reset(stageIndex, i);
                        }
                        else {
                            tsuribashi = new Tsuribashi(stageIndex, i);
                            tsuribashis.push(tsuribashi);
                        }
                        if (tsuribashi.data.visible) {
                            groundMergeGOs.push(tsuribashi);
                        }
                        else {
                            SceneManager.scene.add(tsuribashi);
                        }
                        break;
                    case "warps":
                        if (warps[i]) {
                            warps[i].reset(stageIndex, i);
                        }
                        else {
                            var warp = new Warp(stageIndex, i);
                            warps.push(warp);
                            SceneManager.scene.add(warp);
                        }
                        break;
                    case "boxs":
                        if (StageManager.boxs[i]) {
                            StageManager.boxs[i].reset(stageIndex, i);
                        }
                        else {
                            var box = new Box(stageIndex, i);
                            StageManager.boxs.push(box);
                            SceneManager.scene.add(box);
                        }
                        break;
                    case "bikkuriButtons":
                        if (bikkuriButtons[i]) {
                            bikkuriButtons[i].reset(stageIndex, i);
                        }
                        else {
                            var bikkuriButton = new BikkuriButton(stageIndex, i, bikkuriButtons.length);
                            bikkuriButtons.push(bikkuriButton);
                            SceneManager.scene.add(bikkuriButton);
                        }
                        break;
                    case "spikes":
                        if (spikes[i]) {
                            spikes[i].reset(stageIndex, i);
                        }
                        else {
                            var spike = new Spike(stageIndex, i);
                            spikes.push(spike);
                            spike.hitTarget = StageManager.player;
                            SceneManager.scene.add(spike);
                        }
                        break;
                    case "zakos":
                        if (StageManager.zakos[i]) {
                            StageManager.zakos[i].reset(stageIndex, i);
                        }
                        else {
                            var zako = new Zako(stageIndex, i);
                            StageManager.zakos.push(zako);
                            StageManager.player.setReleaseTargets(zako);
                            SceneManager.scene.add(zako);
                        }
                        break;
                    case "block0s":
                        if (block0s[i]) {
                            block0s[i].reset(stageIndex, i);
                        }
                        else {
                            var block0 = new Block0(stageIndex, i);
                            block0s.push(block0);
                            SceneManager.scene.add(block0);
                        }
                        break;
                    case "block1s":
                        if (block1s[i]) {
                            block1s[i].reset(stageIndex, i);
                        }
                        else {
                            var block1 = new Block1(stageIndex, i);
                            block1s.push(block1);
                            SceneManager.scene.add(block1);
                        }
                        break;
                    case "block2s":
                        if (block2s[i]) {
                            block2s[i].reset(stageIndex, i);
                        }
                        else {
                            var block2 = new Block2(stageIndex, i);
                            block2s.push(block2);
                            SceneManager.scene.add(block2);
                        }
                        break;
                }
            }
        }
        var catchTargets = [];
        var length = StageManager.boxs.length;
        for (var i = 0; i < length; i++)
            catchTargets.push(StageManager.boxs[i]);
        length = StageManager.zakos.length;
        for (i = 0; i < length; i++)
            catchTargets.push(StageManager.zakos[i]);
        StageManager.player.setCatcher(catchTargets);
        resetHitTargets();
        if (groundMergeGOs.length) {
            groundMergeMesh = GameObjectManager.merge(groundMergeGOs);
            groundMergeMesh.castShadow = true;
            SceneManager.scene.add(groundMergeMesh);
        }
    }
    StageManager.add = add;
    function resetHitTargets() {
        StageManager.player.clearHitTargets();
        var length = warps.length;
        for (var i = 0; i < length; i++) {
            if (warps[i].visible)
                StageManager.player.setHitTarget(warps[i]);
        }
        length = spikes.length;
        var names = [];
        for (i = 0; i < length; i++) {
            if (spikes[i].visible)
                names.push(spikes[i].name);
        }
        StageManager.player.setGroundHitRay(names);
        length = StageManager.boxs.length;
        var bikkuriButtonsLength = bikkuriButtons.length;
        for (i = 0; i < length; i++) {
            StageManager.boxs[i].clearHitTargets();
            for (var j = 0; j < bikkuriButtonsLength; j++) {
                if (bikkuriButtons[j].visible)
                    StageManager.boxs[i].setHitTarget(bikkuriButtons[j]);
            }
        }
        var zakosLength = StageManager.zakos.length;
        for (i = 0; i < length; i++) {
            for (var j = 0; j < zakosLength; j++) {
                if (StageManager.zakos[j].visible)
                    StageManager.boxs[i].setHitTarget(StageManager.zakos[j]);
            }
        }
    }
    function stageClear() {
        Vars.inGameFlag = false;
        StageManager.player.stageClearFlag = true;
        StageManager.player.moveFlag = false;
        if (Vars.quality != 'low') {
            RendererManager.layerFlag = true;
            SceneManager.scene.skyBox.fadeOut();
        }
        SoundManager.setInstanceVolume(SoundManager.mainMusicId, .3);
        SoundManager.play(8, false, .7);
        setTimeout(function () {
            SoundManager.setInstanceVolume(SoundManager.mainMusicId, SoundManager.mainMusicVolume);
        }.bind(this), 2000);
        CameraManager.stageClear(cameraTweenComp.bind(this));
        CoverManager.flash('blue');
        if (Vars.quality != 'low')
            PixiManager.pixiParticle2.show();
        PixiManager.stageClearText.show();
        setTimeout(function () {
            if (Vars.quality != 'low')
                PixiManager.pixiParticle2.hide();
            PixiManager.stageClearText.hide();
        }.bind(this), 3000);
        PixiManager.time.pause();
    }
    StageManager.stageClear = stageClear;
    function cameraTweenComp() {
        setTimeout(function () {
            nextStage();
        }.bind(this), 2000);
    }
    var sameFlag = false;
    function nextStage(_index) {
        if (_index === void 0) { _index = null; }
        TextManager.refresh();
        sameFlag = false;
        if (_index == null) {
            index++;
            if (index >= StageData.stages.length)
                index = 0;
        }
        else {
            if (index == _index)
                sameFlag = true;
            index = _index;
        }
        Vars.renderFlag = false;
        MaterialManager.animateFlag = false;
        PhysicsManager.stop();
        PixiManager.eyeCatch.callBack = eyeCatchCallBack.bind(this);
        PixiManager.eyeCatch.show(index + 1);
        setTimeout(eyeCatchHide.bind(this), 3000);
    }
    StageManager.nextStage = nextStage;
    function eyeCatchHide() {
        PixiManager.eyeCatch.hide();
    }
    function eyeCatchCallBack(type) {
        if (type == 'showComp') {
            if (PixiManager.loading.visible) {
                PixiManager.loading.hide();
            }
            Vars.renderFlag = true;
            PhysicsManager.start();
            RendererManager.layerFlag = false;
            SceneManager.scene.skyBox.setVisible(true);
            if (!sameFlag) {
                remove();
                add(index);
            }
            PhysicsManager.setPosition(StageManager.player.rigidBodyIndex, new THREE.Vector3(0, 1, 0));
            StageManager.player.restart();
            CameraManager.camera.opInit();
            if (Vars.quality != 'low') {
                SceneManager.scene.leafParticle1.position.copy(CameraManager.camera.cameraTarget.position);
                SceneManager.scene.leafParticle1.position.y = 10;
            }
            Vars.maxYieldCount = 10;
            Vars.yieldFunc = function () {
                Vars.renderFlag = false;
                PhysicsManager.stop();
            }.bind(this);
            PixiManager.time.visible = false;
        }
        else if (type == 'hideComp') {
            Vars.renderFlag = true;
            MaterialManager.animateFlag = true;
            PhysicsManager.start();
            CameraManager.camera.opStart();
        }
    }
    function opComp() {
        Vars.mousePosition.set(0, 0, 0);
        Vars.inGameFlag = true;
        setTimeout(function () {
            if (!DomManager.hitPointContainer.visibleFlag) {
                DomManager.hitPointContainer.fadeIn();
            }
        }.bind(this), 1000);
        PixiManager.time.visible = true;
        PixiManager.time.start(true);
    }
    StageManager.opComp = opComp;
    function remove() {
        if (groundMergeMesh) {
            SceneManager.scene.remove(groundMergeMesh);
            groundMergeMesh.geometry.dispose();
        }
        var length = StageManager.grounds.length;
        for (var i = 0; i < length; i++) {
            StageManager.grounds[i].addFlag = false;
            PhysicsManager.removeRigidBody(StageManager.grounds[i]);
        }
        length = trees.length;
        for (var i = 0; i < length; i++) {
            trees[i].setVisible(false);
        }
        length = tsuribashis.length;
        for (i = 0; i < length; i++) {
            PhysicsManager.removeRigidBody(tsuribashis[i]);
            tsuribashis[i].setVisible(false);
            if (tsuribashis[i].parent)
                SceneManager.scene.remove(tsuribashis[i]);
        }
        length = warps.length;
        for (i = 0; i < length; i++) {
            warps[i].setVisible(false);
        }
        DomManager.mouseNavi.hide();
        if (StageManager.player.nowTween) {
            StageManager.player.nowTween.stop();
            StageManager.player.nowTween = null;
        }
        StageManager.player.setScale(StageManager.player.defaultScale);
        StageManager.player.catherEnabledFlag = true;
        StageManager.player.stageClearFlag = false;
        StageManager.player.moveFlag = false;
        StageManager.player.visible = false;
        if (StageManager.player.catchingFlag) {
            StageManager.player.catcherClear();
        }
        length = StageManager.boxs.length;
        for (i = 0; i < length; i++) {
            StageManager.boxs[i].setVisible(false);
            PhysicsManager.removeRigidBody(StageManager.boxs[i]);
        }
        length = bikkuriButtons.length;
        for (i = 0; i < length; i++) {
            bikkuriButtons[i].setVisible(false);
            PhysicsManager.removeRigidBody(bikkuriButtons[i]);
        }
        length = spikes.length;
        for (i = 0; i < length; i++) {
            spikes[i].setVisible(false);
            PhysicsManager.removeRigidBody(spikes[i]);
        }
        length = StageManager.zakos.length;
        for (i = 0; i < length; i++) {
            StageManager.zakos[i].setVisible(false);
            StageManager.zakos[i].moveType = null;
            PhysicsManager.removeRigidBody(StageManager.zakos[i]);
        }
        length = block0s.length;
        for (i = 0; i < length; i++) {
            block0s[i].setVisible(false);
            PhysicsManager.removeRigidBody(block0s[i]);
        }
        length = block1s.length;
        for (i = 0; i < length; i++) {
            block1s[i].setVisible(false);
            PhysicsManager.removeRigidBody(block1s[i]);
        }
        length = block2s.length;
        for (i = 0; i < length; i++) {
            block2s[i].setVisible(false);
            PhysicsManager.removeRigidBody(block2s[i]);
        }
    }
    function gameOver() {
        StageManager.player.deadFlag = true;
        StageManager.player.moveFlag = false;
        if (StageManager.player.catchingFlag) {
            StageManager.player.catcherClear();
        }
        Vars.inGameFlag = false;
        Vars.gameOverFlag = true;
        PixiManager.gameOverText.show();
        DomManager.mouseNavi.hide();
        DomManager.restartBtn.show();
        PixiManager.time.pause();
        CameraManager.camera.gameOver();
    }
    StageManager.gameOver = gameOver;
    function restart() {
        Vars.gameOverFlag = false;
        PixiManager.gameOverText.hide(gameOverTextHideComp.bind(this));
        DomManager.hitPointContainer.reset();
    }
    StageManager.restart = restart;
    function gameOverTextHideComp() {
        nextStage(0);
    }
})(StageManager || (StageManager = {}));
var ThreeManager;
(function (ThreeManager) {
    var projector = new THREE.Projector();
    function screen2world() {
        var mouse = new THREE.Vector3(Vars.mouseX, Vars.mouseY, .5);
        mouse.x = (mouse.x / Vars.stageWidth) * 2 - 1;
        mouse.y = -(mouse.y / Vars.stageHeight) * 2 + 1;
        projector.unprojectVector(mouse, CameraManager.camera);
        return mouse;
    }
    ThreeManager.screen2world = screen2world;
    function world2screen(object) {
        var pos = object.position.clone();
        pos.project(CameraManager.camera);
        pos.x = (pos.x + 1) / 2 * Vars.stageWidth;
        pos.y = -(pos.y + 1) / 2 * Vars.stageHeight;
        return pos;
    }
    ThreeManager.world2screen = world2screen;
    function getMouseTo(target) {
        var worldToScreenVector = this.world2screen(target);
        var m = new THREE.Vector3(Vars.mouseX, Vars.mouseY, 0);
        var dist = m.distanceTo(worldToScreenVector);
        var direction = m.sub(worldToScreenVector);
        var direction2 = direction.clone();
        direction.normalize();
        var x = 0;
        var z = 0;
        if (dist > 20) {
            x = -direction.x;
            z = -direction.y;
        }
        return { direction: new THREE.Vector3(x, 0, z), dist: dist, direction2: direction2 };
    }
    ThreeManager.getMouseTo = getMouseTo;
    function getXZDirection(vec1) {
        var vec2 = new THREE.Vector3();
        var absX = Math.abs(vec1.x);
        var absZ = Math.abs(vec1.z);
        if (absX > absZ) {
            if (vec1.x > 0) {
                vec2.set(1, 0, 0);
            }
            else {
                vec2.set(-1, 0, 0);
            }
        }
        else {
            if (vec1.z > 0) {
                vec2.set(0, 0, 1);
            }
            else {
                vec2.set(0, 0, -1);
            }
        }
        return vec2.normalize();
    }
    ThreeManager.getXZDirection = getXZDirection;
    function easingVector3(now, target, easing) {
        if (easing === void 0) { easing = 10; }
        var vec = new THREE.Vector3(Functions.easing(now.x, target.x, easing), Functions.easing(now.y, target.y, easing), Functions.easing(now.z, target.z, easing));
        return vec;
    }
    ThreeManager.easingVector3 = easingVector3;
    function easingVector3Bane(nowPos, targetPos, cachePos) {
        var x = Functions.easing2(nowPos.x, targetPos.x, cachePos.x);
        var y = Functions.easing2(nowPos.y, targetPos.y, cachePos.y);
        var z = Functions.easing2(nowPos.z, targetPos.z, cachePos.z);
        var returnPos = new THREE.Vector3(x.now, y.now, z.now);
        var returnCache = new THREE.Vector3(x.cache, y.cache, z.cache);
        return { pos: returnPos, cache: returnCache };
    }
    ThreeManager.easingVector3Bane = easingVector3Bane;
    function getCameraForward(vec) {
        var forward = getForward(CameraManager.camera);
        forward.y = 0;
        var right = new THREE.Vector3(forward.z, 0, -forward.x);
        var a = right.multiplyScalar(vec.x);
        var b = forward.multiplyScalar(vec.z);
        var direction = a.add(b);
        return direction;
    }
    ThreeManager.getCameraForward = getCameraForward;
    function getForward(obj) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(obj.rotation);
        return vector;
    }
    ThreeManager.getForward = getForward;
    function vectorToQuaternion(axis, _direction) {
        var direction = _direction.clone().normalize();
        var crossVec = new THREE.Vector3();
        crossVec.crossVectors(axis, direction).normalize();
        var dot = axis.dot(direction);
        var rad = Math.acos(dot);
        var q = new THREE.Quaternion();
        return q.setFromAxisAngle(crossVec, rad);
    }
    ThreeManager.vectorToQuaternion = vectorToQuaternion;
    function rotateAroundWorldAxis(object, axis, radians) {
        var rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(object.matrix);
        object.matrix = rotWorldMatrix;
        object.rotation.setFromRotationMatrix(object.matrix, 'XYZ');
    }
    ThreeManager.rotateAroundWorldAxis = rotateAroundWorldAxis;
    function quaternionAroundWorldAxis(object, axis, radians) {
        var rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(object.matrix);
        object.matrix = rotWorldMatrix;
        object.quaternion.setFromRotationMatrix(object.matrix);
    }
    ThreeManager.quaternionAroundWorldAxis = quaternionAroundWorldAxis;
    function getRotateAroundWorldAxis(object, axis, radians) {
        var rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(object.matrix);
        var rotation = object.rotation.clone();
        rotation.setFromRotationMatrix(rotWorldMatrix, 'XYZ');
        return rotation;
    }
    ThreeManager.getRotateAroundWorldAxis = getRotateAroundWorldAxis;
    function getQuaternionAroundWorldAxis(object, axis, radians) {
        var rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(object.matrix);
        var quaternion = new THREE.Quaternion();
        quaternion.setFromRotationMatrix(rotWorldMatrix);
        return quaternion;
    }
    ThreeManager.getQuaternionAroundWorldAxis = getQuaternionAroundWorldAxis;
    function getGlobalProperty(object) {
        var position = new THREE.Vector3();
        var quaternion = new THREE.Quaternion();
        var scale = new THREE.Vector3();
        object.matrixWorldNeedsUpdate = true;
        object.updateMatrixWorld(true);
        object.matrixWorld.decompose(position, quaternion, scale);
        return { position: position, quaternion: quaternion, scale: scale };
    }
    ThreeManager.getGlobalProperty = getGlobalProperty;
    function getLine(posArray, color) {
        var geo = new THREE.Geometry();
        var length = posArray.length;
        for (var i = 0; i < length; i++)
            geo.vertices.push(posArray[i]);
        var line = new THREE.Line(geo, new THREE.LineBasicMaterial(color));
        return line;
    }
    ThreeManager.getLine = getLine;
    function setLinePos(line, posArray) {
        var length = posArray.length;
        for (var i = 0; i < length; i++)
            line.geometry.vertices[i].copy(posArray[i]);
        line.geometry.verticesNeedUpdate = true;
    }
    ThreeManager.setLinePos = setLinePos;
    function deleteObjects(parent) {
        var length = parent.children.length;
        for (var i = 0; i < length; i++) {
            var child = parent.children[0];
            parent.remove(child);
            deleteObject(child);
        }
        if (!length) {
            parent = null;
            delete parent;
        }
    }
    ThreeManager.deleteObjects = deleteObjects;
    function deleteObject(child) {
        if (child.geometry) {
            deleteGeometry(child);
        }
        if (child.material) {
            if (child.material.map) {
                deleteTexture(child.material.map);
            }
            if (child.material.lightMap) {
                deleteTexture(child.material.lightMap);
            }
            if (child.material.specularMap) {
                deleteTexture(child.material.specularMap);
            }
            if (child.material.alphaMap) {
                deleteTexture(child.material.alphaMap);
            }
            if (child.material.envMap) {
                deleteTexture(child.material.envMap);
            }
            if (child.material.materials) {
                var length = child.material.materials.length;
                for (var i = 0; i < length; i++) {
                    var map = child.material.materials[i].map;
                    if (map)
                        deleteTexture(map);
                }
            }
            if (child.material.dispose)
                child.material.dispose();
            child.material = null;
            delete child.material;
        }
        deleteObjects(child);
    }
    ThreeManager.deleteObject = deleteObject;
    function deleteGeometry(mesh) {
        RendererManager.renderer.deallocateGeometry(mesh.geometry);
        mesh.geometry.dispose();
        mesh.geometry = null;
        delete mesh.geometry;
    }
    ThreeManager.deleteGeometry = deleteGeometry;
    function deleteTexture(map) {
        RendererManager.renderer.deallocateTexture(map);
        map.dispose();
        map = null;
        delete map;
    }
})(ThreeManager || (ThreeManager = {}));
var ThreeView = (function () {
    function ThreeView() {
        this.initRenderer();
        this.animate();
        Vars.pushResizeFunc(this.resize.bind(this));
    }
    ThreeView.prototype.initRenderer = function () {
        LightManager.init();
        LightManager.setTargetPos(new THREE.Vector3());
        MaterialManager.init();
        SceneManager.init();
        LightManager.add();
        RaycastManager.mouseMeshY = .4;
        RaycastManager.init();
        SceneManager.initObjects();
        RendererManager.init();
        var container = document.getElementById("container");
        container.appendChild(RendererManager.renderer.domElement);
    };
    ThreeView.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.animate(); });
    };
    ThreeView.prototype.resize = function () {
        var w = Vars.stageWidth;
        var h = Vars.stageHeight;
        CameraManager.camera.aspect = w / h;
        CameraManager.camera.updateProjectionMatrix();
    };
    ThreeView.prototype.reload = function () {
        ThreeManager.deleteObjects(SceneManager.scene);
        delete SceneManager.scene;
    };
    return ThreeView;
})();
var Utils;
(function (Utils) {
    function mergeFloat32Array(arrays) {
        var arraysLegth = arrays.length;
        var allLength = 0;
        for (var i = 0; i < arraysLegth; i++) {
            allLength += arrays[i].length;
        }
        var newArray = new Float32Array(allLength);
        var count = 0;
        for (i = 0; i < arraysLegth; i++) {
            var length = arrays[i].length;
            for (var j = 0; j < length; j++)
                newArray[j + count] = arrays[i][j];
            count += length;
        }
        return newArray;
    }
    Utils.mergeFloat32Array = mergeFloat32Array;
})(Utils || (Utils = {}));
//# sourceMappingURL=all.js.map
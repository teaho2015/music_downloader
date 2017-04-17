(function() {
    window.NEJ = window.NEJ || {};
    NEJ.O = {};
    NEJ.R = [];
    NEJ.F = function() {
        return !1
    }
    ;
    NEJ.P = function(By) {
        if (!By || !By.length)
            return null ;
        var TC = window;
        for (var a = By.split("."), l = a.length, i = a[0] == "window" ? 1 : 0; i < l; TC = TC[a[i]] = TC[a[i]] || {},
        i++)
            ;
        return TC
    }
    ;
    NEJ.Q = function(dB, By) {
        dB = dB || NEJ.O;
        var cH = By.split(".");
        for (var i = 0, l = cH.length; i < l; i++) {
            dB = dB[cH[i]];
            if (!dB)
                break
        }
        return dB
    }
    ;
    NEJ.C = function() {
        var bjL = function() {
            return NEJ.O.toString.call(arguments[0]) != "[object Function]"
        }
        ;
        var bjP = function(bD, cE) {
            for (var x in cE)
                if (bD == cE[x])
                    return x;
            return null
        }
        ;
        var bid = {
            dv: 0,
            cz: 1,
            cR: 2,
            dm: 3,
            cY: 4,
            ht: 5,
            lO: 6,
            ft: 7
        }
          , td = {
            dC: 0,
            cB: 1,
            cV: 2,
            dw: 3,
            df: 4,
            jn: 5,
            mX: 6,
            gS: 7
        };
        return function() {
            var gb = function() {
                this.bjV();
                return this.dv.apply(this, arguments)
            }
            ;
            gb.prototype.bjV = NEJ.F;
            gb.prototype.dv = NEJ.F;
            gb.bU = function(zC, bka) {
                if (bjL(zC))
                    return;
                if (bka == null || !!bka)
                    NEJ.X(this, zC, bjL);
                this.bFo = zC;
                this.dr = zC.prototype;
                var cQ = function() {}
                ;
                cQ.prototype = zC.prototype;
                this.prototype = new cQ;
                var BM = this.prototype;
                BM.constructor = this;
                var fy;
                for (var x in bid) {
                    fy = bjP(bid[x], td);
                    if (!fy || !this.dr[x])
                        continue;BM[x] = function(bX) {
                        return function() {
                            this[bX].apply(this, arguments)
                        }
                    }(fy)
                }
                var CM = {};
                for (var x in td) {
                    fy = bjP(td[x], bid);
                    if (!fy || !this.dr[fy])
                        continue;CM[fy] = zC;
                    BM[x] = function(bX) {
                        return function() {
                            var bp, cQ = this.Zg[bX], UZ = cQ.prototype[bX];
                            this.Zg[bX] = cQ.bFo || zC;
                            if (!!UZ)
                                bp = UZ.apply(this, arguments);
                            this.Zg[bX] = zC;
                            return bp
                        }
                    }(fy)
                }
                BM.bjV = function() {
                    this.Zg = NEJ.X({}, CM)
                }
                ;
                BM.cgr = BM.dC;
                return BM
            }
            ;
            return gb
        }
    }();
    NEJ.X = function(gR, cX, eV) {
        if (!gR || !cX)
            return gR;
        eV = eV || NEJ.F;
        for (var x in cX) {
            if (cX.hasOwnProperty(x) && !eV(cX[x], x))
                gR[x] = cX[x]
        }
        return gR
    }
    ;
    NEJ.EX = function(gR, cX) {
        if (!gR || !cX)
            return gR;
        for (var x in gR) {
            if (gR.hasOwnProperty(x) && cX[x] != null )
                gR[x] = cX[x]
        }
        return gR
    }
    ;
    var CW = Function.prototype;
    CW.fj = function(nF, Zk) {
        var f = NEJ.F
          , Zk = Zk || f
          , nF = nF || f
          , fr = this;
        return function() {
            var be = {
                args: NEJ.R.slice.call(arguments, 0)
            };
            nF(be);
            if (!be.stopped) {
                be.value = fr.apply(this, be.args);
                Zk(be)
            }
            return be.value
        }
    }
    ;
    CW.bi = function() {
        var cn = arguments
          , gR = arguments[0]
          , WV = this;
        return function() {
            var tS = NEJ.R.slice.call(cn, 1);
            NEJ.R.push.apply(tS, arguments);
            return WV.apply(gR || window, tS)
        }
    }
    ;
    CW.gY = function() {
        var cn = arguments
          , gR = NEJ.R.shift.call(cn)
          , WV = this;
        return function() {
            NEJ.R.push.apply(arguments, cn);
            return WV.apply(gR || window, arguments)
        }
    }
    ;
    var CW = String.prototype;
    if (!CW.trim) {
        CW.trim = function() {
            var eh = /(?:^\s+)|(?:\s+$)/g;
            return function() {
                return this.replace(eh, "")
            }
        }()
    }
    if (!window.MWF)
        window.MWF = NEJ;
    if (!window.mwf)
        window.mwf = NEJ.P("nej");
    if (!window.console) {
        NEJ.P("console").log = NEJ.F;
        NEJ.P("console").error = NEJ.F
    }
    var lt, gt, amp, nbsp, quot, apos, copy, reg
})();
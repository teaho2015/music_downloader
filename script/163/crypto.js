!function() {
    function a(a) {
        var d, e, b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", c = "";
        for (d = 0; a > d; d += 1)
            e = Math.random() * b.length,
            e = Math.floor(e),
            c += b.charAt(e);
        return c
    }
    function b(a, b) {
        var c = CryptoJS.enc.Utf8.parse(b)
          , d = CryptoJS.enc.Utf8.parse("0102030405060708")
          , e = CryptoJS.enc.Utf8.parse(a)
          , f = CryptoJS.AES.encrypt(e, c, {
            iv: d,
            mode: CryptoJS.mode.CBC
        });
        return f.toString()
    }
    function c(a, b, c) {
        var d, e;
        return setMaxDigits(131),
        d = new RSAKeyPair(b,"",c),
        e = encryptedString(d, a)
    }
    function d(d, e, f, g) {
        var h = {}
          , i = a(16);
        return h.encText = b(d, g),
        h.encText = b(h.encText, i),
        h.encSecKey = c(i, e, f),
        h
    }
    function e(a, b, d, e) {
        var f = {};
        return f.encText = c(a + e, b, d),
        f
    }
    window.asrsea = d,
    window.ecnonasr = e
}();
(function() {
    var bd = NEJ.P
      , fm = bd("nej.g")
      , bA = bd("nej.j")
      , bm = bd("nej.u")
      , Ka = bd("nm.x.ek")
      , bn = bd("nm.x");
    // if (bA.cG.redefine || !window.GEnc)
    //     return;
    var bbZ = function(bOP) {
        var bp = [];
        bm.cv(bOP, function(bOO) {
            bp.push(Ka.emj[bOO])
        });
        return bp.join("")
    }
    ;
    var bON = bA.cG;
    bA.cG = function(bZ, bf) {
        var bl = {}
          , bf = NEJ.X({}, bf)
          , mb = bZ.indexOf("?");
        if (/(^|\.com)\/api/.test(bZ) && !(bf.headers && bf.headers[fm.yY] == fm.Ca) && !bf.noEnc) {
            if (mb != -1) {
                bl = bm.iO(bZ.substring(mb + 1));
                bZ = bZ.substring(0, mb)
            }
            if (bf.query) {
                bl = NEJ.X(bl, bm.gH(bf.query) ? bm.iO(bf.query) : bf.query)
            }
            if (bf.data) {
                bl = NEJ.X(bl, bm.gH(bf.data) ? bm.iO(bf.data) : bf.data)
            }
            bl["csrf_token"] = bA.hI("__csrf");
            bZ = bZ.replace("api", "weapi");
            bf.method = "post";
            delete bf.query;
            var bua = window.asrsea(JSON.stringify(bl), bbZ(["流泪", "强"]), bbZ(Ka.md), bbZ(["爱心", "女孩", "惊恐", "大笑"]));
            bf.data = bm.eX({
                params: bua.encText,
                encSecKey: bua.encSecKey
            })
        }
        bON(bZ, bf)
    }
    ;
    bA.cG.redefine = true
})();

function decryptedString(a, b) {
    var e, f, g, h, c = b.split(" "), d = "";
    for (e = 0; e < c.length; ++e)
        for (h = 16 == a.radix ? biFromHex(c[e]) : biFromString(c[e], a.radix),
        g = a.barrett.powMod(h, a.d),
        f = 0; f <= biHighIndex(g); ++f)
            d += String.fromCharCode(255 & g.digits[f], g.digits[f] >> 8);
    return 0 == d.charCodeAt(d.length - 1) && (d = d.substring(0, d.length - 1)),
    d
}
function setMaxDigits(a) {
    maxDigits = a,
    ZERO_ARRAY = new Array(maxDigits);
    for (var b = 0; b < ZERO_ARRAY.length; b++)
        ZERO_ARRAY[b] = 0;
    bigZero = new BigInt,
    bigOne = new BigInt,
    bigOne.digits[0] = 1
}

function RSAKeyPair(a, b, c) {
    this.e = biFromHex(a),
    this.d = biFromHex(b),
    this.m = biFromHex(c),
    this.chunkSize = 2 * biHighIndex(this.m),
    this.radix = 16,
    this.barrett = new BarrettMu(this.m)
}
function twoDigit(a) {
    return (10 > a ? "0" : "") + String(a)
}
function encryptedString(a, b) {
    for (var f, g, h, i, j, k, l, c = new Array, d = b.length, e = 0; d > e; )
        c[e] = b.charCodeAt(e),
        e++;
    for (; 0 != c.length % a.chunkSize; )
        c[e++] = 0;
    for (f = c.length,
    g = "",
    e = 0; f > e; e += a.chunkSize) {
        for (j = new BigInt,
        h = 0,
        i = e; i < e + a.chunkSize; ++h)
            j.digits[h] = c[i++],
            j.digits[h] += c[i++] << 8;
        k = a.barrett.powMod(j, a.e),
        l = 16 == a.radix ? biToHex(k) : biToString(k, a.radix),
        g += l + " "
    }
    return g.substring(0, g.length - 1)
}
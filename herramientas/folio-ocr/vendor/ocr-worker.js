// Envoltura del worker de Tesseract.js 5.1.1.
// Los modelos de idioma se publican en base64 (.b64.txt) porque el alojamiento
// del artefacto no sirve archivos .gz. Aquí se decodifican antes de entregarlos.
(function () {
  var nativeFetch = self.fetch.bind(self);
  self.fetch = function (url, opts) {
    var u = String(url);
    if (/\.traineddata\.gz$/.test(u)) {
      return nativeFetch(u + ".b64.txt", opts).then(function (r) {
        if (!r.ok) return r;
        return r.text().then(function (t) {
          var s = atob(t.trim());
          var b = new Uint8Array(s.length);
          for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
          return new Response(b, { status: 200, headers: { "content-type": "application/octet-stream" } });
        });
      });
    }
    return nativeFetch(url, opts);
  };
  importScripts("tesseract-worker.min.js");
})();

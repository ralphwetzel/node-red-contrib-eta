const _Eta = require("eta")
class Eta extends _Eta.Eta {
    // This ensures, that no file system acces is done.
    // Additionally, it eliminates the demand to pre-pend non-file templates with "@"
    resolvePath = null;
  }

module.exports = function(RED) {
    function etaTemplate(config) {

        RED.nodes.createNode(this,config);
        let node = this;

        const eta = new Eta({
            autoTrim: false,
            varName: "msg",      // no more 'it.msg' !!
            functionHeader: "const it = { 'msg': msg };"  // offer 'it.msg' as an alternative to the new 'msg' for backward compatibility !!
        })

        // only considered for __root__
        let _async = false;

        // preload the templates
        if (config.templates && Array.isArray(config.templates)) {
            config.templates.forEach( (tpl) => {
                if (tpl.id == "__root__") {
                    _async = tpl.async ?? false;
                }
                eta.loadTemplate(tpl.id, tpl.template, {async: tpl.async} );
            });
        }

        node.on('input', function(msg, send, done) {

            send = send || function() { node.send.apply(node,arguments) }

            if (_async) {
                if (!done) {
                    node.warn("'done()' is undefined. Cannot perform async template rendering.");
                    return;
                }
    
                eta.renderAsync("__root__", msg)
                .then((result) => {
                    msg.payload = result;
                    send(msg);
                    done();
                })
                .catch((err) => {
                    done(err);
                })
                return;
            }

            try {
                msg.payload = eta.render("__root__", msg);
                send(msg);
            } catch (err) {
                node.error(err.message);
            }
            if (done) done();
            return;
        });
    }
    RED.nodes.registerType("etaTemplate",etaTemplate);
}

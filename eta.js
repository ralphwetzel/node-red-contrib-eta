Eta = require("eta")

module.exports = function(RED) {
    function etaTemplate(config) {

        function get_template(templates, id) {
            for (let tpl of templates) {
                if (tpl.id === id) {
                    return tpl;
                }
            }
            return undefined;
        }
        
        RED.nodes.createNode(this,config);
        var node = this;

        // create this node's own template cache
        node.template_cache = new Eta.config.templates.constructor({});

        node.eta_config = Eta.getConfig({
            templates: node.template_cache,
            autoTrim: false,
            includeFile: undefined,
            include: function custom_include(templateName, data) {

                // this overrides the Eta standard inplementation
                // ... to compile user provided templates on demand!
            
                // check if template cache knows templateName
                const template = this.templates.get(templateName)
                if (!template) {
                    // if not: check if there's a template source with id: templateName
                    let tpl = get_template(config.templates, templateName)
                    if (tpl) {
                        // compile this template source
                        this.templates.define(templateName, Eta.compile(tpl.template, this));
                    }
                    
                    // Use the original Eta.include function to
                    // retry to get the template from the cache
                    // ... and throw a nice error if still not found.

                    return Eta.config.include.call(this, templateName, data);
                }
                return template(data, this);
            }    
        })

        node.on('input', function(msg, send, done) {

            send = send || function() { node.send.apply(node,arguments) }

            let tpl = get_template(config.templates, "__root__")
            if (tpl)
            {
                // msg will be accessible in the template via it.msg!
                let result = Eta.render(tpl.template, {msg: msg}, node.eta_config);
                msg.payload = result;
                send(msg);
            }
            if (done) {
                done();
            }
        });
    }
    RED.nodes.registerType("etaTemplate",etaTemplate);
}

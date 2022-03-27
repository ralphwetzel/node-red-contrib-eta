# @ralphwetzel/node-red-contrib-eta

<img width="150" alt="image" src="https://user-images.githubusercontent.com/16342003/160198427-2a69ff10-e8bf-4873-9d99-2929a584ccc8.png">

A [Node-RED](https://www.nodered.org) node to utilize Eta - the lightweight, powerful, pluggable embedded JS template engine.

### Inputs

: msg (object) :  (standard) message object with data to be used for redering the \_\_root\_\_ template.

    
### Outputs

: payload (string) : the result of redering the \_\_root\_\_ template with the data provided as input.
    
### Details

This nodes allows to render a document template (named \_\_root\_\_) by utilizing the Eta JS template engine.
For help regarding the template syntax refer to the [Eta Syntax Overview](https://eta.js.org/docs/syntax) website.

If you've [enabled the use of the Monaco text editor](https://discourse.nodered.org/t/node-red-2-0-0-beta-1-released/46990#monaco-text-editor-11), syntax highlighting support is provided.


The document template (\_\_root\_\_) shall be defined in the configuration options of this node.
Data provided to the node may be accessed in the template via a variable called `it`.

```
<% /*
    This is the Eta root template.
    You may add further templates to define
    partials or layouts.
    Check https://eta.js.org for syntax
    support.
*/ -%>
<% = it.msg.payload + "! Wow!" %>
```

To use partials, you may define additional templates in the configuration options of this node.
Using those partials follows the standard Eta scheme; the data (object) again may be accessed - within the partial - via `it`.

```
<%~ include(template_name, {msg: it.msg}) %>
```
Please be aware that file partials are not supported!


An example:

The \_\_root\_\_ document template:

<img alt="eta_root" src="https://github.com/ralphwetzel/node-red-contrib-eta/blob/cf077f5bfa4150fe0d8c5177efa5903c4d436aa1/resources/eta_root.png"
    style="min-width: 474px; width: 474px; align: center; border: 1px solid lightgray;"/>

The template of the partial - to be included:

<img alt="eta_partial" src="https://github.com/ralphwetzel/node-red-contrib-eta/blob/cf077f5bfa4150fe0d8c5177efa5903c4d436aa1/resources/eta_partial.png"
    style="min-width: 474px; ; width: 474px; align: center; border: 1px solid lightgray;"/>

You may import this example as well via the Node-RED Import menu option.

### References

- [Eta website](https://eta.js.org)

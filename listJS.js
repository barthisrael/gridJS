/*MIT License

Copyright (c) 2017 Israel Barth Rubio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

/// <summary>
/// Creates a new list object instance.
/// </summary>
/// <param name="p_containerDivId">The list container.</param>
/// <paramref name="p_containerDivId">Takes a dom element id.
/// <returns>List javscript object instance</returns>
function startList(p_containerDivId) {
    var v_listObject = {
        //Set of functions to be called after some operations in list component. After starting the list component, you should replace the callbacks as you want.
        callbacks: {
            /// <summary>
            /// Function called after a list item is rendered.
            /// </summary>
            /// <param name="p_component">This list object.</param>
            /// <paramref name="p_component">List javascript object instance.
            /// <param name="p_node">The list item rendered.</param>
            /// <paramref name="p_node">List node javascript element.
            afterRenderNode: null,
            /// <summary>
            /// Function called after a list is rendered.
            /// </summary>
            /// <param name="p_component">This list object.</param>
            /// <paramref name="p_component">List javascript object instance.
            afterRenderList: null
        },
        //Some list configs. Do not modify it manually.
        configs: {
            name: 'list_' + p_containerDivId,
            nodeHeight: 24
        },
        //Some list controls. Do not modify it manually.
        controls: {
            selectedNode: null,
            nodeCounter: 0,
            currentScrollIndex: 0
        },
        //List dom elements.
        elements: {
            componentDiv: document.getElementById(p_containerDivId),
            containerDiv: null,
            dataGroupDiv: null
        },
        //List item nodes
        childNodes: [],
        //Tag to save your things
        tag: {},
        /// <summary>
        /// This should be called to insert node items in the list.
        /// </summary>
        /// <param name="p_html">Html to be displayed in the node div.</param>
        /// <paramref name="p_html">Takes a string.
        createNode: function(p_html) {
            var v_nodeObject = {
                configs: {
	                id: 'listnode_' + this.controls.nodeCounter,
	                html: p_html,
                },
                controls: {
                    rendered: false
                },
                elements: {
                    nodeDiv: null
                },
                tag : {}
            }

            this.controls.nodeCounter++;

            this.childNodes.push(v_nodeObject);

            return v_nodeObject;
        },
        /// <summary>
        /// Render the list items.
        /// </summary>
        /// <param name="p_startIndex">The index where render should start.</param>
        /// <paramref name="p_startIndex">Takes an integer or null.
        render: function(p_startIndex) {
            for(var i = 0; i < this.childNodes.length; i++) {
                this.childNodes[i].controls.rendered = false;
            }

            if(p_startIndex != null) {
                var v_newScroll = p_startIndex * this.configs.nodeHeight;
                this.elements.componentDiv.scrollTop = v_newScroll;
            }
            else {
                var p_startIndex = this.controls.currentScrollIndex;

                this.elements.dataGroupDiv.innerHTML = '';

                var v_numNodes = (parseInt(this.elements.componentDiv.offsetHeight) / parseInt(this.configs.nodeHeight));
                v_numNodes += 7;

                for(var i = p_startIndex; i < p_startIndex + v_numNodes; i++) {
                    if(i >= this.childNodes.length) {
                        break;
                    }

                    var v_nodeDiv = document.createElement('div');
                    v_nodeDiv.style.height = this.configs.nodeHeight + 'px';
                    v_nodeDiv.style.lineHeight = this.configs.nodeHeight + 'px';
                    v_nodeDiv.classList.add('list-node');
                    v_nodeDiv.innerHTML = this.childNodes[i].configs.html;
                    this.elements.dataGroupDiv.appendChild(v_nodeDiv);

                    this.childNodes[i].elements.nodeDiv = v_nodeDiv;
                    this.childNodes[i].controls.rendered = true;

                    if(this.callbacks.afterRenderNode != null) {
                        this.callbacks.afterRenderNode(this, this.childNodes[i]);
                    }
                }

                this.elements.containerDiv.style.height = (this.configs.nodeHeight * this.childNodes.length) + 'px';

                if(this.callbacks.afterRenderList != null) {
                    this.callbacks.afterRenderList(this);
                }
            }
        }
    }

    var v_listContainerDiv = document.createElement('div');
    v_listContainerDiv.classList.add('list-container');
    v_listContainerDiv.v_componentObject = v_listObject;
    v_listObject.elements.containerDiv = v_listContainerDiv;

    v_listObject.elements.componentDiv.appendChild(v_listContainerDiv);

    v_listObject.elements.componentDiv.addEventListener(
        'scroll',
        function(p_component, p_event) {
            var v_quotient = Math.floor(p_event.target.scrollTop / p_component.configs.nodeHeight); 
            var v_remainder = p_event.target.scrollTop % p_component.configs.nodeHeight;
            var v_levelDiff = Math.abs(p_component.controls.currentScrollIndex - v_quotient);

            if(v_levelDiff >= 1) {
                p_component.elements.dataGroupDiv.style.paddingTop = (v_quotient * p_component.configs.nodeHeight) + 'px';
                p_component.controls.currentScrollIndex = v_quotient;
                p_component.render();
            }
        }.bind(v_listObject.elements.componentDiv, v_listObject)
    );

    var v_dataGroupDiv = document.createElement('div');
    v_dataGroupDiv.classList.add('list-data-group');
    v_dataGroupDiv.style.paddingTop = '0px';
    v_listObject.elements.dataGroupDiv = v_dataGroupDiv;
    v_listContainerDiv.appendChild(v_dataGroupDiv);

    return v_listObject;
}
(function (global) {
    if (global instanceof Window) {
        function Ning(selector) {
            return new Ning.prototype.init(selector);
        }

        //The prototype of Ning and Ning().
        Ning.prototype = {
            constructor: Ning,
            length: 0,

            /**
             * True constructor of Ning() object.
             * @param selector The selector to select element/elements.
             */
            init: function (selector) {
                let selected = document.querySelectorAll(selector);
                selected.forEach((item, index, array) => {
                    this[index] = item;
                    this.length++;
                });
            },

            /**
             * ForEach every element in Ning.
             * @param {function} callback function(item, index).
             * @returns {Ning}
             */
            forEach: function (callback) {
                for (let i = 0; i < this.length; i++) {
                    callback(this[i], i);
                }
                return this;
            },

            /**
             * Attach event listener on selected element in Ning.
             * @param {String} eventType Event type to attach to.
             * @param  {String}   delegateFrom [optional] The elements delegated form.
             * @param {function} callback Callback function.
             * @returns {Ning}
             */
            on: function (eventType, delegateFrom, callback) {
                let realCallback = null;
                let realDelegateFrom = null;

                if (arguments.length === 2) {
                    realCallback = arguments[1];
                    this.forEach(function (item, index) {
                        item.addEventListener(eventType, realCallback);
                    });
                } else if (arguments.length === 3) {
                    if (typeof delegateFrom === 'string') {
                        realDelegateFrom = document.querySelectorAll(delegateFrom);
                    } else {
                        realDelegateFrom = delegateFrom;
                    }

                    this.forEach(function (item, index) {
                        item.addEventListener(eventType, function (e) {
                            for (let i = 0; i < realDelegateFrom.length; i++) {
                                if (e.target === realDelegateFrom[i]) {
                                    callback(e);
                                }
                            }
                        })
                    });
                }

                return this;
            },

            /**
             * Splice the elements selected in Ning.
             * @param from The start  element index.
             * @param amount The amount of elements to remove.
             * @returns {Ning}
             */
            splice: function (from, amount) {
                Array.prototype.splice.apply(this, arguments);
                return this;
            },

        };
        Ning.prototype.init.prototype = Ning.prototype;


        ///////////////////////////////////////////////////////////////////////
        //                                                                   //
        //                      static functions                             //
        //                                                                   //
        ///////////////////////////////////////////////////////////////////////
        /**
         * Extend the property in option param to the target,or Ning.prototype.
         * @param {Object} target [optional] The target to extend to.
         * @param {Object} option The object which extended from.
         */
        Ning.extend = function (target, option) {
            let realOption = null;
            let realTarget = null;

            if (arguments.length === 1) {
                realTarget = Ning.prototype;
                realOption = arguments[0];
            } else {
                realTarget = arguments[0];
                realOption = arguments[1];
            }

            for (let propertyName in realOption) {
                if (realOption.hasOwnProperty(propertyName)) {
                    realTarget[propertyName] = realOption[propertyName];
                }
            }
        };


        ///////////////////////////////////////////////////////////////////////
        //                                                                   //
        //                    extended prototype functions                   //
        //                                                                   //
        ///////////////////////////////////////////////////////////////////////
        /**
         * Get the CSS style value from the first element in Ning,or set it.
         * @param {String} styleName The CSS style name to get, or set.
         * @param {String} value [optional] The CSS style value to set.
         * @returns {*} Ning object.
         */
        Ning.prototype.css = function (styleName, value) {
            if (arguments.length === 1) {
                return window.getComputedStyle(this[0], null)[styleName];
            } else {
                this[0].style[styleName] = value;
                return this;
            }
        };

        /**
         * Get the first element's dimension(i.e. height and width), or set it.
         * @param {Object} option [optional] The Dimension param to pass.The value of height and width
         * must be a String with unit, check the example below.
         * @example
         * Ning('.sth').dimension({width: '200px', height: '300px'});
         * @returns {{width: *, height: *}} return the dimension, or Ning object if you set the value.
         */
        Ning.prototype.dimension = function (option) {
            if (arguments.length === 0) {
                return {
                    width: window.getComputedStyle(this[0], null)['width'],
                    height: window.getComputedStyle(this[0], null)['height'],
                };
            } else {
                this.forEach(function (item, index) {
                    if (option.width) {
                        item.style.width = option.width;
                    }
                    if (option.height) {
                        item.style.height = option.height;
                    }
                });
                return this;
            }
        };

        /**
         * Get attribute of the first selected element,or set attribute from param.
         * @param {String} attrName The attribute name to get or set.
         * @param {String} value [optional] The value to set to.
         * @returns {*} Returns selected attribute or Ning object.
         */
        Ning.prototype.attr = function (attrName, value) {
            if (arguments.length === 1) {
                return this[0].getAttribute(attrName);
            }
            else {
                this.forEach(function (item, index) {
                    item.setAttribute(styleName, value);
                });
                return this;
            }
        };

        /**
         * Move an element's position with accelerated speed
         * @param time Amount of time it takes,
         * @param distance Distance to move to.
         */
        Ning.prototype.moveSwing = function (time, distance) {
            this.forEach(function (item, index) {
                doMoveSwing(item, time, distance);
            });
        };

        Ning.prototype.moveLinear = function (time, distance) {
            this.forEach(function (item, index) {
                doMoveLinear(item, time, distance);
            })
        };

        ///////////////////////////////////////////////////////////////////////
        //                                                                   //
        //                    private static functions                       //
        //                                                                   //
        ///////////////////////////////////////////////////////////////////////

        /*Actual swing moving function.*/
        function doMoveSwing(element, time, distance) {
            function accelerate(t, s) {
                return 2 * s / (t * t);
            }

            let time0 = Date.now();
            let distance0 = element.offsetLeft;
            let acc = accelerate(time, distance);

            let timer = setInterval(function () {
                let passed = Date.now() - time0;
                if (element.offsetLeft - distance0 < distance) {
                    element.style.left = (1 / 2) * acc * (passed * passed) + 'px';
                } else {
                    element.style.left = distance + 'px';
                    clearInterval(timer);
                }
            }, 10);
        }

        /*Actual linear moving function.*/
        function doMoveLinear(element, time, distance) {
            function velocity(time, distance) {
                return distance / time;
            }

            let time0 = Date.now();
            let distance0 = element.offsetLeft;
            let v = velocity(time, distance);
            let timer = setInterval(function () {
                let passed = Date.now() - time0;
                if (element.offsetLeft - distance0 < distance) {
                    element.style.left = v * passed + 'px';
                } else {
                    element.style.left = distance + 'px';
                    clearInterval(timer);
                }
            }, 10);
        }

        global.Ning = Ning;
    }
})
(window);

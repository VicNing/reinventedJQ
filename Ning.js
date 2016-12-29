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
            }
            return this;
        };

        global.Ning = Ning;
    }
})
(window);

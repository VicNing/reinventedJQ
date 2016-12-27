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
             */
            forEach: function (callback) {
                for (let i = 0; i < this.length; i++) {
                    callback(this[i], i);
                }
            },

            /**
             * Attach event listener on selected element in Ning.
             * @param {String} eventType Event type to attach to.
             * @param  {String}   delegateFrom [optional] The elements delegated form.
             * @param {function} callback Callback function.
             */
            on: function (eventType, delegateFrom, callback) {
                let trueCallback = null;
                let trueDelegateFrom = null;

                if (arguments.length === 2) {
                    trueCallback = arguments[1];
                    this.forEach(function (item, index) {
                        item.addEventListener(eventType, trueCallback);
                    });
                } else if (arguments.length === 3) {
                    trueDelegateFrom = document.querySelectorAll(delegateFrom);
                    this.forEach(function (item, index) {
                        item.addEventListener(eventType, function (e) {
                            for (let i = 0; i < trueDelegateFrom.length; i++) {
                                if (e.target === trueDelegateFrom[i]) {
                                    callback(e);
                                }
                            }
                        })
                    });
                }
            },

            /**
             * Splice the elements selected in Ning.
             * @param from The start  element index.
             * @param amount The amount of elements to remove.
             */
            splice: function (from, amount) {
                Array.prototype.splice.apply(this, arguments);
            },

        };
        Ning.prototype.init.prototype = Ning.prototype;

        /**
         * Extend the property in option param to the target,or Ning.prototype.
         * @param {Object} target [optional] The target to extend to.
         * @param {Object} option The object which extended from.
         */
        Ning.extend = function (target, option) {
            let trueOption = null;
            let trueTarget = null;

            if (arguments.length === 1) {
                trueTarget = Ning.prototype;
                trueOption = arguments[0];
            } else {
                trueTarget = arguments[0];
                trueOption = arguments[1];
            }

            for (let propertyName in trueOption) {
                if (trueOption.hasOwnProperty(propertyName)) {
                    trueTarget[propertyName] = trueOption[propertyName];
                }
            }
        };

        global.Ning = Ning;
    }
})
(window);

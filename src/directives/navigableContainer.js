import Vue from "vue";

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

if ('NodeList' in window && !NodeList.prototype.forEach) {
  console.info('polyfill for IE11');
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

if (!document.querySelectorAll) {
  document.querySelectorAll = function (selectors) {
    var style = document.createElement('style'), elements = [], element;
    document.documentElement.firstChild.appendChild(style);
    document._qsa = [];

    style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
    window.scrollBy(0, 0);
    style.parentNode.removeChild(style);

    while (document._qsa.length) {
      element = document._qsa.shift();
      element.style.removeAttribute('x-qsa');
      elements.push(element);
    }
    document._qsa = null;
    return elements;
  };
}

if (!document.querySelector) {
  document.querySelector = function (selectors) {
    var elements = document.querySelectorAll(selectors);
    return (elements.length) ? elements[0] : null;
  };
}

Vue.directive("navigable-container", {
  bind(el, binding, vNode) {
    const cursorPropName = binding.value.cursorPropName;
    const enabledPropName = binding.value.enabledPropName;

    el.addEventListener("mouseover", event => {
      const hoveredListItemEl = event.target.closest("li");

      if (hoveredListItemEl && el.contains(hoveredListItemEl)) {
        el.querySelectorAll("li").forEach((listItemEl, index) => {
          if (listItemEl === hoveredListItemEl) {
            vNode.context[cursorPropName] = index;
          }
        });
      } else {
        vNode.context[cursorPropName] = -1;
      }
    });

    el.addEventListener("keydown", event => {
      if (
        ["ArrowUp", "ArrowDown"].includes(event.key) &&
        vNode.context[enabledPropName]
      ) {
        event.preventDefault();
        const minIndex = 0;
        const maxIndex = el.querySelectorAll("li").length - 1;
        const currentIndex = vNode.context[cursorPropName];

        let nextIndex;

        if (currentIndex === -1) {
          nextIndex = minIndex;
        } else {
          const currentItem = el.querySelectorAll("li").item(currentIndex);

          switch (event.key) {
            case "ArrowUp":
              if (currentItem.previousSibling) {
                nextIndex = currentIndex - 1;
              } else {
                nextIndex = minIndex;
              }
              break;
            case "ArrowDown":
              if (currentItem.nextSibling) {
                nextIndex = currentIndex + 1;
              } else {
                nextIndex = maxIndex;
              }
              break;
          }
        }

        vNode.context[cursorPropName] = nextIndex;
      }
    });
  }
});

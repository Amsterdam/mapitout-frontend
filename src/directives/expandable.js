import Vue from "vue";
import Hammer from "hammerjs";

const CLASS_HANDLE_DRAG = "handle-drag";
const STATE_ATTRIBUTE_PREFIX = "data-expandable-state";
const STATE_ATTRIBUTE_ORIGINAL_HEIGHT = `${STATE_ATTRIBUTE_PREFIX}-original-height`;
const STATE_ATTRIBUTE_DRAG_HANDLE_HEIGHT = `${STATE_ATTRIBUTE_PREFIX}-drag-handle-height`;

let disabled = false;

Vue.directive("expandable", {
  bind(el, binding, vNode) {
    disabled = vNode.context.$browserDetect.isIE;

    if (disabled) {
      return;
    }
    const expandedPropName = binding.value.expandedPropName;
    const expandingPropName = binding.value.expandingPropName;

    const sidebarHammerInstance = Hammer(el);
    sidebarHammerInstance
      .get("swipe")
      .set({ direction: Hammer.DIRECTION_VERTICAL });

    sidebarHammerInstance.on("swipeup", () => {
      vNode.context[expandedPropName] = true;
    });

    sidebarHammerInstance.on("swipedown", () => {
      vNode.context[expandedPropName] = false;
    });

    const dragHandle = document.createElement("div");
    dragHandle.classList.add(CLASS_HANDLE_DRAG);
    dragHandle.setAttribute(vNode.context.$options._scopeId, "");

    el.prepend(dragHandle);

    dragHandle.addEventListener("click", () => {
      vNode.context[expandedPropName] = !vNode.context[expandedPropName];
    });

    const dragHandleHammerInstance = Hammer(dragHandle);
    dragHandleHammerInstance
      .get("pan")
      .set({ direction: Hammer.DIRECTION_VERTICAL });

    dragHandleHammerInstance.on("panstart", () => {
      vNode.context[expandingPropName] = true;
    });

    dragHandleHammerInstance.on("pan", event => {
      const originalHeight = parseInt(
        el.getAttribute(STATE_ATTRIBUTE_ORIGINAL_HEIGHT)
      );
      const dragHandleHeight = parseInt(
        el.getAttribute(STATE_ATTRIBUTE_DRAG_HANDLE_HEIGHT)
      );

      let temporaryHeight;

      if (vNode.context[expandedPropName]) {
        temporaryHeight = window.innerHeight - event.deltaY;
      } else {
        temporaryHeight = originalHeight - event.deltaY;
      }

      if (
        dragHandleHeight <= temporaryHeight &&
        temporaryHeight <= window.innerHeight
      ) {
        el.style.height = `${temporaryHeight}px`;
      }
    });

    dragHandleHammerInstance.on("panend", () => {
      if (!el) {
        return;
      }
      vNode.context[expandingPropName] = false;

      if (vNode.context[expandedPropName]) {
        if (el.offsetHeight <= (3 * window.innerHeight) / 4) {
          vNode.context[expandedPropName] = false;
        }
      } else {
        if (el.offsetHeight >= window.innerHeight / 3) {
          vNode.context[expandedPropName] = true;
        }
      }

      vNode.context[expandingPropName] = false;
      el.style.height = "";
    });
  },

  inserted(el, binding, vNode) {
    if (disabled) {
      return;
    }

    el.setAttribute(STATE_ATTRIBUTE_ORIGINAL_HEIGHT, String(el.offsetHeight));
    el.setAttribute(
      STATE_ATTRIBUTE_DRAG_HANDLE_HEIGHT,
      el.querySelector(`.${CLASS_HANDLE_DRAG}`).offsetHeight
    );
  },

  unbind(el) {
    if (disabled) {
      return;
    }

    el.removeAttribute(STATE_ATTRIBUTE_ORIGINAL_HEIGHT);

    Hammer.off(el);

    // unlike the element bound events, the drag handle hammer events do not require explicit removal.
    // They die out with the element, whereas on swipe, the element is NOT removed
    el.querySelector(`.${CLASS_HANDLE_DRAG}`).remove();
  }
});

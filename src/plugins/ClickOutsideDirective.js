const ClickOutsideDirective = {
  mounted(element, binding) {
    element.__ClickOutsideHandler__ = (event) => {
      if (!(element == event.target || element.contains(event.target))) {
        binding.value(event);
      }
    };

    document.body.addEventListener("click", element.__ClickOutsideHandler__);
  },
  unmounted(element) {
    document.body.removeEventListener("click", element.__ClickOutsideHandler__);
  },
};

export default (app) => {
  app.directive("click-outside", ClickOutsideDirective);
};

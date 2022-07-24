import debounce from "lodash/debounce";
const PageScrollDirective = {
  mounted(element, binding) {
    element.__PageScrollHandler__ = debounce(
      () => {
        binding.value();
      },
      200,
      { leading: true },
    );

    document.body.addEventListener("scroll", element.__PageScrollHandler__);
  },
  unmounted(element) {
    document.body.removeEventListener("scroll", element.__PageScrollHandler__);
  },
};

export default (app) => {
  app.directive("page-scroll", PageScrollDirective);
};

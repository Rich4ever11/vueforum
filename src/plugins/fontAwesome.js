import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHatWizard,
  faPencilAlt,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faHatWizard);
library.add(faPencilAlt);
library.add(faCamera);

export default (app) => {
  app.component("font-awesome-icon", FontAwesomeIcon);
  app.component("fa", FontAwesomeIcon);
};

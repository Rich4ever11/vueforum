import { createStore } from "vuex";

import state from "@/store/state";
import getters from "@/store/getters";
import actions from "@/store/actions";
import mutations from "@/store/mutations";

export default createStore({
  state,
  getters,
  actions,
  mutations,
});

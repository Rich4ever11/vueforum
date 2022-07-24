import { upsert, findById, docToResource } from "@/helpers";

export default {
  setItem(state, { resource, item }) {
    upsert(state[resource], docToResource(item));
  },
  setAuthId(state, id) {
    state.authId = id;
  },
  setAuthObserverUnsubscribe(state, unsubscribe) {
    state.authObserverUnsubscribe = unsubscribe;
  },
  setAuthUserUnsubscribe(state, unsubscribe) {
    state.authUserUnsubscribe = unsubscribe;
  },
  appendUnsubscribe(state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe);
  },
  clearItems(state, { modules = [] }) {
    modules.forEach((module) => {
      state[module] = [];
    });
  },
  clearAllUnsubscribes(state) {
    state.unsubscribes = [];
  },
  clearThreads(state) {
    state.threads = [];
  },
  addPostToThread: addChildToParentMutation({
    parent: "threads",
    child: "posts",
  }),
  addThreadToForum: addChildToParentMutation({
    parent: "forums",
    child: "threads",
  }),
  addThreadToUser: addChildToParentMutation({
    parent: "users",
    child: "threads",
  }),
  addContributorToThread: addChildToParentMutation({
    parent: "threads",
    child: "contributors",
  }),
};

function addChildToParentMutation({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId);
    if (!resource) {
      return;
    }
    resource[child] = resource[child] || [];
    if (!resource[child].includes(childId)) {
      resource[child].push(childId);
    }
  };
}

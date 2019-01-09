export const state = () => ({
  id: null
})

export const mutations = {
  setUserId(state, id) {
    state.id = id
  }
}

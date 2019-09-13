<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="warning">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <router-link to="/">Home</router-link>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <span v-if="isLoggedIn">
            <a @click="logout" id="logoutBtn">Logout</a> |
          </span>
          <span v-else>
            <router-link to="/login">Login</router-link>|
          </span>
          <span v-if="isLoggedIn">
            <router-link to="/profile">Profile</router-link>
          </span>
          <span v-else>
            <router-link to="/register">Register</router-link>
          </span>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
export default {
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
}

a.router-link-exact-active {
  color: #004297;
}

#logoutBtn {
  cursor: pointer;
  /* text-decoration: underline; */
}
</style>

<template>
  <div id="login">
    <form class="login" @submit.prevent="login">
      <h1>Sign in</h1>
      <label>Email</label>
      <div>
        <input required v-model="username" type="email" placeholder="Name" />
      </div>
      <label>Password</label>
      <div>
        <input required v-model="password" type="password" placeholder="Password" />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login: function() {
      const username = this.username;
      const password = this.password;
      this.$store
        .dispatch("login", { username, password })
        .then(() => this.$router.push("/profile"))
        .catch(err => console.log(err));
    }
  }
};
</script>

<style>
</style>

<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <label for="firstName">First Name</label>
      <div>
        <input id="firstName" type="text" v-model="firstName" required autofocus />
      </div>
      <label for="lastName">Last Name</label>
      <div>
        <input id="lastName" type="text" v-model="lastName" required autofocus />
      </div>
      <label for="username">Username</label>
      <div>
        <input id="username" type="email" v-model="username" required />
      </div>
      <label for="password">Password</label>
      <div>
        <input id="password" type="password" v-model="password" required />
      </div>
      <div>
        <button type="submit">Register</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      password: ""
    };
  },
  methods: {
    register: function() {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        password: this.password
      };
      this.$store
        .dispatch("register", data)
        .then(() => this.$router.push("/"))
        .catch(err => console.log(err));
    }
  }
};
</script>
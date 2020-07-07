<template>
  <form class="container">
    <div class="form-group">
      <label for="email">Email address</label>
      <input
        type="email"
        v-model="email"
        v-bind:class="{'form-control':true, 'is-invalid' : !validEmail(email) && emailBlured}"
        v-on:blur="emailBlured = true"
      />
      <div class="invalid-feedback">A valid email is required</div>
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input
        type="password"
        v-model="password"
        v-bind:class="{'form-control':true, 'is-invalid' : !password && passwordBlured}"
        v-on:blur="passwordBlured = true"
      />
      <div class="invalid-feedback">Password is required</div>
    </div>
    <div v-if="errorServerMessage" class="text-danger">{{errorServerMessage}}</div>
    <button type="button" class="btn btn-primary" @click="submit">Submit</button>
  </form>
</template>
<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      emailBlured: false,
      passwordBlured: false,
      valid: false
    };
  },
  computed: {
    errorServerMessage() {
      return this.$store.getters.getErrorMessage;
    }
  },
  methods: {
    validate() {
      this.emailBlured = true;
      this.passswordBlured = true;
      if (this.validEmail(this.email) && this.password != "") {
        this.valid = true;
      }
    },
    validEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email.toLowerCase());
    },
    async submit() {
      this.$store.commit("setErrorMessage", "");
      this.validate();
      if (this.valid) {
        await this.$store.dispatch("retrieveToken", {
          email: this.email,
          password: this.password
        });
        this.$router.push({ name: "expenses" });
      }
    }
  }
};
</script>
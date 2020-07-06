<template>
  <div class="container-fluid">
    <flash-message 
    transitionIn="animated swing" class="alert"></flash-message>
    <router-view></router-view>
  </div>
</template>
<script>
require('vue-flash-message/dist/vue-flash-message.min.css');
export default {
  created: function() {
    axios.interceptors.response.use(undefined, function(err) {
      return new Promise(function(resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          // if you ever get an unauthorized, logout the user
          this.$store.dispatch('destroyToken')
          .then(() => {
            this.$router.push({ name: "login" });
          })
          // you can also redirect to /login if needed !
        }
        throw err;
      });
    });
  }
};
</script>
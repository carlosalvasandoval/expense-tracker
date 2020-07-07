<template></template>
<script>
export default {
  async created() {
    await this.$store.dispatch("destroyToken")
    this.$router.push({ name: "login" });
  }
};
</script>
<template>
  <a
    :href="lineShareUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="line-share-link"
    @click="handleClick"
  >
    分享到 LINE
  </a>
</template>

<script>
export default {
  props: {
    shareUrl: {
      type: String,
      required: true,
    },
    shareText: {
      type: String,
      default: "",
    },
  },
  computed: {
    lineShareUrl() {
      const baseUrl = "https://social-plugins.line.me/lineit/share";
      const encodedUrl = encodeURIComponent(this.shareUrl);
      const encodedText = encodeURIComponent(this.shareText);
      return `${baseUrl}?url=${encodedUrl}&text=${encodedText}`;
    },
  },
  methods: {
    handleClick() {
      // 延遲 5 秒跳轉
      setTimeout(() => {
        this.$router.push("/membersforgotPwd1");
      }, 5000);
    },
  },
};
</script>

<style scoped>
.line-share-link {
  color: #00b900;
  text-decoration: none;
}
.line-share-link:hover {
  text-decoration: underline;
}
</style>

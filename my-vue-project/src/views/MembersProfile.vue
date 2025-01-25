<template>
  <div class="Profile">
    <h2></h2>
    <div class="profile-container">
      <!-- 左側會員資訊 -->
      <div class="profile-left">
        <div class="info-card">
          <p><strong></strong> {{ username }}，您好</p>
          <p><strong>會員等級:</strong> {{ memberLevel }}</p>
          <p><strong>專屬活動碼:</strong> {{ activityCode }}</p>
          <p><strong>email:</strong> {{ email }}</p>
          <p><strong>account:</strong> {{ account }}</p>
          <p><strong>身分證字號:</strong> {{ idNumber }}</p>
        </div>
      </div>
      <!-- 右側功能區塊 -->
      <div class="profile-right">
        <div class="feature-card" @click="goToPolicy">
          <font-awesome-icon :icon="['fas', 'file-shield']" />
          <p>我的保單</p>
        </div>
        <div class="feature-card" @click="goToClaims">
          <font-awesome-icon :icon="['fas', 'shield-alt']" />
          <p>理賠專區</p>
        </div>
        <div class="feature-card" @click="goToMemberInformation">
          <font-awesome-icon :icon="['fas', 'user']" />
          <p>會員資料</p>
        </div>
        <div class="feature-card" @click="goToMembersPassword">
          <font-awesome-icon :icon="['fas', 'user']" />
          <p>修改密碼</p>
        </div>
        <div class="feature-card" @click="goToActivity">
          <font-awesome-icon :icon="['fas', 'star']" />
          <p>專屬活動</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "membersprofile",
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const router = useRouter();

    // 定義響應式資料
    const username = ref(sessionStorage.getItem("username") || "訪客");
    const memberLevel = ref("VIP會員");
    const activityCode = ref("EXCL12345");
    const email = ref(sessionStorage.getItem("email") || "訪客");
    const account = ref(sessionStorage.getItem("account") || "訪客");
    const idNumber = ref(sessionStorage.getItem("idNumber") || "訪客");
    

    // 檢查是否登入
  if (!username.value || !email.value || !account.value) {
    // 若未登入，跳轉到登入頁面
    router.push("/login");
  }

    // 跳轉功能邏輯
    const goToPolicy = () => router.push("/policy");
    const goToClaims = () => router.push("/claims");
    const goToActivity = () => router.push("/activity");
    const goToMemberInformation=()=>router.push("/memberInformation");
    const goToMembersPassword=()=>router.push("/membersPassword");
    
    return {
      username,
      memberLevel,
      activityCode,
      email,
      account,
      idNumber,
      goToPolicy,
      goToClaims,
      goToActivity,
      goToMemberInformation,
      goToMembersPassword,
    };
  },
};
</script>

<style scoped>
.Profile {
  max-width: 900px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fdfdfd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.profile-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.profile-left {
  flex: 1;
}
.info-card {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #fafafa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.info-card p {
  margin: 10px 0;
  font-size: 16px;
  color: #333;
}
.profile-right {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}
.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #fff;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.feature-card p {
  margin: 0;
  font-size: 14px;
  color: #555;
}
</style>

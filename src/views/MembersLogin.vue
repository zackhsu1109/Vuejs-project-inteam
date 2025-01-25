<template>
  <div id="element-plus">
    <div class="MemberLogin">
      <h2>會員登入</h2>
      <el-form :model="form" :rules="rules" ref="memberLoginForm" label-width="100px">
        <!-- 身分證字號欄位 -->
        <el-form-item label="身分證字號" prop="idNumber">
          <el-row>
            <el-col :span="24">
              <el-input
                v-model="form.idNumber"
                placeholder="格式:A123456789"
                maxlength="10"
                minlength="10"
                @blur="convertToUppercase('idNumber')"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 密碼欄位 -->
        <el-form-item label="密碼" prop="password">
          <el-row>
            <el-col :span="18">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="請輸入密碼"
              ></el-input>
            </el-col>
            <el-col :span="6" class="forgot-password-col">
              <el-button @click="goToForgotPwd" type="text">忘記密碼?</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 登入按鈕 -->
        <el-row class="custom-row">
          <LineShareButton shareUrl="https://www.youtube.com/watch?v=BJfGQ1QKxiU" />
          <LineShareButtonCustom shareUrl="https://www.youtube.com/watch?v=BJfGQ1QKxiU"
  shareText="這是自訂的分享內容，快來看看！"
/>
          <!-- 登入按鈕 -->
          <el-col :span="4" class="login-section">
            <el-button type="primary" @click="submitForm">登入</el-button>
          </el-col>

          <!-- 還不是會員嗎？立即註冊 -->
          <el-col :span="10" class="register-section">
            <span class="not-member-text">還不是會員嗎？</span>
            <el-button @click="goToRegister" type="text">立即註冊</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import LineShareButton from "@/components/LineShareButton.vue";
import LineShareButtonCustom from "@/components/LineShareButtonCustom.vue";

export default {
  name: "MembersLogin",
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    
    const form = ref({
      idNumber: "",
      password: "",
    });

    const rules = ref({
      idNumber: [
        { required: true, message: "請輸入身分證字號", trigger: "blur" },
        {
          pattern: /^[A-Z][12]\d{8}$/,
          message: "身分證字號格式不正確",
          trigger: "blur",
        },
      ],
      password: [
        { required: true, message: "請輸入密碼", trigger: "blur" },
        {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&])[A-Za-z\d!@#$%&]{8,16}$/,
          message: "密碼為大小寫字母、數字及特殊符號組成8-16位",
          trigger: "blur",
        },
      ],
    });

    const memberLoginForm = ref(null);
    let loading = ref(false);

    const submitForm = () => {
      if (loading.value) return;
      loading.value = true;
      memberLoginForm.value.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.post(
              "http://localhost:8081/membersLogin",
              form.value
            );
            console.log(response);
            
            if (response.data.success) {
              
              sessionStorage.setItem("idNumber", response.data.data.idNumber);
              sessionStorage.setItem("sessionId", response.data.data.sessionId);
              sessionStorage.setItem("username", response.data.data.username);
              sessionStorage.setItem("account", response.data.data.account);
              sessionStorage.setItem("email", response.data.data.email);
              sessionStorage.setItem("birthday", response.data.data.birthday);
               // 更新 Pinia 狀態
              userStore.login(response.data.data.username);

              Swal.fire({
                title: "登入成功",
                text: `歡迎您，${response.data.data.username}`,
                icon: "success",
                confirmButtonText: "確定",
              }).then(() => {
                router.push("/membersprofile");
              });
            } else {
              Swal.fire({
                title: "登入失敗",
                text: "response.data.message",
                icon: "error",
                confirmButtonText: "好",
              });
              ElMessage.error(response.data.message);
            }
          } catch (error) {
            Swal.fire({
              title: "登入失敗",
              text: "請稍後再試",
              icon: "error",
              confirmButtonText: "好",
            });
            console.error(error);
          }
        }
      });
    };

    const goToForgotPwd = () => {
      router.push("/membersforgotPwd1");
    };

    const goToRegister = () => {
      router.push("/membersregister");
    };

    const convertToUppercase = (field) => {
      form.value[field] = form.value[field].toUpperCase();
    };

    return {
      form,
      rules,
      memberLoginForm,
      submitForm,
      goToForgotPwd,
      goToRegister,
      convertToUppercase,
 
    };
  },components: {
    LineShareButton,
    LineShareButtonCustom,
  },
};
</script>

<style>
#element-plus {
.MemberLogin {
  
  max-width: 450px;
  margin: 50px auto;
  margin-top: 150px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}
.send-code-btn-col {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 10px;
  margin-left: 10px;
}
.password-row {
  display: flex;
  align-items: center;
}
.password-row .el-input {
  flex: 1;
}
.password-row .el-button {
  margin-left: 10px; 
}
.forgot-password-col .el-button,
.send-code-btn-col .el-button {
  margin-left: 10px; 
}
.el-row {
  margin-bottom: 10px;
}
.not-member-text {
  font-size: 13px;
}
.custom-row {
  display: flex;
  align-items: center; 
}
.login-section {
  display: flex;
  margin-left: 100px; 
}

.register-section {
  display: flex;
  align-items: center;
}
}
    
</style>
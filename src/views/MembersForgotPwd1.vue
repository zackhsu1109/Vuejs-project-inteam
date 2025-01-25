<template>
  <div class="ForgotPwd1">
    <h2>請填寫身分證字號及手機號碼</h2>
    <el-form :model="form" :rules="rules" ref="memberLoginForm" label-width="100px">
      <!-- 身分證字號欄位 -->
      <el-form-item label="身分證字號" prop="idNumber">
        <el-col :span="18">
          <el-input
            v-model="form.idNumber"
            placeholder="格式:A123456789"
            maxlength="10"
            minlength="10"
            @blur="convertToUppercase('idNumber')"
          ></el-input>
        </el-col>
      </el-form-item>

      <!-- 手機號碼欄位 -->
      <el-form-item label="手機號碼" prop="phone">
        <el-col :span="18">
          <el-input
            v-model="form.phone"
            placeholder="請輸入註冊時的手機號碼"
            maxlength="10"
            minlength="10"
          ></el-input>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="submitForm">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 驗證碼已發送的提示 -->
    <div v-if="emailSent">
      <p>驗證碼已發送至註冊時您填寫的信箱，請於10分鐘內完成驗證。</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  setup() {
    const form = ref({
      idNumber: "",
      phone: "",
    });
    const router = useRouter();
    const emailSent = ref(false);
    const loading = ref(false);
    const memberLoginForm = ref(null);

    const rules = ref({
      idNumber: [
        { required: true, message: "請輸入身分證字號", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            const idRegex = /^[A-Z][1-2]\d{8}$/;
            if (!idRegex.test(value)) {
              callback(new Error("身分證字號格式不正確"));
            } else {
              callback();
            }
          },
          trigger: "blur",
        },
      ],
      phone: [
        { required: true, message: "請輸入手機號碼", trigger: "blur" },
        { min: 10, max: 10, message: "電話號碼格式有誤", trigger: "blur" },
        { pattern: /^09\d{8}$/, message: "電話號碼格式有誤", trigger: "blur" },
      ],
    });

    const convertToUppercase = (field) => {
      form.value[field] = form.value[field].toUpperCase();
    };


    const submitForm = async () => {
  if (loading.value) return; // 防止重複提交
  loading.value = true;

  memberLoginForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await axios.post("http://localhost:8081/memberForgotPwd", {
          idNumber: form.value.idNumber,
          phone: form.value.phone,
        });

        if (response.data.successMessage) {
          // 儲存 idNumber 到 sessionStorage
          sessionStorage.setItem("idNumber", form.value.idNumber);

          // 跳轉至驗證碼頁面
          Swal.fire({
            title: "驗證碼已發送",
            text: "請檢查您的信箱，並於10分鐘內完成驗證",
            icon: "success",
            confirmButtonText: "確定",
          }).then(() => {
            router.push({
              path: "/memberVerifyCode",
              query: { verificationCodePrefix: response.data.verificationCodePrefix },
            });
          });
        } else {
          Swal.fire({
            title: "有誤，請稍後再試",
            text: response.data.errorMessage,
            icon: "error",
            confirmButtonText: "好",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "系統錯誤",
          text: "伺服器無法處理您的請求，請稍後再試",
          icon: "error",
          confirmButtonText: "好",
        });
        console.error(error);
      } finally {
        loading.value = false; // 結束加載狀態
      }
    }
  });
};

/*
const loadVerificationCodePrefix = async () => {
  try {
    const response = await axios.get("http://localhost:8081/verificationCodePrefix", {
      params: { idNumber: sessionStorage.getItem("idNumber") }, // 從 sessionStorage 獲取 idNumber
    });
    verificationCodePrefix.value = response.data.verificationCodePrefix;
  } catch (error) {
    Swal.fire({
      title: "錯誤",
      text: "無法加載驗證碼前4碼，請稍後再試",
      icon: "error",
      confirmButtonText: "好",
    });
    console.error("無法加載驗證碼前4碼", error);
  }
};*/
    return {
      form,
      rules,
      emailSent,
      loading,
      memberLoginForm,
      submitForm,
      convertToUppercase,
    };
  },
};
</script>

<style scoped>
.ForgotPwd1 {
  max-width: 450px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}
</style>

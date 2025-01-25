<template>
  <div class="container">
    <h2 class="text-center mb-4">會員資料維護</h2>
    <el-form :model="form" :rules="rules" ref="editMemberForm" label-width="120px">
      <!-- 帳號 (僅顯示，不可修改) -->
      <el-form-item label="帳號" prop="account">
        <el-input v-model="form.account" disabled></el-input>
      </el-form-item>

<!--
      <el-form-item label="密碼" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="請輸入新密碼"
        ></el-input>
      </el-form-item>


      <el-form-item label="確認密碼" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="請再次輸入密碼"
        ></el-input>
      </el-form-item>-->


      <el-form-item label="會員姓名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>

      <el-form-item label="性別" prop="gender">
        <el-select v-model="form.gender" placeholder="請選擇性別">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="生日" prop="birthday">
  <el-input v-model="form.birthday" disabled></el-input>
</el-form-item>


      <el-form-item label="身分證號" prop="idNumber">
        <el-input v-model="form.idNumber" disabled></el-input>
      </el-form-item>

 
      <el-form-item label="手機號碼" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>


      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>

   
      <el-form-item label="電子郵件" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>

   
      <el-form-item>
        <el-button type="primary" @click="submitForm">儲存修改</el-button>
        <el-button @click="closeModal">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import { useRouter } from "vue-router";
import Swal from "sweetalert2"; // 引入 SweetAlert2

export default {
  name: "MemberEdit",
  setup() {
    const router = useRouter(); // 使用 Vue Router
    const form = ref({
      id: "",
      account: "",
      username: "",
      gender: "",
      birthday: "",
      idNumber: "",
      phone: "",
      address: "",
      email: "",
    });

    const rules = ref({
      email: [
        { required: true, message: "請輸入電子郵件", trigger: "blur" },
        {
          type: "email",
          message: "請輸入有效的電子郵件地址",
          trigger: "blur",
        },
      ],
      phone: [
        { required: true, message: "請輸入手機號碼", trigger: "blur" },
        {
          pattern: /^09\d{8}$/,
          message: "手機號碼格式不正確，必須為09開頭的10位數字",
          trigger: "blur",
        },
      ],
    });

    const editMemberForm = ref(null);

    const fetchMemberData = async () => {
      const idNumber = sessionStorage.getItem("idNumber");
      if (!idNumber) {
        ElMessage.error("無法取得會員資訊，請重新登入！");
        return;
      }

      try {
        const response = await axios.post("http://localhost:8081/selectMember", { idNumber });
        if (response.data.status === "success") {
          const memberData = response.data.data;

          // 格式化生日
          if (Array.isArray(memberData.birthday) && memberData.birthday.length === 3) {
            const [year, month, day] = memberData.birthday;
            memberData.birthday = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          }

          form.value = { ...memberData };
        } else {
          ElMessage.error(response.data.message || "無法載入會員資料！");
        }
      } catch (error) {
        console.error("獲取會員資料失敗：", error);
        ElMessage.error("無法取得會員資料，請稍後再試！");
      }
    };

    const submitForm = () => {
      editMemberForm.value.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.post("http://localhost:8081/editMember", form.value);
            if (response.data.status === "success") {
              // 使用 SweetAlert2 顯示成功訊息
              Swal.fire({
                title: "資料修改成功!",
                text: "",
                icon: "success",
                confirmButtonText: "確定",
              }).then(() => {
                router.push("/MembersProfile"); // SweetAlert 點擊確定後跳轉
              });
            } else {
              ElMessage.error(response.data.message || "修改失敗，請稍後再試！");
            }
          } catch (error) {
            console.error("修改會員資料失敗：", error);
            ElMessage.error("無法修改會員資料，請稍後再試！");
          }
        }
      });
    };

    const closeModal = () => {
      router.push("/MembersProfile"); // 點擊取消時跳轉到 MembersProfile.vue
    };

    onMounted(fetchMemberData);

    return {
      form,
      rules,
      editMemberForm,
      submitForm,
      closeModal,
    };
  },
};


</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>

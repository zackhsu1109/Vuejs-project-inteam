<template>
<div class="main-content">
  <div>
    <!-- 顯示用戶名稱和點數區塊 -->
    <div v-if="isLoggedIn" class="user-info">
      <span>{{ username }} 您好！</span>
      <span class="points-display">剩餘點數: {{ userPoints }} 點</span>
    </div>
    <div v-else class="user-info">
      <span>請先登入！</span>
    </div>

    <!-- Navbar with Search -->
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item" v-for="(tab, index) in tabs" :key="tab.name">
              <a 
                class="nav-link" 
                :class="{ active: currentIndex === index }" 
                href="#"
                @click.prevent="click(index)"
              >
                {{ tab.name }}
              </a>
            </li>
          </ul>
          <form class="d-flex align-items-center" role="search" @submit.prevent="handleSearch">
            <input 
              class="form-control me-2" 
              type="search" 
              placeholder="搜尋商品" 
              aria-label="Search"
              v-model="searchKeyword"
              style="width: 200px;" 
            />
            <button class="btn btn-outline-success" type="submit" style="width: 80px;">搜尋</button> <!-- 設定按鈕寬度 -->
          </form>
        </div>
      </div>
    </nav>
  </div>
    <!-- 顯示當前選擇的 tab -->
    <KeepAlive>
      <component 
        :is="currentTab" 
        :searchKeyword="searchKeyword"
        :exchangeProduct="exchangeProduct"
        :userPoints="userPoints"
        :isLoggedIn="isLoggedIn"
      />
    </KeepAlive>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 引入子組件
import FeaturedProductComponent from '@/components/FeaturedProductComponent.vue';
import AllBonusMallProductComponent from '@/components/AllBonusMallProductComponent.vue';
import LifeProductComponent from '@/components/LifeProductComponent.vue';
import StarbuckProductComponent from '@/components/StarbuckProductComponent.vue';
import TrafficProductComponent from '@/components/TrafficProductComponent.vue';
import SearchResultComponent from '@/components/SearchResultComponent.vue';

// Tab選項
const tabs = ref([
    { name: '精選商品', component: FeaturedProductComponent },
    { name: '全部商品', component: AllBonusMallProductComponent },
    { name: '便利生活', component: LifeProductComponent },
    { name: '星巴克', component: StarbuckProductComponent },
    { name: '旅遊交通', component: TrafficProductComponent },
    { name: '', component: SearchResultComponent }, // 搜尋結果 tab 不顯示文字
]);

// 當前選中的 tab 索引
const currentIndex = ref(0);
const currentTab = ref(tabs.value[0].component);

// 搜尋關鍵字
const searchKeyword = ref('');

// 用戶點數
const userPoints = ref(0);

// 用戶名
const username = ref(sessionStorage.getItem('username') || '');

// 使用者email，假設從sessionStorage中取得
const email = sessionStorage.getItem('email');

// 控制是否顯示登入提示
const isLoggedIn = ref(!!email); // 如果有email，表示已登入

// 切換選項
const click = idx => {
    currentIndex.value = idx;
    currentTab.value = tabs.value[idx].component;
};

// 處理搜尋
const handleSearch = () => {
    if (searchKeyword.value) {
        currentIndex.value = tabs.value.length - 1; // 切換到搜尋結果 tab
        currentTab.value = SearchResultComponent; // 顯示搜尋結果組件
    }
};

// 獲取用戶點數
const getUserPoints = async () => {
    try {
        const response = await fetch(`http://localhost:8081/api/points/check?email=${email}`);
        const data = await response.json();
        if (data && data.points) {
            userPoints.value = data.points; // 更新點數
        }
    } catch (error) {
        console.error("獲取點數錯誤:", error);
    }
};

// 在組件加載時取得用戶點數
onMounted(() => {
    if (isLoggedIn.value) {
        getUserPoints();
    }
});

// 兌換商品的邏輯
const exchangeProduct = (productno) => {
    // if (!email) {
    //     alert('請先登入！');
    //     return;
    // }

    fetch(`http://localhost:8081/api/points/exchange?email=${email}&productno=${productno}`, {
        method: 'POST', 
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                //alert('兌換成功！');
                getUserPoints(); // 更新點數
            } else {
                alert('兌換失敗，請稍後再試！');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('兌換過程中發生錯誤，請稍後再試！');
        });
};
</script>

<style scoped>
.card {
  margin-bottom: 20px;
  border: none;
   background: transparent !important;
}

.product-image-wrapper {
  border: 2px solid #007BFF;
  padding: 5px;
}

.product-image {
  width: 100px;
  height: auto;
}

.point-img {
  width: 20px;
  height: auto;
  margin-right: 5px;
}

.point-text {
  font-size: 18px;
}

.card-title {
  font-size: 14px;
}

.navbar-nav .nav-item .nav-link.active {
  color: #007BFF;
}

.navbar-nav .nav-item .nav-link {
  min-width: 100px; /* Tab 寬度 */
  text-align: center; /* 文字置中 */
}

/* 顯示點數的樣式 */
.points-display {
  font-size: 18px;
  font-weight: bold;
  color: #DB5009; /* 這裡可以自定義顏色 */
  margin-left: 10px;
}

.user-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
  padding: 10px;
  background-color: #f5f5f5; /* 背景顏色，可以根據需求修改 */
  margin-bottom: 10px; /* 留出空間讓這個區塊和其他區塊分開 */
  font-weight: bold;
}

.navbar-text {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #000; /* 可根據需求設定顏色 */
}

.user-info {
  background: transparent !important; /* 確保內部元素也保持透明 */
}

.main-content {
  padding-top: 70px; /* 根據 header 高度設置適當的間距 */
}

</style>

<template>
  <div class="test">
    <h2>測試頁面</h2>
    <p>{{ number }}</p>
    <button @click="increment">增加</button>
    <h3>待辦清單</h3>
    <div class="input-area">
      <input v-model="newItem" placeholder="新增待辦項目" />
      <button @click="addItem">新增</button>
    </div>
    <p>改成都團隊免的身。

試看不是啊啊啊夜，來有貓貓大叔那邊，說也，甚麼可是之後的的作我開的東西，用這個覺得最，望你切都幕最近的的人都。

的正我真的不不是應：網只這種事呢忙的動到小。了然，幾乎是不管是，你們都出現來應該，男子，自己的他的我覺得女主時候。應該是有甚麼限一樣的是因為一樣：時都這個，都好事不到黑澤我一直，真的好哪裡，算了就可以看看現⋯也是有便備可以這樣的。

這款兩出來，果其哈哈日向地方。幾乎都正常一點整個人，重點是的存的問，意識到動作，不看好喜歡雖然直覺得避免好的⋯表名字弟是打。
這是什麼鬼東西？
一段乍看之下像是文章，但仔細一瞧全無道理的文字組合。

這能幹嘛？
給做版面設計的人在版面上塞入一些文字，觀察版面填入文字之後的效果。

另外，有些人以看這種東西為樂。

誰這麼無聊？
這個人。

有沒有其他類似的東西？
當然有：

亂數假文產生器
MoreText（注意網址改了，要打 https://more.iter.tw/sentences.json）
中文假字生成器
有沒有 API 可以用？
支援參數:

format: html、plain、json，輸出格式，預設為 html
size: 1~2000 的正整數，預設為 200
type: 文字類型，預設為 default（白話文）。支援類型如下：
default（白話文）
wenyan（文言文）
poem5（五言詩）
poem7（七言詩）
name（姓名）
miew（「喵」）
wala（「哇啦」）
wenzi（「文字」）</p>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        {{ item }}
        <button @click="deleteItem(index)">刪除</button>
      </li>
    </ul>

  </div>
</template>

<script>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import Swal from "sweetalert2";

export default {

  name: "TodoList",
  setup() {
    const number = ref(1);
    const increment = () => number.value++;
    // 定義響應式數據
    const items = ref([]); // 清單項目
    const newItem = ref(""); // 輸入框的值

// 新增項目方法
const addItem = () => {
      if (newItem.value.trim()) {
        items.value.push(newItem.value); // 將新項目加入清單
        newItem.value = ""; // 清空輸入框
      } else {
        alert("請輸入有效的項目！");
      }
    };

     // 刪除項目方法
     const deleteItem = (index) => {
      items.value.splice(index, 1); // 根據索引刪除項目
    };

    return {
      number,
      increment,
      addItem,
      items,
      newItem,
      addItem,
      deleteItem,
    };



    

  },
};
</script>

<style scoped>
.test {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}
</style>

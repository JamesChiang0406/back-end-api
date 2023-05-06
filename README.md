# back-end-api
**此頁面為[front-end-vue](https://github.com/JamesChiang0406/front-end-vue)的後端頁面，需搭配使用。**


## 專案下載
```
1. 在終端機上輸入 git clone https://github.com/JamesChiang0406/back-end-api
2. 輸入cd進入下載的資料夾
3. 輸入npm install 以安裝所用之套件
4. 確認MySQL資料庫的資訊是否與config.json中的資訊相同
5. 執行前確認NODE_ENV是否為test，若否輸入export NODE_ENV=test；若是執行node app.js
6. 另附有seed檔案可提供測試資料
```

## API 的相關功能
* 帳號相關：
  * 登入以及註冊
  
* 使用者相關：
  * 瀏覽或修改自己的帳號資料：如個人資料、大頭貼或封面照片


* 貼文相關：
  * 瀏覽自己或是他人的貼文以及回覆
  * 新增或刪除自己的貼文、回覆或是按讚
  * 修改自己的貼文

* 跟隨者相關：
  * 瀏覽推薦的名單、跟隨者或是跟隨的人
  * 新增或刪除跟隨的人

* 聊天室相關：
  * 瀏覽特定聊天室的留言
  * 新增自己的留言到特定聊天室內

* 管理者相關：
  * 管理者登入
  * 瀏覽所有使用者的基本資料
  * 刪除特定的貼文

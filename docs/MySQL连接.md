# MySQL 连接说明

项目目录：`D:\blog`  
默认库名：`blog`

## 配置

`D:\blog\.env.local`：

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=你的密码
MYSQL_DATABASE=blog
```

## 初始化

```powershell
cd D:\blog
npm run db:init
```

状态检查：http://localhost:3000/api/db/status

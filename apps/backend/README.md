创建数据库

```psql
psql -U postgres
CREATE DATABASE flavor; CREATE USER flavor WITH ENCRYPTED PASSWORD 'flavor'; GRANT ALL PRIVILEGES ON DATABASE flavor TO flavor;
```

第一次启动的时候创建数据库表

```
pnpm run reset-db
```

启动服务
yarn start

开发阶段如果想重置数据库，可以执行

```
pnpm run reset-db
```

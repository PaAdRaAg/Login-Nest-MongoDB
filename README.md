## MongoDB con Docker (setup local)

### 1) Descargar imagen
```bash
docker pull mongo:7

docker volume create mdb_loginsu_data

docker run -d --name mdb-loginsu -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=adminUsr \
  -e MONGO_INITDB_ROOT_PASSWORD=admin/db_pass \
  -v mdb_loginsu_data:/data/db \
  mongo:7

  docker exec -i mdb-loginsu mongosh -u adminUsr -p "admin/db_pass" --authenticationDatabase admin --eval \
"db=db.getSiblingDB('loginsu'); db.createUser({user:'appuser',pwd:'apppass',roles:[{role:'readWrite',db:'loginsu'}]});"
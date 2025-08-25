# **📚 MRERN Open Library**
A lightweight **Open Library System** powered by the **MRERN Stack** (**MongoDB, Redis, Express.js, React, Node.js**), fetching book data from the **Open Library API**.

---

## **🌟 Key Features**
- 📖 **Browse & Search Books**
- 🔗 **Internal GraphQL Implementation**
- ⚡ **State Management with Redux**
- 🔐 **JWT-Based Authentication**
- 📧 **Email Verification**
- 🔑 **Google OAuth 2.0**

---

## **📋 Prerequisites**
Before setting up the project, ensure you have the following installed:
- 🍃 **MongoDB** → [Download](https://www.mongodb.com/try/download/enterprise)
- 🐋 **Docker** → [Download](https://docs.docker.com/get-started/get-docker)
- 🟥 **Redis Stack** → [Download (via Docker)](https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-stack/docker)
- ✉️ **Mailpit** → [Download (via Docker)](https://mailpit.axllent.org/docs/install/docker)
- 🟢 **Node.js** → [Download](https://nodejs.org/en/download)
- 📦 **pnpm** → Enable with:
```sh
corepack enable pnpm
```  

---

## **📂 Clone & Setup**
###  1️⃣ Clone the Repository 🔄
```sh
git clone https://github.com/VireZee/mrern-open-library.git
cd mrern-open-library
```

### 2️⃣ Install Dependencies 🛠️
#### ⚙️ Backend 🌐
```sh
cd server
pnpm i
```

#### 🖥️ Frontend 📱
```sh
cd ../client
pnpm i
```

###  3️⃣ Configure Environment Variables 🔧
Copy the `.env.example` files to `.env` in both the **backend** and **frontend** directories.
Each environment file must be placed in its respective service directory:  
- Backend → `server/.env`
- Frontend → `client/.env`

#### ⚙️ Backend 🌐
Navigate to the project root and create `.env` inside `server/` directory:
```sh
cd ..

# Linux/macOS
cp server/.env.example server/.env

# Windows (cmd)
copy server\.env.example server\.env

# Windows (PowerShell)
Copy-Item server/.env.example server/.env 
```

Modify `.env` with your configuration:
```env
DB_HOST=localhost
MONGODB_PORT=27017
MONGODB_USER=<your_database_user>
MONGODB_PASS=<your_database_password>
MONGODB_NAME=mrern_open_library
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=<your_redis_password>
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USER=<your_mailpit_user>
MAIL_PASS=<your_mailpit_password>
MAIL_FROM=noreply@mrern-open-library.net
DOMAIN=localhost
PORT=3000
CLIENT_PORT=5173
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
PEPPER=<your_pepper>
SECRET_KEY=<your_secret_key>
```
> [!NOTE]
> **Replace values inside <...> with your actual configuration credentials (Databases, Email, Google OAuth, etc.).**

#### 🖥️ Frontend 📱
Create `.env` inside `client/` directory:
```sh
# Linux/macOS
cp client/.env.example client/.env

# Windows (cmd)
copy client\.env.example client\.env

# Windows (PowerShell)
Copy-Item client/.env.example client/.env
```

---

## **🚀 Running the Application**
### **🚧 Development Mode**
#### ⚙️ Backend 🌐
```sh
cd server
docker run -d --name redis-stack -e REDIS_ARGS="--requirepass <your_redis_password>" -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
docker run -d --name=mailpit --restart unless-stopped -e TZ=Europe/London -p 8025:8025 -p 1025:1025 axllent/mailpit
pnpm run dev
```
> [!NOTE]
> **Mailpit will run on http://localhost:8025 to preview verification codes.**

#### 🖥️ Frontend 📱
```sh
cd ../client
pnpm run dev
```

### **🏭 Production Mode**
Before running the application in production, make sure to modify the `.env` in both `server/.env` and `client/.env`.

For `server/.env`:
```sh
PORT=3001
CLIENT_PORT=3000
```
For `client/.env`:
```sh
VITE_SERVER_PORT=3001
```
> [!IMPORTANT]
> **Make sure to keep the rest of your `.env` configurations intact.**

#### ⚙️ Backend 🌐
```sh
cd ../server
pnpm run build
pnpm start
```

#### 🖥️ Frontend 📱
```sh
cd ../client
pnpm run build
pnpm serve -s dist
```

---

## **🐳 Running with Docker (Optional)**
If you prefer running the application inside Docker containers, modify the `.env` in both `server/.env` and `client/.env`.
### 1️⃣ Configure Environment Variables 🔑
For `server/.env`:
```sh
DB_HOST=host.docker.internal
REDIS_HOST=redis
REDIS_PASS=
MAIL_HOST=mailpit
PORT=3001
CLIENT_PORT=3000
```
For `client/.env`:
```sh
VITE_SERVER_PORT=3000
```
> [!IMPORTANT]
> **Make sure to keep the rest of your `.env` configurations intact.**

### 2️⃣ Start Containers 🚢
```sh
docker compose up -d
```

### 3️⃣ Stop Containers ⛔
```sh
docker compose down
```

---

### 🙌 Acknowledgments
Special thanks to Open Library API for providing free and open access to book data.

---

### 👤 Author
Developed by [VireZee](https://github.com/VireZee). Feel free to contribute or provide feedback! 📝<br>
Contributions are welcome, especially for improving the frontend.
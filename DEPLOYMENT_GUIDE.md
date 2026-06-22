# 🚀 DEPLOYMENT GUIDE — FitFuel+ to Render + Vercel

> **Ngày:** 2026-06-20  
> **Status:** Sẵn sàng deploy  
> **Backend:** Python/FastAPI → Render  
> **Frontend:** React → Vercel

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [ ] ✅ GitHub repo: main branch up-to-date (just pushed)
- [ ] ✅ Backend tests: 16/16 passing
- [ ] ✅ Frontend: all routes working
- [ ] ✅ Database: migrations ready
- [ ] ⏳ Environment variables prepared

---

## 🔄 DEPLOYMENT SEQUENCE

### **PHASE 1: BACKEND DEPLOYMENT (Render) — 10-15 mins**

#### **Step 1: Prepare Backend for Render**

1. Kiểm tra `BE/requirements.txt` có đầy đủ dependencies:

```bash
cd d:\doanWEDKD\BE
cat requirements.txt | head -20
```

Nếu thiếu, thêm vào:
```
flask==2.3.0  (if using Flask, or fastapi==0.104.0 if using FastAPI)
gunicorn==21.0.0
python-dotenv==1.0.0
sqlalchemy==2.0.0
psycopg2-binary==2.9.0
```

2. Tạo file `Procfile` trong `BE/`:

```
web: gunicorn app.main:app
```

3. Tạo `runtime.txt` trong `BE/`:

```
python-3.11.0
```

#### **Step 2: Create Render Web Service**

1. **Login vào Render:** https://render.com
2. **Tạo Web Service mới:**
   - Click "New +" → "Web Service"
   - Connect GitHub repository: `PTWebKD/full-stack`
   - Branch: `main`
   - Root Directory: `BE`

3. **Cấu hình Deploy:**
   - **Name:** `fitfuel-api` (hoặc tên khác)
   - **Environment:** `Python 3`
   - **Build Command:** 
     ```bash
     pip install -r requirements.txt && alembic upgrade head
     ```
   - **Start Command:** 
     ```bash
     gunicorn app.main:app --bind 0.0.0.0:$PORT
     ```

4. **Thêm Environment Variables** (Settings → Environment):
   ```
   DATABASE_URL = postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DB]
   SECRET_KEY = [generate một random key dài]
   ENVIRONMENT = production
   CORS_ORIGINS = https://fitfuel-frontend.vercel.app
   ```

5. **Click "Create Web Service"** → Render sẽ tự động deploy
   - ⏳ Chờ 5-10 phút để deploy hoàn thành
   - ✅ Kiểm tra health check: `https://fitfuel-api.onrender.com/health`

---

### **PHASE 2: FRONTEND DEPLOYMENT (Vercel) — 5-10 mins**

#### **Step 1: Prepare Frontend for Vercel**

1. Kiểm tra `FE/vite.config.js` hoặc `FE/next.config.js`:

```bash
cd d:\doanWEDKD\FE
ls -la | grep "vite\|next"
```

2. Nếu dùng **Vite** (React), tạo `vercel.json` trong `FE/`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://fitfuel-api.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

3. Kiểm tra `FE/.env.production`:

```
VITE_API_URL=https://fitfuel-api.onrender.com
VITE_APP_NAME=FitFuel+
```

#### **Step 2: Create Vercel Project**

1. **Login vào Vercel:** https://vercel.com
2. **Import GitHub Project:**
   - Click "Add New..." → "Project"
   - Import `PTWebKD/full-stack` repository
   - Root Directory: `FE`

3. **Cấu hình Build Settings:**
   - **Framework Preset:** `Vite` (hoặc `Next.js` nếu dùng Next)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist` (hoặc `.next`)
   - **Install Command:** `npm install`

4. **Thêm Environment Variables** (Settings → Environment Variables):
   ```
   VITE_API_URL = https://fitfuel-api.onrender.com
   ```

5. **Click "Deploy"** → Vercel sẽ tự động deploy
   - ⏳ Chờ 3-5 phút để deploy hoàn thành
   - ✅ Kiểm tra: `https://fitfuel-frontend.vercel.app`

---

## ✅ POST-DEPLOYMENT VERIFICATION

### **Backend (Render)**

```bash
# Test API health
curl https://fitfuel-api.onrender.com/health

# Test delivery endpoint
curl https://fitfuel-api.onrender.com/api/delivery/addresses

# Check logs
# Render Dashboard → Logs tab
```

### **Frontend (Vercel)**

```bash
# Test home page
https://fitfuel-frontend.vercel.app

# Test delivery routes
https://fitfuel-frontend.vercel.app/profile/addresses
https://fitfuel-frontend.vercel.app/orders
https://fitfuel-frontend.vercel.app/gym-owner/orders

# Check logs
# Vercel Dashboard → Deployments → Logs
```

---

## 🔗 INTEGRATION CHECKLIST

After both deployments are live:

- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] API calls from FE → BE work (check Network tab in DevTools)
- [ ] Delivery routes load (`/profile/addresses`, `/orders`, etc.)
- [ ] Address CRUD endpoints respond
- [ ] Shipping fee calculation works
- [ ] Order detail page shows delivery info
- [ ] Gym owner orders page loads

---

## 🐛 COMMON DEPLOYMENT ISSUES

### **Issue 1: Backend won't start**

**Solution:**
```bash
# Check logs on Render
1. Render Dashboard → Services → fitfuel-api → Logs
2. Likely causes:
   - DATABASE_URL incorrect
   - Missing migrations (add to Build Command: alembic upgrade head)
   - Missing dependencies (check requirements.txt)
3. Fix and redeploy from Render dashboard
```

### **Issue 2: Frontend shows "Cannot POST /api/..."**

**Solution:**
```bash
# Problem: API URL not set or wrong
1. Check FE .env file has VITE_API_URL set
2. Check vercel.json rewrites are correct
3. Rebuild on Vercel (Redeploy)
```

### **Issue 3: CORS error on API calls**

**Solution:**
```bash
# Add frontend URL to CORS_ORIGINS on Render:
CORS_ORIGINS=https://fitfuel-frontend.vercel.app,http://localhost:5173
```

### **Issue 4: Database migrations fail**

**Solution:**
```bash
# On Render, manually run migrations:
1. Render Dashboard → Services → fitfuel-api → Shell
2. Run: alembic upgrade head
3. Check migrations/versions/ folder exists
```

---

## 📞 FINAL URLS AFTER DEPLOYMENT

```
🌐 Frontend:  https://fitfuel-frontend.vercel.app
📡 Backend:   https://fitfuel-api.onrender.com
📚 API Docs:  https://fitfuel-api.onrender.com/docs (Swagger)
```

---

## 🔄 REDEPLOYMENT PROCESS (For Future Updates)

### **Backend:**
```bash
# Render auto-deploys on git push to main
# Or manually redeploy:
# Render Dashboard → Services → fitfuel-api → Deployments → Redeploy
```

### **Frontend:**
```bash
# Vercel auto-deploys on git push to main
# Or manually redeploy:
# Vercel Dashboard → Deployments → Redeploy
```

---

## 📊 DEPLOYMENT STATUS CHECKLIST

```
[ ] Phase 1: Backend (Render)
    [ ] Environment variables set
    [ ] Build command tested
    [ ] Health check passes
    [ ] Logs show no errors

[ ] Phase 2: Frontend (Vercel)
    [ ] Environment variables set
    [ ] Build command tested
    [ ] Routes load
    [ ] API calls work

[ ] Integration
    [ ] FE ↔ BE communication OK
    [ ] All delivery features working
    [ ] No console errors
    [ ] Ready for testing
```

---

**Estimated Total Time:** 15-20 minutes  
**Status:** Ready to deploy 🚀


## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Yoelaugustan/PixPlore-Mobile.git
cd PixPlore-Mobile
```

### 2. Frontend Setup (React Native)

#### Install Dependencies
```bash
npm install --legacy-peer-deps
# or
yarn install
```

### 3. Backend Setup (Flask)

#### Create Virtual Environment
```bash
# Navigate to the Flask backend directory
cd flask-ai-api

# Create virtual environment
python -m venv venv
```
#### # Activate virtual environment
```bash
# On Windows:
venv\Scripts\activate
```
```bash
# On macOS/Linux:
source venv/bin/activate
```

#### Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Variables Setup

#### Create .env file in your backend directory
```bash
# In your Flask backend directory
touch .env
```
or manually create .env file

#### Add your OpenAI API key to .env
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 5. Set Up ngrok

#### Install ngrok
1. Go to [ngrok.com](https://ngrok.com) and create an account
2. Download and install ngrok for your operating system
3. Get your auth token from the ngrok dashboard

#### Configure ngrok
```bash
ngrok authtoken YOUR_AUTH_TOKEN
```

### 6. Run the App


### 1. Start the Flask Backend

```bash
# Navigate to backend directory
cd flask-ai-api

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Run Flask server
python app.py
```


### 2. Start ngrok Tunnel

Open a new terminal and run:
```bash
ngrok http 5000
```

You'll see output like:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:5000
```

**Important**: Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`) and update it in your React Native app:

```typescript
// hooks/useAI.ts
const FLASK_API_URL = 'https://abc123.ngrok.io';  // Replace with your actual ngrok URL
```

### 3. Start the React Native App

Open a new terminal and navigate to your React Native project:
```bash
# Start the Expo development server
npx expo start
```

### 4. Run on Device/Emulator

Choose one of the following options:

- **Expo Go App**: Scan the QR code with Expo Go app on your phone
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal


## 📝 Notes

- The ngrok URL changes every time you restart ngrok (unless you have a paid plan)
- Remember to update the `FLASK_API_URL` in your React Native app whenever the ngrok URL changes
- The virtual environment needs to be activated every time you work on the backend

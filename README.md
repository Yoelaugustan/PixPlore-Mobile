## 1. Jagan Lupa npm install pas pindah branch, karena tiap branch dependenciesnya bisa beda beda
   ```bash
   npm install 
   ```

## 2. Kalo Pake Component yg udah jadi punya dari internet, tambahin "--legacy-peer-deps", karena sebagian dependencies di react native kita ada beda version
contohnya: 
   ```bash
   npm install react-native-svg --legacy-peer-deps
   ```

## 3. Start the app

   ```bash
   npx expo start
   ```

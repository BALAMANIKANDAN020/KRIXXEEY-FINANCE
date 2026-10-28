# krixxeey FINANCE — Mobile Application
**MCA Semester III — Core Elective-II: Mobile App Development using React Native**  
*Major Project Assessment (October 2026)*

---

## 🦚 Project Overview
**krixxeey FINANCE** is a complete, production-grade personal & business finance tracker built using **React Native**, **Expo (SDK 58)**, **JavaScript**, and **React Navigation v7**. The application allows users to record income and expenses, organize transactions by category, filter records month-by-month, view real-time financial analytics, generate daily/weekly/monthly statements, and manage profiles with personalized alerts.

The app features the divine **Radhey Krishna "BJ" emblem logo** and supports **two user roles**:
1. **Admin (`Krixxeey`)** — `krixxeey@gmail.com` (Password: `password`)
2. **Customer (`Bala BJ`)** — `balabj@gmail.com` (Password: `password`)

---

## 🚀 How to Run the Application

### 1. Clear Cache & Start Expo
In your terminal, navigate to the project directory and run:
```bash
npx expo start -c
```
or
```bash
npm start
```

### 2. Open on Android Device or Emulator
- **Physical Android Phone**: Install the **Expo Go** app from Google Play Store. Scan the QR code displayed in the terminal.
- **Android Virtual Device (Emulator)**: Press `a` in the terminal to launch on the running Android emulator:
  ```bash
  npm run android
  ```

---

## 🔑 Demo Accounts for Evaluation

The application includes pre-configured demo accounts and quick 1-tap evaluation buttons on the **Home** and **Sign In** screens:

| Role | Name | Email | Password | Purpose |
|---|---|---|---|---|
| **Customer** | **Bala BJ** | `balabj@gmail.com` | `password` | Personal budget dashboard, bottom tabs, category details, month-wise ledger |
| **Admin** | **Krixxeey** | `krixxeey@gmail.com` | `password` | System audit console, customer accounts overview, aggregated reports |

> **Examiner Tip**: On the **Home screen**, tap **"Bala BJ (Customer)"** or **"Krixxeey (Admin)"** under **DEMO ACCESS** to log in instantly without typing!

---

## 🧭 Complete Navigation Architecture (All 3 Navigators for Both Users)

The application fulfills all criteria for **Stack**, **Bottom Tabs**, and **Drawer** navigation across both user roles:

### Customer Flow (`Bala BJ`):
- **Stack Navigation**: `CustomerStackNavigator` (`CategoryDetails`, `EditProfile`, `Reports`)
- **Bottom Tabs Navigation**: `CustomerTabNavigator` (`Home`, `Analysis`, `Ledger`, `Categories`, `Profile`)
- **Drawer Navigation**: `CustomerDrawerNavigator` (`DashboardTabs`, `Analysis`, `Transactions`, `Categories`, `Reports`, `Profile`, `Sign Out`)

### Admin Flow (`Krixxeey`):
- **Stack Navigation**: `AdminStackNavigator` (`AdminDrawerRoot`, `Reports`, `Analysis`, `Transactions`)
- **Bottom Tabs Navigation**: `AdminTabNavigator` (`Overview`, `Analysis`, `Transactions`, `Reports`)
- **Drawer Navigation**: `AdminDrawerNavigator` (`AdminTabs`, `System Analytics`, `All Transactions`, `Financial Reports`, `Sign Out`)

---

## ✨ Key Features & Rubric Highlights (75 Marks)

1. **Authentication & Roles**:
   - Secure local demo authentication with role switching.
   - Form validation with real-time feedback for Email, Password, Name, and Role.
2. **Dashboard & Summary Cards**:
   - Dynamic Net Balance, Total Income, Total Expenses, and Savings Rate.
   - Personalized greeting and quick metric breakdown.
3. **Transaction Management**:
   - Add new Income / Expense records with category and description.
   - Personalized alerts upon adding or deleting transactions ("Hi Bala BJ, your transaction has been added successfully.").
   - Month-wise transaction filtering and search.
4. **Category Breakdown**:
   - Color-coded categories with total spent, percentage allocation, and progress bars.
   - Deep-dive category detail screen listing historical transactions for each category.
5. **Periodic Financial Reports**:
   - Real-time generation of **Daily**, **Weekly**, and **Monthly** reports.
   - Net balance, savings percentage, highest expense category, and transaction counters.
6. **Divine Krishna-Radha Theme**:
   - Krishna Royal Peacock Blue (`#0B4F6C`), Radha Pitambari Radiant Gold (`#D97706`), Peacock Feather Emerald (`#059669`), and Sacred Lotus Rose (`#E11D48`).
   - Custom SVG-style Krishna-Radhey "BJ" Monogram emblem with peacock feather and golden flute.

---

## 📦 Tech Stack
- **Framework**: React Native 0.88 with Expo SDK 58
- **Navigation**: React Navigation v7 (Native Stack, Bottom Tabs, Drawer)
- **State & Storage**: React Context API with `@react-native-async-storage/async-storage`
- **Gestures & Animations**: `react-native-gesture-handler` & `react-native-reanimated`
- **Icons**: `@expo/vector-icons` (Ionicons & MaterialCommunityIcons)

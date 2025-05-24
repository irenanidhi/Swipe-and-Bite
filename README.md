# 🍽️ Swipe N' Bite — Discover Food Like Never Before

**Swipe N' Bite** is a modern web application designed to revolutionize how users discover restaurants and dishes based on their location and preferences. Inspired by the swipe mechanism of dating apps, it turns food discovery into an engaging, social, and personalized experience.

## Project Overview

Swipe N' Bite allows users to:
- Discover new dishes and restaurants with a swipe.
- Save their favorite items to a personalized "Eat-list."
- Interact with the food community via comments and likes in the Tweet section.
- Get matched with fellow foodies through the innovative Food Cupid feature.
- Receive intelligent food recommendations based on their preferences and saved items.

Built with a robust modern tech stack on both frontend and backend, the application is highly interactive, scalable, and ready for real-world deployment.

---

## 🌟 Features

### 🔥 Swipe-Based Food Discovery

- Users can **swipe right** to save a dish to their **Eat-list** or **swipe left** to skip.
- Each card displays:
  - Image of the dish
  - Name of the food item
  - Restaurant details (name, address, timing)
  - Google Maps & Zomato integration

### 📂 Eat-list

- A dedicated section that stores all food items liked (swiped right).
- Users can revisit this list anytime and access full details of saved dishes.
- Eat-list data is stored persistently for each user.

### 💬 Tweet Section

- A comment thread below each dish where users can:
  - Leave short reviews or "foodie tweets"
  - Like and reply to others' comments
  - Discover trending opinions and crowd-favorite items

> Highly liked comments and dishes influence food visibility and future recommendations.

### ❤️ Food Cupid (Social Discovery)

- If **two users swipe right** on the same dish **within a 5–10 minute window**, they get a **match notification**.
- Upon mutual acceptance, users can chat directly within the app.
- A fun, optional social feature to connect over shared taste — perfect for making foodie friends or more!

> The Cupid tab allows users to accept/reject matches and manage chats.

### 🔄 Personalized Food Recommendations

- The system analyzes:
  - User's Eat-list items
  - Liked Tweet interactions
  - Dish categories and cuisine types
- It then generates **smart suggestions** tailored to individual tastes.
- Continuously improves using user feedback and interaction patterns.

### 📍 Location-Based Discovery

- Upon login, users select their city/location.
- Discovery feed and recommendations are tailored to local options.
- Seamless integration with Google Maps for real-time directions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Tailwind Merge, Animate
- **Routing**: React Router DOM
- **Form Handling & Validation**: React Hook Form + Zod
- **Data Handling**: React Query
- **Components**: Lucide React, Embla Carousel, Recharts
- **Notifications**: Sonner
- **Date Utils**: date-fns

### Backend 
- **Database**: MongoDB
- **API Architecture**: RESTful APIs
- **User Data**: Profiles, preferences, saved items, chat history
- **Matching Logic**: Time-window based match engine (Food Cupid)
- **Recommendation Engine**: Collaborative filtering or tag-based suggestions

---

# 🧾 Billing System

A full-stack billing system built using Ruby on Rails and React. This application allows you to manage products, generate bills dynamically with tax and denomination breakdowns, and send invoices to customers via email.

---

## 🛠 Tech Stack

### Backend:
- **Ruby on Rails 8**
- **SQLite** (development)
- **ActiveMailer** for email
- **Delayed Job** for background processing

### Frontend:
- **React (Functional Components & Hooks)** via Webpacker
- **Bootstrap** or minimal custom CSS

### Others:
- **Foreman** for running Rails and Webpack together in development
- **Webpacker** for React integration


Demo Video: 

---

## 🚀 Steps to Run the Application

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sanjaydotrb/billing_system.git
cd billing_system
gem install bundler
bundle install
yarn install
rails db:create
rails db:migrate
rails db:seed
foreman start -f Procfile.dev

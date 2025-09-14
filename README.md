🏥 Smart Hospital Bed Management System (SHBMS)

A comprehensive AI-powered hospital bed management platform that automates patient admission, bed allocation, and hospital resource optimization. The system integrates real-time monitoring, AI predictions, optimization algorithms, and forecasting to provide a smarter, more efficient healthcare infrastructure.

🚀 Features
👨‍⚕️ Patient Admission & Bed Allocation

Automatic admission number generation

Department-wise bed allocation based on availability

Live tracking of occupied vs. available beds

Conflict-free room assignment

🤖 AI-Powered Predictions

Patient Priority Prediction (XGBoost Classifier) – identifies high-priority cases

Length of Stay Prediction (XGBoost Regressor) – estimates discharge timelines

Bed Forecasting (Prophet) – predicts future bed availability

Bed Allocation Optimization (Google OR-Tools) – ensures optimal utilization of resources

💉 Blood Bank Module

Add and manage blood units in real time

Track available blood types and quantities

Auto-update on new donations and usage

📊 Interactive Bed Dashboard

Real-time visualization of bed occupancy

Department-wise bed distribution

Color-coded patient allocation status (Available, Occupied, Critical)

Responsive UI for doctors, nurses, and administrators

🔐 Security & Logging

Role-based access (Admin, Doctor, Nurse, Staff)

Secure patient data storage (MongoDB)

Activity logging for admission, discharge, and updates

🛠️ Installation & Setup
Prerequisites

Node.js (v16+)

MongoDB (local or Atlas)

VS Code (recommended)

Docker (optional for deployment)

Quick Start
# Clone the repository
git clone https://github.com/your-username/shbms.git

# Navigate to project folder
cd shbms

# Install dependencies
npm install

# Start backend server
npm run dev

# Start frontend (React)
npm run dev


Access at: http://localhost:8080

## 📂 Project Structure  

```text
shbms/
│
├── backend/
│   ├── models/            # Mongoose models (Patient, Bed, BloodBank, etc.)
│   ├── routes/            # Express routes
│   ├── controllers/       # Business logic
│   ├── utils/             # Bed allocation, ML integration
│   └── server.js          # Backend entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React UI components
│   │   ├── pages/         # Dashboard, Admission, Blood Bank
│   │   └── App.js
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── package.json
```

🎮 Usage
Starting the System

Log in as Admin to manage hospital resources

Admit a new patient → system generates admission number & assigns bed

View bed occupancy in the dashboard

Check blood bank status in Blood Bank Module

Testing AI Features

Admit patients with priority conditions → observe priority scoring

Track predicted Length of Stay

Use forecast dashboard for future bed availability trends

Keyboard Shortcuts (Frontend UI)

Ctrl + N → Admit new patient

Ctrl + B → Open Blood Bank

Ctrl + D → Discharge patient

🔧 Customization
Bed Allocation Rules

Modify in backend/utils/bedAllocator.js:

if (bed.department === patient.department && bed.isAvailable) {
    // Assign bed logic
}

AI Model Thresholds

Adjust in backend/utils/predictions.js:

if (priorityScore > 0.8) {
    patient.priority = "Critical";
}

UI Styling

Customize colors in frontend/src/styles/global.css:

:root {
  --primary-color: #1976d2;
  --warning-color: #ffa726;
  --critical-color: #e53935;
}

📱 Responsive Design

The dashboard is fully responsive and works on:

🖥️ Desktop | 💻 Laptop | 📱 Tablet | 📱 Mobile

🌐 Deployment Options
Local Development

Run frontend and backend with npm run dev

Web Hosting

Deploy backend on Render / Heroku / AWS

Deploy frontend on Netlify / Vercel

Docker
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "run", "server"]

🔍 Technical Details

Frontend: React.js, TailwindCSS, Chart.js

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

AI Models: XGBoost, Prophet, Google OR-Tools

Architecture: REST API + Modular Components

Data Format (JSON):

{
  "patientId": "P12345",
  "name": "John Doe",
  "department": "ICU",
  "bedId": "B21",
  "admissionDate": "2025-09-14",
  "priority": "Critical",
  "predictedStay": 5
}

🤝 Contributing

Fork the repository

Create a feature branch

Commit changes

Push to your branch

Submit a Pull Request

📝 License

This project is open source under the MIT License.

📞 Support

Open a GitHub Issue

Contact project maintainer

Check logs with npm run logs

🎯 Future Enhancements

✅ Real IoT integration (smart hospital devices)

✅ Mobile app companion (Flutter/React Native)

✅ Multi-tenant support for hospital chains

✅ Advanced ML models (TensorFlow.js integration)

✅ Blockchain-secured patient record logging

Built with ❤️ to revolutionize Healthcare 4.0

# Disease Management System - Python Backend

A modern, fast API backend for the Disease Management System built with FastAPI, SQLAlchemy, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- pip

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL database:**
   ```sql
   CREATE DATABASE disease_management;
   CREATE USER postgres WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE disease_management TO postgres;
   ```

5. **Update database configuration in `config.py`:**
   ```python
   database_url: str = "postgresql://postgres:password@localhost:5432/disease_management"
   ```

6. **Run the application:**
   ```bash
   python run.py
   ```

7. **Access the API:**
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## 📊 Data Migration

To migrate your existing Java system data:

```bash
python migrate_data.py
```

This will:
- Create database tables
- Import states and hospitals from `hospital.txt`
- Import patients and contacts from `input.txt`
- Conduct tests and update patient statuses
- Assign infected patients to hospitals

## 🔧 API Endpoints

### Countries
- `GET /countries` - List all countries
- `POST /countries` - Create new country

### States
- `GET /states` - List all states
- `POST /states` - Create new state
- `GET /states/{id}/hospitals` - Get hospitals in state

### Hospitals
- `GET /hospitals` - List all hospitals
- `POST /hospitals` - Create new hospital
- `GET /hospitals/{id}` - Get hospital details
- `GET /hospitals/{id}/patients` - Get hospital patients

### Patients
- `GET /patients` - List all patients
- `POST /patients` - Create new patient
- `GET /patients/{id}` - Get patient details
- `PUT /patients/{id}` - Update patient

### Statistics
- `GET /statistics/overview` - Get system overview statistics

## 🏗️ Project Structure

```
backend/
├── main.py              # FastAPI application
├── models.py            # SQLAlchemy models
├── schemas.py           # Pydantic schemas
├── database.py          # Database configuration
├── config.py            # Application settings
├── migrate_data.py      # Data migration script
├── run.py              # Startup script
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## 🔒 Security Features

- CORS enabled for frontend integration
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy
- Environment-based configuration

## 📈 Performance Features

- Async/await support
- Database connection pooling
- Automatic API documentation
- Type hints throughout

## 🧪 Testing

```bash
# Run tests (when implemented)
pytest
```

## 🚀 Production Deployment

1. Set `DEBUG=False` in config
2. Use a production database
3. Set up proper environment variables
4. Use a production ASGI server like Gunicorn

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 📝 API Documentation

The API automatically generates interactive documentation at `/docs` when running. This includes:
- All available endpoints
- Request/response schemas
- Try-it-out functionality
- Authentication details

## 🔄 Next Steps

1. Set up the React frontend
2. Implement authentication
3. Add real-time updates with WebSockets
4. Add data export functionality
5. Implement advanced analytics

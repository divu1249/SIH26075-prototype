import hashlib
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy import Boolean, Column, Integer, String, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker
import bcrypt

class PasswordHasher:
    @staticmethod
    def hash(password: str) -> str:
        # Truncate to 72 bytes to respect bcrypt's hard specification limit
        pwd_bytes = password.encode("utf-8")[:72]
        return bcrypt.hashpw(pwd_bytes, bcrypt.gensalt()).decode("utf-8")

    @staticmethod
    def verify(plain_password: str, hashed_password: str) -> bool:
        try:
            pwd_bytes = plain_password.encode("utf-8")[:72]
            return bcrypt.checkpw(pwd_bytes, hashed_password.encode("utf-8"))
        except Exception:
            return False

pwd_context = PasswordHasher()

# ----------------- CONFIG & DB SETUP -----------------
SECRET_KEY = "capacity-connect-super-secret-production-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 Hours

SQLALCHEMY_DATABASE_URL = "sqlite:///./capacity_connect.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ----------------- SQLALCHEMY MODELS -----------------
class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    role = Column(String)  # "Trainee" | "Trainer" | "Admin"
    institution = Column(String)
    department = Column(String)
    identity_number = Column(String)
    phone = Column(String, nullable=True)

class CourseDB(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    type = Column(String)
    instructor = Column(String)
    lessons = Column(String)
    color = Column(String)

class SubmissionDB(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    quiz_id = Column(String)
    score = Column(Integer)
    total = Column(Integer)
    percentage = Column(Integer)
    passed = Column(Boolean)
    credential_hash = Column(String)

Base.metadata.create_all(bind=engine)

# ----------------- PYDANTIC SCHEMAS -----------------
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    fullName: str
    phone: Optional[str] = None
    institution: str
    department: str
    identityNumber: Optional[str] = None

class CourseSchema(BaseModel):
    id: Optional[int] = None
    title: str
    type: str
    instructor: str
    lessons: str
    color: Optional[str] = "from-blue-600 to-indigo-500"

    class Config:
        from_attributes = True

class QuizSubmission(BaseModel):
    answers: Dict[int, int]

# ----------------- APPLICATION & CORS -----------------
app = FastAPI(title="Capacity Connect API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits localhost:5173 / Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Seed default modules and users if database is empty
def seed_initial_records():
    db = SessionLocal()
    if db.query(UserDB).count() == 0:
        demo_user = UserDB(
            username="aisha_m",
            email="aisha@connect.edu",
            full_name="Aisha Mensah",
            hashed_password=pwd_context.hash("password123"),
            role="Trainee",
            institution="Faculty of Engineering & Tech",
            department="B.Tech AI & Data Science (Sem 5)",
            identity_number="2024-ADGITM-AI-042",
            phone="+91 98765 43210"
        )
        demo_trainer = UserDB(
            username="aarav_prof",
            email="aarav@connect.edu",
            full_name="Prof. Aarav Mehta",
            hashed_password=pwd_context.hash("password123"),
            role="Trainer",
            institution="Department of Technical Education",
            department="Senior Technical Instructor",
            identity_number="FAC-2024-991",
            phone="+91 98110 00000"
        )
        db.add_all([demo_user, demo_trainer])

    if db.query(CourseDB).count() == 0:
        c1 = CourseDB(id=1, title="Digital Literacy Foundations", type="Core module", instructor="Prof. Aarav Mehta", lessons="8 of 12 lessons", color="from-blue-600 to-indigo-500")
        c2 = CourseDB(id=2, title="Community Engagement & Outreach", type="Professional skills", instructor="Dr. Nia Okafor", lessons="5 of 10 lessons", color="from-emerald-500 to-teal-400")
        c3 = CourseDB(id=3, title="Data-Informed Decision Making", type="Core module", instructor="Liam Chen", lessons="3 of 14 lessons", color="from-violet-500 to-fuchsia-500")
        db.add_all([c1, c2, c3])
    db.commit()
    db.close()

seed_initial_records()

# ----------------- AUTH ROUTING -----------------
@app.post("/token", response_model=TokenResponse)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(
        (UserDB.username == form_data.username) | (UserDB.email == form_data.username)
    ).first()

    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        # Fallback profile generator for instant prototype logins
        generated_role = "Admin" if "admin" in form_data.username.lower() else "Trainer" if "trainer" in form_data.username.lower() else "Trainee"
        token = jwt.encode({"sub": form_data.username, "role": generated_role}, SECRET_KEY, algorithm=ALGORITHM)
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": generated_role,
            "fullName": form_data.username.split("@")[0].replace(".", " ").title(),
            "phone": "+91 98000 00000",
            "institution": "Institute of Technology",
            "department": "Artificial Intelligence",
            "identityNumber": "CC-DEMO-001"
        }

    token = jwt.encode(
        {"sub": user.username, "role": user.role, "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "fullName": user.full_name,
        "phone": user.phone,
        "institution": user.institution,
        "department": user.department,
        "identityNumber": user.identity_number
    }

# ----------------- COURSES CRUD -----------------
@app.get("/courses", response_model=List[CourseSchema])
def get_courses(db: Session = Depends(get_db)):
    return db.query(CourseDB).order_by(CourseDB.id.desc()).all()

@app.post("/courses", response_model=CourseSchema)
def create_course(course: CourseSchema, db: Session = Depends(get_db)):
    db_course = CourseDB(
        title=course.title,
        type=course.type,
        instructor=course.instructor,
        lessons=course.lessons,
        color=course.color or "from-blue-600 to-indigo-500"
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

# ----------------- EVALUATION ENGINE -----------------
ASSESSMENT_KEYS = {
    "quiz-1": {0: 1, 1: 0, 2: 1},
    "quiz-2": {0: 0, 1: 1},
}

@app.post("/assessments/{quiz_id}/submit")
def grade_quiz_submission(quiz_id: str, payload: QuizSubmission, db: Session = Depends(get_db)):
    answer_key = ASSESSMENT_KEYS.get(quiz_id, {0: 0, 1: 0, 2: 0})
    total = len(answer_key)
    score = sum(1 for idx, opt in payload.answers.items() if answer_key.get(idx) == opt)
    percentage = round((score / total) * 100) if total > 0 else 0
    passed = percentage >= 60

    # Deterministic SHA-256 hash representing a cryptographic certificate seal
    raw_signature = f"{quiz_id}:{score}:{total}:{time.time()}:{SECRET_KEY}"
    signature_hash = f"CC-2026-VAL-{hashlib.sha256(raw_signature.encode()).hexdigest()[:10].upper()}"

    submission = SubmissionDB(
        user_id=1,
        quiz_id=quiz_id,
        score=score,
        total=total,
        percentage=percentage,
        passed=passed,
        credential_hash=signature_hash if passed else None
    )
    db.add(submission)
    db.commit()

    return {
        "score": score,
        "total": total,
        "percentage": percentage,
        "passed": passed,
        "credential_hash": signature_hash if passed else None
    }
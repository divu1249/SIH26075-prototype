import hashlib
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import Base, UserDB, CourseDB, SubmissionDB, pwd_context, SQLALCHEMY_DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def reset_and_seed():
    db = SessionLocal()

    # Drop existing tables and recreate clean schema
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # 1. Seed Presentation Personas
    users = [
        UserDB(
            username="aisha_m",
            email="aisha@connect.edu",
            full_name="Aisha Mensah",
            hashed_password=pwd_context.hash("password123"),
            role="Trainee",
            institution="Faculty of Engineering & Tech",
            department="B.Tech AI & Data Science (Sem 5)",
            identity_number="2024-ADGITM-AI-042",
            phone="+91 98765 43210"
        ),
        UserDB(
            username="aarav_prof",
            email="aarav@connect.edu",
            full_name="Prof. Aarav Mehta",
            hashed_password=pwd_context.hash("password123"),
            role="Trainer",
            institution="Department of Technical Education",
            department="Senior Technical Instructor",
            identity_number="FAC-2024-991",
            phone="+91 98110 00000"
        ),
        UserDB(
            username="admin.root@capacityconnect.gov",
            email="admin.root@capacityconnect.gov",
            full_name="Central Governance Administrator",
            hashed_password=pwd_context.hash("adminsecret2026"),
            role="Admin",
            institution="Ministry of Skill Development & Entrepreneurship",
            department="Central Accreditation Authority",
            identity_number="ROOT-AUTH-0001",
            phone="+91 11 2345 6789"
        )
    ]
    db.add_all(users)

    # 2. Seed Standard Courses
    courses = [
        CourseDB(
            id=1,
            title="Digital Literacy Foundations",
            type="Core module",
            instructor="Prof. Aarav Mehta",
            lessons="8 of 12 lessons",
            color="from-blue-600 to-indigo-500"
        ),
        CourseDB(
            id=2,
            title="Community Engagement & Outreach",
            type="Professional skills",
            instructor="Dr. Nia Okafor",
            lessons="5 of 10 lessons",
            color="from-emerald-500 to-teal-400"
        ),
        CourseDB(
            id=3,
            title="Data-Informed Decision Making",
            type="Core module",
            instructor="Liam Chen",
            lessons="3 of 14 lessons",
            color="from-violet-500 to-fuchsia-500"
        ),
        CourseDB(
            id=4,
            title="Asynchronous API Microservices",
            type="Advanced Specialization",
            instructor="Prof. Aarav Mehta",
            lessons="4 of 6 lessons",
            color="from-amber-500 to-rose-500"
        )
    ]
    db.add_all(courses)

    # 3. Seed Verified Credentials
    sig1 = f"CC-2026-VAL-{hashlib.sha256(b'seed_sig_1').hexdigest()[:10].upper()}"
    sig2 = f"CC-2026-VAL-{hashlib.sha256(b'seed_sig_2').hexdigest()[:10].upper()}"

    submissions = [
        SubmissionDB(
            user_id=1,
            quiz_id="quiz-1",
            score=3,
            total=3,
            percentage=100,
            passed=True,
            credential_hash=sig1
        ),
        SubmissionDB(
            user_id=1,
            quiz_id="quiz-2",
            score=2,
            total=2,
            percentage=100,
            passed=True,
            credential_hash=sig2
        )
    ]
    db.add_all(submissions)

    db.commit()
    db.close()
    print("✓ Platform state reset: Clean test databases & personas seeded.")

if __name__ == "__main__":
    reset_and_seed()
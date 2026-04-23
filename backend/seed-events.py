"""Seed the database with sample orgs, users, and events."""
from app import create_app, db
from app.models import User, Organization, Event
from datetime import datetime, timedelta, timezone

app = create_app()

with app.app_context():
    db.create_all()

    # Users
    users = [
        User(email='sarah.chen@university.edu', first_name='Sarah', last_name='Chen', system_role='Admin'),
        User(email='james.wilson@university.edu', first_name='James', last_name='Wilson'),
        User(email='maria.garcia@university.edu', first_name='Maria', last_name='Garcia'),
        User(email='alex.kim@university.edu', first_name='Alex', last_name='Kim'),
        User(email='priya.patel@university.edu', first_name='Priya', last_name='Patel'),
    ]
    db.session.add_all(users)
    db.session.commit()

    # Organizations
    orgs = [
        Organization(name='Computer Science Club', acronym='CSC', description='For CS enthusiasts'),
        Organization(name='Robotics Society', acronym='RS', description='Building the future'),
        Organization(name='Data Science Association', acronym='DSA', description='Data-driven decisions'),
    ]
    db.session.add_all(orgs)
    db.session.commit()

    # Events — mix of Pending, Approved, and Rejected
    now = datetime.now(timezone.utc)
    events = [
        Event(
            org_id=orgs[0].id, title='Spring Tech Showcase 2025',
            description='Annual showcase where students present projects to industry sponsors.',
            start_time=now + timedelta(days=14), end_time=now + timedelta(days=14, hours=8),
            location='Engineering Building, Room 301', submitted_by_user_id=users[1].id,
        ),
        Event(
            org_id=orgs[0].id, title='Python Workshop Series',
            description='Four-week beginner-friendly Python workshop covering basics to web development.',
            start_time=now + timedelta(days=7), end_time=now + timedelta(days=7, hours=2),
            location='CS Lab 204', submitted_by_user_id=users[2].id,
        ),
        Event(
            org_id=orgs[1].id, title='Robot Battle Royale',
            description='Competitive robotics event where student-built robots face off in various challenges.',
            start_time=now + timedelta(days=21), end_time=now + timedelta(days=21, hours=5),
            location='Student Center Auditorium', submitted_by_user_id=users[3].id,
        ),
        Event(
            org_id=orgs[1].id, title='Intro to Arduino Night',
            description='Hands-on evening session for beginners to learn Arduino basics and build a simple project.',
            start_time=now + timedelta(days=10), end_time=now + timedelta(days=10, hours=3),
            location='Maker Space, Engineering 105', submitted_by_user_id=users[1].id,
        ),
        Event(
            org_id=orgs[2].id, title='Kaggle Competition Prep',
            description='Collaborative session to form teams and strategize for the upcoming Kaggle competition.',
            start_time=now + timedelta(days=5), end_time=now + timedelta(days=5, hours=2),
            location='Library Conference Room B', submitted_by_user_id=users[4].id,
        ),
        Event(
            org_id=orgs[2].id, title='Guest Lecture: ML in Healthcare',
            description='Dr. Rivera from City Hospital discusses real-world machine learning applications in healthcare.',
            start_time=now + timedelta(days=18), end_time=now + timedelta(days=18, hours=1, minutes=30),
            location='Lecture Hall 3', submitted_by_user_id=users[4].id,
        ),
        Event(
            org_id=orgs[0].id, title='Hackathon: Build for Good',
            description='24-hour hackathon focused on building tech solutions for local nonprofits.',
            start_time=now + timedelta(days=30), end_time=now + timedelta(days=31),
            location='Innovation Center', submitted_by_user_id=users[2].id,
        ),
    ]

    # Set a couple to non-Pending status for variety
    events[1].approval_status = 'Approved'
    events[5].approval_status = 'Rejected'
    events[5].rejection_reason = 'Venue not available on requested date — please reschedule.'

    db.session.add_all(events)
    db.session.commit()

    print(f"Seeded {len(users)} users, {len(orgs)} organizations, {len(events)} events.")

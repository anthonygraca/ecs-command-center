"""Seed the database with sample budget requests."""
from app import create_app, db
from app.models import User, Organization, BudgetRequest
from datetime import datetime, timedelta, timezone

app = create_app()

with app.app_context():
    db.create_all()

    # Clear existing budget requests
    BudgetRequest.query.delete()
    db.session.commit()

    # Reuse existing orgs and users; create minimal ones if none exist
    orgs = Organization.query.all()
    if not orgs:
        orgs = [
            Organization(name='Computer Science Club', acronym='CSC', description='For CS enthusiasts'),
            Organization(name='Robotics Society', acronym='RS', description='Building the future'),
            Organization(name='Data Science Association', acronym='DSA', description='Data-driven decisions'),
        ]
        db.session.add_all(orgs)
        db.session.commit()

    users = User.query.all()
    if not users:
        users = [
            User(email='sarah.chen@university.edu', first_name='Sarah', last_name='Chen', system_role='Admin'),
            User(email='james.wilson@university.edu', first_name='James', last_name='Wilson'),
            User(email='maria.garcia@university.edu', first_name='Maria', last_name='Garcia'),
            User(email='alex.kim@university.edu', first_name='Alex', last_name='Kim'),
            User(email='priya.patel@university.edu', first_name='Priya', last_name='Patel'),
        ]
        db.session.add_all(users)
        db.session.commit()

    now = datetime.now(timezone.utc)

    budgets = [
        BudgetRequest(
            org_id=orgs[0].id,
            submitted_by_user_id=users[1].id,
            amount=3500.00,
            purpose='Annual Hackathon Prize Pool',
            created_at=now - timedelta(days=3),
        ),
        BudgetRequest(
            org_id=orgs[0].id,
            submitted_by_user_id=users[2].id,
            amount=850.00,
            purpose='Guest Speaker Transportation and Lodging',
            created_at=now - timedelta(days=5),
        ),
        BudgetRequest(
            org_id=orgs[0].id,
            submitted_by_user_id=users[1].id,
            amount=200.00,
            purpose='Workshop Printed Materials and Supplies',
            created_at=now - timedelta(days=1),
        ),
        BudgetRequest(
            org_id=orgs[1].id,
            submitted_by_user_id=users[3].id,
            amount=5200.00,
            purpose='Regional Robotics Competition Entry and Travel',
            created_at=now - timedelta(days=7),
        ),
        BudgetRequest(
            org_id=orgs[1].id,
            submitted_by_user_id=users[3].id,
            amount=1100.00,
            purpose='Arduino Components and Microcontroller Kits',
            created_at=now - timedelta(days=2),
        ),
        BudgetRequest(
            org_id=orgs[1].id,
            submitted_by_user_id=users[2].id,
            amount=650.00,
            purpose='3D Printing Filament and Replacement Parts',
            created_at=now - timedelta(days=10),
        ),
        BudgetRequest(
            org_id=orgs[2].id,
            submitted_by_user_id=users[4].id,
            amount=400.00,
            purpose='Kaggle Competition Cloud Computing Credits',
            created_at=now - timedelta(days=4),
        ),
        BudgetRequest(
            org_id=orgs[2].id,
            submitted_by_user_id=users[4].id,
            amount=750.00,
            purpose='End-of-Year Data Science Symposium Catering',
            created_at=now - timedelta(days=6),
        ),
    ]

    # Add a couple of non-Pending requests for realism
    approved = BudgetRequest(
        org_id=orgs[0].id,
        submitted_by_user_id=users[1].id,
        amount=300.00,
        purpose='Spring Semester Welcome Pizza Night',
        status='Approved',
        created_at=now - timedelta(days=14),
    )
    denied = BudgetRequest(
        org_id=orgs[1].id,
        submitted_by_user_id=users[3].id,
        amount=9000.00,
        purpose='Full Lab Equipment Overhaul',
        status='Denied',
        created_at=now - timedelta(days=20),
    )

    db.session.add_all(budgets)
    db.session.add(approved)
    db.session.add(denied)
    db.session.commit()

    pending_count = len(budgets)
    print(f"Seeded {pending_count} pending, 1 approved, 1 denied budget requests ({pending_count + 2} total).")

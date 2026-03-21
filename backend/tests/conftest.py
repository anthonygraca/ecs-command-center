import pytest
from app import create_app, db
from app.models import User, Organization, Event


@pytest.fixture
def app():
    app = create_app()
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["TESTING"] = True

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def seed_org(app):
    with app.app_context():
        org = Organization(name="Computer Science Club", acronym="CSC", status="Active")
        db.session.add(org)
        db.session.commit()
        return org.id


@pytest.fixture
def seed_user(app):
    with app.app_context():
        user = User(email="sarah@example.com", first_name="Sarah", last_name="Chen", system_role="Student")
        db.session.add(user)
        db.session.commit()
        return user.id


@pytest.fixture
def seed_event(app, seed_org, seed_user):
    with app.app_context():
        event = Event(
            org_id=seed_org,
            title="Spring Tech Showcase",
            description="Annual showcase event",
            location="Engineering Building",
            submitted_by_user_id=seed_user,
        )
        db.session.add(event)
        db.session.commit()
        return event.id

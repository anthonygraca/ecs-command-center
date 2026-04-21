from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(64))
    last_name = db.Column(db.String(64))
    system_role = db.Column(db.String(20), default='Student')

    memberships = db.relationship('OrgMember', backref='user', lazy=True)
    rsvps = db.relationship('EventAttendee', backref='user', lazy=True)
    budget_submissions = db.relationship('BudgetRequest', backref='submitter', lazy=True)
    submitted_events = db.relationship('Event', backref='submitter_user', lazy=True)

class Organization(db.Model):
    __tablename__ = 'organizations'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    acronym = db.Column(db.String(16))
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='Active')

    members = db.relationship('OrgMember', backref='organization', lazy=True)
    events = db.relationship('Event', backref='organization', lazy=True)
    budgets = db.relationship('BudgetRequest', backref='organization', lazy=True)

class OrgMember(db.Model):
    __tablename__ = 'org_members'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    org_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    club_role = db.Column(db.String(64), default='Member')

class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    end_time = db.Column(db.DateTime)
    location = db.Column(db.String(256))
    approval_status = db.Column(db.String(20), default='Pending')
    submitted_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    rejection_reason = db.Column(db.Text)

class EventAttendee(db.Model):
    __tablename__ = 'event_attendees'
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rsvp_status = db.Column(db.String(20), default='Going')

class BudgetRequest(db.Model):
    __tablename__ = 'budget_requests'
    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    submitted_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    title = db.Column(db.String(128))
    category = db.Column(db.String(32))
    purpose = db.Column(db.String(256))
    status = db.Column(db.String(20), default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

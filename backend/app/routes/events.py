from flask import Blueprint, jsonify, request
from datetime import datetime
from app import db
from app.models import Event, Organization, User, EventAttendee

events_bp = Blueprint("events", __name__)


@events_bp.get("/api/events/")
def get_events():
    status = request.args.get("status")
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    query = Event.query
    if status:
        query = query.filter_by(approval_status=status)

    pagination = query.order_by(Event.id.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    events = []
    for e in pagination.items:
        org = db.session.get(Organization, e.org_id)
        submitter = db.session.get(User, e.submitted_by_user_id) if e.submitted_by_user_id else None
        events.append({
            "id": e.id,
            "org_id": e.org_id,
            "org_name": org.name if org else None,
            "submitted_by_user_id": e.submitted_by_user_id,
            "submitter_name": f"{submitter.first_name} {submitter.last_name}" if submitter else None,
            "title": e.title,
            "description": e.description,
            "start_time": e.start_time.isoformat() if e.start_time else None,
            "end_time": e.end_time.isoformat() if e.end_time else None,
            "location": e.location,
            "approval_status": e.approval_status,
            "rejection_reason": e.rejection_reason,
        })

    return jsonify({
        "events": events,
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "pages": pagination.pages,
    })


@events_bp.post("/api/events/")
def create_event():
    data = request.get_json(silent=True) or {}

    title = data.get("title", "").strip()
    start_time = data.get("start_time")
    end_time = data.get("end_time")
    location = data.get("location", "").strip()
    description = data.get("description", "").strip()

    # basic backend validation as a safety net
    if not title or len(title) < 5:
        return jsonify({"error": "Title must be at least 5 characters"}), 400
    if not start_time or not end_time:
        return jsonify({"error": "Start and end time are required"}), 400
    if not location:
        return jsonify({"error": "Location is required"}), 400

    try:
        start_dt = datetime.fromisoformat(start_time)
        end_dt = datetime.fromisoformat(end_time)
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    if end_dt <= start_dt:
        return jsonify({"error": "End time must be after start time"}), 400

    # temporary: hardcoded org_id and user until auth is built
    new_event = Event(
        title=title,
        start_time=start_dt,
        end_time=end_dt,
        location=location,
        description=description,
        org_id=1,
        submitted_by_user_id=2,
        approval_status="Pending",
    )

    db.session.add(new_event)
    db.session.commit()

    return jsonify({
        "id": new_event.id,
        "title": new_event.title,
        "approval_status": new_event.approval_status,
    }), 201


@events_bp.patch("/api/events/<int:event_id>/approve")
def approve_event(event_id):
    event = db.session.get(Event, event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    event.approval_status = "Approved"
    event.rejection_reason = None
    db.session.commit()

    return jsonify({"message": "Event approved", "id": event.id, "approval_status": event.approval_status})


@events_bp.patch("/api/events/<int:event_id>/reject")
def reject_event(event_id):
    event = db.session.get(Event, event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    data = request.get_json(silent=True) or {}
    event.approval_status = "Rejected"
    event.rejection_reason = data.get("rejection_reason", "")
    db.session.commit()

    return jsonify({"message": "Event rejected", "id": event.id, "approval_status": event.approval_status})


@events_bp.get("/api/events/upcoming")
def get_upcoming_events():
    # only return events that are approved and haven't started yet
    now = datetime.utcnow()
    upcoming = Event.query.filter(
        Event.approval_status == "Approved",
        Event.start_time > now
    ).order_by(Event.start_time.asc()).all()

    return jsonify([
        {
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "start_time": e.start_time.isoformat() if e.start_time else None,
            "location": e.location,
            "attendee_count": EventAttendee.query.filter_by(event_id=e.id).count(),
        }
        for e in upcoming
    ])


@events_bp.post("/api/events/<int:event_id>/rsvp")
def rsvp_to_event(event_id):
    # temporary: hardcoded to James Wilson until auth is built
    current_user_id = 2

    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    # check if this user already RSVPed to prevent RSVPing again
    existing = EventAttendee.query.filter_by(
        event_id=event_id,
        user_id=current_user_id
    ).first()

    if existing:
        return jsonify({"error": "Already RSVPed to this event"}), 409

    new_rsvp = EventAttendee(event_id=event_id, user_id=current_user_id)
    db.session.add(new_rsvp)
    db.session.commit()

    return jsonify({"message": "RSVP confirmed"}), 200


@events_bp.get("/api/events/<int:event_id>/rsvp/status")
def get_rsvp_status(event_id):
    # temporary: hardcoded to James Wilson until auth is built
    current_user_id = 2

    existing = EventAttendee.query.filter_by(
        event_id=event_id,
        user_id=current_user_id
    ).first()

    return jsonify({"attending": existing is not None})
from flask import Blueprint, jsonify, request
from app import db
from app.models import Event, Organization, User

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
        org = Organization.query.get(e.org_id)
        submitter = User.query.get(e.submitted_by_user_id) if e.submitted_by_user_id else None
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


@events_bp.patch("/api/events/<int:event_id>/approve")
def approve_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    event.approval_status = "Approved"
    event.rejection_reason = None
    db.session.commit()

    return jsonify({"message": "Event approved", "id": event.id, "approval_status": event.approval_status})


@events_bp.patch("/api/events/<int:event_id>/reject")
def reject_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    data = request.get_json(silent=True) or {}
    event.approval_status = "Rejected"
    event.rejection_reason = data.get("rejection_reason", "")
    db.session.commit()

    return jsonify({"message": "Event rejected", "id": event.id, "approval_status": event.approval_status})

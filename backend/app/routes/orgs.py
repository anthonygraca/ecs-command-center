from flask import Blueprint, jsonify
from app import db
from app.models import Organization, OrgMember

organizations = Blueprint("orgs", __name__)


@organizations.get("/api/orgs/")
def get_organizations():
    # returning all active orgs
    orgs = Organization.query.filter_by(status="Active").all()

    return jsonify([
        {
            "id": org.id,
            "name": org.name,
            "acronym": org.acronym,
            "description": org.description,
        }
        for org in orgs
    ])


@organizations.get("/api/orgs/<int:org_id>/join/status")
def get_join_status(org_id):
    # temporary: hardcoded to James Wilson until auth is built
    current_user_id = 2

    existing = OrgMember.query.filter_by(
        org_id=org_id,
        user_id=current_user_id
    ).first()

    return jsonify({"joined": existing is not None})


@organizations.post("/api/orgs/<int:org_id>/join")
def join_org(org_id):
    # temporary: hardcoded to James Wilson until auth is built
    current_user_id = 2

    org = Organization.query.get(org_id)
    if not org:
        return jsonify({"error": "Organization not found"}), 404

    # prevent duplicate memberships
    existing = OrgMember.query.filter_by(
        org_id=org_id,
        user_id=current_user_id
    ).first()

    if existing:
        return jsonify({"error": "Already a member"}), 409

    new_member = OrgMember(org_id=org_id, user_id=current_user_id)
    db.session.add(new_member)
    db.session.commit()

    return jsonify({"message": "Joined successfully"}), 200
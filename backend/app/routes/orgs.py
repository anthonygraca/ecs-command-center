from flask import Blueprint, jsonify
from app.models import Organization

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
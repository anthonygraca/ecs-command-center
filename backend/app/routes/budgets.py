from flask import Blueprint, jsonify, request
from app import db
from app.models import BudgetRequest, Organization, User

budgets_bp = Blueprint("budgets", __name__)


@budgets_bp.get("/api/budgets/")
def get_budgets():
    status = request.args.get("status")
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    search = request.args.get("search", "").strip()
    org_id = request.args.get("org_id", type=int)

    query = BudgetRequest.query
    if status:
        query = query.filter_by(status=status)
    if org_id:
        query = query.filter_by(org_id=org_id)
    if search:
        matching_org_ids = [
            o.id for o in Organization.query.filter(
                Organization.name.ilike(f"%{search}%")
            ).all()
        ]
        query = query.filter(
            db.or_(
                BudgetRequest.purpose.ilike(f"%{search}%"),
                BudgetRequest.org_id.in_(matching_org_ids),
            )
        )

    pagination = query.order_by(BudgetRequest.id.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    budgets = []
    for b in pagination.items:
        org = Organization.query.get(b.org_id)
        submitter = User.query.get(b.submitted_by_user_id)
        budgets.append({
            "id": b.id,
            "org_id": b.org_id,
            "org_name": org.name if org else None,
            "submitted_by_user_id": b.submitted_by_user_id,
            "submitter_name": (
                f"{submitter.first_name} {submitter.last_name}"
                if submitter else None
            ),
            "amount": b.amount,
            "purpose": b.purpose,
            "status": b.status,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        })

    return jsonify({
        "budgets": budgets,
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "pages": pagination.pages,
    })


@budgets_bp.get("/api/budgets/organizations")
def get_budget_organizations():
    org_ids = db.session.query(
        BudgetRequest.org_id
    ).distinct().all()
    org_ids = [row[0] for row in org_ids]
    orgs = Organization.query.filter(
        Organization.id.in_(org_ids)
    ).all()
    return jsonify([{"id": o.id, "name": o.name} for o in orgs])


@budgets_bp.patch("/api/budgets/<int:budget_id>/approve")
def approve_budget(budget_id):
    budget = BudgetRequest.query.get(budget_id)
    if not budget:
        return jsonify({"error": "Budget request not found"}), 404

    budget.status = "Approved"
    db.session.commit()

    return jsonify({
        "message": "Budget request approved",
        "id": budget.id,
        "status": budget.status,
    })


@budgets_bp.patch("/api/budgets/<int:budget_id>/deny")
def deny_budget(budget_id):
    budget = BudgetRequest.query.get(budget_id)
    if not budget:
        return jsonify({"error": "Budget request not found"}), 404

    budget.status = "Denied"
    db.session.commit()

    return jsonify({
        "message": "Budget request denied",
        "id": budget.id,
        "status": budget.status,
    })

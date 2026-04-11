from app import db
from app.models import BudgetRequest, Organization, User


def test_get_budgets_empty(client):
    resp = client.get("/api/budgets/")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["budgets"] == []
    assert data["total"] == 0


def test_get_budgets_with_data(client, seed_budget):
    resp = client.get("/api/budgets/")
    data = resp.get_json()
    assert len(data["budgets"]) == 1
    b = data["budgets"][0]
    assert b["amount"] == 3500.00
    assert b["purpose"] == "Annual Robotics Competition Entry Fees"
    assert b["status"] == "Pending"


def test_get_budgets_filter_pending(client, app, seed_org, seed_user):
    with app.app_context():
        db.session.add(BudgetRequest(
            org_id=seed_org, submitted_by_user_id=seed_user,
            amount=100, purpose="Pending item",
        ))
        db.session.add(BudgetRequest(
            org_id=seed_org, submitted_by_user_id=seed_user,
            amount=200, purpose="Approved item", status="Approved",
        ))
        db.session.commit()

    resp = client.get("/api/budgets/?status=Pending")
    data = resp.get_json()
    assert data["total"] == 1
    assert data["budgets"][0]["purpose"] == "Pending item"


def test_get_budgets_filter_approved(client, app, seed_org, seed_user):
    with app.app_context():
        db.session.add(BudgetRequest(
            org_id=seed_org, submitted_by_user_id=seed_user,
            amount=100, purpose="Pending item",
        ))
        db.session.add(BudgetRequest(
            org_id=seed_org, submitted_by_user_id=seed_user,
            amount=200, purpose="Approved item", status="Approved",
        ))
        db.session.commit()

    resp = client.get("/api/budgets/?status=Approved")
    data = resp.get_json()
    assert data["total"] == 1
    assert data["budgets"][0]["purpose"] == "Approved item"


def test_get_budgets_pagination(client, app, seed_org, seed_user):
    with app.app_context():
        for i in range(15):
            db.session.add(BudgetRequest(
                org_id=seed_org, submitted_by_user_id=seed_user,
                amount=100 + i, purpose=f"Item {i}",
            ))
        db.session.commit()

    resp1 = client.get("/api/budgets/?page=1&per_page=10")
    d1 = resp1.get_json()
    assert len(d1["budgets"]) == 10
    assert d1["total"] == 15
    assert d1["pages"] == 2

    resp2 = client.get("/api/budgets/?page=2&per_page=10")
    d2 = resp2.get_json()
    assert len(d2["budgets"]) == 5


def test_approve_budget(client, seed_budget):
    resp = client.patch(f"/api/budgets/{seed_budget}/approve")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["status"] == "Approved"


def test_approve_nonexistent(client):
    resp = client.patch("/api/budgets/9999/approve")
    assert resp.status_code == 404


def test_deny_budget(client, seed_budget):
    resp = client.patch(f"/api/budgets/{seed_budget}/deny")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["status"] == "Denied"


def test_deny_nonexistent(client):
    resp = client.patch("/api/budgets/9999/deny")
    assert resp.status_code == 404


def test_budget_includes_org_name(client, seed_budget):
    resp = client.get("/api/budgets/")
    b = resp.get_json()["budgets"][0]
    assert b["org_name"] == "Computer Science Club"


def test_budget_includes_submitter_name(client, seed_budget):
    resp = client.get("/api/budgets/")
    b = resp.get_json()["budgets"][0]
    assert b["submitter_name"] == "Sarah Chen"


def test_budget_includes_created_at(client, seed_budget):
    resp = client.get("/api/budgets/")
    b = resp.get_json()["budgets"][0]
    assert b["created_at"] is not None
    assert "T" in b["created_at"]  # ISO format


def test_get_budgets_search(client, app, seed_org, seed_user):
    with app.app_context():
        db.session.add(BudgetRequest(
            org_id=seed_org, submitted_by_user_id=seed_user,
            amount=500, purpose="Robotics parts",
        ))
        db.session.add(BudgetRequest(
            org_id=seed_org, submitted_by_user_id=seed_user,
            amount=200, purpose="Pizza for meeting",
        ))
        db.session.commit()

    resp = client.get("/api/budgets/?search=Robotics")
    assert resp.get_json()["total"] == 1

    resp2 = client.get("/api/budgets/?search=nonexistent")
    assert resp2.get_json()["total"] == 0


def test_get_budgets_filter_by_org(client, app, seed_org, seed_org_2, seed_user):
    with app.app_context():
        db.session.add(BudgetRequest(
            org_id=seed_org, submitted_by_user_id=seed_user,
            amount=100, purpose="CSC item",
        ))
        db.session.add(BudgetRequest(
            org_id=seed_org_2, submitted_by_user_id=seed_user,
            amount=200, purpose="ADS item",
        ))
        db.session.commit()

    resp = client.get(f"/api/budgets/?org_id={seed_org}")
    data = resp.get_json()
    assert data["total"] == 1
    assert data["budgets"][0]["purpose"] == "CSC item"


def test_get_budget_organizations(client, app, seed_org, seed_org_2, seed_user):
    with app.app_context():
        db.session.add(BudgetRequest(
            org_id=seed_org, submitted_by_user_id=seed_user,
            amount=100, purpose="Item 1",
        ))
        db.session.add(BudgetRequest(
            org_id=seed_org_2, submitted_by_user_id=seed_user,
            amount=200, purpose="Item 2",
        ))
        db.session.commit()

    resp = client.get("/api/budgets/organizations")
    assert resp.status_code == 200
    orgs = resp.get_json()
    assert len(orgs) == 2
    names = {o["name"] for o in orgs}
    assert "Computer Science Club" in names
    assert "Art & Design Society" in names

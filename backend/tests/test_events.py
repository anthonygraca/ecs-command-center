from app import db
from app.models import Event, Organization, User


def test_get_events_empty(client):
    resp = client.get("/api/events/")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["events"] == []
    assert data["total"] == 0


def test_get_events_with_data(client, seed_event):
    resp = client.get("/api/events/")
    data = resp.get_json()
    assert len(data["events"]) == 1
    evt = data["events"][0]
    assert evt["title"] == "Spring Tech Showcase"
    assert evt["approval_status"] == "Pending"


def test_get_events_filter_pending(client, app, seed_org):
    with app.app_context():
        db.session.add(Event(org_id=seed_org, title="Pending Event", approval_status="Pending"))
        db.session.add(Event(org_id=seed_org, title="Approved Event", approval_status="Approved"))
        db.session.commit()

    resp = client.get("/api/events/?status=Pending")
    data = resp.get_json()
    assert data["total"] == 1
    assert data["events"][0]["title"] == "Pending Event"


def test_get_events_pagination(client, app, seed_org):
    with app.app_context():
        for i in range(15):
            db.session.add(Event(org_id=seed_org, title=f"Event {i}"))
        db.session.commit()

    resp1 = client.get("/api/events/?page=1&per_page=10")
    data1 = resp1.get_json()
    assert len(data1["events"]) == 10
    assert data1["total"] == 15
    assert data1["pages"] == 2

    resp2 = client.get("/api/events/?page=2&per_page=10")
    data2 = resp2.get_json()
    assert len(data2["events"]) == 5


def test_approve_event(client, seed_event):
    resp = client.patch(f"/api/events/{seed_event}/approve")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["approval_status"] == "Approved"


def test_approve_nonexistent(client):
    resp = client.patch("/api/events/9999/approve")
    assert resp.status_code == 404


def test_reject_event_with_reason(client, seed_event):
    resp = client.patch(
        f"/api/events/{seed_event}/reject",
        json={"rejection_reason": "Venue conflict"},
    )
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["approval_status"] == "Rejected"

    # verify reason was stored
    get_resp = client.get("/api/events/")
    evt = get_resp.get_json()["events"][0]
    assert evt["rejection_reason"] == "Venue conflict"


def test_reject_event_without_reason(client, seed_event):
    resp = client.patch(f"/api/events/{seed_event}/reject")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["approval_status"] == "Rejected"


def test_reject_nonexistent(client):
    resp = client.patch("/api/events/9999/reject")
    assert resp.status_code == 404


def test_event_includes_org_name(client, seed_event):
    resp = client.get("/api/events/")
    evt = resp.get_json()["events"][0]
    assert evt["org_name"] == "Computer Science Club"


def test_event_includes_submitter_name(client, seed_event):
    resp = client.get("/api/events/")
    evt = resp.get_json()["events"][0]
    assert evt["submitter_name"] == "Sarah Chen"

from app import create_app, db
from app.models import Organization

app = create_app()

with app.app_context():
    Organization.query.delete()

    orgs = [
        Organization(
            name="American Institute for Aeronautics and Astronautics",
            acronym="AIAA",
            description="The American Institute for Aeronautics and Astronautics (AIAA) aims to inspire the passion for aerospace ingenuity through collaborative effort.",
            status="Active"
        ),
        Organization(
            name="Association for Computing Machinery",
            acronym="ACM",
            description="CSUF's chapter of the world's largest computing society. Focused on competitive programming and technical development.",
            status="Active"
        ),
        Organization(
            name="Society of Women Engineers",
            acronym="SWE",
            description="Supporting women and allies in engineering through mentorship, networking, and professional development events.",
            status="Active"
        ),
        Organization(
            name="National Society of Black Engineers",
            acronym="NSBE",
            description="Dedicated to increasing the number of culturally responsible Black engineers who excel academically and professionally.",
            status="Active"
        ),
        Organization(
            name="Cybersecurity Club",
            acronym="CyberSec",
            description="Hands-on learning in ethical hacking, CTF competitions, and cybersecurity fundamentals for all skill levels.",
            status="Active"
        ),
    ]

    db.session.add_all(orgs)
    db.session.commit()
    print("Database seeded with organizations.")
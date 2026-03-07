from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from app import db
from app.models import User

test_bp = Blueprint('test', __name__)

@test_bp.route('/')
def index():
    users = User.query.all()
    return render_template('index.html', users=users)

@test_bp.route('/test/add_user', methods=['POST'])
def add_user():
    data = request.get_json() if request.is_json else request.form
    
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    
    if email:
        new_user = User(email=email, first_name=first_name, last_name=last_name)
        db.session.add(new_user)
        db.session.commit()
    
    if request.is_json:
        return jsonify({"message": "User added successfully", "id": new_user.id}), 201
    
    return redirect(url_for('test.index'))

@test_bp.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "email": u.email,
        "first_name": u.first_name,
        "last_name": u.last_name,
        "system_role": u.system_role
    } for u in users])

@test_bp.route('/echo', methods=['GET', 'POST'])
def echo():
    if request.method == 'POST':
        user_input = request.form.get('user_input')
        return f"<h1>The backend received:</h1><p>{user_input}</p><br><a href='/echo'>Try again</a>"
    return render_template('echo.html')

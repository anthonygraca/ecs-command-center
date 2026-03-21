import React, { useState, useEffect } from "react";

interface User {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	system_role: string;
}

const UserTest: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [message, setMessage] = useState("");

	const fetchUsers = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/users");
			const data = await response.json();
			setUsers(data);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	useEffect(() => {
		fetchUsers(); // eslint-disable-line
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:5000/test/add_user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					first_name: firstName,
					last_name: lastName,
				}),
			});

			if (response.ok) {
				setMessage("User added successfully!");
				setEmail("");
				setFirstName("");
				setLastName("");
				fetchUsers();
			} else {
				setMessage("Failed to add user.");
			}
		} catch (error) {
			console.error("Error adding user:", error);
			setMessage("Error connecting to backend.");
		}
	};

	return (
		<div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
			<h2>User Management (React Frontend)</h2>
			<form
				onSubmit={handleSubmit}
				style={{ display: "flex", flexDirection: "column", gap: "10px" }}
			>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="text"
					placeholder="First Name"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Last Name"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
				/>
				<button
					type="submit"
					style={{
						padding: "10px",
						backgroundColor: "var(--color-primary)",
						color: "white",
						border: "none",
						borderRadius: "4px",
					}}
				>
					Add User
				</button>
			</form>
			{message && <p>{message}</p>}

			<h3>Existing Users</h3>
			<ul style={{ listStyle: "none", padding: 0 }}>
				{users.map((user) => (
					<li
						key={user.id}
						style={{
							backgroundColor: "var(--color-bg-surface)",
							margin: "5px 0",
							padding: "10px",
							borderRadius: "4px",
						}}
					>
						{user.email} - {user.first_name} {user.last_name} (
						{user.system_role})
					</li>
				))}
			</ul>
		</div>
	);
};

export default UserTest;

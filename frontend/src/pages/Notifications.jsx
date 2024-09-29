import React, { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../styles/notifications.css";
import "../styles/Home.css";

function Notifications() {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [refresh, setRefresh] = useState(false);
	const token = localStorage.getItem("access"); // Token for API calls

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await api.get("/api/notifications/", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setNotifications(response.data);
				console.log(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching notifications:", error);
				setError("Failed to fetch notifications");
				setLoading(false);
			}
		};
		fetchNotifications();
	}, [token, refresh]);



	const handleDecision = async (notification, decision) => {
		try {
			const formData = new FormData();
			formData.append("decision", decision);
			formData.append("type_id", notification.type_id);
			formData.append("notification_id", notification.id);
			console.log(decision);
			console.log(notification.type_id);
			console.log(formData);

			const response = await api.post("/api/notifications/", formData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log(response.data);
			setRefresh(!refresh);
		} catch (error) {
			console.error("Error processing notification:", error);
		}
	};

	const handleRemove = async (notification_id) => {
		try {
			const params = notification_id
				? { notification_id: notification_id }
				: {};
			const response = await api.delete("/api/notifications/", {
				headers: { Authorization: `Bearer ${token}` },
				params: { notification_id: params },
			});
			console.log(response.data);
			setRefresh(!refresh);
		} catch (error) {
			console.error("Error deleting notification:", error);
		}
	};
	if (loading) {
		return <div>Loading notifications...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

return (
    <div className="home">
        <div className="top-bar">
			<Link to="/home" className="top-bar-link">
				Home page
			</Link>
			<Link to="/jobs" className="top-bar-link">
				Jobs
			</Link>
			<Link to="/messages" className="top-bar-link">
				Messages
			</Link>
			<Link to="/mynetwork" className="top-bar-link">
				My Network
			</Link>
			<Link to="/notifications" className="top-bar-link">
				Notifications
			</Link>
			<Link to="/profile" className="top-bar-link">
				Profile
			</Link>
			<Link to="/settings" className="top-bar-link">
				Settings
			</Link>
        </div>
      	<div className="notifications-page">
			<h1>New Follow Requests</h1>
			<div className="connection-requests">
				{notifications.filter((notif) => notif.type === "follow_request").length > 0 ? (
					<ul>
						{notifications.filter((notif) => notif.type === "follow_request").map((notification) => (
							<li key={notification.id}>
								<p><Link to={`/otherprofile/${notification.type_id}`}>{notification.username}</Link> wants to follow you</p>
								<button
									onClick={() => handleDecision(notification, "accept")}
									>
									Accept
								</button>
								<button
									onClick={() => handleDecision(notification, "deny")}
									>
									Deny
								</button>
							</li>
						))}
					</ul>
				) : (
					<p>No connection requests</p>
				)}
        	</div>
			<h1>Notifications</h1>
			<div className="article-notifications">
				{notifications.filter((notif) => notif.type === "new_comment" || notif.type === "new_like").length > 0 ? (
					<ul>
						{notifications.filter((notif) => notif.type === "new_comment" || notif.type === "new_like")
						.map((notification) => (
							<li key={notification.id}>
								{(notification.type === "new_comment")?(
									<p >
										{notification.username} commented in your
										article.
									</p>
								):(
									<p >
										{notification.username} liked your
										article.
									</p>
								)}
									
								<button onClick={() => handleRemove(notification.id)}>
									Remove
								</button>
							</li>
						))}
					</ul>
				) : (
					<p>No article notifications</p>
				)}
			</div>
			{notifications.length > 0 ? (
				<button onClick={() => handleRemove(null)}>
					clear all notifications
				</button>
			) : null}
      	</div>
    </div>
);}

export default Notifications;

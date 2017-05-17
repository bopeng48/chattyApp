import React, {Component} from 'react';
export default function NavBar({ onlineUserCount }) {
  return (
    <div>
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
        <span>Online Users: {onlineUserCount}</span>
      </nav>
    </div>
  )
}

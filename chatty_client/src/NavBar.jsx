import React, {Component} from 'react';
export default function NavBar(props) {
  return (
    <div>
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
        <span>{props.info}</span>
      </nav>
    </div>
  )
}

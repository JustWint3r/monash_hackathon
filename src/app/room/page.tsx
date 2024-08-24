"use client";

import React, { useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { SideMenu } from '../SideMenu';
import './room.css';

interface Room {
  id: number;
  name: string;
  pax: number;
  paymentFrequency: string;
  paymentMethod: string;
  invitedWallets: string[];
}

const initialCurrentRooms: Room[] = [
  { id: 1, name: 'Maintenance Payment', pax: 3, paymentFrequency: 'Monthly', paymentMethod: 'Manual', invitedWallets: [] },
  { id: 2, name: 'AC Installation', pax: 2, paymentFrequency: 'Yearly', paymentMethod: 'Automation', invitedWallets: [] },
  { id: 3, name: 'Cleaning Service', pax: 4, paymentFrequency: 'Daily', paymentMethod: 'Manual', invitedWallets: [] },
];

const initialPastRooms: Room[] = [
  { id: 4, name: 'Security Service', pax: 3, paymentFrequency: 'Monthly', paymentMethod: 'Manual', invitedWallets: [] },
  { id: 5, name: 'Electrical Work', pax: 2, paymentFrequency: 'Yearly', paymentMethod: 'Automation', invitedWallets: [] },
  { id: 6, name: 'Pest Control', pax: 1, paymentFrequency: 'Monthly', paymentMethod: 'Manual', invitedWallets: [] },
];

const initialInvitations: Room[] = [
  { id: 7, name: 'Room 7', pax: 2, paymentFrequency: 'Monthly', paymentMethod: 'Automation', invitedWallets: [] },
  { id: 8, name: 'Room 8', pax: 3, paymentFrequency: 'Yearly', paymentMethod: 'Manual', invitedWallets: [] },
  { id: 9, name: 'Room 9', pax: 1, paymentFrequency: 'Daily', paymentMethod: 'Automation', invitedWallets: [] },
];

const RoomPage = () => {
  const [currentRooms, setCurrentRooms] = useState<Room[]>(initialCurrentRooms);
  const [pastRooms] = useState<Room[]>(initialPastRooms);
  const [invitations, setInvitations] = useState<Room[]>(initialInvitations);
  const [activeTab, setActiveTab] = useState<'current' | 'past' | 'invitations'>('current');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [numPax, setNumPax] = useState(1);
  const [paymentFrequency, setPaymentFrequency] = useState('Monthly');
  const [paymentMethod, setPaymentMethod] = useState('Manual');
  const [invitedWallets, setInvitedWallets] = useState<string[]>([]);
  const [showRoomDetails, setShowRoomDetails] = useState<number | null>(null);

  const handlePaxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setNumPax(value);
    setInvitedWallets(Array(value).fill(''));
  };

  const handleWalletAddressChange = (index: number, value: string) => {
    const updatedWallets = [...invitedWallets];
    updatedWallets[index] = value;
    setInvitedWallets(updatedWallets);
  };

  const handleAddRoom = () => {
    const newRoom: Room = {
      id: currentRooms.length + 1,
      name: newRoomName,
      pax: numPax,
      paymentFrequency,
      paymentMethod,
      invitedWallets,
    };
    setCurrentRooms([...currentRooms, newRoom]);
    setShowAddRoom(false);
  };

  const renderRooms = () => {
    const roomsToDisplay = activeTab === 'current' ? currentRooms : pastRooms;
    return (
      <div className="grid-container">
        {roomsToDisplay.map((room) => (
          <div
            key={room.id}
            className="room-card"
            onClick={() =>
              setShowRoomDetails(showRoomDetails === room.id ? null : room.id)
            }
          >
            <FaUsers size={30} className="room-icon" />
            <p>{room.name}</p>
            {showRoomDetails === room.id && (
              <div className="room-details">
                <p>Room ID: {room.id.toString().padStart(3, '0')}</p>
                <p>Payment Frequency: {room.paymentFrequency}</p>
                <p>Payment Method: {room.paymentMethod}</p>
                <p>Pax: {room.pax}</p>
                <p>Invited Wallets: {room.invitedWallets.join(', ')}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderInvitations = () => (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Invitations</h2>
        <ul>
          {invitations.map((invitation) => (
            <li key={invitation.id} className="invitation-item">
              <span className="invitation-name">{invitation.name}</span>
              <div className="button-group">
                <button
                  className="accept-button"
                  onClick={() => {
                    setCurrentRooms((prevRooms) => [...prevRooms, invitation]);
                    setInvitations((prevInvitations) =>
                      prevInvitations.filter((inv) => inv.id !== invitation.id)
                    );
                  }}
                >
                  Accept
                </button>
                <button
                  className="decline-button"
                  onClick={() =>
                    setInvitations((prevInvitations) =>
                      prevInvitations.filter((inv) => inv.id !== invitation.id)
                    )
                  }
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          className="close-popup"
          onClick={() => setActiveTab('current')}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <SideMenu />
      <div className="content-container">
        <div className="button-group">
          <button
            className={`styled-button ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Current Rooms
          </button>
          <button
            className={`styled-button ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past Rooms
          </button>
          <button
            className={`styled-button ${activeTab === 'invitations' ? 'active' : ''}`}
            onClick={() => setActiveTab('invitations')}
          >
            Invitations
          </button>
          <button className="styled-button" onClick={() => setShowAddRoom(true)}>
            Add Room
          </button>
        </div>

        {activeTab === 'invitations' ? renderInvitations() : renderRooms()}

        {showAddRoom && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Add Room</h2>
              <form>
                <div className="form-group">
                  <label>Room Name</label>
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Number of Pax</label>
                  <select value={numPax} onChange={handlePaxChange}>
                    <option value="1">1 Pax</option>
                    <option value="2">2 Pax</option>
                    <option value="3">3 Pax</option>
                    <option value="4">4 Pax</option>
                    <option value="5">5 Pax</option>
                  </select>
                </div>
                {Array.from({ length: numPax }).map((_, index) => (
                  <div className="form-group" key={index}>
                    <label>Invited Wallet Address {index + 1}</label>
                    <input
                      type="text"
                      value={invitedWallets[index]}
                      onChange={(e) =>
                        handleWalletAddressChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
                <div className="form-group">
                  <label>Payment Frequency</label>
                  <select
                    value={paymentFrequency}
                    onChange={(e) => setPaymentFrequency(e.target.value)}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automation">Automation</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="done-button"
                  onClick={handleAddRoom}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="close-popup"
                  onClick={() => setShowAddRoom(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;

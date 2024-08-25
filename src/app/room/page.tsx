"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Ensure correct import for useRouter
import { SideMenu } from "../SideMenu";
import "./room.css";

interface Room {
  id: string;
  name: string;
  pax: number;
  invitedAddresses: string[];
  amount: number;
  paymentDate: string;
  deadlineDate: string;
  profilePictures: string[];
}

const placeholderImages = [
  "https://via.placeholder.com/50",
  "https://via.placeholder.com/50",
  "https://via.placeholder.com/50",
  "https://via.placeholder.com/50",
];

const initialCurrentRooms: Room[] = [
    {
      id: "RID001",
      name: "Room Maintenance",
      pax: 3,
      invitedAddresses: ["wallet1", "wallet2", "wallet3"],
      amount: 3,
      paymentDate: "2023-09-01",
      deadlineDate: "2023-09-15",
      profilePictures: placeholderImages.slice(0, 3),
    },
    {
      id: "RID002",
      name: "Web3 Project",
      pax: 4,
      invitedAddresses: ["wallet4", "wallet5", "wallet6", "wallet7"],
      amount: 5,
      paymentDate: "2023-09-10",
      deadlineDate: "2023-09-20",
      profilePictures: placeholderImages.slice(0, 4),
    },
  ];
  
  const initialPastRooms: Room[] = [
    {
      id: "RID003",
      name: "AC Installation",
      pax: 2,
      invitedAddresses: ["wallet1", "wallet2"],
      amount: 2,
      paymentDate: "2023-06-01",
      deadlineDate: "2023-06-15",
      profilePictures: placeholderImages.slice(0, 2),
    },
    {
      id: "RID004",
      name: "Cleaning Service",
      pax: 3,
      invitedAddresses: ["wallet3", "wallet4", "wallet5"],
      amount: 3,
      paymentDate: "2023-07-01",
      deadlineDate: "2023-07-15",
      profilePictures: placeholderImages.slice(0, 3),
    },
    {
      id: "RID005",
      name: "Security Upgrade",
      pax: 4,
      invitedAddresses: ["wallet6", "wallet7", "wallet8", "wallet9"],
      amount: 4,
      paymentDate: "2023-08-01",
      deadlineDate: "2023-08-15",
      profilePictures: placeholderImages.slice(0, 4),
    },
  ];
  
  const initialInvitations: Room[] = [
    {
      id: "RID006",
      name: "Web3 Meetup",
      pax: 2,
      invitedAddresses: ["wallet1", "wallet2"],
      amount: 2.0,
      paymentDate: "2023-09-01",
      deadlineDate: "2023-09-10",
      profilePictures: placeholderImages.slice(0, 2),
    },
    {
      id: "RID007",
      name: "Crypto Investment",
      pax: 3,
      invitedAddresses: ["wallet3", "wallet4", "wallet5"],
      amount: 1.5,
      paymentDate: "2023-08-15",
      deadlineDate: "2023-08-20",
      profilePictures: placeholderImages.slice(0, 3),
    },
  ];

const RoomPage = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [currentRooms, setCurrentRooms] = useState<Room[]>(initialCurrentRooms);
  const [pastRooms] = useState<Room[]>(initialPastRooms);
  const [invitations, setInvitations] = useState<Room[]>(initialInvitations);
  const [showInvitationsPopup, setShowInvitationsPopup] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Room | null>(
    null
  );
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomPax, setNewRoomPax] = useState(1);
  const [invitedAddresses, setInvitedAddresses] = useState<string[]>([""]);
  const [amount, setAmount] = useState(1);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const router = useRouter(); // Initialize useRouter

  const handlePaxChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const paxCount = parseInt(event.target.value);
    setNewRoomPax(paxCount);
    setInvitedAddresses(Array(paxCount).fill(""));
  };

  const handleAddressChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedAddresses = [...invitedAddresses];
    updatedAddresses[index] = event.target.value;
    setInvitedAddresses(updatedAddresses);
  };

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const { data } = await axios.get(
          "https://api.diadata.org/v1/assetQuotation/Solana/0x0000000000000000000000000000000000000000"
        );
        const usdRate = data.Price;
        const myrRate = usdRate * 4.5; // Approximate conversion rate from USD to MYR (adjust as needed)
        setConversionRate(myrRate);
      } catch (error) {
        console.error("Error fetching conversion rate:", error);
      }
    };

    fetchConversionRate();
  }, []);

  const handleAcceptInvitation = (room: Room) => {
    setCurrentRooms((prevRooms) => [...prevRooms, room]);
    setInvitations((prevInvitations) =>
      prevInvitations.filter((invitation) => invitation.id !== room.id)
    );
    setSelectedInvitation(null);
  };

  const handleDeclineInvitation = (room: Room) => {
    setInvitations((prevInvitations) =>
      prevInvitations.filter((invitation) => invitation.id !== room.id)
    );
    setSelectedInvitation(null);
  };

  const handleAddRoom = () => {
    const newRoomID = generateUniqueRoomId([...currentRooms, ...pastRooms, ...invitations]);
  
    const newRoom: Room = {
      id: newRoomID,
      name: newRoomName,
      pax: newRoomPax,
      invitedAddresses,
      amount,
      paymentDate: "2023-10-01",
      deadlineDate: "2023-10-10",
      profilePictures: placeholderImages.slice(0, newRoomPax),
    };
  
    setCurrentRooms([...currentRooms, newRoom]);
    setShowAddRoom(false);
  };

  // Function to handle room click and navigate to the chat room
  const handleRoomClick = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  const generateUniqueRoomId = (existingRooms: Room[]): string => {
    const existingIds = new Set(existingRooms.map(room => room.id));
    let newIdNumber = 1;
  
    while (existingIds.has(`RID${String(newIdNumber).padStart(3, '0')}`)) {
      newIdNumber++;
    }
  
    return `RID${String(newIdNumber).padStart(3, '0')}`;
  };
  
  const renderRooms = () => {
    const router = useRouter();
    const rooms = activeTab === "current" ? currentRooms : pastRooms;

    return (
    <div className="grid-container">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="room-card"
          onClick={() => router.push(`/room/${room.id}`)} // Navigate to the dynamic route
        >
          <div className="profile-picture-group">
            {room.profilePictures.map((picture, index) => (
              <img
                key={index}
                src={picture}
                alt="Profile"
                className="profile-picture"
              />
            ))}
          </div>
          <p>{room.name}</p>
          <p className="room-details">Room ID: {room.id}</p>
        </div>
      ))}
    </div>
  );
};

  return (
    <div className="page-container">
      <SideMenu />
      <div className="content-container">
        <div className="button-group">
          <button
            className={`styled-button ${
              activeTab === "current" ? "active" : ""
            }`}
            onClick={() => setActiveTab("current")}
          >
            Current Rooms
          </button>
          <button
            className={`styled-button ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past Rooms
          </button>
          <button
            className="styled-button"
            onClick={() => setShowInvitationsPopup(true)}
          >
            Invitations
          </button>
          <button className="styled-button" onClick={() => setShowAddRoom(true)}>
            Add Room
          </button>
        </div>

        {renderRooms()}

        {showInvitationsPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Invitations</h2>
              <ul>
                {invitations.map((invitation) => (
                  <li
                    key={invitation.id}
                    className="invitation-item"
                    onClick={() => setSelectedInvitation(invitation)}
                  >
                    <span>{invitation.name}</span>
                    <button
                      className="accept-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptInvitation(invitation);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="decline-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeclineInvitation(invitation);
                      }}
                    >
                      Decline
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="close-popup"
                onClick={() => setShowInvitationsPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {selectedInvitation && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Invitation Details</h2>
              <p><strong>Room Name:</strong> {selectedInvitation.name}</p>
              <p><strong>Number of Pax:</strong> {selectedInvitation.pax}</p>
              <p><strong>Invited Wallet Addresses:</strong></p>
              <ul>
                {selectedInvitation.invitedAddresses.map((address, index) => (
                  <li key={index}>{address}</li>
                ))}
              </ul>
              <p><strong>Amount:</strong> {selectedInvitation.amount} SOL</p>
              <p>
                <strong>Equivalent in MYR:</strong>{" "}
                {conversionRate
                  ? `RM ${(selectedInvitation.amount * conversionRate).toFixed(
                      2
                    )}`
                  : "Fetching rate..."}
              </p>
              <p><strong>Payment Date:</strong> {selectedInvitation.paymentDate}</p>
              <p><strong>Deadline Date:</strong> {selectedInvitation.deadlineDate}</p>
              <button
                className="close-popup"
                onClick={() => setSelectedInvitation(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

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
                  <select value={newRoomPax} onChange={handlePaxChange}>
                    {Array.from({ length: 10 }, (_, pax) => (
                      <option key={pax + 1} value={pax + 1}>
                        {pax + 1} Pax
                      </option>
                    ))}
                  </select>
                </div>
                {invitedAddresses.map((address, index) => (
                  <div key={index} className="form-group">
                    <label>Invited Wallet Address {index + 1}</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => handleAddressChange(index, e)}
                    />
                  </div>
                ))}
                <div className="form-group">
                  <label>Amount (SOL)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                  />
                  <small>
                    Equivalent in MYR:{" "}
                    {conversionRate
                      ? `RM ${(amount * conversionRate).toFixed(2)}`
                      : "Fetching rate..."}
                  </small>
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

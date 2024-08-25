"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Import useRouter for navigation
import { FaCog, FaArrowLeft } from "react-icons/fa"; // Import FaArrowLeft for the return icon
import "./roomDetails.css";

interface RoomDetails {
  id: string;
  name: string;
  pax: number;
  invitedAddresses: string[];
  amount: number;
  paymentDate: string;
  deadlineDate: string;
}

const initialRooms: RoomDetails[] = [
  {
    id: "RID001",
    name: "Room Maintenance",
    pax: 3,
    invitedAddresses: ["wallet1", "wallet2", "wallet3"],
    amount: 3,
    paymentDate: "2023-09-01",
    deadlineDate: "2023-09-15",
  },
  {
    id: "RID002",
    name: "Web3 Project",
    pax: 4,
    invitedAddresses: ["wallet4", "wallet5", "wallet6", "wallet7"],
    amount: 5,
    paymentDate: "2023-09-10",
    deadlineDate: "2023-09-20",
  },
  {
    id: "RID003",
    name: "AC Installation",
    pax: 2,
    invitedAddresses: ["wallet1", "wallet2"],
    amount: 2,
    paymentDate: "2023-06-01",
    deadlineDate: "2023-06-15",
  },
  {
    id: "RID004",
    name: "Cleaning Service",
    pax: 3,
    invitedAddresses: ["wallet3", "wallet4", "wallet5"],
    amount: 3,
    paymentDate: "2023-07-01",
    deadlineDate: "2023-07-15",
  },
  {
    id: "RID005",
    name: "Security Upgrade",
    pax: 4,
    invitedAddresses: ["wallet6", "wallet7", "wallet8", "wallet9"],
    amount: 4,
    paymentDate: "2023-08-01",
    deadlineDate: "2023-08-15",
  },
  {
    id: "RID006",
    name: "Web3 Meetup",
    pax: 2,
    invitedAddresses: ["wallet1", "wallet2"],
    amount: 2.0,
    paymentDate: "2023-09-01",
    deadlineDate: "2023-09-10",
  },
  {
    id: "RID007",
    name: "Crypto Investment",
    pax: 3,
    invitedAddresses: ["wallet3", "wallet4", "wallet5"],
    amount: 1.5,
    paymentDate: "2023-08-15",
    deadlineDate: "2023-08-20",
  },
];

const RoomDetailPage = () => {
  const { roomId } = useParams();
  const router = useRouter(); // useRouter for navigation
  const [roomData, setRoomData] = useState<RoomDetails | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([
    "Welcome to the room!",
    "Let’s discuss the payment details.",
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [individualPayments, setIndividualPayments] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (roomId) {
      const fetchedRoom = initialRooms.find((room) => room.id === roomId);
      if (fetchedRoom) {
        setRoomData(fetchedRoom);
        const initialPayments: Record<string, number> = {};
        fetchedRoom.invitedAddresses.forEach(
          (address) => (initialPayments[address] = fetchedRoom.amount / fetchedRoom.pax)
        );
        setIndividualPayments(initialPayments);
      }
    }
  }, [roomId]);

  if (!roomData) return <p>Loading room details...</p>;

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessage("");
    }
  };

  const handleSettingsSave = () => {
    const paymentUpdates = roomData?.invitedAddresses.map(
      (address) =>
        `${address} will now need to pay ${individualPayments[address].toFixed(2)} SOL`
    );
    setChatMessages((prevMessages) => [
      ...prevMessages,
      "Updated Payment Settings:",
      ...(paymentUpdates || []),
    ]);
    setShowSettings(false);
  };

  const handlePaymentChange = (address: string, value: number) => {
    setIndividualPayments((prevPayments) => ({
      ...prevPayments,
      [address]: value,
    }));
  };

  const handleBack = () => {
    router.push("/room"); // Navigate back to the room page
  };

  return (
    <div className="room-details-container">
      <div className="room-header">
        {/* Return icon */}
        <FaArrowLeft
          className="return-icon"
          onClick={handleBack}
          style={{ cursor: "pointer", marginRight: "15px" }}
        />
        <h1>{roomData.name}</h1>
        <FaCog
          className="settings-icon"
          onClick={() => setShowSettings(true)}
        />
      </div>

      <div className="room-info">
        <p>Number of Pax: {roomData.pax}</p>
        <p>Invited Wallet Addresses: {roomData.invitedAddresses.join(", ")}</p>
        <p>Amount: {roomData.amount} SOL</p>
        <p>Payment Date: {roomData.paymentDate}</p>
        <p>Deadline Date: {roomData.deadlineDate}</p>
      </div>

      <div className="chatroom-container">
        <div className="chat-messages">
          {chatMessages.map((message, index) => (
            <div key={index} className="chat-message">
              {message}
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
          />
          <button onClick={handleSendMessage} className="send-button roomButtons">
            Send
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <h3>Adjust Payment Settings</h3>
            {roomData.invitedAddresses.map((address) => (
              <div key={address} className="payment-input-group">
                <label>{address}</label>
                <input
                  type="number"
                  step="0.01"
                  value={individualPayments[address] || 0}
                  onChange={(e) =>
                    handlePaymentChange(address, parseFloat(e.target.value))
                  }
                  className="payment-input"
                />
                <span>SOL</span>
              </div>
            ))}
            <div className="settings-buttons">
              <button onClick={handleSettingsSave} className="roomButtons">
                Save
              </button>
              <button onClick={() => setShowSettings(false)} className="roomButtons">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailPage;

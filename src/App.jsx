import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleClick() {
    setShowAddFriend((show) => !show);
  }

  function addNewFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleBalanceUpdate() {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id ? selectedFriend : friend
      )
    );
    setSelectedFriend(null);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onHandleSubmit={addNewFriend} />}

        <Button onClick={handleClick}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend != null && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onUpdateBalnce={handleBalanceUpdate}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li>
      <img src={friend.image} alt="" />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function FormAddFriend({ onHandleSubmit }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const newFriend = {
      id: Date.now(),
      name,
      image: `${image}?=${Date.now()}`,
      balance: 0,
    };

    onHandleSubmit(newFriend);
  }
  return (
    <form onSubmit={handleSubmit} className="form-add-friend">
      <label htmlFor="">Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="">Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onUpdateBalnce }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const friendExpense = yourExpense ? bill - yourExpense : "";
  const [billPayer, setBillPayer] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    billPayer === "user"
      ? (selectedFriend.balance += friendExpense)
      : (selectedFriend.balance -= friendExpense);
    onUpdateBalnce(selectedFriend);
  }

  return (
    <form onSubmit={handleSubmit} className="form-split-bill">
      <h2>
        Split a bill with {selectedFriend != null ? selectedFriend.name : "X"}
      </h2>
      <label htmlFor="">Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />
      <label htmlFor="">Your Expense</label>
      <input
        type="text"
        value={yourExpense}
        onChange={(e) => {
          const exp = Number(e.target.value);
          exp <= bill && setYourExpense(exp);
        }}
      />
      <label htmlFor="">
        {selectedFriend != null ? selectedFriend.name : "X"}'s Expense
      </label>
      <input type="text" value={friendExpense} disabled />
      <label htmlFor="">Who is paying the bill?</label>
      <select value={billPayer} onChange={(e) => setBillPayer(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">
          {selectedFriend != null ? selectedFriend.name : "X"}
        </option>
      </select>
      <Button>Add</Button>
    </form>
  );
}

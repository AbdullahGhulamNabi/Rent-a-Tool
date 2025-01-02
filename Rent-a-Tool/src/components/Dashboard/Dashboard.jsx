// src/components/Dashboard.jsx
import React, { useState } from 'react';
import LoggedNavbar from './LoggedNavbar';
import Modal from './Modal';

const Dashboard = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div>
      <LoggedNavbar onImageClick={toggleModal} />
      {/* Other dashboard content */}
      {isModalVisible && (
        <Modal onClose={toggleModal}>
          {!selectedItem ? (
            <ul className="divide-y divide-gray-200">
              <li
                className="p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleItemClick('change-password')}
              >
                Change Password
              </li>

                
              <li
                className="p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleItemClick('account-setting')}
              >
                Account Settings
              </li>

              <li
                className="p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleItemClick('tutorial-and-help')}
              >
                Tutorial and Help
              </li>
              <li
                className="p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleItemClick('msg-and-notification')}
              >
                Message and Notification Setting
              </li>
              
            </ul>
          ) : (
            <div>
              {selectedItem === 'change-password' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Change Password</h2>
                  <p>Instructions for changing your password...</p>
                  {/* Include form or additional content here */}
                </div>
              )}
              {selectedItem === 'tutorial-and-help' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Tutorial and Help</h2>
                  <p>Instructions for changing your password...</p>
                  {/* Include form or additional content here */}
                </div>
              )}

              {selectedItem === 'account-setting' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Account Setting</h2>
                  <p>Instructions for changing your password...</p>
                  {/* Include form or additional content here */}
                </div>
              )}
              {selectedItem === 'msg-and-notification' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Messages and Notifications</h2>
                  <p>Instructions for changing your password...</p>
                  {/* Include form or additional content here */}
                </div>
              )}
              

              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setSelectedItem(null)}
              >
                Back to List
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WithdrawDates = ({counts, dates, committeeId, onClose, getPayments }) => {
  const [inputDates, setInputDates] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
  const token = localStorage.getItem('token');
// console.log(committeeId)
  
useEffect(() => {
  const initialDates = Array.from({ length: counts }, (_, i) => {
    return dates[i] ? new Date(dates[i]).toISOString().split('T')[0] : '';
  });
  setInputDates(initialDates);
}, [counts, dates]);

  const handleDateChange = (index, value) => {
    const newDates = [...inputDates];
    newDates[index] = value; // Store the date string in the array
    setInputDates(newDates);
  };
  const handleSave = async () => {
    try {
      // Convert date strings to timestamps before sending the API request
      const timestampDates = inputDates.map(date => new Date(date).getTime());

      const response = await axios.post(
        `${apiBaseUrl}committees/change-withdraw-date`,
        {
          id: committeeId,
          withdrawDates: timestampDates // Send timestamps in the API request
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).then((response) =>{
        console.log('Dates saved successfully:', response);
        getPayments();
        onClose();
      });
    } catch (error) {
      console.error('Error saving dates:', error);
    }
  };

  return (
 
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
          <h2 className="text-xl font-semibold mb-4">Select Dates</h2>
          {inputDates.map((date, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date {index + 1}:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(index, e.target.value)}
                className="border border-gray-300 rounded py-2 px-3 w-full"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-4 rounded mr-2 hover:bg-red-600 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
            >
              Save
            </button>
          </div>
        </div>
      </div>
   
  );
};

export default WithdrawDates;

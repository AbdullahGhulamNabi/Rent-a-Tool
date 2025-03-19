import React, { useState, useEffect } from 'react'
import cameraIcon from '../../assets/AddTool/camra.png'
import { toolService } from '../../services'
import { Api_Route } from '../../config';

const AddUpdate = ({ onClose, toolToEdit = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: null
  });
  const [isForRent, setIsForRent] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (toolToEdit) {
      setFormData({
        name: toolToEdit.name,
        description: toolToEdit.description,
        price: toolToEdit.price || 0,
        image: null
      });
      setIsForRent(toolToEdit.price > 0);
      // setPreviewImage(toolToEdit.image ? `http://localhost:3000/uploads/tools/${toolToEdit.image}` : null);
      setPreviewImage(toolToEdit.image ? `${Api_Route}/uploads/tools/${toolToEdit.image}` : null);
    }
  }, [toolToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        price: isForRent ? formData.price : 0
      };

      if (toolToEdit) {
        await toolService.updateTool(toolToEdit._id, submitData);
      } else {
        await toolService.createTool(submitData);
    window.location.reload();

      }

      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[380px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold w-[100%] text-center mb-4">
          {toolToEdit ? 'Update Tool' : 'Add Tool'}
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='w-full flex justify-center mb-2'>
            <label htmlFor="imageInput" className="cursor-pointer">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  className="h-32 w-32 object-cover rounded" 
                  alt="Tool Preview" 
                />
              ) : (
                <img src={cameraIcon} className="h-14 w-14" alt="Camera Icon" />
              )}
            </label>
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex justify-between mb-2">
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Tool Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                placeholder="Tool Name"
                required
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              cols="30"
              rows="3"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder='Add description of the tool'
              required
            ></textarea>

            <div className="w-[100%] flex flex-col justify-between mb-2">
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsForRent(false)}
                  className={`px-4 py-2 rounded-md w-[45%] ${!isForRent ? "bg-imageBG text-white" : "bg-gray-200 text-gray-800"}`}
                >
                  Free to borrow
                </button>

                <button
                  type="button"
                  onClick={() => setIsForRent(true)}
                  className={`px-4 py-2 rounded-md w-[45%] ${isForRent ? "bg-imageBG text-white" : "bg-gray-200 text-gray-800"}`}
                >
                  For rent
                </button>
              </div>

              {isForRent && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Rent Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter rent price in rupees"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                    required={isForRent}
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-HomeText text-white py-2 rounded mt-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : toolToEdit ? 'Update' : 'Add'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUpdate;

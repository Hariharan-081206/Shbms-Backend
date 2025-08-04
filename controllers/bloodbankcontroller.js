import BloodBank from '../models/bloodbank.js';

// Get all blood bank entries
export const getAllBloodUnits = async (req, res) => {
  try {
    const bloodUnits = await BloodBank.find().sort({ bloodGroup: 1 });
    res.status(200).json(bloodUnits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blood units', error });
  }
};

// Add new blood group units
export const addBloodUnit = async (req, res) => {
  try {
    const { bloodGroup, unitsAvailable, location } = req.body;

    const existing = await BloodBank.findOne({ bloodGroup });
    if (existing) {
      return res.status(400).json({ message: 'Blood group already exists. Use update instead.' });
    }

    const newUnit = new BloodBank({ bloodGroup, unitsAvailable, location });
    await newUnit.save();
    res.status(201).json(newUnit);
  } catch (error) {
    res.status(500).json({ message: 'Error adding blood unit', error });
  }
};
export const updateBloodUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { unitsAvailable, location } = req.body;

    const updatedUnit = await BloodBank.findByIdAndUpdate(
      id,
      {
        ...(unitsAvailable !== undefined && { unitsAvailable }),
        ...(location && { location }),
        lastUpdated: new Date(),
      },
      { new: true }
    );

    if (!updatedUnit) {
      return res.status(404).json({ message: 'Blood unit not found' });
    }

    res.status(200).json(updatedUnit);
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Error updating blood unit', error });
  }
};

// Delete a blood group
export const deleteBloodUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BloodBank.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Blood unit not found' });
    }

    res.status(200).json({ message: 'Blood unit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blood unit', error });
  }
};

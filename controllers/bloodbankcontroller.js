import BloodBank from '../models/bloodbank.js';

// Get all blood bank entries
export const getAllBloodUnits = async (req, res) => {
  try {
    const bloodType = await BloodBank.find().sort({ bloodType: 1 });
    res.status(200).json(bloodType);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blood units', error });
  }
};
export const addBloodUnit = async (req, res) => {
  try {
    const { bloodType, units, location } = req.body;

    const existing = await BloodBank.findOne({ bloodType });

    if (existing) {
      // Add units to existing blood group (no change to location)
      existing.units += units;
      existing.lastUpdated = new Date();
      await existing.save();
      return res.status(200).json({ message: "Units added to existing blood group", data: existing });
    }

    // If not existing, create a new entry (location required only for new ones)
    const newUnit = new BloodBank({ bloodType, units, location });
    await newUnit.save();
    res.status(201).json({ message: "New blood group added", data: newUnit });
  } catch (error) {
    res.status(500).json({ message: 'Error adding blood unit', error });
  }
};

export const updateBloodUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { units, location } = req.body;

    const updatedUnit = await BloodBank.findByIdAndUpdate(
      id,
      {
        ...(units !== undefined && { units }),
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

// Use blood units
export const useBloodUnit = async (req, res) => {
  try {
    const { bloodType, units } = req.body;

    if (!bloodType || units === undefined) {
      return res.status(400).json({ message: "Blood type and units are required" });
    }

    const blood = await BloodBank.findOne({ bloodType });

    if (!blood) {
      return res.status(404).json({ message: "Blood type not found" });
    }

    if (blood.units < units) {
      return res.status(400).json({ message: "Not enough units available" });
    }

    // Subtract units
    blood.units -= units;
    blood.lastUpdated = new Date();
    await blood.save();

    res.status(200).json({
      message: `${units} unit(s) used from ${bloodType}`,
      data: blood,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error using blood unit', error });
  }
};


const getStatus = (units) => {
  if (units <= 10) return { status: "Critical Low", color: "red" };
  if (units <= 20) return { status: "Low Stock", color: "yellow" };
  return { status: "Normal", color: "green" };
};

// ✅ Controller: Get Blood Bank Summary
export const getBloodBankSummary = async (req, res) => {
  try {
    const bloodUnits = await BloodBank.find().sort({ bloodType: 1 });

    const summary = bloodUnits.map(blood => {
      const { status, color } = getStatus(blood.units);

      return {
        bloodType: blood.bloodType,
        units: blood.units,
        lastUpdated: blood.lastUpdated,
        status,
        color
      };
    });

    // ✅ Add totals for dashboard
    const totalUnits = summary.reduce((sum, item) => sum + item.units, 0);
    const totalCritical = summary.filter(item => item.status === "Critical Low").length;
    const totalLowStock = summary.filter(item => item.status === "Low Stock").length;

    res.status(200).json({
      summary,
      totals: {
        totalUnits,
        totalCritical,
        totalLowStock
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blood bank summary", error });
  }
};

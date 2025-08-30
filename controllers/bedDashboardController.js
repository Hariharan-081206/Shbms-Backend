import Bed from '../models/bedmodel.js';

// ✅ Create new bed
export const createBed = async (req, res) => {
  try {
    const { ward, bedNumber, oxygenSupport = false, monitoringEquipment = false } = req.body;

    if (!ward || !bedNumber) {
      return res.status(400).json({ message: 'Ward and Bed Number are required' });
    }

    // Check for duplicate
    const existingBed = await Bed.findOne({ ward, bedNumber });
    if (existingBed) {
      return res.status(400).json({ message: 'Bed already exists in this ward' });
    }

    const newBed = new Bed({
      ward,
      bedNumber,
      oxygenSupport,
      monitoringEquipment,
      status: 'available',
      isOccupied: false
    });

    await newBed.save();

    res.status(201).json({
      message: 'Bed created successfully',
      bed: newBed
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Bed with this ward & number already exists' });
    }
    res.status(500).json({ message: 'Error creating bed', error });
  }
};

// ✅ Get all beds
export const getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find().populate('assignedTo', 'name age gender'); // optional populate
    res.json(beds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching beds', error });
  }
};

// ✅ Get bed summary


// ✅ Get Ward Summary (ES6 style)
export const getWardSummary = async (req, res) => {
  try {
    const beds = await Bed.find();

    const wardSummary = {};
    let totalAvailable = 0;
    let totalOccupied = 0;
    let totalCapacity = 0;

    beds.forEach(bed => {
      if (!wardSummary[bed.ward]) {
        wardSummary[bed.ward] = { availableBeds: 0, occupiedBeds: 0, totalCapacity: 0 };
      }

      wardSummary[bed.ward].totalCapacity += 1;
      totalCapacity += 1;

      if (bed.isOccupied) {
        wardSummary[bed.ward].occupiedBeds += 1;
        totalOccupied += 1;
      } else {
        wardSummary[bed.ward].availableBeds += 1;
        totalAvailable += 1;
      }
    });

    // Transform into array (easy for frontend to map)
    const wards = Object.entries(wardSummary).map(([ward, data]) => ({
      ward,
      availableBeds: data.availableBeds,
      occupiedBeds: data.occupiedBeds,
      totalCapacity: data.totalCapacity,
      occupancyRate: data.totalCapacity
        ? Math.round((data.occupiedBeds / data.totalCapacity) * 100)
        : 0
    }));

    // Overall totals
    const overall = {
      availableBeds: totalAvailable,
      occupiedBeds: totalOccupied,
      totalCapacity
    };

    res.json({ wards, overall });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBedByNumber = async (req, res) => {
  const { bedNumber } = req.params;

  try {
    // Find bed and populate assigned patient details
    const bed = await Bed.findOne({ bedNumber })
      .populate('assignedTo', 'name age gender admissionNumber');

    if (!bed) return res.status(404).json({ message: 'Bed not found' });

    return res.status(200).json(bed);
  } catch (error) {
    console.error('Error fetching bed details:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBedStatus = async (req, res) => {
  try {
    const { bedNumber } = req.params;
    const { status } = req.body; // e.g., 'available', 'occupied', 'maintenance'

    if (!status || !['available', 'occupied', 'maintenance'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update bed and adjust isOccupied accordingly
    const bed = await Bed.findOneAndUpdate(
      { bedNumber },
      { 
        status,
        isOccupied: status === 'occupied'
      },
      { new: true }
    );

    if (!bed) return res.status(404).json({ message: 'Bed not found' });

    return res.status(200).json({
      message: `Bed status updated to '${status}'`,
      bed
    });

  } catch (error) {
    console.error('Error updating bed status:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBedById = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id).populate("assignedTo");
    if (!bed) return res.status(404).json({ error: "Bed not found" });

    res.json(bed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



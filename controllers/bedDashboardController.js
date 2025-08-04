import Bed from '../models/bedmodel.js';


export const createBed = async (req, res) => {
  try {
    const {
      ward,
      bedNumber,
      oxygenSupport = false,
      monitoringEquipment = false,
      status = 'available'
    } = req.body;

    if (!ward || bedNumber === undefined) {
      return res.status(400).json({ error: 'ward and bedNumber are required' });
    }

    const existingBed = await Bed.findOne({ ward, bedNumber });
    if (existingBed) {
      return res.status(400).json({ error: 'Bed already exists in this ward' });
    }

    const newBed = new Bed({
      ward,
      bedNumber,
      oxygenSupport,
      monitoringEquipment,
      status
    });

    await newBed.save();

    return res.status(201).json({
      message: 'Bed created successfully',
      bed: newBed
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const getBedSummary = async (req, res) => {
  try {
    const summary = await Bed.aggregate([
      {
        $group: {
          _id: '$ward',
          totalBeds: { $sum: 1 },
          availableBeds: {
            $sum: {
              $cond: [{ $eq: ['$isOccupied', false] }, 1, 0]
            }
          },
          occupiedBeds: {
            $sum: {
              $cond: [{ $eq: ['$isOccupied', true] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          ward: '$_id',
          totalBeds: 1,
          availableBeds: 1,
          occupiedBeds: 1
        }
      },
      { $sort: { ward: 1 } }
    ]);

    return res.status(200).json(summary);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

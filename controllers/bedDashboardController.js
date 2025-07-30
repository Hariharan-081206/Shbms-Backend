import Bed from '../models/bedmodel.js'

export const createBed = async (req, res) => {
  try {
    const { ward, bedNumber } = req.body;

    if (!ward || !bedNumber) {
      return res.status(400).json({ error: 'ward and bedNumber are required' });
    }

    const existingBed = await Bed.findOne({ ward, bedNumber });
    if (existingBed) {
      return res.status(400).json({ error: 'Bed already exists in this ward' });
    }

    const newBed = new Bed({ ward, bedNumber });
    await newBed.save();

    res.status(201).json({ message: 'Bed created successfully', bed: newBed });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
          }
        }
      },
      {
        $project: {
          _id: 0,
          ward: '$_id',
          totalBeds: 1,
          availableBeds: 1
        }
      },
      {
        $sort: { ward: 1 }
      }
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

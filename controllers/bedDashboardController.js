import Bed from '../models/bed.model.js';

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

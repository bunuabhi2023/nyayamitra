const Case = require('../models/case');


const createCase = async (req, res) => {
      const { name } = req.body;
  
      const newCase = new Case({ name });
  
      try {
        const savedCase = await newCase.save();
        console.log(savedCase); // Add this line for debug logging
        res.json(savedCase);
      } catch (error) {
        console.error(error); // Add this line for debug logging
        return res.status(500).json({ error: 'Failed to create Case' });
      }
   
  };

  
// Function to update a Brand by ID
const updateCase = async (req, res) => {
  
      const { name } = req.body;
      const updatedBy = req.user.id;
  
  
      try {
        const updatedCase = await Case.findByIdAndUpdate(
          req.params.id,
          { name,  updatedAt: Date.now() },
          { new: true }
        );
  
        if (!updatedCase) {
          console.log(`Case with ID ${req.params.id} not found`);
          return res.status(404).json({ error: 'Case not found' });
        }
  
        console.log(updatedCase); // Add this line for debug logging
        res.json(updatedCase);
      } catch (error) {
        console.error(error); // Add this line for debug logging
        return res.status(500).json({ error: 'Failed to update Case' });
      }
};

// Function to get all Brands
const getAllCase = async (req, res)  => {
    try {
        const cases = await Case.find();
        res.json(cases);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch cases' });
    }
};
  
  // Function to get a Brand by ID
const getCaseById = async (req, res) => {
try {
    const cases = await Case.findById(req.params.id);
    if (!cases) {
    console.log(`Case with ID ${req.params.id} not found`);
    return res.status(404).json({ error: 'Case not found' });
    }


    res.json(cases);
} catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch case' });
}
};
  
  // Function to delete a brandWithUrl by ID
const deleteCase = async (req, res) => {
    try {
      const deletedCase = await Case.findByIdAndDelete(req.params.id);
      if (!deletedCase) {
        console.log(`Case with ID ${req.params.id} not found`);
        return res.status(404).json({ error: 'Case not found' });
      }
      res.json({ message: 'Case deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to delete Case' });
    }
};
  
  module.exports = {
    createCase,
    updateCase,
    getAllCase,
    getCaseById,
    deleteCase,
  };
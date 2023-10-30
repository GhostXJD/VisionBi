import goal from '../models/goal.model.js'

export const getGoals = async (req, res) => {
    try {
        const goals = await goal.find()
        res.json(goals)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createGoal = async (req, res) => {
    try {
        const { amount, category, startDate, endDate, company } = req.body

        const newGoal = new goal({
            amount,
            category,
            startDate,
            endDate,
            company
        })
        const savedGoal = await newGoal.save()
        res.json(savedGoal)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGoalByCompany = async (req, res) => {
    try {
        const { company } = req.params.id
        const goal = await goal.findOne({ company })
        if (!goal) return res.status(404).json({ message: 'Goal not found' })
        res.json(goal)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteGoal = async (req, res) => {
    try {
        const goal = await goal.findByIdAndDelete(req.params.id)
        if (!goal) return res.status(404).json({ message: 'Goal not found' })
        return res.sendStatus(204);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateGoal = async (req, res) => {
    try {
        const goal = await goal.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};
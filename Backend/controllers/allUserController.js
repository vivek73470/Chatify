const user = require('../services/authService')

const getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let condition = {}
        if (search) {
            condition.$or = [
                { name: { $regex: search, $options: 'i' } },
                { number: { $regex: search, $options: 'i' } },
            ]
        }
        const users = await user.findAll(condition)
        res.status(200).json({
            status: true,
            data: users,
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Failed to fetch users'
        })
    }
}

module.exports = {
    getAllUsers
}

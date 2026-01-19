const prisma = require('../prismaClient');

// @desc    Get all state explorers
// @route   GET /api/state-explorer
// @access  Public
const getStateExplorers = async (req, res) => {
    try {
        const where = { deletedAt: null };
        if (req.query.destinationId) {
            where.destinationId = req.query.destinationId;
        }

        const states = await prisma.stateExplorer.findMany({
            where,
            orderBy: { id: 'asc' },
            include: { destination: true }
        });
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all state explorers (Trash)
// @route   GET /api/state-explorer/trash
// @access  Private (Admin)
const getTrashedStateExplorers = async (req, res) => {
    try {
        const states = await prisma.stateExplorer.findMany({
            where: { deletedAt: { not: null } },
            orderBy: { deletedAt: 'desc' },
            include: { destination: true }
        });
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single state explorer
// @route   GET /api/state-explorer/:id
// @access  Public
const getStateExplorer = async (req, res) => {
    try {
        const state = await prisma.stateExplorer.findUnique({
            where: { id: req.params.id },
            include: { destination: true }
        });
        if (state) {
            res.json(state);
        } else {
            res.status(404).json({ message: 'State Explorer entry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a state explorer entry
// @route   POST /api/state-explorer
// @access  Private (Admin)
const createStateExplorer = async (req, res) => {
    const { name, image, description, destinationId } = req.body;
    try {
        const state = await prisma.stateExplorer.create({
            data: {
                name,
                image,
                description,
                destinationId,
                deletedAt: null
            },
        });
        res.status(201).json(state);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a state explorer entry
// @route   PUT /api/state-explorer/:id
// @access  Private (Admin)
const updateStateExplorer = async (req, res) => {
    const { name, image, description, destinationId } = req.body;
    try {
        const state = await prisma.stateExplorer.update({
            where: { id: req.params.id },
            data: {
                name,
                image,
                description,
                destinationId
            },
        });
        res.json(state);
    } catch (error) {
        res.status(404).json({ message: 'State Explorer entry not found' });
    }
};

// @desc    Soft Delete a state explorer entry
// @route   DELETE /api/state-explorer/:id
// @access  Private (Admin)
const deleteStateExplorer = async (req, res) => {
    try {
        await prisma.stateExplorer.update({
            where: { id: req.params.id },
            data: { deletedAt: new Date() }
        });
        res.json({ message: 'State Explorer entry moved to trash' });
    } catch (error) {
        res.status(404).json({ message: 'Element not found' });
    }
};

// @desc    Restore a state explorer entry
// @route   PATCH /api/state-explorer/:id/restore
// @access  Private (Admin)
const restoreStateExplorer = async (req, res) => {
    try {
        await prisma.stateExplorer.update({
            where: { id: req.params.id },
            data: { deletedAt: null }
        });
        res.json({ message: 'State Explorer entry restored' });
    } catch (error) {
        res.status(404).json({ message: 'Element not found' });
    }
};

// @desc    Permanently Delete a state explorer entry
// @route   DELETE /api/state-explorer/:id/permanent
// @access  Private (Superadmin)
const permanentDeleteStateExplorer = async (req, res) => {
    try {
        await prisma.stateExplorer.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'State Explorer entry permanently deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete element permanently' });
    }
};

// @desc    Empty State Explorer Trash
// @route   DELETE /api/state-explorer/empty-trash
// @access  Private (Superadmin)
const emptyTrashStateExplorers = async (req, res) => {
    try {
        if (req.admin.role !== 'superadmin') {
            return res.status(403).json({ message: "Superadmin only" });
        }

        const result = await prisma.stateExplorer.deleteMany({
            where: { NOT: { deletedAt: null } }
        });

        res.json({ message: `Explorer trash emptied. ${result.count} items deleted.` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to empty explorer trash' });
    }
};

module.exports = {
    getStateExplorers,
    getStateExplorer,
    createStateExplorer,
    updateStateExplorer,
    deleteStateExplorer,
    getTrashedStateExplorers,
    restoreStateExplorer,
    permanentDeleteStateExplorer,
    emptyTrashStateExplorers
};

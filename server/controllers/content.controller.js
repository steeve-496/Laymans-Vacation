const prisma = require('../prismaClient');

// --- STATE EXPLORER ---

const getStates = async (req, res) => {
    try {
        const states = await prisma.stateExplorer.findMany({
            orderBy: { order: 'asc' },
        });
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createState = async (req, res) => {
    const { stateName, image, details } = req.body;
    try {
        const lastItem = await prisma.stateExplorer.findFirst({
            orderBy: { order: 'desc' },
        });
        const newOrder = lastItem ? lastItem.order + 1 : 0;

        const state = await prisma.stateExplorer.create({
            data: { stateName, image, details, order: newOrder },
        });
        res.status(201).json(state);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateState = async (req, res) => {
    const { stateName, image, details } = req.body;
    try {
        const state = await prisma.stateExplorer.update({
            where: { id: req.params.id },
            data: { stateName, image, details },
        });
        res.json(state);
    } catch (error) {
        res.status(404).json({ message: 'State not found' });
    }
};

const deleteState = async (req, res) => {
    try {
        await prisma.stateExplorer.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'State removed' });
    } catch (error) {
        res.status(404).json({ message: 'State not found' });
    }
};

const reorderStates = async (req, res) => {
    const { orderedIds } = req.body;
    if (!orderedIds || !Array.isArray(orderedIds)) return res.status(400).json({ message: 'Invalid data' });

    try {
        const transaction = orderedIds.map((id, index) =>
            prisma.stateExplorer.update({
                where: { id },
                data: { order: index },
            })
        );
        await prisma.$transaction(transaction);
        res.json({ message: 'States reordered' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- GENERAL SECTION CONTENT ---

const getSectionContent = async (req, res) => {
    try {
        const content = await prisma.sectionContent.findUnique({
            where: { sectionKey: req.params.key },
        });
        if (content) res.json(content);
        else res.status(404).json({ message: 'Content not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSectionContent = async (req, res) => {
    const { title, subtitle, body, image, details } = req.body;
    try {
        const content = await prisma.sectionContent.upsert({
            where: { sectionKey: req.params.key },
            update: { title, subtitle, body, image, details },
            create: { sectionKey: req.params.key, title, subtitle, body, image, details },
        });
        res.json(content);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getStates, createState, updateState, deleteState, reorderStates,
    getSectionContent, updateSectionContent
};

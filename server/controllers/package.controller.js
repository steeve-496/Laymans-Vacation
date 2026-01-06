const prisma = require('../prismaClient');

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
const getPackages = async (req, res) => {
    try {
        const packages = await prisma.package.findMany({
            where: { deletedAt: null },
            orderBy: { order: 'asc' },
        });
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all packages (Trash)
// @route   GET /api/packages/trash
// @access  Private (Admin)
const getTrashedPackages = async (req, res) => {
    try {
        const packages = await prisma.package.findMany({
            where: { deletedAt: { not: null } },
            orderBy: { deletedAt: 'desc' },
            include: { destination: true }
        });
        res.json(packages);
    } catch (error) {
        console.error("Error in getTrashedPackages:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
const getPackage = async (req, res) => {
    try {
        const pkg = await prisma.package.findUnique({
            where: { id: req.params.id },
        });
        if (pkg) {
            res.json(pkg);
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a package
// @route   POST /api/packages
// @access  Private (Admin)
const createPackage = async (req, res) => {
    console.log("DEBUG: createPackage payload:", req.body);
    const { title, image, price, duration, description, details, destinationId, category } = req.body;
    try {
        const lastItem = await prisma.package.findFirst({
            orderBy: { order: 'desc' },
        });
        const newOrder = lastItem ? lastItem.order + 1 : 0;

        const pkg = await prisma.package.create({
            data: {
                title,
                image,
                price,
                duration,
                description,
                details,
                destinationId: destinationId,
                category,
                order: newOrder,
                deletedAt: null
            },
        });
        console.log("DEBUG: createPackage success:", pkg);
        res.status(201).json(pkg);
    } catch (error) {
        console.error("DEBUG: createPackage failed:", error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a package
// @route   PUT /api/packages/:id
// @access  Private (Admin)
const updatePackage = async (req, res) => {
    const { title, image, price, duration, description, details, destinationId, category } = req.body;
    try {
        const pkg = await prisma.package.update({
            where: { id: req.params.id },
            data: {
                title,
                image,
                price,
                duration,
                description,
                details,
                destinationId: destinationId || undefined,
                category,
            },
        });
        res.json(pkg);
    } catch (error) {
        res.status(404).json({ message: 'Package not found or update failed' });
    }
};

// @desc    Soft Delete a package
// @route   DELETE /api/packages/:id
// @access  Private (Admin)
const deletePackage = async (req, res) => {
    try {
        await prisma.package.update({
            where: { id: req.params.id },
            data: { deletedAt: new Date() }
        });
        res.json({ message: 'Package moved to trash' });
    } catch (error) {
        res.status(404).json({ message: 'Package not found' });
    }
};

// @desc    Restore a package
// @route   PATCH /api/packages/:id/restore
// @access  Private (Admin)
const restorePackage = async (req, res) => {
    try {
        await prisma.package.update({
            where: { id: req.params.id },
            data: { deletedAt: null }
        });
        res.json({ message: 'Package restored' });
    } catch (error) {
        res.status(404).json({ message: 'Package not found' });
    }
};

// @desc    Permanently Delete a package
// @route   DELETE /api/packages/:id/permanent
// @access  Private (Superadmin)
const permanentDeletePackage = async (req, res) => {
    try {
        await prisma.package.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Package permanently deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete package permanently' });
    }
};

// @desc    Reorder packages
// @route   PATCH /api/packages/reorder
// @access  Private (Admin)
const reorderPackages = async (req, res) => {
    const { orderedIds } = req.body;

    if (!orderedIds || !Array.isArray(orderedIds)) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const transaction = orderedIds.map((id, index) =>
            prisma.package.update({
                where: { id },
                data: { order: index },
            })
        );

        await prisma.$transaction(transaction);
        res.json({ message: 'Packages reordered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Empty Package Trash
// @route   DELETE /api/packages/empty-trash
// @access  Private (Superadmin)
const emptyTrashPackages = async (req, res) => {
    try {
        if (req.admin.role !== 'superadmin') {
            return res.status(403).json({ message: "Superadmin only" });
        }

        const result = await prisma.package.deleteMany({
            where: { NOT: { deletedAt: null } }
        });

        // Simple log, no action service imported here yet?
        // Ideally should import logAction. Assuming not strictly required for now or import missing.
        res.json({ message: `Package trash emptied. ${result.count} items deleted.` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to empty package trash' });
    }
};

module.exports = {
    getPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage,
    reorderPackages,
    getTrashedPackages,
    restorePackage,
    permanentDeletePackage,
    emptyTrashPackages
};

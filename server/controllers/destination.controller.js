const prisma = require('../prismaClient');
const { logAction } = require('../services/audit.service');

// @desc    Get all destinations (Public - Visible Only)
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res) => {
    try {
        console.log("Getting Public Destinations...");
        const destinations = await prisma.destination.findMany({
            where: { deletedAt: null, isVisible: true },
            orderBy: { order: 'asc' },
            include: { packages: true }
        });
        const totalActive = await prisma.destination.count({ where: { deletedAt: null } });
        console.log(`Public: Found ${destinations.length} visible out of ${totalActive} active destinations.`);
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all destinations (Admin - All Active)
// @route   GET /api/destinations/admin/all
// @access  Private (Admin)
const getAdminDestinations = async (req, res) => {
    try {
        console.log("Getting Admin Destinations...");
        const destinations = await prisma.destination.findMany({
            where: { deletedAt: null },
            orderBy: { order: 'asc' },
            include: { packages: true }
        });
        console.log(`Found ${destinations.length} destinations`);
        res.json(destinations);
    } catch (error) {
        console.error("CRITICAL ERROR in getAdminDestinations:", error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Get all destinations (Admin / Trash)
// @route   GET /api/destinations/trash
// @access  Private (Admin)
const getTrashedDestinations = async (req, res) => {
    try {
        const destinations = await prisma.destination.findMany({
            where: { deletedAt: { not: null } },
            orderBy: { deletedAt: 'desc' },
            include: { packages: true }
        });
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
const getDestination = async (req, res) => {
    try {
        const destination = await prisma.destination.findUnique({
            where: { id: req.params.id },
            include: { packages: true },
        });

        if (destination) {
            // If hidden and not admin -> 404? 
            // For now, if public endpoint helper, keep simple. 
            // But ideally, public should not see isVisible: false unless admin.
            res.json(destination);
        } else {
            res.status(404).json({ message: 'Destination not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a destination
// @route   POST /api/destinations
// @access  Private (Admin)
const createDestination = async (req, res) => {
    try {
        console.log("DEBUG: createDestination payload:", JSON.stringify(req.body, null, 2));
        const { name, image, description, details, isInternational, lat, lng, badge } = req.body;

        if (!name) {
            console.error("DEBUG: Name is missing in payload");
            return res.status(400).json({ message: "Name is required" });
        }

        // Check if destination exists (even if deleted?)
        // If unique name constraint exists, we might need to handle recreating a name that is currently in trash.
        // Prisma unique constraint will fail if name exists in trash.
        // Ideally, we should soft-delete rename the old one or allow restoring. 
        // For now, let's keep it simple: unique constraint applies globally.

        const count = await prisma.destination.count({ where: { deletedAt: null } });
        const newDestination = await prisma.destination.create({
            data: {
                name,
                image,
                description,
                details,
                isInternational: Boolean(isInternational),
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                badge,
                order: count + 1,
                deletedAt: null // Explicitly set to null for consistency
            },
        });

        await logAction(req.admin.id, 'CREATE_DESTINATION', { name: newDestination.name });
        console.log("DEBUG: createDestination success:", JSON.stringify(newDestination, null, 2));
        res.status(201).json(newDestination);
    } catch (error) {
        console.error("DEBUG: createDestination failed:", error);
        res.status(400).json({ message: 'Invalid destination data or duplicate name: ' + error.message });
    }
};

// @desc    Update a destination
// @route   PUT /api/destinations/:id
// @access  Private (Admin)
const updateDestination = async (req, res) => {
    const { name, image, description, details, isInternational, lat, lng, badge } = req.body;

    try {
        const updatedDestination = await prisma.destination.update({
            where: { id: req.params.id },
            data: {
                name,
                image,
                description,
                details,
                isInternational: Boolean(isInternational),
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                badge,
            },
        });

        await logAction(req.admin.id, 'UPDATE_DESTINATION', { name: updatedDestination.name });
        res.json(updatedDestination);
    } catch (error) {
        res.status(404).json({ message: 'Destination not found: ' + error.message });
    }
};

// @desc    Toggle Visibility
// @route   PATCH /api/destinations/:id/toggle-visibility
// @access  Private (Admin)
const toggleVisibility = async (req, res) => {
    try {
        const destination = await prisma.destination.findUnique({ where: { id: req.params.id } });
        if (!destination) return res.status(404).json({ message: 'Destination not found' });

        const updated = await prisma.destination.update({
            where: { id: req.params.id },
            data: { isVisible: !destination.isVisible }
        });

        await logAction(req.admin.id, updated.isVisible ? 'SHOW_DESTINATION' : 'HIDE_DESTINATION', { name: updated.name });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Soft Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Private (Admin)
const deleteDestination = async (req, res) => {
    try {
        const id = req.params.id;
        const now = new Date();

        // Soft delete destination and its packages/explorers?
        // Yes, cascade soft delete.
        const dest = await prisma.destination.findUnique({ where: { id } });

        await prisma.$transaction([
            prisma.package.updateMany({
                where: { destinationId: id, deletedAt: null },
                data: { deletedAt: now }
            }),
            prisma.stateExplorer.updateMany({
                where: { destinationId: id, deletedAt: null },
                data: { deletedAt: now }
            }),
            prisma.destination.update({
                where: { id: id },
                data: { deletedAt: now }
            })
        ]);

        if (dest) await logAction(req.admin.id, 'DELETE_DESTINATION', { name: dest.name });
        res.json({ message: 'Destination moved to trash' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete destination' });
    }
};

// @desc    Restore a destination
// @route   PATCH /api/destinations/:id/restore
// @access  Private (Admin)
const restoreDestination = async (req, res) => {
    try {
        const id = req.params.id;

        // Restore destination and associated items?
        // Only restore items that were deleted at the same time? hard to track without transaction ID.
        // For simplicity, restore all associated items that are deleted? 
        // Or just restore the destination and let admin manually restore packages?
        // User expects "Undo". So restoring destination should probably restore its content.

        await prisma.$transaction([
            prisma.package.updateMany({
                where: { destinationId: id, NOT: { deletedAt: null } },
                data: { deletedAt: null }
            }),
            prisma.stateExplorer.updateMany({
                where: { destinationId: id, NOT: { deletedAt: null } },
                data: { deletedAt: null }
            }),
            prisma.destination.update({
                where: { id: id },
                data: { deletedAt: null }
            })
        ]);

        const dest = await prisma.destination.findUnique({ where: { id } });
        if (dest) await logAction(req.admin.id, 'RESTORE_DESTINATION', { name: dest.name });

        res.json({ message: 'Destination restored' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to restore destination' });
    }
};

// @desc    Permanently Delete a destination
// @route   DELETE /api/destinations/:id/permanent
// @access  Private (Superadmin)
const permanentDeleteDestination = async (req, res) => {
    try {
        // Superadmin check logic is in middleware or route, but good to be safe.
        // Assuming protect middleware sets req.admin and we trust route protection.
        if (req.admin.role !== 'superadmin') {
            return res.status(403).json({ message: "Superadmin only" });
        }

        const id = req.params.id;

        // Fetch name for log before delete
        const dest = await prisma.destination.findUnique({ where: { id } });

        await prisma.$transaction([
            prisma.package.deleteMany({ where: { destinationId: id } }),
            prisma.stateExplorer.deleteMany({ where: { destinationId: id } }),
            prisma.destination.delete({ where: { id: id } })
        ]);

        if (dest) await logAction(req.admin.id, 'PERMANENT_DELETE_DESTINATION', { name: dest.name });

        res.json({ message: 'Destination permanently deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete destination permanently' });
    }
};

// @desc    Reorder destinations
// @route   PATCH /api/destinations/reorder
// @access  Private (Admin)
const reorderDestinations = async (req, res) => {
    const { orderedIds } = req.body; // Array of IDs in new order

    if (!orderedIds || !Array.isArray(orderedIds)) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const transaction = orderedIds.map((id, index) =>
            prisma.destination.update({
                where: { id },
                data: { order: index },
            })
        );

        await prisma.$transaction(transaction);
        res.json({ message: 'Destinations reordered successfully' });
    } catch (error) {
        console.error("Error in getAdminDestinations:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Empty Trash (Permanently delete all soft-deleted destinations)
// @route   DELETE /api/destinations/empty-trash
// @access  Private (Superadmin)
const emptyTrashDestinations = async (req, res) => {
    try {
        if (req.admin.role !== 'superadmin') {
            return res.status(403).json({ message: "Superadmin only" });
        }

        const count = await prisma.destination.count({ where: { NOT: { deletedAt: null } } });

        // Find all deleted IDs first to clean up relations
        const deletedDestinations = await prisma.destination.findMany({
            where: { NOT: { deletedAt: null } },
            select: { id: true }
        });
        const ids = deletedDestinations.map(d => d.id);

        await prisma.$transaction([
            prisma.package.deleteMany({ where: { destinationId: { in: ids } } }),
            prisma.stateExplorer.deleteMany({ where: { destinationId: { in: ids } } }),
            prisma.destination.deleteMany({ where: { id: { in: ids } } })
        ]);

        await logAction(req.admin.id, 'EMPTY_TRASH_DESTINATIONS', { count });
        res.json({ message: `Trash emptied. ${count} destinations permanently deleted.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to empty trash' });
    }
};

module.exports = {
    getDestinations,
    getDestination,
    createDestination,
    updateDestination,
    deleteDestination,
    reorderDestinations,
    getTrashedDestinations,
    restoreDestination,
    permanentDeleteDestination,
    toggleVisibility,
    getAdminDestinations,
    emptyTrashDestinations
};

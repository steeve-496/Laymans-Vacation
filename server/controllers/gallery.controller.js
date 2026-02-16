const prisma = require('../prismaClient');
const { logAction } = require('../services/audit.service');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
    try {
        const items = await prisma.galleryItem.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a gallery item
// @route   POST /api/gallery
// @access  Private (Admin)
const createGalleryItem = async (req, res) => {
    const { src, alt, caption, className } = req.body;

    try {
        const count = await prisma.galleryItem.count();
        const item = await prisma.galleryItem.create({
            data: {
                src,
                alt,
                caption,
                className,
                order: count + 1
            }
        });

        await logAction(req.admin.id, 'CREATE_GALLERY_ITEM', { id: item.id });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add image' });
    }
};

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private (Admin)
const deleteGalleryItem = async (req, res) => {
    try {
        const item = await prisma.galleryItem.delete({
            where: { id: req.params.id }
        });

        await logAction(req.admin.id, 'DELETE_GALLERY_ITEM', { id: item.id });
        res.json({ message: 'Image deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete image' });
    }
};

// @desc    Reorder gallery items
// @route   PATCH /api/gallery/reorder
// @access  Private (Admin)
const reorderGalleryItems = async (req, res) => {
    const { orderedIds } = req.body;

    if (!orderedIds || !Array.isArray(orderedIds)) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const transaction = orderedIds.map((id, index) =>
            prisma.galleryItem.update({
                where: { id },
                data: { order: index },
            })
        );

        await prisma.$transaction(transaction);
        res.json({ message: 'Gallery reordered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getGalleryItems,
    createGalleryItem,
    deleteGalleryItem,
    reorderGalleryItems
};

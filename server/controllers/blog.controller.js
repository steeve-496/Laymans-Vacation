const prisma = require('../prismaClient');
const { logAction } = require('../services/audit.service');

// @desc    Get all blogs (Public)
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlog = async (req, res) => {
    try {
        const blog = await prisma.blog.findUnique({
            where: { id: req.params.id }
        });
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a blog post
// @route   POST /api/blogs
// @access  Private (Admin)
const createBlog = async (req, res) => {
    const { title, excerpt, content, image, category, author, authorImg, date } = req.body;

    try {
        const blog = await prisma.blog.create({
            data: {
                title,
                excerpt,
                content,
                image,
                category,
                author,
                authorImg,
                date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }
        });

        await logAction(req.admin.id, 'CREATE_BLOG', { title: blog.title });
        res.status(201).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create blog' });
    }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private (Admin)
const updateBlog = async (req, res) => {
    const { title, excerpt, content, image, category, author, authorImg, date } = req.body;

    try {
        const blog = await prisma.blog.update({
            where: { id: req.params.id },
            data: {
                title,
                excerpt,
                content,
                image,
                category,
                author,
                authorImg,
                date
            }
        });

        await logAction(req.admin.id, 'UPDATE_BLOG', { title: blog.title });
        res.json(blog);
    } catch (error) {
        res.status(404).json({ message: 'Blog not found' });
    }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Admin)
const deleteBlog = async (req, res) => {
    try {
        const blog = await prisma.blog.delete({
            where: { id: req.params.id }
        });

        await logAction(req.admin.id, 'DELETE_BLOG', { title: blog.title });
        res.json({ message: 'Blog deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete blog' });
    }
};

module.exports = {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog
};

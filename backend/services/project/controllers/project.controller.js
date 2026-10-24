import Project from "../models/project.model.js";
import redis from "../../../shared/redis/redis.js";

export const createProject = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const { name, description } = req.body;

        const project = await Project.create({
            owner: userId,
            name,
            description,
        })

        const key=`projects:${userId}`;

        await redis.del(key);

        return res.status(201).json(project);
    } catch (error) {
        return res.status(500).json({ message: `Create project error: ${error.message}` });
    }
};


export const getProjects = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const key=`projects:${userId}`;
        let result = await redis.get(key);
        if (result) {
            return res.status(200).json(JSON.parse(result));
        }

        const projects = await Project.find({
            owner: userId,
        }).sort({ updatedAt: -1 });

        await redis.set(key, JSON.stringify(projects));
        return res.status(200).json(projects);

    } catch (error) {
        return res.status(500).json({ message: `Get project error: ${error.message}` });
    }
};


export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        project.lastOpenedAt = new Date();
        await project.save();

        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({ message: `Get project by Id error: ${error.message}` });
    }
};


export const getStarredProject = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const key=`starredProjects:${userId}`;
        let result = await redis.get(key);
        if (result) {
            return res.status(200).json(JSON.parse(result));
        }

        const project = await Project.find({
            owner: userId,
            starred: true,
        }).sort({ updatedAt: -1 });

        await redis.set(key, JSON.stringify(project));
        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({ message: `Get starred project error: ${error.message}` });
    }
};

export const toggleStarredProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId=req.headers["x-user-id"]

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        project.starred = !project.starred;
        await project.save();

        const key = `starredProjects:${userId}`;
        await redis.del(key);
        await redis.del(`projects-${userId}`);

        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({ message: `Toggle starred project error: ${error.message}` });
    }
}    

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const key = `projects:${userId}`;
        await redis.del(key);

        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({ message: `Delete project error: ${error.message}` });
    }
}   
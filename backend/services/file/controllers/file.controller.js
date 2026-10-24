import File from "../models/file.model";

export const createRootFolder=(req,res)=>{
    try {
        const {projectId,projectName}=req.body
        const userId=req.headers["x-user-id"]
        if(!projectId || !projectName) {
            return res.status(400).json({message:"projectId and name is required!"})
        }

        const existingRootFolder=await File.findOne({
            projectId,
            parentId:null,
            isDeleted:false
        })

        if(existingRootFolder){
            return res.status(400).json({message:"root folder already exist"})
        }

        const rootFolder=await File.create({
            owner:userId,
            name:projectName,
            projectId,
            type:"folder",
            parentId:null
        })
        return res.status(201).json(rootFolder)
    } catch (error) {
        return res.status(500).json({message:`create root folder error ${error}`})
    }
}
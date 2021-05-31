const { request } = require('express');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('../db/conn');
const User = require("../models/userSchema");


const Admin = require("../models/adminSchema");

router.get('/', (req, res) => {
    res.send('Hello from the other side');
});

// USING PROMISES
// router.post('/register', (req,res)=>{
//     console.log(req.body);

//     const { name, email, phone, password, cpassword, skills } = req.body; //object destructuring

//     if(!name || !email || !phone || !password || !cpassword || !skills){
//         return res.status(422).json({error: "Plz fill all fields"});
//     }

//     User.findOne({email: email}).then((userExist) => {
//         if(userExist) {
//             return res.status(422).json({error: "Email already exists"});
//         }


//         const user = new User({ name, email, phone, password, cpassword, skills });//Same as name:name, email:email
//         user.save().then(()=> {
//             res.status(201).json({message:"user registered successfully"});
//         }).catch((err)=>res.status(500).json({erro:"user registeration failed"}));
//     }).catch(err => {console.log(err); });

// });

//USING ASYNC-AWAIT
//When user regiaters:--->
router.post('/register', async (req, res) => {

    const { name, voterID, password, cpassword} = req.body; //object destructuring

    if (!name || !voterID || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill all fields" });
    }

    try {
        const userExist = await User.findOne({ voterID: voterID });

        if (userExist) {
            return res.status(422).json({ error: "voterID already exists" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Passwords don't match" });
        } else {
            const user = new User({ name, voterID, password, cpassword});
            await user.save();
            res.status(201).json({ message: "user registered successfully" });
        }

    } catch (err) {
        console.log(err);
    }
});

//ADMIN REGISTER:--->
router.post('/adminRegister', async (req, res) => {

    const { userName, name, password, cpassword} = req.body; //object destructuring

    if (!userName || !password || !name || !cpassword) {
        return res.status(422).json({ error: "Please fill all fields" });
    }

    try {
        const userExist = await Admin.findOne({ userName: userName});

        if (userExist) {
            return res.status(422).json({ error: "userName already exists" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Passwords don't match" });
        } else {
            const user = new Admin({ name, userName, password, cpassword});
            await user.save();
            res.status(201).json({ message: "Admin registered successfully" });
        }

    } catch (err) {
        console.log(err);
    }
});

//LOGIN ADMIN--->
router.post('/signinAdmin', async (req, res) => {
    try {
        const { userName, password} = req.body;
        if (!userName || !password) {
            //console.log(req.body);
            return res.status(400).json({ error: "Please fill the data" })
        }

        const adminLogin = await Admin.findOne({ userName: userName });

        //const emailDomain = User.email.substring(email.indexOf('@') + 1);

        if (adminLogin) {
            const isMatch = await bcrypt.compare(password, adminLogin.password);
            if (!isMatch) {
                res.status(400).json({ error: "Invalid Password" });
            } else {
                    res.json({ error: "Login Successfully" });
                }
        } else {
            res.status(400).json({ error: "Invalid UserName" });
        }
    } catch (err) {
        console.log(err);
    }
});

//LOGIN Route:--->
router.post('/signin', async (req, res) => {
    try {
        let token;
        const { voterID, password} = req.body;
        if (!voterID || !password) {
            //console.log(req.body);
            return res.status(400).json({ error: "Please fill the data" })
        }

        const userLogin = await User.findOne({ voterID: voterID });

        //const emailDomain = User.email.substring(email.indexOf('@') + 1);

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            if (!isMatch) {
                res.status(400).json({ error: "Invalid Password" });
            } else {
                    res.json({ error: "Login Successfully" });
                }
        } else {
            res.status(400).json({ error: "Invalid UserName" });
        }
    } catch (err) {
        console.log(err);
    }
});

//Overview Page 1:--->
// router.get('/overview',async (req,res) => {
//     try{
//         //let token;
//         //const {email, uniqueProjectId, emailDomain} = req.body;
//         const {uniqueProjectId, emailDomain} = req.body;
//         if(!emailDomain || !uniqueProjectId){
//             return res.status(400).json({error:"Please fill the data"})
//         }

//         const projectOverview = await Project.findOne({emailDomain: emailDomain, uniqueProjectId: uniqueProjectId});

//         //const emailDomain = User.email.substring(email.indexOf('@') + 1);
//         //const projectLogin = await Project.findOne({uniqueProjectId: uniqueProjectId, emailDomain: emailDomain})

//         if(projectOverview)
//         {
//          console.log(projectOverview);
//         } else {
//             res.status(400).json({error: "Error Occured" });
//         }   

//     } catch(err){
//         console.log(err);
//     }
// });

//OverView Page 2:--->

router.get('/overview/:projectID/:email', async (req, res) => {
    try {
        const uniqueProjectId = req.params.projectID;
        const UserEmail = req.params.email;
        const emailDomain = UserEmail.substring(UserEmail.indexOf('@') + 1);
        //const {uniqueProjectId, emailDomain} = req.body;
        if (!emailDomain || !uniqueProjectId) {
            //return res.status(400).json({error:"Please fill the data"})
        } else {
            Project.findOne({ emailDomain: emailDomain, uniqueProjectId: uniqueProjectId }).then(Data => {
                //console.log(Project);
                //res.send(Data);
                res.status(200).send(Data);
            })
        }

        // const projectOverview = await Project.findOne({emailDomain: emailDomain, uniqueProjectId: uniqueProjectId});    

    } catch (err) {
        console.log(err);
    }
});



//Create Project Login Route:--->
router.post('/createNewProjectSignin', async (req, res) => {
    try {
        let token;
        const { email, password, } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill the data" })
        }

        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            //token = await userLogin.genrateAuthToken();
            //console.log(token);
            //STORE GENRATED TOKEN IN COOKIE: 
            // res.cookie("jwtoken", token,{
            //     domain: "http://localhost:3000/Signup",
            //     expires: new Date(Date.now()+25892000000), //token expires after 30 days
            //     httpOnly: true,
            //     secure: true
            // });

            if (!isMatch) {
                console.log("isMatch")
                res.status(400).json({ error: "Invalid Password" });
            } else {
                res.json({ error: "Login Successfully" });
            }
        } else {
            res.status(400).json({ error: "Invalid Email Id" });
            console.log("Email")
        }



    } catch (err) {
        console.log(err);
    }
});


//Craete NEW PROJECT:--->
router.post('/createNewProject', async (req, res) => {
    //console.log(req.body);
    const { name, managerEmailId, projectUsersEmailId, emailDomain, startDate, expectedFinishDate, uniqueProjectId, projectDescription, budget } = req.body; //object destructuring

    if (name == null || !managerEmailId || !projectUsersEmailId || !emailDomain || !startDate || !expectedFinishDate || !uniqueProjectId || !projectDescription || !budget) {
        console.log(req.body)
        return res.status(422).json({ error: req.body });
    }

    try {
        const projectExist = await Project.findOne({ uniqueProjectId: uniqueProjectId, emailDomain: emailDomain });

        if (projectExist) {
            return res.status(422).json({ error: "ProjectId already taken" });
        } else {
            const project = new Project({ name, managerEmailId, projectUsersEmailId, emailDomain, startDate, expectedFinishDate, uniqueProjectId, projectDescription, budget });
            await project.save();
            res.status(201).json({ message: "Project Created successfully" });
        }

    } catch (err) {
        console.log(err);
    }
});

//create new proj page  middleware:-->

// router.get('/newproject',authenticate,(req,res)=>{
//     console.log('hi new proj');
//     res.send('Hello from the newproject');
// });


//ADD MEMEBER:---->
//ADD ALERT SO THAT MEMBER OUTSIDE DOMAIN CANNOT BE ADDED
//ALSO SEE SAME MEMBER CAN NOT BE ADDED TWICE
router.post('/addMember', async (req, res) => {
    //console.log(req.body);
    const { memberEmailID, projectID } = req.body; //object destructuring

    if (!memberEmailID || !projectID) {
        console.log(memberEmailID);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const memberExist = await User.findOne({ email: memberEmailID });
        const emailDomain = memberEmailID.substring(memberEmailID.indexOf('@') + 1);
        const project = await Project.findOne({ uniqueProjectId: projectID, emailDomain: emailDomain });
        if (memberExist) {
            //console.log(memberExist)
            if (project.projectUsersEmailId.includes(memberEmailID)) {
                return res.status(422).json({ error: "Member already added" })
            } else {
                project.projectUsersEmailId.push(memberEmailID);
                await project.save();
                return res.status(201).json({ message: "Member added Successfully!" });
            }
        } else {
            console.log(req.body);
            res.status(422).json({ error: "An Error Occured Please try again" });
        }
    } catch (err) {
        console.log(err);
    }
});

//REMOVE MEMBER-->
router.post('/removeMember', async (req, res) => {
    //console.log(req.body);
    const { memberEmailID, projectID } = req.body; //object destructuring

    if (!memberEmailID || !projectID) {
        //console.log(memberEmailID);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const memberExist = await User.findOne({ email: memberEmailID });
        const emailDomain = memberEmailID.substring(memberEmailID.indexOf('@') + 1);
        const project = await Project.findOne({ uniqueProjectId: projectID, emailDomain: emailDomain });
        if (project.projectUsersEmailId.includes(memberEmailID)) {
            //console.log(memberExist)
            // project.updateOne({uniqueProjectId: projectID, emailDomain: emailDomain},{$pull: {memberEmailID}});
            const memberIndex = project.projectUsersEmailId.indexOf(memberEmailID);
            project.projectUsersEmailId.splice(memberIndex, 1);
            await project.save();
            return res.status(201).json({ message: "Member removed Successfully!" });
        } else {
            res.status(422).json({ error: "Member not a part of Project!" });
        }
    } catch (err) {
        console.log(err);
    }
});

//VIEW MEMBER DETAILS:--> 
router.get('/viewMembers/:projectID/:email', async (req, res) => {
    try {
        const uniqueProjectId = req.params.projectID;
        const UserEmail = req.params.email;
        const emailDomain = UserEmail.substring(UserEmail.indexOf('@') + 1);
        //const {uniqueProjectId, emailDomain} = req.body;
        if (!emailDomain || !uniqueProjectId) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            listOfUsers = [];
            const project = await Project.findOne({ emailDomain: emailDomain, uniqueProjectId: uniqueProjectId })
            numOfUsers = project.projectUsersEmailId.length
            for (var i = 0; i < numOfUsers; i++) {
                const user = await User.findOne({ email: project.projectUsersEmailId[i] });
                if (user != null) {
                    listOfUsers.push(user);
                }
                //console
            }
            //console.log(Project);
            //res.send(Data);
            //const Data = listOfUdsers
            //if(listOfUsers.length===numOfUsers){
            res.status(200).send(listOfUsers);

        }

        // const projectOverview = await Project.findOne({emailDomain: emailDomain, uniqueProjectId: uniqueProjectId});    

    } catch (err) {
        console.log(err);
    }
});

//VIEW MANAGER DETAILS:--->
router.get('/viewManager/:projectID/:email', async (req, res) => {
    try {
        const uniqueProjectId = req.params.projectID;
        const UserEmail = req.params.email;
        const emailDomain = UserEmail.substring(UserEmail.indexOf('@') + 1);
        //const {uniqueProjectId, emailDomain} = req.body;
        if (!emailDomain || !uniqueProjectId) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            const project = await Project.findOne({ emailDomain: emailDomain, uniqueProjectId: uniqueProjectId })
            const managerEmailID = project.managerEmailId
            const manager = await User.findOne({ email: managerEmailID });
            //console
            //console.log(Project);
            //res.send(Data);
            //const Data = listOfUdsers
            //if(listOfUsers.length===numOfUsers){
            res.status(200).send(manager);
        }
    } catch (err) {
        console.log(err);
    }
});

// ADD TASK:--->
router.post('/addTask', async (req, res) => {
    //console.log(req.body);
    const { memberEmailIDs, projectID, emailDomain, taskName, time, status, startDate, endDate } = req.body; //object destructuring

    if (!memberEmailIDs || !projectID || !emailDomain || !taskName || !time || !status || !startDate || !endDate) {
        console.log(memberEmailIDs);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const memberEmailArr = memberEmailIDs.split(";");
        const project = await Project.findOne({ uniqueProjectId: projectID, emailDomain: emailDomain });
        const projectDoc_ID = project._id
        // project.tasks.push({name: taskName},)
        // await project.save();
        for (var i = 0; i < memberEmailArr.length; i++) {
            const memberExist = project.projectUsersEmailId.includes(memberEmailArr[i]);
            if (!memberExist) {
                return res.status(422).json({ error: "Member Not Found" });
            }
        }
        project.tasks.push({ name: taskName, status: status, assignedTo: memberEmailArr, projectDoc_ID: projectDoc_ID, startDate: startDate, endDate: endDate, time: time })
        console.log(project);
        await project.save()
        return res.status(201).json({ message: "Task added Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

//SHOW MEMBER TASKS:--->
router.get('/viewMemberTasks/:projectID/:email', async (req, res) => {
    try {
        const uniqueProjectId = req.params.projectID;
        const UserEmail = req.params.email;
        const emailDomain = UserEmail.substring(UserEmail.indexOf('@') + 1);
        //const {uniqueProjectId, emailDomain} = req.body;
        if (!emailDomain || !uniqueProjectId) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            var listOfTasks = [];
            const project = await Project.findOne({ emailDomain: emailDomain, uniqueProjectId: uniqueProjectId })
            const allTasks = project.tasks
            for (var i = 0; i < allTasks.length; i++) {
                if (allTasks[i].assignedTo.includes(UserEmail)) {
                    listOfTasks.push(allTasks[i]);
                }
            }
            res.status(200).send(listOfTasks);
        }
        // const projectOverview = await Project.findOne({emailDomain: emailDomain, uniqueProjectId: uniqueProjectId});    
    } catch (err) {
        console.log(err);
    }
});

//SHOW MANAGER TASKS:---->
router.get('/viewProjectTasks/:projectID/:email', async (req, res) => {
    try {
        const uniqueProjectId = req.params.projectID;
        const ManagerEmail = req.params.email; //PASS MANAGER EMAIL ID IN PARAMETERS
        const emailDomain = ManagerEmail.substring(ManagerEmail.indexOf('@') + 1);
        //const {uniqueProjectId, emailDomain} = req.body;
        if (!ManagerEmail || !uniqueProjectId) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            const project = await Project.findOne({ emailDomain: emailDomain, uniqueProjectId: uniqueProjectId })
            const allTasks = project.tasks
            res.status(200).send(allTasks);
        }

    }
    catch (err) {
        console.log(err);
    }
});


//REMOVE TASK-->
router.post('/removeTask', async (req, res) => {
    const { managerEmailID, projectID, taskDocID } = req.body; //object destructuring
    if (!managerEmailID || !projectID || !taskDocID) {
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const emailDomain = managerEmailID.substring(managerEmailID.indexOf('@') + 1);
        const project = await Project.findOne({ uniqueProjectId: projectID, emailDomain: emailDomain });
        // const taskID = String(taskDocI
        project.tasks.pull(String(taskDocID));
        await project.save();
        return res.status(201).json({ message: "Task removed Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

//UPDATE TASK ---->
router.post('/updateTask', async (req, res) => {
    //console.log(req.body);
    const { memberEmailIDs, projectID, emailDomain, taskName, time, status, startDate, endDate, taskDocID } = req.body; //object destructuring

    if (!memberEmailIDs || !projectID || !emailDomain || !taskName || !time || !status || !startDate || !endDate || !taskDocID) {
        console.log(memberEmailIDs);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const memberEmailArr = memberEmailIDs.split(";");
        const project = await Project.findOne({ uniqueProjectId: projectID, emailDomain: emailDomain });
        const projectDoc_ID = project._id
        //const taskID = String(taskDocID);
        project.tasks.pull(String(taskDocID));
        await project.save();
        // project.tasks.push({name: taskName},)
        // await project.save();
        for (var i = 0; i < memberEmailArr.length; i++) {
            const memberExist = project.projectUsersEmailId.includes(memberEmailArr[i]);
            if (!memberExist) {
                return res.status(422).json({ error: "Member Not Found" });
            }
        }
        project.tasks.push({ name: taskName, status: status, assignedTo: memberEmailArr, projectDoc_ID: projectDoc_ID, startDate: startDate, endDate: endDate, time: time })
        await project.save()
        return res.status(201).json({ message: "Task updated Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

//SHOW MILESTONES----->
router.get('/viewProjectMilestones/:projectID/:emailDomain', async (req, res) => {
    try {
        const uniqueProjectId = req.params.projectID;
        const emailDomain = req.params.emailDomain;
        //const {uniqueProjectId, emailDomain} = req.body;
        if (!uniqueProjectId || !emailDomain) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            const project = await Project.findOne({ emailDomain: emailDomain, uniqueProjectId: uniqueProjectId })
            const allMilestones = project.milestones
            res.status(200).send(allMilestones);
        }
    }
    catch (err) {
        console.log(err);
    }
});

//ADD MILESTONE:---->
router.post('/addMilestone', async (req, res) => {
    //console.log(req.body);
    const { projectID, emailDomain, name, type, status, expectedCompletionDate, description } = req.body; //object destructuring

    if (!projectID || !emailDomain || !name || !type || !status || !expectedCompletionDate || !description) {
        //console.log(memberEmailIDs);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const project = await Project.findOne({ uniqueProjectId: projectID, emailDomain: emailDomain });
        const projectDoc_ID = project._id
        // project.tasks.push({name: taskName},)
        // await project.save();
        // for (var i = 0; i < memberEmailArr.length; i++) {
        //     const memberExist = project.projectUsersEmailId.includes(memberEmailArr[i]);
        //     if (!memberExist) {
        //         return res.status(422).json({ error: "Member Not Found" });
        //     }
        // }
        project.milestones.push({ name: name, status: status, type: type, expectedCompletionDate: expectedCompletionDate, description: description })
        await project.save()
        console.log(req.body);
        return res.status(201).json({ message: "Milestone added Successfully!" });
    } catch (err) {
        console.log(req.body);
        console.log(err);
    }
});

//UPDATE MILESTONE STATUS:----->
router.post('/updateMilestone', async (req, res) => {
    //console.log(req.body);
    const { milestoneDocID, projectID, emailDomain } = req.body; //object destructuring

    if (!milestoneDocID || !projectID || !emailDomain) {
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        await Project.findOneAndUpdate({ uniqueProjectId: projectID, emailDomain: emailDomain, "milestones._id": milestoneDocID }, { "milestones.$.status": "Completed", "milestones.$.expectedCompletionDate": new Date() });
        return res.status(201).json({ message: "Milestone added Successfully!" });
    } catch (err) {
        console.log(req.body);
        console.log(err);
    }
});

//REMOVE MILESTONE:------->
router.post('/removeMilestone', async (req, res) => {
    const { managerEmailID, projectID, milestoneDocID } = req.body; //object destructuring
    if (!managerEmailID || !projectID || !milestoneDocID) {
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const emailDomain = managerEmailID.substring(managerEmailID.indexOf('@') + 1);
        const project = await Project.findOne({ uniqueProjectId: projectID, emailDomain: emailDomain });
        // const taskID = String(taskDocI
        project.milestones.pull(String(milestoneDocID));
        await project.save();
        return res.status(201).json({ message: "Milestone removed Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

//SHOW COSTS----->
router.get('/viewProjectCosts/:projectID/:emailDomain', async (req, res) => {
    try {
        const uniqueProjectId = req.params.projectID;
        const emailDomain = req.params.emailDomain;
        //const {uniqueProjectId, emailDomain} = req.body;
        if (!uniqueProjectId || !emailDomain) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            const project = await Project.findOne({ emailDomain: emailDomain, uniqueProjectId: uniqueProjectId })
            const allCosts = project.costs
            res.status(200).send(allCosts);
        }
    }
    catch (err) {
        console.log(err);
    }
});

//ADD COST:----->
router.post('/addCost', async (req, res) => {
    //console.log(req.body);
    const { projectID, emailDomain, name, description, amount } = req.body; //object destructuring

    if (!projectID || !emailDomain || !name || !description || !amount) {
        //console.log(memberEmailIDs);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const project = await Project.findOne({ uniqueProjectId: projectID, emailDomain: emailDomain });
        const projectDoc_ID = project._id
        // project.tasks.push({name: taskName},)
        // await project.save();
        // for (var i = 0; i < memberEmailArr.length; i++) {
        //     const memberExist = project.projectUsersEmailId.includes(memberEmailArr[i]);
        //     if (!memberExist) {
        //         return res.status(422).json({ error: "Member Not Found" });
        //     }
        // }
        project.costs.push({ name: name, description: description, amount: amount })
        await project.save()
        return res.status(201).json({ message: "Expense added Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

// REMOVE COST:--->
router.post('/removeCost', async (req, res) => {
    const { managerEmailID, projectID, costDocID } = req.body; //object destructuring
    if (!managerEmailID || !projectID || !costDocID) {
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const emailDomain = managerEmailID.substring(managerEmailID.indexOf('@') + 1);
        const project = await Project.findOne({ uniqueProjectId: projectID, emailDomain: emailDomain });
        // const taskID = String(taskDocI
        project.costs.pull(String(costDocID));
        await project.save();
        return res.status(201).json({ message: "Expense removed Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

//SHOW RESOURCES----->
router.get('/viewProjectResources/:projectID/:emailDomain', async (req, res) => {
    try {
        const uniqueProjectId = req.params.projectID;
        const emailDomain = req.params.emailDomain;
        //const {uniqueProjectId, emailDomain} = req.body;
        if (!uniqueProjectId || !emailDomain) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            const project = await Project.findOne({ emailDomain: emailDomain, uniqueProjectId: uniqueProjectId })
            const allResources = project.resources
            res.status(200).send(allResources);
        }
    }
    catch (err) {
        console.log(err);
    }
});

//ADD RESOURCE:---->
router.post('/addResource', async (req, res) => {
    //console.log(req.body);
    const { projectID, emailDomain, name, description, link } = req.body; //object destructuring

    if (!projectID || !emailDomain || !name || !description || !link) {
        //console.log(memberEmailIDs);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const project = await Project.findOne({ uniqueProjectId: projectID, emailDomain: emailDomain });
        const projectDoc_ID = project._id
        // project.tasks.push({name: taskName},)
        // await project.save();
        // for (var i = 0; i < memberEmailArr.length; i++) {
        //     const memberExist = project.projectUsersEmailId.includes(memberEmailArr[i]);
        //     if (!memberExist) {
        //         return res.status(422).json({ error: "Member Not Found" });
        //     }
        // }
        project.resources.push({ name: name, description: description, link: link })
        await project.save()
        return res.status(201).json({ message: "Resource added Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

//Remove Resource:--->
router.post('/removeResource', async (req, res) => {
    const { managerEmailID, projectID, resourceDocID } = req.body; //object destructuring
    if (!managerEmailID || !projectID || !resourceDocID) {
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        //console.log("Working");
        const emailDomain = managerEmailID.substring(managerEmailID.indexOf('@') + 1);
        const project = await Project.findOne({ uniqueProjectId: projectID, emailDomain: emailDomain });
        // const taskID = String(taskDocI
        project.resources.pull(String(resourceDocID));
        await project.save();
        return res.status(201).json({ message: "Resource removed Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

//SHOW CALENDAR EVENTS:---->
router.get('/viewProjectEvents/:projectID/:email', async (req, res) => {
    try {
        const uniqueProjectId = req.params.projectID;
        const Email = req.params.email; //PASS EMAIL ID IN PARAMETERS
        const emailDomain = Email.substring(Email.indexOf('@') + 1);
        var event = { title: "", date: Date, start: Date, end: Date };
        var events = [event];
        //const {uniqueProjectId, emailDomain} = req.body;
        if (!Email || !uniqueProjectId) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            const project = await Project.findOne({ emailDomain: emailDomain, uniqueProjectId: uniqueProjectId })
            if (project.projectUsersEmailId.includes(Email)) {
                //USER IS A DEVELOPER
                const allTasks = project.tasks;
                var tempEndDate = new Date(project.startDate).toISOString().split('T')[0];
                //tempEndDate.setDate(tempEndDate.getDate() + 1)
                //tempEndDate = tempEndDate.toISOString().split('T')[0];
                console.log(tempEndDate)
                var tempStartDate = new Date(project.expectedFinishDate).toISOString().split('T')[0];
                //tempStartDate.setDate(tempStartDate.getDate() + 1)
                events.push({ title: "Start Project", date: tempEndDate });
                events.push({ title: "Finish Project", date: tempStartDate });
                for (var i = 0; i < allTasks.length; i++) {

                    if (allTasks[i].assignedTo.includes(Email)) {
                        tempEndDate = new Date(allTasks[i].endDate).toISOString().split('T')[0];
                        tempStartDate = new Date(allTasks[i].startDate).toISOString().split('T')[0];
                        //events.push({ title: "Task: " + allTasks[i].name, start: tempStartDate, end: tempEndDate })
                        events.push({ title: "Start " + allTasks[i].name, date: tempStartDate })
                        events.push({ title: "Complete " + allTasks[i].name, date: tempEndDate })
                    }
                }
                const allMilestones = project.milestones
                for (var i = 0; i < allMilestones.length; i++) {
                    tempEndDate = new Date(allMilestones[i].expectedCompletionDate).toISOString().split('T')[0];
                    if (allMilestones[i].type == "Deliverable") {
                        events.push({ title: "Deliverable: " + allMilestones[i].name, date: tempEndDate });
                    } else {
                        events.push({ title: "Milestone: " + allMilestones[i].name, date: tempEndDate });
                    }
                }
                res.status(200).send(events);
            } else {
                //USER IS MANAGER
                const allTasks = project.tasks;
                var tempEndDate = new Date(project.startDate).toISOString().split('T')[0];
                var tempStartDate = new Date(project.expectedFinishDate).toISOString().split('T')[0];
                //var tempEndDate = 
                //tempEndDate.setDate(tempEndDate.getDate() + 1)
                //tempEndDate = tempEndDate.toISOString().split('T')[0];
                console.log(tempEndDate)
                //var tempStartDate = new Date(project.expectedFinishDate)
                // tempStartDate.setDate(tempStartDate.getDate() + 1)
                // tempStartDate = tempStartDate.toISOString().split('T')[0];
                events.push({ title: "Start Project", date: tempEndDate });
                events.push({ title: "Finish Project", date: tempStartDate });
                for (var i = 0; i < allTasks.length; i++) {
                    tempEndDate = new Date(allTasks[i].endDate).toISOString().split('T')[0];
                    tempStartDate = new Date(allTasks[i].startDate).toISOString().split('T')[0];
                    events.push({ title: "Start " + allTasks[i].name, date: tempStartDate })
                    events.push({ title: "Complete " + allTasks[i].name, date: tempEndDate })
                    //events.push({ title: "Task: " + allTasks[i].name, start: tempStartDate, end: tempEndDate })
                    //events.push({ title: "Complete " + allTasks[i].name, date: tempEndDate })
                }
                const allMilestones = project.milestones
                for (var i = 0; i < allMilestones.length; i++) {
                    tempEndDate = new Date(allMilestones[i].expectedCompletionDate).toISOString().split('T')[0];
                    if (allMilestones[i].type == "Deliverable") {
                        events.push({ title: "Deliverable: " + allMilestones[i].name, date: tempEndDate });
                    } else {
                        events.push({ title: "Milestone: " + allMilestones[i].name, date: tempEndDate });
                    }
                }
                res.status(200).send(events);
            }

        }

    }
    catch (err) {
        console.log(err);
    }
});

//SHOW PROFILE DETAILS:---->
router.get('/profileInfo/:email', async (req, res) => {
    try {
        const UserEmail = req.params.email;
        // const emailDomain = UserEmail.substring(UserEmail.indexOf('@') + 1);
        //const {uniqueProjectId, emailDomain} = req.body;
        if (!UserEmail) {
            return res.status(400).json({ error: "An Error occured while sending request!" })
        } else {
            User.findOne({ email: UserEmail }).then(Data => {
                res.status(200).send(Data);
            })
        }
    } catch (err) {
        console.log(err);
    }
});

//UPDATE USER PROFILE INFO:--->
router.post('/updateProfile', async (req, res) => {
    console.log(req.body);
    const { UserEmail, name, phone, password, cpassword, skills } = req.body; //object destructuring

    if (!UserEmail, !name, !phone, !skills) {
        console.log(memberEmailIDs);
        return res.status(422).json({ error: "An Error Occured while sending data!" });
    }
    try {

        if (password.trim().length > 0 && cpassword.trim() == password.trim()) {
            if (password != cpassword) {
                return res.status(422).json({ error: "Passwords don't match" });
            } else {
                newpassword = await bcrypt.hash(password, 12);
                newcpassword = await bcrypt.hash(cpassword, 12);
                await User.findOneAndUpdate({ email: UserEmail }, { email: UpdatedEmail, name: name, phone: phone, skills: skills, password: newpassword, cpassword: newcpassword });
                return res.status(201).json({ message: "Info along with password updated Successfully!" });
            }
        } else { //IF PASSWORD IS NOT UPDATED:---->
            await User.findOneAndUpdate({ email: UserEmail }, { name: name, phone: phone, skills: skills });

            return res.status(201).json({ message: "Info updated Successfully!" });
        }

    } catch (err) {
        console.log(err);
    }
});

//-----------------------------------CONVERSATIONS--------------------------------------
//NEW CONVERSATION:---->
router.post("/newConversation", async (req, res) => {
    // const suser = await User.findOne({ email: req.body.senderEmail });
    // const ruser = await User.findOne({ email: req.body.receiverEmail });
    const newConversation = new Conversation({
        members: [req.body.senderEmail, req.body.receiverEmail],
        projectID: req.body.projectID
        // memberNames: [suser.name, ruser.name]
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET CONVERATIONS OF A USER:--->
//THE GET METHOD RETURNS ALL THE CONVERSATIONS INCLUDING THE USER-EMAIL 
router.get("/getMyConversation/:userEmail/:projectID", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            projectID: req.params.projectID,
            members: { $in: [req.params.userEmail] }
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

//--------------------------------MESSAGES----------------------------------------------

//ADD
router.post("/sendMessage", async (req, res) => {
    const newMessage = new Message(req.body);
    const lastMessageConv = newMessage.text;
    const lastMessageSndr = newMessage.sender;
    await Conversation.findByIdAndUpdate(newMessage.conversationId, { lastMessage: lastMessageConv, lastMessageSender: lastMessageSndr });
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL MESSAGES INSIDE A CONVERSATION
router.get("/getMessages/:conversationId", async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});



//VIEW MEMBER Contacts:--> 
router.get('/viewContacts/:projectID/:email', async (req, res) => {
    try {
        const uniqueProjectId = req.params.projectID;
        const UserEmail = req.params.email;
        const emailDomain = UserEmail.substring(UserEmail.indexOf('@') + 1);
        //const {uniqueProjectId, emailDomain} = req.body;
        if (!emailDomain || !uniqueProjectId) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            var listContacts = [];
            const project = await Project.findOne({ emailDomain: emailDomain, uniqueProjectId: uniqueProjectId })
            numOfUsers = project.projectUsersEmailId.length
            if (project.managerEmailId != UserEmail) {
                const manager = await User.findOne({ email: project.managerEmailId });
                listContacts.push(manager);
            }
            for (var i = 0; i < numOfUsers; i++) {
                const user = await User.findOne({ email: project.projectUsersEmailId[i] });
                if (user != null && user.email != UserEmail) {
                    listContacts.push(user);
                }
                //console
            }
            //console.log(Project);
            //res.send(Data);
            //const Data = listOfUdsers
            //if(listOfUsers.length===numOfUsers){
            res.status(200).send(listContacts);

        }

        // const projectOverview = await Project.findOne({emailDomain: emailDomain, uniqueProjectId: uniqueProjectId});    

    } catch (err) {
        console.log(err);
    }
});

//GET CLICKED CHAT ID:--->
router.get("/getCurrentChatID/:userEmail/:memberEmail/:projectID", async (req, res) => {
    try {
        // const conversation = await Conversation.find({
        //     members: { $elemMatch: [req.params.userEmail, req.params.memberEmail] },
        // });
        if (req.params.memberEmail === "Group") {
            const conversation = await Conversation.find({
                "members": req.params.memberEmail, "projectID": req.params.projectID
            })
            // res.status(200).json(conversation);
            if (conversation.length === 0) {
                //console.log("yo yo")
                const newConversation = new Conversation({
                    members: "Group",
                    projectID: req.params.projectID
                });
                try {
                    const savedConversation = await newConversation.save();
                    res.status(200).json(savedConversation);
                } catch (err) {
                    res.status(500).json(err);
                }
            } else {
                res.status(200).json(conversation);
            }
        }
        else {
            const conversation = await Conversation.find({
                projectID: req.params.projectID,
                "$and": [
                    { "members": req.params.userEmail },
                    { "members": req.params.memberEmail },
                    { "members": { "$size": 2 } }
                ]
            })
            if (conversation.length === 0) {
                //console.log("yo yo")
                const newConversation = new Conversation({
                    members: [req.params.userEmail, req.params.memberEmail],
                    projectID: req.params.projectID
                });
                try {
                    const savedConversation = await newConversation.save();
                    res.status(200).json(savedConversation);
                } catch (err) {
                    res.status(500).json(err);
                }
            } else {
                res.status(200).json(conversation);
            }
        }
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});


module.exports = router;
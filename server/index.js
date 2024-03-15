const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const app = express()
const multer = require('multer');
const UserModel = require('./models/users')
//const University = require('./models/')
const Video = require('./models/video')
const Businessman = require('./models/Businessman')
const University = require('./models/universities');
const students = require('./models/users');
const AdModel = require('./models/ad');
const BillModel = require('./models/bill');
const fs = require('fs')
const cron = require('node-cron');
const path = require('path');
const { request } = require("http");

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/peerteach");




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Rename the file
    },
});

const storage_ad = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads_ad/'); // Uploads will be stored in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Rename the file
    },
});

const upload = multer({ storage: storage });
const upload_ad = multer({ storage: storage_ad });

app.post('/VideoUpload', upload.single('video'), async (req, res) => {
    try {
        // Create a new Video document with the uploaded data
        const video = new Video({
            title: req.body.title,
            college: req.body.college,
            course: req.body.course,
            branch: req.body.branch,
            semester: req.body.semester,
            subject: req.body.subject,
            email: req.body.email,
            name: req.body.name,
            batch: req.body.batch,
            otherDetails: req.body.otherDetails,
            videoPath: req.file.path, // Store the file path in the database
            notes: req.body.notes,
        });

        // Save the video document to the database
        await video.save();

        res.status(201).json({ message: 'Video uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading video' });
    }
});

app.post('/VideoFilter', async (req, res) => {
    try {
        const filter = {};

        // Define an array to hold filter conditions
        const filterConditions = [];

        if (req.body.title != null && req.body.title !== '') {
            filterConditions.push({ title: { $regex: new RegExp(req.body.title, 'i') } });
        }
        if (req.body.college != null && req.body.college !== '') {
            filterConditions.push({ college: { $regex: new RegExp(req.body.college, 'i') } });
        }
        if (req.body.course != null && req.body.course !== '') {
            filterConditions.push({ course: { $regex: new RegExp(req.body.course, 'i') } });
        }
        if (req.body.branch != null && req.body.branch !== '') {
            filterConditions.push({ branch: { $regex: new RegExp(req.body.branch, 'i') } });
        }
        if (req.body.semester != null && req.body.semester !== '') {
            filterConditions.push({ semester: req.body.semester });
        }
        if (req.body.subject != null && req.body.subject !== '') {
            filterConditions.push({ subject: { $regex: new RegExp(req.body.subject, 'i') } });
        }
        if (req.body.name != null && req.body.name !== '') {
            filterConditions.push({ name: { $regex: new RegExp(req.body.name, 'i') } });
        }
        if (req.body.email != null && req.body.email !== '') {
            filterConditions.push({ email: { $regex: new RegExp(req.body.email, 'i') } });
        }
        if (req.body.batch != null && req.body.batch !== '') {
            filterConditions.push({ batch: req.body.batch });
        }
        // Check if there are any filter conditions before using $and
        if (filterConditions.length > 0) {
            filter.$and = filterConditions;
        }

        console.log("printing filter");
        console.log(filter);
        console.log("printing req.body");
        console.log(req.body);

        // Use the filter to find matching videos
        const videos = await Video.find(filter, '_id title college course branch semester subject otherDetails videoPath name email likec dislikec liked disliked batch notes ad')
            .sort({ _id: -1 });

        console.log("Result");
        console.log(videos);
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error filtering videos' });
    }
});




app.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find({}, '_id title college course branch semester subject otherDetails videoPath name email notes likec dislikec liked disliked batch views_cnt ad').sort({ _id: -1 });
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching videos' });
    }
});

app.post('/likefind/:email', async (req, res) => {
    const userEmail = req.params.email;
    console.log("i am don");
    try {

        const videos = await Video.find({}, '_id title college course branch semester subject otherDetails videoPath name email notes likec dislikec liked disliked').sort({ _id: -1 });

        const likedVideos = videos.filter(video => video.liked.includes(userEmail));
        console.log("don video liked");
        console.log(likedVideos);
        // Send the filtered videos as a response
        res.json(likedVideos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching videos' });
    }
});

app.post('/historyfind/:email', async (req, res) => {
    const userEmail = req.params.email;
    console.log("i am don");
    try {

        const videos = await Video.find({}, '_id title college course branch semester subject otherDetails videoPath name email notes likec dislikec liked disliked views_cnt views').sort({ _id: -1 });
        //const existingView = videos.views.find(view => view.email === userEmail);
        //const HistoryVideos = videos.filter(video => video.views.email.includes(userEmail));
        const HistoryVideos = videos.filter(video => {
            return video.views.some(view => view.email === userEmail);
        });
        console.log("don video watch");
        //console.log();
        // Send the filtered videos as a response
        res.json(HistoryVideos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching videos' });
    }
});

app.post('/watchlaterfind/:email', async (req, res) => {
    const userEmail = req.params.email;
    console.log("i am don of watch later");
    try {
        // Find the user document based on the provided email
        const user = await UserModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the video IDs from the user's watch later list
        const watchLaterVideoIds = user.watch_later.map(item => item.vid);

        // Find videos whose IDs are in the watch later list
        const videos = await Video.find({ _id: { $in: watchLaterVideoIds } })
            .sort({ timestamp: -1 }) // Sort by timestamp in descending order
            .select('_id title college course branch semester subject otherDetails videoPath name email notes likec dislikec liked disliked views_cnt views');

        console.log("don video watch");

        // Send the filtered and sorted videos as a response
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching videos' });
    }
});


app.post('/dislikefind/:email', async (req, res) => {
    const userEmail = req.params.email;
    try {
        // Filter videos where the 'disliked' array contains the user's email
        const videos = await Video.find({}, '_id title college course branch semester subject otherDetails videoPath name email notes likec dislikec liked disliked').sort({ _id: -1 });
        const dislikedVideos = videos.filter(video => video.disliked.includes(userEmail));

        // Send the filtered videos as a response
        res.json(dislikedVideos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching videos' });
    }
});

app.get('/videos/:id', async (req, res) => {

    const videoId = req.params.id;
    console.log(videoId);
    // Fetch video information from the database based on the videoId
    const video = await Video.findById(videoId);
    if (video)
        console.log(video.title);
    if (!video) {
        return res.status(404).send('Video not found');
    }
    //const temp = toString(video.videoPath);
    // Construct the video file path
    //const videoPath = path.join(__dirname, 'uploads', video.videoPath);
    const videoPath1 = video.videoPath;
    // Check if the video file exists
    if (fs.existsSync(videoPath1)) {

        const stat = fs.statSync(videoPath1);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath1, { start, end });

            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            file.pipe(res);
            console.log("Hello1");
        } else {
            // If no range header is provided, send the entire video
            console.log("Hello2");
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(200, head);
            fs.createReadStream(videoPath1).pipe(res);
        }
    } else {
        // Video file not found
        res.status(404).send('Video not found');
    }
});



app.get('/adAppend/:id', async (req, res) => {

    const videoId = req.params.id;
    console.log(videoId);
    //Fetch video information from the database based on the videoId
    const video = await Video.findById(videoId);
    if (video)
        console.log(video.title);
    if (!video) {
        return res.status(404).send('Video not found');
    }
    //const temp = toString(video.videoPath);
    // Construct the video file path
    //const videoPath = path.join(__dirname, 'uploads', video.videoPath);
    const videoPath1 = video.ad.ad_path;
    // Check if the video file exists
    if (fs.existsSync(videoPath1)) {

        const stat = fs.statSync(videoPath1);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath1, { start, end });

            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            file.pipe(res);
            console.log("Hello1");
        } else {
            // If no range header is provided, send the entire video
            console.log("Hello2");
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(200, head);
            fs.createReadStream(videoPath1).pipe(res);
        }
    } else {
        // Video file not found
        res.status(404).send('Video not found');
    }
});




app.get('/generate-thumbnail/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const videoPath = 'path_to_your_video_directory/' + videoId + '.mp4'; // Adjust the video path

        // Generate a thumbnail image
        const thumbnailPath = 'path_to_your_thumbnail_directory/' + videoId + '.png'; // Adjust the thumbnail path
        await ffmpeg(videoPath)
            .screenshots({
                count: 1,
                folder: thumbnailPath,
                filename: 'thumbnail.png',
                size: '640x360', // Adjust the thumbnail size
            });

        // Send the generated thumbnail path as the response
        res.json({ thumbnailPath });
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        res.status(500).json({ message: 'Error generating thumbnail' });
    }
});

app.post('/register', (req, res) => {
    // Check if the email already exists in the database

    var c = 0;
    UserModel.findOne({ email: req.body.email })
        .then(users => {
            if (users) {
                c = 1;
                // If the email already exists, send a response indicating it's a duplicate
                res.json({ c });
            } else {
                c = 0;
                // If the email doesn't exist, create a new user and save it to the database
                UserModel.create(req.body)
                    .then(users => res.json({ users, c }))
                    .catch(err => res.json(err))

            }

        })
        .catch(err => {
            res.status(500).json({ message: 'An error occurred while checking for duplicate emails.' });
        });
});

app.post('/students', async (req, res) => {
    console.log("Hello from students");
    const { selclg } = req.body;
    const std = await students.find({}, '_id name email college course branch currentSem batchYear');
    const clgstd = std.filter(stdobj => stdobj.college === selclg);
    console.log(clgstd);
    res.json(clgstd);
})

app.post('/login', (req, res) => {
    console.log("Hello");
    const { email, password } = req.body;
    UserModel.findOne({ email: email }).then(
        async user => {
            if (user) {
                if (user.password === password) {

                    // Define an array to hold filter conditions
                    res.json({ mes: "Success", userData: user });
                }
                else {
                    res.json("Password is incorrect");
                }
            }
            else {
                res.json("User not existed");
            }
        }
    )
})

app.post('/UpdateDetails', async (req, res) => {
    const formData = req.body.formData;
    const userData = req.body.userData;
    console.log(formData);
    console.log(userData);

    const updatedUser = await UserModel.findByIdAndUpdate(userData._id, formData, { new: true });

    res.json(formData);
})

app.post('/seeVideos', async (req, res) => {
    const { name, email } = req.body;
    const filter = {};
    const filterConditions = [];
    // filterConditions.push({ name: name });
    filterConditions.push({ email: email });
    filter.$and = filterConditions;
    const videos = await Video.find(filter, '_id title college course branch semester subject otherDetails videoPath name email notes likec dislikec liked disliked')
        .sort({ _id: -1 });

    console.log(filter);
    console.log(videos);
    res.json(videos);

})

app.post('/colleges', async (req, res) => {
    try {
        const universities = await University.find({}, '_id name nickname pincode programs total_sems address');
        console.log("college here");
        res.json(universities);
    } catch (error) {
        console.error('Error fetching colleges:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/nearbycolleges', async (req, res) => {
    try {
        const userpin = req.body.userpin;
        console.log(userpin);
        const universities = await University.find({}, '_id name address nickname pincode programs total_sems');
        const nearbyuni = universities.filter(colobj => colobj.pincode === userpin);
        console.log("nearby colleges here");
        console.log(nearbyuni);
        res.json(nearbyuni);
    } catch (error) {
        console.error('Error fetching colleges:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




app.post('/deleteVideos', async (req, res) => {
    console.log("Hello i am manan");
    const { id, email } = req.body;
    console.log(email);
    const removedItem = await Video.findByIdAndRemove(id);
    const filter = {};
    const filterConditions = [];
    filterConditions.push({ email: email });
    filter.$and = filterConditions;
    const videos = await Video.find(filter, '_id title college course branch semester subject otherDetails videoPath name email')
        .sort({ _id: -1 });
    console.log(videos);
    res.json(videos);
})



app.post('/like/:videoId/:email', async (req, res) => {
    const videoId = req.params.videoId;
    const userEmail = req.params.email;
    console.log(userEmail);
    try {
        const video = await Video.findById(videoId);
        console.log("here in like");
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        if (video.disliked.includes(userEmail)) {
            video.disliked = video.disliked.filter(email => email !== userEmail);
        }
        if (video.liked.includes(userEmail)) {
            video.liked = video.liked.filter(email => email !== userEmail);
        }
        else if (!video.liked.includes(userEmail)) {
            console.log("pushing into liked");
            video.liked.push(userEmail);
            console.log(video.liked);
        }
        await video.save();
        video.likec = video.liked.length;
        video.dislikec = video.disliked.length;
        await video.save();

        return res.json({ video });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to like the video' });
    }
});


app.post('/watchLater/:videoId/:email', async (req, res) => {
    const videoId = req.params.videoId;
    const userEmail = req.params.email;
    console.log(userEmail);
    try {
        const user = await UserModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isVideoAlreadyAdded = user.watch_later.some(item => item.vid === videoId);

        if (isVideoAlreadyAdded) {
            console.log("already added error");
            return res.status(400).json({ error: 'Video already in watch later list' });
        }

        user.watch_later.push({ vid: videoId, timestamp: Date.now().toString() });

        await user.save();

        return res.json({ message: 'Video added to watch later list successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add video to watch later list' });
    }
});

app.post('/removewatchLater/:videoId/:email', async (req, res) => {
    const videoId = req.params.videoId;
    const userEmail = req.params.email;
    try {
        const user = await UserModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const index = user.watch_later.findIndex(item => item.vid === videoId);

        if (index === -1) {
            return res.status(400).json({ error: 'Video not found in watch later list' });
        }

        user.watch_later.splice(index, 1);

        await user.save();

        const remainingVideoIds = user.watch_later.map(item => item.vid);

        const remainingVideos = await Video.find({ _id: { $in: remainingVideoIds } })
            .select('_id title college course branch semester subject otherDetails videoPath name email notes likec dislikec liked disliked views_cnt views');

        return res.json(remainingVideos);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to remove video from watch later list' });
    }
});



app.post('/dislike/:videoId/:email', async (req, res) => {
    const videoId = req.params.videoId;
    const userEmail = req.params.email;

    try {
        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        if (video.liked.includes(userEmail)) {
            video.liked = video.liked.filter(email => email !== userEmail);
        }

        if (video.disliked.includes(userEmail)) {
            video.disliked = video.disliked.filter(email => email !== userEmail);
        }

        else if (!video.disliked.includes(userEmail)) {
            video.disliked.push(userEmail);
        }

        await video.save();
        video.likec = video.liked.length;
        video.dislikec = video.disliked.length;
        await video.save();

        return res.json({ video });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to like the video' });
    }
});

app.post('/countViews', async (req, res) => {
    const { email, fingerprint, arg } = req.body;
    let total_views;
   
    if (email) {
        Video.findById(arg).then(video => {
            if (video) {
                const existingView = video.views.find(view => view.email === email);
                if (!existingView) {
                    video.views.push({ email: email, fingerprint: fingerprint });
                    video.views_cnt += 1;
                    video.save();
                    total_views = video.views.length;
                    
                    return res.json({ video });
                }
                else {
                    
                    return res.json({ video });
                }
            }
        });
    }
    else {
        Video.findById(arg).then(video => {
            if (video) {
                const existingView = video.views.find(view => view.fingerprint === fingerprint && view.email === email);
                if (!existingView) {
                    video.views.push({ email: email, fingerprint: fingerprint });
                    video.views_cnt += 1;
                    video.save();
                    total_views = video.views.length;
                    
                    return res.json({ video });
                }
                else {
                    
                    return res.json({ video });
                }
            }
        })

    }
})

app.post('/busiregister', (req, res) => {
    // Check if the email already exists in the database

    var c = 0;
    Businessman.findOne({ email: req.body.email })
        .then(users => {
            if (users) {
                c = 1;
                // If the email already exists, send a response indicating it's a duplicate
                res.json({ c });
            } else {
                c = 0;
                // If the email doesn't exist, create a new user and save it to the database
                Businessman.create(req.body)
                    .then(users => res.json({ users, c }))
                    .catch(err => res.json(err))
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'An error occurred while checking for duplicate emails.' });
        });
});

app.post('/busilogin', (req, res) => {
    console.log("Hello");
    const { email, password } = req.body;
    Businessman.findOne({ email: email }).then(
        async user => {
            if (user) {
                if (user.password === password) {

                    // Define an array to hold filter conditions
                    res.json({ mes: "Success", userData: user });
                }
                else {
                    res.json("Password is incorrect");
                }
            }
            else {
                res.json("User not existed");
            }
        }
    )
});

app.post('/createBill', async (req, res) => {
    console.log("in add bill");
    const formData = req.body.formData;
    let count = 0;
    let price = 0;

    const college = await University.findOne({ name: formData.college_name });
    console.log("college object in create bill");
    console.log(college);
    for (const program of college.programs) {
        //console.log(program.branches);
        count = count + (program.total_sems * program.branches.length);
    }
    price = (count * parseInt(formData.slots)) * 20;

    if (parseInt(formData.users) > 5000 && parseInt(formData.users) <= 10000) {
        price = price + (parseInt(formData.users) * 0.10);
    }
    else if (parseInt(formData.users) > 10000 && parseInt(formData.users) <= 20000) {
        price = price + (parseInt(formData.users) * 0.20);
    }
    else if (parseInt(formData.users) > 20000 && parseInt(formData.users) <= 40000) {
        price = price + (parseInt(formData.users) * 0.30);
    }
    console.log("returning from create bill");
    console.log(price);
    console.log("current date");
    console.log(formData.purchase_date);
    return res.json(price)
})


app.post('/addBill', upload_ad.single('ad'), async (req, res) => {
    console.log("in proceed bill");
    console.log("req checking");
    console.log(req.file);
    let temp_date;
    try {
        const college = await University.findOne({ name: req.body.college_name });

        if (!college) {
            return res.status(404).json({ error: "College not found" });
        }

        if (college.businessman_queue.length === 0) {
            console.log("in queue null");
            const alotted_date = req.body.purchase_date;
            console.log("allot date");
            console.log(alotted_date);
            const nextDay = new Date(alotted_date);
            nextDay.setDate(nextDay.getDate() + 1);
            console.log("next of allot date");
            console.log(nextDay);
            temp_date = nextDay;
            college.businessman_queue.push({ busi_email: req.body.busi_email, alotted_date: nextDay });
            console.log("college object for queue");
            console.log(college);
            await college.save();
        } else {
            const lastEntry = college.businessman_queue[college.businessman_queue.length - 1];
            const lastDate = lastEntry.alotted_date;
            const nextDay = new Date(lastDate);
            nextDay.setDate(nextDay.getDate() + 1);
            temp_date = nextDay;
            college.businessman_queue.push({ busi_email: req.body.busi_email, alotted_date: nextDay });
            await college.save();
        }

        const final_date = new Date(temp_date);

        // Create a new bill entry
        const newBill = new BillModel({
            busi_name: req.body.busi_name,
            slots: req.body.slots,
            adPath: req.file.path,
            secs: req.body.secs,
            purchaseDate: req.body.purchase_date,
            AllotDate: final_date,
            Businessman_email: req.body.busi_email,
            purchasePrice: req.body.bill_amount,
            college_name: req.body.college_name,
            no_of_users: req.body.college_users,
        });



        // Save the new bill entry to the database
        await newBill.save();

        return res.json(final_date);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/findAdVideos', async (req, res) => {
    const { selectedCollege, slclStudents, email, slots } = req.body;

    const students = await UserModel.find({
        college: selectedCollege.name
    })

    console.log(students);

    const total_videos = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    let even = 2;
    let odd = 1;
    for (const program of selectedCollege.programs) {
        for (const branch of program.branches) {
            for (let sem = 0; sem < program.totalsems / 2; sem++) {
                // getMonth() returns a zero-based index, so we add 1 to get the current month
                // console.log("Current month:", currentMonth);

                if (currentMonth > 6) {
                    const students = await UserModel.find({
                        branch: branch,
                        currentSem: odd,
                        course: program.course,
                    })
                    let max_avg = 0, sec_max = 0;
                    let email1, email2;
                    for (const student of students) {
                        let vc = 0;
                        const videos = await Video.find({
                            email: student.email,
                        })
                        let ln = videos.length;
                        for (const video of videos) {
                            vc += video.views_cnt;
                        }

                        vc = vc / ln;
                        if (max_avg < vc) {
                            sec_max = max_avg;
                            max_avg = vc;
                            email2 = email1;
                            email1 = student.email;
                        }
                        else {
                            if (sec_max < vc) {
                                sec_max = vc;
                                email2 = student.email;
                            }
                        }
                    }

                    const decvideos1 = await Video.find({
                        email: email1
                    }).sort({ _id: -1 });


                    const decvideos2 = await Video.find({
                        email: email2
                    }).sort({ _id: -1 });

                    for (let i = 0; i < slots; i++) {
                        if (i < decvideos1.length) {
                            total_videos.push(decvideos1[i]);
                        }
                        if (i < decvideos2.length) {
                            total_videos.push(decvideos2[i]);
                        }
                    }

                    odd += 2;
                }
                else {
                    const students = await UserModel.find({
                        branch: branch,
                        currentSem: even,
                        course: program.course,
                    })
                    let max_avg = 0, sec_max = 0;
                    let email1, email2;
                    for (const student of students) {
                        let vc = 0;
                        const videos = await Video.find({
                            email: student.email,
                        })
                        let ln = videos.length;
                        for (const video of videos) {
                            vc += video.views_cnt;
                        }

                        vc = vc / ln;
                        if (max_avg < vc) {
                            sec_max = max_avg;
                            max_avg = vc;
                            email2 = email1;
                            email1 = student.email;
                        }
                        else {
                            if (sec_max < vc) {
                                sec_max = vc;
                                email2 = student.email;
                            }
                        }
                    }

                    const decvideos1 = await Video.find({
                        email: email1
                    }).sort({ _id: -1 });

                    const decvideos2 = await Video.find({
                        email: email2
                    }).sort({ _id: -1 });

                    for (let i = 0; i < slots; i++) {
                        if (i < decvideos1.length) {
                            total_videos.push(decvideos1[i]);
                        }
                        if (i < decvideos2.length) {
                            total_videos.push(decvideos2[i]);
                        }
                    }

                    even += 2;
                }

            }
        }
    }

    const bill = await BillModel.findOne({
        Businessman_email: email,
        run_flag: 0,
    });

    for (const video of total_videos) {
        video.ad_id = null;
        video.ad_id = bill._id;

    }
    return res.json({
        message: "from findAdVideos",
        clgname: selectedCollege.name,
    })
});



async function findAdVideos(bill, uni) {
    console.log('Executing myFunction at a specific time... ' + bill);

    const students = await UserModel.find({
        college: bill.college_name
    })

    console.log(students);

    const total_videos = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    //console.log("current month");
    console.log(currentMonth);

    //const selectedCollege = await University.find({});
    console.log('going into 3 loop in findadvideos');
    for (let program of uni.programs) {
        console.log("bingo progrma", program);
        const course = program.course;

        for (const branch of program.branches) {
            console.log("bingo branch", branch);
            let sem = 0;
            let even = 2;
            let odd = 1;
            const prg = program;
            for (sem = 0; sem < (program.total_sems / 2); sem++) {
                // getMonth() returns a zero-based index, so we add 1 to get the current month
                console.log("bingo sem" + sem);
                console.log("bingo branch check" + branch);
                if (currentMonth > 6) {

                    const students = await UserModel.find({
                        branch: branch,
                        currentSem: odd,
                        course: program.course
                    })
                    let max_avg = 0, sec_max = 0;
                    let email1, email2;
                    for (const student of students) {
                        let vc = 0;
                        const videos = await Video.find({
                            email: student.email,
                        })
                        let ln = videos.length;
                        for (const video of videos) {
                            vc += video.views_cnt;
                        }

                        vc = vc / ln;
                        if (max_avg < vc) {
                            sec_max = max_avg;
                            max_avg = vc;
                            email2 = email1;
                            email1 = student.email;
                        }
                        else {
                            if (sec_max < vc) {
                                sec_max = vc;
                                email2 = student.email;
                            }
                        }
                    }

                    const decvideos1 = await Video.find({
                        email: email1,
                        semester: { $mod: [2, 1] }
                    }).sort({ _id: -1 });

                    console.log(email1);
                    const decvideos2 = await Video.find({
                        email: email2,
                        semester: { $mod: [2, 1] }
                    }).sort({ _id: -1 });
                    console.log(email2);

                    for (let i = 0; i < slots; i++) {
                        if (i < decvideos1.length) {
                            total_videos.push(decvideos1[i]);
                        }
                        if (i < decvideos2.length) {
                            total_videos.push(decvideos2[i]);
                        }
                    }

                    odd += 2;
                }
                else {
                    console.log("in even sem")
                    console.log(even);
                    console.log("details of students find");
                    console.log(branch, even, program.course);
                    const students = await UserModel.find({
                        branch: branch,
                        currentSem: even,
                        course: program.course,
                    });
                    console.log(students);
                    let max_avg = 0, sec_max = 0;
                    let email1, email2;
                    for (const student of students) {
                        let vc = 0;
                        const videos = await Video.find({
                            email: student.email,
                        })
                        let ln = videos.length;
                        for (const video of videos) {
                            vc += video.views_cnt;
                        }

                        vc = vc / ln;
                        if (max_avg < vc) {
                            sec_max = max_avg;
                            max_avg = vc;
                            email2 = email1;
                            email1 = student.email;
                        }
                        else {
                            if (sec_max < vc) {
                                sec_max = vc;
                                email2 = student.email;
                            }
                        }
                    }

                    const decvideos1 = await Video.find({
                        email: email1,
                        semester: { $mod: [2, 0] }
                    }).sort({ _id: -1 });
                    console.log(email1);

                    const decvideos2 = await Video.find({
                        email: email2,
                        semester: { $mod: [2, 0] }
                    }).sort({ _id: -1 });
                    console.log(email2);
                    console.log("before bill slots " + bill.slots);
                    for (let i = 0; i < bill.slots; i++) {
                        console.log("in bill slots " + i);
                        if (i < decvideos1.length) {
                            total_videos.push(decvideos1[i]);
                        }
                        if (i < decvideos2.length) {
                            total_videos.push(decvideos2[i]);
                        }
                    }

                    even += 2;
                }

            }
        }
    }
    console.log('total videos');
    console.log(total_videos);
    let upbill = await BillModel.findOne({ _id: bill._id });
    for (const video of total_videos) {
        // video.bill_id = null;
        video.ad.bill_id = bill._id;
        video.ad.ad_path = bill.adPath;
        upbill.video_ids.push(video._id);
        await video.save();
    }
    await upbill.save();
    console.log('done from findadvideos');
}

cron.schedule('*/10 * * * * *', async () => {
    console.log("hello from cron");
    const universities = await University.find();
    const videos = await Video.find({});
    // for(let video of videos)
    // {
    //     if(video.ad)
    //     {
    //         video.ad = null;
    //         await video.save();
    //     }
    // }
    const currentDate = new Date().toDateString();
    const cDate = new Date();

    for (const uni of universities) {
        if (uni.businessman_queue.length != 0) {
            console.log("hello from cron con1");
            if (uni.businessman_queue[0].alotted_date.toDateString() < currentDate) {
                console.log("hello from cron con2");
                uni.businessman_queue.shift();
            }
            if (uni.businessman_queue.length != 0 && uni.businessman_queue[0].alotted_date.toDateString() === currentDate) {
                console.log("hello from cron con3");
                console.log(uni.businessman_queue[0].alotted_date.toDateString(), currentDate);
                const bill = await BillModel.find({ Businessman_email: uni.businessman_queue[0].busi_email, run_flag: false });
                for (b of bill) {
                    if (b.AllotDate.toDateString() === currentDate) {
                        if(b.video_ids.length == 0 )
                        {
                            console.log(b);
                            findAdVideos(b, uni);
                            break;
                        }
                    }
                }


            }
        }
    }
});


// Method to serve the ad
app.get('/videos/:id/ad', async (req, res) => {
    console.log("hello from ad");
	const videoId = req.params.id;
	// Fetch video information from the database based on the videoId
	const video = await Video.findById(videoId);
	if (!video || !video.ad.ad_path || !fs.existsSync(video.ad.ad_path)) {
    	return res.status(404).send('Ad not found');
	}

	// Serve the ad with appropriate headers
	const adStat = fs.statSync(video.ad.ad_path);
	const adSize = adStat.size;
	res.writeHead(200, {
    	'Content-Length': adSize,
    	'Content-Type': getContentType(video.ad.ad_path)
	});
	const adStream = fs.createReadStream(video.ad.ad_path);
	adStream.pipe(res);
});

// Method to serve the main video


function getContentType(filePath) {
	const ext = path.extname(filePath).toLowerCase();
	switch (ext) {
    	case '.mp4':
        	return 'video/mp4';
    	case '.jpg':
    	case '.jpeg':
        	return 'image/jpeg';
    	case '.png':
        	return 'image/png';
    	case '.gif':
        	return 'image/gif';
    	default:
        	return 'application/octet-stream'; // Default content type
	}
}



// Schedule myFunction to run at 12:00 AM every day



app.listen(3001, () => {
    console.log("server is running")
})


/*
<button
                        onClick={handleSubmit}
                        type="button"
                        style={{
                            background: 'linear-gradient(to bottom right, #ff4d4d, #007bff)',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            marginTop: '8%',
                            cursor: 'pointer',
                            position: 'fixed',
                            marginLeft: '50px',
                        }}
                    >
                        Add Video
                    </button>
*/
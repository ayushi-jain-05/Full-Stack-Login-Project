const path = require('path');
const express = require("express");

const User =require
const app = express();
app.post('/profile-pic', upload.single('profilePic'), async (req, res) => {
	try {
		const profilePic = {
			filename: req.file.filename,
			mimetype: req.file.mimetype,
			size: req.file.size,
			image: path.join(__dirname, req.file.path),
			user_id: req.user.id 
		};

		// Return the URL of the updated image
		const imageUrl = `http://localhost:${PORT}/public/images/profiles/${req.file.filename}`;
		res.json({ imageUrl });
	} catch (error) {
		console.error(error);
		res.status(500).send('An error occurred while updating your profile picture.');
	}
});

app.post("/userdata", async (req, res) => {
	const body = req.body
	let newUser = {
		id: body.id,
		name: body.name,
		firstName: body.given_name,
		lastName: body.family_name,
		Mobile: body.mobileNumber,
		Gender: body.gender,
		DateofBirth: body.dob,
		google_image: body.picture,
		loginTime: body.loginTime,
		aboutme: body.aboutme,
		email: body.email
	}
	await User.updateOne(
		{ email: newUser.email },
		{
			$set: newUser
		}, {
		upsert: true
	}
	);
	return res.json(newUser)
})

app.patch("/editprofile/:email", upload.single('profileImage'), async (req, res) => {
	try {
		const body = req.body;
		let user = await User.findOne({ email: req.params.email });
		if (!user) {
			return res.status(404).send({ msg: 'User not found' });
		}
		let newUser = {
			id: body.id,
			name: body.name,
			firstName: body.firstName,
			lastName: body.lastName,
			Mobile: body.Mobile,
			Gender: body.Gender,
			DateofBirth: body.DateofBirth,
			aboutme: body.aboutme,
		};
		if(req.file){
			const imagePath = path.join(__dirname, 'public/images/profiles', req.file.filename);
			newUser={
				...newUser,
				image: imagePath 
			}
		}
		user = await User.updateOne({ email: req.params.email }, { $set: newUser });
		return res.status(200).send("Successfully Updated");
	} catch (err) {
		console.error(err);
		return res.status(500).send({ msg: 'Internal Server Error' });
	}
});

app.get('/fetchdata/:email', async (req, res) => {
	const user = await User.findOne({ email: req.params.email });
	res.json(user);
})

app.get("/getuser", async (req, res) => {
	let { email } = req.query;
	const user = await User.findOne({ email });
	return res.json(user);
})
app.get('/fetchsearchdata/:key', async (req,res)=>{
	try{
		const key = req.params.key;
	const regexKey = new RegExp(key, "i");
	const searchCriteria =
	 {
		"$or": [
		{"firstName": {$regex: regexKey}},
		{"lastName": {$regex: regexKey}},
		{"email": {$regex: regexKey}},
		{"Mobile": {$regex: regexKey}},
		]
	}
		const user = await User.find(searchCriteria).sort("firstName");
		const totalResults = user.length;
		res.json({user,totalResults});
	}catch(error){
		res.status(500).send(error);
	}
})

app.get('/fetchdata', async (req, res) => {
	const totalResults = await User.countDocuments();
	const user = await User.find();
	return res.json({ user, totalResults });
})

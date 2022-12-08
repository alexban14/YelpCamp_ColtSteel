const bcrypt = require('bcrypt');

// const hashPassword = async (pw) => {
// 	const salt = await bcrypt.genSalt(10);
// 	const hash = await bcrypt.hash(pw, salt);
// 	console.log(hash);
// }

const hashPassword = async (pw) => {
	// this also provides us with a salt but we dont store it somewhere
	const hash = await bcrypt.hash(pw, 10);
	console.log(hash);
}


const login = async (pw, hashedPassword) => {
	const result = await bcrypt.compare(pw, hashedPassword);
	if(result) {
		console.log("LOGGED IN! SUCCESSFUL MATCH!");
	} else {
		console.log("INCORRECT!");
	}
}

// hashPassword("monkey");
login('monkey', '$2b$10$6huKIW1NGbU8zpq4cU3kSOx2gGLSTieSVCruCvi6CJfO7RF0zBuwq')
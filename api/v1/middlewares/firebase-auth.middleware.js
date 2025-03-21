import admin from "../../../config/firebase-admin.js";
import User from "../models/user.model.js";

const firebaseAuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {

      let username = email ? email.split("@")[0] : `user_${uid}`;
      let existingUser = await User.findOne({ username });
      if (existingUser) {
        let counter = 1;
        while (await User.findOne({ username: `${username}${counter}` })) {
          counter++;
        }
        username = `${username}${counter}`;
      }

      user = new User({
        firebaseUID: uid,
        username,
        email,
        name,
        avatar: picture,
      });

      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    res.status(401).json({ message: "Invalid Firebase token" });
  }
};

export default firebaseAuthMiddleware;
